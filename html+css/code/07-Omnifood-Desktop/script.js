console.log("Hello");

const h1 = document.querySelector(".heading-primary");

const yearEl = document.querySelector(".year");
const currentYear = new Date().getFullYear();
yearEl.textContent = currentYear;

////////////////////////////////////////////////////////////
// make mobile navigation work
////////////////////////////////////////////////////////////

const btnNavEL = document.querySelector(".btn--mobile-nav");
const headerEl = document.querySelector(".header");

btnNavEL.addEventListener("click", function () {
  headerEl.classList.toggle("nav-open"); // toggle：如果没有nav-open，就添加nav-open；否则就删除nav-open
});

const allLinks = document.querySelectorAll("a:link");

allLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
    // e.preventDefault();
    const href = link.getAttribute("href");
    if (href == "#")
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    if (link.classList.contains("main-nav-link")) {
      headerEl.classList.toggle("nav-open"); // toggle：如果没有nav-open，就添加nav-open；否则就删除nav-open
    }
  });
});

/* 当离开hero section后，sticky nav就消失 */
const sectionHeroEl = document.querySelector(".section-hero");

const obs = new IntersectionObserver(
  function (entries) {
    const ent = entries[0];
    if (ent.isIntersecting == false) {
      console.log(ent);
      document.body.classList.add("sticky");
    }
    if (ent.isIntersecting == true) {
      console.log(ent);
      document.body.classList.remove("sticky");
    }
  },
  {
    root: null,
    threshold: 0,
    rootMargin: "-80px",
  }
);

obs.observe(sectionHeroEl);
