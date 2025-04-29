import app from './app.js';

const port = process.env.PORT || 8901;

app.listen(port, () => console.log(` FLAI API listening on port ${port}... `));