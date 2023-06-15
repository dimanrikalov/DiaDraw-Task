const router = require('express').Router();
const entriesService = require('../services/entriesService');

router.get('/', (req, res) => {
	const loginHistory = entriesService.getAllEntries();
	return res.json(loginHistory);
});

router.delete('/', (req, res) => {
	const entry = req.body;
	entriesService.deleteEntry(entry);
	const loginHistory = entriesService.getAllEntries();
	return res.json(loginHistory);
});

router.post('/', (req, res) => {
	const { before, after } = req.body;
	entriesService.editEntry(before, after);
	const loginHistory = entriesService.getAllEntries();
	return res.json(loginHistory);
});

router.get('/:id', (req, res) => {
	const id = req.params.id;
	const entry = entriesService.getEntry(id);
	if (entry) {
		res.json(entry);
	} else {
		res.json(null);
	}
});

module.exports = router;
