/**
 * designjack — Icone dei software per la scheda progetto
 * window.softwareIcon(nome) restituisce { label, svg } se il nome dello stack
 * corrisponde a un software noto, altrimenti null (resta un'etichetta di testo).
 * Icone disegnate in SVG inline: nessun file esterno da caricare.
 */
(function () {
  'use strict';

  // tessera stile Adobe: quadrato scuro arrotondato con due lettere colorate
  const adobe = (letters, bg, fg) => `
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="8" fill="${bg}" stroke="${fg}" stroke-width="1.5"/>
      <text x="20" y="27" text-anchor="middle" font-size="17" font-weight="700" fill="${fg}"
            style="font-family: 'Helvetica Neue', Arial, sans-serif !important; letter-spacing: -0.5px;">${letters}</text>
    </svg>`;

  const ICONS = [
    { match: /illustrator/i, label: 'Adobe Illustrator', svg: adobe('Ai', '#330000', '#FF9A00') },
    { match: /photoshop/i, label: 'Adobe Photoshop', svg: adobe('Ps', '#001E36', '#31A8FF') },
    { match: /indesign/i, label: 'Adobe InDesign', svg: adobe('Id', '#49021F', '#FF3366') },
    { match: /after ?effects/i, label: 'Adobe After Effects', svg: adobe('Ae', '#00005B', '#9999FF') },
    { match: /premiere/i, label: 'Adobe Premiere Pro', svg: adobe('Pr', '#00005B', '#9999FF') },
    { match: /lightroom/i, label: 'Adobe Lightroom', svg: adobe('Lr', '#001E36', '#31A8FF') },
    { match: /adobe xd|^xd$/i, label: 'Adobe XD', svg: adobe('Xd', '#470137', '#FF61F6') },
    {
      match: /figma/i,
      label: 'Figma',
      svg: `
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="8" fill="#1E1E1E"/>
          <g transform="translate(13.4 7.5) scale(0.44)">
            <path fill="#1ABCFE" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/>
            <path fill="#0ACF83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"/>
            <path fill="#FF7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z"/>
            <path fill="#F24E1E" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"/>
            <path fill="#A259FF" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"/>
          </g>
        </svg>`
    },
    {
      match: /blender/i,
      label: 'Blender',
      svg: `
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="8" fill="#FFFFFF" stroke="#E87D0D" stroke-width="1.5"/>
          <g stroke="#E87D0D" stroke-width="4" stroke-linecap="round">
            <path d="M7 17.5h13"/>
            <path d="M11 9.5l11 8"/>
            <path d="M10 26.5l6-3"/>
          </g>
          <circle cx="24.5" cy="23.5" r="10" fill="#E87D0D"/>
          <circle cx="24.5" cy="23.5" r="6.6" fill="#FFFFFF"/>
          <circle cx="24.5" cy="23.5" r="3.7" fill="#265787"/>
        </svg>`
    },
    {
      match: /^react$/i,
      label: 'React',
      svg: `
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="8" fill="#20232A"/>
          <g fill="none" stroke="#61DAFB" stroke-width="1.6">
            <ellipse cx="20" cy="20" rx="13" ry="5"/>
            <ellipse cx="20" cy="20" rx="13" ry="5" transform="rotate(60 20 20)"/>
            <ellipse cx="20" cy="20" rx="13" ry="5" transform="rotate(120 20 20)"/>
          </g>
          <circle cx="20" cy="20" r="2.6" fill="#61DAFB"/>
        </svg>`
    },
    {
      match: /three\.?js/i,
      label: 'Three.js',
      svg: `
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="8" fill="#111111"/>
          <g fill="none" stroke="#FFFFFF" stroke-width="1.4" stroke-linejoin="round">
            <path d="M9 31 13 9 31 26z"/>
            <path d="M11 20 22 17.5 20 28.5z"/>
            <path d="M12 14.5 17.5 13.3 16.5 19"/>
          </g>
        </svg>`
    },
    {
      match: /javascript/i,
      label: 'JavaScript',
      svg: `
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="8" fill="#F7DF1E"/>
          <text x="35" y="34" text-anchor="end" font-size="15" font-weight="700" fill="#000000"
                style="font-family: 'Helvetica Neue', Arial, sans-serif !important;">JS</text>
        </svg>`
    },
    {
      match: /arduino/i,
      label: 'Arduino',
      svg: `
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="8" fill="#00979D"/>
          <path fill="none" stroke="#FFFFFF" stroke-width="2.6" d="M20 20c-3.2-4.2-5.2-5.6-7.8-5.6a5.6 5.6 0 0 0 0 11.2c2.6 0 4.6-1.4 7.8-5.6 3.2-4.2 5.2-5.6 7.8-5.6a5.6 5.6 0 0 1 0 11.2c-2.6 0-4.6-1.4-7.8-5.6z"/>
          <path stroke="#FFFFFF" stroke-width="1.6" d="M9.8 20h4.6M25.6 20h4.6M27.9 17.7v4.6"/>
        </svg>`
    },
    {
      match: /html5|canvas/i,
      label: 'HTML5 Canvas',
      svg: `
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="8" fill="#FFFFFF" stroke="#E34F26" stroke-width="1.5"/>
          <path fill="#E34F26" d="M9 7h22l-2 22.5L20 33l-9-3.5z"/>
          <path fill="#FFFFFF" d="M14.5 12h11l-.3 3.3h-7.4l.3 3.2h6.8l-.8 8.2L20 28l-4.2-1.3-.3-3.3h3.2l.2 1.6 1.1.4 1.2-.4.2-2.6h-6.1z"/>
        </svg>`
    }
  ];

  window.softwareIcon = function (name) {
    const n = String(name || '').trim();
    const hit = ICONS.find((i) => i.match.test(n));
    return hit ? { label: hit.label, svg: hit.svg } : null;
  };
})();
