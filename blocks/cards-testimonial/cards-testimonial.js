import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-testimonial-card-image';
      else div.className = 'cards-testimonial-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    // Only optimize same-origin raster images. External hosts (e.g. omegaxl.com)
    // and SVGs are left as plain <img> — the EDS optimizer rewrites them to
    // same-origin paths that 404 and strips SVGs incorrectly.
    const isSvg = /\.svg(\?|$)/i.test(img.src);
    let sameOrigin = false;
    try {
      sameOrigin = new URL(img.src, window.location.href).origin === window.location.origin;
    } catch (e) {
      sameOrigin = false;
    }
    if (sameOrigin && !isSvg) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      img.closest('picture').replaceWith(optimizedPic);
    }
  });
  block.textContent = '';
  block.append(ul);
}
