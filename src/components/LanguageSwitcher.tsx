import { useTranslation } from 'react-i18next'
import { Button } from './ui/button'
import { Globe } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ]

  const getBaseLanguage = (lang: string) => lang.split('-')[0]

  const currentLanguage =
    languages.find(
      (lang) => getBaseLanguage(lang.code) === getBaseLanguage(i18n.language),
    ) || languages[0]

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {currentLanguage.flag} {currentLanguage.name}
          </span>
          <span className="sm:hidden">{currentLanguage.flag}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="space-y-1">
          {languages.map((language) => (
            <Button
              key={language.code}
              variant={i18n.language === language.code ? 'default' : 'ghost'}
              size="sm"
              className="w-full justify-start"
              onClick={() => handleLanguageChange(language.code)}
            >
              <span className="mr-2">{language.flag}</span>
              {language.name}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
