const router = require('express').Router();
const loginHistory = require('../data/loginHistory');
const registeredUsers = require('../data/registeredUsers');
const randomNumberGenerator = require('../services/authService');
const pendingRegistrations = require('../data/pendingRegistrations');

let timeout = null;

router.post('/register', (req, res) => {
	const data = req.body;

	//validate the data
	if (data.phone.length !== 10) {
		return res.json({ error: 'Invalid phone number!' });
	}

	if (!data.email.includes('@')) {
		return res.json({ error: 'Invalid email!' });
	}

	const phoneAlreadyTaken = registeredUsers.some(
		(x) => x.phone === data.phone
	);
	const emailAlreadyTaken = registeredUsers.some(
		(x) => x.email === data.email
	);
	//don't want to give too much info to the user
	if (phoneAlreadyTaken || emailAlreadyTaken) {
		return res.json({ error: 'Phone no. / email already taken!' });
	}

	//create registration entry
	const registrationEntry = {
		code: number.toString(),
		...req.body,
	};
	pendingRegistrations.push(registrationEntry);

	//create login entry
	//generate a number for the next verification step
	const date = new Date();
	const dateString = `${
		(date.toLocaleDateString(), date.toLocaleTimeString())
	}`;
	const number = randomNumberGenerator();
	while (loginHistory.some((x) => x.code === number)) {
		//only unique codes within the array
		number = randomNumberGenerator();
	}
	const loginEntry = {
		code: number.toString(),
		...req.body,
		date: dateString,
		status: 'pending',
	};
	loginHistory.push(loginEntry);

	//if within 1 minute there is no code entered the login status changes to failed and registration process ends
	timeout = setTimeout(() => {
		loginEntry.status = 'failed';
		const index = pendingRegistrations.findIndex(
			(x) => x === registrationEntry
		);
		pendingRegistrations.splice(index, 1);
	}, 60000);

	return res.json({ code: number });
});

router.post('/login', (req, res) => {
	const date = new Date();
	const dateString = `${
		(date.toLocaleDateString(), date.toLocaleTimeString())
	}`;

	const loginEntry = {
		...req.body,
		date: dateString,
		status: 'failed',
	};

	if (
		!registeredUsers.some(
			(x) => x.email === req.body.email && x.phone === req.body.phone
		)
	) {
		loginHistory.push(loginEntry);
		return res.json({ error: 'Invalid username or password!' });
	}

	let number = randomNumberGenerator(); //for the verification later
	while (loginHistory.some((x) => x.code === number)) {
		//only unique codes within the array
		number = randomNumberGenerator();
	}

	loginEntry.status = 'pending';
	loginEntry.code = number.toString();
	loginHistory.push(loginEntry);
	console.log(number);
	return res.json(loginEntry);
});

router.post('/verify', (req, res) => {
	const loginEntryIndex = loginHistory.findIndex(
		(x) => x.code === req.body.code.toString() && x.status === 'pending'
	); //find if there is a pending login attempt with this code

	if (loginEntryIndex === -1) {
		console.log('Invalid authentication attempt!');
		return res.json({ error: 'Invalid authentication attempt!' });
	}

	clearTimeout(timeout);

	//checks if the current attempt is registration attempt or not
	const registrationEntryIndex = pendingRegistrations.findIndex(
		(x) => x.code === req.body.code
	);

	if (registrationEntryIndex !== -1) {
		const registrationData = pendingRegistrations.splice(
			registrationEntryIndex,
			1
		)[0];
		registeredUsers.push(registrationData);
	}

	loginHistory[loginEntryIndex].status = 'successful';

	registrationEntryIndex
		? console.log('registration successful')
		: console.log('login successful');
	res.json(loginHistory[loginEntryIndex]);
});

module.exports = router;
