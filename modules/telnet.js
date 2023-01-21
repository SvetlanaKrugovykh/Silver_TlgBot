const net = require('net');
const { HOST, username, password, cliArray, searchStr } = require('../data/telnet.model');
const PORT = 23; // Telnet port

export let store = [];
let authorized = false;
let i = 0;

const client = new net.Socket();

client.connect(PORT, HOST, () => {
	console.log('Connected to network device');
});

let buffer = '';

client.on('data', (data) => {
	buffer += data.toString().trim();
	if (buffer.includes('Username:')) {
		client.write(username);
	} else if (buffer.startsWith('Password:')) {
		client.write(password);
		authorized = true;
	} else {
		if (authorized && (buffer.length > 1)) {
			if (i === cliArray.length) {
				if (buffer.includes(searchStr)) store.push(buffer);
				client.on('close', () => {
					console.log('Connection closed');
					console.dir(store);
				});
			}
			if (buffer.includes(searchStr)) store.push(buffer);
			client.write(cliArray[i] + '\n');
			i++;
		}
	}

	buffer = '';
});

