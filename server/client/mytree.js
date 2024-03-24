const express = require('express');
const router = express.Router();
const db = require('../db');
const bodyParser = require('body-parser')
const cors = require('cors');
router.use(cors());
router.use(bodyParser.json()) // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

router.post('/myTree', (req, res) => {
  const client_id = req.body.client_id;

  db.query(
    'SELECT * FROM reservations WHERE client_id = ? AND total_count > 1 AND remain_count > 0',
    [client_id],
    (error, rows) => {
        if (error) throw error;
        res.send(rows);
    });
});

router.get('/myReservation', (req, res) => {
  const client_id = req.query.client_id;

  db.query(
    'SELECT * FROM reservations_details WHERE client_id = ? AND (reservation_status = "예약대기" OR reservation_status = "예약확정") ORDER BY id DESC',
    [client_id],
    (error, rows) => {
        if (error) throw error;
        res.send(rows);
    });
});

router.get('/reservationList', (req, res) => {
  const client_id = req.query.client_id;

  db.query(
    'SELECT * FROM reservations_list WHERE client_id = ? AND (reservation_status = "결제완료" OR reservation_status = "취소완료" OR reservation_status = "예약확정") ORDER BY id DESC',
    [client_id],
    (error, rows) => {
        if (error) throw error;
        res.send(rows);
    });
});

router.post('/reservationCancle', (req, res) => {
  const id = req.body.id;
  db.query(
    'DELETE FROM reservations_details WHERE id = ?',
    [id],
    (error, rows) => {
        if (error) throw error;
        res.send(rows);
    });
});

router.post('/reservationCancle1', (req, res) => {
    const client_id = req.body.client_id;
    const reservation_id = req.body.reservation_id;
    const prog_name = req.body.prog_name;
    const prog_time = req.body.prog_time;
  
    
    db.query(
      'UPDATE reservations SET remain_count = remain_count + 1 WHERE client_id = ? AND prog_name = ? AND prog_time = ? AND remain_count <= total_count AND id = ?',
      [client_id,prog_name,prog_time ,reservation_id],
      (error, rows) => {
          if (error) throw error;
      });
    db.query(
      'DELETE FROM reservations WHERE client_id = ? AND prog_name = ? AND prog_time = ? AND remain_count = total_count AND id = ?',
      [client_id, prog_name, prog_time,reservation_id],
      (deleteError, deleteResult) => {
        if (deleteError) throw deleteError;
      }
    );
  });

  // 예약취소할경우 예약목록에 값넣기
  router.post('/reservationCancle2', (req, res) => {
    const client_id = req.body.client_id;
    const name = req.body.name;
    const phone = req.body.phone;
    const gender = req.body.gender;
    const std = req.body.std;
    const prog_name = req.body.prog_name;
    const prog_time  = req.body.prog_time;
    const remain_count = req.body.remain_count;
    const total_count = req.body.total_count;
    const note = req.body.note;
    const reservation_date = req.body.reservation_date;
    const reservation_time = req.body.reservation_time;
    const price = req.body.price;
    const reservation_status = req.body.reservation_status;
 
    db.query(
        "INSERT INTO reservations_list (client_id, name, phone, gender, std, prog_name, prog_time , remain_count,total_count, note, reservation_date,reservation_time, price, reservation_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [client_id, name, phone, gender, std, prog_name, prog_time, remain_count, total_count, note, reservation_date, reservation_time, price, reservation_status],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("성공")
            }
        }
    )
  })

router.post('/reservationMore', (req, res) => {
  const id = req.body.id;
  const reservation_date = req.body.reservation_date;
  const reservation_time = req.body.reservation_time;
  const note = req.body.note;
  const reservation_status = '예약대기';
  db.query(
    'UPDATE reservations SET reservation_date = ?, remain_count = remain_count - 1 , reservation_time = ?, note = ?, reservation_status = ? WHERE id = ?',
    [reservation_date, reservation_time, note, reservation_status, id],
    (error, rows) => {
        if (error) throw error;
        res.send(rows);
    });
});

// 예약 내역에 값넣기
router.post('/reservationMore1', (req, res) => {
  const client_id = req.body.client_id;
  const reservation_id = req.body.reservation_id;
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
  const discount = req.body.price;
  const reservation_status = req.body.reservation_status;

  db.query(
    `SELECT tt.time, tt.limit_customer, COUNT(rd.reservation_time) as rowCount 
        FROM time_table tt
        LEFT JOIN reservations_details rd ON tt.time = rd.reservation_time AND rd.reservation_date = ?
        GROUP BY tt.time, tt.limit_customer
        HAVING rowCount <= tt.limit_customer`,
    [reservation_date, reservation_time],
    (err, result) => {
      if (err) {
        console.log(err);
        // 에러 처리
      } else {
        const rowCount = result[0].rowCount;
        const limit_customer = result[0].limit_customer;
        if (rowCount < limit_customer) {

          db.query(
            "INSERT INTO reservations_details (client_id, reservation_id, name, phone, gender, std, prog_name, prog_time , remain_count,total_count, note, reservation_date,reservation_time, price, discount, reservation_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)",
            [client_id, reservation_id, name, phone, gender, std, prog_name, prog_time, remain_count, total_count, note, reservation_date, reservation_time, price, discount, reservation_status],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                res.send("reservation 성공")
              }
            }
          )
        } else {
          // 예약한 기간, 시간에 2명이 있을경우 1 반환 
          res.send("1")

        }
      }
    }
  );
})


module.exports = router;