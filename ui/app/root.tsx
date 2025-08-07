import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
  useLocation,
  redirect,
} from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { queryClient, apiRequestLoader } from "./apiClient/clientUtils";
import { GitHubLogo, CampLogo } from "./components/Logos";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

function isPathNonAuthenticated(pathname: string) {
  return pathname === "/signup" || pathname === "/";
}

export async function loader({ request }: Route.LoaderArgs) {
  let userLoggedIn = false;

  const url = new URL(request.url);
  const pathname = url.pathname;

  const PUBLIC_API_URL = process.env.PUBLIC_API_URL;

  if (PUBLIC_API_URL) {
    try {
      await apiRequestLoader(
        PUBLIC_API_URL,
        "/users/me",
        {},
        { cookie: request.headers.get("Cookie") }
      );

      userLoggedIn = true;
    } catch (error) {}
  }

  if (userLoggedIn || isPathNonAuthenticated(pathname)) {
    const requiredClientEnvs = { ENV: { PUBLIC_API_URL } };
    return requiredClientEnvs;
  }

  // redirect to login if required to be authenticated for current route
  return redirect("/");
}

function AppHeader({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isLoginOrSignUp = isPathNonAuthenticated(location.pathname);

  const header = (
    <div className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
      <div className="flex items-center justify-start gap-4">
        <GitHubLogo />
        <CampLogo />
      </div>
      <div>
        <Link to="/trips" className="btn btn-primary btn-sm ml-4">
          View all Trips
        </Link>
        <Link
          to="/account-settings"
          className="btn btn-circle btn-ghost text-2xl text-primary hover:bg-base-100"
          title="Update user preferences"
        >
          {/* Head silhouette icon (Heroicons user icon) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25v-1.5A2.25 2.25 0 016.75 16.5h10.5a2.25 2.25 0 012.25 2.25v1.5"
            />
          </svg>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {isLoginOrSignUp ? null : header}
      {children}
    </>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        {/* Inject env before Scripts runs */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(loaderData?.ENV)};`,
          }}
        />
        <Links />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <AppHeader>
            <Outlet />
          </AppHeader>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found. :("
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
