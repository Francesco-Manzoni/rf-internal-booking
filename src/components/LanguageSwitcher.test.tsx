import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageSwitcher } from './LanguageSwitcher'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import { describe, expect, it } from 'vitest'

describe('LanguageSwitcher', () => {
  it('renders the language switcher button', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <LanguageSwitcher />
      </I18nextProvider>,
    )
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('opens the popover on click', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <LanguageSwitcher />
      </I18nextProvider>,
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('Italiano')).toBeInTheDocument()
    expect(screen.getByText('Deutsch')).toBeInTheDocument()
    expect(screen.getByText('Español')).toBeInTheDocument()
  })
})
