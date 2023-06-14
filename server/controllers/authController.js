const router = require('express').Router();
const loginHistory = require('../data/loginHistory');
const registeredUsers = require('../data/registeredUsers');
const randomNumberGenerator = require('../services/authService');

router.post('/login', (req, res) => {
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

    const number = randomNumberGenerator(); //for the verification later
    loginHistory.push({
        code: number.toString(),
        ...req.body,
        date: dateString,
        status: 'pending',
    });
    console.log(number);
    res.json(loginHistory[loginHistory.length - 1]);
});

router.post('/verify', (req, res) => {
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

module.exports = router;