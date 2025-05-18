import { NextRequest, NextResponse } from 'next/server'

const USER = process.env.BASIC_AUTH_USER
const PASS = process.env.BASIC_AUTH_PASS

export function middleware(req: NextRequest) {
    
  const auth = req.headers.get('authorization') || ''
  const [scheme, encoded] = auth.split(' ')
  if (
    scheme === 'Basic' &&
    Buffer.from(`${USER}:${PASS}`).toString('base64') === encoded
  ) {
    return NextResponse.next()
  }

  return new NextResponse('Auth required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"'
    }
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
