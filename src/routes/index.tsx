import { Card, CardContent } from '@/components/ui/card'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Calendar, MapPin, Users } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStationSearch } from '../hooks/useApi'
import { useStationWeeklyStats } from '../hooks/useStationWeeklyStats'
import { AnimatedStationSearchInput } from '@/components/AnimatedStationSearchInput'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { t } = useTranslation()
  const [selectedStation, setSelectedStation] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false)
  const navigate = useNavigate()

  const { data: searchResults = [], isLoading: isSearching } =
    useStationSearch(searchQuery)

  // Only show results when actively searching
  const stations = searchQuery ? searchResults : []
  const stationsWithStats = useStationWeeklyStats(stations)

  const handleStationSelect = (stationId: string) => {
    setSelectedStation(stationId)
    const selectedStationData = stationsWithStats.find(
      (s) => s.id === stationId,
    )
    if (selectedStationData) {
      navigate({
        to: '/station/$stationId',
        params: { stationId: selectedStationData.id },
        search: {
          week: undefined,
        },
      })
    }
  }

  return (
    <div
      className={`flex flex-col min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-100 via-white to-blue-100`}
    >
      {/* Header Section - Slides up when search is focused */}
      <div
        className={`
            text-center transition-all duration-500 ease-in-out
            ${
              isSearchFocused
                ? 'mb-0 opacity-0 transform -translate-y-8 pointer-events-none hidden'
                : 'mb-12 opacity-100 transform translate-y-0 px-2'
            }
          `}
      >
        <div className="flex justify-center mb-6"></div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('home.title')}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t('home.subtitle')}
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-start">
        <AnimatedStationSearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearchFocused={isSearchFocused}
          setIsSearchFocused={setIsSearchFocused}
          selectedStation={selectedStation}
          handleStationSelect={handleStationSelect}
          isLoading={isSearching}
          stationsWithStats={stationsWithStats}
        />
      </div>
    </div>
  )
}
