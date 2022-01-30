'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

//event handler on the btnOpenModal(2)
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
/////////////////////////////////////////////////////
//scroll behaivour (old school way)
btnScrollTo.addEventListener('click', function (e) {
  //we need cordinates to which one scroll happen
  const s1Coords = section1.getBoundingClientRect();

  //scroll

  //for the scroll smooth behaviour we need top put window.scrollto object
  window.scrollTo({
    left: s1Coords.left + window.pageXOffset,
    top: s1Coords.top + window.pageYOffset,
    behavior: 'smooth',
  });

  /////////////////////////////////////////////////////
  //morden school way
  // section1.scrollIntoView({ behavior: 'smooth' });
});
//page navigation

//
//1) problem with that if we have 1000 of links then it copy 10000 line and it impact the performance
//
// document.querySelectorAll('.nav__link').forEach(mov =>
//   mov.addEventListener('click', function (el) {
//     el.preventDefault();
//     const id = this.getAttribute('href'); //this take the value of href
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   })
// );

// 2) method
// 1. add event listener to common parent element
// 2. determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
//tabbed component

tabsContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');
  //its find closest parent with this class which one it is own
  console.log(clicked);

  //gaurd clause
  if (!clicked) return;
  // active tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  clicked.classList.add('operations__tab--active');

  // activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add(`operations__content--active`);
});

//nav
const handleOver = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('.nav__logo');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// 1) one way to call a function into the addEventListener
// nav.addEventListener('mouseover', function (e) {
//   handleOver(e, 0.5);
// });

// 2) second way
nav.addEventListener('mouseover', handleOver.bind(0.5));
nav.addEventListener('mouseout', handleOver.bind(1));

//sticky navigation
// window.addEventListener('scroll', function (e) {});

// const obsCallback = function (entries, observe) {
//   entries.forEach(entry => console.log(entry));
// };
// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };
// const observe = new IntersectionObserver(obsCallback, obsOptions);
// observe.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);
const stickyNav = function (entries) {
  const [entry] = entries;
  //same => const entry = entries[0];
  // console.log(entry);
  // logic to remove and add header
  !entry.isIntersecting
    ? nav.classList.add('sticky')
    : nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, //90 is height of header
});
headerObserver.observe(header);

//reveal sections

// select all sections
const allsections = document.querySelectorAll('.section');
const allsection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  //observer to unobserve => each time when load the new section it observe that
  //but that not necessary;
  observer.unobserve(entry.target);
};
const revealSection = new IntersectionObserver(allsection, {
  root: null,
  threshold: 0.15,
});
allsections.forEach(element => {
  revealSection.observe(element);
  element.classList.add('section--hidden');
});

//lazy loading
const imgTargets = document.querySelectorAll('img[data-src]');
// console.log(imgTargets);

const loading = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) return;

  //replace src data-src;

  entry.target.src = entry.target.dataset.src;
  //why  use load event ? because if directly remove the class
  // then it load with blury img..
  //entry.target.classList.add('lazy--img')

  // load event only visible img when img load 100%
  entry.target.addEventListener('load', function () {
    this.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loading, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////////////////////
//slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class='dots__dot' data-slide='${i}'></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });
    document
      .querySelector(`.dots__dot[data-slide='${slide}']`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // slides.forEach(
  //   (s, i) => (s.style.transform = `translateX(${100 * i }%)`) //same = goToSlide(0);

  // before any operations
  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0); //1st slide active slide
  };
  init();
  // before loding
  //EventHandlers
  //btnRight
  const nextSlide = function () {
    curSlide === maxSlide - 1 ? (curSlide = 0) : curSlide++;
    goToSlide(curSlide);
    //curslide=-100% ,0%,100%,200%
    activateDot(curSlide);
  };
  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  //0%,100%,200%,300%
  document.addEventListener('keydown', function (e) {
    console.log(e);
    if (e.key === 'l' || e.key === 'ArrowRight') nextSlide();
    (e.key === 'j' || e.key === 'ArrowLeft') && prevSlide();
  });

  //dots
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset; //dataset is object
      //same => const slide =e.target.dataset.slide

      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/*
//selecting elements
console.log(document.documentElement); //select the entire web page
console.log(document.head); //select head
console.log(document.body); //select body

const header = document.querySelector('.header');
document.querySelectorAll('.section');
const allSections = document.querySelectorAll('section');
console.log(allSections);
//select element by tag Name
const allBtn = document.getElementsByTagName('button');
console.log(allBtn);
const allcls = document.getElementsByClassName('btn');
console.log(allcls);

//////////////////////////////////////////////////////
//creating and inserting elements
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookied for improved functionality and analytics';
message.innerHTML =
  'We use cookied for improved functionality and analytics,<button class = "btn btn--close-cookie">Got it!</button>';
header.append(message);

//delete elements

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    // message.remove();//new way to delete elements
    message.parentElement.removeChild(message);
  });
/////////////////////////////////
//style
message.style.width = '120%';
message.style.background = '#37383d';
console.log(getComputedStyle(message).height);
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

/////////////////////////////////////////////////////
//scroll behaivour (old school way)
const btnScrollTo = document.querySelector('.btn--scroll-to');
//which one the scroll happen
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  //we need cordinates to which one scroll happen
  const s1Coords = section1.getBoundingClientRect();
  console.log(s1Coords);

  console.log(e.target.getBoundingClientRect());
  console.log(`x`, window.pageXOffset, `y`, window.pageYOffset);
  console.log(
    `height and width`,
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );
  //scroll
  // window.scrollTo(
  //   s1Coords.left + window.pageXOffset,
  //   s1Coords.top + window.pageYOffset
  // );
  //s1.left and s1.top is according viewport not the document itself

  /////////
  ///////////
  //for the scroll smooth behaviour we need top put window.scrollto object
  //   window.scrollTo({
  //     left: s1Coords.left + window.pageXOffset,
  //     top: s1Coords.top + window.pageYOffset,
  //     behavior: 'smooth',
  //   });

  /////////////////////////////////////////////////////
  //morden school way
  //1) we want to select these element which we want scroll to
  section1.scrollIntoView({ behavior: 'smooth' });
});
//eventListener
// const h1 = document.querySelector('button');
// h1.addEventListener('mouseenter', function (e) {
//   e.target.style.backgroundColor = 'blue';
// });

//////////////////////////////////////////////////////
//bubbling(propogation bottom to top or child to root element)
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('Link', e.target, e.currentTarget);

  //stop propagation
  e.stopPropagation();
});
document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('Nav', e.target, e.currentTarget);
});
document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('header', e.target, e.currentTarget);
});
///////////////////////////////////////////////////////
// const btnop = document.querySelector('.operations__tab');
// btnop.addEventListener('click', function () {
//   const foot = document.querySelector('.header');
//   const bound = foot.getBoundingClientRect();
//   console.log('x', bound.left, 'y', bound.bottom, 'x', window.pageYOffset);
//   window.scrollTo({
//     left: bound.left + window.pageXOffset,
//     top: bound.top + window.pageYOffset,
//     behavior: 'smooth',
//   });
//   // foot.scrollIntoView({ behavior: 'smooth' });
// });

////////////////////////////////////////////////////////////////////////////////////////////////////
// dom traversing
const h1 = document.querySelector('h1');

//going downwards child
console.log(h1.querySelectorAll('.highlight')); // it select their children or children of children which have the 'highlight'
console.log(h1.children); //it select direct children
console.log(h1.childNodes); // it select everything
// first element
console.log(h1.firstElementChild);
console.log(h1.lastChild);
console.log(document.body.children);

// Going upwords parents
console.log(h1.parentElement);
console.log(h1.parentNode);

h1.closest('.header').style.background = 'var(--gradient-secondary)';

//going sideways :siblings
console.log(h1.previousElementSibling); //previous sibling
console.log(h1.nextElementSibling); //next one sibling

console.log(h1.parentElement.children); //select all direct children

console.log(
  [...h1.parentElement.children].forEach(mov => {
    if (mov !== h1) {
      mov.style.backgroundColor = 'red';
    }
  })
);
*/
