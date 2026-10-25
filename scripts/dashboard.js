function renderLeads(list) {
  let html = '';

  list.forEach(lead => {
    const initials = lead.name.slice(0, 2).toUpperCase();
    const statusClass = lead.status.toLowerCase().replaceAll(' ', '-');
    const date = new Date(lead.followUpDate).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short'
    });

    html += `
      <div class="lead-card">
        <p class="lead-badge">${initials}</p>
        <div class="lead-details">
          <span class="lead-name">${lead.name}</span>
          <p class="lead-detail">
            <span>${lead.service}</span>
            .
            <span>${lead.platform}</span>
          </p>
        </div>
        <div class="lead-total">
          <span class="lead-amount">$${lead.amount}</span>
        </div>
        <div class="lead-stat">
          <span class="lead-status ${statusClass}">${lead.status}</span>
        </div>
        <div class="lead-date-container">
          <span class="lead-date">${date}</span>
        </div>
        <button class="lead-email" data-id="${lead.id}" aria-label="Email ${lead.name}">
          <svg data-dc-tpl="100" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect data-dc-tpl="101" x="2" y="4" width="20" height="16" rx="2"></rect>
            <path data-dc-tpl="102" d="M22 7l-10 6L2 7"></path>
          </svg>
        </button>
      </div>
    `
  });

  document.querySelector('.leads-list').innerHTML = html;
}

renderLeads(leads);

const activeStatus = ['new', 'contacted', 'replied', 'negotiating'];
const wonStatus = ['won', 'deposit paid', 'paid in full', 'delivered'];
const deliverStatus = ['won', 'deposit paid', 'paid in full'];
let currentFilter = 'all';
let searchText = '';

function cleanStatus(status) {
  return status.toLowerCase().replaceAll('-', ' ');
}

function renderStats(list) {
  const paidStatuses = ['paid in full', 'delivered'];

  const total = list.length;

  const active = list.filter(lead => 
    activeStatus.includes(cleanStatus(lead.status))
  ).length;

  const won = list.filter(lead => 
    wonStatus.includes(cleanStatus(lead.status))
  ).length;

  const earned = list
    .filter(lead => paidStatuses.includes(cleanStatus(lead.status)))
    .reduce((sum, lead) => sum + lead.amount, 0);

  const winRate = total === 0 ? 0 : Math.round((won / total) * 100);

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-active').textContent = active;
  document.getElementById('stat-won').textContent = won;
  document.getElementById('stat-rate').textContent = winRate;
  document.getElementById('stat-earned').textContent = '$' + earned.toLocaleString('en-US');
}

renderStats(leads);

function getDueLeads(list) {
  const today = new Date().toLocaleDateString('en-CA');
  return list.filter(lead => 
    lead.followUpDate &&
    lead.followUpDate <= today &&
    activeStatus.includes(cleanStatus(lead.status))
  );
}

function renderFollowUps(list) {
  const due = getDueLeads(list);
  const today = new Date().toLocaleDateString('en-CA');
  const container = document.getElementById('followup-list');

  let html = '';

  due.forEach(lead => {
    const days = Math.round((new Date(today) - new Date(lead.followUpDate)) / 86400000);
    const when = days === 0 ? 'Today' : `Overdue ${days} day${days === 1 ? '' : 's'}`

    html += `
      <div class="followup-card">
        <div class="followup-detail">
          <p class="followup-badge">${lead.name.slice(0, 2).toUpperCase()}</p>
          <div class="followup-details">
            <span class="lead-name">${lead.name}</span>
            <p class="details">
              <span>${lead.service}</span>
            </p>
          </div>
          <p class="status">${when}</p>
        </div>
        <button class="followup-email" data-id="${lead.id}" aria-lable="Email ${lead.name}"">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M22 2L11 13"></path>
            <path d="M22 2l-7 20-4-9-9-4z"></path>
          </svg>
          send follow-up email
        </button>
      </div>
    `;
  });

  container.innerHTML = html;
  document.getElementById('followup-count').textContent = due.length + ' due';
  document.getElementById('followup-badge').textContent = due.length;
}

renderFollowUps(leads);

document.querySelector('.leads-list').addEventListener('click', event => {
  console.log('clicked', event.target)
  const button = event.target.closest('button[data-id]');
  if (!button) return;
  window.location.href = 'add-lead.html?id=' + button.dataset.id;
});

function applyFilters() {
  const filtered = leads.filter(lead => {
    const status = cleanStatus(lead.status);

    let matchesTab = true;
    if (currentFilter === 'active') matchesTab = activeStatus.includes(status);
    if (currentFilter === 'won') matchesTab = wonStatus.includes(status);
    if (currentFilter === 'lost') matchesTab = status === 'lost';

    const text = (lead.name + ' ' + lead.service + ' ' + lead.platform).toLowerCase();
    const matchesSearch = text.includes(searchText);

    return matchesTab && matchesSearch;
  });

  renderLeads(filtered);
}

const tabButtons = document.querySelectorAll('.top-navigation nav button');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    currentFilter = button.dataset.filter;
    applyFilters();
  });
});

document.getElementById('search').addEventListener('input', event => {
  searchText = event.target.value.toLowerCase().trim();
  applyFilters();
});

function renderDeliver(list) {
  const container = document.getElementById('deliver-list');
  const ready = list.filter(lead => deliverStatus.includes(cleanStatus(lead.status)));
  let html = '';

  ready.forEach(lead => {
    const half = Math.round(lead.amount / 2);
    const unlocked = lead.finalPaid && lead.confirmed;

    html += `
      <div class="followup-card">
        <div class="followup-detail">
          <p class="followup-badge">${lead.name.slice(0, 2).toUpperCase()}</p>
          <div class="followup-details">
            <span class="lead-name">${lead.name}</span>
            <p class="details">
              <span>${lead.service}</span>
              .
              <span>$${lead.amount}</span>
            </p>
          </div>
          <p class="lead-status deposit">ready</p>
        </div>
        <div class="checkmark">
          <input class="checkbox" type="checkbox" data-id="${lead.id}" data-field="depositPaid" ${lead.depositPaid ? 'checked' : ''}>
          <p>Deposit recieved ($${half})</p>
        </div>
        <div class="checkmark">
          <input class="checkbox" type="checkbox" data-id="${lead.id}" data-field="finalPaid" ${lead.finalPaid ? 'checked' : ''}>
          <p>Final payment recieved ($${half})</p>
        </div>
        <div class="checkmark">
          <input class="checkbox" type="checkbox" data-id="${lead.id}" data-field="confirmed" ${lead.confirmed ? 'checked' : ''}>
          <p>Checked in my own account</p>
        </div>
        <button class="followup-email deliver-btn" data-id="${lead.id}" ${unlocked ? '' : 'disabled'}>
          ${unlocked ? 'send delivery email' : 'Locked untill paid in full'}
        </button>
      </div>
    `;
  });

  container.innerHTML = html || '<p>No Jobs waiting for delivery.</p>';
}

renderDeliver(leads);

function refreshAll() {
  applyFilters();
  renderStats(leads);
  renderFollowUps(leads);
  renderDeliver(leads);
}

refreshAll();

const deliverList = document.getElementById('deliver-list');

deliverList.addEventListener('change', event => {
  const box = event.target;
  if (box.type !== 'checkbox') return;

  const lead = leads.find(item => item.id === Number(box.dataset.id));
  lead[box.dataset.field] = box.checked;

  if (lead.finalPaid && lead.confirmed) {
    lead.status = 'Paid in full';
  } else if (lead.depositPaid) {
    lead.status = 'Deposit paid';
  } else {
    lead.status = 'Won';
  }

  saveLeads();
  refreshAll();
});

const navLinks = document.querySelectorAll('.sidebar a');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(item => item.classList.remove('active'));
    link.classList.add('active');
  });
});