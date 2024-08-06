let API_SERVER_DOMAIN = "http://zagabi.shop";

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

document.addEventListener('DOMContentLoaded', () => {
    var accessToken = getCookie("accessToken");
    let diaryId = localStorage.getItem('dateStr');
    let diaryTitle = document.getElementById('diary_title');
    let diaryMain = document.getElementById('diary_main');
    let diaryAnswer1 = document.getElementById('diary_answer1');
    let diaryAnswer2 = document.getElementById('diary_answer2');
    let date = document.querySelector('.date');
    let qna = document.querySelector('.qna');
    let mood = '';
    fetch(`${API_SERVER_DOMAIN}/diary/${diaryId}`, {
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
            diaryTitle.value = data.title;
            diaryMain.value = data.mainText;
            diaryAnswer1.value = data.answer;
            diaryAnswer2.value = data.impression;
            qna.textContent = data.questionContent;
            date.textContent = new Date(data.createdAt).toLocaleDateString();
            mood = data.mood;

            // 감정 상태에 따라 라디오 버튼 선택하기
            const moodMap = {
                "HAPPY": "happy",
                "SAD": "sad",
                "ANGRY": "angry",
                "SENSITIVE": "what",
                "SHY": "sosim",
                "ANXIOUS": "firein",
                "BORED": "double"
            };

            const moodValue = moodMap[mood] || "happy"; // 기본값은 "happy"
            const moodRadio = document.getElementById(moodValue);
            if (moodRadio) {
                moodRadio.checked = true;
            }
        })
        .catch((error) => {
            window.location.href = '/Dashboard/Dashboard.html';
            alert(error.message);
        });
});

function deleteDiary() {
    var accessToken = getCookie("accessToken");
    let diaryId = localStorage.getItem('dateStr');

    fetch(`${API_SERVER_DOMAIN}/diary/${diaryId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': "Bearer " + accessToken
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to delete diary");
            }
            return response.json();
        })
        .then(data => {
            alert("일기가 성공적으로 삭제되었습니다!");
            window.location.href = '/Dashboard/Dashboard.html';
        })
        .catch(error => {
            console.error('Error:', error);
            alert("서버와의 통신 오류가 발생했습니다: " + error.message);
        });
}

function changeDiary() {
    var accessToken = getCookie("accessToken");
    let diaryId = localStorage.getItem('dateStr');
    let diaryTitle = document.getElementById('diary_title');
    let diaryMain = document.getElementById('diary_main');
    let diaryAnswer1 = document.getElementById('diary_answer1');
    let diaryAnswer2 = document.getElementById('diary_answer2');
    fetch(`${API_SERVER_DOMAIN}/diary/${diaryId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + accessToken
        },
        body: JSON.stringify({
            title: diaryTitle.value,
            mainText: diaryMain.value,
            mood: document.querySelector('input[name="feeling"]:checked').value,
            impression: diaryAnswer2.value,
            answer: diaryAnswer1.value
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data) {
                alert("일기가 성공적으로 수정되었습니다!");
                window.location.href = '/Dashboard/Dashboard.html'
            } else {
                alert("일기 작성 실패: " + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("서버와의 통신 오류가 발생했습니다: " + error.message);
        });
}

document.getElementById('diary_delete').addEventListener('click', deleteDiary);
document.getElementById('diary_change').addEventListener('click', changeDiary);
document.getElementById('home').addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = '/Dashboard/Dashboard.html';
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
