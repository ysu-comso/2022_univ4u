const express = require('express');
const router = express.Router();
const db = require('../db');
const bodyParser = require('body-parser')
const cors = require('cors');
router.use(cors());
router.use(bodyParser.json()) // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

router.get('/operatingdate', (req,res) => {
  db.query(
    'SELECT * FROM operating_date ORDER BY id DESC LIMIT 1',
    (error, rows) => {
        if (error) throw error;
        res.send(rows);
    });
});

router.get('/getTimeList', (req,res) => {
    db.query(
      `SELECT time 
      FROM time_table 
      WHERE time
      ORDER BY time ASC`,
      (error, rows) => {
          if (error) throw error;
          const times = rows.map(obj => obj.time);
          console.log(times)
          res.send(times);
      });
  });

router.post('/ableTime', (req,res) => {
    const date = req.body.trimmedDate;
    const reservation_status = '예약대기';
    const reservation_status1 = '예약확정';
    
    db.query(
      `SELECT rd.reservation_time
        FROM reservations_details rd 
        JOIN time_table tt ON rd.reservation_time = tt.time
        WHERE rd.reservation_date = ?
        AND (rd.reservation_status = ? OR rd.reservation_status = ?) 
        GROUP BY rd.reservation_time, tt.limit_customer
        HAVING COUNT(*) >= tt.limit_customer`,
      [date, reservation_status,reservation_status1],
      (error, rows) => {
          if (error) throw error;
          console.log("ableTime",rows)
          res.send(rows);
      });
  });

router.post('/reservation', (req, res) => {
    const remain_data = parseInt(req.body.prog_count, 10);

    const client_id = req.body.client_id;
    const name = req.body.name;
    const phone = req.body.phone;
    const gender = req.body.gender;
    const std = req.body.std;
    const prog_name = req.body.prog_name;
    const prog_time = req.body.prog_time;
    const remain_count = remain_data - 1;
    const total_count = req.body.prog_count;
    const note = req.body.note;
    const reservation_date = req.body.reservation_date;
    const reservation_time = req.body.reservation_time;
    const price = req.body.price;
    const discount = req.body.discount;
    const reservation_status = req.body.reservation_status;
    
    db.query(
        `SELECT tt.time, tt.limit_customer, COUNT(rd.reservation_time) as rowCount 
        FROM time_table tt
        LEFT JOIN reservations_details rd ON tt.time = rd.reservation_time AND rd.reservation_date = ?
        GROUP BY tt.time, tt.limit_customer
        HAVING rowCount <= tt.limit_customer`
        ,
        [reservation_date],
        (err, result) => {
            if (err) {
                console.log(err);
                // 에러 처리
            } else {

                const rowCount = result[0].rowCount;
                const limit_customer = result[0].limit_customer;
                console.log("reservation rowCount :",rowCount,"limit_customer :",limit_customer)

                if (rowCount < limit_customer) {
                    db.query(
                        "INSERT INTO reservations (client_id, name, phone, gender, std, prog_name, prog_time , remain_count,total_count, note, reservation_date,reservation_time, price, discount, reservation_status) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)",
                        [client_id, name, phone, gender, std, prog_name, prog_time, remain_count, total_count, note, reservation_date, reservation_time, price, discount, reservation_status],
                        (err, result) => {
                            if (err) {
                                console.log(err);
                            } else {
                                const insertedId = result.insertId;
                                res.send(insertedId.toString());
                            }
                        }
                    );
                } else {
                    // 예약한 기간, 시간에 2명이 있을경우 1 반환 
                    res.send("1")

                }
            }
        }
    );
});




router.post('/reservations_details', (req, res) => {
    const remain_data = parseInt(req.body.prog_count, 10);
    const client_id = req.body.client_id;
    const reservation_id = req.body.reservation_id;
    const name = req.body.name;
    const phone = req.body.phone;
    const gender = req.body.gender;
    const std = req.body.std;
    const prog_name = req.body.prog_name;
    const prog_time = req.body.prog_time;
    const remain_count = remain_data;
    const total_count = req.body.prog_count;
    const note = req.body.note;
    const reservation_date = req.body.reservation_date;
    const reservation_time = req.body.reservation_time;
    const price = req.body.price;
    const discount = req.body.discount;
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
                console.log("reservation_details rowCount :",rowCount,"limit_customer :",limit_customer)
                if (rowCount < limit_customer) {
                    // 조건 충족 시에만 데이터를 추가
                    db.query(
                        "INSERT INTO reservations_details (client_id, reservation_id, name, phone, gender, std, prog_name, prog_time, remain_count, total_count, note, reservation_date, reservation_time, price, discount, reservation_status) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)",
                        [client_id, reservation_id, name, phone, gender, std, prog_name, prog_time, remain_count, total_count, note, reservation_date, reservation_time, price, discount, reservation_status],
                        (err, result) => {
                            if (err) {
                                console.log(err);
                                // 에러 처리
                            } else {
                                res.send("reservation 성공");
                            }
                        }
                    );
                } else {
                    // 예약한 기간, 시간에 2명이 있을경우 1 반환 
                    res.send("1")
                }
            }
        }
    );
})

module.exports = router;