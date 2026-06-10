/* eslint-disable */
/* global WebImporter */
/**
 * Parser for quote-founder.
 * Base block: quote
 * Source: https://www.omegaxl.com/ — section "Founder quote" (.omegaxl-quote-block-home-content-wrapper)
 * Generated: 2026-06-09
 *
 * xwalk model (blocks/quote/_quote.json):
 *   - quotation  (richtext) → Row 2
 *   - attribution (richtext) → Row 3
 *
 * Note: the source includes a "Shop Now" CTA, but the quote model has no field for a
 * link/CTA, so it is intentionally not mapped (no target field exists).
 */
export default function parse(element, { document }) {
  // Quotation text: the <q> inside the heading (fallbacks for variation).
  const quotation = element.querySelector(
    '.oxl-quote, h1 q, h2 q, h3 q, blockquote, h1, h2, h3',
  );

  // Attribution: the strong/span line, or the paragraph that follows the quote.
  const attribution = element.querySelector(
    '.omegaxl-quote-block-home-strong, [class*="strong"], cite, figcaption, p',
  );

  const cells = [];

  // Row: quotation (richtext)
  const quotationCell = document.createDocumentFragment();
  if (quotation) {
    quotationCell.appendChild(document.createComment(' field:quotation '));
    quotationCell.appendChild(quotation);
  }
  cells.push([quotationCell]);

  // Row: attribution (richtext)
  const attributionCell = document.createDocumentFragment();
  if (attribution) {
    attributionCell.appendChild(document.createComment(' field:attribution '));
    attributionCell.appendChild(attribution);
  }
  cells.push([attributionCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'quote-founder', cells });
  element.replaceWith(block);
}
