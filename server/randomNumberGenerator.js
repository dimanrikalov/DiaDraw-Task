const generateRandomNumber = () => {
	const min = 100000; // Minimum 6-digit number (inclusive)
	const max = 999999; // Maximum 6-digit number (inclusive)
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = generateRandomNumber;