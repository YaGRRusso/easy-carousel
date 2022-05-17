let resizeEventTimer = 0;
class EasyCarousel {
    constructor(carouselQuery) {
        let globalCarouselMovesCount = 0;
        this.carouselQuery = carouselQuery

        window.addEventListener('resize', () => {
            clearTimeout(resizeEventTimer)
            resizeEventTimer = setTimeout(() => {
                getCarouselProperties()
                setCarouselDots()
            }, 1000)
        })

        carouselQuery.querySelector('.carousel-control.prev').addEventListener('click', () => handleCarouselMove('prev'))
        carouselQuery.querySelector('.carousel-control.next').addEventListener('click', () => handleCarouselMove('next'))

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
            clearInterval(globalCarouselSlideTimer)
            globalCarouselSlideTimer = setInterval(() => handleCarouselMove('next'), 5000)

            const carouselProperties = getCarouselProperties();
            switch (value) {
                case 'prev': globalCarouselMovesCount -= 1
                    break
                case 'next': globalCarouselMovesCount += 1
                    break
                default: globalCarouselMovesCount = value
            }

            globalCarouselMovesCount >= carouselProperties.screensCount ? globalCarouselMovesCount = 0 : false
            globalCarouselMovesCount < 0 ? globalCarouselMovesCount = carouselProperties.screensCount - 1 : false

            carouselQuery.querySelectorAll('.carousel-slide').forEach(item => {
                item.style.transform = `translateX(-${globalCarouselMovesCount * carouselProperties.translatePercent}%)`
            })

            carouselQuery.querySelector('.carousel-dot.active') ? carouselQuery.querySelector('.carousel-dot.active').classList.remove('active') : ''
            carouselQuery.querySelector(`[data-carouselPosition="${globalCarouselMovesCount}"]`).classList.add('active')
        }
        let globalCarouselSlideTimer = setInterval(() => { handleCarouselMove('next') }, 5000)

        const setCarouselDots = () => {
            const carouselProperties = getCarouselProperties();
            let html = ''
            for (let i = 0; i < carouselProperties.screensCount; i++) {
                html += `<button data-carouselPosition="${i}" class="carousel-dot ${i === globalCarouselMovesCount ? 'active' : ''}"/>`
            }
            carouselQuery.querySelector('.carousel-dots').innerHTML = html
            carouselQuery.querySelectorAll('.carousel-dot').forEach((item, index) => {
                item.addEventListener('click', () => { handleCarouselMove(index) })
            })
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