'use strict';

const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const uuid = require('uuid/v4');
const path = require('path');
const app = express();

app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(body.json());
app.use(cookie());

class User {
	constructor(email, password, firstName, lastName, accountType = accountTypes.freelancer){
		this.email = email;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.accountType = accountType;
	}
}

const accountTypes = {
	client:'client',
	freelancer:'freelancer'
};
const users = {
	'd.dorofeev@corp.mail.ru': new User('d.dorofeev@corp.mail.ru', 'password', 'Дмитрий','Дорофеев'),
	's.volodin@corp.mail.ru': new User('s.volodin@corp.mail.ru', 'password', 'Сергей','Володин'),
	'a.ts@corp.mail.ru': new User('a.ts@corp.mail.ru', 'password', 'А','Т'),
	'a.ostapenko@corp.mail.ru': new User('a.ostapenko@corp.mail.ru', 'password', 'А','Остапенко'),
	'nozim@mail.ru': new User('nozim@mail.ru', 'password', 'Nozim','Yunusov'),
};
const ids = {};
const cookieSessionIdName = 'session_id';

app.post('/signup', function (req, res) {
	res.set('Access-Control-Allow-Origin', 'http://localhost:9000');
	res.set('Access-Control-Allow-Credentials', 'true');

	console.log(req.body);

	const password = req.body.password;
	const email = req.body.email;
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const accountType = req.body.accountType;
	const agreement = req.body.agreement;
	if (
		!password || !email || !agreement || !accountType ||
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
	const user = new User(email, password, firstName, lastName, accountType);
	ids[id] = email;
	users[email] = user;

	res.cookie(cookieSessionIdName, id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
	res.status(201).json({id});
});

app.post('/login', function (req, res) {
	res.set('Access-Control-Allow-Origin', 'http://localhost:9000');
	res.set('Access-Control-Allow-Credentials', 'true');

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

	res.cookie(cookieSessionIdName, id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
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

	res.json(users[email]);
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

const port = process.env.PORT || 3000;

app.listen(port, function () {
	console.log(`Server listening port ${port}`);
});
