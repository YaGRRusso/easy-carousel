class EasyCarousel {
    constructor(carouselQuery, autoSlide) {
        this.carouselQuery = carouselQuery;
        this.autoSlide = autoSlide >= 100 || autoSlide !== null ? autoSlide : null;
        let carouselSlideTimer = 0;
        let carouselMovesCount = 0;
        const carouselHasDots = carouselQuery.querySelector('.carousel-dots');

        window.addEventListener('resize', () => {
            getCarouselProperties();
            setCarouselButtons();
            handleCarouselMove(0);
        })

        carouselQuery.querySelector('.carousel-control.prev') ? carouselQuery.querySelector('.carousel-control.prev').addEventListener('click', () => handleCarouselMove('prev')) : false;
        carouselQuery.querySelector('.carousel-control.next') ? carouselQuery.querySelector('.carousel-control.next').addEventListener('click', () => handleCarouselMove('next')) : false;

        if (autoSlide) {
            carouselQuery.querySelector('.carousel-slider').addEventListener('mouseenter', () => {
                clearInterval(carouselSlideTimer);
            })
            carouselQuery.querySelector('.carousel-slider').addEventListener('mouseleave', () => {
                carouselSlideTimer = setInterval(() => handleCarouselMove('next'), autoSlide);
            })
        }


        // CAROUSEL
        const getCarouselProperties = () => {
            const slidesCount = carouselQuery.querySelectorAll('.carousel-slide').length;
            const slidePercent = parseInt(getComputedStyle(carouselQuery.querySelector('.carousel-slide')).minWidth);
            const slidesPerScreen = Math.round(100 / slidePercent);
            const screensCount = slidesCount - (slidesPerScreen - 1);
            const slideWidth = carouselQuery.querySelector('.carousel-slide').offsetWidth;

            return { screensCount, slideWidth }
        }

        const handleCarouselMove = (value) => {
            if (autoSlide) {
                clearInterval(carouselSlideTimer);
                carouselSlideTimer = setInterval(() => handleCarouselMove('next'), autoSlide);
            }

            const carouselProperties = getCarouselProperties();
            switch (value) {
                case 'prev': carouselMovesCount -= 1;
                    break
                case 'next': carouselMovesCount += 1;
                    break
                default: carouselMovesCount = value;
            }

            carouselMovesCount >= carouselProperties.screensCount ? carouselMovesCount = 0 : false;
            carouselMovesCount < 0 ? carouselMovesCount = carouselProperties.screensCount - 1 : false;

            carouselQuery.querySelector('.carousel-slider').scrollLeft = carouselMovesCount * carouselProperties.slideWidth


            if (carouselHasDots && carouselProperties.screensCount > 1) {
                carouselQuery.querySelector('.carousel-dot.active') ? carouselQuery.querySelector('.carousel-dot.active').classList.remove('active') : '';
                carouselQuery.querySelector(`[data-dot="${carouselMovesCount}"]`).classList.add('active');
            }
        }
        autoSlide ? carouselSlideTimer = setInterval(() => { handleCarouselMove('next') }, autoSlide) : false;

        const setCarouselDots = () => {
            const carouselProperties = getCarouselProperties();
            let html = '';
            for (let i = 0; i < carouselProperties.screensCount; i++) {
                html += `<button data-dot="${i}" class="carousel-dot ${i === carouselMovesCount ? 'active' : ''}"/>`;
            }
            carouselQuery.querySelector('.carousel-dots').innerHTML = html;
            carouselQuery.querySelectorAll('.carousel-dot').forEach((item, index) => {
                item.addEventListener('click', () => { handleCarouselMove(index) });
            })
        }

        const setCarouselButtons = () => {
            const carouselProperties = getCarouselProperties();
            if (carouselProperties.screensCount > 1) {
                carouselQuery.querySelectorAll('.carousel-control').forEach(item => {
                    item.style.display = 'flex';
                })
                if (carouselHasDots) {
                    carouselQuery.querySelector('.carousel-dots').style.display = 'flex'
                    setCarouselDots();
                }
            } else {
                carouselQuery.querySelectorAll('.carousel-control').forEach(item => {
                    item.style.display = 'none';
                })
                carouselHasDots ? carouselQuery.querySelector('.carousel-dots').style.display = 'none' : false;
            }
        }
        setCarouselButtons();

        // ACCESSIBILITY
        let globalGestureStart = 0;
        let globalGestureEnd = 0;
        const gestureArea = carouselQuery.querySelector('.carousel-slider');

        window.addEventListener('keydown', (ev) => {
            ev.key === 'ArrowRight' ? handleCarouselMove('next') : false;
            ev.key === 'ArrowLeft' ? handleCarouselMove('prev') : false;
        })
        gestureArea.addEventListener('touchstart', (ev) => {
            gestureArea.style.overflow = 'scroll'
            globalGestureStart = ev.changedTouches[0].screenX;
        });
        gestureArea.addEventListener('touchend', (ev) => {
            gestureArea.style.overflow = 'hidden'
            globalGestureEnd = ev.changedTouches[0].screenX;
            handleGesture();
        });
        gestureArea.addEventListener('mousedown', (ev) => {
            ev.preventDefault();
            globalGestureStart = ev.screenX;
        })
        gestureArea.addEventListener('mouseup', (ev) => {
            globalGestureEnd = ev.screenX;
            handleGesture();
        })

        const handleGesture = () => {
            if (globalGestureEnd <= globalGestureStart) {
                handleCarouselMove('next');
            }
            if (globalGestureEnd >= globalGestureStart) {
                handleCarouselMove('prev');
            }
            globalGestureStart = 0;
            globalGestureEnd = 0;
        }
    }
}