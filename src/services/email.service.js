const { Resend } = require("resend");

const {
  RESEND_API_KEY,
  SENDER_EMAIL,
  RECIPIENT_EMAIL,
} = require("../config/env");

const resend = new Resend(RESEND_API_KEY);

function generateInviteEmailHTML(guestName, inviteUrl) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Georgia, serif;
      line-height: 1.6;
      color: #4A5D45;
      background: #FAF9F6;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }

    .card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .header {
      background: #6B7F63;
      color: white;
      padding: 50px 30px;
      text-align: center;
    }

    .header h1 {
      margin: 0;
      font-size: 42px;
      font-style: italic;
      font-weight: 300;
    }

    .header p {
      margin: 10px 0 0 0;
      font-size: 14px;
      letter-spacing: 3px;
      text-transform: uppercase;
      opacity: 0.9;
    }

    .content {
      padding: 40px 30px;
      text-align: center;
    }

    .greeting {
      font-size: 28px;
      color: #4A5D45;
      margin-bottom: 20px;
      font-style: italic;
    }

    .message {
      font-size: 16px;
      color: #6B7F63;
      line-height: 1.8;
      margin-bottom: 30px;
    }

    .details {
      background: #F5F5F0;
      padding: 25px;
      border-radius: 8px;
      margin: 30px 0;
    }

    .details p {
      margin: 8px 0;
      color: #4A5D45;
    }

    .label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #8B9D83;
      margin-bottom: 5px;
    }

    .value {
      font-size: 18px;
      font-weight: 600;
    }

    .btn {
      display: inline-block;
      background: #8B9D83;
      color: white !important;
      padding: 15px 40px;
      text-decoration: none;
      border-radius: 30px;
      font-weight: 500;
      letter-spacing: 1px;
      margin: 20px 0;
    }

    .footer {
      padding: 20px 30px;
      text-align: center;
      color: #9BAA92;
      font-size: 12px;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <h1>You're Invited</h1>
        <p>Save the Date</p>
      </div>

      <div class="content">
        <p class="greeting">Dear ${guestName},</p>

        <p class="message">
          With joyful hearts, we invite you to celebrate our wedding day.
          Your presence would mean the world to us as we begin this new chapter together.
        </p>

        <div class="details">
          <div style="margin-bottom:15px;">
            <div class="label">Date</div>
            <div class="value">Saturday, October 03, 2026</div>
          </div>

          <div style="margin-bottom:15px;">
            <div class="label">Time</div>
            <div class="value">03:00 PM</div>
          </div>

          <div>
            <div class="label">Venue</div>
            <div class="value">Sta.Ursula Parish Church</div>
            <p style="margin:5px 0;font-size:14px;color:#8B9D83;">
              Libid Binangonan, Rizal
            </p>
          </div>
        </div>

        <p class="message">
          Please RSVP at your earliest convenience.
        </p>

        <a href="${inviteUrl}" class="btn">
          View Invitation & RSVP
        </a>
      </div>

      <div class="footer">
        <p>With love,<br/>The Couple</p>
      </div>
    </div>
  </div>
</body>
</html>
`;
}

async function sendInviteEmail(invite, frontendUrl) {
  const inviteUrl = `${frontendUrl}/${invite.id}`;

  await resend.emails.send({
    from: SENDER_EMAIL,
    to: [invite.email],
    subject: `You're Invited to Our Wedding, ${invite.name}!`,
    html: generateInviteEmailHTML(invite.name, inviteUrl),
  });
}

async function sendRSVPNotification(rsvp) {
  const primary = rsvp.primary_guest;
  const additional = rsvp.additional_guests || [];

  const totalGuests = 1 + additional.length;

  const comingCount = [primary, ...additional].filter(
    (g) => g.status === "coming",
  ).length;

  let guestsHtml = `
    <div style="margin:20px 0;padding:15px;background:#F5F5F0;border-radius:8px;">
      <h3 style="color:#4A5D45;margin:0 0 10px 0;">
        Primary Guest
      </h3>
      <p><strong>Name:</strong> ${primary.name}</p>
      <p><strong>Email:</strong> ${primary.email}</p>
      <p><strong>Contact:</strong> ${primary.contact}</p>
      <p><strong>Status:</strong> ${primary.status}</p>
    </div>
  `;

  additional.forEach((guest, idx) => {
    guestsHtml += `
      <div style="margin:20px 0;padding:15px;background:#F5F5F0;border-radius:8px;">
        <h3 style="color:#4A5D45;margin:0 0 10px 0;">
          Additional Guest ${idx + 1}
        </h3>
        <p><strong>Name:</strong> ${guest.name}</p>
        <p><strong>Email:</strong> ${guest.email}</p>
        <p><strong>Contact:</strong> ${guest.contact}</p>
        <p><strong>Status:</strong> ${guest.status}</p>
      </div>
    `;
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #4A5D45;
      line-height: 1.6;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      background: #6B7F63;
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }

    .content {
      background: white;
      padding: 30px;
      border: 1px solid #E8E6DC;
      border-radius: 0 0 8px 8px;
    }

    .summary {
      background: #8B9D83;
      color: white;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      margin: 20px 0;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h1>New RSVP Submission</h1>
    </div>

    <div class="content">
      <div class="summary">
        <h2>
          ${comingCount} of ${totalGuests} guest(s) attending
        </h2>
      </div>

      ${guestsHtml}

      <p style="margin-top:30px;padding-top:20px;border-top:1px solid #E8E6DC;color:#9BAA92;font-size:14px;">
        Submitted on ${new Date().toLocaleString()}
      </p>
    </div>
  </div>
</body>
</html>
`;

  await resend.emails.send({
    from: SENDER_EMAIL,
    to: [RECIPIENT_EMAIL],
    subject: `New RSVP: ${primary.name} + ${additional.length} guest(s)`,
    html,
  });
}

module.exports = {
  generateInviteEmailHTML,
  sendInviteEmail,
  sendRSVPNotification,
};
