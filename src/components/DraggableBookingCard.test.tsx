import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from '@tanstack/react-router'
import { render, screen, waitFor } from '@testing-library/react'
import { DndProvider } from 'react-dnd'
import { TestBackend } from 'react-dnd-test-backend'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it } from 'vitest'
import i18n from '../i18n'
import { DraggableBookingCard } from './DraggableBookingCard'

const booking = {
  id: '1',
  pickupReturnStationId: '2',
  customerName: 'Test Customer',
  startDate: '2025-01-01',
  endDate: '2025-01-05',
  stationId: '1',
}

describe('DraggableBookingCard', () => {
  it('renders booking information', async () => {
    const rootRoute = createRootRoute({
      component: () => (
        <DraggableBookingCard
          booking={booking}
          bookingType="pickup"
          date={new Date()}
        />
      ),
    })
    const router = createRouter({
      routeTree: rootRoute,
      history: createMemoryHistory(),
    })

    render(
      <DndProvider backend={TestBackend}>
        <I18nextProvider i18n={i18n}>
          <RouterProvider router={router} />
        </I18nextProvider>
      </DndProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText('Test Customer')).toBeInTheDocument()
      expect(screen.getByText('Pickup')).toBeInTheDocument()
    })
  })
})
