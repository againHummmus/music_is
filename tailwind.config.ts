import type { Config } from "tailwindcss";

const config: Config = {
  mode: "jit",
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./components/**/*.{js,ts,jsx,tsx,html,css,scss}",
    "./src/**/*.{js,ts,jsx,tsx,html,css,scss}",
  ],
  theme: {
    container: {
      screens: {
        max: "1280px",
      },
      center: true,
    },
    extend: {
      screens: {
        "350px": "350px",
        "400px": "400px",
        "500px": "500px",
        tablet: "680px",
        main: "800px",
        "900px": "900px",
        "980px": "980px",
        laptop: "1024px",
        "1124px": "1124px",
        "1140px": "1140px",
        desktop: "1280px",
      },
      maxWidth: {
        "main-width": "67.5rem",
        "1/2": "50%",
        "1/3": "33.33%",
        "1/4": "25%",
        "3/4": "75%",
      },
      minWidth: {
        320: "320px",
      },
      colors: {
        //main
        mainWhite: "#f5f4f2",
        mainDark: "#2F313A",
        secondaryOrange: "#FF7A1B",
        darkStormy: "#8D90A3",
        lightStormy: "#D0D4E5",
        placeholderOrange: "#FF7948/60",
        mainBlack: "#282727",
        mainOrange: "#FF8C3A",
        badRed: "#f56e62",
        middleYellow: "#f7c44d",
        goodGreen: "#9ec470",
        //funny
        funnyRed: "#FFA494", 
        funnyBlue: "#A5C8F5", 
        funnyYellow: "#FFDC73", 
        funnyPurple: "#E1C3F3",
        funnyGreen: "#B5E3BA",
      },
      fontSize: {
        h1: ["2rem", "2.4rem"],
        h2: ["1.5rem", "1.8rem"],
        h3: ["1.25rem", "1.5rem"],
        h4: ["1rem", "1.2rem"],
        "10xl": "0.625rem", // 10px
        xs: "0.75rem", // 12px
        "13xl": "0.8125rem", // 13px
        sm: "0.875rem", // 14px
        "15xl": "0.9375rem", // 15px
        base: "1rem", // 16px
        lg: "1.125rem", // 18px
        xl: "1.25rem", // 20px
        "2xl": "1.5rem", // 24px
        "3xl": "1.875rem", // 30px
        "32xl": "2rem", // 32px
        "4xl": "2.25rem", // 36px
        "64xl": "4rem", // 64px
      },
      lineHeight: {
        1.2: "1.2",
      },
      fontFamily: {
        golos: ["var(--font-golos)"],
      },
      spacing: {
        5: "0.3125rem",
        10: "0.625rem",
        15: "0.9375rem",
        20: "1.25rem",
        25: "1.5625rem",
        30: "1.875rem",
        35: "2.1875rem",
        40: "2.5rem",
        50: "3.125rem",
        60: "3.75rem",
        70: "4.375rem",
        80: "5rem",
        90: "5.625rem",
        100: "6.25rem",
      },
      borderRadius: {
        md: "0.3125rem",
        "10px": "0.625rem",
        "15px": "0.9375rem",
        "20px": "1.25rem",
      },
      zIndex: {
        "-1": "-1",
        1: "1",
      },
    },
  },
  plugins: [],
};
export default config;
