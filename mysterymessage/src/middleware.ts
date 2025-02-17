/*Middleware form next js allows you to run code before a request is completed.
Then, based on the incoming request, you can modify the response by rewriting, redirecting, modifying
 the request or response headers, or responding directly. */

import { NextResponse, NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from 'next-auth/jwt'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const token = await getToken({req:request});
  const url = request.nextUrl;

  //If token is present, request to open following path will redirect to dashboard page
    if(token && (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify') ||
        url.pathname === ('/') 
    ) ){

        return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }



}

// Matcher is user to match the path for which we want to run middleware.
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*'
 ],
}