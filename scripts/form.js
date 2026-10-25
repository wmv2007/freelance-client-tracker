const leadForm = document.getElementById('lead-form');

leadForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const lead = {
    id: Date.now(),
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    platform: document.getElementById('platform').value,
    service: document.getElementById('service-wanted').value,
    amount: Number(document.getElementById('amount').value),
    status: document.getElementById('status').value,
    followUpDate: document.getElementById('date').value,
    notes: document.getElementById('notes').value,
    depositPaid: false,
    finalPaid: false,
    confirmed: false
  };

  leads.push(lead);
  saveLeads();
  window.location.href = 'dashboard.html'
});

const params = new URLSearchParams(window.location.search);
const leadId = Number(params.get('id'));
const targetLead = leads.find(item => item.id === leadId);

if (targetLead) {
  document.getElementById('email-to').value = targetLead.email;
  document.getElementById('email-subject').value = 'Following up on your ' + targetLead.service;
  document.getElementById('email-message').value = 
  `Hi ${targetLead.name},\n\nJust checking in about your ${targetLead.service}. Let me know if you have any question. \n\nBest, Vincent`;
}

console.log('id:', leadId, 'lead found:', targetLead);