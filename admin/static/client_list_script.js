// SVG 아이콘을 클릭할 때 form을 제출하는 함수
document.getElementById('searchIcon').addEventListener('click', function() {
  document.getElementById('searchForm').submit();
});
document.getElementById('searchIcon2').addEventListener('click', function() {
  document.getElementById('searchForm2').submit();
});

function searchOnEnter(event) {
    if (event.key === 'Enter') {
        const searchData = document.querySelector('.searchInput').value;
        const url = `/admin/client_list/search?searchData=${encodeURIComponent(searchData)}`;
        window.location.href = url;
        return false; // 폼 제출을 중단
      }
}

function tablet_searchOnEnter(event) {
    if (event.key === 'Enter') {
        const searchData = document.querySelector('.searchInput').value;
        const url = `/admin/client_list/search?searchData=${encodeURIComponent(searchData)}`;
        window.location.href = url;
        return false; // 폼 제출을 중단
      }
}

// 모달 요소를 선택
const modal = document.querySelector('.modal');

// 백그라운드 요소를 선택
const modalBack = document.querySelector('.modal_back');

// 클라이언트 로우를 클릭했을 때 실행
document.addEventListener('DOMContentLoaded', function() {
  var rows = document.querySelectorAll('.row');

  rows.forEach(function(row) {
    row.addEventListener('click', function() {
      // 클릭된 "row" 요소 내의 각 데이터를 추출
      const clientId = this.querySelector('.num_client').textContent;
      const name = this.querySelector('.name_client').textContent;
      const number = this.querySelector('.number_client').textContent;
      const gender = this.querySelector('.gender_client').textContent;
      const dob = this.querySelector('.dob').textContent;
      console.log("Client ID:", clientId);
      console.log("Name:", name);
      console.log("Number:", number);
      console.log("Gender:", gender);
      console.log("Date of Birth:", dob);
      

      // 클라이언트 정보를 모달에 표시
      var nameInput = document.querySelector('.inputbox.name');
      var phoneInput = document.querySelector('.inputbox.number');
      var genderInput = document.querySelector('.inputbox.gender');
      var birthInput = document.querySelector('.inputbox.birth');

      nameInput.value = name;
      phoneInput.value = number;
      birthInput.value = dob;
      genderInput.value = gender;

      const url = 'http://lemontree.cafe24app.com/admin/client_list/reserv_info'; // 서버의 API 엔드포인트

      const reservdata = {
        clientId: clientId
      };
      // fetch를 사용하여 서버에서 클라이언트 정보와 여러 행의 데이터 가져오기
      fetch(url, {
        method: 'POST', // 또는 'GET' 등
        body: JSON.stringify(reservdata),
        headers: {
            'Content-Type': 'application/json'
        }
        })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          // 테이블 내부의 기존 로우 삭제 (옵션)
          var tableBody = document.querySelector('.reserv_box.date tbody');
          while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
          }

          // 여러 행의 데이터를 테이블에 추가
          data.reservations.forEach(function(reservation) {
            var newRow = document.createElement('tr');
            newRow.className = 'reserv_row';
            newRow.innerHTML = `
              <td class="row_text reserv">${reservation.prog_name}</td>
              <td class="row_text reserv">${reservation.remain_count}</td>
              <td class="row_text reserv">${reservation.total_count}</td>
            `;

            tableBody.appendChild(newRow);
          });

          // 모달 열기 (옵션)
          
          modalBack.style.display = 'flex';
        })
        .catch(error => {
          console.error('Ajax 오류:', error);
      });
    });
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
