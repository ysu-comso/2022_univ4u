import React from 'react';
import Header from '../../component/header';
import { useState } from 'react';
import { useUser } from '../../userContext';
import axios from 'axios';
import { useServer } from '../../serverContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function PasswordChange() {


    const { server } = useServer();
    const [showExistingPassword, setShowExistingPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showReEnterPassword, setShowReEnterPassword] = useState(false);
    const [existingPassword,setExistingPassword] = useState("");  // 기존 비밀번호
    const [password,setPassword] = useState(""); // 변경할 비밀번호
    const [reEnterPassword,setReEnterPassword] = useState(""); // 비밀번호 재입력
    const { user, setUser }  = useUser();
    const originPasswd = sessionStorage.getItem('passwd');
    const userId = sessionStorage.getItem('id');
    const navigate = useNavigate();
    
    useEffect(() => {
        if(sessionStorage.getItem('phone') === null){
            navigate('/');
          }
    }, [])

    const onExistingPasswordHandler = (event) => {
        setExistingPassword(event.currentTarget.value);
      };

      const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
      };

    const onReEnterPasswordHandler = (event) => {
        setReEnterPassword(event.currentTarget.value);
      };

    // 기존 비밀번호 유효성 검사 함수
    const validateExistingPassword = () => {
        return existingPassword === originPasswd;
    };

    // 변경할 비밀번호 유효성 검사 함수
    const validatePassword = () => {
        return password.length >= 8;
    };

    // 재입력 비밀번호 유효성 검사 함수
    const validateReEnterPassword = () => {
        return password === reEnterPassword;
    };

    const confirmButtonValid = () => {
        // 기존비밀번호가 true일때 , 변경할 비밀번호와 비밀번호 재입력 유효성 검사가 true일때
        return validateExistingPassword() && validatePassword() && validateReEnterPassword()
      };

    const changePasswordSubmit = async() => {
        // 디비에 보내고 홈으로 이동시킬지, 모달창을 띄울지는 추후 상의 필요
        // 폰넘버 변경 
        const SERVER_URL = server+ '/passwdchange'

        await axios.post(SERVER_URL, { originPasswd, password,userId })
            .then(res => {
                alert(res.data);
                const updatedUser = { ...user, passwd: password };
                setUser(updatedUser);
                sessionStorage.setItem('passwd', password);
            })
            .catch(error => console.log(error));
    };

      
    return (
        <>
        <Header/>
        <div class="passwordChange-container">
            
            <div class="signup-subtitle">기존 비밀번호 입력</div>
                <div class="input-with-clear">
                    <input
                        type={showExistingPassword ? "text" : "password"} // 입력 필드의 타입을 조정하여 비밀번호를 숨기거나 표시
                        className={`${existingPassword && !validateExistingPassword() ? 'signup-input-error' : 'signup-input'}`}
                        value={existingPassword}
                        onChange={onExistingPasswordHandler}
                    />
                    {existingPassword && (
                        <img
                            alt=""
                            src={showExistingPassword ? "/assets/signup_passwd_blind.png" : "/assets/signup_passwd_no_blind.png"}
                            class="signup-blind-passwd"
                            onClick={() => setShowExistingPassword(!showExistingPassword)} // 클릭 시 showPassword 상태를 토글
                        />
                    )}
                    {existingPassword && !validateExistingPassword() ? (
                        <div class="signup-input-errorMessage">기존 비밀번호와 일치하지 않습니다.</div>
                    ) : (
                        ''
                    )}
                </div>
            <div class="signup-subtitle">변경할 비밀번호 입력</div>
            <div class="input-with-clear">
                    <input
                        type={showPassword ? "text" : "password"} // 입력 필드의 타입을 조정하여 비밀번호를 숨기거나 표시
                        className={`${password && !validatePassword() ? 'signup-input-error' : 'signup-input'}`}
                        value={password}
                        onChange={onPasswordHandler}
                    />
                    {password && (
                        <img

                            src={showPassword ? "/assets/signup_passwd_blind.png" : "/assets/signup_passwd_no_blind.png"}
                            class="signup-blind-passwd"
                            onClick={() => setShowPassword(!showPassword)} // 클릭 시 showPassword 상태를 토글
                        />
                    )}
                    {password && !validatePassword() ? (
                        <div class="signup-input-errorMessage">8자 이상</div>
                    ) : (
                        ''
                    )}
                </div>
            <div class="signup-subtitle">비밀번호 재입력</div>
            <div class="input-with-clear">
                    <input
                        type={showReEnterPassword ? "text" : "password"} // 입력 필드의 타입을 조정하여 비밀번호를 숨기거나 표시
                        className={`${reEnterPassword && !validateReEnterPassword() ? 'signup-input-error' : 'signup-input'}`}
                        value={reEnterPassword}
                        onChange={onReEnterPasswordHandler}
                    />
                    {reEnterPassword && (
                        <img
                            alt=""
                            src={showReEnterPassword ? "/assets/signup_passwd_blind.png" : "/assets/signup_passwd_no_blind.png"}
                            class="signup-blind-passwd"
                            onClick={() => setShowReEnterPassword(!showReEnterPassword)} // 클릭 시 showPassword 상태를 토글
                        />
                    )}
                    {reEnterPassword && !validateReEnterPassword() ? (
                        <div class="signup-input-errorMessage">일치하지 않습니다.</div>
                    ) : (
                        ''
                    )}
                </div>

                <button
                    className={`${confirmButtonValid() ? 'mypage-confirm-active' : 'mypage-confirm-inactive'}`}
                    disabled={!confirmButtonValid()}
                    onClick={() => changePasswordSubmit()}
                >
                    변경하기
                </button>
        </div>
        </>
    );
}

export default PasswordChange;