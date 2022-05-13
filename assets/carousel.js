let globalCarouselMovesCount = 0;

let resizeEventTimer = 0;
window.addEventListener('resize', () => {
    clearTimeout(resizeEventTimer)
    resizeEventTimer = setTimeout(() => {
        getCarouselProperties()
        setCarouselDots()
    }, 1000)
})

// CAROUSEL
const getCarouselProperties = () => {
    const slidesCount = document.querySelectorAll('.carousel-slide').length;
    const slideWidth = parseInt(getComputedStyle(document.querySelector('.carousel-slide')).minWidth);
    const slidesPerScreen = Math.round(100 / slideWidth);
    // const screensCount = Math.ceil(slidesCount / slidesPerScreen);
    const screensCount = slidesCount - (slidesPerScreen - 1);
    // const translatePercent = 100 * slidesPerScreen;
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

    document.querySelectorAll('.carousel-slide').forEach(item => {
        item.style.transform = `translateX(-${globalCarouselMovesCount * carouselProperties.translatePercent}%)`
    })

    document.querySelector('.carousel-dot.active') ? document.querySelector('.carousel-dot.active').classList.remove('active') : false
    document.querySelector(`[data-carouselPosition="${globalCarouselMovesCount}"]`).classList.add('active')
}
let globalCarouselSlideTimer = setInterval(() => { handleCarouselMove('next') }, 5000)

const setCarouselDots = () => {
    const carouselProperties = getCarouselProperties();
    let html = ''

    for (i = 0; i < carouselProperties.screensCount; i++) {
        html += `<button data-carouselPosition="${i}" onclick="handleCarouselMove(${i})" class="carousel-dot ${i === globalCarouselMovesCount ? 'active' : false}"/>`
    }
    document.querySelector('.carousel-dots').innerHTML = html
}
setCarouselDots();

// ACCESSIBILITY
let globalGestureStart = 0;
let globalGestureEnd = 0;
const gestureArea = document.querySelector('.carousel');

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
// gestureArea.addEventListener('mousewheel', (ev) => {
//     ev.preventDefault()
//     ev.deltaY > 0 ? handleCarouselMove('next') : handleCarouselMove('prev');
// })

function handleGesture() {
    if (globalGestureEnd <= globalGestureStart) {
        handleCarouselMove('next');
    }
    if (globalGestureEnd >= globalGestureStart) {
        handleCarouselMove('prev');
    }

    globalGestureStart = 0;
    globalGestureEnd = 0;
}