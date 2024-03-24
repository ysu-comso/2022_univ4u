const express = require('express');
const router = express.Router();
const db = require('../db');
const bodyParser = require('body-parser')
const cors = require('cors');
router.use(cors());
router.use(bodyParser.json()) // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


router.post('/signup', (req, res) => {
  const phone = req.body.phoneNum;
  const name = req.body.name;
  const passwd = req.body.password;
  const birth = req.body.birthday;
  const gender = req.body.gender;
  const std = req.body.studentsConfirm;
  const consent = req.body.marketing;

  db.query(
      "INSERT INTO client (phone, name, passwd, birth, gender, std, consent) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [phone, name, passwd, birth, gender, std, consent],
      (err, result) => {
          if (err) {
              console.log(err);
          } else {
              res.send("signup 성공")
          }
      }
  )
})

router.post('/phoneNumCheck', (req, res) => {
    const phone = req.body.phoneNum;
  
    db.query(
        "SELECT * FROM client WHERE phone = ?",
        [phone],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                if (result.length > 0) {
                    res.send("1"); // 결과가 존재하는 경우
                } else {
                    res.send("0"); // 결과가 없는 경우
                }
            }
        }
    )
})

module.exports = router;