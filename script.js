document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const music = document.getElementById('background-music');
    const scrollThreshold = 300;

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

    // Handle background music
    music.play().catch(() => {
        document.body.onclick = () => music.play();
    });
}); 