import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StationHeader } from './StationHeader'
import type { Station } from '../../types/api'

// Setup default mocks
const mockNavigate = vi.fn()
const mockTranslate = vi.fn((key: string, fallback?: string) => fallback || key)
const mockStation = {
  id: 'station1',
  name: 'Test Station',
} as Station

// Mock all the necessary dependencies (must be at top level, not inside describe)
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockTranslate,
    i18n: { language: 'en' },
  }),
}))

vi.mock('../../hooks/useApi', () => ({
  useStation: () => ({ data: mockStation }),
  useStationSearch: () => ({
    data: [],
    isLoading: false,
  }),
}))

vi.mock('../../hooks/useStationWeeklyStats', () => ({
  useStationWeeklyStats: () => [],
}))

vi.mock('@/components/StationSearchInput', () => ({
  StationSearchInput: ({
    onStationSelect,
    isLoading,
  }: {
    onStationSelect: (id: string) => void
    isLoading: boolean
  }) => (
    <div data-testid="station-search-input">
      <button
        onClick={() => onStationSelect('station2')}
        disabled={isLoading}
        data-testid="search-input-button"
      >
        Search Station
      </button>
    </div>
  ),
}))

vi.mock('@/components/ui/calendar', () => ({
  Calendar: ({
    onSelect,
  }: {
    locale?: any
    onSelect: (date: Date | undefined) => void
  }) => (
    <div data-testid="calendar">
      <button
        data-testid="calendar-date"
        onClick={() => onSelect(new Date('2024-01-01'))}
      >
        Select Date
      </button>
    </div>
  ),
}))

vi.mock('@/components/ui/popover', () => ({
  Popover: ({
    children,
    open,
    onOpenChange,
  }: {
    children: any
    open: boolean
    onOpenChange: (open: boolean) => void
  }) => (
    <div data-testid="popover">
      {open && <div data-testid="popover-content">{children}</div>}
      <button data-testid="popover-trigger" onClick={() => onOpenChange(!open)}>
        Calendar Trigger
      </button>
    </div>
  ),
  PopoverContent: ({ children }: { children: any }) => (
    <div data-testid="popover-content-wrapper">{children}</div>
  ),
  PopoverTrigger: ({ children }: { children: any }) => children,
}))

describe('StationHeader', () => {
  const mockOnDateSelect = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the component with station name', () => {
    render(
      <StationHeader
        stationId="station1"
        onDateSelect={mockOnDateSelect}
        currentWeek={0}
      />,
    )

    expect(screen.getByText('Test Station')).toBeInTheDocument()
    expect(screen.getByText('Back to Stations')).toBeInTheDocument()
  })

  it('calls navigation when back button is clicked', () => {
    render(
      <StationHeader
        stationId="station1"
        onDateSelect={mockOnDateSelect}
        currentWeek={0}
      />,
    )

    const backButton = screen.getByText('Back to Stations').closest('button')
    fireEvent.click(backButton!)

    expect(mockNavigate).toHaveBeenCalledWith({ to: '/' })
  })

  it('renders calendar popover trigger', () => {
    render(
      <StationHeader
        stationId="station1"
        onDateSelect={mockOnDateSelect}
        currentWeek={0}
      />,
    )

    expect(screen.getByTestId('popover')).toBeInTheDocument()
  })

  it('renders station search input', () => {
    render(
      <StationHeader
        stationId="station1"
        onDateSelect={mockOnDateSelect}
        currentWeek={0}
      />,
    )

    expect(screen.getByTestId('station-search-input')).toBeInTheDocument()
  })

  it('calls onDateSelect when date is selected from calendar', () => {
    render(
      <StationHeader
        stationId="station1"
        onDateSelect={mockOnDateSelect}
        currentWeek={0}
      />,
    )
    const triggerButton = screen.getByTestId('popover-trigger')
    fireEvent.click(triggerButton) // Open popover

    const calendarDate = screen.getByTestId('calendar-date')
    fireEvent.click(calendarDate)

    expect(mockOnDateSelect).toHaveBeenCalledWith(new Date('2024-01-01'))
  })

  it('handles station selection from search input', () => {
    render(
      <StationHeader
        stationId="station1"
        onDateSelect={mockOnDateSelect}
        currentWeek={0}
      />,
    )

    const searchButton = screen.getByTestId('search-input-button')
    fireEvent.click(searchButton)

    expect(mockNavigate).toHaveBeenCalledWith({
      to: '/station/$stationId',
      params: { stationId: 'station2' },
      search: {
        week: undefined,
      },
    })
  })
})
