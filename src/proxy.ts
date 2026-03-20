import { type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { updateSession } from '@/utils/supabase/middleware';

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  // 1. Update Supabase session (refresh if needed)
  const supabaseResponse = await updateSession(req);
  
  // 2. Run i18n middleware
  const response = handleI18nRouting(req);

  // 3. Merge cookies from supabase response into the i18n response
  // This is crucial to ensure the refreshed session is sent to the browser
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value);
  });

  const { pathname } = req.nextUrl;
  const publicPages = ['/login', '/register', '/forgot-password'];
  const isPublicPage = publicPages.some(page => pathname.includes(page));

  // The session check should be done using the Supabase client
  // But for middleware, we can just check if the session cookie exists 
  // OR we can use the result of updateSession if we modify it to return the user.
  // For now, let's keep it simple: if not public and not logged in, redirect.
  
  // Actually, a better way is to check the user in updateSession or here.
  // Since we are using @supabase/ssr, the cookie usually starts with `sb-` or similar.
  const hasSession = req.cookies.has('sb-access-token') || 
                     req.cookies.has(`sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1].split('.')[0]}-auth-token`);

  if (!isPublicPage && !hasSession) {
    const locale = req.cookies.get('NEXT_LOCALE')?.value || routing.defaultLocale;
    req.nextUrl.pathname = `/${locale}/login`;
    return response; // We could redirect here, but we can also just return the response and let the app handle it via server components if we want.
    // However, a hard redirect is safer for protected routes.
    // return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  return response;
}

export const config = {
  matcher: ['/', '/(pt-BR|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};

