// // 리프레시 토큰을 사용하여 새로운 액세스 토큰을 가져오는 함수
// function getAccessTokenWithRefreshToken(accessToken, refreshToken) {
//   return fetch(API_SERVER_DOMAIN + "/account/reissue", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       accessToken: accessToken,
//       refreshToken: refreshToken,
//     }),
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Failed to refresh access token");
//       }
//       return response.json();
//     })
//     .then((data) => {
//       return data.accessToken;
//     });
// }

// document.addEventListener("DOMContentLoaded", function () {
//   // 백엔드에서 JSON 데이터를 가져오는 함수
//   async function fetchData() {
//     try {
//       const response = await fetch("../mock-trash.json"); // 실제 경로로 변경하세요 `${API_SERVER_DOMAIN}/account/change-nickname`
//       if (!response.ok) {
//         throw new Error(`HTTP 오류! 상태: ${response.status}`);
//       }
//       let data = await response.json();

//       // 모든 변경사항을 하나의 배열로 합치기
//       let allChanges = [];
//       data.forEach((entry) => {
//         allChanges = allChanges.concat(entry.changes);
//       });

//       // 상위 3개의 변경사항만 선택
//       allChanges = allChanges.slice(0, 3);

//       renderData(allChanges);
//     } catch (error) {
//       console.error("데이터 가져오기 오류:", error);
//     }
//   }

//   // 데이터를 HTML에 렌더링하는 함수
//   function renderData(changes) {
//     const mainElement = document.querySelector(".trash-view");

//     mainElement.innerHTML = ""; // 기존 내용을 모두 제거

//     changes.forEach((change) => {
//       // 각 변경사항에 대한 컨테이너 생성
//       const changeContainer = document.createElement("div");
//       changeContainer.classList.add("ex-container");

//       // 변경사항 요소 생성
//       const changeElement = document.createElement("div");
//       changeElement.classList.add("ex");
//       changeElement.innerHTML = `<p>${change.category}</p><span>${change.deleteValue}</span>`;
//       changeContainer.appendChild(changeElement);

//       mainElement.appendChild(changeContainer);
//     });
//   }

//   // DOMContentLoaded 시 데이터를 가져와서 렌더링
//   fetchData();
// });
document.addEventListener("DOMContentLoaded", function () {
  const accessToken = getCookie("accessToken");

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

      let data = await response.json();
      console.log(data);

      // 날짜를 기준으로 최신 순으로 정렬
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // 상위 3개의 변경사항만 선택
      let topChanges = data.slice(0, 3);

      renderData(topChanges);
    } catch (error) {
      console.error("데이터 가져오기 오류:", error);
    }
  }

  // 데이터를 HTML에 렌더링하는 함수
  function renderData(changes) {
    const mainElement = document.querySelector(".trash-view");

    mainElement.innerHTML = ""; // 기존 내용을 모두 제거

    changes.forEach((change) => {
      // 각 변경사항에 대한 컨테이너 생성
      const changeContainer = document.createElement("div");
      changeContainer.classList.add("ex-container");

      // 변경사항 요소 생성
      const changeElement = document.createElement("div");
      changeElement.classList.add("ex");
      changeElement.innerHTML = `<p>${change.categoryName}</p><span>${change.value_title}</span>`;
      changeContainer.appendChild(changeElement);

      mainElement.appendChild(changeContainer);
    });
  }

  // DOMContentLoaded 시 데이터를 가져와서 렌더링
  fetchData();
});
