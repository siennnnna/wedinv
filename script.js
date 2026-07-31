document.addEventListener('DOMContentLoaded', function () {
  var CONFIG = window.CONFIG || window.config || {};

  // 1. 우클릭 및 이미지 드래그 방지
  document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  document.addEventListener('dragstart', function (e) { e.preventDefault(); });

  // 2. 초기 데이터 렌더링
  initCurtain();
  initHero();
  initGreeting();
  initCalendar();
  initStory();
  initGallery();
  initLocation();
  initAccount();
  initFooter();

  // 3. 기능 초기화
  initCountdown();
  initPetalCanvas();
  initModal();
  initAccordion();
  initScrollAnimation();

  // ----- 렌더링 함수 -----
  function initCurtain() {
    var curtainNames = document.getElementById('curtainNames');
    var curtainBtn = document.getElementById('curtainBtn');
    var curtain = document.getElementById('curtain');

    if (curtainNames && CONFIG.hero) {
      curtainNames.textContent = CONFIG.hero.groomName + ' & ' + CONFIG.hero.brideName;
    }

    if (curtainBtn && curtain) {
      curtainBtn.addEventListener('click', function () {
        curtain.classList.add('curtain--open');
        setTimeout(function () { curtain.style.display = 'none'; }, 1000);
      });
    }
  }

  function initHero() {
    if (!CONFIG.hero) return;
    var heroPhoto = document.getElementById('heroPhoto');
    var heroNames = document.getElementById('heroNames');
    var heroDate = document.getElementById('heroDate');
    var heroVenue = document.getElementById('heroVenue');

    if (heroPhoto && CONFIG.hero.mainPhoto) heroPhoto.src = CONFIG.hero.mainPhoto;
    if (heroNames) heroNames.textContent = CONFIG.hero.groomName + '  |  ' + CONFIG.hero.brideName;
    if (heroDate) heroDate.textContent = CONFIG.hero.dateText || '';
    if (heroVenue) heroVenue.textContent = CONFIG.hero.venueText || '';
  }

  function initGreeting() {
    if (!CONFIG.greeting) return;
    var title = document.getElementById('greetingTitle');
    var content = document.getElementById('greetingContent');
    var parents = document.getElementById('greetingParents');

    if (title) title.textContent = CONFIG.greeting.title || '모시는 글';
    if (content) content.innerHTML = (CONFIG.greeting.content || '').replace(/\n/g, '<br>');
    if (parents && CONFIG.greeting.parents) {
      parents.innerHTML = CONFIG.greeting.parents.map(function (p) { return '<p>' + p + '</p>'; }).join('');
    }
  }

  function initCalendar() {
    var calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid || !CONFIG.weddingDate) return;

    calendarGrid.innerHTML = '';

    var weddingDate = new Date(CONFIG.weddingDate);
    var year = weddingDate.getFullYear();
    var month = weddingDate.getMonth();
    var targetDay = weddingDate.getDate();

    var firstDay = new Date(year, month, 1).getDay();
    var lastDate = new Date(year, month + 1, 0).getDate();

    var table = document.createElement('table');
    table.className = 'calendar-table';

    var html = '<caption>' + year + '년 ' + (month + 1) + '월</caption>';
    html += '<thead><tr><th>일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th>토</th></tr></thead><tbody><tr>';

    for (var i = 0; i < firstDay; i++) {
      html += '<td></td>';
    }

    for (var day = 1; day <= lastDate; day++) {
      var currentDay = (firstDay + day - 1) % 7;
      if (currentDay === 0 && day !== 1) html += '</tr><tr>';

      var isTarget = day === targetDay ? 'class="calendar__day--target"' : '';
      html += '<td ' + isTarget + '><span>' + day + '</span></td>';
    }

    html += '</tr></tbody>';
    table.innerHTML = html;
    calendarGrid.appendChild(table);

    var googleBtn = document.getElementById('googleCalBtn');
    if (googleBtn && CONFIG.calendarLinks && CONFIG.calendarLinks.google) {
      googleBtn.href = CONFIG.calendarLinks.google;
    }
  }

  function initStory() {
    if (!CONFIG.story) return;
    var title = document.getElementById('storyTitle');
    var content = document.getElementById('storyContent');
    var photosContainer = document.getElementById('storyPhotos');

    if (title) title.textContent = CONFIG.story.title || '우리의 이야기';
    if (content) content.innerHTML = (CONFIG.story.content || '').replace(/\n/g, '<br>');

    if (photosContainer && Array.isArray(CONFIG.story.photos)) {
      photosContainer.innerHTML = '';
      CONFIG.story.photos.slice(0, 4).forEach(function (src, idx) {
        var wrapper = document.createElement('div');
        wrapper.className = 'story__photo-wrapper';

        var img = document.createElement('img');
        img.src = src;
        img.alt = '스토리 사진 ' + (idx + 1);
        img.draggable = false;
        img.loading = 'lazy';

        wrapper.appendChild(img);
        photosContainer.appendChild(wrapper);
      });
    }
  }

  function initGallery() {
    var galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid || !Array.isArray(CONFIG.gallery)) return;

    galleryGrid.innerHTML = '';

    CONFIG.gallery.forEach(function (src, index) {
      var item = document.createElement('div');
      item.className = 'gallery__item';

      var img = document.createElement('img');
      img.src = src;
      img.alt = '갤러리 사진 ' + (index + 1);
      img.draggable = false;
      img.loading = 'lazy';

      item.appendChild(img);
      item.addEventListener('click', function () { openModal(index); });
      galleryGrid.appendChild(item);
    });
  }

  function initLocation() {
    if (!CONFIG.location) return;

    var venue = document.getElementById('locationVenue');
    var hall = document.getElementById('locationHall');
    var address = document.getElementById('locationAddress');
    var tel = document.getElementById('locationTel');
    var mapImg = document.getElementById('locationMapImg');
    var copyBtn = document.getElementById('copyAddressBtn');
    var kakaoBtn = document.getElementById('kakaoMapBtn');
    var naverBtn = document.getElementById('naverMapBtn');

    if (venue) venue.textContent = CONFIG.location.venue || '';
    if (hall) hall.textContent = CONFIG.location.hall || '';
    if (address) address.textContent = CONFIG.location.address || '';
    if (tel) tel.textContent = CONFIG.location.tel ? 'TEL. ' + CONFIG.location.tel : '';
    if (mapImg && CONFIG.location.mapImage) mapImg.src = CONFIG.location.mapImage;

    if (kakaoBtn && CONFIG.location.kakaoMap) kakaoBtn.href = CONFIG.location.kakaoMap;
    if (naverBtn && CONFIG.location.naverMap) naverBtn.href = CONFIG.location.naverMap;

    if (copyBtn && CONFIG.location.address) {
      copyBtn.addEventListener('click', function () {
        navigator.clipboard.writeText(CONFIG.location.address).then(function () {
          showToast('주소가 복사되었습니다.');
        });
      });
    }
  }

  function initAccount() {
    if (!CONFIG.account) return;

    var groomList = document.getElementById('groomAccountList');
    var brideList = document.getElementById('brideAccountList');

    if (groomList && Array.isArray(CONFIG.account.groom)) {
      groomList.innerHTML = '';
      CONFIG.account.groom.forEach(function (acc) { groomList.appendChild(createAccountItem(acc)); });
    }

    if (brideList && Array.isArray(CONFIG.account.bride)) {
      brideList.innerHTML = '';
      CONFIG.account.bride.forEach(function (acc) { brideList.appendChild(createAccountItem(acc)); });
    }
  }

  function createAccountItem(acc) {
    var div = document.createElement('div');
    div.className = 'account__item';
    div.innerHTML = `
      <div class="account__info">
        <span class="account__name">${acc.relation} ${acc.name}</span>
        <span class="account__number">${acc.bank} ${acc.number}</span>
      </div>
      <button class="btn account__copy">복사</button>
    `;

    var copyBtn = div.querySelector('.account__copy');
    copyBtn.addEventListener('click', function () {
      navigator.clipboard.writeText(acc.bank + ' ' + acc.number).then(function () {
        showToast('계좌번호가 복사되었습니다.');
      });
    });

    return div;
  }

  function initFooter() {
    var footerText = document.getElementById('footerText');
    if (footerText && CONFIG.footerText) {
      footerText.textContent = CONFIG.footerText;
    }
  }

  // ----- 기능 동작 -----
  function initCountdown() {
    if (!CONFIG.weddingDate) return;

    var label = document.getElementById('countdownLabel');
    var daysEl = document.getElementById('countDays');
    var hoursEl = document.getElementById('countHours');
    var minsEl = document.getElementById('countMinutes');
    var secsEl = document.getElementById('countSeconds');

    var targetDate = new Date(CONFIG.weddingDate).getTime();
    if (label && CONFIG.hero) {
      label.textContent = CONFIG.hero.groomName + ' ♥ ' + CONFIG.hero.brideName + '의 결혼식이';
    }

    function update() {
      var now = new Date().getTime();
      var diff = targetDate - now;

      if (diff <= 0) {
        if (daysEl) daysEl.textContent = '0';
        if (hoursEl) hoursEl.textContent = '0';
        if (minsEl) minsEl.textContent = '0';
        if (secsEl) secsEl.textContent = '0';
        return;
      }

      var days = Math.floor(diff / (1000 * 60 * 60 * 24));
      var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var secs = Math.floor((diff % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = days;
      if (hoursEl) hoursEl.textContent = hours;
      if (minsEl) minsEl.textContent = mins;
      if (secsEl) secsEl.textContent = secs;
    }

    update();
    setInterval(update, 1000);
  }

  function showToast(message) {
    var toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('toast--show');

    setTimeout(function () {
      toast.classList.remove('toast--show');
    }, 2500);
  }

  var currentModalIdx = 0;

  function initModal() {
    var modal = document.getElementById('photoModal');
    var closeBtn = document.getElementById('modalClose');
    var prevBtn = document.getElementById('modalPrev');
    var nextBtn = document.getElementById('modalNext');

    if (!modal) return;

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (prevBtn) prevBtn.addEventListener('click', function () { navigateModal(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { navigateModal(1); });

    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.id === 'modalContainer') closeModal();
    });
  }

  function openModal(index) {
    if (!CONFIG.gallery || !CONFIG.gallery[index]) return;

    currentModalIdx = index;
    var modal = document.getElementById('photoModal');
    updateModalContent();
    modal.classList.add('photo-modal--open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    var modal = document.getElementById('photoModal');
    if (modal) {
      modal.classList.remove('photo-modal--open');
      document.body.style.overflow = '';
    }
  }

  function navigateModal(direction) {
    if (!CONFIG.gallery) return;
    var total = CONFIG.gallery.length;
    currentModalIdx = (currentModalIdx + direction + total) % total;
    updateModalContent();
  }

  function updateModalContent() {
    var img = document.getElementById('modalImg');
    var counter = document.getElementById('modalCounter');

    if (img && CONFIG.gallery) img.src = CONFIG.gallery[currentModalIdx];
    if (counter && CONFIG.gallery) counter.textContent = (currentModalIdx + 1) + ' / ' + CONFIG.gallery.length;
  }

  function initAccordion() {
    var groomAcc = document.getElementById('groomAccordion');
    var brideAcc = document.getElementById('brideAccordion');

    if (groomAcc) {
      groomAcc.addEventListener('click', function () { toggleAccordion('groomAccordion', 'groomAccordionPanel'); });
    }
    if (brideAcc) {
      brideAcc.addEventListener('click', function () { toggleAccordion('brideAccordion', 'brideAccordionPanel'); });
    }
  }

  function toggleAccordion(btnId, panelId) {
    var btn = document.getElementById(btnId);
    var panel = document.getElementById(panelId);
    if (!btn || !panel) return;

    var isExpanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !isExpanded);

    if (!isExpanded) {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    } else {
      panel.style.maxHeight = '0px';
    }
  }

  function initScrollAnimation() {
    var animateItems = document.querySelectorAll('.animate-item');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-animated');
        }
      });
    }, { threshold: 0.15 });

    animateItems.forEach(function (item) { observer.observe(item); });
  }

  function initPetalCanvas() {
    var canvas = document.getElementById('petalCanvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var width = (canvas.width = window.innerWidth);
    var height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', function () {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    var numPetals = 25;
    var petals = Array.from({ length: numPetals }, function () {
      return {
        x: Math.random() * width,
        y: Math.random() * height - height,
        size: Math.random() * 8 + 6,
        speedX: Math.random() * 1.5 - 0.75,
        speedY: Math.random() * 1 + 0.8,
        opacity: Math.random() * 0.5 + 0.3,
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 2 - 1
      };
    });

    function draw() {
      ctx.clearRect(0, 0, width, height);

      petals.forEach(function (p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = 'rgba(255, 182, 193, ' + p.opacity + ')';

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-p.size, -p.size, -p.size, p.size, 0, p.size);
        ctx.bezierCurveTo(p.size, p.size, p.size, -p.size, 0, 0);
        ctx.fill();
        ctx.restore();

        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
        }
      });

      requestAnimationFrame(draw);
    }

    draw();
  }
});
