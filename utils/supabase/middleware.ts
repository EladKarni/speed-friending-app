import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const updateSession = async (request: NextRequest) => {
  const cookieStore = await cookies();

  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const user = await supabase.auth.getUser();
    if (
      request.nextUrl.pathname.includes("/dashboard") &&
      user?.data?.user?.is_anonymous
    ) {
      return NextResponse.redirect(
        new URL("/protected/waiting-room", request.url)
      );
    }

    // protected routes
    if (
      request.nextUrl.searchParams.has("event_id") &&
      user.error &&
      request.nextUrl.pathname !== "/anon-login"
    ) {
      const event_id = request.nextUrl.searchParams.get("event_id");
      const eventURL = new URL("/anon-login", request.url);
      if (event_id) {
        eventURL.searchParams.set("event_id", event_id);
      }
      // And redirect to the new URL
      return NextResponse.redirect(eventURL);
    }

    if (request.nextUrl.pathname === "/" && !user.error) {
      return user.data.user.is_anonymous
        ? NextResponse.redirect(new URL("/protected", request.url))
        : NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (
      request.nextUrl.pathname === "/dashboard" &&
      user.data.user?.is_anonymous
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
