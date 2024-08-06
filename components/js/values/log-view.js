

document.addEventListener("DOMContentLoaded", function () {
  const accessToken = getCookie("accessToken");

  // 백엔드에서 JSON 데이터를 가져오는 함수
  async function fetchData() {
    try {
      const response = await fetch(
        API_SERVER_DOMAIN + "/valuechangelog/getAll",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP 오류! 상태: ${response.status}`);
      }
      let data = await response.json();

      // 데이터 구조 확인을 위한 로그
      console.log("Fetched data:", data);

      // 모든 변경사항을 하나의 배열로 합치기
      let allChanges = data;

      // 하위 3개의 변경사항만 선택
      allChanges = allChanges.slice(-3);

      console.log("All changes:", allChanges);
      renderData(allChanges);
    } catch (error) {
      console.error("데이터 가져오기 오류:", error);
      // 401 오류 처리: 토큰 갱신 로직을 여기에 추가할 수 있음
      if (error.message.includes("401")) {
        console.error(
          "인증 실패: 액세스 토큰이 만료되었거나 유효하지 않습니다."
        );
        // 토큰 갱신 로직 추가 (예: refreshAccessToken 함수 호출)
      }
    }
  }

  // changeType을 한글로 변환하는 객체
  const log_ko = {
    Add_Category: "카테고리 추가",
    Add_Value: "가치관 추가",
    Change_Rank: "순위 변동",
    Delete_Value: "가치관 삭제",
  };

  // 데이터를 HTML에 렌더링하는 함수
  function renderData(data) {
    const mainElement = document.querySelector(".log-view");

    // 기존 내용을 모두 제거
    mainElement.innerHTML = "";

    data.forEach((entry) => {
      console.log("Rendering entry:", entry); // 디버깅용 로그

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
        log_ko[entry.changeType] || entry.changeType
      }</span>`;
      changeElement.appendChild(changeTypeElement);

      // 순위 표시 (changeType이 change_rank인 경우)
      if (entry.changeType === "Change_Rank" && entry.ranking !== undefined) {
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

      mainElement.appendChild(changeContainer);
    });
  }

  // DOMContentLoaded 시 데이터를 가져와서 렌더링
  fetchData();
});

// let API_SERVER_DOMAIN = "";

// // 쿠키에서 특정 이름의 값을 가져오는 함수
// function getCookie(name) {
//   var nameEQ = name + "=";
//   var cookies = document.cookie.split(";");
//   for (var i = 0; i < cookies.length; i++) {
//     var cookie = cookies[i];
//     while (cookie.charAt(0) === " ") {
//       cookie = cookie.substring(1, cookie.length);
//     }
//     if (cookie.indexOf(nameEQ) === 0) {
//       return cookie.substring(nameEQ.length, cookie.length);
//     }
//   }
//   return null;
// }


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