class HorizontalScroll {
  constructor() {
    this.wrap = document.querySelector('.horizontal-wrap');
    this.cont = this.wrap.querySelector('.horizontal-cont');
    this.sections = [...this.wrap.querySelectorAll('.horizontal-cont__section')];
    this.scrollX = 0;
    this.currentX = 0;
    this.scrollFactor = 0.05; // 🎯 휠 감도 조절
    this.maxDelta = 5; // 🎯 한 번의 휠 스크롤 최대 이동 제한 (%)
    this.maxScroll = 0;
    this.sectionCount = this.sections.length;
    this.ease = 0.06; // 🎯 부드러운 정도

    if (!this.wrap || !this.cont || this.sections.length <= 0) return;
    this.init();
  }

  init() {
    this.setScrollData();
    window.addEventListener("wheel", this.onScroll.bind(this), { passive: false });
    this.update();
  }

  setScrollData() {
    this.maxScroll = 100 * (this.sectionCount - 1); // X축 이동 범위 (%)
  }

  onScroll(e) {
    e.preventDefault();
    let delta = e.deltaY * this.scrollFactor; // 🎯 감도 조절
    delta = Math.max(-this.maxDelta, Math.min(this.maxDelta, delta)); // 🎯 최대 이동량 제한
    this.scrollX += delta;
    this.scrollX = Math.max(0, Math.min(this.scrollX, this.maxScroll)); // 🎯 범위 제한
  }

  update() {
    this.currentX += (this.scrollX - this.currentX) * this.ease;

    // 🎯 오차 보정: 차이가 0.1 이하일 경우, 강제로 멈춤
    if (Math.abs(this.scrollX - this.currentX) < 0.1) {
      this.currentX = this.scrollX;
    }

    const progress = this.currentX / this.maxScroll; // 진행률 (0 ~ 1)

    // 🎯 X축 이동 → 모든 섹션이 % 단위로 움직이도록 변경
    this.sections.forEach((section, index) => {
      const sectionProgress = progress * this.maxScroll; // 개별 섹션의 이동 %
      const translateX = -sectionProgress; // 🎯 % 단위로 이동
      section.style.transform = `translate3d(${translateX}%, 0, 0)`;
    });

    requestAnimationFrame(this.update.bind(this));
  }
}


class SmoothScroll {
  constructor () {
    this.wrap = document.querySelector('.smooth-wrap');
    this.cont = this.wrap.querySelector('.smooth-cont');
    this.sections = this.wrap.querySelectorAll('.smooth-cont__section');
    this.scrollY = 0;
    this.ease = 0.1; // 부드러운 정도
    this.currentY = 0;
    this.isScrolling = true;
    this.observer = null;
    this.lastIntersected = null; // 마지막으로 감지된 섹션
    this.scrub = 0.1; // GSAP scrub처럼 적용할 스크롤 보정 값
    this.stopPosition = 0; // 스크롤 멈출 위치
    this.horizontalActive = false;

    if (!this.wrap || !this.cont || this.sections.length <= 0) return;
    this.init();
  }

  init () {
    this.updateScrollHeight();
    this.setupObserver();
    window.addEventListener("scroll", this.onScroll.bind(this));
    this.update(); 
  }
  
  updateScrollHeight () {
    let totalHeight = 0;
    this.sections.forEach(section => {
      if(section.classList.contains('smooth-cont__section--horizontal')) {
        const hScrollCont = section.querySelector('.horizontal-cont');
        totalHeight += hScrollCont.scrollWidth - window.innerWidth;
      } else {
        totalHeight += section.offsetHeight
      }
    });
    document.body.style.height = `${totalHeight}px`;
  }

  setupObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = entry.target;
          // if (entry.isIntersecting) {
          //   console.log(`✅ [IN] ${section.dataset.section}이 뷰포트 상단에 맞닿음!`);
          //   this.lastIntersected = section.dataset.section;
          // } else {
          //   console.log(`❌ [OUT] ${section.dataset.section}이 뷰포트를 벗어남!`);
          //   if(section.classList.contains('smooth-cont__section-1')){
          //   this.isScrolling = false;
          //   }
          // }
          if (!entry.isIntersecting && section.classList.contains('smooth-cont__section-1')) {
            console.log(`❌ [OUT] 첫 번째 섹션 벗어남 → 스크롤 멈춤!`);
            this.stopPosition = section.offsetHeight;
            this.isScrolling = false;
            document.body.style.overflow = 'hidden';
            window.scrollTo(0, this.stopPosition);
            this.currentY = this.stopPosition;
          }
          if (entry.isIntersecting && section.classList.contains('smooth-cont__section--horizontal')) {
            console.log(`📌 [HORIZONTAL] 수평 스크롤 시작!`);
            this.horizontalActive = true;
            new HorizontalScroll();
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -99% 0px",
        threshold: 0.0,
      }
    );

    this.sections.forEach((section, index) => {
      section.dataset.section = `Section-${index + 1}`;
      this.observer.observe(section);
    });
  }

  onScroll () {
    this.scrollY = window.scrollY;
  }

  update () {
    // // 🎯 GSAP scrub처럼 보정 (이징 차이가 클 경우 보정)
    // const diff = this.scrollY - this.currentY;
    // if (Math.abs(diff) > 1) {
    //   this.currentY += diff * this.scrub; // scrub 값 적용
    // } else {
    //   this.currentY = this.scrollY; // 거의 멈췄다면 강제 보정
    // }

    // // 🎯 getBoundingClientRect() 활용 → 정확한 위치 감지
    // // this.sections.forEach((section) => {
    // //   const rect = section.getBoundingClientRect();

    // //   if (Math.abs(rect.top) < 1) {
    // //     if (this.lastIntersected !== section.dataset.section) {
    // //       console.log(`🎯 [FORCE DETECT] ${section.dataset.section}이 뷰포트 상단에 맞닿음!`);
    // //       this.lastIntersected = section.dataset.section;
    // //     }
    // //   }
    // // });

    // if (this.isScrolling) this.cont.style.transform = `translate3d(0, ${-this.currentY}px, 0)`;
    // requestAnimationFrame(this.update.bind(this));

    if (!this.isScrolling) {
      this.cont.style.transform = `translate3d(0, ${-this.stopPosition}px, 0)`;
      return; // 🎯 멈춘 상태에서는 transform 변경 안 함
    }

    // 🎯 GSAP scrub처럼 보정 (이징 차이가 클 경우 보정)
    const diff = this.scrollY - this.currentY;
    if (Math.abs(diff) > 1) {
      this.currentY += diff * this.scrub; // scrub 값 적용
    } else {
      this.currentY = this.scrollY; // 거의 멈췄다면 강제 보정
    }

    this.cont.style.transform = `translate3d(0, ${-this.currentY}px, 0)`;
    requestAnimationFrame(this.update.bind(this));
  }
  
}

class Ui {
  constructor () {
    this.init();
  }
  init () {
    this.smoothScroll = new SmoothScroll();
  }
}

const app = new Ui();
