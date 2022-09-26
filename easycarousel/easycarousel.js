class EasyCarousel {
  constructor(carouselQuery, autoSlide) {
    this.carouselQuery = carouselQuery;
    this.autoSlide = autoSlide >= 100 || autoSlide !== null ? autoSlide : null;

    const carouselDots = carouselQuery.querySelector(".carousel-dots");
    const carouselSlider = carouselQuery.querySelector(".carousel-slider");
    const carouselControls =
      carouselQuery.querySelectorAll(".carousel-control");

    let carouselSlideTimer = 0;
    let carouselMovesCount = 0;

    window.addEventListener("resize", () => {
      getCarouselProperties();
      setCarouselButtons();
      handleCarouselMove(0);
    });

    if (carouselControls) {
      carouselControls.forEach((item) => {
        if (item.classList.contains("prev"))
          item.addEventListener("click", () => handleCarouselMove("prev"));
        if (item.classList.contains("next"))
          item.addEventListener("click", () => handleCarouselMove("next"));
      });
    }

    if (autoSlide) {
      carouselSlider.addEventListener("mouseenter", () => {
        clearInterval(carouselSlideTimer);
      });
      carouselSlider.addEventListener("mouseleave", () => {
        carouselSlideTimer = setInterval(
          () => handleCarouselMove("next"),
          autoSlide
        );
      });
    }

    // CAROUSEL
    const getCarouselProperties = () => {
      const slidesCount =
        carouselQuery.querySelectorAll(".carousel-slide").length;
      const slidePercent = parseInt(
        getComputedStyle(carouselQuery.querySelector(".carousel-slide"))
          .minWidth
      );
      const slidesPerScreen = Math.round(100 / slidePercent);
      const screensCount = slidesCount - (slidesPerScreen - 1);
      const slideWidth =
        carouselQuery.querySelector(".carousel-slide").offsetWidth;

      return { screensCount, slideWidth };
    };

    const handleCarouselMove = (value) => {
      if (autoSlide) {
        clearInterval(carouselSlideTimer);
        carouselSlideTimer = setInterval(
          () => handleCarouselMove("next"),
          autoSlide
        );
      }

      const carouselProperties = getCarouselProperties();
      switch (value) {
        case "prev":
          carouselMovesCount -= 1;
          break;
        case "next":
          carouselMovesCount += 1;
          break;
        default:
          carouselMovesCount = value;
      }

      if (carouselMovesCount >= carouselProperties.screensCount)
        carouselMovesCount = 0;
      if (carouselMovesCount < 0)
        carouselMovesCount = carouselProperties.screensCount - 1;
      carouselSlider.scrollLeft =
        carouselMovesCount * carouselProperties.slideWidth;

      if (carouselDots && carouselProperties.screensCount > 1) {
        if (carouselDots.querySelector(".carousel-dot.active"))
          carouselDots
            .querySelector(".carousel-dot.active")
            .classList.remove("active");
        carouselDots
          .querySelector(`[data-dot="${carouselMovesCount}"]`)
          .classList.add("active");
      }
    };
    if (autoSlide)
      carouselSlideTimer = setInterval(() => {
        handleCarouselMove("next");
      }, autoSlide);

    const setCarouselDots = () => {
      const carouselProperties = getCarouselProperties();
      let html = "";
      for (let i = 0; i < carouselProperties.screensCount; i++) {
        html += `<button data-dot="${i}" class="carousel-dot ${
          i === carouselMovesCount ? "active" : ""
        }"/>`;
      }
      carouselDots.innerHTML = html;
      carouselDots.querySelectorAll(".carousel-dot").forEach((item, index) => {
        item.addEventListener("click", () => {
          handleCarouselMove(index);
        });
      });
    };

    const setCarouselButtons = () => {
      const carouselProperties = getCarouselProperties();
      if (carouselProperties.screensCount > 1) {
        carouselControls.forEach((item) => {
          item.style.display = "flex";
        });
        if (carouselDots) {
          carouselDots.style.display = "flex";
          setCarouselDots();
        }
      } else {
        carouselControls.forEach((item) => {
          item.style.display = "none";
        });
        if (carouselDots) carouselDots.style.display = "none";
      }
    };
    setCarouselButtons();

    // ACCESSIBILITY
    let globalGestureStart = 0;
    let globalGestureEnd = 0;

    window.addEventListener("keydown", (ev) => {
      if (ev.key === "ArrowRight") handleCarouselMove("next");
      if (ev.key === "ArrowLeft") handleCarouselMove("prev");
    });
    carouselSlider.addEventListener("touchstart", (ev) => {
      carouselSlider.style.overflow = "scroll";
      globalGestureStart = ev.changedTouches[0].screenX;
    });
    carouselSlider.addEventListener("touchend", (ev) => {
      carouselSlider.style.overflow = "hidden";
      globalGestureEnd = ev.changedTouches[0].screenX;
      handleGesture();
    });

    const handleGesture = () => {
      if (globalGestureEnd <= globalGestureStart) {
        handleCarouselMove("next");
      }
      if (globalGestureEnd >= globalGestureStart) {
        handleCarouselMove("prev");
      }
      globalGestureStart = 0;
      globalGestureEnd = 0;
    };
  }
}
