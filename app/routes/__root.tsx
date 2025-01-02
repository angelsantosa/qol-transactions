import {
  Outlet,
  ScrollRestoration,
  createRootRoute,
} from '@tanstack/react-router';
import { Meta, Scripts } from '@tanstack/start';
import type { ReactNode } from 'react';

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
        <div className="app">
          <header
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '1rem',
              textAlign: 'center',
            }}
          >
            <h1>Mobile First Layout</h1>
          </header>
          <section
            style={{
              padding: '.5rem',
            }}
          >
            {children}
          </section>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
