const nodemailer = require('./nodemailer');
const fs = require('fs');
const crypto = require('crypto');

const createTransport = async (conf) => {
    const transporter = await nodemailer.createTransporter(conf.emailConection);
    return transporter;
};

const writeDataToFile = (currData, id, log) => {
    try {
        const data = fs.readFileSync('db.json');
        var json = JSON.parse(data);
        var item = getDataById(id);

        if (!item) {
            log.info(' !! Item with id:' + id + ' not finded');
            item = {};
        }
        item = {...item, ...currData};
        json[id] = item;

        fs.writeFileSync("db.json", JSON.stringify(json));

        log.info('Data was put to db');
    } catch (e) {
        log.error(e);
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

const sendResByMail = async (transporter, data, isShowFullOut, conf, log, cb) => {
    log.info('sending result...');
    var letter;
    const path = 'http://' + conf.host + ':' + conf.port + '/outputs/' + data.output.name + '.txt';
    if(isShowFullOut !== 'true'){
         letter = `
            Ваша команда была выполнена!
            Ознакомтесь с результатом:
            ${(data.output.size > conf.maxOutputSize) ? path : data.output.text}`;
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
            log.error("!! message not sent");
            log.error(err);
            return cb(err, null)
        }
        else{
            log.info('message successfully sent to' + data.email);
            return cb(null, info)
        }
    });
};

const sendReport = async (transporter, data, conf, log, cb) => {
    try {
        const path = 'http://' + conf.host + ':' + conf.port + '/outputs/' + data.output.name + '.txt';
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
        <td>${(data.output.size > conf.maxOutputSize) ? path : data.output.text}</td>
      </tr>
       <tr>
        <td>Результат</td>
        <td>${(data.output.res === 'success') ? 'Успешно' : 'Ошибка'}</td>
      </tr>
       <tr>
        <td>Время отправки команды</td>
        <td>${data.commandSendingTime}</td>
      </tr>
    </table>
    `;

        let mailOptions = {
            from: '"Email authorizer" <conf.emailConection.auth.email>', // sender address
            to: conf.adminEmail + 'tttttt', // list of receivers
            subject: "Email authorizer", // Subject line
            text: 'hello', // plain text body
            html: letter // html body
        };

        await nodemailer.sendMail(transporter, mailOptions, function (err, info) {
            if (err) {
                log.error("!! report not sent");
                return cb(err, null)
            }
            else {
                log.info('report successfully sent to ' + conf.adminEmail);
                return cb(null, info)
            }
        });
    }catch(e){
        log.error("!! report not sent");
        return cb(e, null)
    }

};


const sendCmdByMail = async (transporter, data, conf, log, cb) => {
    try {
        const path = 'http://' + conf.host + ':' + conf.port + '/doCmd/' + data.id;

        const letter = `
    <p>${data.email} Хочет выполнить команду: <b>${data.cmd}</b>
      Обьяснение:
      <p>${data.description}</p>
      Если вы согласны нажмите на <a href=${path}>ссылку</a>`;

        let mailOptions = {
            from: '"Email authorizer" <conf.emailConection.auth.email>', // sender address
            to: conf.adminEmail, // list of receivers /
            subject: "Email authorizer", // Subject line
            text: 'hello', // plain text body
            html: letter // html body
        };

        nodemailer.sendMail(transporter, mailOptions, function (err, info) {
            if (err) {
                log.error("!! message not sent");
                return cb(err, null)
            }
            else {
                log.info('message successfully sent');
                return cb(null, info)
            }
        });
    }catch(e){
        return cb(e, null)
    }
};

const getCurrentDateAndTime = () => {

    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date+' '+time;
};

const createFileWithOutput = (data, log) => {
    try{
        const randName = createRandomName(6);
        const path = './outputs/'+randName+'.txt';
        fs.writeFileSync(path, data, 'utf8');
        return randName
    }catch (e) {
        log.error("data wasn't writted to file");
        log.error(e);
    }
};

const createRandomName = (len) => {
    return crypto
        .randomBytes(Math.ceil((len * 3) / 4))
        .toString('base64')
        .slice(0, len)
        .replace(/\+/g, '0')
        .replace(/\//g, '0')
};

const getFileSize = (fileName, log) => {
    try{
        const stat = fs.statSync(fileName);
        return stat.size
    }catch(e){
        log.error(e);
    }
};

module.exports = {createTransport, writeDataToFile, createId, getDataById, sendCmdByMail, sendResByMail, sendReport, getCurrentDateAndTime, createFileWithOutput, getFileSize, createRandomName};
