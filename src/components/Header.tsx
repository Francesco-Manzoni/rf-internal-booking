import { Link } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'

export default function Header() {
  const { t } = useTranslation()

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <MapPin className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">
              {t('header.title')}
            </span>
          </Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  )
}
