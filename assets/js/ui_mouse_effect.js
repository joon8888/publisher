window.CursorEffect = class {
  constructor(userOptions) {
    const defaultOptions = {
      enableSmoothing: false,
      smoothingSpeed: 0.1,
      hideDefaultCursor: false,
      enableHoverEffect: false,
    };
    this.options = Object.assign({}, defaultOptions, userOptions || {});
    this.cursor = null;
    this.pageX = 0;
    this.pageY = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.init();
  }

  init() {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return; // 모바일 제외

    this.createCursorEl();
    if (!this.options.hideDefaultCursor) this.cursorStyleHandler();
    this.moveCursorEvent();
    if (this.options.enableHoverEffect) this.changeCursorEvent();
  }

  createCursorEl() {
    this.cursor = document.createElement('div');
    this.cursor.id = 'cursor';
    document.body.appendChild(this.cursor);

    const cursorItem = document.createElement('div');
    cursorItem.classList.add('cursor__item');
    this.cursor.appendChild(cursorItem);

    const cursorText = document.createElement('p');
    cursorText.classList.add('cursor__item__text');
    cursorItem.appendChild(cursorText);
  }

  moveCursorEvent() {
    window.addEventListener('mousemove', (e) => {
      this.pageX = e.clientX;
      this.pageY = e.clientY;
    });

    const loop = this.options.enableSmoothing
      ? this.smoothLoop.bind(this)
      : this.instantLoop.bind(this);
    loop();
  }

  smoothLoop() {
    const animate = () => {
      this.targetX += (this.pageX - this.targetX) * this.options.smoothingSpeed;
      this.targetY += (this.pageY - this.targetY) * this.options.smoothingSpeed;
      this.cursor.style.left = `${this.targetX}px`;
      this.cursor.style.top = `${this.targetY}px`;
      requestAnimationFrame(animate);
    };
    animate();
  }

  instantLoop() {
    const animate = () => {
      this.cursor.style.left = `${this.pageX}px`;
      this.cursor.style.top = `${this.pageY}px`;
      requestAnimationFrame(animate);
    };
    animate();
  }

  cursorStyleHandler() {
    document.body.style.cursor = 'none';
  }

  changeCursorEvent() {
    const hoverItems = document.querySelectorAll('[data-cursor], a[href]:not([href="#"]):not([href="#none"]):not([href="javascript:void(0)"]):not([href="javascript:;"]), button');
    hoverItems.forEach(item => {
      item.addEventListener('mouseover', () => {
        const status = item.dataset.cursor;
        this.cursor.dataset.cursorStatus = status ? status : 'zoom';
      });
      item.addEventListener('mouseleave', () => {
        this.cursor.removeAttribute('data-cursor-status');
      });
    });
  }

  refreshHoverTargets() {
    const hoverItems = document.querySelectorAll('[data-cursor], a[href]:not([href="#"]):not([href="#none"]):not([href="javascript:void(0)"]):not([href="javascript:;"]), button');
    hoverItems.forEach(item => {
      item.addEventListener('mouseover', () => {
        const status = item.dataset.cursor;
        this.cursor.dataset.cursorStatus = status ? status : 'zoom';
      });
      item.addEventListener('mouseleave', () => {
        this.cursor.removeAttribute('data-cursor-status');
      });
    });
  }
};
