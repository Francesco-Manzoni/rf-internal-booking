import { Input } from '@/components/ui/input'
import type { StationWithStats } from '@/types/api'
import { MapPin, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { debounce } from '@/lib/utils'
import {
  StationCard,
  StationCardSkeleton,
} from './station-components/StationCard'
import { Button } from '@/components/ui/button'

interface StationSearchInputProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  onStationSelect: (stationId: string) => void
  isLoading: boolean
  stationsWithStats: Array<StationWithStats>
  placeholder?: string
  showResults?: boolean
  variant?: 'default' | 'compact'
  className?: string
  onFocus?: () => void
  onBlur?: () => void
}

export function StationSearchInput({
  searchQuery,
  setSearchQuery,
  onStationSelect,
  isLoading,
  stationsWithStats,
  placeholder,
  showResults = true,
  variant = 'default',
  className = '',
  onFocus,
  onBlur,
}: StationSearchInputProps) {
  const { t } = useTranslation()
  const [value, setValue] = useState(searchQuery)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedSetSearchQuery = useRef(debounce(setSearchQuery, 500)).current

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setValue(val)
    debouncedSetSearchQuery(val.trim())
  }

  const handleFocus = () => {
    setIsFocused(true)
    onFocus?.()
  }

  const handleBlur = () => {
    setTimeout(() => {
      if (!searchQuery) {
        setIsFocused(false)
      }
      onBlur?.()
    }, 200)
  }

  const handleClear = () => {
    setValue('')
    setSearchQuery('')
    setIsFocused(false)
    inputRef.current?.blur()
  }

  const defaultPlaceholder = t(
    'home.search.placeholder',
    'Search for a station...',
  )

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          {variant === 'compact' && (
            <div className="absolute inset-0 bg-gray-50 opacity-50 rounded-md pointer-events-none" />
          )}
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            ref={inputRef}
            data-testid="station-search-input"
            value={value}
            onChange={handleSearchChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder || defaultPlaceholder}
            className={`
              pl-10 pr-4 transition-all duration-200
              ${variant === 'compact' ? 'h-10' : 'h-12 text-lg'}
              ${isFocused ? 'ring-2 ring-blue-500 shadow-lg' : ''}
            `}
          />
        </div>

        {isFocused && value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results */}
      {showResults && isFocused && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <div className="p-2 space-y-2">
            {isLoading ? (
              <>
                {Array.from({ length: 3 }).map((_, i) => (
                  <StationCardSkeleton key={i} />
                ))}
              </>
            ) : stationsWithStats.length > 0 ? (
              stationsWithStats.map((station) => (
                <StationCard
                  key={station.id}
                  station={station}
                  onClick={(stationId) => {
                    onStationSelect(stationId)
                    setIsFocused(false)
                    setValue('')
                    setSearchQuery('')
                  }}
                  isSelected={false}
                />
              ))
            ) : searchQuery ? (
              <div className="text-center py-8 text-gray-500">
                {t(
                  'home.search.no_results',
                  'No stations found for "{{query}}"',
                  {
                    query: searchQuery,
                  },
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                {t('home.search.start_typing', 'Start typing to search...')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
