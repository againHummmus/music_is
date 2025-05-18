import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/", "/index"],
};

export function middleware(req: NextRequest) {
  const { ip } = req;
  const basicAuth = req.headers.get("authorization");
  const url = req.nextUrl;

  if (
    process.env.IS_PRODUCTION === "false" &&
    ip !== "xx.xxx.xxx.xxx"
  ) {
    if (basicAuth) {
      const authValue = basicAuth.split(" ")[1];
      const [user, pwd] = atob(authValue).split(":");

      const validUser = process.env.BASIC_AUTH_USER;
      const validPassWord = process.env.BASIC_AUTH_PASS;

      if (user === validUser && pwd === validPassWord) {
        return NextResponse.next();
      }
    }
    url.pathname = "/api/basicAuth";

    return NextResponse.rewrite(url);
  }
}