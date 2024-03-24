const express = require('express');
const router = express.Router();
const db = require('../../db');
const bodyParser = require('body-parser')
const cors = require('cors');
router.use(cors());
router.use(bodyParser.json()) // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

router.post('/passwdchange', (req, res) => {
  const originPasswd = req.body.originPasswd;
  const password = req.body.password;
  const userId = req.body.userId;

  db.query(
    "UPDATE client SET passwd = ? WHERE passwd = ? AND id = ?",
    [originPasswd, password, userId],
    (err, result) => {
      if (err) {
          console.log(err);
      } else {
          res.send("비밀번호 변경 완료")
      }
  }
  );
});

module.exports = router;