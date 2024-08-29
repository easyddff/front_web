class Sidebar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' integrity='sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==' crossorigin='anonymous'/>
      <link rel="stylesheet" href="/sidebar/sidebar.css">
      <header>
        <form id="header_search"><input type="text"></form>
        <button id="bell"><i class="fa-solid fa-bell"></i></button>
        <button id="mail"><i class="fa-solid fa-envelope"></i></button>
        <button id="login">Login</button>
      </header>
      <section id="sidebar">
        <div id="title"><img src="/img/title.png"></div>
        <div id="user">
          <p></p>
        </div>
        <div id="side_menu">
          <p class="side_menu_title">Main</p>
          <ul class="main">
            <li class="selector"><i class="fa-solid fa-earth-americas"></i><a href="/user_main/user_main.html">HOME</a></li>
            <li><i class="fa-solid fa-chart-simple"></i><a href="/category/category.html">카테고리</a></li>
            <li>
              <i class="fa-solid fa-book"></i><a href="#">나의 강의실</a>
            </li>
            <li><i class="fa-solid fa-user"></i><a href="/my_page/my_page.html">마이 페이지</a></li>
            <li><i class="fa-solid fa-clipboard"></i><a href="#">수강 관리</a></li>
          </ul>
          <p class="side_menu_title">Short Cut</p>
          <ul class="main">
            <li><a href="#">공지사항</a></li>
            <li><a href="#">커뮤니티</a></li>
            <li><a href="/road_map/road_map.html">로드맵</a></li>
          </ul>
        </div>
      </section>
    `;
  }
}

customElements.define('sidebar-component', Sidebar);

document.addEventListener('DOMContentLoaded', () => {
  sidemenu();
  sidemenuClose();
  setupSearch();
  setupGoogleLogin();
});

function sidemenu() {
  const shadowRoot = document.querySelector('sidebar-component').shadowRoot;
  const menuItems = shadowRoot.querySelectorAll('ul.main > li');

  menuItems.forEach(item => {
    item.addEventListener('click', (event) => {
      event.stopPropagation();
      const currentItem = shadowRoot.querySelector('ul.main > li.selector');
      if (currentItem) {
        currentItem.classList.remove('selector');
        const openSubmenu = currentItem.querySelector('.side_menu_detail.open');
        if (openSubmenu) {
          openSubmenu.classList.remove('open');
        }
      }
      item.classList.add('selector');

      // 클릭된 메뉴 항목의 href 속성 값을 로컬 스토리지에 저장합니다.
      const href = item.querySelector('a').getAttribute('href');
      if (href) {
        localStorage.setItem('selectedMenu', href);
      }

      // 아코디언 메뉴 클릭 이벤트
      if (item.classList.contains('has-submenu')) {
        const submenu = item.querySelector('.side_menu_detail');
        submenu.classList.toggle('open');
      }
    });
  });

  // 로컬 스토리지에서 저장된 선택된 메뉴 항목을 불러와서 설정합니다.
  const selectedMenu = localStorage.getItem('selectedMenu');
  if (selectedMenu) {
    const selectedItem = Array.from(menuItems).find(item => {
      const link = item.querySelector('a');
      return link && link.getAttribute('href') === selectedMenu;
    });

    if (selectedItem) {
      const currentItem = shadowRoot.querySelector('ul.main > li.selector');
      if (currentItem) {
        currentItem.classList.remove('selector');
      }
      selectedItem.classList.add('selector');
    }
  }
}

function sidemenuClose() {
  const shadowRoot = document.querySelector('sidebar-component').shadowRoot;
  const closeButton = shadowRoot.querySelector('#side_close');
  const sidebar = shadowRoot.querySelector('#sidebar');
  const header = shadowRoot.querySelector('header');

  closeButton.addEventListener('click', () => {
    gsap.to(sidebar, { left: '-150px', duration: 0.5, ease: 'power1.out', onComplete: () => {
      gsap.set(sidebar, { left: '-150px' });
    }});
    gsap.to(header, { left: '100px', duration: 0.5, ease: 'power1.out' });
  });
}



// ====================상단 검색 페이지 이동=================
// 강의 데이터를 저장할 빈 배열 초기화
let lectures = [];

/**
 * JSON 파일에서 강의 데이터를 가져와서 성공적으로 데이터를 가져온 후 콜백 함수를 호출합니다.
 * @param {function} callback - 데이터를 가져온 후 호출할 함수.
 */
function fetchLectures(callback) {
  // 데이터를 가져오기 위해 새로운 XMLHttpRequest 객체 생성
  const dataPath = new XMLHttpRequest();
  dataPath.open('GET', '/json-server-exam/data.json', true);
  dataPath.onload = function() {
    if (dataPath.status >= 200 && dataPath.status < 400) {
      // 요청이 성공적일 경우 데이터를 파싱하여 lectures 배열에 저장
      const data = JSON.parse(dataPath.responseText);
      console.log('Loaded data:', data);  // 전체 데이터 로드 확인
      if (data.lecture && Array.isArray(data.lecture)) {
        lectures = data.lecture;
        callback();
      }
    } else {
      // 네트워크 상태가 좋지 않을 경우 콘솔에 오류 메시지 출력
      console.error('네트워크 상태가 좋지않습니다.');
    }
  };
  dataPath.send();
}

/**
 * 검색 폼을 설정하는 함수.
 * 사이드바 컴포넌트 내부에 있는 검색 폼에 이벤트 리스너를 추가합니다.
 */
function setupSearch() {
  // 사이드바 컴포넌트를 선택
  const sidebarComponent = document.querySelector('sidebar-component');
  if (!sidebarComponent) {
    return;
  }
  
  // 사이드바 컴포넌트의 Shadow DOM을 선택
  const shadowRoot = sidebarComponent.shadowRoot;
  if (!shadowRoot) {
    return;
  }
  
  // 검색 폼을 선택
  const searchForm = shadowRoot.querySelector('#header_search');
  if (!searchForm) {
    return;
  }

  // 검색 폼에 'submit' 이벤트 리스너를 추가
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = searchForm.querySelector('input').value.trim().toLowerCase();
    // 강의 데이터를 가져와서 검색 결과를 처리하는 함수 호출
    fetchLectures(() => {
      const results = searchLectures(query);
      handleSearchResults(results);
    });
  });
}

/**
 * 강의 데이터를 검색어와 비교하여 검색 결과를 반환합니다.
 * @param {string} query - 검색어.
 * @returns {array} 검색 결과 배열.
 */
function searchLectures(query) {
  // 검색어와 일치하는 강의를 필터링하여 결과 배열 생성
  const results = lectures.filter(lecture => 
    lecture.title.toLowerCase().includes(query)
  );
  console.log('Search query:', query);  // 검색어 확인
  console.log('Search results:', results);  // 검색 결과 확인
  return results;
}

/**
 * 검색 결과를 처리하는 함수.
 * @param {array} results - 검색 결과 배열.
 */
function handleSearchResults(results) {
  if (results.length === 1) {
    // 결과가 하나인 경우 해당 페이지로 바로 이동
    window.location.href = `/subject_detail/subject_detail.html?id=${results[0].id}`;
  } else if (results.length > 1) {
    // 결과가 여러 개인 경우 (여기서는 콘솔에 출력하도록 함)
    alert('검색 결과가 여러 개 있습니다. 상세한 검색이 필요합니다.');
  } else {
    // 결과가 없는 경우
    alert('검색 결과가 없습니다.');
  }
}

// 초기 설정 호출
setupSearch();


//=======================구글=======================

function setupGoogleLogin() {
  google.accounts.id.initialize({
    client_id: "YOUR_GOOGLE_CLIENT_ID",
    callback: handleCredentialResponse
  });
  google.accounts.id.renderButton(
    document.getElementById("buttonDiv"),
    { theme: "outline", size: "large" }  // customization attributes
  );
  google.accounts.id.prompt(); // also display the One Tap dialog
}

function handleCredentialResponse(response) {
  console.log("Encoded JWT ID token: " + response.credential);
}

