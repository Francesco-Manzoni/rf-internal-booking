export interface Station {
  id: string
  name: string
  bookings?: Array<BookingListItem>
}

export interface Booking {
  id: string
  customerName: string
  startDate: string
  endDate: string
  pickupReturnStationId: string
  pickupReturnStationName?: string
  pickupStation?: string
  returnStation?: string
}

export interface BookingListItem {
  id: string
  customerName: string
  startDate: string
  endDate: string
  pickupReturnStationId: string
  pickupStation?: string
  returnStation?: string
}

export interface ApiResponse<T> {
  data: T
}
