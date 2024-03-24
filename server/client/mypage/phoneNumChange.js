const express = require('express');
const router = express.Router();
const db = require('../../db');
const bodyParser = require('body-parser')
const cors = require('cors');
router.use(cors());
router.use(bodyParser.json()) // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

router.post('/phonenumchange', (req, res) => {
  const newPhone = req.body.newPhoneNum;
  const originalPhone = req.body.originalPhoneNum;
  const userId = req.body.userId;

  db.query(
    "UPDATE client SET phone = ? WHERE phone = ? AND id = ?",
    [newPhone, originalPhone, userId],
    (err, result) => {
      if (err) {
          console.log(err);
      } else {
          res.send("reservation 성공")
      }
  }
  );
});

module.exports = router;