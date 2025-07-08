'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import UserApi from '@/actions/userApi'
import AlbumApi from '@/actions/albumApi'
import AlbumCard from '@/components/album/AlbumItem'

export default function UserAlbumsPage({ params }: { params: { id: string } }) {

    const LIMIT = 8
    const [albums, setAlbums] = useState<any[]>([])
    const [user, setUser] = useState<any>()
    const [offset, setOffset] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const isFetchingRef = useRef(false)
    const loaderRef = useRef<HTMLDivElement | null>(null)

    // 1. Сначала получаем данные пользователя (этот хук без изменений)
    useEffect(() => {
        async function fetchUser() {
            try {
                const userData = await UserApi.getUser({ id: params.id });
                setUser(userData);
            } catch (error) {
                console.error("Failed to fetch user:", error)
            }
        }
        if (params.id) {
            fetchUser();
        }
    }, [params.id]);

    // 2. Функция загрузки альбомов (этот хук тоже почти без изменений)
    const loadMoreAlbums = useCallback(async () => {
        // Добавлена проверка на !user, чтобы избежать вызова без данных
        if (isFetchingRef.current || !hasMore || !user?.Artist?.id) return

        isFetchingRef.current = true
        setIsLoading(true)

        try {
            const newAlbums = await AlbumApi.searchAlbums({
                artistId: user.Artist.id, // Теперь мы уверены, что user.Artist.id существует
                limit: LIMIT,
                offset: offset,
            }).then(res => res.data);

            if (newAlbums && newAlbums.length > 0) {
                setAlbums(prevAlbums => [...prevAlbums, ...newAlbums]);
                setOffset(prev => prev + newAlbums.length);
                setHasMore(newAlbums.length === LIMIT);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error('Error loading albums:', err);
        } finally {
            isFetchingRef.current = false;
            setIsLoading(false);
        }
    }, [user, offset, hasMore]); // Убрана лишняя зависимость от params.id


    // 3. ✨ ИСПРАВЛЕНО: Запускаем первую загрузку альбомов только ПОСЛЕ получения user
    useEffect(() => {
        // Этот код сработает, как только `user` будет установлен,
        // и запустит самую первую загрузку данных.
        if (user?.Artist?.id) {
            loadMoreAlbums();
        }
    }, [user, loadMoreAlbums]); // Зависит от user и функции загрузки


    // 4. Настройка IntersectionObserver для последующих загрузок (без изменений)
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadMoreAlbums();
                }
            },
            { rootMargin: '400px' }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [loadMoreAlbums, hasMore, isLoading]);

    const showSkeleton = isLoading && albums.length === 0;

    return (
        <div>
            <h1 className='text-3xl font-bold mb-20'>
                Albums by <span className='text-mainOrange'>{user?.username || '...'}</span>
            </h1>
            <div>
                {showSkeleton ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-neutral-800 rounded-lg aspect-square animate-pulse" />
                        ))}
                    </div>
                ) : albums.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {albums.map((album: any) => (
                            <AlbumCard key={album.id} album={album} />
                        ))}
                    </div>
                ) : (
                    !isLoading && (
                        <div className="text-center text-gray-500 py-8">
                            This user has no albums yet.
                        </div>
                    )
                )}

                <div ref={loaderRef} />

                {isLoading && albums.length > 0 && (
                    <div className="text-center py-4 text-sm text-gray-500">
                        Loading more…
                    </div>
                )}

                {!hasMore && albums.length > 0 && (
                    <div className="text-center py-4 text-sm text-gray-400">
                        You've reached the end!
                    </div>
                )}
            </div>
        </div>
    )
}