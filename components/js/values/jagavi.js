// var API_SERVER_DOMAIN = "http://15.164.253.0:8081";

// function getCookie(name) {
//     const nameEQ = name + "=";
//     const cookies = document.cookie.split(";");
//     for (let i = 0; i < cookies.length; i++) {
//         let cookie = cookies[i];
//         while (cookie.charAt(0) === " ") {
//             cookie = cookie.substring(1);
//         }
//         if (cookie.indexOf(nameEQ) === 0) {
//             return cookie.substring(nameEQ.length, cookie.length);
//         }
//     }
//     return null;
// }



const change_log = {
  Add_Category: "카테고리 추가",
  Add_Value: "가치관 추가",
  Change_Rank: "순위 변동",
};

function organizeDataByDateAndTime(data) {
  if (!Array.isArray(data)) {
    console.error("데이터가 배열이 아닙니다:", data);
    return {};
  }

  const dateMap = {};

  data.forEach((entry) => {
    const dateStr = new Date(entry.createdAt).toISOString().split("T")[0];
    const timeStr = new Date(entry.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    if (!dateMap[dateStr]) {
      dateMap[dateStr] = {};
    }

    if (!dateMap[dateStr][timeStr]) {
      dateMap[dateStr][timeStr] = [];
    }

    dateMap[dateStr][timeStr].push(entry);
  });

  return dateMap;
}

function getChangeCountBackground(changeCount) {
  if (changeCount === 0) return "bg-white";
  if (changeCount >= 1 && changeCount <= 2) return "bg-light-green";
  if (changeCount >= 3 && changeCount <= 4) return "bg-green";
  return "bg-dark-green";
}

function showModalData(date) {
  const dateEntries = organizedData[date];
  const modalContent = document.getElementById("modalContent");

  if (dateEntries) {
    let content = ``;
    const sortedTimes = Object.keys(dateEntries).sort();

    sortedTimes.forEach((time) => {
      dateEntries[time].forEach((entry) => {
        const timeStr = new Date(entry.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        const changeType = change_log[entry.changeType] || entry.changeType; // Translated change type
        content += `
                <ul>
                    <li>
                        ${timeStr} ${changeType}
                        <br>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${entry.categoryName}
                    </li>
                </ul >
                <hr>
                `;
      });
    });

    modalContent.innerHTML = content;
  }
  document.getElementById("jagaviModal").style.display = "flex";
}

function createJagaviCalendar(year, month) {
  jagaviCalendarDaysElem.innerHTML = "";
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  for (let i = 0; i < firstDayOfMonth; i++) {
    const emptyCell = document.createElement("div");
    jagaviCalendarDaysElem.appendChild(emptyCell);
  }

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;

  for (let day = 1; day <= daysInMonth; day++) {
    const dayElem = document.createElement("div");
    dayElem.className = "day";
    dayElem.textContent = day;

    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    const hasEntries = organizedData[dateStr];

    if (hasEntries) {
      const changeCount = Object.values(organizedData[dateStr]).reduce(
        (acc, timeEntries) => acc + timeEntries.length,
        0
      );
      dayElem.classList.add(getChangeCountBackground(changeCount));
      dayElem.addEventListener("click", () => showModalData(dateStr));
    }

    if (isCurrentMonth && day === today.getDate()) {
      dayElem.classList.add("today");
    }

    jagaviCalendarDaysElem.appendChild(dayElem);
  }
  jagaviMonthYearElem.textContent = `${year}-${String(month + 1).padStart(
    2,
    "0"
  )}`;
}

function changeJagaviMonth(offset) {
  jagaviCurrentMonth += offset;
  if (jagaviCurrentMonth < 0) {
    jagaviCurrentMonth = 11;
    jagaviCurrentYear--;
  } else if (jagaviCurrentMonth > 11) {
    jagaviCurrentMonth = 0;
    jagaviCurrentYear++;
  }
  createJagaviCalendar(jagaviCurrentYear, jagaviCurrentMonth);
}

document.addEventListener("DOMContentLoaded", function () {
  const accessToken = getCookie("accessToken");
  fetch(`${API_SERVER_DOMAIN}/valuechangelog/getAll`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data)) {
        originalJagaviData = data;
        organizedData = organizeDataByDateAndTime(originalJagaviData);
        createJagaviCalendar(jagaviCurrentYear, jagaviCurrentMonth);
      } else {
        console.error("데이터가 배열이 아닙니다:", data);
      }
    })
    .catch((error) => {
      console.error("오류:", error);
      alert("서버와의 통신 오류가 발생했습니다: " + error.message);
    });

  document.getElementById("prevJagaviMonth").onclick = () =>
    changeJagaviMonth(-1);
  document.getElementById("nextJagaviMonth").onclick = () =>
    changeJagaviMonth(1);

  const todayJagavi = new Date();
  jagaviCurrentYear = todayJagavi.getFullYear();
  jagaviCurrentMonth = todayJagavi.getMonth();

  createJagaviCalendar(jagaviCurrentYear, jagaviCurrentMonth);

  document.getElementById("closeModal").onclick = () => {
    document.getElementById("jagaviModal").style.display = "none";
  };
});

const jagaviMonthYearElem = document.querySelector("#jagaviMonthYear");
const jagaviCalendarDaysElem = document.querySelector(
  ".jagavi_calender .calendar-days"
);

let originalJagaviData = [];
let organizedData = {};
let jagaviCurrentMonth;
let jagaviCurrentYear;
