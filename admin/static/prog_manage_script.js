const management_date = document.querySelector('.management_date');
const date_container = document.querySelector('.date_container');
const startDateInput = document.getElementById('startDateInput');
const endDateInput = document.getElementById('endDateInput');
const modal = document.querySelector('.modal');
const modalBack = document.querySelector('.modal_back');

management_date.addEventListener('click', function () {
    management_date.style.display = 'none';
    date_container.style.display = 'block';
});

function extractDates() {
    const startDate = startDateInput.value; // 시작일 (yyyy-mm-dd 형식)
    const endDate = endDateInput.value;     // 종료일 (yyyy-mm-dd 형식)

    // 시작일과 종료일이 모두 입력되었는지 확인
    if (!startDate || !endDate) {
        alert('시작일과 종료일을 모두 입력해주세요.');
        return; // 값이 없으면 함수를 종료하고 모달 창을 열어둠
    } else {
        const result = confirm('새 운영날짜를 설정하시겠습니까?');

        if(result){
            // Ajax 요청을 보낼 URL 및 데이터
            const url = './prog_manage/add_date'; // 서버의 API 엔드포인트
            const data = {
                startDate: startDate,
                endDate: endDate
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
                date_container.style.display = 'none';
                management_date.style.display = 'block';
            })
            .catch(error => {
                console.error('Ajax 오류:', error);
            });
        }else{
            alert('취소하였습니다.')
        }

       
    }
}

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
        modalForm.action = './prog_manage/modify_prog_post';

        const row = button.parentElement.parentElement; // 수정 버튼의 부모 요소의 부모 요소 (행)
        const serviceName = row.querySelector('.row_text.prog').textContent;
        const prog_time = row.querySelector('.row_text.time').textContent;
        const count = row.querySelector('.row_text.count').textContent;
        const price = row.querySelector('.row_text.price').textContent;
        const discount = row.querySelector('.row_text.discount').textContent;
        
        // 모달 내의 인풋 상자를 선택
        const modalProgramInput = document.querySelector('.progForm .inputbox.prog');
        const modalTimeInput = document.querySelector('.progForm .inputbox.time');
        const modalCountInput = document.querySelector('.progForm .inputbox.number');
        const modalPriceInput = document.querySelector('.progForm .inputbox.price');
        const modalDiscountInput = document.querySelector('.progForm .inputbox.discount');

        // 모달 내의 인풋 상자에 값을 설정
        modalProgramInput.value = serviceName;
        modalTimeInput.value = prog_time; 
        modalCountInput.value = count;
        modalPriceInput.value = price;
        modalDiscountInput.value = discount;

        modalProgramInput.readOnly = true;
        modalTimeInput.readOnly = true;
        modalCountInput.readOnly = true;

        modalBack.style.display = 'block';
        deleteButton.style.display = 'block';
    });
});

addButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modalForm = document.querySelector('.progForm');
        modalForm.action = './prog_manage/add_prog_post';
        // 모달 내의 입력 상자를 선택하고 값을 초기화
        const modalProgramInput = document.querySelector('.progForm .inputbox.prog');
        const modalTimeInput = document.querySelector('.progForm .inputbox.time');
        const modalCountInput = document.querySelector('.progForm .inputbox.number');
        const modalPriceInput = document.querySelector('.progForm .inputbox.price');
        const modalDiscountInput = document.querySelector('.progForm .inputbox.discount');
        
        modalProgramInput.value = '';
        modalTimeInput.value = '';
        modalCountInput.value = '';
        modalPriceInput.value = '';
        modalDiscountInput.value = '';

        modalProgramInput.readOnly = false;
        modalTimeInput.readOnly = false;
        modalCountInput.readOnly = false;

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

    const timeField = document.querySelector('.inputbox.time');
    const numberField = document.querySelector('.inputbox.number');
    const priceField = document.querySelector('.inputbox.price');
    const discountField = document.querySelector('.inputbox.discount');

    // 정규 표현식을 사용하여 형식 체크
    const timePattern = /^[0-9]{2,}$/;
    const numberPattern = /^\d+회$/;
    const pricePattern = /^[0-9]\d*$/;
    const discountPattern = /^[0-9]\d*$/;

    if (!timePattern.test(timeField.value)) {
        alert('시간: 2자리이상 숫자만 입력하세요');
        return false;
    }
    if (!numberPattern.test(numberField.value)) {
        alert('횟수: 숫자 + 회 형식으로 입력하세요');
        return false;
    }
    if (!pricePattern.test(priceField.value)) {
        alert('정상가: 숫자만 입력하세요');
        return false;
    }
    if (!discountPattern.test(discountField.value)) {
        alert('할인가: 숫자만 입력하세요');
        return false;
    }

    const result = confirm('프로그램을 추가/수정 합니다.')

    if(result){
        // progForm 클래스명을 가진 폼을 JavaScript로 서브밋
        document.querySelector('.progForm').submit();
    }else{
        alert('취소하였습니다.')
    }
  }

  function deleteBtn() {
    const serviceName = document.querySelector('input[name="prog_name"]').value;
    const count = document.querySelector('input[name="prog_count"]').value;

    const result = confirm('삭제하시겠습니까?');

    if(result){
        // Ajax 요청을 보낼 URL 및 데이터
        const url = './prog_manage/delete_prog'; // 서버의 API 엔드포인트
        const data = {
            serviceName: serviceName,
            count: count
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
  