window.addEventListener("load", function () {

  const visualObjBall = document.querySelector('.smooth-cont__sec--visual .__ball');

  let oldX = 0, oldY = 0;
  let currentX = 0, currentY = 0;
  let speed = 0.8;
  let isAnimating = false;
  
  let ballCenterX, ballCenterY; // 초기 위치 저장
  
  // 🌟 `.__ball`의 원래 위치를 저장하는 함수 (리사이즈 대응)
  const updateBallCenter = () => {
    const ballRect = visualObjBall.getBoundingClientRect();
    ballCenterX = ballRect.left + ballRect.width / 2;
    ballCenterY = ballRect.top + ballRect.height / 2;
  };
  
  // 처음 로딩 시 초기 위치 저장
  updateBallCenter();
  
  // 윈도우 크기 변경 시 초기 위치 업데이트
  window.addEventListener('resize', updateBallCenter);
  
  const loop = () => {
    oldX += (currentX - ballCenterX - oldX) * speed;
    oldY += (currentY - ballCenterY - oldY) * speed;
  
    visualObjBall.style.transform = `translate(${Math.round(oldX * 0.1)}px, ${Math.round(oldY * 0.1)}px)`;
  
    // ⭐ 움직임이 거의 없으면 애니메이션 종료 (성능 최적화)
    if (Math.abs(currentX - ballCenterX - oldX) > 0.1 || Math.abs(currentY - ballCenterY - oldY) > 0.1) {
      window.requestAnimationFrame(loop);
    } else {
      isAnimating = false;
    }
  };
  
  const ballMove = (e) => {
    currentX = e.clientX;
    currentY = e.clientY;
  
    if (!isAnimating) {
      isAnimating = true;
      window.requestAnimationFrame(loop);
    }
  };
  
  document.addEventListener('mousemove', ballMove);
  


  gsap.registerPlugin(ScrollTrigger);

  const pageContainer = document.querySelector(".smooth-cont");
  pageContainer.setAttribute("data-scroll-container", "");

  const scroller = new LocomotiveScroll({
    el: pageContainer,
    inertia: 0.8,
    smooth: true,
    getDirection: true
  });

  scroller.on("scroll", function (t) {
    document.documentElement.setAttribute("data-direction", t.direction);
  });

  scroller.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy(pageContainer, {
    scrollTop(value) {
      return arguments.length
        ? scroller.scrollTo(value, 0, 0)
        : scroller.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight
      };
    },
    pinType: pageContainer.style.transform ? "transform" : "fixed"
  });

  // Pinning and horizontal scrolling

  let horizontalSections = document.querySelectorAll(".horizontal-wrap");

  horizontalSections.forEach((horizontalSection) => {
    let pinWrap = horizontalSection.querySelector(".horizontal-cont");
    let pinWrapWidth = pinWrap.offsetWidth;
    let horizontalScrollLength = pinWrapWidth - window.innerWidth;
    gsap.to(pinWrap, {
      scrollTrigger: {
        scroller: "[data-scroll-container]",
        scrub: true,
        trigger: horizontalSection,
        pin: true,
        start: "top top",
        end: () => `+=${pinWrapWidth}`,
        invalidateOnRefresh: true
      },
      x: -horizontalScrollLength,
      ease: "none"
    });
  });

  /* COLOR CHANGER */

  // const scrollColorElems = document.querySelectorAll("[data-bgcolor]");
  // scrollColorElems.forEach((colorSection, i) => {
  //   const prevBg = i === 0 ? "" : scrollColorElems[i - 1].dataset.bgcolor;
  //   const prevText = i === 0 ? "" : scrollColorElems[i - 1].dataset.textcolor;

  //   ScrollTrigger.create({
  //     trigger: colorSection,
  //     scroller: "[data-scroll-container]",
  //     start: "top 50%",
  //     onEnter: () =>
  //       gsap.to("body", {
  //         backgroundColor: colorSection.dataset.bgcolor,
  //         color: colorSection.dataset.textcolor,
  //         overwrite: "auto"
  //       }),
  //     onLeaveBack: () =>
  //       gsap.to("body", {
  //         backgroundColor: prevBg,
  //         color: prevText,
  //         overwrite: "auto"
  //       })
  //   });
  // });

  ScrollTrigger.addEventListener("refresh", () => scroller.update());

  ScrollTrigger.refresh();
});
