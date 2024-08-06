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

document.addEventListener("DOMContentLoaded", function () {
  const collectionContainer = document.querySelector(".values-collection");
  const reasonModal = document.getElementById("reason-modal");
  const modal = document.getElementById("collection-modal");
  const closeButton = modal.querySelector(".close-button");
  const closeReasonButton = document.getElementById("close-reason-button");
  const addList = document.getElementById("plus");
  const detailList = document.querySelector(".detail-list");
  const deleteValueButton = modal.querySelector(".delete-value");

  const accessToken = getCookie("accessToken");

  const DImages = [
    "../assets/img/mark1.png",
    "../assets/img/mark2.png",
    "../assets/img/mark3.png",
    "../assets/img/mark4.png",
    "../assets/img/mark5.png",
    "../assets/img/mark6.png",
    "../assets/img/mark7.png",
    "../assets/img/mark8.png",
    "../assets/img/mark9.png",
    "../assets/img/mark10.png",
  ];

  let categoryData = {}; // 카테고리별 리스트 항목을 저장할 객체
  let currentCategory = null; // 현재 선택된 카테고리 이름 저장
  let currentCategoryId = null; // 현재 선택된 카테고리 ID 저장
  let currentExDiv = null; // 현재 선택된 ex div 요소를 저장

  // 모든 카테고리 조회 함수
  async function fetchAllCategories() {
    try {
      const response = await fetch(`${API_SERVER_DOMAIN}/value/category`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const categories = await response.json();
      return categories;
    } catch (error) {
      console.error("Error fetching all categories:", error);
      return [];
    }
  }

  // 특정 카테고리의 가치관 전체 조회 함수
  async function fetchValuesByCategoryId(categoryId) {
    try {
      const response = await fetch(
        `${API_SERVER_DOMAIN}/value/getAll/${categoryId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const values = await response.json();

      // rank 기준으로 오름차순 정렬
      values.sort((a, b) => a.rank - b.rank);

      return values;
    } catch (error) {
      console.error(
        `Error fetching values for category ID ${categoryId}:`,
        error
      );
      return [];
    }
  }

  // 모든 카테고리와 해당 카테고리의 가치관을 조회하는 함수
  async function fetchAllData() {
    try {
      const categories = await fetchAllCategories();
      categoryData = {}; // 카테고리 데이터를 초기화

      for (const category of categories) {
        const values = await fetchValuesByCategoryId(category.categoryId);
        categoryData[category.categoryName] = {
          categoryId: category.categoryId,
          categoryName: category.categoryName,
          values: values,
        };
      }

      // DOM에 데이터 렌더링
      renderCategoriesAndValues();
    } catch (error) {
      console.error("Error fetching all data:", error);
    }
  }

  function renderCategoriesAndValues() {
    collectionContainer.innerHTML = ""; // 기존 내용 초기화

    Object.keys(categoryData).forEach((categoryName) => {
      const categoryInfo = categoryData[categoryName];
      const categoryDiv = document.createElement("div");
      categoryDiv.className = "ex";
      categoryDiv.dataset.categoryId = categoryInfo.categoryId; // 카테고리 ID 저장

      const categoryTitle = document.createElement("p");
      categoryTitle.className = "category-title";
      categoryTitle.textContent = categoryInfo.categoryName;

      categoryDiv.appendChild(categoryTitle);
      collectionContainer.appendChild(categoryDiv);

      // 가치관 리스트 추가 (value_title과 rank가 있는 항목만)
      if (categoryInfo.values.length > 0) {
        categoryInfo.values.forEach((item, index) => {
          addItemToCategoryDiv(
            categoryDiv,
            item.value_title,
            item.value_id,
            index
          );
        });
      }

      // 클릭 이벤트 추가
      categoryDiv.addEventListener("click", function () {
        openModal(categoryName, categoryDiv.dataset.categoryId, categoryDiv);
      });
    });
  }

  function addItemToCategoryDiv(categoryDiv, title, valueId, index) {
    // 가치관 리스트 컨테이너가 없다면 생성
    let valueContainer = categoryDiv.querySelector(".value-container");
    if (!valueContainer) {
      valueContainer = document.createElement("div");
      valueContainer.classList.add("value-container");
      categoryDiv.appendChild(valueContainer);
    }

    // 개별 가치관 항목 생성
    const valueDiv = document.createElement("span");
    valueDiv.classList.add("value-item");
    valueDiv.textContent = `${index + 1}. ${title}`;

    // valueId를 data-value-id 속성에 저장
    valueDiv.dataset.valueId = valueId;

    valueContainer.appendChild(valueDiv);
  }

  // 카테고리 클릭 시 호출되는 함수
  function openModal(categoryName, categoryId, exDiv) {
    currentCategory = categoryName;
    currentCategoryId = categoryId;
    currentExDiv = exDiv;
    const categoryInput = document.getElementById("category-input");
    categoryInput.value = categoryName;

    // 기존 리스트 항목을 모달에 표시
    detailList.innerHTML = ""; // 이전 리스트 초기화
    const values = categoryData[categoryName].values;
    values.forEach((item, index) => {
      addItemToModalList(item.value_title, index, item.id);
    });

    modal.style.display = "block";
  }

  function closeModal() {
    modal.style.display = "none";
    updateExDiv();

    // 초기화 작업
    currentCategory = null;
    currentCategoryId = null;
    currentExDiv = null;
  }

  closeButton.addEventListener("click", function () {
    closeModal();
  });

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  // 상세 모달 열기
  function openReasonModal() {
    reasonModal.style.display = "block";
  }

  // 상세 모달 닫기
  function closeReasonModal() {
    reasonModal.style.display = "none";
  }

  // 상세 모달 닫기 버튼 이벤트 리스너
  closeReasonButton.addEventListener("click", closeReasonModal);

  deleteValueButton.addEventListener("click", function () {
    if (currentCategoryId !== null) {
      // DELETE 요청 보내기
      deleteCategory(currentCategoryId);
      // 현재 선택된 ex div 삭제
      if (currentExDiv) {
        currentExDiv.remove();
        currentExDiv = null; // 현재 선택 상태 초기화
      }
      closeModal(); // 모달 닫기
      fetchAllData();
    }
  });

  // 가치관 리스트 항목을 모달에 추가
  function addItemToModalList(text, index, valueId) {
    const newListItem = document.createElement("li");
    newListItem.classList.add("detail-item");
    newListItem.dataset.valueId = valueId; // 데이터 속성에 valueId 저장

    const numberSpan = document.createElement("span");
    numberSpan.classList.add("item-number");
    numberSpan.textContent = `${index + 1}. `;

    const textDiv = document.createElement("div");
    textDiv.textContent = text;
    textDiv.classList.add("detail-text");

    textDiv.addEventListener("click", function (event) {
      event.stopPropagation();
      openChangeRankModal(valueId);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "x";
    deleteButton.classList.add("delete-button");

    deleteButton.addEventListener("click", async function () {
      try {
        // 변화 기록 생성
        await fetch(`${API_SERVER_DOMAIN}/valuechangelog`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            changeType: "Delete_Value",
            changeReason: null,
            category_id: currentCategoryId,
            value_id: valueId,
          }),
        });
      } catch (error) {
        console.error("삭제 처리 중 오류 발생:", error);
      }
      // 가치관을 휴지통으로 이동
      await archiveValue(valueId);
      console.log("가치관 휴지통으로 이동 완료");

      // 모든 데이터를 다시 불러와 화면 갱신
      await fetchAllData();
      console.log("데이터 갱신 완료");
    });

    newListItem.appendChild(numberSpan);
    newListItem.appendChild(textDiv);
    newListItem.appendChild(deleteButton);
    detailList.appendChild(newListItem);
  }

  // 새로운 가치관 추가
  addList.addEventListener("click", function (event) {
    event.preventDefault();

    const newListItem = document.createElement("li");
    newListItem.classList.add("detail-item");

    const numberSpan = document.createElement("span");
    numberSpan.classList.add("item-number");

    const newInput = document.createElement("input");
    newInput.type = "text";
    newInput.classList.add("detail-input");

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "x";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", function () {
      detailList.removeChild(newListItem);

      updateListNumbers();
    });

    newInput.addEventListener("keypress", async function (event) {
      if (event.key === "Enter") {
        console.log("Enter key pressed for value input."); // 콘솔 로그 추가
        event.preventDefault();
        const inputValue = newInput.value;
        if (inputValue) {
          try {
            // 첫 번째 POST 요청: 가치관 추가
            const responseData = await postValueTitle(
              currentCategoryId,
              inputValue
            );

            // 응답으로 받은 value_id와 함께 데이터를 저장
            categoryData[currentCategory].values.push({
              value_id: responseData.valueId,
              value_title: inputValue,
            });

            // 입력한 값으로 div를 추가하여 표시
            const textDiv = document.createElement("div");
            textDiv.classList.add("detail-text");
            textDiv.textContent = inputValue;

            // valueId가 제대로 설정되었는지 확인
            console.log("Newly created Value ID:", responseData.valueId);

            newListItem.innerHTML = ""; // 기존 내용을 모두 지움
            newListItem.appendChild(numberSpan);
            newListItem.appendChild(textDiv);
            newListItem.appendChild(deleteButton);

            // 두 번째 POST 요청: 변경 사항 기록
            await fetch(`${API_SERVER_DOMAIN}/valuechangelog`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                changeType: "Add_Value",
                changeReason: null,
                category_id: currentCategoryId,
                value_id: responseData.valueId,
              }),
            });

            // 새로운 리스트 항목에 클릭 이벤트 리스너 추가
            textDiv.addEventListener("click", function (event) {
              event.stopPropagation();
              openChangeRankModal(responseData.valueId); // 새로운 valueId 전달
            });

            // 전체 데이터를 다시 불러와 화면 갱신
            await fetchAllData();
          } catch (error) {
            console.error("Error adding value and logging change:", error);
          }
        }
        updateListNumbers();
      }
    });

    newListItem.appendChild(numberSpan);
    newListItem.appendChild(newInput);
    newListItem.appendChild(deleteButton);
    detailList.appendChild(newListItem);
    updateListNumbers();
  });

  function updateListNumbers() {
    document.querySelectorAll(".detail-item").forEach((item, index) => {
      const numberSpan = item.querySelector(".item-number");
      if (numberSpan) {
        numberSpan.textContent = `${index + 1}. `;
      }
    });
  }

  function updateExDiv() {
    if (currentExDiv) {
      const category = currentCategory;

      // exDiv의 기존 value-container를 제거
      const existingValueContainer =
        currentExDiv.querySelector(".value-container");
      if (existingValueContainer) {
        currentExDiv.removeChild(existingValueContainer);
      }

      // 새로운 value-container 생성
      const valueContainer = document.createElement("div");
      valueContainer.classList.add("value-container");

      // 현재 카테고리의 가치관들을 추가
      categoryData[category].values.forEach((item, index) => {
        const itemSpan = document.createElement("span");
        itemSpan.textContent = `${index + 1}. ${item.value_title}`;
        itemSpan.classList.add("value-item");
        valueContainer.appendChild(itemSpan);
      });

      // exDiv에 valueContainer 추가
      currentExDiv.appendChild(valueContainer);
    }
  }

  // 카테고리 이름 변경 - 카테고리 입력 필드에서 Enter 키 이벤트 처리
  const categoryInput = document.getElementById("category-input");
  categoryInput.addEventListener("keypress", async function (event) {
    if (event.key === "Enter") {
      console.log("Enter key pressed for category input."); // 콘솔 로그 추가
      event.preventDefault();
      const newCategoryName = categoryInput.value.trim();
      if (newCategoryName && currentCategoryId) {
        try {
          // PATCH 요청: 카테고리 이름 변경
          const response = await fetch(
            `${API_SERVER_DOMAIN}/value/category/${currentCategoryId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                categoryName: newCategoryName,
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          console.log(
            `Category name changed to ${newCategoryName} for category ID ${currentCategoryId}`
          );

          // 데이터 다시 불러오기 및 화면 갱신
          await fetchAllData();
        } catch (error) {
          console.error("Error updating category name:", error);
        }
      }
    }
  });

  // 가치관 생성
  async function postValueTitle(categoryId, valueTitle) {
    try {
      console.log("Using access token:", accessToken); // 액세스 토큰 로그 확인

      console.log("Sending category ID:", categoryId); // categoryId 로그
      console.log("Sending value title:", valueTitle); // valueTitle 로그

      const response = await fetch(API_SERVER_DOMAIN + "/value", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // 올바른 형식 확인
        },
        body: JSON.stringify({
          category_id: categoryId,
          value_title: valueTitle,
        }),
      });

      console.log(
        "Request body:",
        JSON.stringify({
          category_id: categoryId,
          value_title: valueTitle,
        })
      ); // 요청 body 내용 로그

      if (!response.ok) {
        const serverResponse = await response.json();
        console.error("Server response:", serverResponse);

        if (response.status === 401) {
          console.warn(
            "Unauthorized access, please check the token and server settings."
          );
          throw new Error(`Unauthorized access: ${serverResponse.message}`);
        } else {
          throw new Error(`Failed to post value: ${response.status}`);
        }
      }

      const result = await response.json();
      console.log("Successfully posted value:", result);
      return {
        valueId: result.id,
        valueTitle: result.value_title,
        category: result.category,
        rank: result.rank,
      };
    } catch (error) {
      console.error("Error posting value title:", error);
      throw error;
    }
  }

  // 가치관 삭제
  async function deleteValue(valueId) {
    try {
      const response = await fetch(`${API_SERVER_DOMAIN}/value/${valueId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log(`Successfully deleted value with id ${valueId}`);
    } catch (error) {
      console.error("Error deleting value:", error);
    }
  }

  // 카테고리 삭제
  async function deleteCategory(categoryId) {
    try {
      const response = await fetch(
        `${API_SERVER_DOMAIN}/value/category/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log(`Successfully deleted category with id ${categoryId}`);

      // categoryData에서 삭제된 카테고리 제거
      delete categoryData[categoryId];

      // UI 업데이트
      renderCategoriesAndValues();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  }

  // 가치관 휴지통 저장
  async function archiveValue(valueId) {
    try {
      const response = await fetch(API_SERVER_DOMAIN + "/valuetrashcan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ valueId: valueId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Successfully archived value:", result);
    } catch (error) {
      console.error("Error archiving value:", error);
      throw error;
    }
  }

  // 전역 변수로 변경할 값 저장
  let currentChangeRankValueId = null;

  function openChangeRankModal(valueId) {
    currentChangeRankValueId = valueId;

    // 기존 모달이 있다면 제거
    const existingModal = document.querySelector(".change-rank-modal");
    if (existingModal) {
      existingModal.remove();
    }

    // 모달 요소 생성
    const changeRankModal = document.createElement("div");
    changeRankModal.classList.add("change-rank-modal");

    // 현재 카테고리에 대한 데이터가 존재하는지 확인
    if (categoryData[currentCategory]) {
      // 모달 내용 구성
      categoryData[currentCategory].values.forEach((_, index) => {
        const rankOption = document.createElement("div");
        rankOption.classList.add("rank-option");
        rankOption.textContent = `${index + 1}`; // 순위 표시
        rankOption.style.cursor = "pointer"; // 클릭 가능한 요소로 설정

        rankOption.addEventListener("click", async function () {
          try {
            console.log(currentChangeRankValueId);
            console.log(index + 1);
            // 순위 변경 PATCH 요청 보내기
            await fetch(`${API_SERVER_DOMAIN}/value`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                valueId: currentChangeRankValueId,
                changeRanking: index + 1,
              }),
            });

            console.log(
              `Changing rank of valueId ${currentChangeRankValueId} to ${
                index + 1
              }`
            );

            // Rank 모달 닫기
            changeRankModal.remove();
            openReasonModal(); // 이유 모달 열기
            await fetchAllData();
          } catch (error) {
            console.error("Error changing ranking:", error);
          }
        });

        changeRankModal.appendChild(rankOption);
      });
    } else {
      console.error("Error: currentCategory data not found.");
    }

    document.body.appendChild(changeRankModal);
  }

  async function closeReasonModal() {
    try {
      const changeReason = document.getElementById("reason-text").value;

      // 순위 변경 이유를 기록하는 POST 요청
      await fetch(`${API_SERVER_DOMAIN}/valuechangelog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          changeType: "Change_Rank",
          changeReason: changeReason,
          category_id: currentCategoryId,
          value_id: currentChangeRankValueId,
        }),
      });

      // 이유 모달 닫기
      const reasonModal = document.getElementById("reason-modal");
      reasonModal.style.display = "none";
      console.log("Reason sent and modal closed.");
    } catch (error) {
      console.error("Error sending change reason:", error);
    }
  }

  // 이유 모달 닫기 버튼에 이벤트 리스너 추가
  closeReasonButton.addEventListener("click", closeReasonModal);

  // 데이터 초기 로드
  fetchAllData();
});


