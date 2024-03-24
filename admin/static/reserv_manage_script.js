// 모든 "row" 요소를 선택
const rows = document.querySelectorAll('.row');

// 모달 요소를 선택
const modal = document.querySelector('.modal');

// 백그라운드 요소를 선택
const modalBack = document.querySelector('.modal_back');

// 클릭한 로우의 정보를 저장할 객체를 초기화
let clickedRowData = null;

// 각 "row" 요소에 클릭 이벤트를 추가
rows.forEach(row => {
  row.addEventListener('click', function() {
    // 클릭된 "row" 요소 내의 각 데이터를 추출
    const name = row.querySelector('.name').textContent;
    const number = row.querySelector('.number').textContent;
    const gender = row.querySelector('.gender').textContent;
    const std = row.querySelector('.std').textContent;
    const prog = row.querySelector('.prog').textContent;
    const prog_time = row.querySelector('.prog_time').textContent;
    const count = row.querySelector('.count').textContent;
    const total_count = row.querySelector('.total_count').textContent;
    const note = row.querySelector('.note').textContent;
    const datetime = row.querySelector('.date').textContent;
    const status = row.querySelector('.time').textContent;
    const price = row.querySelector('.price').textContent;
    const id = row.querySelector('.id').textContent;
    const client_id = row.querySelector('.client_id').textContent;
    const add_date = row.querySelector('.add_date').textContent;
    const reservation_id = row.querySelector('.reservation_id').textContent;

    const modalHeaderDate = document.querySelector('.modal_header_date'); // modal_header_date 요소 가져오기
    modalHeaderDate.textContent = add_date;

    const priceWithoutComma = price.replace(/,/g, '');

    const dateSlice = datetime.split('/');
    const date = dateSlice[0];
    let time = dateSlice[1];

    time = time.replace(':', ' : ');

    const rowData = {
      name: name,
      phone: number,
      gender: gender,
      std: std,
      prog_name: prog,
      prog_count: count,
      note: note,
      date: date,
      reservation_status: status,
      price: price,
      prog_time : time,
      id : id
    };

    // 인풋 태그를 선택
    const nameInput = modal.querySelector('.inputbox.name');
    const numberInput = modal.querySelector('.inputbox.number');
    const genderInput = modal.querySelector('.inputbox.gender');
    const noteInput = modal.querySelector('.inputbox.note');
    const dateInput = modal.querySelector('.inputbox.date');
    const timeInput = modal.querySelector('.inputbox.time');
    const progInput = modal.querySelector('.inputbox.prog');
    const prog_timeInput = modal.querySelector('.inputbox.prog_time');
    const countInput = modal.querySelector('.inputbox.count');
    const total_countInput = modal.querySelector('.inputbox.total_count');
    const stdInput = modal.querySelector('.inputbox.std');
    const priceInput = modal.querySelector('.inputbox.price');
    const idInput = modal.querySelector('.inputbox.id');
    const client_idInput = modal.querySelector('.inputbox.client_id');
    const reservation_statusInput = modal.querySelector('.inputbox.reservation_status');
    const reservation_idInput = modal.querySelector('.inputbox.reservation_id');
    // 추출한 데이터를 인풋 태그에 설정
    nameInput.value = name;
    numberInput.value = number;
    genderInput.value = gender;
    noteInput.value = note;
    countInput.value = count;
    total_countInput.value = total_count;
    stdInput.value =std;
    progInput.value = prog;
    prog_timeInput.value = prog_time;
    dateInput.value = date;
    priceInput.value = priceWithoutComma;
    timeInput.value = time;
    idInput.value = id;
    client_idInput.value = client_id;
    reservation_statusInput.value = status;
    reservation_idInput.value = reservation_id;
    // 클릭된 로우의 데이터를 저장
    clickedRowData = rowData;

    const confirm_btn = document.querySelector('.confirm_btn');
    const modify_btn = document.querySelector('.btn.modify');
    const pay_btn = document.querySelector('.btn.pay');
    const cancel_btn = document.querySelector('.btn.cancel');
    if (status == '결제완료'){
      confirm_btn.style.display = 'none';
      modify_btn.style.display = 'none';
      pay_btn.style.display = 'none';
      cancel_btn.style.display = 'none';
    }else if(status == '취소완료'){
      confirm_btn.style.display = 'none';
      modify_btn.style.display = 'none';
      pay_btn.style.display = 'none';
      cancel_btn.style.display = 'none';
    }else if(status == '예약대기'){
      confirm_btn.style.display = 'flex';
      modify_btn.style.display = 'none';
      pay_btn.style.display = 'none';
      cancel_btn.style.display = 'flex';
    }else{
      confirm_btn.style.display = 'none';
      modify_btn.style.display = 'none';
      pay_btn.style.display = 'flex';
      cancel_btn.style.display = 'flex';
    }

    // 백그라운드 활성화
    modalBack.style.display = 'block';
  });
});
// 모달 내부의 클릭 이벤트가 상위로 전파되지 않도록 설정함
modal.addEventListener('click', function(event) {
  event.stopPropagation();
});

// 백그라운드 클릭 시 모달을 닫음
modalBack.addEventListener('click', function () {
  modalBack.style.display = 'none';
});

function confirmBtn(){
  const idInput = document.querySelector('input[name="id"]').value;
  const client_idInput = document.querySelector('input[name="client_id"]').value;
  const nameInput = document.querySelector('input[name="name"]').value;
  const phoneInput = document.querySelector('input[name="phone"]').value;
  const genderInput = document.querySelector('input[name="gender"]').value;
  const noteInput = document.querySelector('textarea[name="note"]').value;
  const reservation_dateInput = document.querySelector('input[name="reservation_date"]').value;
  const reservation_timeInput = document.querySelector('input[name="reservation_time"]').value;
  const prog_nameInput = document.querySelector('input[name="prog_name"]').value;
  const prog_timeInput = document.querySelector('input[name="prog_time"]').value;
  const remain_countInput = document.querySelector('input[name="remain_count"]').value;
  const total_countInput = document.querySelector('input[name="total_count"]').value;
  const stdInput = document.querySelector('input[name="std"]').value;
  const priceInput = document.querySelector('input[name="price"]').value;
  const reservation_idInput = document.querySelector('input[name="reservation_id"]').value;

  const result = confirm('예약을 확정하시겠습니까?');

  if(result){
      // Ajax 요청을 보낼 URL 및 데이터
      const url = './reservation_manage/confirm_reserv'; // 서버의 API 엔드포인트
      const data = {
        id: idInput,
        client_id: client_idInput,
        name: nameInput,
        phone: phoneInput,
        gender: genderInput,
        note: noteInput,
        reservation_date: reservation_dateInput,
        reservation_time: reservation_timeInput,
        prog_name: prog_nameInput,
        prog_time: prog_timeInput,
        remain_count: remain_countInput, 
        total_count: total_countInput,
        std: stdInput,
        price: priceInput,
        reservation_id: reservation_idInput
    };

      // Ajax 요청을 보내고 응답을 처리
      fetch(url, {
          method: 'POST', // 또는 'GET' 등
          body: JSON.stringify(data),
          headers: {
              'Content-Type': 'application/json'
          }
      })
      .then(response => response.json())
      .then(data => {
          console.log('서버 응답:', data);
          location.reload();
      })
      .catch(error => {
          console.error('Ajax 오류:', error);
      });
  }else{
      alert('취소하였습니다.')
  } 
}

function cancelBtn(){
  const idInput = document.querySelector('input[name="id"]').value;
  const client_idInput = document.querySelector('input[name="client_id"]').value;
  const nameInput = document.querySelector('input[name="name"]').value;
  const phoneInput = document.querySelector('input[name="phone"]').value;
  const genderInput = document.querySelector('input[name="gender"]').value;
  const noteInput = document.querySelector('textarea[name="note"]').value;
  const reservation_dateInput = document.querySelector('input[name="reservation_date"]').value;
  const reservation_timeInput = document.querySelector('input[name="reservation_time"]').value;
  const prog_nameInput = document.querySelector('input[name="prog_name"]').value;
  const prog_timeInput = document.querySelector('input[name="prog_time"]').value;
  const remain_countInput = document.querySelector('input[name="remain_count"]').value;
  const total_countInput = document.querySelector('input[name="total_count"]').value;
  const stdInput = document.querySelector('input[name="std"]').value;
  const priceInput = document.querySelector('input[name="price"]').value;
  const reservation_statusInput = document.querySelector('input[name="reservation_status"]').value;
  const reservation_idInput = document.querySelector('input[name="reservation_id"]').value;

  const result = confirm('예약을 취소하시겠습니까?');

  if(result){
      // Ajax 요청을 보낼 URL 및 데이터
      const url = './reservation_manage/cancel_reserv'; // 서버의 API 엔드포인트
      const data = {
        id: idInput,
        client_id: client_idInput,
        name: nameInput,
        phone: phoneInput,
        gender: genderInput,
        note: noteInput,
        reservation_date: reservation_dateInput,
        reservation_time: reservation_timeInput,
        prog_name: prog_nameInput,
        prog_time: prog_timeInput,
        remain_count: remain_countInput, 
        total_count: total_countInput,
        std: stdInput,
        price: priceInput,
        reservation_status: reservation_statusInput,
        reservation_id: reservation_idInput
      };

      // Ajax 요청을 보내고 응답을 처리
      fetch(url, {
          method: 'POST', // 또는 'GET' 등
          body: JSON.stringify(data),
          headers: {
              'Content-Type': 'application/json'
          }
      })
      .then(response => response.json())
      .then(data => {
          console.log('서버 응답:', data);
          location.reload();
      })
      .catch(error => {
          console.error('Ajax 오류:', error);
      });
  }else{
      alert('취소하였습니다.')
  } 
}

function modifyBtn(){
  const idInput = document.querySelector('input[name="id"]').value;
  const client_idInput = document.querySelector('input[name="client_id"]').value;
  const nameInput = document.querySelector('input[name="name"]').value;
  const phoneInput = document.querySelector('input[name="phone"]').value;
  const genderInput = document.querySelector('input[name="gender"]').value;
  const noteInput = document.querySelector('textarea[name="note"]').value;
  const reservation_dateInput = document.querySelector('input[name="reservation_date"]').value;
  const reservation_timeInput = document.querySelector('input[name="reservation_time"]').value;
  const prog_nameInput = document.querySelector('input[name="prog_name"]').value;
  const remain_countInput = document.querySelector('input[name="remain_count"]').value;
  const total_countInput = document.querySelector('input[name="total_count"]').value;
  const stdInput = document.querySelector('input[name="std"]').value;

  const result = confirm('수정하시겠습니까?');

  if(result){
      // Ajax 요청을 보낼 URL 및 데이터
      const url = './reservation_manage/modify_reserv'; // 서버의 API 엔드포인트
      const data = {
          id: idInput,
          client_id: client_idInput,
          name: nameInput,
          phone: phoneInput,
          gender: genderInput,
          note: noteInput,
          reservation_date: reservation_dateInput,
          reservation_time: reservation_timeInput,
          prog_name: prog_nameInput,
          remain_count: remain_countInput, 
          std: stdInput
      };

      // Ajax 요청을 보내고 응답을 처리
      fetch(url, {
          method: 'POST', // 또는 'GET' 등
          body: JSON.stringify(data),
          headers: {
              'Content-Type': 'application/json'
          }
      })
      .then(response => response.json())
      .then(data => {
          console.log('서버 응답:', data);
          location.reload();
      })
      .catch(error => {
          console.error('Ajax 오류:', error);
      });
  }else{
      alert('취소하였습니다.')
  } 
}

function paymentBtn(){
  const idInput = document.querySelector('input[name="id"]').value;
  const client_idInput = document.querySelector('input[name="client_id"]').value;
  const nameInput = document.querySelector('input[name="name"]').value;
  const phoneInput = document.querySelector('input[name="phone"]').value;
  const genderInput = document.querySelector('input[name="gender"]').value;
  const noteInput = document.querySelector('textarea[name="note"]').value;
  const reservation_dateInput = document.querySelector('input[name="reservation_date"]').value;
  const reservation_timeInput = document.querySelector('input[name="reservation_time"]').value;
  const prog_nameInput = document.querySelector('input[name="prog_name"]').value;
  const prog_timeInput = document.querySelector('input[name="prog_time"]').value;
  const remain_countInput = document.querySelector('input[name="remain_count"]').value;
  const total_countInput = document.querySelector('input[name="total_count"]').value;
  const stdInput = document.querySelector('input[name="std"]').value;
  const priceInput = document.querySelector('input[name="price"]').value;
  const reservation_statusInput = document.querySelector('input[name="reservation_status"]').value;
  const reservation_idInput = document.querySelector('input[name="reservation_id"]').value;

  // 현재 날짜 객체 생성
  var currentDate = new Date();

  // 날짜를 'yyyy-mm-dd' 형식으로 변환
  var year = currentDate.getFullYear();
  var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  var day = currentDate.getDate().toString().padStart(2, '0');

  const formattedDate = year + '-' + month + '-' + day;

  console.log(formattedDate); // 예를 들어, '2023-10-23'

  const result = confirm('결제하시겠습니까?');

  if(result){
    // Ajax 요청을 보낼 URL 및 데이터
    const url = './reservation_manage/payment_reserv'; // 서버의 API 엔드포인트
    const data = {
      id: idInput,
      client_id: client_idInput,
      name: nameInput,
      phone: phoneInput,
      gender: genderInput,
      note: noteInput,
      reservation_date: reservation_dateInput,
      reservation_time: reservation_timeInput,
      prog_name: prog_nameInput,
      prog_time: prog_timeInput,
      remain_count: remain_countInput, 
      total_count: total_countInput,
      std: stdInput,
      price: priceInput,
      reservation_status: reservation_statusInput,
      sale_date: formattedDate,
      reservation_id: reservation_idInput
    };

    // Ajax 요청을 보내고 응답을 처리
    fetch(url, {
        method: 'POST', // 또는 'GET' 등
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('서버 응답:', data);
        location.reload();
    })
    .catch(error => {
        console.error('Ajax 오류:', error);
    });
  }else{
      alert('취소하였습니다.')
  } 
    
}
document.getElementById('confirm_btn').addEventListener('click', confirmBtn);
document.getElementById('cancel_btn').addEventListener('click', cancelBtn);
document.getElementById('modify_btn').addEventListener('click', modifyBtn);
document.getElementById('pay_btn').addEventListener('click', paymentBtn);


// SVG 아이콘을 클릭할 때 form을 제출하는 함수
document.getElementById('searchIcon').addEventListener('click', function() {
  document.getElementById('searchForm').submit();
});
// SVG 아이콘을 클릭할 때 form을 제출하는 함수
document.getElementById('searchIcon2').addEventListener('click', function() {
  document.getElementById('searchForm2').submit();
});

function searchOnEnter(event){
  if (event.key === 'Enter') {
    const searchData = document.querySelector('.searchInput').value;
    const reserv_status = document.querySelector('.reserv_status').value;
    const url = `/admin/reservation_manage/search?searchData=${encodeURIComponent(searchData)}&reserv_status=${encodeURIComponent(reserv_status)}`;
    window.location.href = url;
    return false; // 폼 제출을 중단
  }
}
function searchOnEnterTablet(event){
  if (event.key === 'Enter') {
    const searchData = document.querySelector('.searchInput').value;
    const reserv_status = document.querySelector('.reserv_status').value;
    const url = `/admin/reservation_manage/search?searchData=${encodeURIComponent(searchData)}&reserv_status=${encodeURIComponent(reserv_status)}`;
    window.location.href = url;
    return false; // 폼 제출을 중단
  }
}


