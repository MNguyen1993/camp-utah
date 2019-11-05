const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.ADMIN_EMAIL,
        subject: 'Welcome!',
        text: `Welcome to CampUtah, ${name}. We hope to make your next trip to the outdoors as easy as can be with CampUtah!`
    })
}

const sendGoodbyeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.ADMIN_EMAIL,
        subject: 'Is it Really Time to Say Goodbye?',
        text: `${name} we're sad to see you go! Please let us know what we need to improve, that way we can make your next experience better!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
}