const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config();

const mailSender = async (email, title, body) => {
    try{
            let transporter = nodemailer.createTransport({
                host:process.env.MAIL_HOST,
                connectionTimeout: 90000,
                port: 465,
                secure: true,
                auth:{
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                }
            })
            let info = await transporter.sendMail({
                from: 'LMS',
                to:`${email}`,
                subject: `${title}`,
                html: `${body}`,
            })
            return info;
    }
    catch(error) {
        console.log(error.message);
    }
}

module.exports = mailSender;