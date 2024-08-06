// document.addEventListener("DOMContentLoaded", function () {
//   // 백엔드에서 JSON 데이터를 가져오는 함수
//   async function fetchData() {
//     try {
//       const response = await fetch("../mock-trash.json"); // 실제 엔드포인트로 변경하세요
//       if (!response.ok) {
//         throw new Error(`HTTP 오류! 상태: ${response.status}`);
//       }
//       let data = await response.json();

//       renderData(data);
//     } catch (error) {
//       console.error("데이터 가져오기 오류:", error);
//     }
//   }

//   // 데이터를 HTML에 렌더링하는 함수
//   function renderData(data) {
//     const mainElement = document.querySelector(".trash-collection");

//     mainElement.innerHTML = ""; // 기존 내용을 모두 제거

//     data.forEach((entry) => {
//       entry.changes.forEach((change) => {
//         // 각 변경사항에 대한 컨테이너 생성
//         const changeContainer = document.createElement("div");
//         changeContainer.classList.add("ex-container");

//         // 변경사항 요소 생성
//         const changeElement = document.createElement("div");
//         changeElement.classList.add("ex");
//         changeElement.innerHTML = `<p>${change.category}</p><span>${change.deleteValue}</span>`;
//         changeContainer.appendChild(changeElement);

//         mainElement.appendChild(changeContainer);
//       });
//     });
//   }

//   // DOMContentLoaded 시 데이터를 가져와서 렌더링
//   fetchData();
// });

// document.addEventListener("DOMContentLoaded", function () {
//   // 백엔드에서 JSON 데이터를 가져오는 함수
//   async function fetchData() {
//     try {
//       const response = await fetch("../mock-trash.json"); // 실제 경로로 변경하세요
//       if (!response.ok) {
//         throw new Error(`HTTP 오류! 상태: ${response.status}`);
//       }
//       const data = await response.json();
//       renderData(data);
//     } catch (error) {
//       console.error("데이터 가져오기 오류:", error);
//     }
//   }

//   // 데이터를 HTML에 렌더링하는 함수
//   function renderData(data) {
//     const mainElement = document.querySelector("main");

//     data.forEach((entry) => {
//       // 날짜 요소 생성
//       const dateElement = document.createElement("div");
//       dateElement.classList.add("trash-date");
//       dateElement.innerHTML = `<span>${entry.date}</span>`;
//       mainElement.appendChild(dateElement);

//       // 로그 항목들을 위한 컨테이너 생성
//       const logContainer = document.createElement("div");
//       logContainer.classList.add("trash-collection");

//       entry.changes.forEach((change) => {
//         // 각 변경사항에 대한 컨테이너 생성
//         const changeContainer = document.createElement("div");
//         changeContainer.classList.add("ex-container");

//         // 변경사항 요소 생성
//         const changeElement = document.createElement("div");
//         changeElement.classList.add("ex");
//         changeElement.innerHTML = `<p>${change.category}</p><span>${change.deleteValue}</span>`;
//         changeContainer.appendChild(changeElement);

//         logContainer.appendChild(changeContainer);
//       });

//       mainElement.appendChild(logContainer);
//     });
//   }

//   // DOMContentLoaded 시 데이터를 가져와서 렌더링
//   fetchData();
// });

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

document.addEventListener("DOMContentLoaded", function () {
  const accessToken = getCookie("accessToken"); // accessToken을 가져오는 함수

  // 백엔드에서 JSON 데이터를 가져오는 함수
  async function fetchData() {
    try {
      const response = await fetch(
        API_SERVER_DOMAIN + "/valuetrashcan/getAll",
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

      const data = await response.json();
      renderData(data);
    } catch (error) {
      console.error("데이터 가져오기 오류:", error);
    }
  }

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
      dateElement.classList.add("trash-date");
      dateElement.innerHTML = `<span>${date}</span>`;
      mainElement.appendChild(dateElement);

      // 로그 항목들을 위한 컨테이너 생성
      const logContainer = document.createElement("div");
      logContainer.classList.add("trash-collection");

      groupedData[date].forEach((entry) => {
        // 각 변경사항에 대한 컨테이너 생성
        const changeContainer = document.createElement("div");
        changeContainer.classList.add("ex-container");

        // 변경사항 요소 생성
        const changeElement = document.createElement("div");
        changeElement.classList.add("ex");
        changeElement.innerHTML = `<p>${entry.categoryName}</p><span>${entry.value_title}</span>`;
        changeContainer.appendChild(changeElement);

        logContainer.appendChild(changeContainer);
      });

      mainElement.appendChild(logContainer);
    });
  }

  // DOMContentLoaded 시 데이터를 가져와서 렌더링
  fetchData();
});



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