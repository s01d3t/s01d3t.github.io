document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const music = document.getElementById('background-music');
    const scrollThreshold = 300;
    const scrollDownButton = document.querySelector('.scroll-down');

    // Initialize scroll position
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Handle header opacity on scroll
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const opacity = currentScrollY > scrollThreshold 
            ? Math.max(0, 1 - (currentScrollY - scrollThreshold) / 400)
            : 1;
        
        header.style.opacity = opacity;
        header.classList.toggle('hidden', opacity === 0);
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
}); 