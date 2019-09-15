const root = document.getElementById('root');

const div = document.createElement('div');
div.innerText = 'Hello 1';

setTimeout(() => {
	root.appendChild(div);
}, 1000);
