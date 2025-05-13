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


// ==========================================
// ✅ 기존 너가 만든 코드 부분 유지 (marquee)
gsap.utils.toArray('.marquee').forEach((el, index) => {
  const w = el.querySelector('.track');
  const [x, xEnd] = (index % 2 == 0) ? [-500, -1500] : [-500, 0];
  gsap.fromTo(w, { x }, {
    x: xEnd,
    scrollTrigger: {
      trigger: el,
      scrub: 1,
      scroller: document.body, // Lenis와 연결됨
    }
  });
});

// ✅ 기존 가상 스크롤 translateY → 제거됨 (Lenis가 스크롤 제어하므로 불필요)
// 하지만 네 구조에서 foldsContent 움직이는 연출이 필요하면 남겨도 돼!
const centerContent = document.getElementById('center-content');
const centerFold = document.getElementById('center-fold');
const foldsContent = Array.from(document.querySelectorAll('.fold-content'));

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
const textElements = gsap.utils.toArray('.text');

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
const sectionPin = document.querySelector('#section_pin')

// 수평 스크롤 애니메이션 정의
const scrollTween = gsap.to(sectionPin, {
  scrollTrigger: {
    trigger: '#section_to-pin',
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

// 패럴럭스 이미지 개별 처리
const imageWrappers = sectionPin.querySelectorAll('.image_wrapper');
// imageWrappers.forEach(wrapper => {
//   const img = wrapper.querySelector('.image');
//   gsap.fromTo(img,
//     { x: "-20vw" },
//     {
//       x: "20vw",
//       scrollTrigger: {
//         trigger: wrapper,
//         containerAnimation: scrollTween,
//         start: "left right",
//         end: "right left",
//         scrub: true,
//         scroller: document.body,
//         invalidateOnRefresh: true
//       }
//     }
//   );
// });
