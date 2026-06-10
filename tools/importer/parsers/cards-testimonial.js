/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-testimonial.
 * Base block: cards
 * Source URL: https://www.omegaxl.com/
 * Section: "OmegaXL Over 20,000+ Five Star Reviews" (.omegaxl-testimonials-grid-wrapper)
 * Generated: 2026-06-09 (revalidated)
 *
 * xwalk project: cards model fields are `image` (reference) and `text` (richtext).
 * Container block — each testimonial card = one row with 2 cells:
 *   cell 1 = image  (field:image)  -> video thumbnail, wrapped in a link to the video when available
 *   cell 2 = text   (field:text)   -> customer name heading + quote (+ headshot + stars when present)
 */
export default function parse(element, { document }) {
  // Each testimonial is its own card item under the grid wrapper.
  const cards = element.querySelectorAll('.omegaxl-testimonials-grid-item-wrapper');

  const cells = [];

  cards.forEach((card) => {
    // --- IMAGE CELL (field:image) ---
    // Primary image is the video thumbnail with the play overlay.
    const thumb = card.querySelector('.omegaxl-testimonials-grid-item-image img, .omegaxl-testimonials-grid-item-image picture img');

    // Associated video link comes from the modal iframe (Vimeo player URL).
    const iframe = card.querySelector('.omegaxl-testimonials-modal iframe[src], iframe.omegaxl-testimonials-grid-item-video');
    const videoUrl = iframe ? iframe.getAttribute('src') : null;

    let imageContent = null;
    if (thumb && videoUrl) {
      // Wrap the thumbnail in an anchor so the testimonial video link is preserved.
      const link = document.createElement('a');
      link.href = videoUrl;
      if (iframe && iframe.getAttribute('title')) link.title = iframe.getAttribute('title');
      link.appendChild(thumb);
      imageContent = link;
    } else if (thumb) {
      imageContent = thumb;
    }

    const imageCell = document.createDocumentFragment();
    if (imageContent) {
      imageCell.appendChild(document.createComment(' field:image '));
      imageCell.appendChild(imageContent);
    }

    // --- TEXT CELL (field:text) ---
    const headshot = card.querySelector('.omegaxl-testimonials-grid-item-copy-headshot img');
    const heading = card.querySelector('.omegaxl-testimonials-grid-item-copy-title h3, .omegaxl-testimonials-grid-item-copy-title');
    const quote = card.querySelector('.omegaxl-testimonials-grid-item-copy-quote q, .omegaxl-testimonials-grid-item-copy-quote');
    const stars = card.querySelector('.omegaxl-testimonials-grid-item-stars-wrapper, .omegaxl-star-rating');

    const textCell = document.createDocumentFragment();
    const textPieces = [];
    if (headshot) textPieces.push(headshot);
    if (heading) textPieces.push(heading);
    if (quote) textPieces.push(quote);
    if (stars) textPieces.push(stars);

    if (textPieces.length) {
      textCell.appendChild(document.createComment(' field:text '));
      textPieces.forEach((node) => textCell.appendChild(node));
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-testimonial', cells });
  element.replaceWith(block);
}
