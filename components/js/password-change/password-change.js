let API_SERVER_DOMAIN = "http://zagabi.shop";

// 쿠키에서 특정 이름의 값을 가져오는 함수
function getCookie(name) {
  var nameEQ = name + "=";
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  return null;
}

// 비밀번호 업데이트 함수
async function updatePassword() {
  let accessToken = getCookie("accessToken");
  console.log("사용 중인 토큰:", accessToken);

  const newPassword = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  // 비밀번호와 재입력 비밀번호가 일치하는지 확인
  if (newPassword !== confirmPassword) {
    alert("비밀번호가 일치하지 않습니다. 다시 확인해 주세요.");
    return;
  }

  try {
    // 비밀번호 변경 요청
    const response = await fetch(
      `${API_SERVER_DOMAIN}/account/update-password`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ newPassword: newPassword }),
      }
    );

    // 서버 응답 상태 확인
    if (!response.ok) {
      throw new Error(`HTTP 오류! 상태: ${response.status}`);
    }

    const result = await response.json();

    // 서버 응답 메시지를 처리
    alert(result.message);
    // 성공적으로 변경되었으면, 완료 페이지로 이동
    window.location.href = "password-complete.html";
  } catch (error) {
    console.error("비밀번호 변경 중 오류 발생:", error);
    alert("비밀번호 변경에 실패했습니다. 다시 시도해 주세요.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const submitButton = document.querySelector(".input-button");
  submitButton.addEventListener("click", updatePassword);
});
