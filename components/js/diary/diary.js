const feelingInputs = document.querySelectorAll('input[name="feeling"]');
const diaryTitle = document.querySelector('#diary_title');
const diaryMain = document.querySelector('#diary_main');
const diaryAnswer1 = document.querySelector('#diary_answer1');
const diaryAnswer2 = document.querySelector('#diary_answer2');
const submitButton = document.querySelector('#diary_submit');
const today_what = document.querySelector('.date');
const qna_container = document.querySelector('.qna');
const form = document.querySelector('form');
let API_SERVER_DOMAIN = "http://zagabi.shop";
let isFeelingSelected = false;
let questionId_;  // 전역 변수로 이동

function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}



document.addEventListener("DOMContentLoaded", function () {
    var accessToken = getCookie("accessToken");

    fetch(API_SERVER_DOMAIN + "/diary/question", {
        method: "GET",
        headers: {
            Authorization: "Bearer " + accessToken,
        },
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Login failed");
        }
        return response.json();
    })
    .then((data) => {
        questionId_ = data.questionId;
        var question = data.question;
        qna_container.textContent = question;
    })
    .catch((error) => {
        alert("질문을 불러오는데 실패했습니다: " + error.message);
    });
});

function checkFeeling() {
    isFeelingSelected = Array.from(feelingInputs).some(input => input.checked);
    checkFormValidity();
}

function checkFormValidity() {
    const allFieldsFilled = diaryTitle.value.trim() !== '' &&
        diaryMain.value.trim() !== '' &&
        diaryAnswer1.value.trim() !== '' &&
        diaryAnswer2.value.trim() !== '' &&
        isFeelingSelected;
    submitButton.disabled = !allFieldsFilled;
}

feelingInputs.forEach(input => {
    input.addEventListener('change', checkFeeling);
});

diaryTitle.addEventListener('input', checkFormValidity);
diaryMain.addEventListener('input', checkFormValidity);
diaryAnswer1.addEventListener('input', checkFormValidity);
diaryAnswer2.addEventListener('input', checkFormValidity);

let today = new Date();
let year = today.getFullYear();
let month = today.getMonth() + 1;
let date = today.getDate();

today_what.textContent = year + '.' + month + '.' + date;

form.addEventListener('submit', (event) => {
    event.preventDefault();

    var accessToken = getCookie("accessToken");

    const formData = {
        title: diaryTitle.value,
        mainText: diaryMain.value,
        mood: document.querySelector('input[name="feeling"]:checked').value,
        impression: diaryAnswer2.value,
        answer: diaryAnswer1.value,
        questionId: questionId_
    };

    fetch(API_SERVER_DOMAIN + '/diary', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + accessToken
        },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.title) {
            alert("일기가 성공적으로 작성되었습니다!");
            window.location.href = '/Dashboard/Dashboard.html'
        } else {
            alert("일기 작성 실패: " + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("서버와의 통신 오류가 발생했습니다: " + error.message);
    });
});


let currentMonth;
let currentYear;
let monthYearElem = document.querySelector('#monthYear');
let calendarDaysElem = document.querySelector('.calendar-days');

document.addEventListener("DOMContentLoaded", function () {
    const accessToken = getCookie("accessToken");
    fetch(`${API_SERVER_DOMAIN}/diary/all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(responseData => {
        if (Array.isArray(responseData)) {
            console.log(responseData);
            data = responseData; // Update global data array
            createCalendar(currentYear, currentMonth); // Recreate calendar with updated data
        } else {
            console.error("데이터가 배열이 아닙니다:", responseData);
        }
    })
    .catch(error => {
        console.error('오류:', error);
        alert("서버와의 통신 오류가 발생했습니다: " + error.message);
    });
});





// 달의 일수를 반환하는 함수
function getMonthDays(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

// Format date as YYYY-MM-DD
function formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}


// 달력을 생성하는 함수
function createCalendar(year, month) {
    calendarDaysElem.innerHTML = '';
    const daysInMonth = getMonthDays(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement('div');
        calendarDaysElem.appendChild(emptyCell);
    }

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElem = document.createElement('div');
        dayElem.className = 'day';
        dayElem.textContent = day;

        const dateStr = formatDate(new Date(year, month, day));
        const entry = data.find(d => formatDate(new Date(d.createdAt)) === dateStr);
        console.log(data)
        if (entry) {
            dayElem.classList.add(`mood-${entry.mood}`);
        }

        if (isCurrentMonth && day === today.getDate()) {
            dayElem.classList.add('today');
        }

        calendarDaysElem.appendChild(dayElem);
    }
    monthYearElem.textContent = `${year}-${String(month + 1).padStart(2, '0')}`;
}

// 달력 월 변경 함수
function changeMonth(offset) {
    currentMonth += offset;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    createCalendar(currentYear, currentMonth);
}

document.getElementById('prevMonth').onclick = () => changeMonth(-1);
document.getElementById('nextMonth').onclick = () => changeMonth(1);

const today_ = new Date();
currentYear = today_.getFullYear();
currentMonth = today_.getMonth();
