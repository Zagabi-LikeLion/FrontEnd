document.addEventListener("DOMContentLoaded", function () {
  // 로컬 스토리지에서 새 닉네임 가져오기
  const newNickName = localStorage.getItem("newNickName");

  if (newNickName) {
    // 새 닉네임이 존재하면, 화면에 표시
    document.getElementById("new-nickname").textContent = newNickName;
  } else {
    console.warn("로컬 스토리지에서 newNickName을 찾을 수 없습니다.");
  }
});
