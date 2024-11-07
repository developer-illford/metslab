document.addEventListener("DOMContentLoaded", function () {
    const progressBars = document.querySelectorAll('.progress-bar');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const percentage = bar.getAttribute('data-percentage');
                const fill = bar.querySelector('.progress-fill');
                fill.style.width = `${percentage}%`;
                observer.unobserve(bar); // Stop observing once the animation has started
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of the element is visible

    progressBars.forEach(bar => {
        observer.observe(bar);
    });
});