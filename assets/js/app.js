class App {
  constructor (props) {
    this.setRoot(props);
    this.lenis = null; 
    this.init();
    window.addEventListener('resize', () => {
      // 디바운싱으로 리사이즈 이벤트 최적화
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        ScrollTrigger.getById('horizontal-scroll')?.kill();
        
        requestAnimationFrame(() => {
          this.horizontalScrollEvent();
          ScrollTrigger.refresh(); // 마지막에 전체 갱신
        });
      }, 150);
    });
  }

  setRoot({ context, name }) {
    context.APP_NAME = name;
    context[name] = this;
  }

  async init () {
    await this.initScrollTrigger();
    await this.introEvent();    
    this.updateBodyBgByScroll();
    this.menuActiveEvent();
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

  updateBodyBgByScroll () {
    const sections = gsap.utils.toArray('.section[data-bg]');
    if (!sections.length) return;
  
    sections.forEach((section, index) => {
      const nextBg = section.dataset.bg;
      const prevBg = index === 0
        ? getComputedStyle(document.body).backgroundColor
        : sections[index - 1].dataset.bg;
  
      gsap.fromTo(
        document.body,
        { backgroundColor: prevBg },
        {
          backgroundColor: nextBg,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 20%',
            end: 'top 0%',
            scrub: true,
            scroller: document.body,
            // markers: true
          },
        }
      );
    });
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

    // const animatedEls = Array.from(intro.querySelectorAll('*'));
    // let totalAnimations = 0;

    // animatedEls.forEach(el => {
    //   const style = getComputedStyle(el);
    //   const names = style.animationName.split(',').map(n => n.trim());
    //   const count = names.filter(name => name !== 'none').length;
    //   totalAnimations += count;
    // });

    // let completed = 0;
    // if (totalAnimations === 0) {
    //   intro.remove();
    // } else {
    //   animatedEls.forEach(el => {
    //     el.addEventListener('animationend', () => {
    //       completed++;
    //       if (completed === totalAnimations) {
    //         intro.remove();
    //         // this.lenis.start();
    //         const visualSec = document.querySelector('.section--visual');
    //         visualSec.dataset.cursor = 'scroll';

    //         if (this.cursorEffect?.refreshHoverTargets) {
    //           this.cursorEffect.refreshHoverTargets();
    //         }
    //       }
    //     });
    //   });
    // }
    setTimeout(() => {
      intro.remove();
  
      const visualSec = document.querySelector('.section--visual');
      visualSec.dataset.cursor = 'scroll';
  
      if (this.cursorEffect?.refreshHoverTargets) {
        this.cursorEffect.refreshHoverTargets();
      }
  
      // this.lenis.start(); // 원하면 다시 풀어주기
    }, 3600);
  }

  initCursorEffect () {
    this.cursorEffect = new window.CursorEffect({
      enableHoverEffect: true,
      hideDefaultCursor: false,
      enableSmoothing: false,
    });
  }

  menuActiveEvent () {
    let isOpen = false;
    const menu = document.querySelector('.menu');
    const menuToggleBtn = menu?.querySelector('.menu__btn-toggle');
    const menuWrap = menu?.querySelector('.menu__nav-wrap');
    const anchors = menu?.querySelectorAll('.menu__nav__anchor');

    // anchors.forEach(anchor => {
    //   this.setSpanText(anchor, anchor.textContent);
    
    //   anchor.addEventListener('click', (e) => {
    //     e.preventDefault();
    
    //     const targetId = anchor.dataset.target;
    //     const targetEl = document.getElementById(targetId);
    //     if (!targetEl) return;
    
    //     menu.classList.remove('menu--active');
    //     setTimeout(() => {
    //       menuWrap.style.display = 'none';
    //     }, 1000);
    
    //     isOpen = false;
    //     this.lenis.start(); // 필요 시
    //     menuToggleBtn.removeAttribute('data-cursor');
    
    //     const offsetTop = targetEl.getBoundingClientRect().top + window.scrollY;
    //     window.scrollTo(0, offsetTop);
    //   });
    // });

    anchors.forEach(anchor => {
      this.setSpanText(anchor, anchor.textContent);
    
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
    
        const targetId = anchor.dataset.target;
        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;
    
        // 👇 트랜지션 애니메이션 실행
        const createTransitionScreen = (direction) => {
          const screen = document.createElement('div');
          screen.classList.add('transition-screen', `transition-screen--${direction}`);
    
          for (let i = 0; i < 6; i++) {
            const tile = document.createElement('span');
            tile.classList.add('transition-screen__tile');
            screen.appendChild(tile);
          }
    
          menu.appendChild(screen);
    
          const timeout = direction === 'right' ? 1000 : 1800;
          setTimeout(() => {
            screen.remove();
          }, timeout);
        };
    
        createTransitionScreen('right');
    
        menu.classList.remove('menu--active');
        setTimeout(() => {
          menuWrap.style.display = 'none';
        }, 1000);
    
        isOpen = false;
        this.lenis.start();
        menuToggleBtn.removeAttribute('data-cursor');
    
        const offsetTop = targetEl.getBoundingClientRect().top + window.scrollY;
        window.scrollTo(0, offsetTop);
      });
    });

    menuToggleBtn.addEventListener('click', e => {
      const toggleBtn = e.currentTarget;
    
      const createTransitionScreen = (direction) => {
        const screen = document.createElement('div');
        screen.classList.add('transition-screen', `transition-screen--${direction}`);
        
        for (let i = 0; i < 6; i++) {
          const tile = document.createElement('span');
          tile.classList.add('transition-screen__tile');
          screen.appendChild(tile);
        }
    
        menu.appendChild(screen);
    
        const timeout = direction === 'left' ? 1800 : 1000; 
        setTimeout(() => {
          screen.remove();
        }, timeout);
      };
    
      if (!isOpen) {
        // 메뉴 열기
        createTransitionScreen('left');
        menuWrap.style.display = 'block';
        setTimeout(() => {
          menu.classList.add('menu--active');
        }, 10);
        this.lenis.stop();
        toggleBtn.setAttribute('data-cursor', 'close');
      } else {
        // 메뉴 닫기
        createTransitionScreen('right');
        menu.classList.remove('menu--active');
        setTimeout(() => {
          menuWrap.style.display = 'none';
        }, 1000);
        this.lenis.start();
        toggleBtn.removeAttribute('data-cursor');
      }
    
      isOpen = !isOpen;
    
      if (this.cursorEffect?.refreshHoverTargets) {
        this.cursorEffect.refreshHoverTargets();
      }
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
    const sectionPin = document.querySelector('.pin');
    const menuBtn = document.querySelector('.menu__btn-toggle');
    if (!sectionPin) return;

    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    this.lenis.scrollTo(currentScroll, { immediate: true });
  
    ScrollTrigger.getById('horizontal-scroll')?.kill();
  

    if (window.innerWidth <= 1024) {
      sectionPin.classList.add('pin--vertical');
      ScrollTrigger.create({
        id: 'horizontal-scroll',
        trigger: '.section--works',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        scroller: document.body,
        onEnter: () => {
          menuBtn?.classList.add('menu__btn-toggle--dark');
          sectionPin.classList.add('pin--active');
        },
        onEnterBack: () => {
          menuBtn?.classList.add('menu__btn-toggle--dark');
          sectionPin.classList.add('pin--active');
        },
        onLeave: () => {
          menuBtn?.classList.remove('menu__btn-toggle--dark');
          sectionPin.classList.remove('pin--active');
        },
        onLeaveBack: () => {
          menuBtn?.classList.remove('menu__btn-toggle--dark');
          sectionPin.classList.remove('pin--active');
        }
      });
  
      return;
    }

    if(sectionPin.classList.contains('pin--vertical')) {
      sectionPin.classList.remove('pin--vertical');
    }
    gsap.to(sectionPin, {
      scrollTrigger: {
        id: 'horizontal-scroll',
        trigger: '.section--works',
        start: 'top top',
        end: () => "+=" + sectionPin.scrollWidth,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        scroller: document.body,
        invalidateOnRefresh: true,
        onEnter: () => {
          menuBtn?.classList.add('menu__btn-toggle--dark');
          sectionPin.classList.add('pin--active');
        },
        onEnterBack: () => {
          menuBtn?.classList.add('menu__btn-toggle--dark');
          sectionPin.classList.add('pin--active');
        },
        onLeave: () => {
          menuBtn?.classList.remove('menu__btn-toggle--dark');
          sectionPin.classList.remove('pin--active');
        },
        onLeaveBack: () => {
          menuBtn?.classList.remove('menu__btn-toggle--dark');
          sectionPin.classList.remove('pin--active');
        }
      },
      x: () => -(sectionPin.scrollWidth - window.innerWidth),
      ease: "none"
    });
  }
  

  setSpanText(el, text) {
    el.innerHTML = '';
    [...text].forEach(char => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      el.appendChild(span);
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
        this.setSpanText(el, text);
      });

      item.addEventListener('click', e => {
        e.preventDefault();
        const title = item.querySelector('.work-text__title')?.textContent.trim() || '';
        const type = item.querySelector('.work-text__type')?.textContent.trim() || '';
        const period = item.querySelector('.work-text__period')?.textContent.trim() || '';
        const detailListItems = item.querySelectorAll('.work-text__detail li');
        const detailTexts = Array.from(detailListItems).map(li => li.textContent.trim());

        const image = item.querySelector('.pin__item__image img');
        const imageSrc = image?.getAttribute('src') || '';
        const imageAlt = image.getAttribute('alt');
        const workUrl = item.dataset.workUrl;
        
        this.setSpanText(workView.querySelector('.work-view__info__title'), title);
        this.setSpanText(workView.querySelector('.work-view__info__category'), type);
        this.setSpanText(workView.querySelector('.work-view__info__period'), period);

        // 상세 리스트 처리
        const detailContainer = workView.querySelector('.work-view__info__detail ul');
        detailContainer.innerHTML = ''; 
        detailTexts.forEach(text => {
          const li = document.createElement('li');
          this.setSpanText(li, text);
          detailContainer.appendChild(li);
        });


        const link = workView.querySelector('.work-view__link');
        const previewImg = link.querySelector('img');
        if (workUrl) {
          link.setAttribute('href', workUrl);
        } else {
          link.setAttribute('href', 'javascript:void(0)');
          link.removeAttribute('target');
          link.removeAttribute('data-cursor');
          this.cursorEffect.refreshHoverTargets();
        }
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
