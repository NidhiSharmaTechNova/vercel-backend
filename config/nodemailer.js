import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


// Try SSL first (port 465), fallback to TLS (port 587) if needed
// const transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com",
//   port: 465,
//   secure: true, // Use SSL
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
//   // Add timeout and connection options
//   connectionTimeout: 10000, // 10 seconds
//   greetingTimeout: 5000,    // 5 seconds
//   socketTimeout: 10000,     // 10 seconds
// });



// Alternative TLS configuration (uncomment if SSL doesn't work)
// const transporter = nodemailer.createTransporter({
//   host: "smtp-relay.brevo.com",
//   port: 587,
//   secure: false, // Use TLS
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
//   tls: {
//     ciphers: 'SSLv3'
//   }
// });

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Nodemailer verify error:", error.message);
    console.error("❌ Full error:", error);
  } else {
    console.log("✅ Nodemailer is ready to send emails");
  }
});

export default transporter;