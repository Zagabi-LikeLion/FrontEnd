// let API_SERVER_DOMAIN = "http://15.164.253.0:8081";

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

// // 리프레시 토큰을 사용하여 새로운 액세스 토큰을 가져오는 함수
// function getAccessTokenWithRefreshToken(refreshToken) {
//   return fetch(API_SERVER_DOMAIN + "/account/reissue", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       RefreshToken: refreshToken, // 헤더에 리프레시 토큰 포함
//     },
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Failed to refresh access token");
//       }
//       return response.json();
//     })
//     .then((data) => {
//       // 새로운 액세스 토큰 반환
//       return data.additionalProp1;
//     });
// }

// document.addEventListener("DOMContentLoaded", function () {
//   const addValueButton = document.getElementById("add-value");
//   const modal = document.getElementById("values-modal");
//   const categoryInput = document.getElementById("category-input");
//   const closeButton = document.querySelector(".close-button");
//   const addList = document.getElementById("plus");
//   const detailList = document.querySelector(".detail-list");
//   const closeReasonButton = document.querySelector(".close-reason-button");
//   const valuesContainer = document.querySelector(".values");

//   const accessToken = getCookie("accessToken");

//   function loadCategories() {
//     if (!accessToken) {
//       console.error("Access token is missing.");
//       return;
//     }

//     fetch(`${API_SERVER_DOMAIN}/value/category`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${accessToken}`,
//       },
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to load categories");
//         }
//         return response.json();
//       })
//       .then((categories) => {
//         // 기존 카테고리 목록 초기화
//         valuesContainer.innerHTML = "";

//         // 각 카테고리를 위한 div 요소 생성 및 추가
//         categories.forEach((category) => {
//           const categoryDiv = document.createElement("div");
//           categoryDiv.classList.add("newValues");

//           const categoryName = document.createElement("p");
//           categoryName.classList.add("valueTitle");
//           categoryName.textContent = category.categoryName;

//           categoryDiv.appendChild(categoryName);

//           // appendChild를 사용하여 각 카테고리를 추가
//           valuesContainer.appendChild(categoryDiv);
//         });

//         // addValueButton을 항상 마지막에 추가
//         valuesContainer.appendChild(addValueButton);
//         // 최대 3개의 div만 보이도록 설정
//         updateVisibleValues();
//       })
//       .catch((error) => {
//         console.error(
//           "Error occurred while loading categories:",
//           error.message
//         );
//       });
//   }

//   // 페이지가 로드될 때 카테고리 목록 불러오기
//   loadCategories();

//   // 모달 열기
//   addValueButton.addEventListener("click", function () {
//     modal.style.display = "block";
//     detailList.innerHTML = ""; // 모달 열 때 기존 입력 초기화
//     categoryInput.value = ""; // 카테고리 입력 필드 초기화
//     currentCategoryDiv = null; // 현재 작업 중인 카테고리 초기화
//   });

//   // 모달 닫기 및 내용 초기화
//   function closeModal() {
//     modal.style.display = "none";
//     detailList.innerHTML = ""; // 디테일 리스트 초기화
//     categoryInput.value = ""; // 카테고리 입력 필드 초기화
//     loadCategories();
//   }

//   closeButton.addEventListener("click", closeModal);

//   // 모달 외부 클릭 시 닫기 및 내용 초기화
//   window.addEventListener("click", function (event) {
//     if (event.target === modal) {
//       closeModal();
//     }
//   });

//   // 상세 모달 닫기 및 내용 초기화
//   function closeReasonModal() {
//     reasonModal.style.display = "none";
//     reasonText.value = ""; // 이유 입력 필드 초기화
//   }

//   closeReasonButton.addEventListener("click", closeReasonModal);

//   // 디테일 항목 추가
//   addList.addEventListener("click", function (event) {
//     event.preventDefault(); // 기본 동작 방지

//     if (!accessToken) {
//       console.error("Access token is missing.");
//       return; // 액세스 토큰이 없을 경우 요청을 보내지 않음
//     }

//     // 현재 입력된 카테고리와 리스트를 저장
//     const categoryValue = categoryInput.value.trim();

//     if (categoryValue !== "") {
//       // 첫 번째 POST 요청: 카테고리 추가
//       fetch(`${API_SERVER_DOMAIN}/value/category`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`, // 기존 액세스 토큰 사용
//         },
//         body: JSON.stringify({
//           categoryName: categoryValue,
//         }),
//       })
//         .then((response) => {
//           console.log("Response object:", response); // 응답 객체 확인
//           if (!response) {
//             throw new Error("No response from server");
//           }
//           if (!response.ok) {
//             return response.json().then((err) => {
//               throw new Error(
//                 `Failed to add category: ${response.status} - ${err.message}`
//               );
//             });
//           }
//           return response.json();
//         })
//         .then((data) => {
//           const categoryId = data.categoryId; // 응답에서 categoryId 추출

//           fetch(`${API_SERVER_DOMAIN}/valuechangelog`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${accessToken}`, // 새로운 액세스 토큰 사용
//             },
//             body: JSON.stringify({
//               changeType: "Add_Category",
//               // changeReason: null,
//               category_id: categoryId,
//               // value_id: null,
//             }),
//           });
//         })
//         .then((response) => {
//           if (!response.ok) {
//             // 상태 코드와 응답 텍스트를 함께 로깅
//             return response.json().then((err) => {
//               throw new Error(
//                 `Failed to log change: ${response.status} - ${err.message}`
//               );
//             });
//           }
//           return response.json();
//         })
//         .then((data) => {
//           console.log("Change successfully logged:", data);
//         })
//         .catch((error) => {
//           // 에러 메시지와 함께 상태 코드를 로깅
//           console.error("Error occurred:", error.message);
//         });
//     }
//   });

//   function updateVisibleValues() {
//     const containers = document.querySelectorAll(".values .newValues");
//     containers.forEach((newValues, index) => {
//       if (containers.length > 3 && index < containers.length - 3) {
//         newValues.classList.add("hidden");
//       } else {
//         newValues.classList.remove("hidden");
//       }
//     });
//   }
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

// 리프레시 토큰을 사용하여 새로운 액세스 토큰을 가져오는 함수
function getAccessTokenWithRefreshToken(refreshToken) {
  return fetch(API_SERVER_DOMAIN + "/account/reissue", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      RefreshToken: refreshToken, // 헤더에 리프레시 토큰 포함
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to refresh access token");
      }
      return response.json();
    })
    .then((data) => {
      // 새로운 액세스 토큰 반환
      return data.additionalProp1;
    });
}

// main.js 파일에서
document.addEventListener("DOMContentLoaded", function () {
  const addValueButton = document.getElementById("add-value");
  const modal = document.getElementById("values-modal");
  const categoryInput = document.getElementById("category-input");
  const closeButton = document.querySelector(".close-button");
  const addList = document.getElementById("plus");
  const detailList = document.querySelector(".detail-list");
  const closeReasonButton = document.querySelector(".close-reason-button");
  const valuesContainer = document.querySelector(".values");
  const accountLink = document.querySelector("nav ul li:nth-child(3) a");
  const accountModal = document.getElementById("modal-account");

  const accessToken = getCookie("accessToken");


  // 모달 외부 클릭 시 모달 닫기
  window.addEventListener("click", function (event) {
    if (event.target == accountModal) {
      accountModal.style.display = "none";
    }
  });

  // 카테고리 목록 불러오기
  function loadCategories() {
    if (!accessToken) {
      console.error("Access token is missing.");
      return;
    }

    fetch(`${API_SERVER_DOMAIN}/value/category`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response) {
          throw new Error("No response from server");
        }
        if (!response.ok) {
          throw new Error("Failed to load categories");
        }
        return response.json();
      })
      .then((categories) => {
        // 기존 카테고리 목록 초기화
        valuesContainer.innerHTML = "";

        // 각 카테고리를 위한 div 요소 생성 및 추가
        categories.forEach((category) => {
          const categoryDiv = document.createElement("div");
          categoryDiv.classList.add("newValues");

          const categoryName = document.createElement("p");
          categoryName.classList.add("valueTitle");
          categoryName.textContent = category.categoryName;

          categoryDiv.appendChild(categoryName);

          // appendChild를 사용하여 각 카테고리를 추가
          valuesContainer.appendChild(categoryDiv);
        });

        // addValueButton을 항상 마지막에 추가
        valuesContainer.appendChild(addValueButton);
        // 최대 3개의 div만 보이도록 설정
        updateVisibleValues();
      })
      .catch((error) => {
        console.error(
          "Error occurred while loading categories:",
          error.message
        );
      });
  }

  // 페이지가 로드될 때 카테고리 목록 불러오기
  loadCategories();

  // 모달 열기
  addValueButton.addEventListener("click", function () {
    modal.style.display = "block";
    detailList.innerHTML = ""; // 모달 열 때 기존 입력 초기화
    categoryInput.value = ""; // 카테고리 입력 필드 초기화
  });

  // 모달 닫기 및 내용 초기화
  function closeModal() {
    modal.style.display = "none";
    detailList.innerHTML = ""; // 디테일 리스트 초기화
    categoryInput.value = ""; // 카테고리 입력 필드 초기화
    loadCategories();
  }

  closeButton.addEventListener("click", function () {
    closeModal();
    if (typeof fetchData === "function") {
      fetchData();
    } else {
      console.error("fetchData is not defined.");
    }
  });

  // 모달 외부 클릭 시 닫기 및 내용 초기화
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  // 디테일 항목 추가
  addList.addEventListener("click", function (event) {
    event.preventDefault(); // 기본 동작 방지

    if (!accessToken) {
      console.error("Access token is missing.");
      return; // 액세스 토큰이 없을 경우 요청을 보내지 않음
    }

    // 현재 입력된 카테고리와 리스트를 저장
    const categoryValue = categoryInput.value.trim();

    if (categoryValue !== "") {
      // 첫 번째 POST 요청: 카테고리 추가
      fetch(`${API_SERVER_DOMAIN}/value/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // 기존 액세스 토큰 사용
        },
        body: JSON.stringify({
          categoryName: categoryValue,
        }),
      })
        .then((response) => {
          console.log("Response object:", response); // 응답 객체 확인
          if (!response) {
            throw new Error("No response from server");
          }
          if (!response.ok) {
            return response.json().then((err) => {
              throw new Error(
                `Failed to add category: ${response.status} - ${err.message}`
              );
            });
          }
          return response.json();
        })
        .then((data) => {
          const categoryId = data.categoryId; // 응답에서 categoryId 추출

          fetch(`${API_SERVER_DOMAIN}/valuechangelog`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`, // 새로운 액세스 토큰 사용
            },
            body: JSON.stringify({
              changeType: "Add_Category",
              category_id: categoryId,
            }),
          });
        })
        // .then((response) => {
        //   if (!response) {
        //     throw new Error("No response from server");
        //   }
        //   if (!response.ok) {
        //     // 상태 코드와 응답 텍스트를 함께 로깅
        //     return response.json().then((err) => {
        //       throw new Error(
        //         `Failed to log change: ${response.status} - ${err.message}`
        //       );
        //     });
        //   }
        //   return response.json();
        // })
        // .then((data) => {
        //   console.log("Change successfully logged:", data);
        // })
        .catch((error) => {
          // 에러 메시지와 함께 상태 코드를 로깅
          console.error("Error occurred:", error.message);
        });
    }
  });

  // 카테고리 목록에서 최대 3개의 div만 보이도록 업데이트
  function updateVisibleValues() {
    const containers = document.querySelectorAll(".values .newValues");
    containers.forEach((newValues, index) => {
      if (containers.length > 3 && index < containers.length - 3) {
        newValues.classList.add("hidden");
      } else {
        newValues.classList.remove("hidden");
      }
    });
  }
});
