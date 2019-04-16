const nodemailer = require('./nodemailer');
const fs = require('fs');

const createTransport = async (conf) => {
    const transporter = await nodemailer.createTransporter(conf.emailConection);
    return transporter;
};

const writeDataToFile = (currData, id) => {
    try {
        const data = fs.readFileSync('db.json');
        var json = JSON.parse(data);
        var item = getDataById(id);

        if (!item) {
            console.log(' !! Item with id:' + id + 'not finded ');
            item = {};
        }
        item = {...item, ...currData};
        json[id] = item;

        fs.writeFileSync("db.json", JSON.stringify(json));

        console.log('Data was put to db');
    } catch (e) {
        console.log(e);
    }
};

const createId = () => {
    return Math.floor(Math.random() * 100);
};

// const addFieldToBdItem = (id) => {
//     const allBd = readFile();
//     const data = getDataById(id);
//
// };

const readFile = () => {
    const data = fs.readFileSync('db.json');
    return JSON.parse(data);
};

const getDataById = (id) => {
    const data = readFile();
    //const res = data.id;

    if(data[id]){
        return data[id]
    }else{
        return false
    }
};

const sendResByMail = async (transporter, data, isShowFullOut) => {
    console.log(data);
    var letter;
    if(isShowFullOut !== 'true'){
         letter = `
            Ваша команда была выполнена!
            Ознакомтесь с результатом:
            ${data.output}`;
    }
    else{
         letter = `
            Ваша команда была выполнена!       
            `;
    }

    //data.email = 'serheyev_vladyslav@gymnasium9.kr.ua';


    let mailOptions = {
        from: '"Vlad" <sergeev.vladyslav@gmail.com>', // sender address
        to: data.email, // list of receivers
        subject: "Email authorizer", // Subject line
        text: 'hello', // plain text body
        html: letter // html body
    };

    nodemailer.sendMail(transporter, mailOptions,function(err, info){
        if(err){
            console.log("!! message not sent");
            console.log(err);
            return cb(err, null)
        }
        else{
            console.log('message successfully sent');
            return cb(null, info)
        }
    });
};

const sendReport = async (transporter, data, conf) => {
    const letter = `
    <table style="width:100%">
      <caption>Отчет</caption>
      <tr>
        <td>Пользователь</td>
        <td>${data.email}</td>
      </tr>
      <tr>
        <td>Команда</td>
        <td>${data.cmd}</td>
      </tr>
      <tr>
        <td>Вывод шелла</td>
        <td>${data.output}</td>
      </tr>
       <tr>
        <td>Результат</td>
        <td>${(data.res === 'success') ? 'Успешно' : 'Ошибка'}</td>
      </tr>
       <tr>
        <td>Время отправки команды</td>
        <td>${data.commandSendingTime}</td>
      </tr>
    </table>
    `;

    let mailOptions = {
        from: '"Email authorizer" <conf.emailConection.auth.email>', // sender address
        to: conf.adminEmail, // list of receivers
        subject: "Email authorizer", // Subject line
        text: 'hello', // plain text body
        html: letter // html body
    };

    nodemailer.sendMail(transporter, mailOptions,function(err, info){
        if(err){
            console.log("!! report not sent");
            console.log(err);
            return cb(err, null)
        }
        else{
            console.log('report successfully sent');
            return cb(null, info)
        }
    });
};


const sendCmdByMail = async (transporter, data, conf, host, cb) => {
    //data.email = 'serheyev_vladyslav@gymnasium9.kr.ua';

    const letter = `
    <p>${data.email} Хочет выполнить команду: <b>${data.cmd}</b>
      Обьяснение:
      <p>${data.description}</p>
      Если вы согласны нажмите на <a href="http://${host}/doCmd/${data.id}">ссылку</a>

    `;

    let mailOptions = {
        from: '"Email authorizer" <conf.emailConection.auth.email>', // sender address
        to: conf.adminEmail , // list of receivers /
        subject: "Email authorizer", // Subject line
        text: 'hello', // plain text body
        html: letter // html body
    };

    nodemailer.sendMail(transporter, mailOptions,function(err, info){
        if(err){
            console.log("!! message not sent");
            console.log(err);
            return cb(err, null)
        }
        else{
            console.log('message successfully sent');
            return cb(null, info)
        }
    });
    // return false
};

const getCurrentDateAndTime = () => {

    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return dateTime = date+' '+time;
}

// const getTransporter = async () => {
//     const transporter = getTransporterFromCache() || await nodemailer.createTransporter(conf.emailConection);
// };


module.exports = {createTransport, writeDataToFile, createId, getDataById, sendCmdByMail, sendResByMail, sendReport, getCurrentDateAndTime};
