import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { StationWithStats } from '@/types/api'
import { Calendar, MapPin, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StationCard, StationCardSkeleton } from '../components/StationCard'
import { debounce } from '@/lib/utils'

interface AnimatedStationSearchInputProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  isSearchFocused: boolean
  setIsSearchFocused: (focused: boolean) => void
  selectedStation: string
  handleStationSelect: (stationId: string) => void
  isLoading: boolean
  stationsWithStats: Array<StationWithStats>
}

export function AnimatedStationSearchInput({
  searchQuery,
  setSearchQuery,
  isSearchFocused,
  setIsSearchFocused,
  selectedStation,
  handleStationSelect,
  isLoading,
  stationsWithStats,
}: AnimatedStationSearchInputProps) {
  const { t } = useTranslation()
  const [value, setValue] = useState(searchQuery)
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedSetSearchQuery = useRef(debounce(setSearchQuery, 500)).current

  // Debounce logic for search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setValue(val) // Update immediate input value
    debouncedSetSearchQuery(val) // Update debounced search query
  }

  const handleSearchFocus = () => {
    setIsSearchFocused(true)
    // Mobile fix: Scroll the focused input into view reliably
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 300) // Delay to allow for keyboard to appear
  }

  const handleSearchBlur = () => {
    setTimeout(() => {
      // Only unfocus if the search query is empty to prevent immediate hiding
      // when clicking on a station card.
      if (!searchQuery) {
        setIsSearchFocused(false)
      }
    }, 200)
  }

  const handleCloseSearch = () => {
    setSearchQuery('')
    setIsSearchFocused(false)
  }

  return (
    <div
      className={`

        transition-all duration-500 ease-in-out
        ${isSearchFocused ? 'bg-white/95 backdrop-blur-md border-b shadow-lg overflow-hidden pt-0' : ''}
      `}
    >
      <div
        className={`
          container mx-auto px-4 
          ${isSearchFocused ? 'py-4' : 'py-8'}
          transition-all duration-500 ease-in-out
        `}
      >
        {/* Search Input Card - Transforms when focused */}
        <div
          className={`
            max-w-2xl mx-auto transition-all duration-500 ease-in-out
          `}
        >
          <Card
            className={`
              shadow-lg border-0 bg-white/80 backdrop-blur-sm
              transition-all duration-500 ease-in-out
              ${
                isSearchFocused
                  ? 'bg-transparent shadow-none border-none backdrop-blur-none'
                  : ''
              }
            `}
          >
            <CardHeader
              className={`
                text-center transition-all duration-500 ease-in-out
                ${
                  isSearchFocused
                    ? 'pb-0 opacity-0 h-0 overflow-hidden'
                    : 'pb-6 opacity-100'
                }
              `}
            >
              <CardTitle className="text-2xl font-semibold text-gray-900">
                {t('home.search.select_station')}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {t('home.search.choose_station')}
              </CardDescription>
            </CardHeader>

            <CardContent
              className={`
                transition-all duration-500 ease-in-out
                ${isSearchFocused ? 'space-y-0 p-0' : 'space-y-6 p-6'}
              `}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="station-select"
                      ref={inputRef}
                      value={value} // Display immediate query
                      onChange={handleSearchChange}
                      onFocus={handleSearchFocus}
                      onBlur={handleSearchBlur}
                      placeholder={t(
                        'home.search.placeholder',
                        'Search for a station...',
                      )}
                      className={`
                          pl-10 pr-4 h-12 text-lg transition-all duration-500 ease-in-out
                          ${
                            isSearchFocused
                              ? 'ring-2 ring-blue-500 shadow-lg'
                              : 'cursor-pointer'
                          }
                        `}
                    />
                  </div>

                  {isSearchFocused && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCloseSearch}
                      className="p-2 opacity-0 animate-fade-in-up"
                      style={{
                        animationDelay: '300ms',
                        animationFillMode: 'forwards',
                      }}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>

              {!isSearchFocused && selectedStation && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600 mb-4">
                    {t(
                      'home.search.station_selected',
                      'Station selected! Click below to view the calendar.',
                    )}
                  </p>
                  <Button
                    onClick={() => handleStationSelect(selectedStation)}
                    className="w-full h-12 text-lg font-medium"
                    size="lg"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    {t('home.search.view_calendar', 'View Station Calendar')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Station Results - Appears below the input when focused */}
          {isSearchFocused && (
            <div
              className="opacity-0 animate-fade-in-up px-1 mt-6"
              style={{
                animationDelay: '200ms',
                animationFillMode: 'forwards',
              }}
            >
              <div className="station-results h-[calc(100vh-12rem)] overflow-y-auto overflow-x-visible space-y-4 px-2 py-2 touch-pan-y overscroll-contain">
                {isLoading ? (
                  <>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <StationCardSkeleton key={i} />
                    ))}
                  </>
                ) : stationsWithStats.length > 0 ? (
                  stationsWithStats.map((station) => (
                    <StationCard
                      key={station.id}
                      station={station}
                      onClick={handleStationSelect}
                      isSelected={selectedStation === station.id}
                    />
                  ))
                ) : searchQuery ? (
                  <div className="text-center py-8 text-gray-500">
                    {t(
                      'home.search.no_results',

                      { query: searchQuery },
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    {t('home.search.start_typing')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
