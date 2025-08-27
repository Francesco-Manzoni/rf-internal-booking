import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import type { BookingListItem } from '@/types/api'
import { Link } from '@tanstack/react-router'
import { User } from 'lucide-react'
import { useDrag } from 'react-dnd'
import { useTranslation } from 'react-i18next'
// Define drag item types
export const ItemTypes = {
  BOOKING: 'booking',
}

// Draggable booking card component
interface DraggableBookingCardProps {
  booking: BookingListItem
  bookingType: string
  date: Date
}

export function DraggableBookingCard({
  booking,
  bookingType,
  date,
}: DraggableBookingCardProps) {
  const { t } = useTranslation()

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BOOKING,
    item: { booking, bookingType, originalDate: date },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'pickup':
        return 'default'
      case 'return':
        return 'secondary'
      case 'same-day':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getBadgeText = (type: string) => {
    switch (type) {
      case 'pickup':
        return t('station.badges.pickup', 'Pickup')
      case 'return':
        return t('station.badges.return', 'Return')
      case 'same-day':
        return t('station.badges.same_day', 'Pickup & Return')
      default:
        return t('station.badges.ongoing', 'Ongoing')
    }
  }

  return (
    <div
      ref={drag as any}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      <Link
        to="/booking/$bookingId"
        params={{ bookingId: booking.id }}
        className="block"
      >
        <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer border border-gray-200 hover:border-gray-300">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-3 w-3" />
              <span className="text-xs font-medium truncate">
                {booking.customerName}
              </span>
            </div>
            <Badge variant={getBadgeVariant(bookingType)} className="text-xs">
              {getBadgeText(bookingType)}
            </Badge>
          </div>
        </Card>
      </Link>
    </div>
  )
}
