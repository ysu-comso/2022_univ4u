import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import { useUser } from '../../userContext';
import { useEffect } from 'react';
import { useServer } from '../../serverContext';

function Login() {

  const { setUser } = useUser();
  const { server } = useServer();

  const [phoneNum, setPhoneNum] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  

  useEffect(() => {
    if(sessionStorage.getItem('phone')){
      navigate('/main');
    }
  }, [])

  const onPhoneNumHandler = (event) => {
    setPhoneNum(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const confirmButtonValid = () =>{
    return phoneNum !== "" && password !== "";
  }

  const loginSubmit = async() => {
    const SERVER_URL = server+'/login'
    try {
      const response = await axios.post(SERVER_URL, { phoneNum, password });

      if (response.data.success) {
        // 로그인 성공
        const userInfo = response.data.userInfo;
        const sessionStorageAttributes = Object.keys(userInfo);
        setUser(userInfo); // 유저 정보를 전역변수에 저장
        sessionStorageAttributes.forEach(attr => {
          sessionStorage.setItem(attr, userInfo[attr]);
        });
        navigate('/main');
      } 
    } catch (error) {
      console.error('로그인 요청 오류:', error);
      if(error.code === "ERR_BAD_REQUEST"){
        alert('전화번호 혹은 비밀번호를 확인해주세요');  
      }else{
        alert('서버 이상 문제 발생');
      }
      
    }
  }

  const enterNext = (e) => {
    if (e.key === 'Enter') {
      document.getElementById('pwdInput').focus();
    }
  }

  const enterLogin = e => {
    if (e.key === 'Enter') {
      loginSubmit()
    }
  }

  return (
    <div className='login-back-img'>
      <div className='login-container'>
        <div className='login-title'>Lemon Tree</div>
        <div className='login-content'>
          <div className='login-input-content'>
            <input
              className={'login-input'}
              id="phoneInput"
              pattern="[0-9]+"
              title="전화번호를 바르게 입력하세요"
              value={phoneNum}
              onChange={onPhoneNumHandler}
              onKeyDown={enterNext}
              placeholder={'휴대폰 번호를 입력해주세요'} />
          </div>
          <div className='login-input-content'>
            <input
              className={'login-input'}
              id="pwdInput"
              pattern=".{8,}"
              title="8자리 이상 입력하세요"
              type="password"
              value={password}
              onChange={onPasswordHandler}
              onKeyDown={enterLogin}
              placeholder={'비밀번호를 입력해주세요'} />
          </div>
          <button
            className={'login-btn-active'}
            disabled={!confirmButtonValid()}
            onClick={() => loginSubmit()}
          >
            로그인
          </button>
          <Link to={'/signup'} className='login-signUp'>회원가입</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;