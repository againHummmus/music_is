'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import UserApi from '@/actions/userApi'
import HugeiconsSpinner01 from '~icons/uil/spinner?width=32px&height=32px'
import { User } from '@/components/shared/user/UserItem'

export default function UsersPage() {
  const LIMIT = 20

  const [users, setUsers] = useState<any[]>([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const observer = useRef<IntersectionObserver>()
  const lastUserRef = useCallback((node: HTMLDivElement) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setOffset(prev => prev + LIMIT)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    UserApi.searchUsers({ limit: LIMIT, offset })
      .then((data: any[]) => {
        if (cancelled) return
        setUsers(prev => [...prev, ...data])
        setHasMore(data.length === LIMIT)
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [offset])

  return (
    <>
      <h1 className="text-3xl font-bold mb-[20px]">Users</h1>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,250px))] gap-10">
        {users.map((u, i) => {
          if (i === users.length - 1) {
            return (
              <div ref={lastUserRef} key={u.id}>
                <User user={u} />
              </div>
            )
          }
          return <User key={u.id} user={u} />
        })}

        {loading && (
          <div className="flex justify-center py-4 text-mainOrange">
            <HugeiconsSpinner01 className="animate-spin" />
          </div>
        )}


      </div>
      {!hasMore && !loading && (
        <div className="w-full text-center text-gray-500 py-4">
          You've reached the end!
        </div>
      )}
    </>
  )
}
