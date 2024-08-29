// document.addEventListener('DOMContentLoaded', () => {
//   // 페이지 로드 시 기본 콘텐츠를 로드합니다.
//   loadContent('/path/to/default/content.html');

//   // 링크 클릭 시 콘텐츠를 동적으로 로드합니다.
//   document.addEventListener('click', event => {
//       if (event.target.tagName === 'A' && event.target.href) {
//           event.preventDefault(); // 링크 기본 동작 방지
//           loadContent(new URL(event.target.href).pathname);
//       }
//   });
// });

// function loadContent(url) {
//   fetch(url)
//       .then(response => response.text())
//       .then(html => {
//           document.getElementById('main-content').innerHTML = html;
//       })
//       .catch(error => {
//           console.error('Error loading content:', error);
//       });
// }
