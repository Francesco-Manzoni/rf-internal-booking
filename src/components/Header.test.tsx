import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from '@tanstack/react-router'
import { render, screen, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it } from 'vitest'
import i18n from '../i18n'
import Header from './Header'

describe('Header', () => {
  it('renders the header with title and language switcher', async () => {
    const rootRoute = createRootRoute({
      component: () => (
        <>
          <Header />
          <Outlet />
        </>
      ),
    })
    const router = createRouter({
      routeTree: rootRoute,
      history: createMemoryHistory(),
    })

    render(
      <I18nextProvider i18n={i18n}>
        <RouterProvider router={router} />
      </I18nextProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText('🏕️ Campervan Bookings')).toBeInTheDocument()
    })

    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
