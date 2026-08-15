const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Zuia HTML/script injection ndani ya barua pepe (jina, ujumbe, n.k. ni input za mtumiaji)
const escapeHtml = (unsafe) => {
  if (unsafe === null || unsafe === undefined) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const sendAdmissionConfirmation = async ({ to, name, referenceNo }) => {
  const transporter = createTransporter();
  const safeName = escapeHtml(name);
  const safeRef = escapeHtml(referenceNo);
  await transporter.sendMail({
    from: `"Mpendae Secondary School" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Uthibitisho wa Ombi la Usajili — Mpendae Secondary School',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1B4F72, #1ABC9C); padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: white; margin: 0;">Mpendae Secondary School</h1>
          <p style="color: rgba(255,255,255,0.9); margin-top: 5px;">Elimu ni Ufunguo wa Maisha</p>
        </div>
        <div style="padding: 30px; background: #f8fafc; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1B4F72;">Habari ${safeName},</h2>
          <p style="color: #444; line-height: 1.6;">
            Tunapenda kukujulisha kwamba ombi lako la usajili wa mtoto wako limepokewa vizuri na ofisi yetu.
          </p>
          <div style="background: white; border-left: 4px solid #F39C12; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #666;">Nambari ya Rejeleo:</p>
            <h3 style="margin: 5px 0; color: #1B4F72; font-size: 24px;">${safeRef}</h3>
          </div>
          <p style="color: #444; line-height: 1.6;">
            Ombi lako litapitiwa na timu yetu. Tutakuwasiliana nawe ndani ya siku 7-14 za kazi kupitia simu au barua pepe hii.
          </p>
          <p style="color: #444; line-height: 1.6;">
            Kwa maswali yoyote, wasiliana nasi:
          </p>
          <ul style="color: #444; line-height: 1.8;">
            <li>📞 Simu: +255 777 000 000</li>
            <li>📧 Barua pepe: info@mpendaesecondary.ac.tz</li>
            <li>📍 Anwani: Mpendae, Zanzibar, Tanzania</li>
          </ul>
          <p style="color: #888; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
            Barua pepe hii imetumwa kiotomatiki. Tafadhali usijaribu kujibu.
          </p>
        </div>
      </div>
    `,
  });
};

const sendAdmissionStatusUpdate = async ({ to, name, status, notes }) => {
  const transporter = createTransporter();
  const isApproved = status === 'APPROVED';
  const safeName = escapeHtml(name);
  const safeNotes = escapeHtml(notes);
  await transporter.sendMail({
    from: `"Mpendae Secondary School" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Matokeo ya Ombi la Usajili — ${isApproved ? 'IMEKUBALIWA ✅' : 'IMEKATALIWA ❌'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1B4F72, #1ABC9C); padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: white; margin: 0;">Mpendae Secondary School</h1>
        </div>
        <div style="padding: 30px; background: #f8fafc;">
          <h2 style="color: #1B4F72;">Habari ${safeName},</h2>
          <div style="background: ${isApproved ? '#d4edda' : '#f8d7da'}; border: 1px solid ${isApproved ? '#c3e6cb' : '#f5c6cb'}; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3 style="color: ${isApproved ? '#155724' : '#721c24'}; margin: 0; font-size: 20px;">
              ${isApproved ? '🎉 Hongera! Ombi lako LIMEKUBALIWA' : '😔 Ombi lako Limekataliwa'}
            </h3>
          </div>
          ${safeNotes ? `<p style="color: #444;"><strong>Maelezo:</strong> ${safeNotes}</p>` : ''}
          ${isApproved ? `
            <p style="color: #444; line-height: 1.6;">
              Tafadhali uje ofisini mwetu na hati zifuatazo:
            </p>
            <ul style="color: #444; line-height: 1.8;">
              <li>Cheti cha kuzaliwa (Birth Certificate)</li>
              <li>Matokeo ya PSLE/KCPE</li>
              <li>Picha 4 za pasipoti</li>
              <li>Ada ya usajili</li>
            </ul>
          ` : ''}
          <p style="color: #444;">Kwa maswali: +255 777 000 000</p>
        </div>
      </div>
    `,
  });
};

const sendContactMessage = async ({ name, email, subject, message }) => {
  const transporter = createTransporter();
  const safeName = escapeHtml(name);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
  await transporter.sendMail({
    from: `"Mpendae Website" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `Ujumbe Mpya: ${safeSubject}`,
    html: `
      <h2>Ujumbe kutoka: ${safeName}</h2>
      <p><strong>Barua pepe:</strong> ${escapeHtml(email)}</p>
      <p><strong>Mada:</strong> ${safeSubject}</p>
      <p><strong>Ujumbe:</strong></p>
      <p>${safeMessage}</p>
    `,
    replyTo: email,
  });
};

module.exports = { sendAdmissionConfirmation, sendAdmissionStatusUpdate, sendContactMessage };