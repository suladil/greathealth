/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base block: hero.
 * Source: https://www.omegaxl.com/
 * Generated: 2026-06-09
 *
 * Two source instances on the OmegaXL homepage:
 *   1. Top hero slider banner (.omegaxl-home-hero-section-wrapper) - full-width
 *      promotional banner image (desktop + mobile variants) wrapped in an <a> to a
 *      buy-now offer. Marketing text is baked into the image.
 *   2. Antinol partner promo banner (#main-static-banner) - full-width banner image
 *      wrapped in an <a> link to an external partner page.
 *
 * Block library (xwalk hero model): 1 column, 3 rows.
 *   Row 1: block name "hero-banner"
 *   Row 2: background image          -> field:image (alt collapses to imageAlt)
 *   Row 3: text / CTA (richtext)     -> field:text
 *
 * Field hints (xwalk):
 *   - image    -> <!-- field:image -->  (the desktop banner image)
 *   - imageAlt -> COLLAPSED into the <img alt="">, NO hint comment
 *   - text     -> <!-- field:text -->   (the offer link / CTA wrapping anchor)
 */
export default function parse(element, { document }) {
  // --- INPUT EXTRACTION (validated against source.html) ---

  // The banner is wrapped in an anchor in both instances. For the slider, the first
  // slide's anchor carries the offer; for the static banner the whole image links out.
  const link = element.querySelector(
    '.omegaxl-hero-slide a[href], a[href] img, #main-static-banner a[href], a[href]',
  );
  const anchor = link && link.tagName === 'A'
    ? link
    : (link ? link.closest('a[href]') : element.querySelector('a[href]'));

  // Pick the desktop image as the primary banner image, falling back to any image.
  const image = element.querySelector(
    'img.omegaxl-hero-slide-desktop, img[class*="desktop"], img',
  );

  // --- OUTPUT CONSTRUCTION (matches hero block library: 1 col, 3 rows) ---
  const cells = [];

  // Row 2: background/banner image -> field:image (imageAlt collapses into <img alt>)
  const imageCell = [];
  if (image) {
    const imageFrag = document.createDocumentFragment();
    imageFrag.appendChild(document.createComment(' field:image '));
    imageFrag.appendChild(image);
    imageCell.push(imageFrag);
  }
  cells.push(imageCell);

  // Row 3: text / CTA -> field:text. The marketing copy is baked into the banner
  // image, so the only authorable text is the offer link. Preserve it as an anchor
  // (link href + title), which md2jcr maps onto the richtext "text" field.
  const textCell = [];
  if (anchor && anchor.getAttribute('href')) {
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    const cta = document.createElement('a');
    cta.setAttribute('href', anchor.getAttribute('href'));
    const title = anchor.getAttribute('title');
    if (title) cta.setAttribute('title', title);
    // Visible CTA text: use the link title, else a sensible default.
    cta.textContent = title || (anchor.textContent || '').trim() || 'Learn More';

    textFrag.appendChild(cta);
    textCell.push(textFrag);
  }
  cells.push(textCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
