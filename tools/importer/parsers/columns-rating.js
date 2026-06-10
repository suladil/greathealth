/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-rating block variant.
 * Base block: columns (core/franklin/components/columns — 2 columns, 1 row).
 * Source: https://www.omegaxl.com/ — section "Our Mission" (trust/ratings row).
 * Selector: .omegaxl-our-mission-ratings-wrapper
 *
 * Trust/ratings row presented as two side-by-side panels:
 *   - BBB rating   (row-01): BBB logo (links to BBB profile) + score "4.7" + 5-star rating
 *   - Google rating(row-02): Google logo + "REVIEWS" + score "4.7" + 5-star rating,
 *                            with an overlay link to the Google review source.
 *
 * Output table (columns — 2 cols x 1 row, per _columns.json template):
 *   Row 1: block name "Columns"
 *   Row 2: cell 1 = BBB panel content, cell 2 = Google panel content
 *
 * NOTE (xwalk): Columns blocks do NOT use field-hint comments (hinting.md Rule 4
 * exception + "Columns Blocks" special rule). Cells carry free-form default content.
 *
 * All selectors validated against the live DOM of the source page.
 */
export default function parse(element, { document }) {
  // Build a clean 5-star rating element from the source <li class="star"> markup,
  // where each star's fill is expressed as a CSS width on a <span class="fill">.
  // Produces a plain-text stars line (e.g. "★★★★½") so it survives md2jcr cleanly.
  const buildStars = (starList) => {
    if (!starList) return null;
    const stars = Array.from(starList.querySelectorAll('li.star'));
    if (stars.length === 0) return null;
    let filled = 0;
    let half = false;
    stars.forEach((li) => {
      const fill = li.querySelector('.fill');
      const pct = fill ? parseFloat((fill.getAttribute('style') || '').replace(/[^0-9.]/g, '')) : 0;
      if (pct >= 75) filled += 1;
      else if (pct >= 25) half = true;
    });
    const p = document.createElement('p');
    p.textContent = `${'★'.repeat(filled)}${half ? '½' : ''}`.trim();
    return p.textContent ? p : null;
  };

  // ---- Cell 1: BBB rating panel (row-01) -----------------------------------
  const bbbRow = element.querySelector('.omegaxl-our-mission-ratings-row-01');
  const bbbCell = [];
  if (bbbRow) {
    // Logo lives inside the BBB profile link (#bbblink). Rebuild a clean anchor
    // (the source anchor carries inline <style>/<script> we don't want to import).
    const bbbLink = bbbRow.querySelector('a#bbblink, .omegaxl-our-mission-bbb-rating-icon-wrapper a');
    const bbbImg = bbbRow.querySelector('.omegaxl-our-mission-bbb-rating-icon-wrapper img, a#bbblink img');
    if (bbbLink && bbbImg) {
      const a = document.createElement('a');
      a.href = bbbLink.getAttribute('href') || '';
      a.appendChild(bbbImg);
      bbbCell.push(a);
    } else if (bbbImg) {
      bbbCell.push(bbbImg);
    }
    // Score "4.7"
    const bbbScore = bbbRow.querySelector('.omegaxl-our-mission-bbb-rating-score-wrapper p, [class*="bbb-rating-score"] p');
    if (bbbScore) bbbCell.push(bbbScore);
    // Stars
    const bbbStars = buildStars(bbbRow.querySelector('.bbb-star-rating ul, [class*="bbb-star-rating"] ul'));
    if (bbbStars) bbbCell.push(bbbStars);
  }

  // ---- Cell 2: Google rating panel (row-02) --------------------------------
  const googleRow = element.querySelector('.omegaxl-our-mission-ratings-row-02');
  const googleCell = [];
  if (googleRow) {
    // The whole Google panel is clickable via an overlay anchor (href only).
    const overlay = googleRow.querySelector('a.omegaxl-our-mission-ratings-row-overlay-link, a[aria-label*="Google Rating"]');
    const googleHref = overlay ? overlay.getAttribute('href') : null;

    // Logo image + "REVIEWS" copy + score "4.7" + stars.
    const googleImg = googleRow.querySelector('.omegaxl-our-mission-google-rating-icon-wrapper img, [class*="google-rating-icon"] img');
    const googleReviews = googleRow.querySelector('.omegaxl-our-mission-google-rating-copy p, [class*="google-rating-copy"] p');
    const googleScore = googleRow.querySelector('.omegaxl-our-mission-google-rating-score-wrapper p, [class*="google-rating-score"] p');
    const googleStars = buildStars(googleRow.querySelector('.google-star-rating ul, [class*="google-star-rating"] ul'));

    // Preserve the review-source link by wrapping the logo in the overlay href.
    if (googleHref && googleImg) {
      const a = document.createElement('a');
      a.href = googleHref;
      a.appendChild(googleImg);
      googleCell.push(a);
    } else if (googleImg) {
      googleCell.push(googleImg);
    }
    if (googleReviews) googleCell.push(googleReviews);
    if (googleScore) googleCell.push(googleScore);
    if (googleStars) googleCell.push(googleStars);
  }

  const cells = [['Columns'], [bbbCell, googleCell]];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-rating',
    cells,
  });
  element.replaceWith(block);
}
