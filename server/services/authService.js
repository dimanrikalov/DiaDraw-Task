const loginHistory = require('../data/loginHistory');
const registeredUsers = require('../data/registeredUsers');
const pendingRegistrations = require('../data/pendingRegistrations');

const isRegistered = (entry) => {
	return registeredUsers.some(
		(x) => x.email === entry.email && x.phone === entry.phone
	);
};

const addLoginEntry = (entry) => {
	loginHistory.push(entry);
};

const addRegistrationEntry = (entry) => {
	registeredUsers.push(entry);
};

const getRegistrationAttemptIndex = (code) => {
	return pendingRegistrations.findIndex((x) => x.code === code.toString());
};

const getPendingLoginIndex = (code) => {
	return loginHistory.findIndex(
		(x) => x.code === code.toString() && x.status === 'pending'
	);
};

const isRegistrationAttempt = (phone, email) => {
	return registeredUsers.find((x) => x.phone === phone && x.email === email)
		? false
		: true;
};

const getFailedLoginAttempt = (phone, email) => {
	return loginHistory.find(
		(x) => x.phone === phone && x.email === email && x.status === 'failed'
	);
};

const removeFromPendingRegistrations = (index) => {
	return pendingRegistrations.splice(index, 1)[0];
};

const generateVerificationCode = () => {
	const min = 100000; // Minimum 6-digit number (inclusive)
	const max = 999999; // Maximum 6-digit number (inclusive)

	let number = Math.floor(Math.random() * (max - min + 1)) + min;

	//only unique codes within the array
	while (loginHistory.some((x) => x.code === number.toString())) {
		number = Math.floor(Math.random() * (max - min + 1)) + min;
	}

	return number;
};

const generateDateString = () => {
	const date = new Date();
	const dateString = `${
		(date.toLocaleDateString(), date.toLocaleTimeString())
	}`;
	return dateString;
}

module.exports = {
	isRegistered,
	addLoginEntry,
	generateDateString,
	getPendingLoginIndex,
	addRegistrationEntry,
	getFailedLoginAttempt,
	isRegistrationAttempt,
	generateVerificationCode,
	getRegistrationAttemptIndex,
	removeFromPendingRegistrations,
};
