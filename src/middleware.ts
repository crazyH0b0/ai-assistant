import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

// export default authMiddleware({
//   publicRoutes: ['/', '/auth(.*)', '/portal(.*)', '/images(.*)'],
//   ignoredRoutes: ['/chatbot'],
// });

// export const config = {
//   matcher: ['/((?!.+.[w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
// };
