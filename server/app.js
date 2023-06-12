const port = 3001;
const express = require('express');
const app = express();
const cors = require('cors');

(function initExpress() {
    app.use(cors());
	app.use(express.json());
	app.post('/login', (req, res) => {
        console.log(req.body);
        res.json({
            ...req.body
        })
    });

	app.listen(port, () => {
		console.log('Server is listening on port 3000...');
	});
})();
