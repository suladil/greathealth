/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-policy.
 * Base block: cards
 * Source: https://www.omegaxl.com/ — section "Our Mission" (policies/guarantees)
 * Selector: .omegaxl-our-mission-policies-wrapper
 * Generated for xwalk project (field hints: image, text per card item).
 *
 * Output table (cards):
 *   Row 1: block name "Cards"
 *   Each subsequent row = one policy item:
 *     cell 1 = policy icon image            (UE field: image)
 *     cell 2 = heading + copy/description    (UE field: text, includes inline CTA link)
 */
export default function parse(element, { document }) {
  // Each policy/guarantee item is one card row. Validated against source.html:
  // .omegaxl-our-mission-policies-autoship-wrapper
  //   > .omegaxl-our-mission-policies-image-wrapper   > img
  //   > .omegaxl-our-mission-policies-heading-wrapper > h3
  //   > .omegaxl-our-mission-policies-copy-wrapper    > p (with inline <a> CTA)
  let items = Array.from(
    element.querySelectorAll(':scope > .omegaxl-our-mission-policies-autoship-wrapper'),
  );
  // Fallback: if the item wrapper class is absent, treat each direct child div as an item.
  if (items.length === 0) {
    items = Array.from(element.querySelectorAll(':scope > div'));
  }

  const cells = [['Cards']];

  items.forEach((item) => {
    // --- Cell 1: policy icon image (UE field: image) ---
    const icon = item.querySelector(
      '.omegaxl-our-mission-policies-image-wrapper img, img',
    );
    const imageCell = [];
    imageCell.push(document.createComment(' field:image '));
    if (icon) imageCell.push(icon);

    // --- Cell 2: heading + copy/description (UE field: text) ---
    const heading = item.querySelector(
      '.omegaxl-our-mission-policies-heading-wrapper h3, h3, h2, [class*="heading"] h3',
    );
    const copy = item.querySelector(
      '.omegaxl-our-mission-policies-copy-wrapper p, [class*="copy"] p',
    );
    const textCell = [];
    textCell.push(document.createComment(' field:text '));
    if (heading) textCell.push(heading);
    if (copy) textCell.push(copy);

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-policy',
    cells,
  });
  element.replaceWith(block);
}
