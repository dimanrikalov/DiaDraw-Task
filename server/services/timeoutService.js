const timeouts = [];
const timeoutDuration = 60000;

const addTimeout = (callback, id, phone, email) => {
	const timeout = setTimeout(callback, timeoutDuration);
	timeouts.push({ id, timeout, phone, email });
	console.log('Timeout with id: ' + id + ' added.');
	return timeout;
};

const removeTimeout = (id, phone, email) => {
	const timeoutIndex = timeouts.findIndex(
		(x) => x.id === id && x.phone === phone && x.email === email
	);
	if (timeoutIndex === -1) {
		return 'Invalid verification code';
	}
	clearTimeout(timeouts[timeoutIndex].timeout);
	const removedTimeout = timeouts.splice(timeoutIndex, 1)[0];
	console.log('Timeout with id: ' + removedTimeout.id + ' removed.');
};

module.exports = {
	addTimeout,
	removeTimeout,
};
