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




document.addEventListener("DOMContentLoaded", () => {
    const progressBoxes = document.querySelectorAll(".progress_box");

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBox = entry.target;
                const percentElement = progressBox.querySelector(".percent");
                const dataNum = parseInt(percentElement.getAttribute("data-num"), 10);

                // Set CSS variable dynamically for animation
                percentElement.style.setProperty("--num", dataNum);

                // Add the 'active' class to trigger animations
                progressBox.classList.add("active");

                // Stop observing this element after triggering
                observer.unobserve(progressBox);
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of the element is visible

    // Observe each progress box
    progressBoxes.forEach(box => observer.observe(box));
});