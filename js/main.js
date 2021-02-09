gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

function initNavigation() {
    const mainNavLinks = gsap.utils.toArray(".main-nav a");
    const mainNavLinksRev = gsap.utils.toArray(".main-nav a").reverse();

    mainNavLinks.forEach((link) => {
        link.addEventListener("mouseleave", () => {
            link.classList.add("animate-out");
            setTimeout(() => {
                link.classList.remove("animate-out");
            }, 300);
        });
    });

    function navAnimation(direction) {
        const scrollingDown = direction === 1;
        const links = scrollingDown ? mainNavLinks : mainNavLinksRev;
        return gsap.to(links, {
            duration: 0.3,
            stagger: 0.05,
            autoAlpha: () => (scrollingDown ? 0 : 1),
            y: () => (scrollingDown ? 20 : 0),
        });
    }

    ScrollTrigger.create({
        start: 100,
        end: "bottom bottom-=200",
        toggleClass: {
            targets: "body",
            className: "has-scrolled",
        },
        ease: "Power4.out",
        onEnter: ({ direction }) => navAnimation(direction),
        onLeaveBack: ({ direction }) => navAnimation(direction),
    });
}

function initHeaderTilt() {
    document.querySelector("header").addEventListener("mousemove", moveImages);
}

function moveImages(e) {
    const { offsetX, offsetY, target } = e;
    const { clientWidth, clientHeight } = target;

    const xPos = offsetX / clientWidth - 0.5;
    const yPos = offsetY / clientHeight - 0.5;

    const leftImages = gsap.utils.toArray(".hg__left .hg__image");
    const rightImages = gsap.utils.toArray(".hg__right .hg__image");

    const modifier = (index) => index * 2.2 + 1;
    leftImages.forEach((image, index) => {
        gsap.to(image, {
            duration: 1.2,
            x: xPos * 20 * modifier(index),
            y: yPos * 10 * modifier(index),
            rotationY: xPos * 40,
            rotationX: yPos * 10,
            ease: "Power3.out",
        });
    });
    rightImages.forEach((image, index) => {
        gsap.to(image, {
            duration: 1.2,
            x: xPos * 20 * modifier(index),
            y: -yPos * 10 * modifier(index),
            rotationY: xPos * 40,
            rotationX: yPos * 10,
            ease: "Power3.out",
        });
    });

    gsap.to(".decor__circle", {
        duration: 1.7,
        duration: 1.2,
        x: xPos * 100,
        y: yPos * 120,
        ease: "Power4.out",
    });
}

function createHoverReveal(e) {
    const {
        imageBlock,
        imageMask,
        text,
        textCopy,
        textMask,
        textP,
        image,
    } = e.target;

    let t1 = gsap.timeline({
        defaults: {
            duration: 0.7,
            ease: "Power4.out",
        },
    });

    if (e.type === "mouseenter") {
        t1.to([imageMask, imageBlock, textMask, textP], {
            duration: 1,
            yPercent: 0,
        })
            .to(
                text,
                {
                    y: () => -textCopy.clientHeight / 2,
                },
                0
            )
            .to(
                image,
                {
                    duration: 1.1,
                    scale: 1,
                },
                0
            );
    }

    if (e.type === "mouseleave") {
        t1.to([imageMask, textP], {
            yPercent: 100,
        })
            .to(
                [imageBlock, textMask],
                {
                    yPercent: -101,
                },
                0
            )
            .to(
                text,
                {
                    y: 0,
                },
                0
            )
            .to(
                image,
                {
                    scale: 1.2,
                },
                0
            );
    }
    return t1;
}

const sections = document.querySelectorAll(".rg__column");

function initHoverReveal() {
    sections.forEach((section) => {
        section.imageBlock = section.querySelector(".rg__image");
        section.image = section.querySelector(".rg__image img");
        section.imageMask = section.querySelector(".rg__image--mask");
        section.text = section.querySelector(".rg__text");
        section.textCopy = section.querySelector(".rg__text--copy");
        section.textMask = section.querySelector(".rg__text--mask");
        section.textP = section.querySelector(".rg__text--copy p");

        // reset initial position
        gsap.set([section.imageBlock, section.textMask], {
            yPercent: -101,
        });
        gsap.set([section.imageMask, section.textP], {
            yPercent: 100,
        });
        gsap.set(section.image, { scale: 1.2 });

        // animation setting
        section.addEventListener("mouseenter", createHoverReveal);
        section.addEventListener("mouseleave", createHoverReveal);
    });
}
const allLinks = gsap.utils.toArray(".portfolio__categories a");
const largeImage = document.querySelector(".portfolio__image--l");
const smallImage = document.querySelector(".portfolio__image--s");
const lInside = document.querySelector(".portfolio__image--l .image_inside");
const sInside = document.querySelector(".portfolio__image--s .image_inside");

const updateBodyColor = (color) => {
    // gsap.to('.fill-background', {backgroundColor: color, ease: 'none'})
    document.documentElement.style.setProperty("--bcg-fill-color", color);
};
function initPortfoliohover() {
    allLinks.forEach((link) => {
        link.addEventListener("mouseenter", createPortfolioHover);
        link.addEventListener("mouseleave", createPortfolioHover);
        link.addEventListener("mousemove", createPortfolioMove);
    });
}

function createPortfolioHover(e) {
    if (e.type === "mouseenter") {
        const { color, imagelarge, imagesmall } = e.target.dataset;
        const allSiblings = allLinks.filter((item) => item !== e.target);
        const tl = gsap.timeline();
        tl.set(lInside, { backgroundImage: `url(${imagelarge}` })
            .set(sInside, { backgroundImage: `url(${imagesmall}` })
            .to([largeImage, smallImage], { duration: 1, autoAlpha: 1 })
            .to(allSiblings, { color: "#fff", autoAlpha: 0.2 }, 0)
            .to(e.target, { color: "#fff", autoAlpha: 1 }, 0);
        updateBodyColor(color);
    }
    if (e.type === "mouseleave") {
        const tl = gsap.timeline();

        tl.to([largeImage, smallImage], { autoAlpha: 0 }).to(
            allLinks,
            { color: "#000000", autoAlpha: 1 },
            0
        );
        updateBodyColor("#acb7ae");
    }
}

function getPortfolioOffset(clientY) {
    return -(
        document.querySelector(".portfolio__categories").clientHeight - clientY
    );
}

function createPortfolioMove(e) {
    const { clientY } = e;
    gsap.to(largeImage, {
        duration: 1.2,
        y: getPortfolioOffset(clientY) / 6,
        x: -getPortfolioOffset(clientY) / 8,
        ease: "Power3.out",
    });

    gsap.to(smallImage, {
        duration: 1.5,
        y: getPortfolioOffset(clientY) / 3,
        x: -getPortfolioOffset(clientY) / 9,
        ease: "Power3.out",
    });
}
function initImageParallax() {
    gsap.utils.toArray(".with-parallax").forEach((section) => {
        const image = section.querySelector("img");

        gsap.to(image, {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top bottom",
                scrub: 1,
            },
        });
    });
}
function initPinSteps() {
    ScrollTrigger.create({
        trigger: ".fixed-nav",
        start: "top center",
        endTrigger: "#stage4",
        end: "center center",
        pin: true,
        pinReparent: true,
    });

    const getVh = () => {
        const vh = Math.max(
            document.documentElement.clientHeight || 0,
            window.innerHeight || 0
        );
        return vh;
    };

    gsap.utils.toArray(".stage").forEach((stage, index) => {
        const navLinks = gsap.utils.toArray(".fixed-nav li");

        ScrollTrigger.create({
            trigger: stage,
            start: "top center",
            end: () => `+=${stage.clientHeight + getVh() / 10}`,
            toggleClass: {
                targets: navLinks[index],
                className: "is-active",
            },
            onEnter: () => updateBodyColor(stage.dataset.color),
            onEnterBack: () => updateBodyColor(stage.dataset.color),
        });
    });
}
function initScrollTo() {
    // find all links and animate to the right position
    gsap.utils.toArray(".fixed-nav a").forEach((link) => {
        const target = link.getAttribute("href");

        link.addEventListener("click", (e) => {
            e.preventDefault();
            gsap.to(window, {
                duration: 1.5,
                scrollTo: target,
                ease: "Power2.out",
            });
        });
    });
}
function init() {
    initNavigation();
    initHeaderTilt();
    initPortfoliohover();
    initImageParallax();
    initPinSteps();
    initScrollTo();
}

window.addEventListener("load", function () {
    init();
});

// define breakpoints
const mq = window.matchMedia("(min-width: 768px)");

// add change eventlisteners for these bp
mq.addEventListener("change", handleWidthChange);

// first page load
handleWidthChange(mq);

function resetProps(elements) {
    gsap.killTweensOf("*");
    if (elements.length) {
        elements.forEach((el) => {
            el && gsap.set(el, { clearProps: "all" });
        });
    }
}

function handleWidthChange(mq) {
    // check if we are on the right breakpoint
    if (!mq.matches) {
        // width is less than 768px
        // remove event listeners

        sections.forEach((section) => {
            section.removeEventListener("mouseenter", createHoverReveal);
            section.removeEventListener("mouseleave", createHoverReveal);
            const {
                imageBlock,
                imageMask,
                text,
                textCopy,
                textMask,
                textP,
                image,
            } = section;
            resetProps([
                imageBlock,
                imageMask,
                text,
                textCopy,
                textMask,
                textP,
                image,
            ]);
        });
    } else {
        // init hover animation
        initHoverReveal();
    }
}

let container = document.querySelector("#scroll-container");

let height;

function setHeight() {
    height = container.clientHeight;
    document.body.style.height = `${height}px`;
}
ScrollTrigger.addEventListener("refreshInit", setHeight);

gsap.to(container, {
    y: () => -(height - document.documentElement.clientHeight),
    ease: "none",
    scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        invalidateOnRefresh: true,
    },
});
