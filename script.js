const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// Проверяем, открыт ли файл локально
const isLocalFile = window.location.protocol === 'file:';

document.addEventListener('DOMContentLoaded', () => {
    const headerImage = new Image();
    headerImage.src = 'design/header.webp';

    const header = document.querySelector('.header');
    const gallery = document.querySelector('.gallery');
    const scrollDownButton = document.querySelector('.scroll-down');
    const playButton = document.querySelector('.play');
    const music = document.getElementById('background-music');
    const scrollThreshold = window.innerWidth < 1024 ? 100 : 300;
    
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
    const loadingIcon = playButton.querySelector('.loading-icon');

    // Функция создания и запуска аудио
    async function createAndMaybePlayAudio(shouldPlay) {
        if (audioCreated) return;
        
        if (shouldPlay) {
            showLoader();
        }
        
        audioElement = document.createElement('audio');
        audioElement.id = 'background-music';
        audioElement.type = 'audio/mpeg';
        audioElement.loop = true;
        audioElement.src = 'design/vibe.mp3';
        
        // Обработка буферизации во время воспроизведения
        audioElement.addEventListener('waiting', () => {
            if (isPlaying) showLoader();
        });

        // Обработка возобновления воспроизведения
        audioElement.addEventListener('playing', () => {
            if (isPlaying) hideLoader();
        });

        // Обработка ошибок воспроизведения
        audioElement.addEventListener('error', () => {
            if (isPlaying) {
                // Пробуем воспроизвести через небольшой интервал
                setTimeout(() => {
                    audioElement.play().then(() => {
                        isPlaying = true;
                    }).catch(() => {
                        // Если не удалось, пробуем еще раз через большую задержку
                        setTimeout(() => audioElement.play(), 500);
                    });
                }, 250);
            }
        });

        // Ждем загрузки аудио
        await new Promise((resolve) => {
            let playbackStarted = false;

            // Проверяем прогресс загрузки
            audioElement.addEventListener('progress', () => {
                if (playbackStarted) return;
                
                if (audioElement.buffered.length > 0) {
                    const bufferedEnd = audioElement.buffered.end(audioElement.buffered.length - 1);
                    
                    // Если загружено больше 30 секунд, начинаем воспроизведение
                    if (bufferedEnd >= 30 && shouldPlay) {
                        playbackStarted = true;
                        hideLoader();
                        
                        // На мобильных устройствах может потребоваться несколько попыток
                        const attemptPlayback = () => {
                            audioElement.play().then(() => {
                                isPlaying = true;
                            }).catch(() => {
                                // Если не удалось воспроизвести, пробуем еще раз через небольшую задержку
                                setTimeout(attemptPlayback, 500);
                            });
                        };
                        
                        attemptPlayback();
                    }
                }
            });

            // Ждем полной загрузки для resolve
            audioElement.addEventListener('canplaythrough', () => {
                if (!playbackStarted && shouldPlay) {
                    const attemptPlayback = () => {
                        audioElement.play().then(() => {
                            isPlaying = true;
                            hideLoader();
                        }).catch(() => {
                            setTimeout(attemptPlayback, 100);
                        });
                    };
                    
                    attemptPlayback();
                }
                resolve();
            }, { once: true });
            
            document.body.appendChild(audioElement);
        });
        
        audioCreated = true;
        
        if (!shouldPlay) {
            playIcon.style.display = '';
            pauseIcon.style.display = 'none';
        }
    }

    // Вспомогательные функции для управления лоадером
    function showLoader() {
        if (!playButton.classList.contains('loading')) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'none';
            loadingIcon.style.display = '';
            playButton.classList.add('loading');
            // Force a reflow to ensure animation restarts
            void playButton.offsetWidth;
        }
    }

    function hideLoader() {
        if (playButton.classList.contains('loading')) {
            loadingIcon.style.display = 'none';
            playButton.classList.remove('loading');
            if (isPlaying) {
                pauseIcon.style.display = '';
                playIcon.style.display = 'none';
            } else {
                playIcon.style.display = '';
                pauseIcon.style.display = 'none';
            }
        }
    }

    // Добавляем обработчик для поддержания анимации при скролле
    window.addEventListener('scroll', () => {
        if (playButton.classList.contains('loading')) {
            // Force a reflow to ensure animation continues
            void playButton.offsetWidth;
        }
    }, { passive: true });

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

    // Функция для плавного увеличения громкости
    function fadeInVolume(audio, callback) {
        const fadeDuration = 2000; // 2 секунды
        const fadeSteps = 100;
        const fadeInterval = fadeDuration / fadeSteps;
        let currentStep = 0;

        const interval = setInterval(() => {
            currentStep++;
            audio.volume = currentStep / fadeSteps;
            if (currentStep >= fadeSteps) {
                clearInterval(interval);
                audio.volume = 1;
                if (callback) callback();
            }
        }, fadeInterval);
    }

    // Функция для плавного уменьшения громкости
    function fadeOutVolume(audio, callback) {
        const fadeDuration = 2000; // 2 секунды
        const fadeSteps = 100;
        const fadeInterval = fadeDuration / fadeSteps;
        let currentStep = fadeSteps;

        const interval = setInterval(() => {
            currentStep--;
            audio.volume = currentStep / fadeSteps;
            if (currentStep <= 0) {
                clearInterval(interval);
                audio.volume = 0;
                if (callback) callback();
            }
        }, fadeInterval);
    }

    playButton.addEventListener('click', async () => {
        if (isTransitioning) return; // Предотвращаем множественные клики во время перехода
        isTransitioning = true;

        // Обновляем иконки сразу
        if (!isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = '';
        } else {
            playIcon.style.display = '';
            pauseIcon.style.display = 'none';
        }

        try {
            if (!isPlaying) {
                playRequested = true;

                if (!audioCreated) {
                    showLoader(); // Показываем лоадер во время создания аудио

                    audioElement = document.createElement('audio');
                    audioElement.id = 'background-music';
                    audioElement.type = 'audio/mpeg';
                    audioElement.loop = true;
                    audioElement.src = 'design/vibe.mp3';
                    audioElement.volume = 0; // Начинаем с громкости 0

                    document.body.appendChild(audioElement);

                    // Ждем, пока аудио станет готовым к воспроизведению
                    await new Promise((resolve, reject) => {
                        audioElement.addEventListener('canplay', resolve, { once: true });
                        audioElement.addEventListener('error', reject, { once: true });
                    });

                    // Попытка воспроизведения аудио
                    try {
                        await audioElement.play();
                        audioCreated = true;
                        isPlaying = true;

                        fadeInVolume(audioElement, () => {
                            isTransitioning = false;
                        }); // Плавное увеличение громкости
                        hideLoader();
                    } catch (playError) {
                        console.error('Playback error on mobile:', playError);
                        hideLoader();
                        isTransitioning = false;
                        return;
                    }
                } else {
                    showLoader();
                    audioElement.volume = 0; // Начинаем с громкости 0

                    // Попытка воспроизведения аудио
                    try {
                        await audioElement.play();
                        isPlaying = true;

                        fadeInVolume(audioElement, () => {
                            isTransitioning = false;
                        }); // Плавное увеличение громкости
                        hideLoader();
                    } catch (playError) {
                        console.error('Playback error on mobile:', playError);
                        hideLoader();
                        isTransitioning = false;
                        return;
                    }
                }
            } else {
                fadeOutVolume(audioElement, () => {
                    audioElement.pause();
                    isPlaying = false;
                    isTransitioning = false;
                }); // Плавное уменьшение громкости перед паузой
            }
        } catch (error) {
            console.error('Playback error:', error);
            hideLoader();

            // Возвращаем иконки в предыдущее состояние в случае ошибки
            if (isPlaying) {
                playIcon.style.display = 'none';
                pauseIcon.style.display = '';
            } else {
                playIcon.style.display = '';
                pauseIcon.style.display = 'none';
            }
            isTransitioning = false;
        }
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