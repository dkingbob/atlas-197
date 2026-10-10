/**
 * Inline SVG icons (they inherit the text colour).
 */
const icon = paths => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;

export const ICONS = {
  close: icon('<path d="M6 6l12 12M18 6 6 18"/>'),
  check: icon('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
  bulb: icon('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>'),
  skip: icon('<path d="M5 5v14l9-7zM18 5v14"/>'),
  globe: icon('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9M12 3C9.5 5.7 8.2 8.7 8.2 12s1.3 6.3 3.8 9"/>'),
  map: icon('<path d="M4 7l5-3 6 3 5-3v13l-5 3-6-3-5 3z"/><path d="M9 4v13M15 7v13"/>'),
  waves: icon('<path d="M2 8c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 13c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 18c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/>'),
  flag: icon('<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>'),
  book: icon('<path d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2zM4 20a2 2 0 0 0 2 2h13v-4"/>'),
  repeat: icon('<path d="M17 2l3 3-3 3M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3M20 13v2a4 4 0 0 1-4 4H4"/>'),
  trophy: icon('<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4"/>'),
  sad: icon('<circle cx="12" cy="12" r="9"/><path d="M8.5 16.5c1-1.3 2.2-2 3.5-2s2.5.7 3.5 2M9 9.5h.01M15 9.5h.01"/>'),
  trash: icon('<path d="M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3"/>'),
  /** filled heart (lives) — `lost` greys it out */
  heart: lost => `<svg class="${lost ? 'lost' : ''}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.3C1 8.4 3 5 6.4 5c2 0 3.6 1.2 4.6 2.7h2C14 6.2 15.6 5 17.6 5 21 5 23 8.4 21.6 11.7 19.5 16.4 12 21 12 21z"/></svg>`,
};
