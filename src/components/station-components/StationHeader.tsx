import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useNavigate } from '@tanstack/react-router'
import { Calendar as CalendarIcon, ChevronLeft, MapPin } from 'lucide-react'
import { useState } from 'react'
import { de, enUS, es, it } from 'react-day-picker/locale'
import { useTranslation } from 'react-i18next'
import { useStation } from '../../hooks/useApi'

export const StationHeader = ({
  stationId,
  onDateSelect,
  currentWeek,
}: {
  stationId: string
  onDateSelect: (date: Date) => void
  currentWeek: number
}) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const { data: station } = useStation(stationId)

  const handleBackToHome = () => {
    navigate({ to: '/' })
  }

  return (
    <div>
      <div className="flex w-full mb-1">
        <Button
          variant="outline"
          onClick={handleBackToHome}
          size="lg"
          className="shrink-0"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          <div className="text-lg">
            {t('station.back_to_stations', 'Back to Stations')}
          </div>
        </Button>
      </div>
      <div className="flex items-center justify-between w-full mt-2 mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            {station ? station.name : 'Station Calendar'}
          </h1>
        </div>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="border-blue-100 bg-white hover:bg-blue-100"
            >
              <CalendarIcon className="h-5 w-5 text-blue-600" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              locale={
                i18n.language === 'en'
                  ? enUS
                  : i18n.language === 'it'
                    ? it
                    : i18n.language === 'de'
                      ? de
                      : i18n.language === 'es'
                        ? es
                        : enUS
              }
              mode="single"
              selected={
                currentWeek === 0
                  ? new Date()
                  : new Date(
                      new Date().setDate(
                        new Date().getDate() + currentWeek * 7,
                      ),
                    )
              }
              onSelect={(date) => {
                if (date) {
                  setIsCalendarOpen(false)
                  onDateSelect(date)
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
