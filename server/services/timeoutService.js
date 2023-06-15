const timeouts = [];
const timeoutDuration = 5000;

const addTimeout = (callback, id) => {
	const timeout = setTimeout(callback, timeoutDuration);
	timeouts.push({id, timeout});
    console.log('Timeout with id: ' + id + ' added.');
	return timeout;
};

const removeTimeout = (id) => {
    const timeoutIndex = timeouts.findIndex(x => x.id === id);
    clearTimeout(timeouts[timeoutIndex].timeout);
    const removedTimeout = timeouts.splice(timeoutIndex, 1)[0];
    console.log('Timeout with id: ' + removedTimeout.id + ' removed.');
}

module.exports = {
	addTimeout,
    removeTimeout
};
