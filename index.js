const express = require('express');
const { resolve } = require('path');
const cors = require('cors');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

let db;
(async () => {
  db = await open({
    filename: 'database.sqlite',
    driver: sqlite3.Database,
  });
})();


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
