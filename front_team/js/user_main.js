document.addEventListener('DOMContentLoaded', function () {
  
  // advice();
  initializeSwiper();
  user_new();
  // initSwiper();
});

// Swiper를 초기화하고 슬라이드를 추가하는 함수
function initializeSwiper() {
  // JSON 데이터 가져오기
  fetch('/json-server-exam/data.json')
    .then(response => response.json())
    .then(data => {
      const lectures = data.lecture;
      const swiperWrapper = document.querySelector('.advice_swiper_inner');

      // 처음 5개 데이터만 처리
      const numberOfSlides = 5;
      const lecturesToShow = lectures.slice(0, numberOfSlides);

      // JSON 데이터로부터 슬라이드 생성
      lecturesToShow.forEach(lecture => {
        const slide = document.createElement('div');

        slide.classList.add('swiper-slide', 'advice_swiper_list');
        
        slide.innerHTML = `
          <img src="${lecture.img}" alt="${lecture.title}">
          <div class="user_top_txtbox">
            <p class="user_top_txt1">${lecture.title}</p>
            <p class="user_top_txt2">${lecture.category}</p>
            <p class="user_top_txt3">${lecture.date}</p>
            <p class="user_top_txt3">${lecture.price}</p>
            <button>
              <a href="/subject_detail/subject_detail.html?id=${lecture.id}">바로가기</a>
            </button>
          </div>
        `;
        
        swiperWrapper.appendChild(slide);
      });

      // Swiper 초기화
      const swiper = new Swiper('.advice_swiper', {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        loop: true,
        coverflowEffect: {
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 5,
          slideShadows: false,
        },
        pagination: {
          el: ".swiper-pagination",
        },
        navigation: {
          nextEl: ".swiper-button-next-1",
          prevEl: ".swiper-button-prev-1"
        },
        on: {
          autoplayTimeLeft(s, time, progress) {
            progressCircle.style.setProperty("--progress", 1 - progress);
            progressContent.textContent = `${Math.ceil(time / 1000)}s`;
          }
        }
      });
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}




function user_new() {
  fetch('/json-server-exam/data.json')  // 실제 JSON 파일 경로로 교체
  .then(response => response.json())
  .then(data => {
    const userNewList = document.getElementById('user_new_list');
    userNewList.innerHTML = '';  // 기존 내용을 지움

    data.lecture.forEach(lecture => {
      const li = document.createElement('li');
      li.classList.add('swiper-slide');

      const a = document.createElement('a');
      a.href = `/subject_detail/subject_detail.html?id=${lecture.id}`;  // id를 동적으로 설정

      const img = document.createElement('img');
      img.alt = lecture.title;
      img.src = `/img/${lecture.subTitle}.png`;

      const dateDiv = document.createElement('div');
      dateDiv.classList.add('user_new_date');
      dateDiv.textContent = lecture.date;

      const titleP = document.createElement('p');
      titleP.classList.add('user_new_title');
      titleP.textContent = lecture.title;

      const priceP = document.createElement('p');
      priceP.classList.add('user_new_price');
      priceP.textContent = lecture.price;

      a.appendChild(img);
      a.appendChild(titleP);
      a.appendChild(dateDiv);
      a.appendChild(priceP);
      li.appendChild(a);
      userNewList.appendChild(li);
    });

    // Swiper 인스턴스 재설정
    setTimeout(initSwiper, 0); // 데이터 추가 후 짧은 지연을 주어 Swiper 초기화
  })
  .catch(error => console.error('Error fetching data:', error));
}

function initSwiper() {
  new Swiper(".mySwiper", {
    slidesPerView: 5,
    spaceBetween: 30,
    loop: true,
    pagination: {
      el: ".user-new-swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
}



