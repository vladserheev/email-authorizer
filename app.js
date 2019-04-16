const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const conf = JSON.parse(""+fs.readFileSync("./config.json"));
const port = conf.port;
const bodyParser = require('body-parser');

const term = require('./src/workWithTerm');
const nodemailer = require('./src/nodemailer');
const core = require('./src/core');

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
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


app.post('/doCmd', (req, res) => {
    if(!req.body) res.sendStatus(400);

	const cmd = req.body.command;
	const id = req.body.id;

	term(cmd, function(stdout,stderr){
		let result;
		if(!stderr){
			console.log(`stdout: ${stdout}`);
			result = 'success';
		}
		else{
			console.error(`exec error: ${stderr}`);
			result = 'err';
		}
		const data = {
			output: stdout || stderr,
			res: result
		};

		core.writeDataToFile(data, id);
		res.send(data);
	});

});

app.post('/sendCmd', async (req, res) => {
	if(!req.body) res.sendStatus(400);
    console.log(req.headers);

	const transporter = await nodemailer.createTransporter(conf.emailConection);

	if(transporter){
		console.log('transporter created');
		res.sendStatus(400);
	}

	const id = core.createId();
	const host = req.headers.host;
	console.log('host: ' + host);
	console.log('new data id:  ' + id);
	const data = {
        description: req.body.description,
        email: req.body.email,
        cmd: req.body.cmd,
		commandSendingTime: core.getCurrentDateAndTime(),
		id: id
    };

	core.sendCmdByMail(transporter, data, conf, host,(err, info) => {
		if(err){ // todo
			console.log('err');
		}
		else{
            core.writeDataToFile(data, id);
            res.sendStatus(200);
		}

	});
});

app.post('/sendRes', async (req, res) => {
    if (!req.body) res.sendStatus(400);

    const isShowFullOut = req.body.isShowFullOut;
	const id = req.body.id;
	const data = core.getDataById(id);

    const transporter = await nodemailer.createTransporter(conf.emailConection);

	core.sendResByMail(transporter, data, isShowFullOut, (err, info) => {
		if(err){
			res.sendStatus(400);
		}
		else{
			res.sendStatus(200);
		}
	});

	core.sendReport(transporter, data, conf, (err, info) => {
		if(err){
			res.sendStatus(400);
		}
		else{
			res.sendStatus(200);
		}
	});
});

app.listen(port, function(){
	console.log('server is working on port: ' + port);
});


