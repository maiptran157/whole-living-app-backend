const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 5000;
const sqrlDbCreds = require('./config/sql_db_creds')

app.use(cors());
// app.use(express.json());

const connection = mysql.createPool(sqrlDbCreds);

require('./manageSearchData')(app, connection);

// app.get('*', (req, res) => {
//     res.send(resolve(__dirname, 'client', 'dist', 'index.html'));
// })

app.listen(port, () => {
    console.log('server listening on port ' + port);
});
