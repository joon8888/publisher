// 📌 필수: GSAP + ScrollTrigger 등록
gsap.registerPlugin(ScrollTrigger);

// 📌 Lenis 부드러운 스크롤 초기화
const lenis = new window.Lenis({
  smooth: true,
  lerp: 0.1,
  direction: 'vertical',
  gestureDirection: 'vertical',
  wheelMultiplier: 1,
  touchMultiplier: 1,
  normalizeWheel: true,
})

// 📌 Lenis가 ScrollTrigger에 가상 스크롤 위치 전달
ScrollTrigger.scrollerProxy(document.body, {
  scrollTop(value) {
    return arguments.length
      ? lenis.scrollTo(value, { immediate: true }) // 수동 설정 시
      : lenis.animatedScroll
  },
  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight
    }
  },
  pinType: document.body.style.transform ? 'transform' : 'fixed'
})

// 📌 Lenis 루프 실행 (requestAnimationFrame)
function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// 📌 Lenis가 스크롤하면 ScrollTrigger 갱신
lenis.on('scroll', ScrollTrigger.update)


// ✅ 기존 너가 만든 코드 부분 유지 (marquee)
gsap.utils.toArray('.fold__conts__item').forEach((el, index) => {
  const w = el.querySelector('.track');
  const [x, xEnd] = (index % 2 === 0) ? [-500, -1500] : [-500, 0];
  gsap.fromTo(w, { x }, {
    x: xEnd,
    scrollTrigger: {
      //trigger: el,
      scrub: 1,
      scroller: document.body,
    }
  });
});


// ✅ 기존 가상 스크롤 translateY → 제거됨 (Lenis가 스크롤 제어하므로 불필요)
// 하지만 네 구조에서 foldsContent 움직이는 연출이 필요하면 남겨도 돼!
const centerFold = document.querySelector('.fold--center');
const centerContent = centerFold?.querySelector('.fold--center .fold__conts');
const foldsContent = Array.from(document.querySelectorAll('.fold__conts'));

let targetScroll = 0;
let currentScroll = 0;

const tick = () => {
  const overflowHeight = centerContent.clientHeight - centerFold.clientHeight;
  document.body.style.height = `${overflowHeight + window.innerHeight}px`;

  targetScroll = -lenis.animatedScroll;
  currentScroll += (targetScroll - currentScroll) * 0.1;

  foldsContent.forEach(content => {
    content.style.transform = `translateY(${currentScroll}px)`;
  });

  ScrollTrigger.update();
  requestAnimationFrame(tick);
};
tick();


// ✅ 텍스트 요소 애니메이션 (backgroundSize 커지는 효과)
const textElements = gsap.utils.toArray('.text-scroll__align');

textElements.forEach(text => {
  gsap.to(text, {
    backgroundSize: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: text,
      start: 'center 70%',
      end: 'center 40%',
      scrub: true,
      scroller: document.body,
    },
  });
});

// ✅ ScrollTrigger 갱신
ScrollTrigger.refresh();


// 수평 스크롤용 핀 요소
const sectionPin = document.querySelector('.pin')

// 수평 스크롤 애니메이션 정의
const scrollTween = gsap.to(sectionPin, {
  scrollTrigger: {
    trigger: '.section--works',
    start: 'top top',
    end: () => "+=" + sectionPin.scrollWidth,
    scrub: 1,
    pin: true,
    anticipatePin: 1,
    scroller: document.body, // Lenis와 연동
    invalidateOnRefresh: true
  },
  x: () => -(sectionPin.scrollWidth - window.innerWidth),
  ease: "none"
});

const workSection = document.querySelector('.section--works');
const pinItemWorks = document.querySelectorAll('.pin__item--work');
const workView = document.querySelector('.work-view');
const closeWorkViewBtn = workView.querySelector('.work-view__close');

// 오픈 시 정보 전달
pinItemWorks.forEach(item => {
  item.addEventListener('click', () => {
    // 데이터 추출
    const title = item.querySelector('.work-text__title')?.textContent.trim() || '';
    const type = item.querySelector('.work-text__type')?.textContent.trim() || '';
    const period = item.querySelector('.work-text__period')?.textContent.trim() || '';
    const detailListItems = item.querySelectorAll('.work-text__detail li');
    const detailTexts = Array.from(detailListItems).map(li => li.textContent.trim());

    const image = item.querySelector('.pin__item__image');
    const imageSrc = image?.getAttribute('src') || '';
    const imageAlt = title;
    const workUrl = item.dataset.workUrl || '#';

    // work-view에 값 세팅
    workView.querySelector('.work-view__info__title').textContent = title;
    workView.querySelector('.work-view__info__category').textContent = type;
    workView.querySelector('.work-view__info__period').textContent = '~' + period;

    const detailContainer = workView.querySelector('.work-view__info__detail ul');
    detailContainer.innerHTML = ''; // 기존 내용 초기화
    detailTexts.forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      detailContainer.appendChild(li);
    });

    const link = workView.querySelector('.work-view__link');
    const previewImg = link.querySelector('img');
    link.setAttribute('href', workUrl);
    previewImg.setAttribute('src', imageSrc);
    previewImg.setAttribute('alt', imageAlt);

    // 활성화 처리
    pinItemWorks.forEach(el => el.classList.add('hidden'));
    lenis.stop();
    workView.closest('.work-view-wrap').classList.add('active');
    setTimeout(() => {
      workView.classList.add('active');
    }, 350);
  });
});

// 닫기 버튼 처리
closeWorkViewBtn.addEventListener('click', () => {
  pinItemWorks.forEach(el => el.classList.remove('hidden'));
  lenis.start();
  setTimeout(() => {
    workView.closest('.work-view-wrap').classList.remove('active');
  }, 600);
  workView.classList.remove('active');
});



const pinItemImages = workSection.querySelectorAll('.pin__item__image');
pinItemImages.forEach(img => {
  img.addEventListener('mouseover', () => {
    pinItemImages.forEach(other => {
      if(other !== img) other.closest('.pin__item').classList.add('zoom-in');
    })
    img.closest('.pin__item').classList.add('zoom-out');
  })
  img.addEventListener('mouseleave', () => {
    pinItemImages.forEach(other => {
      other.closest('.pin__item').classList.remove('zoom-in', 'zoom-out');
    })
  })
})

