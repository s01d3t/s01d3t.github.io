document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const gallery = document.querySelector('.gallery');
    const scrollDownButton = document.querySelector('.scroll-down');
    const music = document.getElementById('background-music');
    const scrollThreshold = window.innerWidth < 1024 ? 100 : 300;
    
    // Показываем шапку сразу
    header.style.opacity = '1';

    // Показываем галерею после загрузки
    window.addEventListener('load', () => {
        gallery.classList.add('visible');
    });

    // Handle scroll
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const opacity = currentScrollY > scrollThreshold 
            ? Math.max(0, 1 - (currentScrollY - scrollThreshold) / (window.innerWidth < 1024 ? 200 : 400))
            : 1;
        
        header.style.opacity = opacity;
        header.classList.toggle('hidden', opacity === 0);
        
        if (opacity === 0) {
            scrollDownButton.style.opacity = '0';
            scrollDownButton.style.pointerEvents = 'none';
            scrollDownButton.disabled = true;
        } else {
            scrollDownButton.style.opacity = '1';
            scrollDownButton.style.pointerEvents = 'auto';
            scrollDownButton.disabled = false;
        }
    });

    // Scroll button click
    scrollDownButton.addEventListener('click', () => {
        const firstArtwork = document.querySelector('.artwork');
        if (firstArtwork) {
            const artworkRect = firstArtwork.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const scrollPosition = window.scrollY + artworkRect.top - (windowHeight - artworkRect.height) / 2;
            
            window.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
        }
    });

    // Показываем кнопку скролла только после полной загрузки хедера
    const headerImage = new Image();
    headerImage.src = 'design/header.webp';
    headerImage.onload = () => {
        scrollDownButton.style.opacity = '1';
        scrollDownButton.style.pointerEvents = 'auto';
    };

    // Initialize audio on first click
    music.play().catch(() => {
        document.body.onclick = () => {
            music.play();
            document.body.onclick = null;
        };
    });

    // Protect images
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', e => e.preventDefault());
        img.addEventListener('selectstart', e => e.preventDefault());
    });
}); 