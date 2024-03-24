const express = require('express');
const router = express.Router();
const db = require('../db');

const session = require('express-session');
const Memory = require('memorystore')(session);
router.use(session({ secret: 'tree', resave: false, saveUninitialized: true, store: new Memory({ checkPeriod: 60 * 1000 * 90}) }));

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

const itemsPerPage = 15;

router.get('/admin/sale_manage', (req, res) => {
    const username = req.session.username;
    if(!username){
        res.redirect('/admin')
    }else{
        const currentPage = req.query.page || 1; // 현재 페이지 번호
    const startIndex = (currentPage - 1) * itemsPerPage; // 데이터베이스에서 가져올 항목의 시작 인덱스

    // 전체 데이터 수를 가져오는 쿼리
    const totalQuery = 'SELECT COUNT(*) AS total FROM sales';
    // 현재 페이지에 해당하는 데이터를 가져오는 쿼리
    const dataQuery = 'SELECT * FROM sales ORDER BY id LIMIT ? OFFSET ?';

    // 금액 합계를 가져오는 쿼리
    const sumQuery = 'SELECT SUM(price) AS total_price FROM sales';

    db.query(totalQuery, (error, totalResults) => {
        if (error) {
            console.error('쿼리 실행 오류: ' + error);
            res.status(500).send('서버 오류');
            return;
        }

        const totalItems = totalResults[0].total;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        // 금액 합계 쿼리 실행
        db.query(sumQuery, (error, sumResult) => {
            if (error) {
                console.error('쿼리 실행 오류: ' + error);
                res.status(500).send('서버 오류');
                return;
            }

            // 현재 페이지에 해당하는 데이터를 가져오는 쿼리 실행
            db.query(dataQuery, [itemsPerPage, startIndex], (error, results) => {
                if (error) {
                    console.error('쿼리 실행 오류: ' + error);
                    res.status(500).send('서버 오류');
                    return;
                }

                const total_price = sumResult[0].total_price;

                res.render('sale_manage', { sales: results, currentPage, totalPages, totalItems, total_price });
            });
        });
    });
    } 
});

router.get('/admin/sale_manage/search', (req, res) => {
    const username = req.session.username;
    if(!username){
        res.redirect('/admin')
    }else{ 
    const currentPage = req.query.page || 1; // 현재 페이지 번호
    const startIndex = (currentPage - 1) * itemsPerPage; // 데이터베이스에서 가져올 항목의 시작 인덱스

    // 전체 데이터 수를 가져오는 쿼리
    const totalQuery = 'SELECT COUNT(*) AS total FROM sales WHERE sale_date  BETWEEN ? AND ?';
    // 현재 페이지에 해당하는 데이터를 가져오는 쿼리
    const dataQuery = 'SELECT * FROM sales WHERE sale_date  BETWEEN ? AND ? ORDER BY id LIMIT ? OFFSET ?';

    // 금액 합계를 가져오는 쿼리
    const sumQuery = 'SELECT SUM(price) AS total_price FROM sales WHERE sale_date  BETWEEN ? AND ?';

    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

        db.query(totalQuery, [startDate, endDate], (error, totalResults) => {
            if (error) {
                console.error('쿼리 실행 오류: ' + error);
                res.status(500).send('서버 오류');
                return;
            }
    
            const totalItems = totalResults[0].total;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
    
            // 금액 합계 쿼리 실행
            db.query(sumQuery, [startDate, endDate], (error, sumResult) => {
                if (error) {
                    console.error('쿼리 실행 오류: ' + error);
                    res.status(500).send('서버 오류');
                    return;
                }
    
                // 현재 페이지에 해당하는 데이터를 가져오는 쿼리 실행
                db.query(dataQuery, [startDate, endDate, itemsPerPage, startIndex], (error, results) => {
                    if (error) {
                        console.error('쿼리 실행 오류: ' + error);
                        res.status(500).send('서버 오류');
                        return;
                    }
    
                    const total_price = sumResult[0].total_price;
    
                    res.render('sale_manage_search', { sales: results, currentPage, totalPages, totalItems, total_price, startDate, endDate });
                });
            });
        });
    } 
});

module.exports = router;