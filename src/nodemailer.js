"use strict";
const nodemailer = require("nodemailer");

const createTransporter = async (conf, log) => {
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
    log.info('transporter was created');
    return transporter
  }catch(e){
      log.error(e);
      log.error("transporter didn't create");
  }
};

const sendMail = async (transporter ,mailOptions, callback) => {
  transporter.sendMail(mailOptions, function (err, info) {
   if(err){
     return callback(err, null);
  }
   else
    return callback(null, info);
  });
};

module.exports = {
  createTransporter,
  sendMail
};
