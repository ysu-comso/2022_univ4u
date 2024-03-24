const startDateInput = document.getElementById('startDateInput');
const endDateInput = document.getElementById('endDateInput');
const modal = document.querySelector('.modal');
const modalBack = document.querySelector('.modal_back');

// 페이지 로드 시 시작일을 현재 날짜로 설정
window.onload = function() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    startDateInput.value = `${year}-${month}-${day}`;
}

const modifyButtons = document.querySelectorAll('.row_text.modify');
const deleteButton = document.querySelector('.btn.cancel');
const addButtons = document.querySelectorAll('.prog_add');

modifyButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modalForm = document.querySelector('.progForm');
        modalForm.action = './timeCust/modify_timeCust_post';

        const row = button.parentElement.parentElement; // 수정 버튼의 부모 요소의 부모 요소 (행)
        const serviceName = row.querySelector('.row_text.prog').textContent;
        const prog_time = row.querySelector('.row_text.time').textContent;
        const count = row.querySelector('.row_text.count').textContent;
        
        const timeParts = prog_time.split(':');
        const hour = parseInt(timeParts[0].trim(), 10); // 시간
        const minute = parseInt(timeParts[1].trim(), 10); // 분

        // 모달 내의 인풋 상자를 선택
        const modalIdInput = document.querySelector('.progForm .inputbox.id');
        const modalProgramInput = document.querySelector('.progForm .inputbox.prog');
        const modalTimeInput = document.querySelector('.progForm .inputbox.time');
        const modalCountInput = document.querySelector('.progForm .inputbox.number');

        // 모달 내의 인풋 상자에 값을 설정
        modalIdInput.value = serviceName;
        modalProgramInput.value = hour;
        modalTimeInput.value = minute; 
        modalCountInput.value = count;

        modalBack.style.display = 'block';
        deleteButton.style.display = 'block';
    });
});

addButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modalForm = document.querySelector('.progForm');
        modalForm.action = './timeCust/add_timeCust_post';
        // 모달 내의 입력 상자를 선택하고 값을 초기화
        const modalProgramInput = document.querySelector('.progForm .inputbox.prog');
        const modalTimeInput = document.querySelector('.progForm .inputbox.time');
        const modalCountInput = document.querySelector('.progForm .inputbox.number');
        
        modalProgramInput.value = '';
        modalTimeInput.value = '';
        modalCountInput.value = '';

        modalBack.style.display = 'block';
        deleteButton.style.display = 'none';
    });
});

modal.addEventListener('click', function(event) {
    event.stopPropagation();
  });
  
modalBack.addEventListener('click', function () {
    modalBack.style.display = 'none';
  });

function submitForm() {

    const result = confirm('프로그램을 추가/수정 합니다.')

    if(result){
        // progForm 클래스명을 가진 폼을 JavaScript로 서브밋
        document.querySelector('.progForm').submit();
    }else{
        alert('취소하였습니다.')
    }
  }

  function deleteBtn() {
    const id = document.querySelector('input[name="id"]').value;
    const serviceName = document.querySelector('input[name="prog_name"]').value;
    const time = document.querySelector('input[name="prog_time"]').value;
    const number = document.querySelector('input[name="prog_count"]').value;

    const fommatedtime = serviceName + " : " + time;

    const result = confirm('삭제하시겠습니까?');

    if(result){
        // Ajax 요청을 보낼 URL 및 데이터
        const url = './timeCust/delete_timeCust'; // 서버의 API 엔드포인트
        const data = {
            fommatedtime: fommatedtime,
            number: number,
            id: id
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
  