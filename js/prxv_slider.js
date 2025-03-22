function lerp({ x, y }, { x: targetX, y: targetY }) {
    const fraction = 0.1;
    x += (targetX - x) * fraction;
    y += (targetY - y) * fraction;
    return { x, y };
}

class prxv_slider {
    constructor(el) {
        this.el = el;
        this.contentEl = document.getElementById("prxv_slider-content");
        this.image = el.getElementsByTagName("img")[0];

        this.onMouseMove = this.onMouseMove.bind(this);

        window.addEventListener("resize", this.onResize.bind(this));
        this.onResize();

        this.lastX = this.lastY = this.targetX = this.targetY = 0;
    }

    onResize() {
        const htmlStyles = getComputedStyle(document.documentElement);
        const mobileBreakpoint = htmlStyles.getPropertyValue("--mobile-bkp");

        this.isMobile = matchMedia(
            `only screen and (max-width: ${mobileBreakpoint})`
        ).matches;

        this.halfWidth = innerWidth / 2;
        this.halfHeight = innerHeight / 2;
        this.zDistance = htmlStyles.getPropertyValue("--z-distance");

        if (!this.isMobile && !this.mouseWatched) {
            this.mouseWatched = true;
            this.el.addEventListener("mousemove", this.onMouseMove);
            this.contentEl.style.setProperty(
                "transform",
                `translateZ(${this.zDistance})`
            );

            // Set background image
            this.setBackgroundImage();
        } else if (this.isMobile && this.mouseWatched) {
            this.mouseWatched = false;
            this.el.removeEventListener("mousemove", this.onMouseMove);
            this.contentEl.style.setProperty("transform", "none");
        }
    }

    setBackgroundImage() {
        const imageUrl = `url(${this.image.src})`;
        this.el.style.setProperty("--img-prev", imageUrl);
    }

    getMouseCoefficients({ pageX, pageY } = {}) {
        const xCoeff = ((pageX || this.targetX) - this.halfWidth) / this.halfWidth;
        const yCoeff = (this.halfHeight - (pageY || this.targetY)) / this.halfHeight;
        return { xCoeff, yCoeff };
    }

    onMouseMove({ pageX, pageY }) {
        this.targetX = pageX;
        this.targetY = pageY;

        if (!this.animationRunning) {
            this.animationRunning = true;
            this.runAnimation();
        }
    }

    runAnimation() {
        if (this.animationStopped) {
            this.animationRunning = false;
            return;
        }

        const maxX = 10;
        const maxY = 10;

        const newPos = lerp(
            { x: this.lastX, y: this.lastY },
            { x: this.targetX, y: this.targetY }
        );

        const { xCoeff, yCoeff } = this.getMouseCoefficients({
            pageX: newPos.x,
            pageY: newPos.y
        });

        this.lastX = newPos.x;
        this.lastY = newPos.y;

        this.positionImage({ xCoeff, yCoeff });

        this.contentEl.style.setProperty(
            "transform",
            `translateZ(${this.zDistance}) rotateX(${maxY * yCoeff}deg) rotateY(${maxX * xCoeff}deg)`
        );

        if (this.reachedFinalPoint) {
            this.animationRunning = false;
        } else {
            requestAnimationFrame(this.runAnimation.bind(this));
        }
    }

    get reachedFinalPoint() {
        const lastX = ~~this.lastX;
        const lastY = ~~this.lastY;
        return (
            (lastX === this.targetX || lastX - 1 === this.targetX || lastX + 1 === this.targetX) &&
            (lastY === this.targetY || lastY - 1 === this.targetY || lastY + 1 === this.targetY)
        );
    }

    positionImage({ xCoeff, yCoeff }) {
        const maxImgOffset = 1;
        this.image.style.setProperty(
            "transform",
            `translateX(${maxImgOffset * -xCoeff}em) translateY(${maxImgOffset * yCoeff}em)`
        );
    }
}

const prxv_sliderEl = document.getElementById("prxv_slider");
new prxv_slider(prxv_sliderEl);