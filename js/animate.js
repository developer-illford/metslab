document.addEventListener("DOMContentLoaded", function () {
    // Select all elements with the "animate" class
    var animatedElements = document.querySelectorAll('.animate');

    function isElementInViewport(el) {
        var rect = el.getBoundingClientRect();
        return (
            rect.top <= window.innerHeight * 3 / 4 &&
            rect.bottom >= 0
        );
    }

    function handleScroll() {
        animatedElements.forEach(function (el) {
            // Check if each element is in the viewport
            if (isElementInViewport(el)) {
                // Add the specific animation class to trigger the animation
                el.classList.add('fade-in');
            }
        });

        // Filter out elements that have been animated and remove them from the list
        animatedElements = Array.prototype.filter.call(animatedElements, function (el) {
            return !el.classList.contains('fade-in');
        });

        // If all elements have been animated, remove the scroll event listener
        if (animatedElements.length === 0) {
            window.removeEventListener('scroll', handleScroll);
        }
    }

    // Add a scroll event listener to trigger the animation
    window.addEventListener('scroll', handleScroll);

    // Trigger the check on page load
    handleScroll();
});


































// SCROLL SCALING ANIMATION -- ADD THE CLASS .scroll-scale TO APPLY THIS ANIMATION TO ANY ELEMENT
// SCROLL SCALING ANIMATION -- ADD THE CLASS .scroll-scale TO APPLY THIS ANIMATION TO ANY ELEMENT
// SCROLL SCALING ANIMATION -- ADD THE CLASS .scroll-scale TO APPLY THIS ANIMATION TO ANY ELEMENT

// HTML
// Add this class to the element you want to animate: `scroll-scale`.

// CSS
const styles = `
.scroll-scale {
transform-origin: center;
transition: transform 0.1s ease-out;
}
`;

// Inject styles dynamically
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// JavaScript
function updateScaleOnScroll() {
    const elements = document.querySelectorAll('.scroll-scale');
    const windowHeight = window.innerHeight;

    elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top;

        // Calculate scale factor based on the scroll position
        let scale = 0.8; // Default scale

        if (elementTop >= 0 && elementTop <= windowHeight) {
            const progress = (windowHeight - elementTop) / windowHeight;
            scale = 0.8 + (0.2 * progress);
        } else if (elementTop > windowHeight) {
            scale = 0.8; // Reset scale when element is below the viewport
        } else if (elementTop < 0) {
            scale = 1; // Keep scale at 1 when element is above the viewport
        }

        element.style.transform = `scale(${scale})`;
    });
}

// Add scroll event listener
window.addEventListener('scroll', updateScaleOnScroll);

// Initial call to set scale on load
updateScaleOnScroll();





// function to change the color of header on scrolling
// function to change the color of header on scrolling
window.addEventListener("scroll", function () {
    let header_slide_2 = document.querySelector(".header_slide_2");
    let header = document.querySelector(".header");
    
    if (window.scrollY > 50) { // Change background when scrolled 50px down
        header_slide_2.style.backgroundColor = "#fff"; // Black with transparency
        header_slide_2.style.marginTop = "0px"
        header_slide_2.style.borderRadius = "0px"
        header.style.paddingLeft = "0px"
        header.style.paddingRight = "0px"
    } else {
        header_slide_2.style.backgroundColor = "#ffffffcc"; // Default white
        header_slide_2.style.marginTop = "10px"
        header_slide_2.style.borderRadius = "20px"
        header.style.paddingLeft = "10px"
        header.style.paddingRight = "10px"
    }
});
