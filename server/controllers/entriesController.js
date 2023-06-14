const router = require('express').Router();
const loginHistory = require('../data/loginHistory');

router.get('/', (req, res) => {
	// console.log('All login attempts:');
	// loginHistory.forEach((x) => console.log(x));
	return res.json(loginHistory);
});

router.delete('/', (req, res) => {
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

router.post('/', (req, res) => {
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

router.get('/:id', (req, res) => {
	const id = req.params.id;
	const index = loginHistory.findIndex((x) => x.code === id);
	if (index !== -1) {
		res.json(loginHistory[index]);
	} else {
		res.json(null);
	}
});

module.exports = router;
