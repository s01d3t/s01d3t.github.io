document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });
    }, 100);

    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    const scrollThreshold = 300;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        let opacity;
        if (currentScrollY > scrollThreshold) {
            opacity = 1 - (currentScrollY - scrollThreshold) / 400;
            opacity = Math.max(0, opacity);
            header.style.opacity = opacity;
        } else {
            opacity = 1;
            header.style.opacity = 1;
        }
        if (opacity === 0) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
        lastScrollY = currentScrollY;
    });
}); 