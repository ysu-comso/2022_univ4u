import React from 'react';
import Header from '../../component/header';
import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
import './customCalendar.css'; // 사용자 정의 스타일을 불러옵니다.
import { useState } from 'react';
import ReservationConfirm from './reservationConfirm';
import axios from 'axios';
import { useEffect } from 'react';
import { useServer } from '../../serverContext';
import { useNavigate } from 'react-router-dom';

function Reservation() {

  const { server } = useServer();
  const navigate = useNavigate();
  const [dateValue, changeDate] = useState(new Date());
  const [chooseDay, setChooseDay] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState('선택한 프로그램');
  const [selectedReservTime, setSelectedReservTime] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedCount, setSelectedCount] = useState('');
  const [viewProgram, setViewProgram] = useState("프로그램을 선택하세요");
  const [programList, setProgramList] = useState([]);
  const [timeList, setTimeList] = useState([]);
  const [unableTimeList, setUnableTimeList] = useState([]);
  const [unableTimeIdx, setUnableTimeIdx] = useState([]);
  const [toggleStatus, setToggleStatus] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0); // 총 가격 나타내기
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const userType = sessionStorage.getItem("std");

  // 오늘 이전 날짜는 클릭할 수 없게하는 함수
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 오늘 날짜의 시간 정보를 00:00:00으로 


  const formatStartDate = (inputDate) => {
    const parts = inputDate.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];
      return [year, month - 1, day];
    }
    return inputDate;
  }
  const openDate = formatStartDate(startDate);
  const closeDate = formatStartDate(endDate);


  const getOperaingDate = async () => {
    const SERVER_URL = server+'/operatingdate'
    await axios.get(SERVER_URL)
      .then(res => {
        setEndDate(res.data[0].end_date)
        setStartDate(res.data[0].start_date)
      })
      .catch(error => console.log(error));
  }

  const getTimeList = async () => {
    const SERVER_URL = server+'/getTimeList'
    await axios.get(SERVER_URL)
      .then(res => {
        console.log(res.data)
        setTimeList(res.data)
      })
      .catch(error => console.log(error));
  }

  const getPrograms = async () => {
    const SERVER_URL = server+'/programs'
    await axios.get(SERVER_URL)
      .then(res => {
        setProgramList(res.data)
      })
      .catch(error => console.log(error));

  }



  // 날짜데이터 형식 만들기 ex)23.10.04
  const formattedDate = dateValue.toLocaleDateString('ko-KR', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });

  const lastIndex = formattedDate.lastIndexOf('.');
  const trimmedDate = formattedDate.substring(0, lastIndex); // 맨 뒤의 점 제거

  const plzChooseDate = () => {
    if (chooseDay === false) {
      alert('날짜를 선택해주세요');
      return false;
    } else {
      setToggleStatus(!toggleStatus);
    }
  }

  const onProgramCountHandler = (count) => {
    setSelectedCount(count)
    const price = calculatePrice(selectedProgram, count);
    setTotalPrice(price);
  }

  const onClickConfirmModal = () => {
    setConfirmModal(true)
  }

  const onClickProgram = (item_name, item_time) => {
    setSelectedProgram(item_name)
    setSelectedTime(item_time)
    setViewProgram(item_name + " " + item_time + "min")
    setToggleStatus(false)
    const price = calculatePrice(item_name, selectedCount);
    setTotalPrice(price);
  }

  const onClickDay = () =>{
    //클릭한 날짜의 예약가능 시간대 데이터 가져오기 
    setChooseDay(true)
  }

  useEffect(()=>{
    const SERVER_URL = server+'/ableTime'
    axios.post(SERVER_URL, { trimmedDate })
      .then(res => {
        const timelist = res.data;
        const setData = timelist.map(item => item.reservation_time);
        setUnableTimeList(setData);
        const updatedTimeList = timeList.map(time => !setData.includes(time));
        setUnableTimeIdx(updatedTimeList);
      })
      .catch(error => console.log(error));
  },[trimmedDate])

  // 월요일과 수요일만 활성화 또는 비활성화하는 함수
  const tileDisabled = ({ date, view }) => {
    const startDate = new Date(openDate[0], openDate[1], openDate[2]); // 10월 1일

    const endDate = new Date(closeDate[0], closeDate[1], closeDate[2]); // 10월 10일

    // startDate와 endDate 사이의 날짜 중에서 월요일 또는 수요일인 경우 활성화, 나머지는 비활성화
    if (date >= startDate && date <= endDate && date >= today) {
      if (date.getDay() === 1 || date.getDay() === 2 || date.getDay() === 4) {
        return false; // 활성화
      }
    }
    return true; // 비활성화
  };

  // tileContent 함수를 사용하여 오늘의 날짜에 '오늘' 텍스트를 추가
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const isToday = date.getDate() === new Date().getDate();
      return isToday ? <p style={{ position: 'absolute', marginLeft: '11px', fontSize: '8px', marginBottom: '0px', zIndex: '99' }}>오늘</p> : null;
    }
    return null;
  };

  // 가격 계산 함수
  const calculatePrice = (program, count) => {

    const selectedData = programList.filter(item => item.prog_name === program && item.prog_count === count);

    // 필터링된 결과에서 price와 discount 값을 추출
    const prices = selectedData.map(item => item.price);
    const discounts = selectedData.map(item => item.discount);

    // return prices;

    //로그인한 사람의 역할에따라 다른값 보내기 
    if(userType==='재학생'){
      return discounts;
    }else{
      return prices;
    }
  };

  // 모든 내용 클릭해야 예약하기 클릭할 수 있게하는 함수
  const reservationConfirm = () => {

    return (
      dateValue !== '' &&
      selectedProgram !== '' && // 프로그램 선택
      selectedCount !== '' && // 횟수 선택
      selectedReservTime !== ''// 시간 선택
    );
  };

  const onSelectReservTime = (item) => {
    if (chooseDay === false) {
      alert('날짜를 선택해주세요');
      return false;
    }else{
      setSelectedReservTime(item)
    }
    
  }


  useEffect(() => {
    getOperaingDate();
    getPrograms();
    getTimeList();
   
    if (sessionStorage.getItem('phone') === null) {
      navigate('/');
    }
  }, []);

  return (
    <>
      <Header></Header>
      {/* 날짜 선택 */}
      <div class="reservation-category-container">
        <img src='assets/icon_reservation_calendar.png' alt="" class="reservation-category-icon" />
        <div class="reservation-category">날짜 선택</div>

      </div>
      <div class="reservation-content-container">
        <Calendar
          onChange={changeDate}
          onClickDay={() => onClickDay()}
          formatDay={(locale, date) =>
            date.toLocaleString('en', { day: 'numeric' })
          }
          value={chooseDay ? dateValue : null}
          // nextLabel={<NextIcon />}
          // prevLabel={<PrevIcon />}
          next2Label={null}
          prev2Label={null}
          showNeighboringMonth={false} // 해당 월 날짜들만 보여줌
          tileDisabled={tileDisabled} // 날짜 비활성화
          tileContent={tileContent} // tileContent 함수 사용
        />
      </div>

      {/* 프로그램 선택 */}
      <div class="reservation-category-container">
        <img src='assets/icon_reservation_choose_program.png' alt="" class="reservation-category-icon" />
        <div class="reservation-category">프로그램 선택</div>
      </div>
      <div class="reservation-content-container">
        <div class="reservation-program-container">
          <div class="reservation-program-selected" onClick={()=>plzChooseDate()} >
            <div>{viewProgram}</div>
            <img src="/assets/icon_programlist_toggle.png" alt="" />
          </div>
          {toggleStatus &&
            <div class="reservation-program-contents">
              {programList.map((item, idx) => {
                const isDuplicate = idx > 0 && item.prog_name === programList[idx - 1].prog_name;
                return (
                  isDuplicate && (
                    <>
                      <div key={idx} onClick={() => onClickProgram(item.prog_name, item.prog_time)}>
                        {item.prog_name} {item.prog_time + "min"}
                      </div>
                      {programList[idx + 2] && <div className="dash" />}
                      {/* {idx !== programList.length - 1 && <div className="dash" />} */}
                    </>
                  )
                )
              })}
            </div>
          }
          {/* {selectProgramStatus &&  */}
          <div class="reservation-category">횟수</div>
          <div class="signup-buttonContainer">
            <div class="signup-buttonContents">
              <button onClick={() => onProgramCountHandler('1회')} className=
                {selectedCount === '1회' ? 'signup-button-selected' : 'signup-button-unselected'}> 1회 </button>
              <button onClick={() => onProgramCountHandler('3회')} className=
                {selectedCount === '3회' ? 'signup-button-selected' : 'signup-button-unselected'}> 3회 </button>
            </div>
          </div>
          {/* } */}

        </div>
      </div>
      {/* 시간 선택 */}
      <div class="reservation-category-container">
        <img src='assets/icon_reservation_choose_time.png' alt="" class="reservation-category-icon" />
        <div class="reservation-category">시간 선택</div>
      </div>
      <div class="reservation-content-container">
        <div class="reservation-time-container">
          {timeList.map((item, idx) => {

            const isDisabled = !unableTimeIdx[idx]; // updatedTimeList가 false이면 disabled
            return (
              <button
                key={idx}
                className={`reservation-time-content ${selectedReservTime === item ? 'reservation-time-selected' : ''} ${isDisabled ? 'reservation-time-disabled' : ''}`}
                disabled={isDisabled}
                onClick={() => onSelectReservTime(item)}>
                {item}
              </button>
            )
          })}
        </div>
      </div>
      <div class="reservation-category-container pay">
        <img src='assets/icon_reservation_pay.png' alt="" class="reservation-category-icon" />
        <div class="reservation-category">결제 금액 <span>{totalPrice}원</span> 
          {userType==="재학생" && selectedCount && selectedReservTime ? <span style={{fontSize:'10px',color:'red',marginLeft:'10px'}}>할인가 적용</span>: null}
        </div>
      </div>
      <div class="reservation-content-container">
        <button className={`${reservationConfirm() ? 'reservation-pay-active' : 'reservation-pay-inactive'}`}
          onClick={onClickConfirmModal}
          disabled={!reservationConfirm()}
        >예약하기</button>
      </div>


      {confirmModal === true &&
        <ReservationConfirm
          dateValue={trimmedDate}
          selectedProgram={selectedProgram}
          selectedTime={selectedTime}
          selectedReservTime={selectedReservTime}
          selectedCount={selectedCount}
          totalPrice={totalPrice}
          setConfirmModal={setConfirmModal}
        />}
    </>
  );
}

export default Reservation;