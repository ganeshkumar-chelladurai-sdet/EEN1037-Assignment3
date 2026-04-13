import { http, HttpResponse } from 'msw'

// ── Mock Seed Data ──────────────────────────────────────────

export const mockAccounts = [
  { id: 1, account_number: 'DUB-1001', account_type: 'Current', balance: '1250.50', nickname: 'Daily Spending', status: 'Active' },
  { id: 2, account_number: 'DUB-2002', account_type: 'Savings', balance: '5000.00', nickname: 'Rainy Day', status: 'Active' },
]

export const mockTransactions = [
  { id: 1, account: 1, account_number: 'DUB-1001', transaction_type: 'Deposit', amount: '500.00', status: 'Completed', created_at: '2025-01-01T10:00:00Z' },
  { id: 2, account: 1, account_number: 'DUB-1001', transaction_type: 'Transfer Out', amount: '50.00', status: 'Completed', created_at: '2025-01-02T12:00:00Z' },
]

export const mockProfile = {
  username: 'testuser',
  email: 'test@example.com',
  fullname: 'Test User',
  phone: '0851234567',
  address: '123 Fake Street',
  profile_picture: null
}

export const mockUser = { id: 101, username: 'testuser', is_staff: false }
export const mockStaffUser = { id: 100, username: 'testadmin', is_staff: true }

// ── Handlers ──────────────────────────────────────────────────

export const handlers = [
  // Authentication
  http.post('/api/auth/login/', async ({ request }) => {
    const body = await request.json()
    if (body.username === 'testuser' && body.password === 'testpass') {
      return HttpResponse.json({ access: 'mock-token', user: mockUser })
    }
    return HttpResponse.json({ detail: 'Invalid credentials' }, { status: 401 })
  }),

  http.get('/api/auth/user/', () => HttpResponse.json(mockUser)),

  // Accounts
  http.get('/api/accounts/', () => HttpResponse.json(mockAccounts)),

  http.get('/api/accounts/:id/', ({ params }) => {
    const account = mockAccounts.find(a => a.id === Number(params.id))
    return account ? HttpResponse.json(account) : HttpResponse.json({ detail: 'Not found' }, { status: 404 })
  }),

  http.put('/api/accounts/:id/', async ({ request, params }) => {
    const body = await request.json()
    return HttpResponse.json({ ...body, id: Number(params.id) })
  }),

  http.post('/api/accounts/', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ ...body, id: 99 }, { status: 201 })
  }),

  // Transfers & Transactions
  http.get('/api/transfers/', () => HttpResponse.json([])),
  http.post('/api/transfers/', () => HttpResponse.json({ detail: 'Transfer created' }, { status: 201 })),
  
  http.get('/api/transactions/', () => HttpResponse.json(mockTransactions)),

  // Profile
  http.get('/api/profile/', () => HttpResponse.json(mockProfile)),
  http.patch('/api/profile/', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ ...mockProfile, ...body })
  }),
  http.post('/api/profile/photo/', () => HttpResponse.json({ detail: 'Uploaded' })),
]
