import type { Booking, BookingListItem, Station } from '../types/api'

const BASE_URL = 'https://605c94c36d85de00170da8b4.mockapi.io/stations'

export const stationsApi = {
  async getStations(): Promise<Array<Station>> {
    const response = await fetch(BASE_URL)
    if (!response.ok) {
      throw new Error('Failed to fetch stations')
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
    // Get all stations with their bookings
    const stations = await stationsApi.getStations()
    const allBookings: Array<BookingListItem> = []

    stations.forEach((station) => {
      if (station.bookings) {
        allBookings.push(...station.bookings)
      }
    })

    return allBookings
  },

  async getBookingById(id: string): Promise<Booking> {
    // First, we need to find which station this booking belongs to
    // We'll search through all stations to find the booking and get the station info
    const stations = await stationsApi.getStations()

    for (const station of stations) {
      if (station.bookings) {
        const booking = station.bookings.find((b) => b.id === id)
        if (booking) {
          // Now use the direct endpoint for more detailed booking info
          try {
            const response = await fetch(
              `${BASE_URL}/${station.id}/bookings/${id}`,
            )
            if (response.ok) {
              const detailedBooking = await response.json()
              return {
                ...detailedBooking,
                pickupReturnStationName: station.name,
              }
            }
          } catch (error) {
            console.warn(
              'Failed to fetch detailed booking, falling back to basic info',
            )
          }

          // Fallback to basic booking info if detailed fetch fails
          return {
            ...booking,
            pickupReturnStationName: station.name,
          }
        }
      }
    }

    throw new Error(`Booking with ID ${id} not found`)
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
    const stations = await stationsApi.getStations()
    const station = stations.find((s) => s.id === stationId)

    return {
      ...booking,
      pickupReturnStationName: station?.name || 'Unknown Station',
    }
  },

  async getBookingsByStation(
    stationId: string,
  ): Promise<Array<BookingListItem>> {
    const stations = await stationsApi.getStations()
    const station = stations.find((s) => s.id === stationId)

    return station?.bookings || []
  },
}
