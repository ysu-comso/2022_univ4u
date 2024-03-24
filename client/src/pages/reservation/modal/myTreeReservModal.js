import React, { useState } from "react";
import styled from "styled-components";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

function MyTreeReservModal({ setReservModal, moreData }) {

  return (
    <Overlay>
      <ModalWrap onClick={(e) => e.stopPropagation()}>
      <div className="myTree-modal-header">
          <div className="myTree-modal-title">
            <div className="myTree-modal-inner-view">
                <div>{moreData.prog_name}</div>
                <div className="small-txt">({moreData.prog_time}min)</div>
              </div>
          </div>
        </div>
        <div className="myTree-modal-content">
          <div className="myTree-modal-inner-content">
          </div>
          <div className="myTree-modal-inner-content">
            <div className="myTree-modal-inner-txt">잔여 횟수</div>
            <div className="myTree-modal-inner-data">{moreData.remain_count}회</div>
          </div>
        </div>
        <div className="myTree-modal-bottom">
          <button className="myTree-modal-btn btn-wrong" onClick={() => setReservModal(false)}>닫기</button>
{/* 
          <Link
            to={`/moreReserv?prog_name=${encodeURIComponent(moreData.prog_name)}&prog_time=${moreData.prog_time}&remain_count=${moreData.remain_count}&total_count=${moreData.total_count}&id=${moreData.id}&price=${moreData.price}`}
            className="myTree-modal-btn btn-right myTree-modal-link"
            onClick={() => setReservModal(false)}
          >
            추가예약
          </Link> */}

          <button className="myTree-modal-btn btn-right">
            <Link
              to={`/moreReserv?prog_name=${encodeURIComponent(moreData.prog_name)}&prog_time=${moreData.prog_time}&remain_count=${moreData.remain_count}&total_count=${moreData.total_count}&id=${moreData.id}&price=${moreData.price}`}
              className="myTree-modal-link"
              onClick={() => setReservModal(false)}
            >
              추가예약
            </Link>
          </button>
        </div>
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
export default MyTreeReservModal;