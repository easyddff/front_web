document.addEventListener('DOMContentLoaded', function () {
  initCategoryButtons();
});

function initCategoryButtons() {
  const categoryButtons = document.querySelectorAll('.category_btn');
  const pagination = document.querySelector('.pagination');
  let currentCategory = '전체';
  let currentPage = 1;
  const itemsPerPage = 15;

  // 카테고리 버튼 클릭 이벤트
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      currentCategory = button.textContent.trim();  // 클릭한 버튼의 카테고리 이름 설정
      currentPage = 1;
      fetchAndDisplayLectures();
    });
  });

  // 페이지 네비게이션 클릭 이벤트
  pagination.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      const pageText = e.target.textContent.trim();
      if (pageText === '«') {
        if (currentPage > 1) currentPage--;
      } else if (pageText === '»') {
        currentPage++;
      } else {
        currentPage = parseInt(pageText);
      }
      fetchAndDisplayLectures();
    }
  });

  // JSON 데이터 가져와서 화면에 출력
  function fetchAndDisplayLectures() {
    // JSON 파일에서 데이터를 가져옴
    fetch('/json-server-exam/data.json')  // JSON 파일 경로 확인
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // 강의 목록을 표시할 요소를 가져오고 기존 내용을 지움
        const categoryList = document.getElementById('category_list_in');
        categoryList.innerHTML = '';  // 기존 내용 지우기
  
        // 선택된 카테고리에 따라 강의 필터링
        let filteredLectures = data.lecture;
        if (currentCategory !== '전체') {
          filteredLectures = data.lecture.filter(lecture => lecture.category.includes(currentCategory));
        }
  
        // 총 페이지 수 계산
        const totalPages = Math.ceil(filteredLectures.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        // 현재 페이지에 표시할 강의를 슬라이싱
        const lecturesToShow = filteredLectures.slice(startIndex, endIndex);
  
        // 각 강의를 목록에 추가
        lecturesToShow.forEach(lecture => {
          const li = document.createElement('li');
          li.className = 'lecture-item';  // CSS 클래스 추가 (선택 사항)
  
          const a = document.createElement('a');
          a.href = `/subject_detail/subject_detail.html?id=${lecture.id}`;  // id를 동적으로 설정
  
          const img = document.createElement('img');
          img.src = lecture.img;
          img.alt = lecture.title;
  
          const dateP = document.createElement('p');
          dateP.textContent = lecture.date;
  
          const categoryP = document.createElement('p');
          categoryP.textContent = lecture.category;
  
          const priceP = document.createElement('p');
          priceP.textContent = lecture.price;
  
          // 요소들을 a 태그에 추가
          a.appendChild(img);
          a.appendChild(dateP);
          a.appendChild(categoryP);
          a.appendChild(priceP);
          // a 태그를 li 태그에 추가
          li.appendChild(a);
          // li 태그를 categoryList에 추가
          categoryList.appendChild(li);
        });
  
        // 페이지네이션 업데이트
        updatePagination(totalPages);
      })
      // 데이터 가져오는 중 오류 발생 시 콘솔에 출력
      .catch(error => console.error('Error fetching data:', error));
  }
  

  // 페이지 네비게이션 업데이트 함수
  function updatePagination(totalPages) {
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = `
      <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
      pagination.innerHTML += `
        <li class="page-item ${i === currentPage ? 'active' : ''}">
          <a class="page-link" href="#">${i}</a>
        </li>
      `;
    }

    pagination.innerHTML += `
      <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    `;
  }

  // 초기 강의 목록 로드
  fetchAndDisplayLectures();
}
