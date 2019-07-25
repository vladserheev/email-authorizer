const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const bodyParser = require('body-parser');

const conf = JSON.parse(""+fs.readFileSync("./config.json"));
const port = conf.port;

const core = require('./src/core');
const term = require('./src/workWithTerm');
const nodemailer = require('./src/nodemailer');
const {createLogger} = require('./src/logger');

const log = createLogger(conf.logger);
//const transporter = createTransporter(conf, log);
// console.log(transporter);
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use('/outputs', express.static(__dirname + '/outputs'));
// app.use(function(req, res, next) {
// 	return res.status(404).send('<h3>Стрвница не найдена!</h3>');
// });


app.get('/', function (req, res){
    console.log('ip;', req.ipInfo);
	res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.get('/doCmd/:id', function (req, res, next) {
    console.log('Page ID: ' + req.params.id);
    const data = core.getDataById(req.params.id);
    if(!data){
    	res.sendStatus(404);
    }
    else {
    	res.render('doCmd', {data: data})
    }
});


app.post('/doCmd', async (req, res) => {
    if(!req.body) res.sendStatus(400);
	log.info('.. /doCmd');
	const cmd = req.body.command;
	const id = req.body.id;

	log.info('user id: ' + id);
	log.info('cmd: ' + cmd);

	term(cmd, function(stdout,stderr){
		let result;
		if(!stderr){
			log.info('stdout: ' +  stdout);
			result = 'success';
		}
		else{
			log.error('exec error:' + stderr);
			result = 'err';
		}

        const outputName = core.createFileWithOutput(stdout || stderr, log);

        const data = {
        	output: {
                text: stdout || stderr,
                res: result,
                name: outputName,
				size: core.getFileSize('./outputs/' + outputName + '.txt', log)
            }
        };

		core.writeDataToFile(data, id, log);
		res.send(data);
	});

});

app.post('/sendCmd', async (req, res) => {
	if(!req.body) res.sendStatus(400);
	log.info('.. /sendCmd');
	const transporter = await nodemailer.createTransporter(conf.emailConection, log);

	const id = core.createRandomName(6);

	const data = {
        description: req.body.description,
        email: req.body.email,
        cmd: req.body.cmd,
		commandSendingTime: core.getCurrentDateAndTime(),
		id: id
    };

    log.info(req.body.email + ' - mew user');
    log.info(data);
    log.info(id + ' - new user id');

	core.sendCmdByMail(transporter, data, conf, log, (err, info) => {
		if(err){ // todo
			log.error(err);
		}
		else{
            core.writeDataToFile(data, id, log);
            res.sendStatus(200);
		}

	});
});

app.post('/sendRes', async (req, res) => {
    if (!req.body) res.sendStatus(400);

    log.info(".. /sendRes");

    const isShowFullOut = req.body.isShowFullOut;
	const id = req.body.id;
	const data = core.getDataById(id);
	log.info('working with user: '+ data.email);

    const transporter = await nodemailer.createTransporter(conf.emailConection, log);


	await core.sendResByMail(transporter, data, isShowFullOut, conf, log, (err, info) => {
		if(err){
			log.error(err);
		}
		else{
			log.debug(info);
		}
	});

	await core.sendReport(transporter, data, conf, log, (err, info) => {
		if(err){
            log.error(err);
		}
		else{
            log.debug(info);
		}
	});
});

app.listen(port, function(){
	log.info('server is working on port: ' + port);
});


