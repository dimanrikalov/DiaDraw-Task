const router = require('express').Router();
const loginHistory = require('../data/loginHistory');
const authService = require('../services/authService');
const registeredUsers = require('../data/registeredUsers');
const timeoutService = require('../services/timeoutService.js');
const pendingRegistrations = require('../data/pendingRegistrations');

router.post('/register', (req, res) => {
	const data = req.body;

	//validate the data
	if (data.phone.length !== 10) {
		return res.json({ error: 'Invalid phone number!' });
	}
	if (!data.email.includes('@')) {
		return res.json({ error: 'Invalid email!' });
	}

	//create login entry and add entry to the login table
	const number = authService.generateVerificationCode();
	const dateString = authService.generateDateString();
	const loginEntry = {
		code: number.toString(),
		...req.body,
		date: dateString,
		status: 'failed',
	};
	authService.addLoginEntry(loginEntry);

	//check if email or phone is already taken
	const phoneAlreadyTaken = registeredUsers.some(
		(x) => x.phone === data.phone
	);
	const emailAlreadyTaken = registeredUsers.some(
		(x) => x.email === data.email
	); //don't want to give too much info to the user
	if (phoneAlreadyTaken || emailAlreadyTaken) {
		return res.json({ error: 'Phone no. / email is already taken!' });
	}

	//create registration entry and add entry to the pending registrations
	const registrationEntry = {
		code: number.toString(),
		...req.body,
	};
	pendingRegistrations.push(registrationEntry);

	//if within 1 minute there is no code entered the login status changes to failed and registration process ends
	loginEntry.status = 'pending';
	timeoutService.addTimeout(() => {
		loginEntry.status = 'failed';
		const index = pendingRegistrations.findIndex(
			(x) => x === registrationEntry
		);
		pendingRegistrations.splice(index, 1);
		console.log('Verification code expired!');
	}, number.toString());

	return res.json({ code: number.toString() });
});

router.post('/login', (req, res) => {
	const dateString = authService.generateDateString();

	const loginEntry = {
		...req.body,
		date: dateString,
		status: 'failed',
	};

	//check if user is already registered
	if (!authService.isRegistered(req.body)) {
		authService.addLoginEntry(loginEntry);
		return res.json({ error: 'Invalid username or password!' });
	}

	//setup for the verification later
	const number = authService.generateVerificationCode();
	loginEntry.status = 'pending';
	loginEntry.code = number.toString();
	authService.addLoginEntry(loginEntry);
	timeoutService.addTimeout(() => {
		loginEntry.status = 'failed';
		console.log('Verification code expired!');
	}, number.toString());

	return res.json({ code: number.toString() });
});

router.post('/verify', (req, res) => {
	const code = req.body.code;

	const loginEntryIndex = authService.getPendingLoginIndex(code);
	if (loginEntryIndex === -1) {
		console.log('/Verfiy Invalid authentication attempt!');
		console.log(loginHistory[loginEntryIndex]);
		return res.json({ error: 'Invalid authentication attempt!' });
	}

	timeoutService.removeTimeout(code);

	//checks if the current attempt is registration attempt or not
	const registrationEntryIndex =
		authService.getRegistrationAttemptIndex(code);
	if (registrationEntryIndex !== -1) {
		const registrationEntry = authService.removeFromPendingRegistrations(
			registrationEntryIndex
		);
		authService.addRegistrationEntry(registrationEntry);
	}

	loginHistory[loginEntryIndex].status = 'successful';

	res.json(loginHistory[loginEntryIndex]);
});

router.post('/reset-code', (req, res) => {
	const { phone, email } = req.body;

	//check for failed login entries with these credentials
	const failedLoginEntry = authService.getFailedLoginAttempt(phone, email);
	if (!failedLoginEntry) {
		return res.json({ error: 'Invalid authentication attempt!' });
	}

	const isRegistrationAttempt = authService.isRegistrationAttempt(
		phone,
		email
	);

	//set the attempt status to pending again
	const number = authService.generateVerificationCode();
	const newPendingRegistrationEntry = {
		code: number.toString(),
		phone,
		email,
	};
	if (isRegistrationAttempt) {
		pendingRegistrations.push(newPendingRegistrationEntry);
	}

	failedLoginEntry.code = number.toString();
	failedLoginEntry.status = 'pending';

	//add a new timeout
	if (isRegistrationAttempt) {
		timeoutService.addTimeout(() => {
			failedLoginEntry.status = 'failed';
			const index = pendingRegistrations.findIndex(
				(x) => x === newPendingRegistrationEntry
			);
			pendingRegistrations.splice(index, 1);
			console.log('Verification code expired!');
		}, number.toString());
	} else {
		timeoutService.addTimeout(() => {
			failedLoginEntry.status = 'failed';
			console.log('Verification code expired!');
		}, number.toString());
	}

	return res.json({ code: number.toString() });
});

module.exports = router;
