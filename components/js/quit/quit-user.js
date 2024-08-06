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

// 리프레시 토큰을 사용하여 새로운 액세스 토큰을 가져오는 함수
function getAccessTokenWithRefreshToken(accessToken, refreshToken) {
  return fetch(API_SERVER_DOMAIN + "/account/reissue", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accessToken: accessToken,
      refreshToken: refreshToken,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to refresh access token");
      }
      return response.json();
    })
    .then((data) => {
      return data.accessToken;
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const accessToken = getCookie("accessToken");

  const quitButton = document.querySelector(".quit-button:last-of-type"); // 마지막 quit-button을 선택 (회원 탈퇴 버튼)

  quitButton.addEventListener("click", async function (event) {
    event.preventDefault(); // 기본 동작(페이지 이동) 막기

    const confirmQuit = confirm("정말 회원을 탈퇴하시겠습니까?");
    if (!confirmQuit) {
      return; // 사용자가 탈퇴를 취소한 경우 함수 종료
    }

    try {
      const response = await fetch(
        `${API_SERVER_DOMAIN}/account/delete-account`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP 오류! 상태: ${response.status}`);
      }

      const result = await response.json();

      // 응답 메시지를 기반으로 알림 표시
      alert(result.message);

      // 성공적으로 탈퇴되었으면, 완료 페이지로 이동
      window.location.href = "quit-complete.html";
    } catch (error) {
      console.error("회원 탈퇴 중 오류 발생:", error);
      alert("회원 탈퇴에 실패했습니다. 다시 시도해 주세요.");
      // if (refreshToken) {
      //   getAccessTokenWithRefreshToken(accessToken, refreshToken)
      //     .then((newAccessToken) => {
      //       // 새로운 accessToken으로 사용자 정보 요청
      //       getUserInfo(newAccessToken)
      //         .then((name) => {
      //           var userNameSpans = document.querySelectorAll(".user-name");
      //           userNameSpans.forEach((span) => {
      //             span.textContent = name;
      //             span.classList.remove("d-none");
      //           });
      //         })
      //         .catch((error) => {
      //           console.error(
      //             "User info error after refreshing token:",
      //             error
      //           );
      //         });
      //     })
      //     .catch((error) => {
      //       console.error("Failed to refresh access token:", error);
      //     });
      // }
    }
  });
});
