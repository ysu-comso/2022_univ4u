const express = require('express');
const router = express.Router();
const db = require('../db');
const bodyParser = require('body-parser')
const cors = require('cors');
router.use(cors());
router.use(bodyParser.json()) // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

router.post('/login', (req, res) => {
  const phone = req.body.phoneNum;
  const password = req.body.password;

  db.query(
    "SELECT * FROM client WHERE phone = ? AND passwd = ?",
    [phone, password],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({ success: false, message: '서버 오류' });
      } else if (results.length > 0) {
        // 사용자 인증 성공
        const user = results[0];
        // 성공적으로 인증되면 세션을 생성하거나 JWT 토큰을 생성하여 반환
        // const token = generateToken(user);
        res.json({ success: true, userInfo: results[0]});
      } else {
        // 인증 실패
        res.status(401).json({ success: false, message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
        console.log("인증 실패");
      }
    }
  );
});

module.exports = router;