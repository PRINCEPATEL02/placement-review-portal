const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Check for credentials
    if (!process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'YOUR_GOOGLE_APP_PASSWORD_HERE') {
        console.log("---------------------------------------------------");
        console.log("EMAIL ERROR: Credentials missing in backend/.env");
        console.log(`Simulated Email To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.message}`);
        console.log("---------------------------------------------------");
        // We throw an error so the controller knows mail wasn't sent, or handle gracefully depending on requirement.
        // For now, let's simulate success if in dev mode but warn.
        if (process.env.NODE_ENV === 'production') {
            throw new Error('Email service not configured.');
        }
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'princespatel2005@gmail.com',
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: 'princespatel2005@gmail.com',
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
