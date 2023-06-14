const port = 3001;
const cors = require('cors');
const express = require('express');
const router = require('./router');

const app = express();

(function initExpress() {
	app.use(express.json());
	app.use(cors());

	app.use(router);

	app.listen(port, () => {
		console.log(`Server is listening on port ${port}...`);
	});
})();
