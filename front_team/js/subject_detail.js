document.addEventListener('DOMContentLoaded', function () {
  detail_category();
  innerText();
  modalEvent();
  sendReview();
  loadReviews();
  starEvent();
  reviewAverage();
  displayReviewPoints();
  filterAndDisplayReviews();
});

function detail_category(){
  var swiper = new Swiper(".mySwiper", {
    slidesPerView: 3,
    spaceBetween: 80,
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

function innerText() {
  // URL의 쿼리 파라미터를 분석하여 ID를 추출
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  
  // ID가 존재하는 경우에만 실행
  if (id) {
    // JSON 파일에서 데이터를 가져오기 위한 fetch 호출
    fetch('/json-server-exam/data.json')
      .then(response => response.json())  // 응답을 JSON 형식으로 파싱
      .then(data => {
        // 가져온 데이터에서 해당 ID와 일치하는 강의를 찾음
        const lecture = data.lecture.find(item => item.id === parseInt(id));
        
        // 해당 강의가 존재하는 경우
        if (lecture) {
          // HTML 요소를 선택하고 데이터를 업데이트
          document.querySelector('.sub_detail_title').textContent = lecture.title;
          document.querySelector('.sub_detail_sub_title').textContent = lecture.category;
          const subDetails = document.querySelectorAll('.sub_detail_sub');
          subDetails[0].textContent = lecture.date;
          subDetails[1].textContent = lecture.price;

          // 해당 강의의 리뷰 개수를 계산
          const reviewCount = data.review.filter(review => review.lectureId === parseInt(id)).length;
          
          // 리뷰 개수를 업데이트
          subDetails[2].textContent = `${reviewCount} reviews`;
          document.querySelector('.sub_in_title2_detail').textContent = lecture.text;
          document.querySelector('.sub_in_title2_detail > span').textContent = lecture.need;

          // 기존 이미지 태그를 교체하는 방식으로 이미지 추가
          const imgContainer = document.querySelector('#sub_detail_top');
          const existingImg = imgContainer.querySelector('img');
          
          if (existingImg) {
            // 기존 이미지가 있을 경우 제거
            imgContainer.removeChild(existingImg);
          }
          
          // 새로운 이미지 태그 생성 및 추가
          const img = document.createElement('img');
          img.alt = lecture.title;
          img.src = `/img/${lecture.subTitle}.png`;  // 이미지 URL을 subTitle을 기반으로 설정
          imgContainer.appendChild(img);

        } else {
          // 해당 ID에 대한 데이터를 찾을 수 없는 경우
          console.error('해당 ID에 대한 데이터를 찾을 수 없습니다.');
        }
      })
      .catch(error => console.error('데이터를 가져오는 중 오류가 발생했습니다:', error));
  } else {
    // URL에 ID 파라미터가 없는 경우
    console.error('ID 파라미터가 없습니다.');
  }
}


//===================================모달이벤트===============================

function modalEvent(){
  const modal1 = document.getElementById("reviewModal");
  const modal2 = document.getElementById("reviewModal2");
  const btn1 = document.getElementById("review_insert_btn");
  const btn2 = document.getElementById("review_more_btn");
  const span1 = document.getElementsByClassName("close1")[0];
  const span2 = document.getElementsByClassName("close2")[0];

  
  // 버튼 클릭 시 모달 열기
  btn1.onclick = function() {
    modal1.style.display = "block";
    gsap.set(modal1,{opacity:0, oncomplete:()=>{
      gsap.to(modal1,{opacity:1, duration: 0.5, ease : 'power1.out', oncomplete:()=>{
        gsap.set(modal1,{opacity:1})
      }})
    }})
  }

  // <span> 요소 클릭 시 모달 닫기
  span1.onclick = function() {
    gsap.set(modal1,{opacity:1, oncomplete:()=>{
      gsap.to(modal1,{opacity:0, duration: 0.5, ease : 'power1.out',oncomplete:()=>{
        modal1.style.display = "none";
      }})
      
    }})
    
    
  }

  // 모달 외부 클릭 시 모달 닫기
  window.onclick = function(event) {
    if (event.target == modal1) {
      gsap.set(modal1,{opacity:1, oncomplete:()=>{
        gsap.to(modal1,{opacity:0, duration: 0.5, ease : 'power1.out',oncomplete:()=>{
          modal1.style.display = "none";
        }})
        
      }})
      
    }
  }


  // ===============모달2=================
  btn2.onclick = function() {
    modal2.style.display = "block";
    gsap.set(modal2,{opacity:0, oncomplete:()=>{
      gsap.to(modal2,{opacity:1, duration: 0.5, ease : 'power1.out', oncomplete:()=>{
        gsap.set(modal2,{opacity:1})
      }})
    }})
  }

  // <span> 요소 클릭 시 모달 닫기
  span2.onclick = function() {
    gsap.set(modal2,{opacity:1, oncomplete:()=>{
      gsap.to(modal2,{opacity:0, duration: 0.5, ease : 'power1.out',oncomplete:()=>{
        modal2.style.display = "none";
      }})
      
    }})
    
    
  }

  // 모달 외부 클릭 시 모달 닫기
  window.onclick = function(event) {
    if (event.target == modal2) {
      gsap.set(modal2,{opacity:1, oncomplete:()=>{
        gsap.to(modal2,{opacity:0, duration: 0.5, ease : 'power1.out',oncomplete:()=>{
          modal2.style.display = "none";
        }})
        
      }})
      
    }
  }
}

// ==================================리뷰페이지=================================





//=================리뷰를 입력하면 보내는 함수
function sendReview() {
  // 'submitReview' 버튼 요소를 가져옴
  const submitBtn = document.getElementById("submitReview");
  if (!submitBtn) {
    return; // 버튼이 없으면 함수 종료
  }

  // 'submitReview' 버튼 클릭 시 실행될 함수 설정
  submitBtn.onclick = function(event) {
    event.preventDefault(); // 폼 제출의 기본 동작을 방지
    // 리뷰 텍스트 입력창의 값을 가져옴
    const reviewText = document.getElementById("reviewText").value;
    // URL의 쿼리 파라미터에서 'id' 값을 가져옴
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    // 리뷰 텍스트가 비어있지 않고 별점이 선택된 경우
    if (reviewText.trim() !== "" && selectedRating > 0) {
      // 리뷰 데이터 객체 생성
      const reviewData = {
        lectureId: parseInt(id), // 강의 ID
        review: reviewText, // 리뷰 텍스트
        rating: selectedRating, // 별점
        user: "익명의 사용자", // 사용자 이름 (익명)
        date: new Date().toISOString() // 현재 날짜와 시간 (ISO 형식)
      };

      // 리뷰 데이터를 서버로 POST 요청으로 전송
      fetch('http://localhost:3009/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // 요청 본문의 타입을 JSON으로 설정
        },
        body: JSON.stringify(reviewData) // 리뷰 데이터를 JSON 문자열로 변환하여 요청 본문에 포함
      })
      .then(response => response.json()) // 응답을 JSON으로 변환
      .then(data => {
        // 리뷰와 별점을 추가하는 함수 호출
        addReviewWithRating(reviewText, selectedRating);
        // 리뷰 입력창을 비움
        document.getElementById("reviewText").value = "";
        // 별점을 초기화
        selectedRating = 0;
        // 리뷰 모달 창을 닫음
        document.getElementById("reviewModal").style.display = "none";
      })
      .catch(error => {
        // 리뷰 저장 중 오류 발생 시 콘솔에 출력
        console.error('리뷰 저장 중 오류 발생:', error);
      });
    } else {
      // 리뷰 텍스트가 비어있거나 별점이 선택되지 않은 경우 경고창을 표시
      alert("리뷰를 작성하고 별점을 선택해주세요.");
    }
  }
}



// 리뷰 로드 및 별점 정보 표시
function loadReviews() {
  // URL의 쿼리 파라미터에서 'id' 값을 가져옴
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  if (id) {
    // JSON 서버에서 리뷰 데이터를 가져옴
    fetch('/json-server-exam/data.json')
      .then(response => response.json()) // 응답을 JSON으로 변환
      .then(data => {
        // 강의 ID와 일치하는 리뷰를 필터링
        const reviews = data.review.filter(review => review.lectureId === parseInt(id));

        if (reviews.length > 0) {
          // 리뷰가 있는 경우 각 리뷰를 화면에 추가
          reviews.forEach(review => addReviewWithRating(review.review, review.rating));
        } else {
          // 리뷰가 없는 경우 'no_review_text' 요소를 표시
          document.getElementById("no_review_text").style.display = "block";
        }

        // 리뷰 개수를 <p class="sub_detail_sub"> 요소에 추가
        const subDetails = document.querySelectorAll('.sub_detail_sub');
        if (subDetails.length > 2) {
          subDetails[2].textContent = `${reviews.length} reviews`;
        }
      })
      .catch(error => console.error('리뷰 데이터를 가져오는 중 오류가 발생했습니다:', error));
  }
}


// 리뷰를 추가하는 함수
function addReviewWithRating(reviewText, rating) {
  // 리뷰를 추가할 요소를 가져옴
  const reviewInsert = document.getElementById("review_insert");
  const reviewAllTxt = document.getElementById("review_all_txt");

  // 새로운 리뷰 요소 생성
  const newReview = document.createElement("div");
  newReview.className = "review_item";
  newReview.innerHTML = `
    <div id="review_text_wrap">
      <div id="review_text_user">
        <div></div>
        <p>익명의 사용자</p>
      </div>
      <div id="review_text_in">
        <div class="review-rating">
          ${createStarRating(rating)}
        </div>
        <p id="review_point">${rating}점</p>
        <p>${reviewText}</p>
      </div>
    </div>
  `;

  // 새로운 리뷰를 두 개의 다른 요소에 복사해서 추가
  const newReviewForInsert = newReview.cloneNode(true);
  const newReviewForAllTxt = newReview.cloneNode(true);

  // 리뷰를 각각의 요소에 추가 (가장 앞에 추가)
  reviewInsert.prepend(newReviewForInsert);
  reviewAllTxt.prepend(newReviewForAllTxt);
  
  // 최대 리뷰 개수를 설정하고 초과하는 경우 제거
  const maxReviews = 3;
  const reviews = reviewInsert.getElementsByClassName("review_item");
  while (reviews.length > maxReviews) {
    reviewInsert.removeChild(reviews[reviews.length - 1]);
  }

  // 리뷰가 추가되면 'no_review_text' 요소를 숨김
  const noReviewText = document.getElementById("no_review_text");
  if (noReviewText) {
    noReviewText.style.display = "none";
  }
}


// 별점 정보를 기반으로 별점 HTML을 생성하는 함수
function createStarRating(rating) {
  const totalStars = 5; // 총 별의 수
  let starsHtml = '';

  for (let i = 1; i <= totalStars; i++) {
    if (i <= rating) {
      starsHtml += `<i class="fa-solid fa-star"></i>`; // 선택된 별
    } else {
      starsHtml += `<i class="fa-regular fa-star"></i>`; // 선택되지 않은 별
    }
  }

  return starsHtml;
}


// 리뷰 별이벤트
function starEvent() {
  const buttons = document.querySelectorAll('.star-button');
  let currentRating = 0;

  buttons.forEach(button => {
    button.addEventListener('mouseover', () => {
      const value = parseInt(button.dataset.value);
      // Hover 상태에서 별점의 스타일을 업데이트합니다.
      buttons.forEach(btn => {
        if (parseInt(btn.dataset.value) <= value) {
          btn.querySelector('i').classList.remove('fa-regular');
          btn.querySelector('i').classList.add('fa-solid');
        } else {
          btn.querySelector('i').classList.remove('fa-solid');
          btn.querySelector('i').classList.add('fa-regular');
        }
      });
    });

    button.addEventListener('mouseout', () => {
      // Mouseout 상태에서 별점의 스타일을 복원합니다.
      buttons.forEach(btn => {
        if (parseInt(btn.dataset.value) <= selectedRating) {
          btn.querySelector('i').classList.remove('fa-regular');
          btn.querySelector('i').classList.add('fa-solid');
        } else {
          btn.querySelector('i').classList.remove('fa-solid');
          btn.querySelector('i').classList.add('fa-regular');
        }
      });
    });

    button.addEventListener('click', () => {
      selectedRating = parseInt(button.dataset.value);
      // 클릭 시 별점을 선택하고 업데이트합니다.
      buttons.forEach(btn => {
        if (parseInt(btn.dataset.value) <= selectedRating) {
          btn.querySelector('i').classList.remove('fa-regular');
          btn.querySelector('i').classList.add('fa-solid');
        } else {
          btn.querySelector('i').classList.remove('fa-solid');
          btn.querySelector('i').classList.add('fa-regular');
        }
      });
    });
  });
}


// ==================================리뷰페이지=================================

function reviewAverage() {
  // URL에서 ID 파라미터 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  // ID가 존재하는지 확인
  if (id) {
    // JSON 파일에서 데이터 가져오기
    fetch('/json-server-exam/data.json')
      .then(response => response.json())
      .then(data => {
        // review_point에서 해당 ID의 리뷰 찾기
        const review = data.review_point.find(item => item.id === parseInt(id));

      })
      .catch(error => console.error('데이터를 가져오는 도중 오류가 발생했습니다:', error));
  } else {
    console.error('ID 파라미터가 없습니다.');
  }
}


// ====================리뷰 섹션을 업데이트하는 함수================



function displayReviewPoints() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  if (id) {
    fetch('/json-server-exam/data.json')
      .then(response => response.json())
      .then(data => {
        console.log("Fetched Data:", data); // 데이터 확인용 로그
        
        // id를 정수로 변환
        const lectureId = parseInt(id);

        // lectureId에 맞는 리뷰 필터링
        const reviews = data.review.filter(item => item.lectureId === lectureId);

        // 별점별 리뷰 수 초기화
        const reviewCounts = {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0
        };

        // 리뷰 수 계산
        reviews.forEach(review => {
          reviewCounts[review.rating]++;
        });

        const totalReviews = reviewCounts[1] + reviewCounts[2] + reviewCounts[3] + reviewCounts[4] + reviewCounts[5];

        // 모든 프로그레스 바의 너비를 0%로 초기화
        document.querySelectorAll('#review_bar .progress-bar').forEach(bar => {
          bar.style.width = '0%';
        });

        if (totalReviews > 0) {
          // 각 별점에 대한 비율 계산
          const review5Percent = (reviewCounts[5] / totalReviews) * 100;
          const review4Percent = (reviewCounts[4] / totalReviews) * 100;
          const review3Percent = (reviewCounts[3] / totalReviews) * 100;
          const review2Percent = (reviewCounts[2] / totalReviews) * 100;
          const review1Percent = (reviewCounts[1] / totalReviews) * 100;

          // 각 프로그레스 바의 너비를 비율에 맞게 설정
          document.querySelector('#review_bar .progress-bar[aria-valuenow="5"]').style.width = `${review5Percent}%`;
          document.querySelector('#review_bar .progress-bar[aria-valuenow="4"]').style.width = `${review4Percent}%`;
          document.querySelector('#review_bar .progress-bar[aria-valuenow="3"]').style.width = `${review3Percent}%`;
          document.querySelector('#review_bar .progress-bar[aria-valuenow="2"]').style.width = `${review2Percent}%`;
          document.querySelector('#review_bar .progress-bar[aria-valuenow="1"]').style.width = `${review1Percent}%`;

          // 평균 별점 계산
          const avgRating = calculateAverageRating(reviewCounts);
          console.log("Average Rating:", avgRating); // 평균 별점 확인용 로그

          // 평균 별점을 페이지에 표시하는 부분
          document.querySelector('#review_point').innerHTML = `
            <p>평균 별점: ${avgRating}</p>
            <div class="stars">
              ${'<i class="fa fa-star"></i>'.repeat(Math.floor(avgRating))}
              ${avgRating % 1 !== 0 ? '<i class="fa fa-star-half-alt"></i>' : ''}
              ${'<i class="fa fa-star-o"></i>'.repeat(5 - Math.ceil(avgRating))}
            </div>
          `;

          // 리뷰 보여주기 및 검색창
          document.querySelector('#review_all_title').innerHTML = `
            <p>평균 별점: ${avgRating}</p>
            <div class="stars">
              ${'<i class="fa fa-star"></i>'.repeat(Math.floor(avgRating))}
              ${avgRating % 1 !== 0 ? '<i class="fa fa-star-half-alt"></i>' : ''}
              ${'<i class="fa fa-star-o"></i>'.repeat(5 - Math.ceil(avgRating))}
            </div>
            <p>리뷰 검색</p>
            <nav class="navbar navbar-light bg-light review_search">
              <div class="container-fluid">
                <form id="review-search-form" class="d-flex">
                  <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                  <button class="btn btn-outline-success" type="submit">Search</button>
                </form>
              </div>
            </nav>
            <div id="review_all_txt">
                <!-- 리뷰 항목이 동적으로 여기에 추가될 것입니다. -->
            </div>
            `;
          
        }
      })
      .catch(error => console.error('데이터를 가져오는 중 오류가 발생했습니다:', error));
  } else {
    console.error('ID 파라미터가 없습니다.');
  }
}

// 평균 별점을 계산하는 함수
function calculateAverageRating(reviewCounts) {
  const totalRatings = reviewCounts[1] + reviewCounts[2] + reviewCounts[3] + reviewCounts[4] + reviewCounts[5];
  const weightedSum = (reviewCounts[1] * 1) + (reviewCounts[2] * 2) + (reviewCounts[3] * 3) + (reviewCounts[4] * 4) + (reviewCounts[5] * 5);
  
  return totalRatings === 0 ? 0 : (weightedSum / totalRatings).toFixed(1);
}



//===================리뷰 서치=======================

function filterAndDisplayReviews() {
  const searchForm = document.querySelector('review-search button');
  const searchInput = document.querySelector('#review-search input');

  searchForm.addEventListener('submit', function(event) {
    event.preventDefault(); // 폼 제출의 기본 동작을 방지
    const searchTerm = searchInput.value.toLowerCase(); // 검색어를 소문자로 변환

    // 리뷰 데이터를 가져와서 필터링
    const reviews = Array.from(document.querySelectorAll('#review_all_txt .review_item'));

    reviews.forEach(review => {
      const reviewText = review.querySelector('#review_text_in p').textContent.toLowerCase();
      if (reviewText.includes(searchTerm)) {
        review.style.display = 'block'; // 검색어가 포함된 리뷰는 표시
      } else {
        review.style.display = 'none'; // 검색어가 포함되지 않은 리뷰는 숨김
      }
    });
  });
}







