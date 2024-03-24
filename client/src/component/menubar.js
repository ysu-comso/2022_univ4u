import React from 'react'
import '../assets/styles.css'
import { useNavigate} from 'react-router-dom';

export default function Menubar(props) {

  const {menuVisible,setMenuVisible} = props
  const navigate = useNavigate();
  const userName = sessionStorage.getItem('name');

  const moveChangePhoneNum = () => {
    // 클릭 시 특정 URL로 이동
    navigate('/phoneNumChange');
  };

  const moveChangePW = () => {
    // 클릭 시 특정 URL로 이동
    navigate('/passwordChange');
  };
  const logOut = () => {
    // 클릭 시 특정 URL로 이동
    sessionStorage.clear();
    navigate('/');
  };

  const moveMyTree = () => {
    // 클릭 시 특정 URL로 이동
    navigate('/myTree');
  };

  const moveReservation = () => {
    // 클릭 시 특정 URL로 이동
    navigate('/reservation');
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
};
  
  return (
    <>
    <div className={`menu-slide ${menuVisible ? 'open' : ''}`}>
      <div class="menubar-close">
        <img class="menubar-close-icon" onClick={toggleMenu} alt="" src='assets/icon_x.png'/>
      </div>
      <div class="menubar-container">
        <div class="menubar-header">
          <div class="menubar-header-name">{userName}님</div>
        </div>
        <div class="menubar-menu-title">
            내정보관리
        </div>
        <div class="menubar-contour"/>
        <div class="menubar-menu-list">
          <div class="menubar-menu-content" onClick={moveChangePhoneNum}>
            <div>전화번호 변경</div>
            <img class="menubar-menu-icon" alt="" src='assets/icon_menubar_right_arrow.png'/>
          </div>
          <div class="menubar-menu-content" onClick={moveChangePW}>
            <div>비밀번호 변경</div>
            <img class="menubar-menu-icon" alt="" src='assets/icon_menubar_right_arrow.png'/>
          </div>
          {/* <div class="menubar-menu-content">
            <div>재학생인증</div>
            <img class="menubar-menu-icon" alt="" src='assets/icon_menubar_right_arrow.png'/>
          </div> */}
          <div class="menubar-menu-content" onClick={logOut}>
            <div>로그아웃</div>
            <img class="menubar-menu-icon" alt="" src='assets/icon_menubar_right_arrow.png'/>
          </div>
        </div>
        <div class="menubar-menu-title">
            예약관리
        </div>
        <div class="menubar-contour"/>
        <div class="menubar-menu-list">
          <div class="menubar-menu-content" onClick={moveMyTree}>
            <div>My Tree</div>
            <img class="menubar-menu-icon" alt="" src='assets/icon_menubar_right_arrow.png'/>
          </div>
          <div class="menubar-menu-content" onClick={moveReservation}>
            <div>예약 하기</div>
            <img class="menubar-menu-icon" alt="" src='assets/icon_menubar_right_arrow.png'/>
          </div>
        </div>

        
      </div>
      
    </div>
    </>
    
  )
}
