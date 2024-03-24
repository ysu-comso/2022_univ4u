import React, { useState } from "react";
import styled from "styled-components";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useServer } from '../../../serverContext';

function MyTreeCancleModal({ setCancleModal, cancleData }) {
  
  const navigate = useNavigate();
  
  const { server } = useServer();
  const parts = cancleData.reservation_date.split('.');
  const formattedDate = `20${parts[0]}.${parts[1]}.${parts[2]}`;
  const reservation_time = cancleData.reservation_time.split(' ').join('');
  
  const [confirmModal, setConfirmModal] = useState('');

  const getModalStatus = () => {
    if (confirmModal === '') {
      setConfirmModal('1')
    } else if (confirmModal === '1') {
      setConfirmModal('2')
    } else {
      getCancle()
      getCancle1()
      getCancle2()
      setCancleModal(false)
    }
  }
  //취소하면 reservation_details 테이블에서 데이터 삭제
  const getCancle = async () => {
    const SERVER_URL = server+'/reservationCancle';
    try {
        await axios.post(SERVER_URL, {
          id: cancleData.id
        })
    } catch (error) {
        console.log("error : ", error);
    }
  }
    
  //취소하면 reservations 테이블 remain_count + 1
  const getCancle1 = async () => {
    try {
      const SERVER_URL = server+'/reservationCancle1'
      axios.post(SERVER_URL, {
        client_id : cancleData.client_id,
        reservation_id : cancleData.reservation_id,
        prog_name : cancleData.prog_name,
        prog_time : cancleData.prog_time,
        
      })
    } catch (error) {
        console.log("error : ", error);
    }
  }

  //취소하면 reservation_list 테이블에 값넣기
  const getCancle2 = async () => {
    try {
      const SERVER_URL = server+'/reservationCancle2'
      axios.post(SERVER_URL, {
        client_id: cancleData.client_id,
        name: cancleData.name,
        phone: cancleData.phone,
        gender: cancleData.gender,
        std: cancleData.std,
        prog_name: cancleData.prog_name,
        prog_time: cancleData.prog_time,
        remain_count: cancleData.remain_count,
        total_count: cancleData.total_count,
        note: cancleData.note,
        reservation_date: cancleData.reservation_date,
        reservation_time: cancleData.reservation_time,
        price: cancleData.price,
        reservation_status: '취소완료'
      })
    } catch (error) {
        console.log("error : ", error);
    }
  }
  

  return (
    <Overlay>
      <ModalWrap onClick={(e) => e.stopPropagation()}>
        {
          confirmModal === '1' ?
            <>
              <div className="myTree-modal-header">
                <div className="myTree-modal-confirm-title">
                  예약을 취소하시겠습니까?
                </div>
              </div>
              <div className="myTree-modal-bottom">
                <button className="myTree-modal-btn btn-right" onClick={getModalStatus}>예</button>
                <button className="myTree-modal-btn btn-wrong" onClick={() => setCancleModal(false)}>아니오</button>
              </div>
            </>
            :
            confirmModal === '2' ?
              <>
                <div className="myTree-modal-header">
                  <div className="myTree-modal-confirm-title">
                    예약이 취소되었습니다
                  </div>
                </div>
                <div className="myTree-modal-bottom">
                  <button className="myTree-modal-btn btn-right btn-pull" onClick={getModalStatus}>확인</button>
                </div>
              </>
              :
              <>
                <div className="myTree-modal-header">
                  <div className="myTree-modal-title">
                    예약 정보
                  </div>
                </div>
                <div className="myTree-modal-content">
                  <div className="myTree-modal-inner-content">
                    <div className="myTree-modal-inner-txt">날짜 / 시간</div>
                    <div className="myTree-modal-inner-data">{formattedDate} / {reservation_time}</div>
                  </div>
                  <div className="myTree-modal-inner-content">
                    <div className="myTree-modal-inner-txt">프로그램</div>
                    <div className="myTree-modal-inner-data">
                      <div className="myTree-modal-inner-view">
                        <div>{cancleData.prog_name}</div>
                        <div className="small-txt">({cancleData.prog_time}min)</div>
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
                    <div className="myTree-modal-inner-data">{cancleData.remain_count}회 / {cancleData.total_count}회</div>
                  </div>
                </div>
                <div className="myTree-modal-bottom">
                  <button className="myTree-modal-btn btn-right" onClick={getModalStatus}>예약취소</button>
                  <button className="myTree-modal-btn btn-wrong" onClick={() => setCancleModal(false)}>닫기</button>
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
      width: 350px;
      height: fit-content;
      border-radius: 15px;
      background-color: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 20px;
      `;
export default MyTreeCancleModal;