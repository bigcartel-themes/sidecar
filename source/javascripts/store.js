"use strict";

document.addEventListener('DOMContentLoaded', function() {
  document.body.classList.remove("preloader");

  let contactFields = document.querySelectorAll('.contact-field input, .contact-field textarea');
  contactFields.forEach(function(contactField) {
    contactField.removeAttribute('tabindex');
  });
  const numShades = 5;

  let cssProperties = [];

  for (const themeColor in themeColors) {
    const hexValue = themeColors[themeColor];
    var hsl = tinycolor(hexValue).toHsl();
    for (var i = numShades - 1; i >= 0; i -= 1) {
      hsl.l = (i + 0.5) / numShades;
      cssProperties.push(`--${camelCaseToDash(themeColor)}-${i * 100 / 1000 * 200}: ${tinycolor(hsl).toRgbString()};`)
    }
    numColor = tinycolor(hexValue).toRgb();
    cssProperties.push(`--${camelCaseToDash(themeColor)}-rgb: ${numColor['r']}, ${numColor['g']}, ${numColor['b']};`)
  }

  const headTag = document.getElementsByTagName('head')[0];
  const styleTag = document.createElement("style");

  styleTag.innerHTML = `
    :root {
      ${cssProperties.join('\n')}
    }
  `;
  headTag.appendChild(styleTag);
});

window.addEventListener("load", () => {
  document.body.classList.remove("transition-preloader");
});

document.addEventListener('DOMContentLoaded', () => {
  const isHomePage = document.body.getAttribute('data-bc-page-type') === 'home';
  const slideshowLink = themeOptions.homepageSlideshowLink && themeOptions.homepageSlideshowLink.trim() !== '' ? themeOptions.homepageSlideshowLink : null;
  
  if (isHomePage && slideshowLink) {
    const slideshow = document.querySelector(".home-slideshow");
    
    if (slideshow) {
      // Add styling and accessibility attributes to individual slides
      const slides = slideshow.querySelectorAll('.splide__slide');
      slides.forEach(slide => {
        slide.classList.add("slideshow-clickable");
        slide.setAttribute("role", "button");
        slide.setAttribute("aria-label", "Navigate to " + slideshowLink);
      });

      // Use event delegation with a single listener on the slideshow container
      slideshow.addEventListener("click", function(event) {
        // Don't interfere with splide controls - only handle clicks on slide content
        if (!event.target.closest('.splide__arrow, .splide__pagination')) {
          const clickedSlide = event.target.closest('.splide__slide');
          if (clickedSlide) {
            event.preventDefault();
            event.stopPropagation();
            if (isExternalLink(slideshowLink)) {
              window.open(slideshowLink, '_blank', 'noopener,noreferrer');
            } else {
              window.location.href = slideshowLink;
            }
          }
        }
      });
    }
  }
  
  // Featured Categories Collage Initialization
  function initCategoryCollages() {
    if (!isHomePage) return;
    if (typeof setupCategoryCollages === 'function') {
      setupCategoryCollages({
        collage: {
          width: 800,
          height: 800,
          gap: 1
        },
        observer: {
          rootMargin: '200px 0px',
          threshold: 0.01
        }
      });
    }
  }
  
  // Initialize category collages
  initCategoryCollages();
});

const htmlHighlight = function(element, newText) {
  element.style.transition = "opacity .2s ease";
  element.style.opacity = 0;
  setTimeout(() => {
    element.innerHTML = newText;
    element.style.opacity = 1;
  }, 200)
}

$('.menu, .sidebar-close').on('click', function(e) {
  document.body.classList.toggle('show_menu')
});
$('.announcement-message-close').click(function(e) {
  $('.announcement-message').slideUp('fast', function() {
    $('.announcement-message').removeClass('visible');
    setCookie('hide-announcement-message',hashedMessage,7);
  });
})