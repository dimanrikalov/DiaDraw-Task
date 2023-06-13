const port = 3001;
const express = require('express');
const cors = require('cors');
const generateRandomNumber = require('./randomNumberGenerator');

const app = express();

const registeredUsers = [
	{
		email: 'john.doe@abv.bg',
		phone: '0898696969',
	},
	{
		email: 'hristo.diadraw@mail.com',
		phone: '0123456789',
	},
];
const loginHistory = [];

(function initExpress() {
	app.use(express.json());
	app.use(cors());

	app.post('/login', (req, res) => {
		const date = new Date();
		const dateString = `${
			(date.toLocaleDateString(), date.toLocaleTimeString())
		}`;

		if (
			!registeredUsers.some(
				(x) => x.email === req.body.email && x.phone === req.body.phone
			)
		) {
			loginHistory.push({
				...req.body,
				date: dateString,
				status: 'failed',
			});
			return res.json({ error: 'Invalid username or password!' });
		}

		const number = generateRandomNumber(); //for the verification later
		loginHistory.push({
			code: number.toString(),
			...req.body,
			date: dateString,
			status: 'pending',
		});
		console.log(number);
		res.json(loginHistory[loginHistory.length - 1]);
	});

	app.post('/verify', (req, res) => {
		const isValid = loginHistory.some(
			(x) => req.body.code === x.code && x.status === 'pending'
		); //find if there is a pending login attempt with this code (idk how secure it is)

		if (isValid) {
			loginHistory[loginHistory.length - 1].status = 'successful';
			console.log('login successful');
			res.json(req.body.code);
		} else {
			console.log('login failed');
			res.json(null);
		}
	});

	app.get('/login-entries', (req, res) => {
		// console.log('All login attempts:');
		// loginHistory.forEach((x) => console.log(x));
		return res.json(loginHistory);
	});

	app.delete('/login-entries', (req, res) => {
		const id = req.body.id;
		if (Number(id)) {
			const index = loginHistory.findIndex((x) => x.code === id);
			if (index !== -1) {
				loginHistory.splice(index, 1);
			}
		} else {
			const index = loginHistory.findIndex(
				(x) =>
					x.email === req.body.email &&
					x.phone === req.body.phone &&
					x.date === req.body.date &&
					x.status === req.body.status
			);
			if (index !== -1) {
				loginHistory.splice(index, 1);
			}
		}

		return res.json(loginHistory);
	});

	app.post('/login-entries', (req, res) => {
		const { before, after } = req.body;
		const index = loginHistory.findIndex(
			(x) =>
				x.email === before.email &&
				x.phone === before.phone &&
				x.date === before.date &&
				x.status === before.status
		);

		if (index !== -1) {
			loginHistory.splice(index, 1, after);
		}

		return res.json(loginHistory);
	});

	app.get('/:id', (req, res) => {
		const id = req.params.id;
		const index = loginHistory.findIndex((x) => x.code === id);
		if (index !== -1) {
			res.json(loginHistory[index]);
		} else {
			res.json(null);
		}
	});

	app.listen(port, () => {
		console.log(`Server is listening on port ${port}...`);
	});
})();
