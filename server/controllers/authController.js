const router = require('express').Router();
const authService = require('../services/authService');
const timeoutService = require('../services/timeoutService.js');

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
	const phoneAlreadyTaken = authService.isAlreadyTaken('phone', data.phone);
	const emailAlreadyTaken = authService.isAlreadyTaken('email', data.email);
	if (phoneAlreadyTaken || emailAlreadyTaken) {
		return res.json({ error: 'Phone no. / email is already taken!' });
	}

	//create registration entry and add entry to the pending registrations
	const registrationEntry = {
		code: number.toString(),
		...req.body,
	};
	authService.addPendingRegistrationEntry(registrationEntry);

	//if within 1 minute there is no code entered the login status changes to failed and registration process ends
	loginEntry.status = 'pending';
	timeoutService.addTimeout(
		() => {
			loginEntry.status = 'failed';
			authService.removePendingRegistrationEntry(registrationEntry);
			console.log('Verification code expired!');
		},
		number.toString(),
		data.phone,
		data.email
	);

	return res.json({ code: number.toString() });
});

router.post('/login', (req, res) => {
	const data = req.body;
	//validate the data
	if (data.phone.length !== 10) {
		return res.json({ error: 'Invalid phone number!' });
	}
	if (!data.email.includes('@')) {
		return res.json({ error: 'Invalid email!' });
	}

	const dateString = authService.generateDateString();

	const loginEntry = {
		...data,
		date: dateString,
		status: 'failed',
	};

	//check if user is already registered

	const isRegistered = authService.isRegistered(data);
	if (!isRegistered) {
		authService.addLoginEntry(loginEntry);
		return res.json({ error: 'Invalid username or password!' });
	}

	//setup for the verification later
	const number = authService.generateVerificationCode();
	loginEntry.status = 'pending';
	loginEntry.code = number.toString();
	authService.addLoginEntry(loginEntry);
	timeoutService.addTimeout(
		() => {
			loginEntry.status = 'failed';
			console.log('Verification code expired!');
		},
		number.toString(),
		data.phone,
		data.email
	);

	return res.json({ code: number.toString() });
});

router.post('/verify', (req, res) => {
	const { code, phone, email } = req.body;
	const loginEntry = authService.getPendingLogin(code);
	if (!loginEntry) {
		return res.json({ error: 'Invalid verification code!' });
	}

	const error = timeoutService.removeTimeout(code, phone, email);
	if (error) {
		return res.json({ error });
	}
	loginEntry.status = 'successful';

	//checks if the current attempt is registration attempt or not
	const isRegistrationAttempt = !authService.isPendingRegistrationEntry(code);
	if (!isRegistrationAttempt) {
		authService.addRegistrationEntry({
			code,
			phone: loginEntry.phone,
			email: loginEntry.email,
		});
	}

	res.json(loginEntry);
});

router.post('/reset-code', (req, res) => {
	const { phone, email } = req.body;
	const number = authService.generateVerificationCode();
	//check for failed login entries with these credentials
	const failedLoginEntry = authService.getFailedLoginAttempt(phone, email);
	if (!failedLoginEntry) {
		return res.json({ error: 'Invalid authentication attempt!' });
	}
	failedLoginEntry.code = number.toString();
	failedLoginEntry.status = 'pending';

	const isRegistrationAttempt = authService.isRegistered({ phone, email })
		? false
		: true;

	//set the attempt status to pending again

	const newPendingRegistrationEntry = {
		code: number.toString(),
		phone,
		email,
	};
	if (isRegistrationAttempt) {
		authService.addPendingRegistrationEntry(newPendingRegistrationEntry);
	}

	//add a new timeout
	if (isRegistrationAttempt) {
		timeoutService.addTimeout(
			() => {
				failedLoginEntry.status = 'failed';
				authService.removePendingRegistrationEntry(
					newPendingRegistrationEntry
				);
				console.log('Verification code expired!');
			},
			number.toString(),
			phone,
			email
		);
	} else {
		timeoutService.addTimeout(
			() => {
				failedLoginEntry.status = 'failed';
				console.log('Verification code expired!');
			},
			number.toString(),
			phone,
			email
		);
	}

	return res.json({ code: number.toString() });
});

module.exports = router;
