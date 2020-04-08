//Install express server
const express = require('express');
const path = require('path');

const app = express();

/* START SERVE HTML FILE */
app.use(express.static('./dist/'));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '/dist/index.html'));
});
app.listen(process.env.PORT || 8080);
/* END SERVE HTML FILE */
