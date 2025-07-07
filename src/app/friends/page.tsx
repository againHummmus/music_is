'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useStore } from '@/app/store'
import SubscriptionApi from '@/actions/userSubscriptionApi'
import HugeiconsSpinner01 from '~icons/uil/spinner?width=32px&height=32px'
import { User } from '@/components/shared/user/UserItem'

export default function FriendsPage() {
  const LIMIT = 20
  const currentUser = useStore(state => state.user)

  const [friends, setFriends] = useState<any[]>([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const observer = useRef<IntersectionObserver>()
  const lastFriendRef = useCallback((node: HTMLDivElement) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setOffset(o => o + LIMIT)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  useEffect(() => {
    if (!currentUser) return
    let canceled = false
    setLoading(true)

    SubscriptionApi.searchMutualFriends({
      userId: currentUser.id,
      limit: LIMIT,
      offset,
    })
      .then((data: any[]) => {
        if (canceled) return
        setFriends(prev => [...prev, ...data])
        setHasMore(data.length === LIMIT)
      })
      .catch(console.error)
      .finally(() => {
        if (!canceled) setLoading(false)
      })

    return () => { canceled = true }
  }, [currentUser, offset])

  if (!currentUser) {
    return <div className="p-8 text-center">Please sign in to see your friends.</div>
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Your Friends</h1>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,250px))] gap-10">
        {friends.map((sub, i) => {
          if (i === friends.length - 1) {
            return (
              <div ref={lastFriendRef} key={sub.id}>
                <User user={sub} />
              </div>
            )
          }
          return <User key={sub.id} user={sub} />
        })}

        {loading && (
          <div className="flex justify-center col-span-full py-4 text-mainOrange">
            <HugeiconsSpinner01 className="animate-spin" />
          </div>
        )}
      </div>
{/* 
      {!hasMore && !loading && (
        <div className="w-full text-center text-gray-500 py-6">
          You've reached the end!
        </div>
      )} */}
    </>
  )
}
