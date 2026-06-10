/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-benefit.
 * Base block: cards
 * Source: https://www.omegaxl.com/ — section "OmegaXL Packed With Benefits"
 * Selector: .omegaxl-benefits-list-grid-wrapper
 * Generated for xwalk project (field hints: image, text per card item).
 *
 * Output table (cards):
 *   Row 1: block name "Cards"
 *   Each subsequent row = one benefit card:
 *     cell 1 = icon image  (UE field: image)
 *     cell 2 = heading + description paragraph  (UE field: text)
 */
export default function parse(element, { document }) {
  // Each benefit item is one card row. Validated against source.html:
  // .omegaxl-benefits-list-grid-item > .omegaxl-benefits-list-grid-icon-wrapper > img
  //                                   > .omegaxl-benefits-list-grid-copy-wrapper > h3 + p
  const items = Array.from(
    element.querySelectorAll(':scope > .omegaxl-benefits-list-grid-item'),
  );

  const cells = [['Cards']];

  items.forEach((item) => {
    // --- Cell 1: icon image (UE field: image) ---
    const icon = item.querySelector(
      '.omegaxl-benefits-list-grid-icon-wrapper img, img',
    );
    const imageCell = [];
    const imageHint = document.createComment(' field:image ');
    imageCell.push(imageHint);
    if (icon) imageCell.push(icon);

    // --- Cell 2: heading + description (UE field: text) ---
    const heading = item.querySelector(
      '.omegaxl-benefits-list-grid-copy-heading, h3, h2, [class*="heading"]',
    );
    const description = item.querySelector(
      '.omegaxl-benefits-list-grid-copy-main, p, [class*="copy-main"]',
    );
    const textCell = [];
    const textHint = document.createComment(' field:text ');
    textCell.push(textHint);
    if (heading) textCell.push(heading);
    if (description) textCell.push(description);

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-benefit',
    cells,
  });
  element.replaceWith(block);
}
