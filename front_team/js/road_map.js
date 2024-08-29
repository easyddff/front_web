document.addEventListener('DOMContentLoaded', () => {
  // DOM 요소들을 변수에 저장
  const roadmapsContainer = document.getElementById('roadmaps');
  const roadmapDetailsSection = document.getElementById('roadmap-details');
  const roadmapListSection = document.getElementById('roadmap-list');
  const courseList = document.getElementById('course-list');
  const createRoadmapBtn = document.getElementById('create-roadmap');
  const backToListBtn = document.getElementById('back-to-list');
  const addCourseBtn = document.getElementById('add-course');
  const addYoutubeUrlBtn = document.createElement('button');
  const deleteSelectedCoursesBtn = document.getElementById('delete-selected-courses');
  const deleteAllCoursesBtn = document.getElementById('delete-all-courses');
  const deleteSelectedRoadmapsBtn = document.getElementById('delete-selected-roadmaps');
  const deleteAllRoadmapsBtn = document.getElementById('delete-all-roadmaps');

  // 유튜브 URL 추가 버튼 설정 및 추가
  addYoutubeUrlBtn.textContent = '유튜브 URL 추가';
  document.querySelector('#roadmap-details').insertBefore(addYoutubeUrlBtn, deleteSelectedCoursesBtn);

  // 로드맵 데이터를 로컬 스토리지에서 불러오거나 빈 배열로 초기화
  let roadmaps = JSON.parse(localStorage.getItem('roadmaps')) || [];
  let currentRoadmapId = null;

  // 서버에서 강좌 데이터를 불러오는 함수
  async function fetchLectures() {
    const response = await fetch('/json-server-exam/data.json');
    const data = await response.json();
    return data.lecture;
  }

  // 로드맵 데이터를 로컬 스토리지에 저장하는 함수
  function saveRoadmapsToLocalStorage() {
    localStorage.setItem('roadmaps', JSON.stringify(roadmaps));
  }

  // 유튜브 썸네일 URL을 가져오는 함수
  function getYoutubeThumbnail(url) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/0.jpg`;
    }
    return 'https://via.placeholder.com/50'; // 기본 이미지 설정
  }

  // 로드맵 목록을 렌더링하는 함수
  function renderRoadmapList() {
    roadmapsContainer.innerHTML = '';
    roadmaps.forEach(roadmap => {
      const roadmapDiv = document.createElement('div');
      roadmapDiv.classList.add('roadmap');
      roadmapDiv.innerHTML = `
        <input type="checkbox" data-id="${roadmap.id}">
        <h3>${roadmap.name}</h3>
        <button onclick="viewRoadmap(${roadmap.id})">로드맵 보기</button>
        <button onclick="deleteRoadmap(${roadmap.id})">로드맵 삭제하기</button>
      `;
      roadmapsContainer.appendChild(roadmapDiv);
    });
  }

  // 강좌 목록을 렌더링하는 함수
  function renderCourseList(courses) {
    courseList.innerHTML = '';
    courses.forEach((course, index) => {
      const courseLi = document.createElement('li');
      courseLi.innerHTML = `
        <div>
          <input type="checkbox" data-index="${index}">
          <img src="${course.img}" alt="${course.title}">
          <a href="${course.url}" target="_blank">${course.title}</a>
        </div>
        <div>
          <p>${course.category}</p>
          <p>${course.price}</p>
          <button onclick="deleteCourse(${index})">삭제하기</button>
        </div>
      `;
      courseList.appendChild(courseLi);
    });
 
    // 강좌 목록을 드래그 앤 드롭으로 정렬 가능하게 설정
    new Sortable(courseList, {
      animation: 150,
      onEnd: (evt) => {
        const currentRoadmap = roadmaps.find(r => r.id === currentRoadmapId);
        const [movedCourse] = currentRoadmap.courses.splice(evt.oldIndex, 1);
        currentRoadmap.courses.splice(evt.newIndex, 0, movedCourse);
        saveRoadmapsToLocalStorage();
        renderCourseList(currentRoadmap.courses);
      }
    });
  }

  // 새로운 로드맵 생성 버튼 클릭 이벤트 핸들러
  createRoadmapBtn.addEventListener('click', () => {
    const roadmapName = prompt('새 로드맵 이름을 입력하십시오.');
    if (roadmapName) {
      const newRoadmap = {
        id: Date.now(),  // 현재 시간을 ID로 사용
        name: roadmapName,  // 입력받은 로드맵 이름
        courses: []  // 빈 강좌 목록
      };
      roadmaps.push(newRoadmap);  // 로드맵 목록에 추가
      saveRoadmapsToLocalStorage();  // 로컬 스토리지에 저장
      renderRoadmapList();  // 로드맵 목록을 다시 렌더링
    } else {
      alert('로드맵 이름을 입력해야 합니다.');
    }
  });

  // 로드맵 목록으로 돌아가기 버튼 클릭 이벤트 핸들러
  backToListBtn.addEventListener('click', () => {
    roadmapDetailsSection.style.display = 'none';  // 로드맵 상세 섹션 숨기기
    roadmapListSection.style.display = 'block';  // 로드맵 목록 섹션 보이기
  });

  // 강좌 추가 버튼 클릭 이벤트 핸들러
  addCourseBtn.addEventListener('click', async () => {
    const lectures = await fetchLectures();  // 서버에서 강좌 데이터 불러오기
    const courseName = prompt('추가할 강좌 이름을 입력하십시오.');
    const course = lectures.find(lecture => lecture.title === courseName);  // 입력받은 이름으로 강좌 찾기
    if (course) {
      const currentRoadmap = roadmaps.find(r => r.id === currentRoadmapId);  // 현재 로드맵 찾기
      currentRoadmap.courses.push(course);  // 현재 로드맵에 강좌 추가
      saveRoadmapsToLocalStorage();  // 로컬 스토리지에 저장
      renderCourseList(currentRoadmap.courses);  // 강좌 목록 다시 렌더링
    } else {
      alert('강좌를 찾을 수 없습니다.');
    }
  });

  // 유튜브 URL 추가 버튼 클릭 이벤트 핸들러
  addYoutubeUrlBtn.addEventListener('click', () => {
    const courseName = prompt('추가할 강좌 이름을 입력하십시오.');
    const courseUrl = prompt('유튜브 URL을 입력하십시오.');
    if (courseName && courseUrl) {
      const newCourse = {
        title: courseName,  // 입력받은 강좌 이름
        img: getYoutubeThumbnail(courseUrl),  // 유튜브 썸네일 URL 가져오기
        url: courseUrl  // 입력받은 유튜브 URL
      };
      const currentRoadmap = roadmaps.find(r => r.id === currentRoadmapId);  // 현재 로드맵 찾기
      currentRoadmap.courses.push(newCourse);  // 현재 로드맵에 강좌 추가
      saveRoadmapsToLocalStorage();  // 로컬 스토리지에 저장
      renderCourseList(currentRoadmap.courses);  // 강좌 목록 다시 렌더링
    } else {
      alert('강좌 이름과 유튜브 URL을 모두 입력해야 합니다.');
    }
  });

  // 선택한 강좌 삭제 버튼 클릭 이벤트 핸들러
  deleteSelectedCoursesBtn.addEventListener('click', () => {
    const currentRoadmap = roadmaps.find(r => r.id === currentRoadmapId);  // 현재 로드맵 찾기
    const checkboxes = document.querySelectorAll('#course-list input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
      const index = parseInt(checkbox.getAttribute('data-index'));
      currentRoadmap.courses.splice(index, 1);  // 선택된 강좌 삭제
    });
    saveRoadmapsToLocalStorage();  // 로컬 스토리지에 저장
    renderCourseList(currentRoadmap.courses);  // 강좌 목록 다시 렌더링
  });

  // 모든 강좌 삭제 버튼 클릭 이벤트 핸들러
  deleteAllCoursesBtn.addEventListener('click', () => {
    const currentRoadmap = roadmaps.find(r => r.id === currentRoadmapId);  // 현재 로드맵 찾기
    currentRoadmap.courses = [];  // 강좌 목록 초기화
    saveRoadmapsToLocalStorage();  // 로컬 스토리지에 저장
    renderCourseList(currentRoadmap.courses);  // 강좌 목록 다시 렌더링
  });

  // 선택한 로드맵 삭제 버튼 클릭 이벤트 핸들러
  deleteSelectedRoadmapsBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#roadmaps input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
      const id = parseInt(checkbox.getAttribute('data-id'));
      roadmaps = roadmaps.filter(r => r.id !== id);  // 선택된 로드맵 삭제
    });
    saveRoadmapsToLocalStorage();  // 로컬 스토리지에 저장
    renderRoadmapList();  // 로드맵 목록 다시 렌더링
  });

  // 모든 로드맵 삭제 버튼 클릭 이벤트 핸들러
  deleteAllRoadmapsBtn.addEventListener('click', () => {
    roadmaps = [];  // 로드맵 목록 초기화
    saveRoadmapsToLocalStorage();  // 로컬 스토리지에 저장
    renderRoadmapList();  // 로드맵 목록 다시 렌더링
  });

  // 로드맵 보기 버튼 클릭 시 로드맵 상세 페이지로 이동하는 함수
  window.viewRoadmap = (id) => {
    currentRoadmapId = id;  // 현재 로드맵 ID 설정
    const currentRoadmap = roadmaps.find(r => r.id === id);  // 현재 로드맵 찾기
    renderCourseList(currentRoadmap.courses);  // 강좌 목록 렌더링
    roadmapDetailsSection.style.display = 'block';  // 로드맵 상세 섹션 보이기
    roadmapListSection.style.display = 'none';  // 로드맵 목록 섹션 숨기기
  };

  // 로드맵 삭제 버튼 클릭 시 로드맵을 삭제하는 함수
  window.deleteRoadmap = (id) => {
    roadmaps = roadmaps.filter(r => r.id !== id);  // 선택된 로드맵 삭제
    saveRoadmapsToLocalStorage();  // 로컬 스토리지에 저장
    renderRoadmapList();  // 로드맵 목록 다시 렌더링
  };

  // 강좌 삭제 버튼 클릭 시 강좌를 삭제하는 함수
  window.deleteCourse = (index) => {
    const currentRoadmap = roadmaps.find(r => r.id === currentRoadmapId);  // 현재 로드맵 찾기
    currentRoadmap.courses.splice(index, 1);  // 선택된 강좌 삭제
    saveRoadmapsToLocalStorage();  // 로컬 스토리지에 저장
    renderCourseList(currentRoadmap.courses);  // 강좌 목록 다시 렌더링
  };

  // 초기 로드맵 목록 렌더링
  renderRoadmapList();
});
