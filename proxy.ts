import createMiddleware from "next-intl/middleware";

const intlProxy = createMiddleware({
  locales: ["vi", "en"],
  defaultLocale: "vi",
  localePrefix: "never",
});

export default intlProxy;

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
