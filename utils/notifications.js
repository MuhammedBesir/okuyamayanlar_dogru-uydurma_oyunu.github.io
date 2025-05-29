const nodemailer = require('nodemailer');

// Configure Nodemailer
// We'll use Ethereal for testing if no real credentials are provided via environment variables
async function createTransporter() {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587, // or 465 for SSL
            secure: (process.env.SMTP_SECURE === 'true'), // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // Fallback to Ethereal for testing if no env vars are set
        let testAccount = await nodemailer.createTestAccount();
        console.log(`Nodemailer test account created. Preview URL: ${nodemailer.getTestMessageUrl(null)} User: ${testAccount.user}, Pass: ${testAccount.pass}`);
        return nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // Ethereal user
                pass: testAccount.pass, // Ethereal password
            },
        });
    }
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com'; // Default admin email

async function sendEventNotification(eventData) {
    try {
        const transporter = await createTransporter();
        const mailOptions = {
            from: '"Buarada Bot Notifier" <noreply@buarada.app>',
            to: ADMIN_EMAIL,
            subject: `New Event Submission: ${eventData.eventName}`,
            html: `
                <h1>New Event Submitted</h1>
                <p><strong>Event ID:</strong> ${eventData.id}</p>
                <p><strong>Organizer:</strong> ${eventData.organizerName}</p>
                <p><strong>Event Name:</strong> ${eventData.eventName}</p>
                <p><strong>Date & Time:</strong> ${eventData.dateTime}</p>
                <p><strong>Location:</strong> ${eventData.location}</p>
                <p><strong>Type:</strong> ${eventData.type}</p>
                <p><strong>Description:</strong> ${eventData.description}</p>
                <p><strong>Image URL:</strong> ${eventData.imageUrl || 'N/A'}</p>
                <p><strong>Contact Link:</strong> ${eventData.contactLink}</p>
                <p><strong>Submitted At:</strong> ${eventData.submittedAt}</p>
            `
        };
        let info = await transporter.sendMail(mailOptions);
        console.log('Event notification email sent: %s', info.messageId);
        if (!process.env.SMTP_HOST) { // If using Ethereal
            console.log('Preview URL (Ethereal): %s', nodemailer.getTestMessageUrl(info));
        }
    } catch (error) {
        console.error('Error sending event notification email:', error);
    }
}

async function sendContactNotification(contactData) {
    try {
        const transporter = await createTransporter();
        const mailOptions = {
            from: '"Buarada Bot Notifier" <noreply@buarada.app>',
            to: ADMIN_EMAIL,
            subject: `New Contact Request from ${contactData.name}`,
            html: `
                <h1>New Contact Request</h1>
                <p><strong>Request ID:</strong> ${contactData.id}</p>
                <p><strong>Name:</strong> ${contactData.name}</p>
                <p><strong>Question:</strong> ${contactData.question}</p>
                <p><strong>Preferred Contact:</strong> ${contactData.contactMethod}</p>
                <p><strong>Submitted At:</strong> ${contactData.submittedAt}</p>
            `
        };
        let info = await transporter.sendMail(mailOptions);
        console.log('Contact notification email sent: %s', info.messageId);
        if (!process.env.SMTP_HOST) { // If using Ethereal
            console.log('Preview URL (Ethereal): %s', nodemailer.getTestMessageUrl(info));
        }
    } catch (error) {
        console.error('Error sending contact notification email:', error);
    }
}

module.exports = { sendEventNotification, sendContactNotification };
