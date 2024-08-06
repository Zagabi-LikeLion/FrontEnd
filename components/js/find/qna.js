let API_SERVER_DOMAIN = "http://zagabi.shop";
let q_contianer = document.querySelector('.q');
let answer = document.querySelector('#a');
let btn = document.querySelector('#submit_qna')

q_contianer.innerHTML = localStorage.getItem('question');

function find_password() {
    console.log(answer.value)
    if (answer.value != '') {
        fetch(API_SERVER_DOMAIN + "/account/forgot-password/get-token", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: localStorage.getItem('useremail'),
                securityAnswer: answer.value,
            }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Login failed");
            }
            return response.json();
        })
        .then((data) => {
            var accessToken = data.accessToken;
            setCookie("accessToken", accessToken, 1);
            window.location.href = '/password/password-change.html'
            //여기서 비밀번호 변경 페이지로 보냄
        })
        .catch((error) => {
            window.location.href = '/login/main.html'
            alert(error.message);
        });
    }
}

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



btn.addEventListener("click", find_password);