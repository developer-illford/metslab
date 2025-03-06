// document.addEventListener("DOMContentLoaded", function() {
//     let floatingIconsRt = document.querySelectorAll(".serv_floating_icon_rt");
//     let floatingIconsLt = document.querySelectorAll(".serv_floating_icon_lt");
//     let baseTopRt = 500; // Starting position in pixels
//     let baseTopLt = 800; // Starting position in pixels
//     let incrementRt = 600; // Increment value
//     let incrementLt = 600; // Increment value
//     let bodyHeight = document.body.scrollHeight; // Total height of the body


//     floatingIconsRt.forEach((icon, index) => {
//         icon.style.top = (baseTopRt + index * incrementRt) + "px";
//         if (icon.style.top > bodyHeight) {
//             icon.style.display = "none";
//         }
//     });

//     floatingIconsLt.forEach((icon, index) => {
//         icon.style.top = (baseTopLt + index * incrementLt) + "px";
//                 if (icon.style.top > bodyHeight) {
//             icon.style.display = "none";
//         }
//     });
// });


document.addEventListener("DOMContentLoaded", function() {
    let floatingIconsRt = document.querySelectorAll(".serv_floating_icon_rt");
    let floatingIconsLt = document.querySelectorAll(".serv_floating_icon_lt");

    let baseTopRt = 500; // Starting top position in pixels
    let incrementRt = window.innerWidth < 768 ? 800 : 2000; // Adjust increment based on screen width
    let baseTopLt = 1400; // Starting top position in pixels
    let incrementLt = window.innerWidth < 768 ? 800 : 2000; // Adjust increment based on screen width

    let bodyHeight = document.body.scrollHeight; // Total height of the body

    floatingIconsRt.forEach((icon, index) => {
        let computedTop = baseTopRt + index * incrementRt; // Calculate the top position
        icon.style.top = `${computedTop}px`;

        // Hide the icon if its top position exceeds the body height
        if (computedTop > bodyHeight) {
            icon.style.display = "none";
        }
    });

    floatingIconsLt.forEach((icon, index) => {
        let computedTop = baseTopLt + index * incrementLt; // Calculate the top position
        icon.style.top = `${computedTop}px`;

        // Hide the icon if its top position exceeds the body height
        if (computedTop > bodyHeight) {
            icon.style.display = "none";
        }
    });
});
