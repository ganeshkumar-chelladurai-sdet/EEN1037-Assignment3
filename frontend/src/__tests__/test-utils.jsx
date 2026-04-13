import { render } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContext } from '../context/authContext'

export function renderWithProviders(ui, { user = null, loading = false, initialEntries = ['/'], route = null } = {}) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const authValue = { user, loading, login: vi.fn(), logout: vi.fn(), register: vi.fn() }

  const content = route
    ? <Routes><Route path={route} element={ui} /></Routes>
    : ui

  return {
    authValue,
    ...render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={authValue}>
          <MemoryRouter initialEntries={initialEntries}>
            {content}
          </MemoryRouter>
        </AuthContext.Provider>
      </QueryClientProvider>
    ),
  }
}
