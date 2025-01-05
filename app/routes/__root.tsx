import {
  Outlet,
  ScrollRestoration,
  createRootRoute,
} from '@tanstack/react-router';
import { Meta, Scripts } from '@tanstack/start';
import type { ReactNode } from 'react';
import mainCss from '@/main.css?url';

export const Route = createRootRoute({
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
});

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
          <header className="bg-blue-100 p-4 text-center">
            <h1>qol-transactions</h1>
          </header>
          <section className="p-2">{children}</section>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
