let globalCarouselMovesCount = 0
let globalCarouselTimer = 0

window.addEventListener('resize', () => {
    clearTimeout(globalCarouselTimer)
    globalCarouselTimer = setTimeout(() => {
        getCarouselProperties()
        setCarouselDots()
    }, 1000)
})

// CAROUSEL
const getCarouselProperties = () => {
    const slidesCount = document.querySelectorAll('.carousel-slide').length;
    const slidesPerScreen = 100 / parseInt(getComputedStyle(document.querySelector('.carousel-slide')).minWidth);
    const screensCount = Math.ceil(slidesCount / slidesPerScreen);
    const translatePercent = 100 * slidesPerScreen;

    return { screensCount, translatePercent }
}

const handleCarouselMove = (value) => {
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

const setCarouselDots = () => {
    const carouselProperties = getCarouselProperties();
    let html = ''

    for (i = 0; i < carouselProperties.screensCount; i++) {
        html += `<button data-carouselPosition="${i}" onclick="handleCarouselMove(${i})" class="carousel-dot ${i === 0 ? 'active' : false}">${i}</button>`
    }
    document.querySelector('.carousel-dots').innerHTML = html
}
setCarouselDots();


// GESTURE
let globalGestureStart = 0;
let globalGestureEnd = 0;

const gestureArea = document.querySelector('.carousel');
gestureArea.addEventListener('touchstart', function (ev) {
    globalGestureStart = ev.changedTouches[0].screenX;
});
gestureArea.addEventListener('touchend', function (ev) {
    globalGestureEnd = ev.changedTouches[0].screenX;
    handleGesture();
});
gestureArea.addEventListener('mousedown', function (ev) {
    ev.preventDefault();
    globalGestureStart = ev.screenX;
})
gestureArea.addEventListener('mouseup', function (ev) {
    globalGestureEnd = ev.screenX;
    handleGesture();
})

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