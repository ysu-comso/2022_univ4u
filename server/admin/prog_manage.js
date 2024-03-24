const express = require('express');
const router = express.Router();
const db = require('../db');

const session = require('express-session');
const Memory = require('memorystore')(session);
router.use(session({ secret: 'tree', resave: false, saveUninitialized: true, store: new Memory({ checkPeriod: 60 * 1000 * 90}) }));

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.get('/admin/prog_manage', (req, res) => {
  const username = req.session.username;
  if(!username){
    res.redirect('/admin')
  }else{
    db.query('SELECT * FROM programs', (error, results, fields) => {
      if (error) {
        console.error('쿼리 실행 오류: ' + error);
        res.status(500).send('서버 오류');
        return;
      }
  
      // 프로그램 데이터를 렌더링할 EJS 템플릿에 전달
      res.render('prog_manage', { programs: results });
    });
  }
});

router.post('/admin/prog_manage/add_date', (req, res) => {
  // POST 요청의 데이터는 req.body 객체를 통해 접근 가능
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  db.query('INSERT INTO operating_date (start_date, end_date) VALUES (?, ?)', [startDate, endDate], (error, results, fields) => {
    if (error) {
      console.error('데이터 추가 오류: ' + error);
      res.status(500).json({ message: '데이터 추가 중 오류 발생' });
    } else {
      res.json({ message: '운영날짜가 설정되었습니다.' });
    }
  });
});

router.post('/admin/prog_manage/add_prog_post', (req, res) => {
  // POST 요청의 데이터는 req.body 객체를 통해 접근 가능
  const prog_name = req.body.prog_name;
  const prog_time = req.body.prog_time;
  const prog_count = req.body.prog_count;
  const price = req.body.price;
  const discount = req.body.discount;

  function numberComma(num){
    const cleanNumber = num.toString().replace(/,/g, '');
    
    return cleanNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const commaPrice = numberComma(price);
  const commaDiscount = numberComma(discount);

  db.query(
    'INSERT INTO programs (prog_name, prog_time, prog_count, price, discount) VALUES (?, ?, ?, ?, ?)',
    [prog_name, prog_time, prog_count, commaPrice, commaDiscount], (error, results, fields) => {
    if (error) {
      console.error('데이터 추가 오류: ' + error);
      res.send("<script>alert('프로그램 추가 중 오류가 발생했습니다.');location.href='http://lemontree.cafe24app.com/admin/prog_manage';</script>");
    } else {
      res.send( "<script>alert('프로그램이 추가되었습니다.');location.href='http://lemontree.cafe24app.com/admin/prog_manage';</script>" );
    }
  });
});

router.post('/admin/prog_manage/modify_prog_post', (req, res) => {
  // POST 요청의 데이터는 req.body 객체를 통해 접근 가능
  const prog_name = req.body.prog_name;
  const prog_time = req.body.prog_time;
  const prog_count = req.body.prog_count;
  const price = req.body.price;
  const discount = req.body.discount;

  db.query(
    'UPDATE programs SET price = ?, discount = ?  WHERE prog_name = ? AND prog_count = ?',
    [price, discount, prog_name, prog_count], (error, results, fields) => {
    if (error) {
      console.error('데이터 추가 오류: ' + error);
      res.send("<script>alert('프로그램 수정 중 오류가 발생했습니다.');location.href='http://lemontree.cafe24app.com/admin/prog_manage';</script>");
    } else {
      res.send( "<script>alert('프로그램이 수정되었습니다.');location.href='http://lemontree.cafe24app.com/admin/prog_manage';</script>" );
    }
  });
});

router.post('/admin/prog_manage/delete_prog', (req, res) => {
  // POST 요청의 데이터는 req.body 객체를 통해 접근 가능
  const serviceName = req.body.serviceName;
  const count = req.body.count;

  db.query('delete from programs where prog_name = ? and prog_count = ?', [serviceName, count], (error, results, fields) => {
    if (error) {
      console.error('데이터 삭제 오류: ' + error);
      res.status(500).json({ message: '프로그램 삭제 중 오류 발생' });
    } else {
      res.json({ message: '프로그램이 삭제되었습니다.' });
    }
  });
});

module.exports = router;