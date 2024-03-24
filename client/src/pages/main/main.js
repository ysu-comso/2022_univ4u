import React from 'react';
import Header from '../../component/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { useUser } from '../../userContext';
import { useServer } from '../../serverContext';

function Main() {

    const navigate = useNavigate();
    const [programs, setPrograms] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const { user } = useUser();
    const { server } = useServer();


    useEffect(() => {
        getPrograms();
        getOperaingDate();
        if(sessionStorage.getItem('phone') === null){
            navigate('/');
          }
    }, [])

    // 2023-10-23 -> 23.10.23 바꿔주는 함수
    const formatDate = (inputDate) => {
        const parts = inputDate.split('-');
        if (parts.length === 3) {
            const year = parts[0].slice(-2);
            const month = parts[1];
            const day = parts[2];
            return `${year}.${month}.${day}`;
        }
        return inputDate;
    }

    const getOperaingDate = async () => {
        const SERVER_URL = server+'/operatingdate'
        await axios.get(SERVER_URL)
            .then(res => {
                setEndDate(formatDate(res.data[0].end_date))
                setStartDate(formatDate(res.data[0].start_date))
            })
            .catch(error => console.log(error));
    }

    const getPrograms = async () => {
        const SERVER_URL = server+'/programs'
        await axios.get(SERVER_URL)
            .then(res => {
                
                setPrograms(res.data)
            })
            .catch(error => console.log(error));
    }

    const moveReservation = () => {
        navigate('/reservation');
    };

    return (
        <>
            <Header />
            <div className='main-container'>
                <div className='info-container'>
                    <div className='date-txt'>
                        {startDate} ~ {endDate}
                    </div>
                    <div className='info-txt'>가격 안내</div>
                </div>
                <div className='discount-txt'>연성대 재학생 인증시 할인가 적용</div>
                <div className='program-container'>
                    {programs.map((program, index) => (
                        program.prog_name !== programs[index - 1]?.prog_name && (
                            <div className='program-content' key={index}>
                                <div className='program-info-container'>
                                    <div className='program-name'>{program.prog_name}</div>
                                    <div className='program-time'>({program.prog_time}min)</div>
                                </div>
                                <div className='solid' />
                                <div>
                                    <div className='program-price-container' key={index}>
                                        <div className='program-number'>{program.prog_count}권</div>

                                        <div className='program-price-content'>
                                            <div className='program-price-content col-6'>
                                                <div className='program-price-ko'>정상가</div>
                                                <div className='program-price-num'>
                                                    {program.price}원
                                                </div>
                                            </div>
                                            <div className='program-price-content col-6'>
                                                <div className='program-price-ko'>할인가</div>
                                                <div className='program-price-num'>
                                                    {program.discount}원
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {programs[index + 1] &&
                                    <div>
                                        <div className='program-price-container' key={index}>
                                            <div className='program-number'>{programs[index + 1]?.prog_count}권</div>

                                            <div className='program-price-content'>
                                                <div className='program-price-content col-6'>
                                                    <div className='program-price-ko'>정상가</div>
                                                    <div className='program-price-num'>
                                                        {programs[index + 1]?.price}원
                                                    </div>
                                                </div>
                                                <div className='program-price-content col-6'>
                                                    <div className='program-price-ko'>할인가</div>
                                                    <div className='program-price-num'>
                                                        {programs[index + 1]?.discount}원
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        )
                    ))}
                </div>
                <div className='reservation-container'>
                    <button className='reservation-btn' onClick={moveReservation}>
                        <div className='reservation-btn-txt' >예약하기</div>
                    </button>
                </div>
            </div>
        </>
    );
}

export default Main;