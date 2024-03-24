import React from 'react';
import Header from '../../component/header';
import { useState } from 'react';
import { useUser } from '../../userContext';
import axios from 'axios';
import { useServer } from '../../serverContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function PhoneNumChange() {

    const { server } = useServer();
    const [newPhoneNum,setNewPhoneNum] = useState("");
    const [phoneNunCheck, setPhoneNumCheck] = useState("");
    const { user, setUser }  = useUser();
    const originalPhoneNum = sessionStorage.getItem("phone");
    const userId = sessionStorage.getItem('id');

    const navigate = useNavigate();
    
    useEffect(() => {
        if(sessionStorage.getItem('phone') === null){
            navigate('/');
          }
    }, [])

    const onPhoneNumHandler = (event) => {
      setNewPhoneNum(event.currentTarget.value);
      if(event.currentTarget.value.length===11){
        const SERVER_URL = server+'/phoneNumCheck'
        axios.post(SERVER_URL,{
          phoneNum : event.currentTarget.value
        })
        .then(res => {
          setPhoneNumCheck(res.data)
          if(res.data === 1){
            alert('이미 존재하는 전화번호입니다.')
          }
          
        })
        .catch(error => console.log(error));
      }
      };

    // 전화번호 유효성 검사 함수
  const validatePhoneNum = (newPhoneNum) => {
    const phoneNumberPattern = /^010\d{4}\d{4}$/

    if (phoneNumberPattern.test(newPhoneNum) && phoneNunCheck !== 1) {
      return true
    } else {
      return false
    }

  };

  const clearInput = (inputFieldName) => {
    switch (inputFieldName) {
      case 'phoneNum':
        setNewPhoneNum('');
        break;
      default:
        break;
    }
  };

  const confirmButtonValid = () => {
    return (
      validatePhoneNum(newPhoneNum)
    );
  };

  const changePhoneNumSubmit = async() => {
    // 폰넘버 변경 
    const SERVER_URL = server + '/phonenumchange'

      await axios.post(SERVER_URL, { originalPhoneNum, newPhoneNum, userId })
      .then(res => {
        alert('변경완료');
        const updatedUser = { ...user, phone: newPhoneNum };    
        setUser(updatedUser);
        sessionStorage.setItem('phone',newPhoneNum);
    })
    .catch(error => console.log(error));
  }

    

    return (
        <>
        <Header/>
            <div class="phoneNumChange-container">
                
                <div class="signup-subtitle">기존 전화번호</div>
                  <input className='signup-input' type='text' value={originalPhoneNum} disabled={true}/>
                <div class="signup-subtitle">변경할 휴대폰 번호</div>
                <div class="input-with-clear">
                    <input
                        className={`${newPhoneNum && !validatePhoneNum(newPhoneNum) ? 'signup-input-error' : 'signup-input'}`}
                        id="phoneInput"
                        value={newPhoneNum}
                        onChange={onPhoneNumHandler} />
                    {newPhoneNum && (
                        <img alt="" src="/assets/signup_init.png" class="signup-clear-input" onClick={() => clearInput('phoneNum')}>
                        </img>
                    )}
                    {newPhoneNum && !validatePhoneNum(newPhoneNum) ? (
                        <div class="signup-input-errorMessage">`-`제외한 휴대폰 번호</div>
                    ) : (
                        ''
                    )}
                </div>

                <button
                    className={`${confirmButtonValid() ? 'mypage-confirm-active' : 'mypage-confirm-inactive'}`}
                    disabled={!confirmButtonValid()}
                    onClick={() => changePhoneNumSubmit()}
                >
                    변경하기
                </button>

            </div>

        </>
    );
}

export default PhoneNumChange