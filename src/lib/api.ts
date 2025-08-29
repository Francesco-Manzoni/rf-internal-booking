import type { Booking, BookingListItem, Station } from '../types/api'

// Use full URL in production, relative paths in development
const API_BASE = import.meta.env.PROD 
  ? 'https://605c94c36d85de00170da8b4.mockapi.io' 
  : '/api'

const BASE_URL = `${API_BASE}/stations`
const BOOKINGS_BASE_URL = `${API_BASE}/bookings`

export const stationsApi = {
  async getStationById(id: string): Promise<Station> {
    const response = await fetch(`${BASE_URL}/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch station')
    }
    return response.json()
  },

  async searchStations(query: string): Promise<Array<Station>> {
    const response = await fetch(
      `${BASE_URL}?name=${encodeURIComponent(query)}`,
    )
    if (!response.ok) {
      throw new Error('Failed to search stations')
    }
    return response.json()
  },
}

export const bookingsApi = {
  async getBookings(): Promise<Array<BookingListItem>> {
    // This method is still needed for general booking queries
    // but we should avoid using it if possible for performance
    const response = await fetch(`${BOOKINGS_BASE_URL}`)
    if (!response.ok) {
      throw new Error('Failed to fetch bookings')
    }
    return response.json()
  },

  async getBookingById(id: string): Promise<Booking> {
    // Use the direct booking endpoint
    const response = await fetch(`${BOOKINGS_BASE_URL}/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch booking')
    }

    const booking = await response.json()

    // Get station name if we have the station ID in the booking
    if (booking.pickupReturnStationId) {
      try {
        const station = await stationsApi.getStationById(
          booking.pickupReturnStationId,
        )
        booking.pickupReturnStationName = station.name
      } catch (error) {
        console.warn('Could not fetch station name for booking')
        booking.pickupReturnStationName = 'Unknown Station'
      }
    }

    return booking
  },

  async getBookingByIdAndStation(
    stationId: string,
    bookingId: string,
  ): Promise<Booking> {
    const response = await fetch(
      `${BASE_URL}/${stationId}/bookings/${bookingId}`,
    )
    if (!response.ok) {
      throw new Error('Failed to fetch booking details')
    }

    const booking = await response.json()

    // Get station name for additional context
    try {
      const station = await stationsApi.getStationById(stationId)
      booking.pickupReturnStationName = station.name
    } catch (error) {
      console.warn('Could not fetch station name')
      booking.pickupReturnStationName = 'Unknown Station'
    }

    return booking
  },

  async getBookingsByStation(
    stationId: string,
  ): Promise<Array<BookingListItem>> {
    const response = await fetch(`${BASE_URL}/${stationId}/bookings`)
    if (!response.ok) {
      throw new Error('Failed to fetch station bookings')
    }
    return response.json()
  },
}