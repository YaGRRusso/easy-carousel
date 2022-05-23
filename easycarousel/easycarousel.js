class EasyCarousel {
    constructor(carouselQuery, autoSlide) {
        this.carouselQuery = carouselQuery
        this.autoSlide = autoSlide !== 100 || autoSlide !== null ? autoSlide : null
        let carouselSlideTimer = 0
        let carouselMovesCount = 0;
        const carouselHasDots = carouselQuery.querySelector('.carousel-dots')

        window.addEventListener('resize', () => {
            getCarouselProperties();
            setCarouselDots();
        })

        carouselQuery.querySelector('.carousel-control.prev') ? carouselQuery.querySelector('.carousel-control.prev').addEventListener('click', () => handleCarouselMove('prev')) : false
        carouselQuery.querySelector('.carousel-control.next') ? carouselQuery.querySelector('.carousel-control.next').addEventListener('click', () => handleCarouselMove('next')) : false

        // CAROUSEL
        const getCarouselProperties = () => {
            const slidesCount = carouselQuery.querySelectorAll('.carousel-slide').length;
            const slideWidth = parseInt(getComputedStyle(carouselQuery.querySelector('.carousel-slide')).minWidth);
            const slidesPerScreen = Math.round(100 / slideWidth);
            const screensCount = slidesCount - (slidesPerScreen - 1);
            const translatePercent = 100;

            return { screensCount, translatePercent }
        }

        const handleCarouselMove = (value) => {
            if (autoSlide) {
                clearInterval(carouselSlideTimer)
                carouselSlideTimer = setInterval(() => handleCarouselMove('next'), autoSlide)
            }

            const carouselProperties = getCarouselProperties();
            switch (value) {
                case 'prev': carouselMovesCount -= 1
                    break
                case 'next': carouselMovesCount += 1
                    break
                default: carouselMovesCount = value
            }

            carouselMovesCount >= carouselProperties.screensCount ? carouselMovesCount = 0 : false
            carouselMovesCount < 0 ? carouselMovesCount = carouselProperties.screensCount - 1 : false

            carouselQuery.querySelectorAll('.carousel-slide').forEach(item => {
                item.style.transform = `translateX(-${carouselMovesCount * carouselProperties.translatePercent}%)`
            })

            if (carouselHasDots) {
                carouselQuery.querySelector('.carousel-dot.active') ? carouselQuery.querySelector('.carousel-dot.active').classList.remove('active') : ''
                carouselQuery.querySelector(`[data-carouselPosition="${carouselMovesCount}"]`).classList.add('active')
            }
        }
        autoSlide ? carouselSlideTimer = setInterval(() => { handleCarouselMove('next') }, autoSlide) : false

        const setCarouselDots = () => {
            if (carouselHasDots) {
                const carouselProperties = getCarouselProperties();
                let html = ''
                for (let i = 0; i < carouselProperties.screensCount; i++) {
                    html += `<button data-carouselPosition="${i}" class="carousel-dot ${i === carouselMovesCount ? 'active' : ''}"/>`
                }
                carouselQuery.querySelector('.carousel-dots').innerHTML = html
                carouselQuery.querySelectorAll('.carousel-dot').forEach((item, index) => {
                    item.addEventListener('click', () => { handleCarouselMove(index) })
                })
            }
        }
        setCarouselDots();

        // ACCESSIBILITY
        let globalGestureStart = 0;
        let globalGestureEnd = 0;
        const gestureArea = carouselQuery.querySelector('.carousel-slider');

        window.addEventListener('keydown', (ev) => {
            ev.key === 'ArrowRight' ? handleCarouselMove('next') : false
            ev.key === 'ArrowLeft' ? handleCarouselMove('prev') : false
        })
        gestureArea.addEventListener('touchstart', (ev) => {
            globalGestureStart = ev.changedTouches[0].screenX;
        });
        gestureArea.addEventListener('touchend', (ev) => {
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