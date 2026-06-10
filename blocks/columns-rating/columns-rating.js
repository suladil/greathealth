export default function decorate(block) {
  const rows = [...block.children];

  // First row is the block-name marker row ("Columns"); remove it.
  if (rows.length > 1) {
    const first = rows[0];
    if (first.textContent.trim().toLowerCase() === 'columns') {
      first.remove();
    }
  }

  // The remaining content row holds the rating panels (cells).
  const contentRow = block.querySelector(':scope > div');
  if (!contentRow) return;
  contentRow.classList.add('columns-rating-row');

  [...contentRow.children].forEach((panel) => {
    panel.classList.add('columns-rating-panel');

    const children = [...panel.children];

    // Logo column: image plus any non-numeric label (e.g. "REVIEWS").
    const logoCol = document.createElement('div');
    logoCol.className = 'columns-rating-logo';

    // Score box: the score number and the star row, on a colored background.
    const score = document.createElement('div');
    score.className = 'columns-rating-score-box';

    children.forEach((c) => {
      const text = c.textContent.trim();
      if (c.querySelector('picture, img')) {
        c.classList.add('columns-rating-logo-img');
        logoCol.appendChild(c);
      } else if (/^[\d.]+$/.test(text)) {
        c.classList.add('columns-rating-score');
        score.appendChild(c);
      } else if (/[★☆½]/.test(text)) {
        c.classList.add('columns-rating-stars');
        score.appendChild(c);
      } else {
        // Text label such as "REVIEWS" belongs under the logo.
        c.classList.add('columns-rating-label');
        logoCol.appendChild(c);
      }
    });

    panel.appendChild(logoCol);
    panel.appendChild(score);
  });
}
