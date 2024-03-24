const express = require('express');
const path = require('path');
const app = express();
const PORT = 8001;

// Client Start
const login = require('./server/client/login');
const main = require('./server/client/main');
const reservation = require('./server/client/reservation');
const signup = require('./server/client/signup');
const count = require('./server/client/mytree');
const phoneNumChange = require('./server/client/mypage/phoneNumChange');
const passwordChange = require('./server/client/mypage/passwordChange');

// react를 빌드한 결과물이 담긴 디렉토리 /build 에 접근하여 미들웨어를 생성해준다.
app.use(express.static(path.join(__dirname, './client/build')));

app.use('/',login);
app.use('/',main);
app.use('/',reservation);
app.use('/',signup);
app.use('/',count);
app.use('/',phoneNumChange);
app.use('/',passwordChange);

// Client End

//관리자 start
// EJS 템플릿 엔진 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './admin/views'));

app.use(express.static(path.join(__dirname, './admin/static'))); //관리자 정적 파일

const clientListRoutes = require('./server/admin/client_list'); 
const loginRoutes = require('./server/admin/login'); 
const mainRoutes = require('./server/admin/main'); 
const progManageRoutes = require('./server/admin/prog_manage'); 
const reservManageRoutes = require('./server/admin/reserv_manage'); 
const saleManageRoutes = require('./server/admin/sale_manage');
const timeCustRoutes = require('./server/admin/time_cust');
app.use('/', clientListRoutes);
app.use('/', loginRoutes);
app.use('/', mainRoutes);
app.use('/', progManageRoutes);
app.use('/', reservManageRoutes);
app.use('/', saleManageRoutes);
app.use('/', timeCustRoutes);
//관리자 end

app.listen(PORT, function () {
  console.log(`listening on ${PORT}`)
});


// 젤 밑에 놔야하는 코드 건들 노노
// admin페이지를 제외한 페이지 가져오기
app.get('*', function(req, res) {
  // 요청 URL이 '/admin'으로 시작하는지 확인
  if (req.url.startsWith('/admin')) {
    // '/admin'으로 시작하는 경로는 처리하지 않고 넘어갑니다.
    return;
  }

  // client 모든 요청을 여기에서 처리
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});