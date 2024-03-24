import { Route, Routes } from 'react-router-dom';
import './App.css';
import Main from './pages/main/main';
import Login from './pages/login/login';
import SignUp from './pages/signup/signUp';
import PhoneNumChange from './pages/mypage/phoneNumChange';
import PasswordChange from './pages/mypage/passwordChange';
import StudentConfirm from './pages/mypage/studentConfirm';
import MyTree from './pages/reservation/myTree';
import Reservation from './pages/reservation/reservation';
import { UserProvider } from './userContext';
import MoreReserv from './pages/reservation/moreReserv';
import { ServerProvider } from './serverContext';

function App() {
  return (
    <ServerProvider>
    <UserProvider>
    <div className="MainContainer">
      <Routes>
        <Route path='/main' element={<Main />} />
        <Route path='/' element={<Login />} />
        <Route path='/signUp' element={<SignUp />} />
        {/* 내 정보 관리 */}
        <Route path='/phoneNumChange' element={<PhoneNumChange />} />
        <Route path='/passwordChange' element={<PasswordChange />} />
        <Route path='/studentConfirm' element={<StudentConfirm />} />
        {/* 예약 관리 */}
        <Route path='/myTree' element={<MyTree />} />
        <Route path='/reservation' element={<Reservation />} />
        <Route path='/moreReserv' element={<MoreReserv />} />
      </Routes>
    </div>
    </UserProvider>
    </ServerProvider>
  );
}

export default App;