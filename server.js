const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
	let {url} = req;

	if (/\/$/.test(url)) {
		url = `${url}index.html`;
	}

	let body;
	try {
		body = fs.readFileSync(`./public${url}`);
	} catch (e) {
		res.statusCode = 404;
		res.write('404');
		res.end();
		return;
	}

	res.write(body);

	res.end();
});

server.listen(3000);
