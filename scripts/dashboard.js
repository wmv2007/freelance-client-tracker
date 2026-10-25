let leads = JSON.parse(localStorage.getItem('leads')) || [];

function saveLeads() {
  localStorage.setItem('leads', JSON.stringify(leads));
}