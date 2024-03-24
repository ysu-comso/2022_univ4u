import React from 'react';
import Header from '../../component/header';
import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
import './customCalendar.css'; // 사용자 정의 스타일을 불러옵니다.
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import MoreModal from './modal/moreModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { useServer } from '../../serverContext';

function MoreReserv() {


  const { server } = useServer();
  const navigate = useNavigate();
  const [dateValue, changeDate] = useState(new Date());
  const [chooseDay, setChooseDay] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [timeList, setTimeList] = useState(['17 : 00', '17 : 30', '18 : 00', '18 : 30']);
  const [unableTimeList, setUnableTimeList] = useState([]);
  const [unableTimeIdx, setUnableTimeIdx] = useState([]);
  const [confirmModal, setConfirmModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const progName = searchParams.get("prog_name");
  const progTime = searchParams.get("prog_time");



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

  // 날짜데이터 형식 만들기 ex)23.10.04
  const formattedDate = dateValue.toLocaleDateString('ko-KR', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });

  const lastIndex = formattedDate.lastIndexOf('.');
  const trimmedDate = formattedDate.substring(0, lastIndex); // 맨 뒤의 점 제거

  const onClickConfirmModal = () => {
    setConfirmModal(true)
  }
  
  const onClickSelectTime = (item) => {
    if (chooseDay === false) {
      alert('날짜를 선택해주세요');
      return null;
    }else{
      setSelectedTime(item)
    }
    
  }

  // 월요일과 수요일만 활성화 또는 비활성화하는 함수
  const tileDisabled = ({ date, view }) => {
    const startDate = new Date(openDate[0], openDate[1], openDate[2]); // 10월 1일

    const endDate = new Date(closeDate[0], closeDate[1], closeDate[2]); // 10월 10일

    // startDate와 endDate 사이의 날짜 중에서 월요일 또는 수요일인 경우 활성화, 나머지는 비활성화
    if (date >= startDate && date <= endDate && date >= today) {
      if (date.getDay() === 1 || date.getDay() === 3) {
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

  // 모든 내용 클릭해야 예약하기 클릭할 수 있게하는 함수
  const reservationConfirm = () => {
    return (
      dateValue !== '' &&
      selectedTime !== ''// 시간 선택
    );
  };

  

  useEffect(() => {
    getOperaingDate();
    if(sessionStorage.getItem('phone') === null){
      navigate('/');
    }
  }, [])

  //클릭한 날짜의 예약가능 시간대 데이터 가져오기 
  useEffect(() => {

    const SERVER_URL = server+ '/ableTime'
    axios.post(SERVER_URL, { trimmedDate })
      .then(res => {
        const timelist = res.data;
        const setData = timelist.map(item => item.reservation_time);
        setUnableTimeList(setData);
        const updatedTimeList = timeList.map(time => !unableTimeList.includes(time));
        setUnableTimeIdx(updatedTimeList);
      })
      .catch(error => console.log(error));
    // };


  }, [tileContent])

  return (
    <>
      <Header></Header>
      <div class="reservation-category-container">
        <div class="reservation-category title-view">{progName}{" "+progTime + "min"}</div>
      </div>
      <div class="reservation-category-container">
        <img src='assets/icon_reservation_calendar.png' alt="" class="reservation-category-icon" />
        <div class="reservation-category">날짜 선택</div>
      </div>
      <div class="reservation-content-container">
        <Calendar
          onChange={changeDate}
          onClickDay={() => setChooseDay(true)}
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
      {/* 시간 선택 */}
      <div class="reservation-category-container">
        <img src='assets/icon_reservation_choose_time.png' alt="" class="reservation-category-icon" />
        <div class="reservation-category">시간 선택</div>
      </div>
      <div class="reservation-content-container line2">
        <div class="reservation-time-container">
          {timeList.map((item, idx) => {
            const isDisabled = !unableTimeIdx[idx]; // updatedTimeList가 false이면 disabled
            return (
              <button
                key={idx}
                className={`reservation-time-content ${selectedTime === item ? 'reservation-time-selected' : ''} ${isDisabled ? 'reservation-time-disabled' : ''} `}
                disabled={isDisabled}
                onClick={() => onClickSelectTime(item)}>
                {item}
              </button>
            )
          })}
        </div>
      </div>
      <div className='view' />
      <div class="reservation-content-container line">
        <button className={`bottom-btn ${reservationConfirm() ? 'reservation-pay-active' : 'reservation-pay-inactive'}`}
          onClick={onClickConfirmModal}
          disabled={!reservationConfirm()}
        >예약하기</button>
      </div>


      {confirmModal === true &&
        <MoreModal
          dateValue={trimmedDate}
          selectedTime={selectedTime}
          setConfirmModal={setConfirmModal}
        />}
    </>
  );
}

export default MoreReserv;