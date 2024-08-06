let msg = "이메일을 재확인해주세요";
let msgContainer = document.querySelector(".error_msg");
let email = document.querySelector('#email');
let email_btn = document.querySelector('#submit_email')
let API_SERVER_DOMAIN = "http://zagabi.shop";


window.location.href = '#'; //비밀번호 변경 페이지
function email_check() {
    if (email.value != '') {
        fetch(API_SERVER_DOMAIN + "/account/forgot-password", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email.value,
            }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Login failed");
            }
            return response.json();
        })
        .then((data) => {
            localStorage.setItem('useremail',data.email);
            localStorage.setItem('question',data.securityQuestion);
            window.location.href = '/find/qna.html'
        })
        .catch((error) => {
            msgContainer.innerHTML = msg;
            alert("질문을 불러오는데 실패했습니다: " + error.message);
        });
    }
}

email_btn.addEventListener("click", email_check);