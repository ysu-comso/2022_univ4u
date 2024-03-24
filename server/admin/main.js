const express = require('express');
const router = express.Router();
const db = require('../db');
const session = require('express-session');
const Memory = require('memorystore')(session);
const bodyParser = require('body-parser');
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(session({ secret: 'tree', resave: false, saveUninitialized: true, store: new Memory({ checkPeriod: 60 * 1000 * 90}) }));

router.get('/admin/main', (req, res) => {
  const username = req.session.username;

  if(!username){
    res.redirect('/admin')
  }else{
    // 현재 날짜 생성
    const today = new Date();

    // 년, 월, 일 각각 가져오기
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');

    // 날짜를 'yy.mm.dd' 형식으로 변환
    const formattedToday = `${year}. ${month}. ${day}`;

    let todayReservations, tomorrowReservations;

    const startDate = req.query.startDate;
    const date = new Date(startDate);
    // 'yy. mm. dd' 형식으로 포맷
    const select_year = date.getFullYear().toString().slice(-2); // 연도에서 마지막 두 자리만 사용
    const select_month = (date.getMonth() + 1).toString().padStart(2, '0');
    const select_day = date.getDate().toString().padStart(2, '0');

    const select_Date = `${select_year}. ${select_month}. ${select_day}`;


    let queryParameters;

    if (startDate) {
      queryParameters = [select_Date];
    } else {
      queryParameters = [formattedToday];
    }

    // 예약대기 정보 조회
    db.query("SELECT * FROM reservations_details WHERE reservation_date = ? and reservation_status = '예약대기'" , [queryParameters],(error, results, fields) => {
      if (error) {
        console.error('오늘 예약 조회 오류: ' + error);
        res.status(500).send('서버 오류');
        return;
      }

      todayReservations = results.map((reservation) => ({
        ...reservation,
        reservation_time: reservation.reservation_time.replace(/\s/g, ''), // 시간에서 공백 제거
      }));

      // 예약확정 정보 조회
      db.query("SELECT * FROM reservations_details WHERE reservation_date = ? and reservation_status = '예약확정'", [queryParameters], (error, results, fields) => {
        if (error) {
          console.error('내일 예약 조회 오류: ' + error);
          res.status(500).send('서버 오류');
          return;
        }

        tomorrowReservations = results.map((reservation) => ({
          ...reservation,
          reservation_time: reservation.reservation_time.replace(/\s/g, ''), // 시간에서 공백 제거
        }));

        // 시간대별로 그룹화
        const reservationsByTimeToday = {};
        const reservationsByTimeTomorrow = {};

        // 오늘과 내일의 예약 정보를 모두 합침
        const allReservations = todayReservations.concat(tomorrowReservations);

        // 예약 시간을 기준으로 오름차순 정렬
        allReservations.sort((a, b) => {
          return a.reservation_time.localeCompare(b.reservation_time);
        });

        // 모든 시간대를 초기화
        allReservations.forEach(reservation => {
          if (!reservationsByTimeToday[reservation.reservation_time]) {
            reservationsByTimeToday[reservation.reservation_time] = [];
          }
          if (!reservationsByTimeTomorrow[reservation.reservation_time]) {
            reservationsByTimeTomorrow[reservation.reservation_time] = [];
          }
        });

        // 예약을 시간대에 맞게 할당
        allReservations.forEach(reservation => {
          const time = reservation.reservation_time;
          if (todayReservations.includes(reservation)) {
            reservationsByTimeToday[time].push(reservation);
          } else {
            reservationsByTimeTomorrow[time].push(reservation);
          }
        });

        res.render('main', { reservationsByTimeToday, reservationsByTimeTomorrow, queryParameters });
      });
    });
  }
});

module.exports = router;
