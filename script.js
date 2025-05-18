document.addEventListener('DOMContentLoaded', () => {
    const headerImage = new Image();
    headerImage.src = 'design/header.webp';

    const header = document.querySelector('.header');
    const gallery = document.querySelector('.gallery');
    const scrollDownButton = document.querySelector('.scroll-down');
    const playButton = document.querySelector('.play');
    const music = document.getElementById('background-music');
    const scrollThreshold = window.innerWidth < 1024 ? 100 : 300;
    
    // Проверяем, открыт ли файл локально
    const isLocalFile = window.location.protocol === 'file:';
    
    // Показываем шапку сразу
    header.style.opacity = '1';

    let ticking = false;

    // Оптимизированный обработчик скролла
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const opacity = window.scrollY > scrollThreshold 
                    ? Math.max(0, 1 - (window.scrollY - scrollThreshold) / (window.innerWidth < 1024 ? 200 : 400))
                    : 1;
        
                header.style.opacity = opacity;
                header.classList.toggle('hidden', opacity === 0);
        
                if (opacity === 0) {
                    scrollDownButton.classList.remove('visible');
                    scrollDownButton.disabled = true;
                    playButton.classList.remove('visible');
                    playButton.disabled = true;
                } else {
                    scrollDownButton.classList.add('visible');
                    scrollDownButton.disabled = false;
                    playButton.classList.add('visible');
                    playButton.disabled = false;
                }
                
                ticking = false;
            });
            
            ticking = true;
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

    // Функция для проверки загрузки всех изображений в .gallery
    function allGalleryImagesLoaded() {
        const images = document.querySelectorAll('.gallery img');
        return Array.from(images).every(img => img.complete && img.naturalHeight !== 0);
    }

    // Проверка загрузки всех ресурсов (картин, хедера, фона)
    function allResourcesLoaded() {
        const images = document.querySelectorAll('.gallery img');
        const headerLoaded = headerImage.complete && headerImage.naturalHeight !== 0;
        const bg = new Image();
        bg.src = getComputedStyle(document.body).backgroundImage.replace(/url\(["']?([^"')]+)["']?\)/, '$1');
        const bgLoaded = bg.complete && bg.naturalHeight !== 0;
        return Array.from(images).every(img => img.complete && img.naturalHeight !== 0) && headerLoaded && bgLoaded;
    }

    let audioCreated = false;
    let audioElement = null;
    let isPlaying = false;
    let isTransitioning = false;
    let playRequested = false;
    let audioShouldAutoCreate = false;

    const playIcon = playButton.querySelector('.play-icon');
    const pauseIcon = playButton.querySelector('.pause-icon');

    // Функция создания и запуска аудио
    async function createAndMaybePlayAudio(shouldPlay) {
        if (audioCreated) return;
        audioElement = document.createElement('audio');
        audioElement.id = 'background-music';
        audioElement.type = 'audio/mpeg';
        audioElement.loop = true;
        audioElement.src = 'design/vibe.mp3';
        document.body.appendChild(audioElement);
        audioCreated = true;
        if (shouldPlay) await audioElement.play();
    }

    // Следим за загрузкой всех ресурсов
    function onAllResourcesLoaded(callback) {
        if (allResourcesLoaded()) {
            callback();
        } else {
            const check = () => {
                if (allResourcesLoaded()) {
                    callback();
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        }
    }

    // После загрузки всех ресурсов — если пользователь не нажимал play, создаём аудио (но не играем)
    onAllResourcesLoaded(() => {
        if (!audioCreated && !playRequested) {
            createAndMaybePlayAudio(false);
        }
    });

    playButton.addEventListener('click', async () => {
        if (isTransitioning) return;
        isTransitioning = true;

        // Меняем иконку и состояние сразу
        if (!isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = '';
            isPlaying = true;
            playRequested = true;

            if (!audioCreated) {
                await createAndMaybePlayAudio(true);
            } else {
                await audioElement.play();
            }
        } else {
            playIcon.style.display = '';
            pauseIcon.style.display = 'none';
            isPlaying = false;
            if (audioElement) audioElement.pause();
        }
        isTransitioning = false;
    });

    // Показываем кнопку скролла и галерею только после полной загрузки хедера
    headerImage.onload = () => {
        scrollDownButton.classList.add('visible');
        playButton.classList.add('visible');
        gallery.classList.add('visible');
        gallery.classList.remove('gallery-hidden');
    };

    // Следим за загрузкой всех картин
    function onAllImagesLoaded(callback) {
        if (allGalleryImagesLoaded()) {
            callback();
        } else {
            const check = () => {
                if (allGalleryImagesLoaded()) {
                    callback();
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        }
    }

    // Protect images
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', e => e.preventDefault());
        img.addEventListener('selectstart', e => e.preventDefault());
    });
}); 