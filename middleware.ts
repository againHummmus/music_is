// middleware.ts
import { createNextAuthMiddleware } from 'nextjs-basic-auth-middleware'

export const middleware = createNextAuthMiddleware({
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}