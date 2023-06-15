const loginHistory = require('../data/loginHistory');

const getEntry = (id) => {
	return loginHistory.find((x) => x.code === id);
};

const getAllEntries = () => {
	return loginHistory;
};

const editEntry = (before, after) => {
	const index = loginHistory.findIndex(
		(x) =>
			x.id === before.id &&
			x.email === before.email &&
			x.phone === before.phone &&
			x.date === before.date &&
			x.status === before.status
	);

	if (index !== -1) {
		loginHistory.splice(index, 1, after);
	}
};

const deleteEntry = (entry) => {
	if (Number(entry.id)) {
		const index = loginHistory.findIndex((x) => x.code === entry.id);
		if (index !== -1) {
			loginHistory.splice(index, 1);
		}
	} else {
		const index = loginHistory.findIndex(
			(x) =>
				x.email === entry.email &&
				x.phone === entry.phone &&
				x.date === entry.date &&
				x.status === entry.status
		);
		if (index !== -1) {
			loginHistory.splice(index, 1);
		}
	}
};

module.exports = {
	getEntry,
	editEntry,
	deleteEntry,
	getAllEntries,
};
