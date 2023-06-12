const port = 3001;
const express = require('express');
const cors = require('cors');
const generateRandomNumber = require('./randomNumberGenerator');

const app = express();
const logins = [];
let timeout = null;

(function initExpress() {
	app.use(cors());
	app.use(express.json());

	app.post('/login', (req, res) => {
		const number = generateRandomNumber();
		logins.push({ [number]: req.body });
		console.log(logins[logins.length - 1]);
		res.json(logins[logins.length - 1]);
        const date = new Date();
        console.log(`Timer started: ${date.getHours()} ${date.getMinutes()} ${date.getSeconds()}`);
        timeout = setTimeout(()=> { //remove from login array if code not entered within 60 sec
            logins.pop();
            res.json()
        },60000);
	});

    app.post('/verify', (req, res) => {
        const lastKey = Object.keys(logins[logins.length - 1])[0];
        if(req.body.code === lastKey) {
            clearTimeout(timeout);
            console.log('login successful');
            res.json(lastKey);
        } else {
            console.log('login failed');
            res.json(null);
        }
    })

    app.get('/:id', (req, res) => {
        const id = req.params.id;
        if(Object.keys(logins[logins.length - 1])[0] === id) {
            res.json(logins[logins.length - 1]);
        } else {
            res.json(null);
        }
    })

	app.listen(port, () => {
		console.log(`Server is listening on port ${port}...`);
	});
})();
