import * as React from 'react';
import { Outlet, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
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
        <Outlet />
      </section>
    </React.Fragment>
  );
}
