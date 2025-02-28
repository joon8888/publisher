class PinScreen {
  constructor () {
    this.wrap = document.querySelector('.pin-wrap');
    this.cont = this.wrap.querySelectorAll('.pin-cont');
    this.scrollY = 0;
    this.ease = 0.1; // 부드러운 정도
    this.currentY = 0;
    this.init();
  }

  init () {
    if (! this.wrap) return;
    let totalHeight = 0;

    // 모든 .pin-cont의 높이 합산
    this.cont.forEach((cont) => {
      totalHeight += cont.offsetHeight;
    });

    // body 높이를 .pin-cont들의 높이 합으로 설정
    document.body.style.height = `${totalHeight}px`;
    window.addEventListener("scroll", this.onScroll.bind(this));
    this.update();
  }

  onScroll() {
    this.scrollY = window.scrollY;
  }

  update() {
    this.currentY += (this.scrollY - this.currentY) * this.ease;

    if (Math.abs(this.scrollY - this.currentY) < 0.01) {
      this.currentY = this.scrollY; 
    }
    this.wrap.style.transform = `translate3d(0, ${-this.currentY}px, 0)`;

    requestAnimationFrame(this.update.bind(this));
  }

}

class Ui {
  constructor () {
    this.init();
  }
  init () {
    this.pinScreen = new PinScreen();
  }
}

const app = new Ui();