import { useQuery } from '@tanstack/react-query'
import { bookingsApi, stationsApi } from '../lib/api'

export const useStation = (id: string) => {
  return useQuery({
    queryKey: ['stations', id],
    queryFn: () => stationsApi.getStationById(id),
    enabled: !!id,
  })
}

export const useStationSearch = (query: string) => {
  return useQuery({
    queryKey: ['stations', 'search', query],
    queryFn: () => stationsApi.searchStations(query),
    enabled: query.length > 0,
  })
}

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: bookingsApi.getBookings,
  })
}

export const useBookingsByStation = (stationId: string) => {
  return useQuery({
    queryKey: ['bookings', 'station', stationId],
    queryFn: () => bookingsApi.getBookingsByStation(stationId),
    enabled: !!stationId,
  })
}

export const useBooking = (id: string) => {
  return useQuery({
    queryKey: ['bookings', id],
    queryFn: () => bookingsApi.getBookingById(id),
    enabled: !!id,
  })
}

export const useBookingByIdAndStation = (
  stationId: string,
  bookingId: string,
) => {
  return useQuery({
    queryKey: ['bookings', stationId, bookingId],
    queryFn: () => bookingsApi.getBookingByIdAndStation(stationId, bookingId),
    enabled: !!stationId && !!bookingId,
  })
}
