import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const publicPaths = [
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks/(.*)',
  '/mcq(.*)',
  '/lectures(.*)',
  '/blog(.*)',
  '/job-notices(.*)',
  '/job-solution(.*)',
  '/current-affairs(.*)',
  '/written(.*)',
  '/data-vault(.*)',
];

const isPublicRoute = createRouteMatcher(publicPaths);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  
  // Check public paths manually or via matcher
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  const session = await auth();
  const role = (session.sessionClaims as any)?.metadata?.role;
  
  console.log("Middleware Debug - Path:", pathname);
  console.log("Middleware Debug - Role:", role);
  console.log("Middleware Debug - Metadata:", (session.sessionClaims as any)?.metadata);

  if (isAdminRoute(req)) {
    if (!session.userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
    
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      console.log("Middleware Debug - Redirecting to unauthorized, role is:", role);
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
