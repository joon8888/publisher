class App {
  constructor (props) {
    this.setRoot(props);
    this.lenis = null; 
    this.init();
  }

  setRoot({ context, name }) {
    context.APP_NAME = name;
    context[name] = this;
  }

  async init () {
    await this.initScrollTrigger();
    await this.introEvent();    
    this.initCursorEffect(); 
    this.foldMoitionEvent();
    this.textTriggerEvent();     
    this.horizontalScrollEvent();
    this.workViewSectionHandler();  
  }

  async initScrollTrigger () {
    gsap.registerPlugin(ScrollTrigger);

    this.lenis = new window.Lenis({
      smooth: true,
      lerp: 0.1,
      direction: 'vertical',
      gestureDirection: 'vertical',
      wheelMultiplier: 1,
      touchMultiplier: 1,
      normalizeWheel: true,
    });

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop: (value) => {
        return arguments.length
          ? this.lenis.scrollTo(value, { immediate: true })
          : this.lenis.animatedScroll;
      },
      getBoundingClientRect: () => ({
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight
      }),
      pinType: document.body.style.transform ? 'transform' : 'fixed'
    });

    const raf = (time) => {
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    this.lenis.on('scroll', ScrollTrigger.update);
  }

  async introEvent () {
    // this.lenis.stop();
    setTimeout(() => {
      this.lenis.scrollTo(0, { immediate: true }); 
      window.scrollTo(0, 0);
      ScrollTrigger.refresh();
    }, 300);

    const intro = document.querySelector('.intro');
    if (!intro) return;

    const animatedEls = Array.from(intro.querySelectorAll('*'));
    let totalAnimations = 0;

    animatedEls.forEach(el => {
      const style = getComputedStyle(el);
      const names = style.animationName.split(',').map(n => n.trim());
      const count = names.filter(name => name !== 'none').length;
      totalAnimations += count;
    });

    let completed = 0;
    if (totalAnimations === 0) {
      intro.remove();
    } else {
      animatedEls.forEach(el => {
        el.addEventListener('animationend', () => {
          completed++;
          if (completed === totalAnimations) {
            intro.remove();
            // this.lenis.start();
            const visualSec = document.querySelector('.section--visual');
            visualSec.dataset.cursor = 'scroll';

            if (this.cursorEffect?.refreshHoverTargets) {
              this.cursorEffect.refreshHoverTargets();
            }
          }
        });
      });
    }
  }

  initCursorEffect () {
    this.cursorEffect = new window.CursorEffect({
      enableHoverEffect: true,
      hideDefaultCursor: false,
      enableSmoothing: false,
    });
  }

  foldMoitionEvent () {
    gsap.utils.toArray('.fold__conts__item').forEach((el, index) => {
      const w = el?.querySelector('.track');
      if (!w) return;
      const [x, xEnd] = (index % 2 === 0) ? [-500, -1500] : [-500, 0];
      gsap.fromTo(w, { x }, {
        x: xEnd,
        scrollTrigger: {
          scrub: 1,
          scroller: document.body,
        }
      });
    });

    const centerFold = document.querySelector('.fold--center');
    const centerContent = centerFold?.querySelector('.fold--center .fold__conts');
    const foldsContent = Array.from(document.querySelectorAll('.fold__conts'));
    if (!(centerFold && centerContent && foldsContent.length)) return;

    let targetScroll = 0;
    let currentScroll = 0;

    const tick = () => {
      const overflowHeight = centerContent.clientHeight - centerFold.clientHeight;
      document.body.style.height = `${overflowHeight + window.innerHeight}px`;

      targetScroll = -this.lenis.animatedScroll;
      currentScroll += (targetScroll - currentScroll) * 0.1;

      foldsContent.forEach(content => {
        content.style.transform = `translateY(${currentScroll}px)`;
      });

      ScrollTrigger.update();
      requestAnimationFrame(tick);
    };
    tick();
  }

  textTriggerEvent () {
    const textElements = gsap.utils.toArray('.text-scroll__align');
    if (textElements.length === 0) return;

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

    ScrollTrigger.refresh();
  }

  horizontalScrollEvent () {
    const sectionPin = document.querySelector('.pin')
    if(!sectionPin) return;
    
    const scrollTween = gsap.to(sectionPin, {
      scrollTrigger: {
        trigger: '.section--works',
        start: 'top top',
        end: () => "+=" + sectionPin.scrollWidth,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        scroller: document.body,
        invalidateOnRefresh: true
      },
      x: () => -(sectionPin.scrollWidth - window.innerWidth),
      ease: "none"
    });
  }

  workViewSectionHandler () {
    const workSection = document.querySelector('.section--works');
    const pinItemWorks = document.querySelectorAll('.pin__item--work');
    const workView = document.querySelector('.work-view');
    const closeWorkViewBtn = workView.querySelector('.work-view__close');


    pinItemWorks.forEach(item => {
      const targets = item.querySelectorAll('.work-text > p, .work-text li');
      targets.forEach(el => {
        const text = el.textContent;
        el.innerHTML = ''; 

        [...text].forEach(char => {
          const span = document.createElement('span');
          if (char === ' ') {
            span.innerHTML = '&nbsp;';
          } else {
            span.textContent = char;
          }
          el.appendChild(span);
        });
      });
      console.log(targets)
      item.addEventListener('click', () => {
        const title = item.querySelector('.work-text__title')?.textContent.trim() || '';
        const type = item.querySelector('.work-text__type')?.textContent.trim() || '';
        const period = item.querySelector('.work-text__period')?.textContent.trim() || '';
        const detailListItems = item.querySelectorAll('.work-text__detail li');
        const detailTexts = Array.from(detailListItems).map(li => li.textContent.trim());

        const image = item.querySelector('.pin__item__image img');
        const imageSrc = image?.getAttribute('src') || '';
        const imageAlt = title;
        const workUrl = item.dataset.workUrl || '#';

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

        pinItemWorks.forEach(el => el.classList.add('hidden'));
        this.lenis.stop();
        workView.closest('.work-view-wrap').classList.add('active');
        setTimeout(() => {
          workView.classList.add('active');
        }, 350);
      });
    });

    closeWorkViewBtn.addEventListener('click', () => {
      pinItemWorks.forEach(el => el.classList.remove('hidden'));
      this.lenis.start();
      setTimeout(() => {
        workView.closest('.work-view-wrap').classList.remove('active');
      }, 1000);
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
    ScrollTrigger.refresh();
  }
}

document.addEventListener("DOMContentLoaded", function() {
  new App({
    context: window,
    name: 'JOON',
  });
});
