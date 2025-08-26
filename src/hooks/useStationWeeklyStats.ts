import { useMemo } from 'react'
import type { Station } from '../types/api'

export const useStationWeeklyStats = (stations: Array<Station>) => {
  return useMemo(() => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    return stations.map((station) => {
      let pickups = 0
      let returns = 0

      if (station.bookings) {
        station.bookings.forEach((booking) => {
          const startDate = new Date(booking.startDate)
          const endDate = new Date(booking.endDate)

          // Check if pickup is this week
          if (startDate >= startOfWeek && startDate <= endOfWeek) {
            pickups++
          }

          // Check if return is this week
          if (endDate >= startOfWeek && endDate <= endOfWeek) {
            returns++
          }
        })
      }

      return {
        ...station,
        weeklyStats: {
          pickups,
          returns,
          total: pickups + returns,
        },
      }
    })
  }, [stations])
}
