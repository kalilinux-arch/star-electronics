// Smooth scrolling implementation
document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.getElementById('navbar');

  function getNavbarHeight() {
    return navbar.offsetHeight;
  }

  function smoothScrollTo(targetPosition, duration = 800) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    requestAnimationFrame(animation);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const navbarHeight = getNavbarHeight();
        const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
        smoothScrollTo(targetPosition);
        history.pushState(null, null, targetId);
      }
    });
  });

  function handleHashNavigation() {
    const hash = window.location.hash;
    if (hash) {
      const targetSection = document.querySelector(hash);
      if (targetSection) {
        setTimeout(() => {
          const navbarHeight = getNavbarHeight();
          const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
          smoothScrollTo(targetPosition);
        }, 100);
      }
    }
  }

  handleHashNavigation();
  window.addEventListener('hashchange', handleHashNavigation);
  window.addEventListener('resize', function () {
    const hash = window.location.hash;
    if (hash) {
      const targetSection = document.querySelector(hash);
      if (targetSection) {
        const navbarHeight = getNavbarHeight();
        const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
        window.scrollTo(0, targetPosition);
      }
    }
  });
});

// Load affiliate products from Google Sheets
const sheetURL = 'https://script.google.com/macros/s/AKfycby86xlLE4vl_Tm63pc68v7O3tp-OBgvJOYOL97KCMlH9177OuRJWK3R_9CQgipNiZNW9Q/exec';

fetch(sheetURL)
  .then(res => res.json())
  .then(data => {
    let html = '';
    data.forEach(item => {
      html += `
        <div class="card">
          <img src="${item.Image}" alt="${item.Name}" style="width:100%; border-radius:8px; margin-bottom:1rem; object-fit:cover;">
          <h4>${item.Name}</h4>
          <p>Price: ${item.Price}</p>
          <a href="${item.Link}" target="_blank" style="color: var(--yellow); text-decoration: underline;">Buy Now</a>
        </div>
      `;
    });
    document.getElementById("product-list").innerHTML = html;
  })
  .catch(err => {
    document.getElementById("product-list").innerHTML = '<p>Error loading products.</p>';
    console.error(err);
  });
