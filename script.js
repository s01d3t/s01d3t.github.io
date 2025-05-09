document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const music = document.getElementById('background-music');
    const scrollThreshold = window.innerWidth < 1024 ? 100 : 300;
    const scrollDownButton = document.querySelector('.scroll-down');
    const gallery = document.querySelector('.gallery');
    
    // Оптимизированная предзагрузка изображений
    const preloadImages = () => {
        return Promise.all([
            new Promise((resolve) => {
                const headerImage = new Image();
                headerImage.onload = () => {
                    header.style.background = 'url("design/header.png") center/cover no-repeat';
                    header.style.opacity = '1';
                    resolve();
                };
                headerImage.src = 'design/header.png';
            }),
            new Promise((resolve) => {
                const backgroundImage = new Image();
                backgroundImage.onload = () => {
                    document.body.style.background = 'url("design/background.png") center/cover no-repeat fixed';
                    resolve();
                };
                backgroundImage.src = 'design/background.png';
            })
        ]);
    };

    // Оптимизированный обработчик скролла
    let scrollTimeout;
    const handleScroll = () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }

        scrollTimeout = window.requestAnimationFrame(() => {
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
    };

    // Инициализация страницы
    const initPage = async () => {
        try {
            await preloadImages();
            showScrollButton();
            showGallery();
            window.addEventListener('scroll', handleScroll);
        } catch (error) {
            console.error('Error loading images:', error);
        }
    };

    function showScrollButton() {
        scrollDownButton.style.opacity = '1';
        scrollDownButton.style.pointerEvents = 'auto';
    }

    function showGallery() {
        gallery.classList.add('visible');
    }

    // Инициализация скролла
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Оптимизированный обработчик клика по кнопке скролла
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

    // Отложенная загрузка музыки
    const initMusic = () => {
        music.play().catch(() => {
            document.body.onclick = () => {
                music.play();
                document.body.onclick = null;
            };
        });
    };

    // Защита изображений
    const protectImages = () => {
        document.addEventListener('contextmenu', e => e.preventDefault());
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('dragstart', e => e.preventDefault());
            img.addEventListener('selectstart', e => e.preventDefault());
        });
    };

    // Запуск инициализации
    initPage();
    initMusic();
    protectImages();
}); 