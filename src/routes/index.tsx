import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Calendar, MapPin, Users, X } from 'lucide-react'
import { useStationSearch } from '../hooks/useApi'
import { useStationWeeklyStats } from '../hooks/useStationWeeklyStats'
import { StationCard, StationCardSkeleton } from '../components/StationCard'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
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
      })
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchFocus = () => {
    setIsSearchFocused(true)
  }

  const handleSearchBlur = () => {
    // Delay blur to allow clicking on station cards
    setTimeout(() => {
      if (!searchQuery) {
        setIsSearchFocused(false)
      }
    }, 200)
  }

  const handleCloseSearch = () => {
    setSearchQuery('')
    setIsSearchFocused(false)
    setSelectedStation('')
  }

  const isLoading = isSearching

  return (
    <div
      className={`h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-blue-50`}
    >
      {/* Animated Search Input */}
      <div
        className={`
        ${isSearchFocused ? 'fixed top-0 left-0 right-0 bottom-0 z-50' : 'relative'}
        transition-all duration-500 ease-in-out
        ${isSearchFocused ? 'bg-white/95 backdrop-blur-md border-b shadow-lg overflow-hidden pt-16' : ''}
      `}
      >
        <div
          className={`
          container mx-auto px-4 
          ${isSearchFocused ? 'py-4' : 'py-8'}
          transition-all duration-500 ease-in-out
        `}
        >
          {/* Header Section - Slides up when search is focused */}
          <div
            className={`
            text-center transition-all duration-500 ease-in-out
            ${
              isSearchFocused
                ? 'mb-0 opacity-0 transform -translate-y-8 pointer-events-none hidden'
                : 'mb-12 opacity-100 transform translate-y-0'
            }
          `}
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-100 rounded-full">
                <MapPin className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🏕️ Campervan Booking Dashboard
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Manage pickups and returns for your campervan rental stations.
              Select a station to view the calendar and manage bookings.
            </p>
          </div>

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
                  Select Station
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Choose a rental station to view bookings and manage the
                  calendar
                </CardDescription>
              </CardHeader>

              <CardContent
                className={`
                transition-all duration-500 ease-in-out
                ${isSearchFocused ? 'space-y-0 p-0' : 'space-y-6 p-6'}
              `}
              >
                <div className="space-y-2">
                  <label
                    htmlFor="station-select"
                    className={`
                      text-sm font-medium text-gray-700 transition-all duration-500 ease-in-out
                      ${isSearchFocused ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}
                    `}
                  >
                    Station
                  </label>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="station-select"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={handleSearchFocus}
                        onBlur={handleSearchBlur}
                        placeholder="Search for a station..."
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
                      Station selected! Click below to view the calendar.
                    </p>
                    <Button
                      onClick={() => handleStationSelect(selectedStation)}
                      className="w-full h-12 text-lg font-medium"
                      size="lg"
                    >
                      <Calendar className="mr-2 h-5 w-5" />
                      View Station Calendar
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
                      No stations found for "{searchQuery}"
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      Start typing to search for stations...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section - Hidden when search is focused */}
      <div
        className={`
        container mx-auto px-4 transition-all duration-500 ease-in-out
        ${
          isSearchFocused
            ? 'opacity-0 transform translate-y-8 pointer-events-none'
            : 'opacity-100 transform translate-y-0'
        }
      `}
      >
        <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
          <Card className="text-center border-0 bg-white/60 backdrop-blur-sm">
            <CardContent className="pt-6">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Calendar View
              </h3>
              <p className="text-sm text-gray-600">
                Week-by-week calendar showing all pickups and returns
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 bg-white/60 backdrop-blur-sm">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Booking Details
              </h3>
              <p className="text-sm text-gray-600">
                Complete customer and booking information at your fingertips
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 bg-white/60 backdrop-blur-sm">
            <CardContent className="pt-6">
              <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Station Management
              </h3>
              <p className="text-sm text-gray-600">
                Manage multiple stations with real-time booking updates
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
