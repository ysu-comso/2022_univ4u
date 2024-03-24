import React, { useState } from "react";
import styled from "styled-components";
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import { useServer } from '../../../serverContext';

function MoreModal({dateValue, selectedTime, setConfirmModal }) {

  const navigate = useNavigate();

  const {server} = useServer();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const reservId = searchParams.get("id");
  const progName = searchParams.get("prog_name");
  const progTime = searchParams.get("prog_time");
  const remain_count = searchParams.get("remain_count");
  const total_count = searchParams.get("total_count");
  const price = searchParams.get("price");

  // 예약테이블에 보낼 회원 정보 sessionStorage에서 추출
  const sessionStorageKeys = Object.keys(sessionStorage);
  const sessionStorageData = {};
  sessionStorageKeys.forEach(key => {
    sessionStorageData[key] = sessionStorage.getItem(key);
  });
  const { consent, gender, id, name, passwd, phone, std } = sessionStorageData;

  const [clickYesNo, setClickYesNo] = useState('');
  const [inputText, setInputText] = useState('');

  const goMyTree = () => {
    setConfirmModal(false)
    navigate('/myTree')
  }

  const onClickYes = async () => {
    const SERVER_URL = server+'/reservationMore1'
    await axios.post(SERVER_URL, {
      client_id: id,
      reservation_id: reservId,
      name: name,
      phone: phone,
      gender: gender,
      std: std,
      prog_name: progName,
      prog_time: progTime,
      remain_count: remain_count,
      total_count: total_count,
      note: inputText,
      reservation_date: dateValue,
      reservation_time: selectedTime,
      price: price,
      discount: price,
      reservation_status: '예약대기'
    })
      .then(res => {
        if (res.data === 1){
          alert('선택하신 시간의 예약 가능한 인원수를 초과했습니다.')
          return false;
        }
        setClickYesNo('yes')
        const SERVER_URL =  server+'/reservationMore'
        axios.post(SERVER_URL, {
          id: reservId,
          note: inputText,
          reservation_date: dateValue,
          reservation_time: selectedTime,
        })
      })
      .catch(error => console.log(error));
  }

  const onClickNo = () => {
    setClickYesNo('no')
  }

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  }

  return (
    <Overlay>
      <ModalWrap onClick={(e) => e.stopPropagation()}>
        {clickYesNo === 'yes' ?
          <>
            <div class="reservationModal-header1">예약이 완료되었습니다.</div>
            <div class="reservationModal-warning">결제는 프로그램 이용 후 부탁드립니다.</div>
            <button class="reservationModal-confirm" onClick={() => goMyTree()}>확인</button>
          </>
          :
          clickYesNo === 'no'
            ?
            <>
              <div class="reservationModal-header1">예약 취소되었습니다.</div>
              <button class="reservationModal-confirm" onClick={() => setConfirmModal(false)}>확인</button>
            </>
            :
            <>

              <div className="myTree-modal-header">
                <div className="myTree-modal-title">예약 확인</div>
              </div>
              <div className="myTree-modal-content">
                <div className="myTree-modal-inner-content">
                  <div className="myTree-modal-inner-txt">날짜 / 시간</div>
                  <div className="myTree-modal-inner-data">{dateValue} / {selectedTime}</div>
                </div>
                <div className="myTree-modal-inner-content">
                  <div className="myTree-modal-inner-txt">프로그램</div>
                  <div className="myTree-modal-inner-data">
                    <div className="myTree-modal-inner-view">
                      <div>{progName}</div>
                      <div className="small-txt">({progTime}min)</div>
                    </div>
                  </div>
                </div>
                <div className="myTree-modal-inner-content">
                  <div className="myTree-modal-inner-txt">
                    <div className="myTree-modal-inner-view">
                      <div>횟수</div>
                      <div className="small-txt">(잔여/총)</div>
                    </div>
                  </div>
                  <div className="myTree-modal-inner-data">{remain_count}회 / {total_count} 회</div>
                </div>
                <div class="myTree-modal-inner-content">
                  <div class="myTree-modal-inner-txt">요청사항</div>
                  <input class="reservationModal-info"
                    type="text" // 입력 필드의 유형
                    value={inputText} // 입력 필드의 값은 상태에 의해 제어
                    onChange={handleInputChange} // 값이 변경될 때 호출되는 이벤트 핸들러
                  />
                </div>
              </div>
              <div className="myTree-modal-bottom">
                <button className="myTree-modal-btn btn-wrong" onClick={onClickNo}>취소</button>
                <button className="myTree-modal-btn btn-right" onClick={onClickYes}>예약하기</button>
              </div>
            </>
        }

      </ModalWrap>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
`;

const ModalWrap = styled.div`
  width: 370px;
  height: fit-content;
  border-radius: 15px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
`;

export default MoreModal;