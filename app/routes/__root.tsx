import {
  Link,
  Outlet,
  ScrollRestoration,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import { Meta, Scripts } from '@tanstack/start';
import type { QueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import mainCss from '@/main.css?url';
import { Toaster } from '@/components/ui/toaster';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        {
          charSet: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          title: 'qol-transactions',
        },
      ],
      links: [{ rel: 'stylesheet', href: mainCss }],
    }),
    component: RootComponent,
  },
);

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <Meta />
      </head>
      <body>
        <div className="bg-background text-foreground w-full min-w-80 max-w-[430px] min-h-screen shadow-md">
          <header className="bg-blue-100 p-4 text-center flex flex-col gap-2">
            <h1 className="text-2xl font-bold">qol-transactions</h1>
            <nav className="flex justify-between">
              <div>
                <Link
                  to="/"
                  className="text-blue-500"
                  activeProps={{ className: 'font-bold' }}
                >
                  Agregar gasto
                </Link>
              </div>
              <div>
                <Link
                  to="/settings"
                  className="text-blue-500"
                  activeProps={{ className: 'font-bold' }}
                >
                  Configuración
                </Link>
              </div>
            </nav>
          </header>
          <section className="p-2">{children}</section>
          <Toaster />
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
