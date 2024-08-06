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

  // 페이지 로드 시 실행되는 코드
  fetch(API_SERVER_DOMAIN + "/valuechangelog/getAll", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server");
      }
      return response.json();
    })
    .then((data) => {
      renderData(data);
    })
    .catch((error) => {
      console.error("Error:", error);
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
    });

  // changeType을 한글로 변환하는 객체
  const log_ko = {
    Add_Category: "카테고리 추가",
    Add_Value: "가치관 추가",
    Change_Rank: "순위 변동",
    Delete_Value: "가치관 삭제",
  };

  // 데이터를 HTML에 렌더링하는 함수
  function renderData(data) {
    const mainElement = document.querySelector("main");

    // 데이터를 날짜별로 그룹화
    const groupedData = data.reduce((acc, entry) => {
      const date = new Date(entry.createdAt).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(entry);
      return acc;
    }, {});

    // 그룹화된 데이터를 렌더링
    Object.keys(groupedData).forEach((date) => {
      // 날짜 요소 생성
      const dateElement = document.createElement("div");
      dateElement.classList.add("log-date");
      dateElement.innerHTML = `<span>${date}</span>`;
      mainElement.appendChild(dateElement);

      // 로그 항목들을 위한 컨테이너 생성
      const logContainer = document.createElement("div");
      logContainer.classList.add("log-collection");

      groupedData[date].forEach((entry) => {
        // 각 변경사항에 대한 컨테이너 생성
        const changeContainer = document.createElement("div");
        changeContainer.classList.add("ex-container");

        // 변경사항 요소 생성
        const changeElement = document.createElement("div");
        changeElement.classList.add("ex");
        changeElement.innerHTML = `<p>${entry.categoryName}</p>`;

        if (entry.valueTitle) {
          const valueSpan = document.createElement("span");
          valueSpan.textContent = entry.valueTitle;
          changeElement.appendChild(valueSpan);
        }

        changeContainer.appendChild(changeElement);

        // 변경 유형 요소 생성
        const changeTypeElement = document.createElement("div");
        changeTypeElement.classList.add("log-change");
        changeTypeElement.innerHTML = `<span>${
          log_ko[entry.changeType]
        }</span>`;
        changeElement.appendChild(changeTypeElement);

        // 순위 표시 (changeType이 change_rank인 경우)
        if (entry.changeType === "change_rank" && entry.ranking !== undefined) {
          const rankingElement = document.createElement("div");
          rankingElement.classList.add("ranking");
          rankingElement.innerHTML = `<span>순위: ${entry.ranking}</span>`;
          changeContainer.appendChild(rankingElement);
        }

        // 이유 요소 생성
        if (entry.changeReason) {
          const reasonElement = document.createElement("div");
          reasonElement.classList.add("reason");
          reasonElement.innerHTML = `<span>${entry.changeReason}</span>`;
          changeContainer.appendChild(reasonElement);
        }

        logContainer.appendChild(changeContainer);
      });

      mainElement.appendChild(logContainer);
    });
  }
});

// document.addEventListener("DOMContentLoaded", function () {
//   // 백엔드에서 JSON 데이터를 가져오는 함수
//   async function fetchData() {
//     try {
//       const response = await fetch("../mock-data.json"); // 실제 경로로 변경하세요
//       if (!response.ok) {
//         throw new Error(`HTTP 오류! 상태: ${response.status}`);
//       }
//       const data = await response.json();
//       renderData(data);
//     } catch (error) {
//       console.error("데이터 가져오기 오류:", error);
//     }
//   }

//   // changeType을 한글로 변환하는 객체
//   const log_ko = {
//     add_category: "카테고리 추가",
//     add_value: "가치관 추가",
//     change_rank: "순위 변동",
//     delete_value: "가치관 삭제",
//   };

//   // 데이터를 HTML에 렌더링하는 함수
//   function renderData(data) {
//     const mainElement = document.querySelector("main");

//     // 데이터를 날짜별로 그룹화
//     const groupedData = data.reduce((acc, entry) => {
//       const date = new Date(entry.createdAt).toLocaleDateString();
//       if (!acc[date]) {
//         acc[date] = [];
//       }
//       acc[date].push(entry);
//       return acc;
//     }, {});

//     // 그룹화된 데이터를 렌더링
//     Object.keys(groupedData).forEach((date) => {
//       // 날짜 요소 생성
//       const dateElement = document.createElement("div");
//       dateElement.classList.add("log-date");
//       dateElement.innerHTML = `<span>${date}</span>`;
//       mainElement.appendChild(dateElement);

//       // 로그 항목들을 위한 컨테이너 생성
//       const logContainer = document.createElement("div");
//       logContainer.classList.add("log-collection");

//       groupedData[date].forEach((entry) => {
//         // 각 변경사항에 대한 컨테이너 생성
//         const changeContainer = document.createElement("div");
//         changeContainer.classList.add("ex-container");

//         // 변경사항 요소 생성
//         const changeElement = document.createElement("div");
//         changeElement.classList.add("ex");
//         changeElement.innerHTML = `<p>${entry.categoryName}</p><span>${entry.valueTitle}</span>`;
//         changeContainer.appendChild(changeElement);

//         // 변경 유형 요소 생성
//         const changeTypeElement = document.createElement("div");
//         changeTypeElement.classList.add("log-change");
//         changeTypeElement.innerHTML = `<span>${
//           log_ko[entry.changeType]
//         }</span>`;
//         changeElement.appendChild(changeTypeElement);

//         // 순위 표시 (changeType이 change_rank인 경우)
//         if (entry.changeType === "change_rank" && entry.ranking !== undefined) {
//           const rankingElement = document.createElement("div");
//           rankingElement.classList.add("ranking");
//           rankingElement.innerHTML = `<span>순위: ${entry.ranking}</span>`;
//           changeContainer.appendChild(rankingElement);
//         }

//         // 이유 요소 생성
//         if (entry.changeReason) {
//           const reasonElement = document.createElement("div");
//           reasonElement.classList.add("reason");
//           reasonElement.innerHTML = `<span>${entry.changeReason}</span>`;
//           changeContainer.appendChild(reasonElement);
//         }

//         logContainer.appendChild(changeContainer);
//       });

//       mainElement.appendChild(logContainer);
//     });
//   }

//   // 데이터 가져오기 호출
//   fetchData();
// });


const accountButton = document.getElementById('accountButton');
const accountMenu = document.getElementById('accountMenu');

accountButton.addEventListener('click', () => {
    if (accountMenu.style.display === 'block') {
        accountMenu.style.display = 'none';
    } else {
        accountMenu.style.display = 'block';
    }
});

document.addEventListener('click', (event) => {
    if (!accountButton.contains(event.target) && !accountMenu.contains(event.target)) {
        accountMenu.style.display = 'none';
    }
});

// 닉네임 변경
document.getElementById('changeNickname').addEventListener('click', () => {
    window.location.href = '/nickname/nickname-change.html'; // Redirect to nickname change page
});

//비밀번호 변경
document.getElementById('changePassword').addEventListener('click', () => {
    window.location.href = '/password/password-change.html'; // Redirect to password change page
});


//계정 삭제
document.getElementById('deleteAccount').addEventListener('click', () => {
    window.location.href = '/quit/quit-user.html'
});

//로그아웃
document.getElementById('logout').addEventListener('click', () => {
    const accessToken = getCookie("accessToken");
    fetch(`${API_SERVER_DOMAIN}/account/logout`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({}),
    })
    .then(response => response.json())
    .then(data => {
        if (data) {
            alert('로그아웃 되었습니다.');
            window.location.href = '/login/main.html'; 
        } else {
            alert('로그아웃 실패: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('서버와의 통신 오류가 발생했습니다.');
    });
});