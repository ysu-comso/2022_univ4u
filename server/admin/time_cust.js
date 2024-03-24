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

// GET 요청
router.get('/admin/timeCust', (req, res) => {
    db.query('SELECT * FROM time_table ORDER BY time ASC', (error, results, fields) => {
        if (error) {
          console.error('쿼리 실행 오류: ' + error);
          res.status(500).send('서버 오류');
          return;
        }
    
        // 프로그램 데이터를 렌더링할 EJS 템플릿에 전달
        res.render('time_cust', { timeCust: results });
      });
});

router.post('/admin/timeCust/add_timeCust_post', (req, res) => {
  // POST 요청의 데이터는 req.body 객체를 통해 접근 가능
  const prog_name = req.body.prog_name;
  const prog_time = req.body.prog_time;
  const prog_count = req.body.prog_count;

  const time = prog_name + " : " + prog_time;

  db.query(
    'INSERT INTO time_table (time, limit_customer) VALUES (?, ?)',
    [time, prog_count], (error, results, fields) => {
    if (error) {
      console.error('데이터 추가 오류: ' + error);
      res.send("<script>alert('추가 중 오류가 발생했습니다.');location.href='http://lemontree.cafe24app.com/admin/timeCust';</script>");
    } else {
      res.send( "<script>alert('추가되었습니다.');location.href='http://lemontree.cafe24app.com/admin/timeCust';</script>" );
    }
  });
});

router.post('/admin/timeCust/modify_timeCust_post', (req, res) => {
  // POST 요청의 데이터는 req.body 객체를 통해 접근 가능
  const prog_name = req.body.prog_name;
  const prog_time = req.body.prog_time;
  const prog_count = req.body.prog_count;
  const id = req.body.id;

  const time = prog_name + " : " + prog_time;
  

  db.query(
    'UPDATE time_table SET time = ?, limit_customer = ?  WHERE id = ?',
    [time, prog_count, id], (error, results, fields) => {
    if (error) {
      console.error('데이터 추가 오류: ' + error);
      res.send("<script>alert(수정 중 오류가 발생했습니다.');location.href='http://lemontree.cafe24app.com/admin/timeCust';</script>");
    } else {
      res.send( "<script>alert('수정되었습니다.');location.href='http://lemontree.cafe24app.com/admin/timeCust';</script>" );
    }
  });
});

router.post('/admin/timeCust/delete_timeCust', (req, res) => {
  // POST 요청의 데이터는 req.body 객체를 통해 접근 가능
  const id = req.body.id;

  db.query('delete from time_table where id = ?', [id], (error, results, fields) => {
    if (error) {
      console.error('데이터 삭제 오류: ' + error);
      res.status(500).json({ message: '삭제 중 오류 발생' });
    } else {
      res.json({ message: '삭제되었습니다.' });
    }
  });
});


module.exports = router;
