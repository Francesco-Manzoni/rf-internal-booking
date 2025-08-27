import { Card } from '@/components/ui/card'
import type { BookingListItem } from '@/types/api'
import { useDrop } from 'react-dnd'
import { ItemTypes } from './DraggableBookingCard'

interface DroppableDateCellProps {
  date: Date
  children: React.ReactNode
  onDrop: (
    booking: BookingListItem,
    targetDate: Date,
    rescheduleType: 'pickup' | 'return',
  ) => void
  isToday: boolean
}

export function DroppableDateCell({
  date,
  children,
  onDrop,
  isToday,
}: DroppableDateCellProps) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.BOOKING,
    drop: (item: {
      booking: BookingListItem
      bookingType: string
      originalDate: Date
    }) => {
      // Determine reschedule type based on the original booking type
      const rescheduleType = item.bookingType === 'return' ? 'return' : 'pickup'
      onDrop(item.booking, date, rescheduleType)
    },
    canDrop: (item: {
      booking: BookingListItem
      bookingType: string
      originalDate: Date
    }) => {
      // Prevent dropping on the same date
      return item.originalDate.toDateString() !== date.toDateString()
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  const dropZoneClass = `min-h-48 ${
    isToday ? 'ring-2 ring-blue-500 bg-blue-50/50' : ''
  } ${isOver && canDrop ? 'ring-2 ring-green-500 bg-green-50/50' : ''} ${
    isOver && !canDrop ? 'ring-2 ring-red-500 bg-red-50/50' : ''
  }`

  return (
    <Card ref={drop as any} className={dropZoneClass}>
      {children}
    </Card>
  )
}
