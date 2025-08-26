import { Link } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'

export default function Header() {
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
              🏕️ Campervan Bookings
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/demo/tanstack-query"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Demo
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
