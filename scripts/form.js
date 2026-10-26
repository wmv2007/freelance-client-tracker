const emailTemplates = {
  followup: {
    subject: lead => `Following up on your ${lead.service}`,
    message: lead => 
      `Hi ${lead.name},\n\nI wanted to check in on the quote I sent for your ${lead.service}. Do you have any questions I can answer, or anything you would like adjusted? \n\nIf you are ready to go ahead, reply to this email and I will send over the next steps and a start date.\n\nBest regards,\nVincent Muriuki.`
  },
  firstReply: {
    subject: lead => `Thanks for your enquiry: ${lead.service}`,
    message: lead => 
      `Hi ${lead.name}\n\nThank you for reaching out about ${lead.service}. I would be happy to help. Could you tell me a bit more about what you need, your deadline, and any examples you like?\n\n\Once I have that, I will send you a clear quote.\n\nBest regards,\nVincent Muriuki`
  },
  started: {
    subject: lead => `Work has started on your  ${lead.service}`,
    message: lead => 
      `Hi ${lead.name}\n\nThank you for the payment. I have started work on your ${lead.service} and will update you as it progresses. If you have anything else to share, like text, photos or a logo, please send it over.\n\nBest regards,\nVincent Muriuki`
  },
  delivered: {
    subject: lead => `Your ${lead.service} is ready`,
    message: lead => 
      `Hi ${lead.name},\n\nYour ${lead.service} is complete. You can download the final files here:\n\n[paste delivery link here]\n\nPlease check everything and let me know within 7 days if you would like any small changes.\n\nThank you for working with me!\n\nBest regards, \nVincent Muriuki`
  },
  reminder: {
    subject: lead => `Payment reminder: ${lead.service}`,
    message: lead => {
      const balance = lead.depositPaid ? Math.round(lead.amount / 2) : lead.amount;
      return `Hi ${lead.name},\n\nThis is a friendly reminder that the remaining payment of $${balance} for your ${lead.service} is still pending. I will deliver the work as soon as the full payment is confirmed.\n\nBest regards,\nVincent Muriuki`;
    }
  }
};


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
  applyTemplate('followup')
}

function applyTemplate(key) {
  const lead = targetLead || {name: 'there', service: 'project', amount: 0 };
  const template = emailTemplates[key];

  if (key === 'delivered' && !(lead.finalPaid && lead.confirmed)) {
    alert('Locked: the final payment must be recieved and confirmed in your own account first.');
    return;
  }

  document.getElementById('email-subject').value = template.subject(lead);
  document.getElementById('email-message').value = template.message(lead);
}

document.getElementById('btns').addEventListener('click', event => {
  const button = event.target.closest('.email-btn');
  if (!button) return;

  document.querySelectorAll('.email-btn').forEach(b => b.classList.remove('active'));
  button.classList.add('active');
  applyTemplate(button.dataset.template);
});