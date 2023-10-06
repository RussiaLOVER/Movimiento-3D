const express = require('express');
const app = express();
const port = 3000;
app.get('/favicon.ico', (req, res) => res.status(204));
app.use(express.static('public'));


app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
