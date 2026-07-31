document.addEventListener('DOMContentLoaded', () => {
  // CONFIG 데이터 확인
  const CONFIG = window.CONFIG || window.config || {};

  // --------------------------------------------------
  // 1. 우클릭 및 이미지 드래그 방지 (추가 보호)
  // --------------------------------------------------
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('dragstart', (e) => e.preventDefault());

  // --------------------------------------------------
  // 2. 초기 데이터 렌더링 (중복 방지 innerHTML = '' 적용)
  // --------------------------------------------------
  initCurtain();
  initHero();
  initGreeting();
  initCalendar();
  initStory();
  initGallery();
  initLocation();
  initAccount();
  initFooter();

  // --------------------------------------------------
  // 3. 기능별 모듈 초기화
  // --------------------------------------------------
  initCountdown();
  initPetalCanvas();
  initModal();
  initAccordion();
  initScrollAnimation();

  // ==================================================
  // 렌더링 함수 정의
  // ==================================================

  // [커튼 레이어]
  function initCurtain() {
    const curtainNames = document.getElementById('curtainNames');
    const curtainBtn = document.getElementById('curtainBtn');
    const curtain = document.getElementById('curtain');

    if (curtainNames && CONFIG.hero) {
      curtainNames.textContent = `${CONFIG.hero.groomName} & ${CONFIG.hero.brideName}`;
    }

    if (curtainBtn && curtain) {
      curtainBtn.addEventListener('click', () => {
        curtain.classList.add('curtain--open');
        setTimeout(() => {
          curtain.style.display = 'none';
        }, 1000);
      });
    }
  }

  // [메인 히어로 섹션]
  function initHero() {
    if (!CONFIG.hero) return;

    const heroPhoto = document.getElementById('heroPhoto');
    const heroNames = document.getElementById('heroNames');
    const heroDate = document.getElementById('heroDate');
    const heroVenue = document.getElementById('heroVenue');

    if (heroPhoto && CONFIG.hero.mainPhoto) heroPhoto.src = CONFIG.hero.mainPhoto;
    if (heroNames) heroNames.textContent = `${CONFIG.hero.groomName}  |  ${CONFIG.hero.brideName}`;
    if (heroDate) heroDate.textContent = CONFIG.hero.dateText || '';
    if (heroVenue) heroVenue.textContent = CONFIG.hero.venueText || '';
  }

  // [모시는 글 섹션]
  function initGreeting() {
    if (!CONFIG.greeting) return;

    const title = document.getElementById('greetingTitle');
    const content = document.getElementById('greetingContent');
    const parents = document.getElementById('greetingParents');

    if (title) title.textContent = CONFIG.greeting.title || '모시는 글';
    if (content) content.innerHTML = (CONFIG.greeting.content || '').replace(/\n/g, '<br>');
    if (parents && CONFIG.greeting.parents) {
      parents.innerHTML = CONFIG.greeting.parents.map(p => `<p>${p}</p>`).join('');
    }
  }

  // [달력 섹션]
  function initCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid || !CONFIG.weddingDate) return;

    calendarGrid.innerHTML = ''; // 중복 방지

    const weddingDate = new Date(CONFIG.weddingDate);
    const year = weddingDate.getFullYear();
    const month = weddingDate.getMonth();
    const targetDay = weddingDate.getDate();

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const table = document.createElement('table');
    table.className = 'calendar-table';

    let html = `<caption>${year}년 ${month + 1}월</caption>`;
    html += '<thead><tr><th>일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th>토</th></tr></thead><tbody><tr>';

    for (let i = 0; i < firstDay; i++) {
      html += '<td></td>';
    }

    for (let day = 1; day <= lastDate; day++) {
      const currentDay = (firstDay + day - 1) % 7;
      if (currentDay === 0 && day !== 1) html += '</tr><tr>';

      const isTarget = day === targetDay ? 'class="calendar__day--target"' : '';
      html += `<td ${isTarget}><span>${day}</span></td>`;
    }

    html += '</tr></tbody>';
    table.innerHTML = html;
    calendarGrid.appendChild(table);

    // 구글/애플 캘린더 링크 설정
    const googleBtn = document.getElementById('googleCalBtn');
    if (googleBtn && CONFIG.calendarLinks?.google) {
      googleBtn.href = CONFIG.calendarLinks.google;
    }
  }

  // [스토리 섹션]
  function initStory() {
    if (!CONFIG.story) return;

    const title = document.getElementById('storyTitle');
    const content = document.getElementById('storyContent');
    const photosContainer = document.getElementById('storyPhotos');

    if (title) title.textContent = CONFIG.story.title || '우리의 이야기';
    if (content) content.innerHTML = (CONFIG.story.content || '').replace(/\n/g, '<br>');

    if (photosContainer && Array.isArray(CONFIG.story.photos)) {
      photosContainer.innerHTML = ''; // 중복 방지
      CONFIG.story.photos.forEach((src, idx) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `스토리 사진 ${idx + 1}`;
        img.draggable = false;
        img.loading = 'lazy';
        photosContainer.appendChild(img);
      });
    }
  }

  // [갤러리 섹션]
  function initGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid || !Array.isArray(CONFIG.gallery)) return;

    galleryGrid.innerHTML = ''; // 중복 방지

    CONFIG.gallery.forEach((src, index) => {
      const item = document.createElement('div');
      item.className = 'gallery__item';
      
      const img = document.createElement('img');
      img.src = src;
      img.alt = `갤러리 사진 ${index + 1}`;
      img.draggable = false;
      img.loading = 'lazy';
      
      item.appendChild(img);
      item.addEventListener('click', () => openModal(index));
      galleryGrid.appendChild(item);
    });
  }

  // [오시는 길 섹션]
  function initLocation() {
    if (!CONFIG.location) return;

    const venue = document.getElementById('locationVenue');
    const hall = document.getElementById('locationHall');
    const address = document.getElementById('locationAddress');
    const tel = document.getElementById('locationTel');
    const mapImg = document.getElementById('locationMapImg');
    const copyBtn = document.getElementById('copyAddressBtn');
    const kakaoBtn = document.getElementById('kakaoMapBtn');
    const naverBtn = document.getElementById('naverMapBtn');

    if (venue) venue.textContent = CONFIG.location.venue || '';
    if (hall) hall.textContent = CONFIG.location.hall || '';
    if (address) address.textContent = CONFIG.location.address || '';
    if (tel) tel.textContent = CONFIG.location.tel ? `TEL. ${CONFIG.location.tel}` : '';
    if (mapImg && CONFIG.location.mapImage) mapImg.src = CONFIG.location.mapImage;

    if (kakaoBtn && CONFIG.location.kakaoMap) kakaoBtn.href = CONFIG.location.kakaoMap;
    if (naverBtn && CONFIG.location.naverMap) naverBtn.href = CONFIG.location.naverMap;

    if (copyBtn && CONFIG.location.address) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(CONFIG.location.address).then(() => {
          showToast('주소가 복사되었습니다.');
        }).catch(() => {
          showToast('주소 복사에 실패했습니다.');
        });
      });
    }
  }

  // [축의금 계좌 섹션]
  function initAccount() {
    if (!CONFIG.account) return;

    const groomList = document.getElementById('groomAccountList');
    const brideList = document.getElementById('brideAccountList');

    if (groomList && Array.isArray(CONFIG.account.groom)) {
      groomList.innerHTML = ''; // 중복 방지
      CONFIG.account.groom.forEach(acc => groomList.appendChild(createAccountItem(acc)));
    }

    if (brideList && Array.isArray(CONFIG.account.bride)) {
      brideList.innerHTML = ''; // 중복 방지
      CONFIG.account.bride.forEach(acc => brideList.appendChild(createAccountItem(acc)));
    }
  }

  function createAccountItem(acc) {
    const div = document.createElement('div');
    div.className = 'account__item';
    div.innerHTML = `
      <div class="account__info">
        <span class="account__name">${acc.relation} ${acc.name}</span>
        <span class="account__number">${acc.bank} ${acc.number}</span>
      </div>
      <button class="btn btn--small account__copy">복사</button>
    `;

    const copyBtn = div.querySelector('.account__copy');
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(`${acc.bank} ${acc.number}`).then(() => {
        showToast('계좌번호가 복사되었습니다.');
      });
    });

    return div;
  }

  // [푸터]
  function initFooter() {
    const footerText = document.getElementById('footerText');
    if (footerText && CONFIG.footerText) {
      footerText.textContent = CONFIG.footerText;
    }
  }

  // ==================================================
  // 기능 동작 함수
  // ==================================================

  // [카운트다운]
  function initCountdown() {
    if (!CONFIG.weddingDate) return;

    const label = document.getElementById('countdownLabel');
    const daysEl = document.getElementById('countDays');
    const hoursEl = document.getElementById('countHours');
    const minsEl = document.getElementById('countMinutes');
    const secsEl = document.getElementById('countSeconds');

    const targetDate = new Date(CONFIG.weddingDate).getTime();
    if (label && CONFIG.hero) {
      label.textContent = `${CONFIG.hero.groomName} ♥ ${CONFIG.hero.brideName}의 결혼식이`;
    }

    function update() {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        if (daysEl) daysEl.textContent = '0';
        if (hoursEl) hoursEl.textContent = '0';
        if (minsEl) minsEl.textContent = '0';
        if (secsEl) secsEl.textContent = '0';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = days;
      if (hoursEl) hoursEl.textContent = hours;
      if (minsEl) minsEl.textContent = mins;
      if (secsEl) secsEl.textContent = secs;
    }

    update();
    setInterval(update, 1000);
  }

  // [토스트 메시지]
  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('toast--show');

    setTimeout(() => {
      toast.classList.remove('toast--show');
    }, 2500);
  }

  // [사진 모달 Viewer]
  let currentModalIdx = 0;

  function initModal() {
    const modal = document.getElementById('photoModal');
    const closeBtn = document.getElementById('modalClose');
    const prevBtn = document.getElementById('modalPrev');
    const nextBtn = document.getElementById('modalNext');

    if (!modal) return;

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (prevBtn) prevBtn.addEventListener('click', () => navigateModal(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigateModal(1));

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.id === 'modalContainer') closeModal();
    });
  }

  function openModal(index) {
    if (!CONFIG.gallery || !CONFIG.gallery[index]) return;

    currentModalIdx = index;
    const modal = document.getElementById('photoModal');
    updateModalContent();
    modal.classList.add('photo-modal--open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const modal = document.getElementById('photoModal');
    if (modal) {
      modal.classList.remove('photo-modal--open');
      document.body.style.overflow = '';
    }
  }

  function navigateModal(direction) {
    if (!CONFIG.gallery) return;
    const total = CONFIG.gallery.length;
    currentModalIdx = (currentModalIdx + direction + total) % total;
    updateModalContent();
  }

  function updateModalContent() {
    const img = document.getElementById('modalImg');
    const counter = document.getElementById('modalCounter');

    if (img && CONFIG.gallery) img.src = CONFIG.gallery[currentModalIdx];
    if (counter && CONFIG.gallery) counter.textContent = `${currentModalIdx + 1} / ${CONFIG.gallery.length}`;
  }

  // [계좌번호 아코디언]
  function initAccordion() {
    const groomAcc = document.getElementById('groomAccordion');
    const brideAcc = document.getElementById('brideAccordion');

    if (groomAcc) {
      groomAcc.addEventListener('click', () => toggleAccordion('groomAccordion', 'groomAccordionPanel'));
    }
    if (brideAcc) {
      brideAcc.addEventListener('click', () => toggleAccordion('brideAccordion', 'brideAccordionPanel'));
    }
  }

  function toggleAccordion(btnId, panelId) {
    const btn = document.getElementById(btnId);
    const panel = document.getElementById(panelId);
    if (!btn || !panel) return;

    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !isExpanded);

    if (!isExpanded) {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    } else {
      panel.style.maxHeight = '0px';
    }
  }

  // [스크롤 애니메이션]
  function initScrollAnimation() {
    const animateItems = document.querySelectorAll('.animate-item');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-animated');
        }
      });
    }, { threshold: 0.15 });

    animateItems.forEach(item => observer.observe(item));
  }

  // [벚꽃 날림 캔버스 효과]
  function initPetalCanvas() {
    const canvas = document.getElementById('petalCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const numPetals = 25;
    const petals = Array.from({ length: numPetals }, () => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 8 + 6,
      speedX: Math.random() * 1.5 - 0.75,
      speedY: Math.random() * 1 + 0.8,
      opacity: Math.random() * 0.5 + 0.3,
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 2 - 1
    }));

    function draw() {
      ctx.clearRect(0, 0, width, height);

      petals.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = `rgba(255, 182, 193, ${p.opacity})`;

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
