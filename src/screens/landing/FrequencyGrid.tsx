'use client';

import { useEffect, useRef } from 'react';

const CELL = 15;
const GAP = 2;
const SQUARE = CELL - GAP;
const BPM = 84;
const TIME_SCALE = 0.5;
const MAX_HEIGHT_SHARE = 1;
const SPARKS_PER_SECOND = 9;
const MAX_SPARKS = 80;

interface Column {
  level: number;
  energy: number;
  channel: number;
  frequency: number;
  seed: number;
}

interface Spark {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  age: number;
  life: number;
  hue: number;
}

function targetLevel(column: Column, realTime: number): number {
  const { frequency, channel, seed } = column;
  const time = realTime * TIME_SCALE;
  const shape = 0.32 + 0.38 * Math.pow(1 - frequency, 0.9);
  const drift =
    0.2 * Math.sin(frequency * 7 - time * 0.9 + channel * 2.1) +
    0.14 * Math.sin(frequency * 13 + time * 0.6 + channel * 4.2);
  const motion =
    0.5 +
    drift +
    0.18 * Math.sin(time * (1.7 + frequency * 4) + seed) +
    0.12 * Math.sin(time * (3.1 + frequency * 6) + seed * 2.3 + channel) +
    0.08 * Math.sin(time * 5.3 + frequency * 20 + channel * 1.7);
  const beatPhase = (realTime * BPM) / 60;
  const beat =
    Math.pow(Math.max(0, Math.cos(beatPhase * Math.PI * 2)), 10) *
    (1 - frequency * 0.6) *
    0.25;
  return Math.min(1, Math.max(0, shape * motion + beat));
}

function cellColor(level: number, energy: number, share: number): string {
  const hue = 12 + level * 18 + share * 4 + energy * 4;
  const saturation = 88 + level * 12;
  const lightness = 44 + level * 12 + share * 6 + energy * 8;
  const alpha = (0.72 - share * 0.45) * (0.6 + level * 0.4);
  return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
}

function createColumns(count: number): Column[] {
  const half = count / 2;
  return Array.from({ length: count }, (_, index) => {
    const fromCenter = Math.abs(index + 0.5 - half) / half;
    return {
      level: 0,
      energy: 0,
      channel: index < half ? 0 : 1,
      frequency: Math.min(1, fromCenter),
      seed: Math.sin(index * 12.9898) * 43758.5453,
    };
  });
}

export function FrequencyGrid({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const background = document.createElement('canvas');
    let columns: Column[] = [];
    let sparks: Spark[] = [];
    let rows = 0;
    let frame = 0;
    let lastTime = 0;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const columnCount = Math.ceil(width / CELL);
      rows = Math.ceil(height / CELL);
      columns = createColumns(columnCount);
      sparks = [];

      background.width = canvas.width;
      background.height = canvas.height;
      const backgroundContext = background.getContext('2d');
      if (!backgroundContext) return;
      backgroundContext.setTransform(ratio, 0, 0, ratio, 0, 0);
      backgroundContext.fillStyle = 'rgba(255, 140, 58, 0.05)';
      for (let x = 0; x < columnCount; x++) {
        for (let y = 0; y < rows; y++) {
          backgroundContext.fillRect(x * CELL, y * CELL, SQUARE, SQUARE);
        }
      }
    };

    const spawnSpark = (x: number, top: number, column: Column) => {
      if (sparks.length >= MAX_SPARKS) return;
      sparks.push({
        x,
        y: top,
        speedX: (Math.random() - 0.5) * 3,
        speedY: -(5 + Math.random() * 9 + column.energy * 8),
        age: 0,
        life: 0.8 + Math.random() * 1.4,
        hue: 14 + Math.random() * 14,
      });
    };

    const drawSparks = (delta: number) => {
      sparks = sparks.filter((spark) => {
        spark.age += delta;
        spark.x += spark.speedX * delta;
        spark.y += spark.speedY * delta;
        spark.speedX += (Math.random() - 0.5) * 6 * delta;
        spark.speedY *= 1 - 0.6 * delta;
        if (spark.age >= spark.life || spark.y < 0) return false;

        const fade = 1 - spark.age / spark.life;
        const alpha = fade * (0.55 + Math.random() * 0.3);
        context.fillStyle = `hsla(${spark.hue}, 100%, 58%, ${alpha})`;
        context.fillRect(
          Math.round(spark.x) * CELL,
          Math.round(spark.y) * CELL,
          SQUARE,
          SQUARE
        );
        return true;
      });
    };

    const draw = (time: number) => {
      const seconds = time / 1000;
      const delta = Math.min(0.1, lastTime ? seconds - lastTime : 0.016);
      lastTime = seconds;

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(background, 0, 0);
      const ratio = window.devicePixelRatio || 1;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const bottom = rows - 1;
      const maxHeight = Math.max(1, Math.floor(rows * MAX_HEIGHT_SHARE));
      const sparkChance = (SPARKS_PER_SECOND * delta) / columns.length;

      columns.forEach((column, x) => {
        const target = targetLevel(column, seconds);
        const speed = target > column.level ? 6 : 2;
        const rise = Math.min(1, Math.max(0, target - column.level) * 6);
        column.level += (target - column.level) * Math.min(1, speed * delta);
        column.energy += (rise - column.energy) * Math.min(1, 4 * delta);

        const height = Math.round(column.level * maxHeight);
        for (let step = 0; step <= height; step++) {
          const share = height === 0 ? 0 : step / height;
          context.fillStyle = cellColor(column.level, column.energy, share);
          context.fillRect(x * CELL, (bottom - step) * CELL, SQUARE, SQUARE);
        }

        const chance = sparkChance * (0.4 + column.level + column.energy * 3);
        if (!reduceMotion && height > 0 && Math.random() < chance) {
          spawnSpark(x, bottom - height - 1, column);
        }
      });

      drawSparks(delta);

      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };

    const drawStill = () => {
      columns.forEach((column) => {
        column.level = targetLevel(column, 1.3);
      });
      lastTime = 1.3;
      draw(1300);
    };

    const handleResize = () => {
      resize();
      if (reduceMotion) drawStill();
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    observer.observe(canvas);

    if (!reduceMotion) frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`block h-full w-full ${className ?? ''}`}
    />
  );
}
