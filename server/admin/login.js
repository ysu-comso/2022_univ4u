const express = require('express');
const router = express.Router();
const db = require('../db');
const session = require('express-session');
const Memory = require('memorystore')(session);
const bodyParser = require('body-parser');
const cors = require('cors');

router.use(cors());
router.use(session({ secret: 'tree', resave: false, saveUninitialized: true, store: new Memory({ checkPeriod: 60 * 1000 * 90}) }));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// GET 요청: 로그인 페이지 표시
router.get('/admin', (req, res) => {
    res.render('login');
});

// POST 요청: 로그인 데이터 처리
router.post('/admin/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "SELECT * FROM admin WHERE id = ?" , [username],
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).json({ success: false, message: '서버 오류' });
            } else if (results.length > 0) {
                const user = results[0];

                if (password === user.passwd) {
                    // 비밀번호 일치
                    req.session.username = user.id;
                    req.session.save(function(){
                        res.redirect('/admin/main');
                    });
                } else {
                    // 비밀번호 불일치
                    res.send("<script>alert('비밀번호 불일치.');location.href='http://lemontree.cafe24app.com/admin';</script>");
                }
            } else {
                // 사용자 없음             
                res.send("<script>alert('사용자 없음.');location.href='http://lemontree.cafe24app.com/admin';</script>");
            }
        }
    );
});

router.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin')
});

module.exports = router;
