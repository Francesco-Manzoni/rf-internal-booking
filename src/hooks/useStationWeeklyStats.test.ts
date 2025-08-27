import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useStationWeeklyStats } from './useStationWeeklyStats' // Adjust path as needed
import type { Station } from '@/types/api'

describe('useStationWeeklyStats', () => {
  beforeEach(() => {
    // Mock Date to return a consistent date for testing
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2023-10-15T10:00:00')) // Sunday, October 15, 2023
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return stations with weekly stats', () => {
    const stations = [
      {
        id: '1',
        name: 'Station 1',
        bookings: [
          {
            id: 'b1',
            customerName: 'John Doe',
            startDate: '2023-10-16T08:00:00', // Monday - this week (Oct 15-21)
            endDate: '2023-10-16T10:00:00', // Monday - this week
            pickupReturnStationId: '1',
            pickupStation: 'Station 1',
            returnStation: 'Station 1',
          },
          {
            id: 'b2',
            customerName: 'Jane Smith',
            startDate: '2023-10-17T09:00:00', // Tuesday - this week (Oct 15-21)
            endDate: '2023-10-18T09:00:00', // Wednesday - this week
            pickupReturnStationId: '1',
            pickupStation: 'Station 1',
            returnStation: 'Station 2',
          },
        ],
      },
      {
        id: '2',
        name: 'Station 2',
        bookings: [
          {
            id: 'b3',
            customerName: 'Bob Johnson',
            startDate: '2023-10-15T14:00:00', // Sunday - this week
            endDate: '2023-10-15T16:00:00', // Sunday - this week
            pickupReturnStationId: '2',
            pickupStation: 'Station 2',
            returnStation: 'Station 2',
          },
          {
            id: 'b4',
            customerName: 'Alice Brown',
            startDate: '2023-10-16T18:00:00', // Monday - this week
            endDate: '2023-10-16T18:00:00', // Monday - this week
            pickupReturnStationId: '2',
            pickupStation: 'Station 2',
            returnStation: 'Station 2',
          },
        ],
      },
    ]

    const { result } = renderHook(() => useStationWeeklyStats(stations))

    expect(result.current).toHaveLength(2)

    // Station 1
    expect(result.current[0]).toEqual({
      id: '1',
      name: 'Station 1',
      bookings: stations[0].bookings,
      weeklyStats: {
        pickups: 2, // Both b1 (Oct 16) and b2 (Oct 17) pickups are in the week Oct 15-21
        returns: 2, // Both b1 (Oct 16) and b2 (Oct 18) returns are in the week
        total: 4,
      },
    })

    // Station 2
    expect(result.current[1]).toEqual({
      id: '2',
      name: 'Station 2',
      bookings: stations[1].bookings,
      weeklyStats: {
        pickups: 2, // Both b3 (Oct 15) and b4 (Oct 16) pickups are in the week
        returns: 2, // Both b3 (Oct 15) and b4 (Oct 16) returns are in the week
        total: 4,
      },
    })
  })

  it('should handle stations without bookings', () => {
    const stations = [
      {
        id: '1',
        name: 'Station 1',
        bookings: [],
      },
      {
        id: '2',
        name: 'Station 2',
      },
    ]

    const { result } = renderHook(() => useStationWeeklyStats(stations))

    expect(result.current[0].weeklyStats).toEqual({
      pickups: 0,
      returns: 0,
      total: 0,
    })

    expect(result.current[1].weeklyStats).toEqual({
      pickups: 0,
      returns: 0,
      total: 0,
    })
  })

  it('should handle empty stations array', () => {
    const stations: Array<Station> = []

    const { result } = renderHook(() => useStationWeeklyStats(stations))

    expect(result.current).toEqual([])
  })

  it('should correctly calculate week boundaries', () => {
    const stations = [
      {
        id: '1',
        name: 'Station 1',
        bookings: [
          {
            id: 'b1',
            customerName: 'Test User',
            startDate: '2023-10-15T00:00:00', // Sunday 00:00 - within week
            endDate: '2023-10-21T23:59:59', // Saturday 23:59:59 - within week
            pickupReturnStationId: '1',
            pickupStation: 'Station 1',
            returnStation: 'Station 1',
          },
          {
            id: 'b2',
            customerName: 'Test User 2',
            startDate: '2023-10-14T23:59:59', // Saturday before week - outside
            endDate: '2023-10-22T00:00:00', // Sunday after week - outside
            pickupReturnStationId: '1',
            pickupStation: 'Station 1',
            returnStation: 'Station 2',
          },
        ],
      },
    ]

    const { result } = renderHook(() => useStationWeeklyStats(stations))

    expect(result.current[0].weeklyStats).toEqual({
      pickups: 1, // b1 pickup
      returns: 1, // b1 return
      total: 2,
    })
  })

  it('should handle bookings exactly at week boundaries', () => {
    const stations = [
      {
        id: '1',
        name: 'Station 1',
        bookings: [
          {
            id: 'b1',
            customerName: 'Boundary Test',
            startDate: '2023-10-15T00:00:00', // Start of week (Sunday)
            endDate: '2023-10-21T23:59:59', // End of week (Saturday)
            pickupReturnStationId: '1',
            pickupStation: 'Station 1',
            returnStation: 'Station 1',
          },
        ],
      },
    ]

    const { result } = renderHook(() => useStationWeeklyStats(stations))

    expect(result.current[0].weeklyStats).toEqual({
      pickups: 1,
      returns: 1,
      total: 2,
    })
  })
})
