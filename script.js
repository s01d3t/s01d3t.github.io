document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const gallery = document.querySelector('.gallery');
    const scrollDownButton = document.querySelector('.scroll-down');
    const music = document.getElementById('background-music');
    const scrollThreshold = window.innerWidth < 1024 ? 100 : 300;
    
    // Проверяем, открыт ли файл локально
    const isLocalFile = window.location.protocol === 'file:';
    
    // Handle image loading
    document.querySelectorAll('.gallery img').forEach(img => {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        img.parentElement.appendChild(spinner);

        // Если изображение уже загружено, сразу скрываем спиннер
        if (img.complete) {
            img.classList.add('loaded');
            spinner.classList.add('hidden');
        } else {
            // Если изображение еще загружается
            img.addEventListener('load', () => {
                img.classList.add('loaded');
                spinner.classList.add('hidden');
            });

            img.addEventListener('error', () => {
                spinner.classList.add('hidden');
            });
        }
    });

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