/* eslint-disable */
/* global WebImporter */
/**
 * Parser for table-compare. Base block: table.
 * Source: https://www.omegaxl.com/ — section "The OmegaXL Difference"
 *   (.omegaxl-difference-content-table-wrapper)
 * Project type: xwalk (field hints required).
 *
 * Comparison table with 3 columns: feature label, "OmegaXL Soft Gels",
 * "Standard Fish Oil Soft Gel". Header row holds h3 titles; data rows compare
 * attributes using check-mark / cancel-mark inline images per column cell.
 *
 * xwalk model: table block is a container. Each <tr> becomes a "Row" item.
 * 3 columns -> table-col-3 model with fields column1text, column2text, column3text.
 * Each cell content is prefixed with its <!-- field:columnNtext --> hint.
 *
 * Source DOM: <table><tbody> with one header <tr> of <th> and three data <tr>
 * of <td>. Header cells wrap <h3>; data cells hold a text label plus check /
 * cancel <img> marks.
 */
export default function parse(element, { document }) {
  // Validated against source.html: single <table><tbody> with <tr> rows.
  // Header row uses <th>, data rows use <td>. Fallbacks added for variation.
  const rows = Array.from(element.querySelectorAll('table tr, tbody > tr'))
    // de-dup in case both selectors match the same node
    .filter((row, idx, arr) => arr.indexOf(row) === idx);

  const cells = [];

  rows.forEach((row) => {
    // Each row's column cells are <th> (header) or <td> (data).
    const colCells = Array.from(row.querySelectorAll(':scope > th, :scope > td'));
    if (colCells.length === 0) return;

    const rowCells = colCells.map((colCell, colIndex) => {
      // Field hint must precede the cell content for xwalk.
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(` field:column${colIndex + 1}text `));
      // Preserve inner semantic content (h3 headings, inline check/cancel images)
      // by moving the cell's child nodes into the fragment.
      Array.from(colCell.childNodes).forEach((node) => frag.appendChild(node));
      return frag;
    });

    cells.push(rowCells);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'table-compare', cells });
  element.replaceWith(block);
}
