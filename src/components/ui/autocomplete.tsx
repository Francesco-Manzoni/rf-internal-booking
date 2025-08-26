import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface AutocompleteOption {
  value: string
  label: string
}

interface AutocompleteProps {
  options: Array<AutocompleteOption>
  value?: string
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  onSelect: (value: string) => void
  onSearch?: (query: string) => void
  loading?: boolean
  disabled?: boolean
  className?: string
}

export function Autocomplete({
  options,
  value,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No options found.',
  onSelect,
  onSearch,
  loading = false,
  disabled = false,
  className,
}: AutocompleteProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (onSearch && searchQuery) {
      const timeoutId = setTimeout(() => {
        onSearch(searchQuery)
      }, 300)

      return () => clearTimeout(timeoutId)
    }
  }, [searchQuery, onSearch])

  const selectedOption = options.find((option) => option.value === value)

  const handleSelect = (selectedValue: string) => {
    onSelect(selectedValue)
    setOpen(false)
    setSearchQuery('')
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between',
            !selectedOption && 'text-muted-foreground',
            className,
          )}
          disabled={disabled || loading}
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            {selectedOption ? selectedOption.label : placeholder}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            ref={inputRef}
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={handleSearch}
            className="h-9"
          />
          <CommandEmpty>{loading ? 'Loading...' : emptyMessage}</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => handleSelect(option.value)}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === option.value ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
