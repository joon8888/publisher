class SmoothScrolll {
  constructor () {
    this.wrap = document.querySelector('.smooth-cont');
    this.cont = this.wrap.querySelectorAll('.smooth-cont__section');
    this.scrollY = 0;
    this.ease = 0.1; // 부드러운 정도
    this.currentY = 0;
    this.isScrolling = true;
    this.init();
  }

  init () {
    if (! this.wrap) return;

    this.updateHeight();
    window.addEventListener("resize", this.updateHeight.bind(this));

    window.addEventListener("scroll", this.onScroll.bind(this));
    this.update();
  }

  updateHeight() {
    let totalHeight = 0;
    this.cont.forEach((cont) => {
      totalHeight += cont.offsetHeight;
    });
  
    
  // ✅ pin-wrap의 전체 너비만큼 높이를 추가
  let horizontalSection = document.querySelector(".pin-wrap");
  if (horizontalSection) {
    let horizontalWidth = horizontalSection.scrollWidth;
    totalHeight += horizontalWidth - window.innerWidth;
  }
  
    document.body.style.height = `${totalHeight}px`;
  }


  onScroll() {
    this.scrollY = window.scrollY;
  }

  update() {
    this.currentY += (this.scrollY - this.currentY) * this.ease;

    if (Math.abs(this.scrollY - this.currentY) < 0.01) {
      this.currentY = this.scrollY; 
    }
    
    if (this.isScrolling) {
      this.wrap.style.transform = `translate3d(0, ${-this.currentY}px, 0)`;
    }

    requestAnimationFrame(this.update.bind(this));
  }

}


class Ui {
  constructor () {
    this.init();
  }
  init () {
    this.smoothScroll = new SmoothScrolll();
  }
}

const app = new Ui();