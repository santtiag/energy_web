import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const path = request.nextUrl.pathname;

    if (path === '/') {
        return NextResponse.redirect(new URL('/home', request.url));
    }

    // Redirecciones automáticas
    if (token && path === '/login') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!token && path.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/login', '/dashboard/:path*'],
};
