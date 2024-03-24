const express = require('express');
const router = express.Router();
const db = require('../db');
const bodyParser = require('body-parser')
const cors = require('cors');
router.use(cors());
router.use(bodyParser.json()) // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


router.get('/programs', (req,res) => {
  db.query(
    'SELECT * FROM programs ORDER BY id ASC',
    (error, rows) => {
        if (error) throw error;
        res.send(rows);
    });
});

module.exports = router;