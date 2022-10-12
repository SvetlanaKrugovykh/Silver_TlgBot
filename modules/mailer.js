const nodemailer = require('nodemailer');

const recipient = 'svetlana@silver-service.com.ua';
const Subject   = 'It`s real mail from tgbot'; 
const text      = 'dfghfghfgh /n sertsertert /n ertertert'; 
const html      = "<b>Hello world?</b>";
const filename  = 'test3.txt';
const path      = '';

const message = {
    from: 'support@silver-service.com.ua',
    to: recipient,
    subject: Subject,
    text: text,
    html: html,
attachments: [{
    filename: filename, 
    path: path
    }] 
};

async function sendmail(message) {

    let transporter = nodemailer.createTransport({
        host: 'nsrv-mx.silver-service.com.ua',
        port: 25,
        secure: false, 
        auth: {
            user: 'support@silver-service.com.ua',
            pass: undefined
        }
    });
    
    let info = await transporter.sendMail(message);
  
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
  
  sendmail(message).catch(console.error); 

  module.exports = { sendmail };