let msg = "비밀번호를 재확인해주세요";
let msgContainer = document.querySelector(".error_msg");
let pwd1 = document.querySelector('#password');
let pwd2 = document.querySelector('#password2');
let email = document.querySelector("#email");
let nickname = document.querySelector('.nickname_contianer input');
let answer = document.querySelector('.answer input');
const signupBtn = document.querySelector('.Signin_btn');
const selectElement = document.querySelector('#qna');

let API_SERVER_DOMAIN = "http://zagabi.shop";

// 비밀번호 확인 함수
function check_pwd() {
    if (pwd1.value !== '' && pwd2.value !== '') {
        if (pwd1.value === pwd2.value) {
            msgContainer.innerHTML = '';
        } else {
            msgContainer.innerHTML = msg;
        }
    }
    checkFormValidity(); // 폼 유효성 검사 호출
}

// 폼의 유효성을 검사하고 회원가입 버튼의 활성화 상태를 제어하는 함수
function checkFormValidity() {
    const allFieldsFilled = email.value !== '' && pwd1.value !== '' && pwd2.value !== '' && nickname.value !== '' && answer.value !== '' && selectElement.value !== '';
    signupBtn.disabled = !(allFieldsFilled && pwd1.value === pwd2.value);
}


// 회원가입 폼 제출 함수
function submitSignupForm(event) {
    event.preventDefault(); // 기본 제출 동작을 막습니다.

    fetch(API_SERVER_DOMAIN + '/account/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nickName: nickname.value,
            email: email.value,
            password: pwd1.value,
            securityQuestionId: parseInt(selectElement.value), // selectElement의 값을 사용
            securityAnswer: answer.value
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.createdAt) {
                alert("회원가입 성공!");
                window.location.href = "/signup/complete.html";
            } else {
                alert("회원가입 실패: " + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("서버와의 통신 오류가 발생했습니다.");
        });
}

// 이벤트 리스너 등록
pwd2.addEventListener("input", check_pwd);
pwd1.addEventListener("input", check_pwd);
email.addEventListener("input", checkFormValidity);
nickname.addEventListener("input", checkFormValidity);
answer.addEventListener("input", checkFormValidity);
selectElement.addEventListener("change", checkFormValidity);

// 페이지 로드 시 초기 상태 설정
document.addEventListener("DOMContentLoaded", function () {
    checkFormValidity();
});

// 회원가입 버튼에 이벤트 리스너 추가
signupBtn.addEventListener('click', submitSignupForm);
