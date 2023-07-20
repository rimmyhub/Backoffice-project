// 모달 열기 함수
openModal = (targetModalId) => {
  const modal = document.getElementById(targetModalId);
  modal.style.display = 'block';
};

// 모달 닫기 함수
closeModal = (targetModalId) => {
  const modal = document.getElementById(targetModalId);
  modal.style.display = 'none';
};
