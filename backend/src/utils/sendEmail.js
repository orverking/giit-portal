const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html, text }) => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('Email preview:', { to, subject, text });
    return { preview: true };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter.sendMail({
    from: process.env.SMTP_FROM || 'GIIT Portal <no-reply@giit.ac.ug>',
    to,
    subject,
    text,
    html,
  });
};

module.exports = sendEmail;
