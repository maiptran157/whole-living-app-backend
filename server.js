const express = require('express');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 5000;
const sqrlDbCreds = require('./config/sql_db_creds')

app.use(cors());
// app.use(express.json());

const connection = mysql.createPool(sqrlDbCreds);

require('./manageSearchData')(app, connection);

// app.use(express.static(path.join(__dirname, 'build')));

// app.get('/', function(req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

app.listen(port, () => {
    console.log('server listening on port ' + port);
});
