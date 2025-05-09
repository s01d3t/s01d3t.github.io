document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const music = document.getElementById('background-music');
    const scrollThreshold = window.innerWidth < 1024 ? 100 : 300;
    const scrollDownButton = document.querySelector('.scroll-down');
    const headerImage = new Image();
    const backgroundImage = new Image();
    
    // Hide button initially
    scrollDownButton.style.opacity = '0';
    scrollDownButton.style.pointerEvents = 'none';

    let headerLoaded = false;
    let backgroundLoaded = false;

    // Load header image
    headerImage.src = 'design/header.png';
    headerImage.onload = () => {
        headerLoaded = true;
        if (headerLoaded && backgroundLoaded) {
            showScrollButton();
        }
    };

    // Load background image
    backgroundImage.src = 'design/background.png';
    backgroundImage.onload = () => {
        backgroundLoaded = true;
        if (headerLoaded && backgroundLoaded) {
            showScrollButton();
        }
    };

    function showScrollButton() {
        scrollDownButton.style.opacity = '1';
        scrollDownButton.style.pointerEvents = 'auto';
    }

    // Initialize scroll position
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Handle header opacity on scroll
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const opacity = currentScrollY > scrollThreshold 
            ? Math.max(0, 1 - (currentScrollY - scrollThreshold) / (window.innerWidth < 1024 ? 200 : 400))
            : 1;
        
        header.style.opacity = opacity;
        header.classList.toggle('hidden', opacity === 0);
        
        // Disable scroll button when header is hidden
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

    // Handle scroll down button click
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

    // Handle background music
    music.play().catch(() => {
        document.body.onclick = () => music.play();
    });

    // Защита изображений от сохранения
    document.addEventListener('DOMContentLoaded', function() {
        // Отключаем контекстное меню на всем сайте
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });

        // Защита от перетаскивания изображений
        document.querySelectorAll('img').forEach(function(img) {
            img.addEventListener('dragstart', function(e) {
                e.preventDefault();
                return false;
            });
        });

        // Защита от выделения изображений
        document.querySelectorAll('img').forEach(function(img) {
            img.addEventListener('selectstart', function(e) {
                e.preventDefault();
                return false;
            });
        });
    });
}); 