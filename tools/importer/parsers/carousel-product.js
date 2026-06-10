/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-product. Base block: carousel.
 * Source: https://www.omegaxl.com/ (selectors: #oxl-product-slider-1, #oxl-product-slider-2)
 * Project type: xwalk (field hints required).
 * Generated: 2026-06-09
 *
 * Source structure: a Hyva product slider. Real product slides are `div.js_slide`,
 * each wrapping a `<form>` with a product image (a.product-item-photo img), a product
 * title (.product-item-link h3) and a "Shop Now" CTA (a.btn-primary). Empty placeholder
 * slides (`div.js_dummy_slide`) and nav scaffolding (`<template>`) are skipped, as are any
 * duplicate/cloned/aria-hidden slides a slick-style slider might emit.
 *
 * Output (carousel block, model carousel-item):
 *   Row 1: block name "Carousel"
 *   Each subsequent row = one unique slide:
 *     cell 1 -> media_image (reference): product <img> (alt collapses into media_imageAlt)
 *     cell 2 -> content_text (richtext): product title heading + Shop Now CTA link
 */
export default function parse(element, { document }) {
  // Collect real product slides only. `.js_slide` are content slides; `.js_dummy_slide`
  // are empty spacers. Also defend against slick-style cloned/hidden duplicates.
  const slides = Array.from(element.querySelectorAll('.js_slide'))
    .filter((slide) => {
      if (slide.classList.contains('slick-cloned')) return false;
      if (slide.getAttribute('aria-hidden') === 'true' && slide.classList.contains('slick-cloned')) return false;
      // Must contain a real product form (skip dummy/empty slides)
      return !!slide.querySelector('form');
    });

  const cells = [['Carousel']];
  const seen = new Set();

  slides.forEach((slide) => {
    // Product image: the actual product photo (skip the empty overlay link).
    const image = slide.querySelector('a.product-item-photo img, .omegaxl-products-carousel-grid-uniformity-default-item-image img, img.product-image-photo');

    // Product title heading.
    const heading = slide.querySelector('.product-item-link h3, [class*="item-title"] h3, h3');

    // Title text is used to de-duplicate cloned/duplicate slides.
    const key = (heading ? heading.textContent : '').trim().toLowerCase()
      || (image ? (image.getAttribute('src') || '') : '');
    if (key && seen.has(key)) return;
    if (key) seen.add(key);

    // "Shop Now" CTA. Build a clean anchor preserving href + label, dropping the inner span markup.
    const ctaSource = slide.querySelector('a.btn-primary, a[class*="add-to-cart-btn"]');
    let cta = null;
    if (ctaSource) {
      cta = document.createElement('a');
      cta.setAttribute('href', ctaSource.getAttribute('href') || '');
      const ctaTitle = ctaSource.getAttribute('title');
      if (ctaTitle) cta.setAttribute('title', ctaTitle);
      cta.textContent = (ctaSource.textContent || 'Shop Now').trim();
    }

    // --- Cell 1: media_image (reference). Alt collapses into media_imageAlt (no hint). ---
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:media_image '));
    if (image) imageCell.appendChild(image);

    // --- Cell 2: content_text (richtext): title heading + Shop Now CTA. ---
    const contentCell = document.createDocumentFragment();
    contentCell.appendChild(document.createComment(' field:content_text '));
    if (heading) {
      const h = document.createElement('h2');
      h.textContent = (heading.textContent || '').trim();
      contentCell.appendChild(h);
    }
    if (cta) {
      const p = document.createElement('p');
      p.appendChild(cta);
      contentCell.appendChild(p);
    }

    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-product', cells });
  element.replaceWith(block);
}
