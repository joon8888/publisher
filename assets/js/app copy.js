class SmoothScroll {
  constructor() {
    this.wrap = document.querySelector(".smooth-wrap");
    this.cont = this.wrap.querySelector(".smooth-cont");
    this.sections = this.wrap.querySelectorAll(".smooth-cont__section");
    this.scrollY = 0;
    this.ease = 0.1; // 부드러운 정도
    this.currentY = 0;
    this.isScrolling = true;
    this.scrub = 0.1; // GSAP scrub처럼 적용할 스크롤 보정 값
    this.stopPosition = 0; // 스크롤 멈출 위치
    this.horizontalActive = false;
    this.horizontalSection = null;
    this.hScrollCont = null;
    this.hScrollStart = 0;
    this.hScrollEnd = 0;
    this.hScrollAmount = 0;
    this.horizontalScrollX = 0;
    this.currentX = 0;

    if (!this.wrap || !this.cont || this.sections.length <= 0) return;
    this.init();
  }

  init() {
    this.updateScrollHeight();
    window.addEventListener("scroll", this.onScroll.bind(this));
    this.update();
  }

  updateScrollHeight() {
    let totalHeight = 0;
    this.sections.forEach((section) => {
      if (section.classList.contains("smooth-cont__section--horizontal")) {
        this.horizontalSection = section;
        this.hScrollCont = section.querySelector(".horizontal-cont");
        this.hScrollAmount = this.hScrollCont.scrollWidth - window.innerWidth;

        this.hScrollStart = totalHeight; // 가로 스크롤 시작점
        this.hScrollEnd = totalHeight + window.innerHeight; // 가로 스크롤 끝점
      }
      totalHeight += section.offsetHeight;
    });
    document.body.style.height = `${totalHeight}px`;
  }

  onScroll() {
    this.scrollY = window.scrollY;

    // 현재 위치가 가로 스크롤 섹션인지 체크
    if (
      this.horizontalSection &&
      this.scrollY >= this.hScrollStart &&
      this.scrollY < this.hScrollEnd
    ) {
      this.horizontalActive = true;
    } else {
      this.horizontalActive = false;
    }
  }

  // update() {
  //   if (!this.isScrolling) {
  //     this.cont.style.transform = `translate3d(0, ${-this.stopPosition}px, 0)`;
  //     return;
  //   }

  //   if (this.horizontalActive) {
  //     console.log('수평')
  //     let scrollProgress =
  //       (this.scrollY - this.hScrollStart) / (this.hScrollEnd - this.hScrollStart);
  //     scrollProgress = Math.min(Math.max(scrollProgress, 0), 1); // 0~1 사이 값 유지
  //     let targetX = scrollProgress * this.hScrollAmount;

  //     // 🎯 가로 스크롤을 부드럽게 이동 (기존 값에 scrub 적용)
  //     this.currentX += (targetX - this.currentX) * this.scrub;

  //     this.hScrollCont.style.transform = `translate3d(${-this.currentX}px, 0, 0)`;
  //     this.cont.style.transform = `translate3d(0, ${-this.hScrollStart}px, 0)`;
  //   } else {
  //     // 수직 스크롤 계산
  //     const diff = this.scrollY - this.currentY;
  //     if (Math.abs(diff) > 1) {
  //       this.currentY += diff * this.scrub;
  //     } else {
  //       this.currentY = this.scrollY;
  //     }

  //     this.cont.style.transform = `translate3d(0, ${-this.currentY}px, 0)`;
  //   }

  //   requestAnimationFrame(this.update.bind(this));
  // }

  update() {
    if (!this.isScrolling) {
      this.cont.style.transform = `translate3d(0, ${-this.stopPosition}px, 0)`;
      return;
    }
  
    if (this.horizontalActive) {
      console.log('수평')
      let scrollProgress =
        (this.scrollY - this.hScrollStart) / (this.hScrollEnd - this.hScrollStart);
      scrollProgress = Math.min(Math.max(scrollProgress, 0), 1); // 0~1 사이 값 유지
      let targetX = scrollProgress * this.hScrollAmount;
  
      // 🎯 가로 스크롤 부드럽게 이동
      this.currentX += (targetX - this.currentX) * this.scrub;
  
      this.hScrollCont.style.transform = `translate3d(${-this.currentX}px, 0, 0)`;
      this.cont.style.transform = `translate3d(0, ${-this.hScrollStart}px, 0)`;
    } else {
      // 🎯 가로 스크롤에서 세로 스크롤로 전환될 때 X 값 초기화
      if (this.currentX !== 0) {
        this.currentX = 0;
        this.hScrollCont.style.transform = `translate3d(0, 0, 0)`;
      }
  
      // 수직 스크롤 계산
      const diff = this.scrollY - this.currentY;
      if (Math.abs(diff) > 1) {
        this.currentY += diff * this.scrub;
      } else {
        this.currentY = this.scrollY;
      }
  
      this.cont.style.transform = `translate3d(0, ${-this.currentY}px, 0)`;
    }
  
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
