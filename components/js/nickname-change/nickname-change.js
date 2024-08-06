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

// document.addEventListener("DOMContentLoaded", function () {
//   let accessToken = getCookie("accessToken");
//   const submitButton = document.querySelector(".input-button");

//   submitButton.addEventListener("click", async function () {
//     const newNickName = document.getElementById("nickname-change").value;

//     if (!newNickName) {
//       alert("닉네임을 입력해주세요.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${API_SERVER_DOMAIN}/account/change-nickname`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//           },
//           body: JSON.stringify({ newNickName: newNickName }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP 오류! 상태: ${response.status}`);
//       }

//       const result = await response.json();
//       alert(`닉네임이 '${result.NickName}'(으)로 변경되었습니다.`);
//       window.location.href = "nickname-complete.html"; // 성공 시 완료 페이지로 이동
//     } catch (error) {
//       console.error("닉네임 변경 중 오류 발생:", error);
//       alert("닉네임 변경에 실패했습니다. 다시 시도해 주세요.");
//       // accessToken이 만료된 경우 refresh 토큰을 사용하여 새로운 accessToken을 가져옴
//       // if (refreshToken) {
//       //   getAccessTokenWithRefreshToken(accessToken, refreshToken)
//       //     .then((newAccessToken) => {
//       //       // 새로운 accessToken으로 사용자 정보 요청
//       //       getUserInfo(newAccessToken)
//       //         .then((name) => {
//       //           var userNameSpans = document.querySelectorAll(".user-name");
//       //           userNameSpans.forEach((span) => {
//       //             span.textContent = name;
//       //             span.classList.remove("d-none");
//       //           });
//       //         })
//       //         .catch((error) => {
//       //           console.error("User info error after refreshing token:", error);
//       //         });
//       //     })
//       //     .catch((error) => {
//       //       console.error("Failed to refresh access token:", error);
//       //     });
//       // }
//     }
//   });
// });

// document.addEventListener("DOMContentLoaded", function () {
//   const submitButton = document.querySelector(".input-button");

//   submitButton.addEventListener("click", async function (event) {
//     event.preventDefault(); // 링크의 기본 동작(페이지 이동) 막기

//     const newNickName = document.getElementById("nickname-change").value;

//     if (!newNickName) {
//       alert("닉네임을 입력해주세요.");
//       return;
//     }

//     try {
//       const response = await fetch("api/users/changeNickName", {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ newNickName: newNickName }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP 오류! 상태: ${response.status}`);
//       }

//       const result = await response.json();

//       // Mock 데이터 사용
//       // const result = { NickName: newNickName };
//       // alert(`닉네임이 '${result.NickName}'(으)로 변경되었습니다.`);

//       // 변경된 닉네임을 로컬 스토리지에 저장
//       localStorage.setItem("newNickName", result.NickName);

//       // 완료 페이지로 이동
//       window.location.href = "nickname-complete.html";
//     } catch (error) {
//       console.error("닉네임 변경 중 오류 발생:", error);
//       alert("닉네임 변경에 실패했습니다. 다시 시도해 주세요.");
//       // if (refreshToken) {
//       //   getAccessTokenWithRefreshToken(accessToken, refreshToken)
//       //     .then((newAccessToken) => {
//       //       // 새로운 accessToken으로 사용자 정보 요청
//       //       getUserInfo(newAccessToken)
//       //         .then((name) => {
//       //           var userNameSpans = document.querySelectorAll(".user-name");
//       //           userNameSpans.forEach((span) => {
//       //             span.textContent = name;
//       //             span.classList.remove("d-none");
//       //           });
//       //         })
//       //         .catch((error) => {
//       //           console.error(
//       //             "User info error after refreshing token:",
//       //             error
//       //           );
//       //         });
//       //     })
//       //     .catch((error) => {
//       //       console.error("Failed to refresh access token:", error);
//       //     });
//       // }
//     }
//   });
// });
document.addEventListener("DOMContentLoaded", function () {
  const submitButton = document.querySelector(".input-button");

  submitButton.addEventListener("click", async function (event) {
    event.preventDefault(); // 기본 동작(페이지 이동) 막기

    const newNickName = document.getElementById("nickname-change").value;

    if (!newNickName) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    let accessToken = getCookie("accessToken");
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      // 서버에 PATCH 요청을 보내어 닉네임 변경
      const response = await fetch(
        `${API_SERVER_DOMAIN}/account/change-nickname`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ newNickName: newNickName }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP 오류! 상태: ${response.status}`);
      }

      // 서버 응답이 성공적이면 입력값을 로컬 스토리지에 저장
      localStorage.setItem("newNickName", newNickName);

      alert(`닉네임이 '${newNickName}'(으)로 변경되었습니다.`);

      // 완료 페이지로 이동
      window.location.href = "nickname-complete.html";
    } catch (error) {
      console.error("닉네임 변경 중 오류 발생:", error);
      alert("닉네임 변경에 실패했습니다. 다시 시도해 주세요.");
    }
  });
});
