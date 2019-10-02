const express = require("express");

const app = express();
app.use(express.static(`${__dirname}/dist/`));
app.use((req, res) => res.sendFile(`${__dirname}/dist/index.html`));
app.listen(3000);
