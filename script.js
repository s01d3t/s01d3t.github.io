document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const scrollDownBtn = document.querySelector('.scroll-down');
    const gallery = document.querySelector('.gallery');
    
    // Initialize header and background
    const headerImg = new Image();
    headerImg.onload = () => {
        header.style.backgroundImage = `url(${headerImg.src})`;
        header.style.opacity = '1';
        scrollDownBtn.style.opacity = '1';
        scrollDownBtn.style.pointerEvents = 'auto';
    };
    headerImg.src = 'design/header.png';
    
    // Load background
    const bgImg = new Image();
    bgImg.onload = () => {
        document.body.style.background = `url(${bgImg.src}) center/cover no-repeat fixed`;
    };
    bgImg.src = 'design/background.png';
    
    // Show gallery
    gallery.classList.add('visible');
    
    // Handle scroll
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        if (scrollPosition > 50) {
            header.style.opacity = '0';
            scrollDownBtn.style.opacity = '0';
            scrollDownBtn.style.pointerEvents = 'none';
        } else {
            header.style.opacity = '1';
            scrollDownBtn.style.opacity = '1';
            scrollDownBtn.style.pointerEvents = 'auto';
        }
    });
    
    // Scroll button click
    scrollDownBtn.addEventListener('click', () => {
        const firstArtwork = document.querySelector('.artwork');
        if (firstArtwork) {
            const artworkRect = firstArtwork.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const scrollPosition = window.scrollY + artworkRect.top - (windowHeight - artworkRect.height) / 2;
            window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
        }
    });
    
    // Initialize audio on first click
    const audio = document.getElementById('background-music');
    document.addEventListener('click', () => {
        audio.play().catch(() => {});
    }, { once: true });
    
    // Protect images
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', e => e.preventDefault());
    });
}); 