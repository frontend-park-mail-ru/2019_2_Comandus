'use strict';

const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const uuid = require('uuid/v4');
const path = require('path');
const app = express();

app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(body.json());
app.use(cookie());

class FreelancerAccount {

}

class ClientAccount {

}

class User {
	constructor(email, password, firstName, secondName){
		this.email = email;
		this.password = password;
		this.firstName = firstName;
		this.secondName = secondName;
		this.notificationSettings = {
			newMessages: false,
			newProjects: false,
			news: false,
		};
		this.authHistory = []
	}
}

const freelancers = [
	{
		id: 'freelancerId',
		accountId: "nozim@mail.ru",
	}
];
const clients = [
	{
		id: 'clientId',
		accountId: "nozim@mail.ru",
		company: {
			name:'Company name',
			site:'',
			tagLine:'',
			description:''
		},
		companyContacts: {
			country:'',
			city: '',
			address:'',
			phone:''
		},
		financeData: {}
	}
];

const accountTypes = {
	client:'client',
	freelancer:'freelancer'
};
const users = {
	'd.dorofeev@corp.mail.ru': new User('d.dorofeev@corp.mail.ru', 'password', 'Дмитрий','Дорофеев'),
	's.volodin@corp.mail.ru': new User('s.volodin@corp.mail.ru', 'password', 'Сергей','Володин'),
	'a.ts@corp.mail.ru': new User('a.ts@corp.mail.ru', 'password', 'А','Т'),
	'a.ostapenko@corp.mail.ru': new User('a.ostapenko@corp.mail.ru', 'password', 'А','Остапенко'),
	'nozim@mail.ru': new User('nozim@mail.ru', '1234', 'Nozim','Yunusov'),
};
const ids = {};
const cookieSessionIdName = 'session_id';
const cookieAccountModeName = 'account_mode';

app.post('/signup', function (req, res) {
	res.set('Access-Control-Allow-Origin', 'http://localhost:9000');
	res.set('Access-Control-Allow-Credentials', 'true');

	console.log(req.body);

	const password = req.body.password;
	const email = req.body.email;
	const firstName = req.body.firstName;
	const secondName = req.body.secondName;
	const accountType = req.body.accountType;
	const agreement = req.body.agreement;
	if (
		!password || !email || !accountType ||
		!password.match(/^\S{4,}$/) ||
		!email.match(/@/) ||
		!(accountType === accountTypes.client || accountType === accountTypes.freelancer)
	) {
		return res.status(400).json({error: 'Не валидные данные пользователя'});
	}
	if (users[email]) {
		return res.status(400).json({error: 'Пользователь уже существует'});
	}

	const id = uuid();
	const user = new User(email, password, firstName, secondName);
	ids[id] = email;
	users[email] = user;

	switch (accountType) {
		case accountTypes.freelancer:
			freelancers.push({accountId: email, id: 'freelancerId1'});

			res.cookie(cookieAccountModeName, accountTypes.freelancer);
			break;
		case accountTypes.client:
			clients.push({id:'clientId1', accountId: email, company: {name: ''}});

			res.cookie(cookieAccountModeName, accountTypes.client);
			break;
	}

	res.cookie(cookieSessionIdName, id, {expires: new Date(Date.now() + 1000 * 60 * 10), httpOnly: true});
	res.status(201).json({id});
});

app.post('/login', function (req, res) {
	res.set('Access-Control-Allow-Origin', 'http://localhost:9000');
	res.set('Access-Control-Allow-Credentials', 'true');

	console.log(req.body);
	const password = req.body.password;
	const email = req.body.email;
	if (!password || !email) {
		return res.status(400).json({error: 'Не указан E-Mail или пароль'});
	}
	if (!users[email] || users[email].password !== password) {
		return res.status(400).json({error: 'Не верный E-Mail и/или пароль'});
	}

	const id = uuid();
	ids[id] = email;

	res.cookie(cookieSessionIdName, id, {expires: new Date(Date.now() + 1000 * 60 * 10), httpOnly: true}, );
	res.status(200).json({id});
});

app.post('/logout', function (req, res) {
	res.set('Access-Control-Allow-Origin', 'http://localhost:9000');
	res.set('Access-Control-Allow-Credentials', 'true');


	const id = req.cookies[cookieSessionIdName];
	const email = ids[id];
	if (!email || !users[email]) {
		return res.status(401).end();
	}

	delete ids[id];

	res.cookie(cookieSessionIdName, id, {expires: new Date(0), httpOnly: true});

	res.json({});
});

app.get('/freelancers/:id', function (req, res) {
	res.set('Access-Control-Allow-Origin', 'http://localhost:9000');
	res.set('Access-Control-Allow-Credentials', 'true');

	const id = req.cookies[cookieSessionIdName];
	const email = ids[id];
	if (!email || !users[email]) {
		return res.status(401).end();
	}

	res.json(users[email]);
});

app.get('/settings', function (req, res) {
	res.set('Access-Control-Allow-Origin', 'http://localhost:9000');
	res.set('Access-Control-Allow-Credentials', 'true');

	const id = req.cookies[cookieSessionIdName];
	const email = ids[id];
	if (!email || !users[email]) {
		return res.status(401).end();
	}

	const mode = req.cookies[cookieAccountModeName];

	const user = {...users[email]};

	switch (mode) {
		case accountTypes.client:
			user.client = clients.find(el => el.accountId === email);
			break;
		case accountTypes.freelancer:
		default:
			user.freelancer = freelancers.find(el => el.accountId === email);
			res.cookie(cookieAccountModeName, accountTypes.freelancer);
	}

	res.json(user);
});

app.get('/account', function (req, res) {
	res.set('Access-Control-Allow-Origin', 'http://localhost:9000');
	res.set('Access-Control-Allow-Credentials', 'true');

	const id = req.cookies[cookieSessionIdName];
	const email = ids[id];
	if (!email || !users[email]) {
		return res.status(401).end();
	}

	const user = {...users[email]};
	user.freelancer = freelancers.find(el => el.accountId === email);
	user.client = clients.find(el => el.accountId === email);

	res.json(user);
});

function optionsHandler(req, res) {
	const Origin = req.get('Origin');
	const AccessControlRequestMethod = req.get('Access-Control-Request-Method');
	const AccessControlRequestHeaders = req.get('Access-Control-Request-Headers');
	console.log({
		Origin,
		AccessControlRequestMethod,
		AccessControlRequestHeaders,
	});

	res.set('Access-Control-Allow-Origin', 'http://localhost:9000');
	res.set('Access-Control-Allow-Methods', 'POST,PUT');
	res.set('Access-Control-Allow-Headers', 'Content-Type,X-Lol');
	res.set('Access-Control-Allow-Credentials', 'true');

	res.status(204).end();
}

app.options('/login', optionsHandler);
app.options('/signup', optionsHandler);
app.options('/logout', optionsHandler);
app.options('/settings', optionsHandler);
app.options('/account', optionsHandler);
app.options('/', optionsHandler);

const port = process.env.PORT || 3000;

app.listen(port, function () {
	console.log(`Server listening port ${port}`);
});
