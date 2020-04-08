//Install express server
const express = require('express');
const path = require('path');

const app = express();

/* START SERVE HTML FILE */
app.use(express.static('./dist/lyrics-now'));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '/dist/lyrics-now/index.html'));
});
/* END SERVE HTML FILE */
