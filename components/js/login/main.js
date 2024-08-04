var API_SERVER_DOMAIN = "http://15.164.253.0:8081";
//URL의 중복을 줄이기 위한 변수 입니다.

let msg = "E-Mail/비밀 번호를 재확인 해주세요";
let msgContainer = document.querySelector(".error-msg");
let loginBtn = document.querySelector("#login");
let emailInput = document.querySelector(".email");
let passwordInput = document.querySelector(".password");

// 에러 메시지 띄우기
function displayErrorMessage(box, errorMessage) {
    box.innerText = errorMessage; // 에러 메시지 설정
}

// 에러 메시지 지우기(원래 상태로 복구)
function resetErrorMessage(box) {
    box.innerText = ''; // 메시지 컨테이너 내용 초기화
}



function submitLoginForm(event) {
    event.preventDefault(); // 기본 제출 동작을 막습니다.

    // 사용자가 입력한 이메일과 비밀번호를 가져옵니다.
    var email = document.querySelector(".email").value;
    var password = document.querySelector(".password").value;   
    // 서버에 로그인 요청을 보냅니다.
    fetch(API_SERVER_DOMAIN + "/account/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            //보내줄 내용이 json의 형식이라는 뜻 입니다..
        },
        //JSON.stringify json의 형식으로 만들어줍니다.
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Login failed");
            }
            return response.json();
            //response는 json의 형태가 아니기 때문에 json의 형식으로 바꿔주는 과정입니다.
        })
        .then((data) => {
            var accessToken = data.accessToken;
            var refreshToken = data.refreshToken;
            // 토큰을 쿠키에 저장합니다.
            setCookie("accessToken", accessToken, 1);
            setCookie("refreshToken", refreshToken, 1);
            // 로그인이 성공하면 다음 동작을 수행합니다.
            window.location.replace("/Dashboard/Dashboard.html");
            //로그인이 성공하면 index.html 페이지로 넘어갑니다.
        })
        .catch((error) => {
            displayErrorMessage(msgContainer, msg);
            // 로그인 실패 시 사용자에게 메시지를 표시하는 등의 동작을 수행할 수 있습니다.
        });
}

emailInput.addEventListener('focus', function () {
    resetErrorMessage(msgContainer);
});
passwordInput.addEventListener('focus', function () {
    resetErrorMessage(msgContainer);
});

function setCookie(name, value, days) {
    var expires = "";
    //하루 단위로 변환하는 과정
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    //쿠키를 저장하는 형식
    document.cookie = name + "=" + value + expires + "; path=/";
}

