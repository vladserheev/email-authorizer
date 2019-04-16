"use strict";
const nodemailer = require("nodemailer");

const createTransporter = async (conf) => {
  try{
  let transporter = nodemailer.createTransport({
    //host: "smtp.gmail.com",
    host: conf.host,
    port: conf.port,
    secure: conf.source,
  //secure: true,// true for 465, false for other ports
    auth: {
      user: conf.auth.email, // generated ethereal user
      pass: conf.auth.pass // generated ethereal password
    }
  });
  return transporter
}catch(e){
  console.log("transporter didn't create");
}
};

const sendMail = async (transporter ,mailOptions, callback) => {
  // const output = `
  // <p>${data.email} Хочет выполнить эту команду <b>${data.cmd}</b>
  //   Обьяснение:
  //   <p>${data.description}</p>
  //   Если вы согласны нажмите на <a href="http://localhost:3000/doCmd/${id}">ссылку</a>
  //
  // `
  //
  //
  // let mailOptions = {
  //   from: '"Vlad" <sergeev.vladyslav@gmail.com>', // sender address
  //   to: data.email, // list of receivers
  //   subject: "Hello ✔", // Subject line
  //   text: 'hello', // plain text body
  //   html: output // html body
  // };

  transporter.sendMail(mailOptions, function (err, info) {
   if(err){
     return callback(err, null);
  }
   else
    return callback(null, info);
  });
  // console.log("Message sent: %s", info.messageId);
  // // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

module.exports = {
  createTransporter,
  sendMail
};

// async..await is not allowed in global scope, must use a wrapper
// async function main(){

//   // Generate test SMTP service account from ethereal.email
//   // Only needed if you don't have a real mail account for testing
//   //let account = await nodemailer.createTestAccount();

//   // create reusable transporter object using the default SMTP transport
  

//   // setup email data with unicode symbols
//   let mailOptions = {
//     from: '"Vlad" <sergeev.vladyslav@gmail.com>', // sender address
//     to: "serheyev_vladyslav@gymnasium9.kr.ua", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>" // html body
//   };

//   // send mail with defined transport object
//   let info = await transporter.sendMail(mailOptions)

//   transporter.sendMail(mailOptions, function (err, info) {
//    if(err)
//      console.log(err)
//    else
//      console.log(info);
// });

//   console.log("Message sent: %s", info.messageId);
//   // Preview only available when sending through an Ethereal account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
//   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// }

// main().catch(console.error);