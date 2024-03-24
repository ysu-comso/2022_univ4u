import React, { useState } from 'react';
import '../../assets/styles.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useServer } from '../../serverContext';

function SignUp() {

  const navigate = useNavigate();

  const {server} = useServer();
  const [phoneNum, setPhoneNum] = useState("");
  const [phonNumCheck, setPhoneNumCheck] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState(null);
  const [studentsConfirm, setStudentConfirm] = useState(null);
  const [marketing, setMarketing] = useState('미동의');

  const [checkAll, setCheckAll] = useState(false);
  const [individualChecks, setIndividualChecks] = useState({
    agree1: false,
    agree2: false,
    agree3: false,
  });

  // 전체 동의 체크박스를 클릭할 때 실행되는 함수
  const handleCheckAll = () => {
    const newCheckAll = !checkAll;
    setCheckAll(newCheckAll);

    // 개별 동의 체크박스들도 전체 동의와 동일한 상태로 설정
    setIndividualChecks({
      agree1: newCheckAll,
      agree2: newCheckAll,
      agree3: newCheckAll,
    });
  };

  // 개별 동의 체크박스를 클릭할 때 실행되는 함수
  const handleIndividualCheck = (checkboxId) => {
    const newIndividualChecks = { ...individualChecks };
    newIndividualChecks[checkboxId] = !newIndividualChecks[checkboxId];
    setIndividualChecks(newIndividualChecks);

    // 개별 동의 체크박스 상태에 따라 전체 동의 체크박스 설정
    setCheckAll(
      newIndividualChecks.agree1 && newIndividualChecks.agree2 && newIndividualChecks.agree3
    );

    // 동의 값 설정
    let agreedValue = '미동의'; // 기본적으로 미동의 상태

    if (newIndividualChecks.agree3) {
      agreedValue = '동의'; // agree3가 체크된 경우에 동의로 설정
    }

    setMarketing(agreedValue);
  };

  const onPhoneNumHandler = (event) => {
    setPhoneNum(event.currentTarget.value);
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

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onNameHandler = (event) => {
    setName(event.currentTarget.value);
  };

  const onBirthdayHandler = (event) => {
    setBirthday(event.currentTarget.value);
  };

  const onGenderHandler = (gender) => {
    setGender(gender)
  };
  const onStudentConfirmHandler = (student) => {
    setStudentConfirm(student)
  };

  // x 버튼 클릭시 각 Input값 초기화
  const clearInput = (inputFieldName) => {
    switch (inputFieldName) {
      case 'phoneNum':
        setPhoneNum('');
        break;
      case 'password':
        setPassword('');
        break;
      case 'name':
        setName('');
        break;
      case 'birthday':
        setBirthday('');
        break;
      default:
        break;
    }
  };

  // 전화번호 유효성 검사 함수
  const validatePhoneNum = (phoneNumber) => {
    const phoneNumberPattern = /^010\d{4}\d{4}$/
    
    if (phoneNumberPattern.test(phoneNumber) && phonNumCheck !== 1) {
      return true
    } else {
      return false
    }

  };

  // 비밀번호 유효성 검사 함수
  const validatePassword = (password) => {
    return password.length >= 8;
  };

  // 생년월일 유효성 검사 함수
  const validateDateOfBirth = (dateOfBirth) => {
    const dateRegex = /^\d{4}\d{2}\d{2}$/; //? YYYYMMDD 형식의 정규식
    const dateRegex2 = /^\d{4}-\d{2}-\d{2}$/; //? YYYY-MM-DD 형식의 정규식
    const dateRegex3 = /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/; //? 230613 kty YYYYMMDD 각 자리에 유효한 생년월일인지 확인
    const dateRegex4 = /^(19|20)\d{2}-(0[1-9]|1[0-2])-([0-2][1-9]|3[01])$/; //? 230613 kty YYYY-MM-DD 각 자리에 유효한 생년월일인지 확인

    if (dateRegex.test(dateOfBirth) || dateRegex2.test(dateOfBirth)) {
      if (dateRegex3.test(dateOfBirth) || dateRegex4.test(dateOfBirth)) return true;
      else return false;
    }
    return false;
  };

  const confirmButtonValid = () => {
    return (
      validatePhoneNum(phoneNum) &&
      validatePassword(password) &&
      name !== "" &&
      validateDateOfBirth(birthday) &&
      gender !== null &&
      studentsConfirm !== null &&
      (individualChecks.agree1 && individualChecks.agree2) 
      
    )
  };

  const signupSubmit = async() => {
    const SERVER_URL = server+'/signup'
    await axios.post(SERVER_URL,{phoneNum,password,name,birthday,gender,studentsConfirm,marketing})

    alert('회원가입이 성공적으로 완료되었습니다.')
    navigate('/')
  }

  return (
    <>
      <div class="signup-container">
        <div class="signup-title" >
          회원가입
        </div>

        <div class="signup-subtitle">휴대폰 번호</div>
        <div class="input-with-clear">
          <input
            className={`${phoneNum && !validatePhoneNum(phoneNum) ? 'signup-input-error' : 'signup-input'}`}
            id="phoneInput"
            value={phoneNum}
            placeholder={'`-`제외한 휴대폰 번호'}
            onChange={onPhoneNumHandler} />
          {phoneNum && (
            <img alt="" src="/assets/signup_init.png" class="signup-clear-input" onClick={() => clearInput('phoneNum')}>
            </img>
          )}
          {phoneNum && !validatePhoneNum(phoneNum) ? (
            <div class="signup-input-errorMessage">전화번호를 바르게 입력해 주세요</div>
          ) : (
            ''
          )}
        </div>


        <div class="signup-subtitle">비밀번호</div>
        <div class="input-with-clear">
          <input
            type={showPassword ? "text" : "password"} // 입력 필드의 타입을 조정하여 비밀번호를 숨기거나 표시
            className={`${password && !validatePassword(password) ? 'signup-input-error' : 'signup-input'}`}
            value={password}
            placeholder={'8자리 이상'}
            onChange={onPasswordHandler}
          />
          {password && (
            <img
              alt=""
              src={showPassword ? "/assets/signup_passwd_blind.png" : "/assets/signup_passwd_no_blind.png"}
              class="signup-blind-passwd"
              onClick={() => setShowPassword(!showPassword)} // 클릭 시 showPassword 상태를 토글
            />
          )}
          {password && !validatePassword(password) ? (
            <div class="signup-input-errorMessage">8자 이상 입력해 주세요</div>
          ) : (
            ''
          )}
        </div>

        <div class="signup-subtitle">이름</div>
        <div class="input-with-clear">
          <input class="signup-input"
            value={name}
            onChange={onNameHandler}
            placeholder={'이름 입력'}
          />
          {name && (
            <img alt="" src="/assets/signup_init.png" class="signup-clear-input" onClick={() => clearInput('name')}>
            </img>
          )}
        </div>

        <div class="signup-subtitle">생년월일</div>
        <div class="input-with-clear">
          <input className={`${birthday && !validateDateOfBirth(birthday) ? 'signup-input-error' : 'signup-input'}`}
            value={birthday}
            placeholder={'생년월일 8자리'}
            onChange={onBirthdayHandler}
          />
          {birthday && (
            <img alt="" src="/assets/signup_init.png" class="signup-clear-input" onClick={() => clearInput('birthday')}>
            </img>
          )}
          {birthday && !validateDateOfBirth(birthday) ? (
            <div class="signup-input-errorMessage">생년월일 8자리를 바르게 입력해 주세요</div>
          ) : (
            ''
          )}
        </div>

        <div class="signup-subtitle">성별</div>
        <div class="signup-buttonContainer">
          <div class="signup-buttonContents">
            <button onClick={() => onGenderHandler('남자')} className={gender === '남자' ? 'signup-button-selected' : 'signup-button-unselected'}> 남자 </button>
            <button onClick={() => onGenderHandler('여자')} className={gender === '여자' ? 'signup-button-selected' : 'signup-button-unselected'}> 여자 </button>
          </div>
        </div>

        <div class="signup-subtitle">연성대 재학생인가요?</div>
        <div class="signup-buttonContainer">
          <div class="signup-buttonContents">
            <button onClick={() => onStudentConfirmHandler('재학생')} className={studentsConfirm === '재학생' ? 'signup-button-selected' : 'signup-button-unselected'}> 예 </button>
            <button onClick={() => onStudentConfirmHandler('외부인')} className={studentsConfirm === '외부인' ? 'signup-button-selected' : 'signup-button-unselected'}> 아니오 </button>
          </div>
          {studentsConfirm === '재학생' && (
            <div class="signup-input-errorMessage1">결제 시 학생증 / 포털 로그인을 통해 재학생 인증을 해주세요</div>
          )}
        </div>

        {/* 이용약관 */}
        <div class="signup-subtitle">이용약관</div>
        <div className="signup-terms">
          <div className="signup-terms-contents">
            <div className="check__line">
              <input
                id="agree1"
                type="checkbox"
                checked={individualChecks.agree1}
                onChange={() => handleIndividualCheck('agree1')}
              />
              <label htmlFor="agree1">
                <span>개인정보 수집 제공 동의</span>
                <span className="signup-littleTitle">(필수)</span>
              </label>
            </div>
            <div className="check__line">
              <input
                id="agree2"
                type="checkbox"
                checked={individualChecks.agree2}
                onChange={() => handleIndividualCheck('agree2')}
              />
              <label htmlFor="agree2">
                <span>제 3자 정보 제공 동의</span>
                <span className="signup-littleTitle">(필수)</span>
              </label>
            </div>
            <div className="check__line">
              <input
                id="agree3"
                type="checkbox"
                checked={individualChecks.agree3}
                onChange={() => handleIndividualCheck('agree3')}
              />
              <label htmlFor="agree3">
                <span>마케팅 활용 및 광고</span>
                <span className="signup-littleTitle">(선택)</span>
              </label>
            </div>

            <hr style={{ width: '100%', marginTop: '20px', marginBottom: '20px' }} />

            <div className="check__line">
              <input
                id="agree4"
                type="checkbox"
                checked={checkAll}
                onChange={handleCheckAll}
              />
              <label htmlFor="agree4">
                <span>전체 동의</span>
              </label>
            </div>
          </div>
        </div>

        <button
          className={`${confirmButtonValid() ? 'signup-confirm-active' : 'signup-confirm-inactive'}`}
          disabled={!confirmButtonValid()}
          onClick={() => signupSubmit()}
        >
          회원가입
        </button>
      </div>
    </>
  );
}

export default SignUp;