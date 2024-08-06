// 전역변수
let data = [];
let originalJagaviData = [];
let organizedData = {}; 

const moodImages = {
    HAPPY: { src: '/assets/img/smile.png', text: '행복' },
    SAD: { src: '/assets/img/cry.png', text: '슬픔' },
    ANGRY: { src: '/assets/img/angry.png', text: '화남' },
    ANXIOUS: { src: '/assets/img/firein.png', text: '불안' },
    SENSITIVE: { src: '/assets/img/what.png', text: '예민' },
    SHY: { src: '/assets/img/sosim.png', text: '소심' },
    BORED: { src: '/assets/img/double.png', text: '따분' },
};

let API_SERVER_DOMAIN = "http://zagabi.shop";

const monthYearElem = document.querySelector('#monthYear');
const calendarDaysElem = document.querySelector('.calendar-days');
const modal = document.querySelector('#modal');
const closeModal = document.querySelector('#close');
const modalDate = document.querySelector('.modal_date');
const modalTitle = document.querySelector('#modalTitle');
const modalMainText = document.querySelector('#modalMainText');
const modalImpression = document.querySelector('#modalImpression');
const moodImage = document.querySelector('#moodImage');
const feelText = document.querySelector('#feel');
const imgContainer = document.querySelector('.img_container');
const qnaContianer = document.querySelector('.modal_q1');
const askCotainer = document.querySelector('.modal_a1');
const change_btn = document.querySelector('#change');

const jagaviMonthYearElem = document.querySelector('#jagaviMonthYear');
const jagaviCalendarDaysElem = document.querySelector('.jagavi_calender .calendar-days');

let currentMonth;
let currentYear;
let date_change;  // diaryID

let jagaviCurrentMonth;
let jagaviCurrentYear;

// 달력 데이터 받아오기
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
            data = responseData; 
            createCalendar(currentYear, currentMonth); 
        } else {
            console.error("데이터가 배열이 아닙니다:", responseData);
        }
    })
    .catch(error => {
        console.error('오류:', error);
        alert("서버와의 통신 오류가 발생했습니다: " + error.message);
    });
});

//가치관 데이터 가져오기
document.addEventListener("DOMContentLoaded", function () {
    const accessToken = getCookie("accessToken");
    fetch(`${API_SERVER_DOMAIN}/valuechangelog/getAll`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (Array.isArray(data)) {
            console.log(data)
            originalJagaviData = data;
            organizedData = organizeDataByDateAndTime(originalJagaviData);
            createJagaviCalendar(jagaviCurrentYear, jagaviCurrentMonth);
        } else {
            console.error("데이터가 배열이 아닙니다:", data);
        }
    })
    .catch(error => {
        console.error('오류:', error);
        alert("서버와의 통신 오류가 발생했습니다: " + error.message);
    });
});

// YYYY-MM-DD 형태로 데이터 변환
function formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// 달력 그리기
function createCalendar(year, month) {
    calendarDaysElem.innerHTML = '';
    const daysInMonth = new Date(year, month + 1, 0).getDate();
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

        if (entry) {
            dayElem.classList.add(`mood-${entry.mood}`);
            dayElem.onclick = () => {
                modalDate.textContent = dateStr;
                modalTitle.textContent = `제목 : ` + entry.title;
                modalMainText.textContent = entry.mainText;
                modalImpression.textContent = entry.impression;
                qnaContianer.textContent = `Q.` + entry.questionContent;
                askCotainer.textContent = entry.answer;

                const mood = moodImages[entry.mood] || moodImages['NEUTRAL'];
                moodImage.src = mood.src;
                feelText.textContent = mood.text;

                imgContainer.className = `img_container mood-${entry.mood}`;

                // ID값으로 편집 접근
                document.querySelector('#change').addEventListener('click', () => {
                    goto_change(entry.diaryId);
                });
                modal.style.display = 'flex';
            };
        }
        if (isCurrentMonth && day === today.getDate()) {
            dayElem.classList.add('today');
        }

        calendarDaysElem.appendChild(dayElem);
    }
    monthYearElem.textContent = `${year}-${String(month + 1).padStart(2, '0')}`;
}

// 모달창 닫기
function closeModalWindow() {
    modal.style.display = 'none';
}


closeModal.onclick = closeModalWindow;
window.onclick = (event) => {
    if (event.target === modal) {
        closeModalWindow();
    }
};

// 월 바꾸기
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

const today = new Date();
currentYear = today.getFullYear();
currentMonth = today.getMonth();

createCalendar(currentYear, currentMonth);

// 일기 수정 페이지 이동
function goto_change(date_change) {
    localStorage.setItem('dateStr', date_change);
    window.location.href = '/diary/change.html';
}


// 데이터 형식 바꾸기
function organizeDataByDateAndTime(data) {
    if (!Array.isArray(data)) {
        console.error('데이터가 배열이 아닙니다:', data);
        return {};
    }

    const dateMap = {};

    data.forEach(entry => {
        const dateStr = formatDate(new Date(entry.createdAt));

        if (!dateMap[dateStr]) {
            dateMap[dateStr] = [];
        }

        dateMap[dateStr].push(entry);
    });

    return dateMap;
}

// 가치관 일기 만들기
function createJagaviCalendar(year, month) {
    jagaviCalendarDaysElem.innerHTML = '';
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement('div');
        jagaviCalendarDaysElem.appendChild(emptyCell);
    }

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElem = document.createElement('div');
        dayElem.className = 'day';
        dayElem.textContent = day;

        const dateStr = formatDate(new Date(year, month, day));
        const entries = organizedData[dateStr];
        if (entries && entries.length > 0) {
            console.log(entries);
            const changeCount = entries.length;
            console.log(changeCount);
            
            dayElem.classList.add(getChangeCountBackground(changeCount));
        }

        if (isCurrentMonth && day === today.getDate()) {
            dayElem.classList.add('today');
        }

        jagaviCalendarDaysElem.appendChild(dayElem);
    }

    jagaviMonthYearElem.textContent = `${year}-${String(month + 1).padStart(2, '0')}`;
}

// 색깔 설정
function getChangeCountBackground(changeCount) {
    if (changeCount === 0) return 'bg-white';
    if (changeCount >= 1 && changeCount <= 3) return 'bg-light-green';
    if (changeCount >= 4 && changeCount <= 6) return 'bg-green';
    return 'bg-dark-green';
}

// 가치관 달력 월 변경
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

document.getElementById('prevJagaviMonth').onclick = () => changeJagaviMonth(-1);
document.getElementById('nextJagaviMonth').onclick = () => changeJagaviMonth(1);

// 현재 날짜
const todayJagavi = new Date();
jagaviCurrentYear = todayJagavi.getFullYear();
jagaviCurrentMonth = todayJagavi.getMonth();

createJagaviCalendar(jagaviCurrentYear, jagaviCurrentMonth);

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

// Get cookie by name
function getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === " ") {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}
