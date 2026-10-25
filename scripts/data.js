let leads = JSON.parse(localStorage.getItem('leads')) || [];

function saveLeads() {
  localStorage.setItem('leads', JSON.stringify(leads));
}

const testLead = {
  id: Date.now(),
  name: 'test client',
  email: 'test@example.com',
  platform: 'fiverr',
  service: 'multi-page site',
  amount: 180,
  status: 'New',
  followUpDate: '2026-10-28',
  notes: '',
  depositPaid: false,
  finalPaid: false,
  confirmed: false
}
