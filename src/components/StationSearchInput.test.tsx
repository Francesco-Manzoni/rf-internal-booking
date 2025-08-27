import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { StationSearchInput } from './StationSearchInput'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/utils', async () => {
  const actual = await vi.importActual('@/lib/utils')
  return {
    ...actual,
    debounce: (fn: any) => fn,
  }
})

const stations = [
  {
    id: '1',
    name: 'Station 1',
    weeklyStats: { pickups: 5, returns: 5, total: 10, uniqueCustomers: 10 },
  },
  {
    id: '2',
    name: 'Station 2',
    weeklyStats: { pickups: 3, returns: 5, total: 8, uniqueCustomers: 8 },
  },
]

describe('StationSearchInput', () => {
  it('renders the input with a placeholder', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <StationSearchInput
          searchQuery=""
          setSearchQuery={() => {}}
          onStationSelect={() => {}}
          isLoading={false}
          stationsWithStats={[]}
        />
      </I18nextProvider>,
    )

    expect(
      screen.getByPlaceholderText('Search for a station...'),
    ).toBeInTheDocument()
  })

  it('updates the input value on change', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <StationSearchInput
          searchQuery=""
          setSearchQuery={() => {}}
          onStationSelect={() => {}}
          isLoading={false}
          stationsWithStats={[]}
        />
      </I18nextProvider>,
    )

    const input = screen.getByPlaceholderText('Search for a station...')
    fireEvent.change(input, { target: { value: 'test' } })
    expect((input as HTMLInputElement).value).toBe('test')
  })

  it('calls setSearchQuery on change', async () => {
    const setSearchQuery = vi.fn()
    render(
      <I18nextProvider i18n={i18n}>
        <StationSearchInput
          searchQuery=""
          setSearchQuery={setSearchQuery}
          onStationSelect={() => {}}
          isLoading={false}
          stationsWithStats={[]}
        />
      </I18nextProvider>,
    )

    const input = screen.getByPlaceholderText('Search for a station...')
    fireEvent.change(input, { target: { value: 'test' } })

    await waitFor(() => {
      expect(setSearchQuery).toHaveBeenCalledWith('test')
    })
  })

  it('shows the loading skeleton when isLoading is true', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <StationSearchInput
          searchQuery="test"
          setSearchQuery={() => {}}
          onStationSelect={() => {}}
          isLoading={true}
          stationsWithStats={[]}
        />
      </I18nextProvider>,
    )

    const input = screen.getByPlaceholderText('Search for a station...')
    fireEvent.focus(input)

    expect(screen.getAllByTestId('station-card-skeleton')).toHaveLength(3)
  })

  it('shows the station list when there are results', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <StationSearchInput
          searchQuery="test"
          setSearchQuery={() => {}}
          onStationSelect={() => {}}
          isLoading={false}
          stationsWithStats={stations}
        />
      </I18nextProvider>,
    )

    const input = screen.getByPlaceholderText('Search for a station...')
    fireEvent.focus(input)

    expect(screen.getByText('Station 1')).toBeInTheDocument()
    expect(screen.getByText('Station 2')).toBeInTheDocument()
  })

  it('calls onStationSelect when a station is clicked', () => {
    const onStationSelect = vi.fn()
    render(
      <I18nextProvider i18n={i18n}>
        <StationSearchInput
          searchQuery="test"
          setSearchQuery={() => {}}
          onStationSelect={onStationSelect}
          isLoading={false}
          stationsWithStats={stations}
        />
      </I18nextProvider>,
    )

    const input = screen.getByPlaceholderText('Search for a station...')
    fireEvent.focus(input)

    const station1 = screen.getByText('Station 1')
    fireEvent.click(station1)

    expect(onStationSelect).toHaveBeenCalledWith('1')
  })

  it('shows the no results message when there are no results', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <StationSearchInput
          searchQuery="test"
          setSearchQuery={() => {}}
          onStationSelect={() => {}}
          isLoading={false}
          stationsWithStats={[]}
        />
      </I18nextProvider>,
    )

    const input = screen.getByPlaceholderText('Search for a station...')
    fireEvent.focus(input)

    expect(await screen.findByText(/No stations found/)).toBeInTheDocument()
  })

  it('clears the input when the clear button is clicked', () => {
    const setSearchQuery = vi.fn()
    render(
      <I18nextProvider i18n={i18n}>
        <StationSearchInput
          searchQuery="test"
          setSearchQuery={setSearchQuery}
          onStationSelect={() => {}}
          isLoading={false}
          stationsWithStats={[]}
        />
      </I18nextProvider>,
    )

    const input = screen.getByPlaceholderText('Search for a station...')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'test' } })

    const clearButton = screen.getByRole('button')
    fireEvent.click(clearButton)

    expect((input as HTMLInputElement).value).toBe('')
    expect(setSearchQuery).toHaveBeenCalledWith('')
  })
})
