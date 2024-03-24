const express = require('express');
const router = express.Router();
const db = require('../db');

const session = require('express-session');
const Memory = require('memorystore')(session);
router.use(session({ secret: 'tree', resave: false, saveUninitialized: true, store: new Memory({ checkPeriod: 60 * 1000 * 90}) }));

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

const itemsPerPage = 15;

router.get('/admin/reservation_manage', (req, res) => {
  const username = req.session.username;

  if(!username){
    res.redirect('/admin')
  }else{
    const currentPage = req.query.page || 1; // 현재 페이지 번호
  const startIndex = (currentPage - 1) * itemsPerPage; // 데이터베이스에서 가져올 항목의 시작 인덱스
  const reserv_status = req.query.reserv_status;

  // 전체 데이터 수를 가져오는 쿼리
  let totalQuery;
  // 현재 페이지에 해당하는 데이터를 가져오는 쿼리
  let dataQuery;
  let totalQueryParameters;
  let dataQueryParameters;

  if (reserv_status == '예약대기' || reserv_status == '예약확정') {
    totalQuery = 'SELECT COUNT(*) AS total FROM reservations_details WHERE reservation_status = ?';
    dataQuery = 'SELECT * FROM reservations_details WHERE reservation_status = ? ORDER BY id DESC LIMIT ? OFFSET ?';
    totalQueryParameters = [reserv_status];
    dataQueryParameters = [reserv_status, itemsPerPage, startIndex];
  } else {
    totalQuery = 'SELECT COUNT(*) AS total FROM reservations_list WHERE reservation_status = ?';
    dataQuery = 'SELECT * FROM reservations_list WHERE reservation_status = ? ORDER BY id DESC LIMIT ? OFFSET ?';
    totalQueryParameters = [reserv_status];
    dataQueryParameters = [reserv_status, itemsPerPage, startIndex];
  }

  db.query(totalQuery, totalQueryParameters, (error, totalResults) => {
    if (error) {
      console.error('쿼리 실행 오류: ' + error);
      res.status(500).send('서버 오류');
      return;
    }

    const totalItems = totalResults[0].total;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    db.query(dataQuery, dataQueryParameters, (error, results) => {
      if (error) {
        console.error('쿼리 실행 오류: ' + error);
        res.status(500).send('서버 오류');
        return;
      }

      res.render('reservation_manage', { reservations: results, currentPage, totalPages, reserv_status });
    });
  });
  }
});


router.get('/admin/reservation_manage/search', (req, res) => {
  const username = req.session.username;

  if(!username){
    res.redirect('/admin')
  }else{
    const currentPage = req.query.page || 1; // 현재 페이지 번호
  const startIndex = (currentPage - 1) * itemsPerPage; // 데이터베이스에서 가져올 항목의 시작 인덱스
  const reserv_status = req.query.reserv_status;
  const searchData = req.query.searchData;

  // 전체 데이터 수를 가져오는 쿼리
  let totalQuery;
  // 현재 페이지에 해당하는 데이터를 가져오는 쿼리
  let dataQuery;
  let totalQueryParameters;
  let dataQueryParameters;

  if (reserv_status == '예약대기' || reserv_status == '예약확정') {
    totalQuery = 'SELECT COUNT(*) AS total FROM reservations_details where reservation_status = ? and (name like ? or phone like ?)';
    dataQuery = 'SELECT * FROM reservations_details where reservation_status = ? and (name like ? or phone like ?) ORDER BY id DESC LIMIT ? OFFSET ?';
    totalQueryParameters = [reserv_status, '%' + searchData + '%', '%' + searchData + '%'];
    dataQueryParameters = [reserv_status, '%' + searchData + '%', '%' + searchData + '%', itemsPerPage, startIndex];
  } else {
    totalQuery = 'SELECT COUNT(*) AS total FROM reservations_list WHERE reservation_status = ? and (name like ? or phone like ?)';
    dataQuery = 'SELECT * FROM reservations_list WHERE reservation_status = ? and (name like ? or phone like ?) ORDER BY id DESC LIMIT ? OFFSET ?';
    totalQueryParameters = [reserv_status, '%' + searchData + '%', '%' + searchData + '%'];
    dataQueryParameters = [reserv_status, '%' + searchData + '%', '%' + searchData + '%', itemsPerPage, startIndex];
  }

  db.query(totalQuery, totalQueryParameters, (error, totalResults) => {
    if (error) {
        console.error('쿼리 실행 오류: ' + error);
        res.status(500).send('서버 오류');
        return;
    }

    const totalItems = totalResults[0].total;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    db.query(dataQuery, dataQueryParameters, (error, results) => {
        if (error) {
            console.error('쿼리 실행 오류: ' + error);
            res.status(500).send('서버 오류');
            return;
        }

        res.render('search', { reservations: results, currentPage, totalPages, searchData, reserv_status }); // searchData를 전달하여 검색어를 유지합니다.
    });
  });
  }
});



  router.post('/admin/reservation_manage/confirm_reserv', (req, res) => {
    const id = req.body.id;
    const client_id = req.body.client_id;
    const name = req.body.name;
    const phone = req.body.phone;
    const gender = req.body.gender;
    const std = req.body.std;
    const prog_name = req.body.prog_name;
    const prog_time = req.body.prog_time;
    const remain_count = req.body.remain_count;
    const total_count = req.body.total_count;
    const note = req.body.note;
    const reservation_date = req.body.reservation_date;
    const reservation_time = req.body.reservation_time;
    const price = req.body.price;
    
    db.query("update reservations_details set reservation_status = '예약확정' where id = ?", [id], (error, results, fields) => {
      if (error) {
        console.error('데이터 수정 오류: ' + error);
        res.status(500).json({ message: '오류 발생' });
      } else {
        res.json({ message: '예약 확정되었습니다.' });
      }
    });
  });

  router.post('/admin/reservation_manage/cancel_reserv', (req, res) => {
    const id = req.body.id;
    const client_id = req.body.client_id;
    const name = req.body.name;
    const phone = req.body.phone;
    const gender = req.body.gender;
    const std = req.body.std;
    const prog_name = req.body.prog_name;
    const prog_time = req.body.prog_time;
    const remain_count = req.body.remain_count;
    const total_count = req.body.total_count;
    const note = req.body.note;
    const reservation_date = req.body.reservation_date;
    const reservation_time = req.body.reservation_time;
    const price = req.body.price;
    const reservation_status = req.body.reservation_status;
    const reservation_id = req.body.reservation_id;

      db.query("insert into reservations_list(client_id, name, phone, gender, std, prog_name, prog_time, remain_count, total_count, note, reservation_date, reservation_time, price, reservation_status, reservation_id) "+
             "values(?,?,?,?,?,?,?,?,?,?,?,?,?,'취소완료',?)",
              [client_id,name,phone,gender,std,prog_name,prog_time,remain_count,total_count,note,reservation_date,reservation_time,price, reservation_id], (error, results, fields) => {
      if (error) {
        console.error('데이터 삽입 오류: ' + error);
        res.status(500).json({ message: '오류 발생' });
      } else {
        db.query("delete from reservations_details where id = ? ", [id], (error) => {
          if (error) {
            console.error('데이터 삭제 오류: ' + error);
            res.status(500).json({ message: '오류 발생' });
          } else {
            db.query("update reservations set remain_count = remain_count + 1 where client_id = ? and prog_name = ? and prog_time = ? AND remain_count <= total_count AND id = ?", [client_id, prog_name, prog_time, reservation_id], (error) => {
              if (error) {
                console.error('데이터 수정 오류: ' + error);
                res.status(500).json({ message: '오류 발생 or 잔여횟수가 3회 이상입니다.' });
              } else {
                db.query('DELETE FROM reservations WHERE client_id = ? AND prog_name = ? AND prog_time = ? AND remain_count = total_count AND id = ?',
                [client_id, prog_name, prog_time, reservation_id], (error) => {
                  if (error) {
                    console.error('데이터 수정 오류: ' + error);
                    res.status(500).json({ message: '오류 발생 or 잔여횟수가 3회 이상입니다.' });
                  } else {
                    res.json({ message: '취소되었습니다.' });
                  }
                });
              }
            });
          }
        });
      }
    });
  });

  router.post('/admin/reservation_manage/payment_reserv', (req, res) => {
    const id = req.body.id;
    const client_id = req.body.client_id;
    const name = req.body.name;
    const phone = req.body.phone;
    const gender = req.body.gender;
    const std = req.body.std;
    const prog_name = req.body.prog_name;
    const prog_time = req.body.prog_time;
    const remain_count = req.body.remain_count;
    const total_count = req.body.total_count;
    const note = req.body.note;
    const reservation_date = req.body.reservation_date;
    const reservation_time = req.body.reservation_time;
    const price = req.body.price;
    const reservation_status = req.body.reservation_status;
    const sale_date = req.body.sale_date;
    const reservation_id = req.body.reservation_id;
  
    let CountBasedQuery;
    if(total_count == 1){
      CountBasedQuery = "DELETE FROM reservations WHERE id = ? AND remain_count = 0 AND total_count = 1 AND ((SELECT COUNT(*) FROM reservations_list WHERE reservation_id = ? AND client_id = ? AND prog_name = ? AND prog_time = ? AND reservation_status = '결제완료') = 1)"
    }else{
      CountBasedQuery = "DELETE FROM reservations WHERE id = ? and remain_count = 0 AND (SELECT COUNT(*) FROM reservations_list WHERE reservation_id = ? AND client_id = ? AND prog_name = ? AND prog_time = ? AND reservation_status = '결제완료') >= 3"
    }

    db.query("insert into reservations_list(client_id, name, phone, gender, std, prog_name, prog_time, remain_count, total_count, note, reservation_date, reservation_time, price, reservation_status,reservation_id) "+
             "values(?,?,?,?,?,?,?,?,?,?,?,?,?,'결제완료',?)",
              [client_id,name,phone,gender,std,prog_name,prog_time,remain_count,total_count,note,reservation_date,reservation_time,price,reservation_id], (error, results, fields) => {
      if (error) {
        console.error('데이터 삽입 오류: ' + error);
        res.status(500).json({ message: '오류 발생' });
      } else {
        db.query("update client set std = ? where id = ?", [std, client_id], (error, results, fields) => {
          if (error) {
            console.error('데이터 수정 오류: ' + error);
            res.status(500).json({ message: '오류 발생' });
          } else {
            db.query("delete from reservations_details where id = ? ", [id], (error, results, fields) => {
              if (error) {
                console.error('데이터 삭제 오류: ' + error);
                res.status(500).json({ message: '오류 발생' });
              } else {
                db.query("update reservations set price = 0, discount = 0 where client_id = ? and prog_name = ? and prog_time = ? AND id = ?", [client_id, prog_name, prog_time, reservation_id], (error, results, fields) => {
                  if (error) {
                    console.error('데이터 삽입 오류: ' + error);
                    res.status(500).json({ message: '오류 발생' });
                  } else {
                    db.query("insert into sales (sale_date, prog_name, price) values(?, ?, ?)", [sale_date, prog_name, price], (error, results, fields) => {
                      if (error) {
                        console.error('데이터 삽입 오류: ' + error);
                        res.status(500).json({ message: '오류 발생' });
                      } else {
                        db.query("update reservations_details set price = 0, discount = 0 where client_id = ? and prog_name = ? and prog_time = ? AND reservation_id = ?", [client_id, prog_name, prog_time, reservation_id], (error, results, fields) => {
                          if (error) {
                            console.error('데이터 수정 오류: ' + error);
                            res.status(500).json({ message: '오류 발생' });
                          } else {
                            db.query(CountBasedQuery, [reservation_id, reservation_id, client_id, prog_name, prog_time], (error, results, fields) => {
                              if (error) {
                                console.error('데이터 삭제 오류: ' + error);
                                res.status(500).json({ message: '오류 발생' });
                              } else {
                                res.json({ message: '결제되었습니다.' });
                              }
                            });
                          }
                        });
                      }
                    });                        
                  }
                });
              }
            });
          }
        });
      }
    });
  });
  
  router.post('/admin/reservation_manage/modify_reserv', (req, res) => {
    const id = req.body.id;
    const note = req.body.note;
    const std = req.body.std;
    const discount = req.body.discount;

    db.query("update reservations set note = ?, std = ?, discount = ?  where id = ?", [note, std, discount, id], (error, results, fields) => {
      if (error) {
        console.error('데이터 수정 오류: ' + error);
        res.status(500).json({ message: '오류 발생' });
      } else {
        res.json({ message: '수정되었습니다.' });
      }
    });
  });


module.exports = router;