/**
 * Generates lightweight manga-style SVG panels for each chapter.
 * Run: node scripts/generate-manga-scenes.mjs
 *
 * Keep props obvious + add a small label tag so kids can read the scene at a glance.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '../public/scenes')

const defs = `
  <defs>
    <pattern id="tone" width="4" height="4" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="0.7" fill="#111"/>
    </pattern>
    <pattern id="tone-dense" width="3" height="3" patternUnits="userSpaceOnUse">
      <circle cx="0.8" cy="0.8" r="0.65" fill="#111"/>
    </pattern>
    <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
      <line x1="0" y1="0" x2="0" y2="6" stroke="#111" stroke-width="1"/>
    </pattern>
  </defs>`

function panel(inner, sfx = '', bubbleTxt = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img">
${defs}
  <rect x="6" y="6" width="308" height="188" fill="#fff" stroke="#111" stroke-width="4"/>
  <rect x="10" y="10" width="300" height="180" fill="#f7f7f5" stroke="#111" stroke-width="1.5"/>
  <rect x="12" y="12" width="296" height="100" fill="#fff"/>
  <rect x="12" y="12" width="296" height="100" fill="url(#tone)" opacity="0.16"/>
  <rect x="12" y="112" width="296" height="76" fill="#fff"/>
  <rect x="12" y="112" width="296" height="76" fill="url(#tone)" opacity="0.26"/>
  <path d="M12 112 Q90 104 160 112 T308 112" fill="none" stroke="#111" stroke-width="2"/>
${inner}
${sfx}
${bubbleTxt}
</svg>
`
}

function boy(x, y, mood = 'sly') {
  const mouth =
    mood === 'scared'
      ? `<ellipse cx="24" cy="24" rx="3" ry="4" fill="#111"/>`
      : mood === 'sad'
        ? `<path d="M18 25 Q24 21 30 25" fill="none" stroke="#111" stroke-width="1.6"/>`
        : mood === 'happy'
          ? `<path d="M18 23 Q24 28 30 23" fill="none" stroke="#111" stroke-width="1.6"/>`
          : `<path d="M18 23 Q24 27 30 23" fill="none" stroke="#111" stroke-width="1.6"/>`
  const eyes =
    mood === 'scared'
      ? `<circle cx="19" cy="16" r="3.4" fill="#111"/><circle cx="29" cy="16" r="3.4" fill="#111"/><circle cx="20" cy="14.8" r="1" fill="#fff"/><circle cx="30" cy="14.8" r="1" fill="#fff"/>`
      : `<ellipse cx="19" cy="16" rx="3.2" ry="4" fill="#111"/><ellipse cx="29" cy="16" rx="3.2" ry="4" fill="#111"/><circle cx="20" cy="14.5" r="1" fill="#fff"/><circle cx="30" cy="14.5" r="1" fill="#fff"/>`
  return `<g transform="translate(${x},${y})">
    <path d="M10 28 h28 l4 34 h-36z" fill="#fff" stroke="#111" stroke-width="2"/>
    <rect x="10" y="28" width="28" height="14" fill="url(#tone-dense)" opacity="0.35"/>
    <path d="M12 62 v20 M32 62 v20" stroke="#111" stroke-width="3" stroke-linecap="round"/>
    <circle cx="24" cy="16" r="14" fill="#fff" stroke="#111" stroke-width="2.2"/>
    <!-- soft hair cap — solid, no crown bumps -->
    <path d="M10 16 Q11 6 24 5 Q37 6 38 16 Q30 10 24 11 Q18 10 10 16 Z" fill="#111"/>
    ${eyes}
    ${mouth}
  </g>`
}

function girl(x, y) {
  // Becky: light hair + pigtails, clear pale face (no solid black hair blob)
  return `<g transform="translate(${x},${y})">
    <path d="M8 30 h28 l2 36 h-32z" fill="#fff" stroke="#111" stroke-width="2"/>
    <path d="M8 42 q16 10 32 0" fill="url(#tone)" opacity="0.25"/>
    <circle cx="22" cy="16" r="13" fill="#fff" stroke="#111" stroke-width="2"/>
    <path d="M10 12 Q12 2 22 1 Q32 2 34 12" fill="none" stroke="#111" stroke-width="2.2"/>
    <path d="M10 14 Q14 8 22 7 Q30 8 34 14" fill="#fff" stroke="#111" stroke-width="1.4"/>
    <circle cx="6" cy="20" r="5" fill="#fff" stroke="#111" stroke-width="1.8"/>
    <circle cx="38" cy="20" r="5" fill="#fff" stroke="#111" stroke-width="1.8"/>
    <path d="M9 18 v10 M35 18 v10" stroke="#111" stroke-width="1.5"/>
    <path d="M12 10 L14 16 M18 8 L19 15 M26 8 L25 15 M32 10 L30 16" fill="none" stroke="#111" stroke-width="1.4"/>
    <ellipse cx="17" cy="16" rx="2.4" ry="3.2" fill="#111"/>
    <ellipse cx="27" cy="16" rx="2.4" ry="3.2" fill="#111"/>
    <circle cx="17.7" cy="14.8" r="0.7" fill="#fff"/>
    <circle cx="27.7" cy="14.8" r="0.7" fill="#fff"/>
    <path d="M17 23 Q22 26 27 23" fill="none" stroke="#111" stroke-width="1.4"/>
  </g>`
}

function sfxBurst(x, y, text) {
  // Rectangular shout box — jagged star looked like a floating crown
  // Cyrillic glyphs are wider than ASCII, so pad generously
  const w = Math.max(40, Math.round(text.length * 9.5 + 18))
  return `<g transform="translate(${x},${y})">
    <rect x="0" y="0" width="${w}" height="22" fill="#fff" stroke="#111" stroke-width="2.5"/>
    <rect x="2" y="2" width="${w - 4}" height="18" fill="none" stroke="#111" stroke-width="1"/>
    <text x="7" y="16" font-family="Arial Black, Impact, sans-serif" font-size="11" font-weight="900" fill="#111">${text}</text>
  </g>`
}

function bubble(x, y, text, w = 88) {
  const tw = Math.max(w, Math.round(text.length * 7.8 + 18))
  const tip1 = Math.round(tw * 0.35)
  const tip2 = Math.round(tw * 0.28)
  const tip3 = Math.round(tw * 0.48)
  return `<g transform="translate(${x},${y})">
    <ellipse cx="${tw / 2}" cy="16" rx="${tw / 2}" ry="15" fill="#fff" stroke="#111" stroke-width="2"/>
    <path d="M${tip1} 30 L${tip2} 42 L${tip3} 32" fill="#fff" stroke="#111" stroke-width="2"/>
    <text x="10" y="20" font-family="Segoe UI, Arial, sans-serif" font-size="10" font-weight="700" fill="#111">${text}</text>
  </g>`
}

function tag(x, y, text) {
  const w = Math.max(40, Math.round(text.length * 7.8 + 14))
  return `<g transform="translate(${x},${y})">
    <rect x="0" y="0" width="${w}" height="16" rx="3" fill="#111"/>
    <text x="6" y="12" font-family="Segoe UI, Arial, sans-serif" font-size="9" font-weight="700" fill="#fff">${text}</text>
  </g>`
}

function heart(x, y, s = 1) {
  return `<g transform="translate(${x},${y}) scale(${s})">
    <path d="M12 22 C12 22 2 14 2 8 C2 4 5 2 8 2 C10 2 12 3 12 5 C12 3 14 2 16 2 C19 2 22 4 22 8 C22 14 12 22 12 22 Z" fill="#fff" stroke="#111" stroke-width="2"/>
  </g>`
}

function pirateFlag(x, y) {
  return `<g transform="translate(${x},${y})">
    <path d="M8 8 v70" stroke="#111" stroke-width="3"/>
    <path d="M8 10 h55 l-8 16 l8 16 H8 Z" fill="#111"/>
    <circle cx="28" cy="26" r="6" fill="#fff"/>
    <path d="M22 26 h12 M28 20 v12" stroke="#111" stroke-width="1.5"/>
  </g>`
}

const scenes = {
  'ch-01.svg': () =>
    panel(
      `${boy(55, 85, 'sly')}${boy(200, 88, 'scared')}
      <g stroke="#111" stroke-width="2.5" fill="none" stroke-linecap="round">
        <path d="M115 95 L175 105"/><path d="M170 95 L185 115"/>
      </g>
      ${tag(130, 55, 'ДРАКА')}`,
      sfxBurst(230, 24, 'БАХ!'),
      bubble(20, 28, 'А ну погоди!', 88),
    ),

  'ch-02-fence.svg': null,

  'ch-03.svg': () =>
    panel(
      `${boy(60, 88, 'happy')}${girl(190, 84)}
      ${heart(140, 55, 1.1)}
      ${tag(120, 155, 'ВЛЮБИЛСЯ')}`,
      '',
      bubble(30, 24, 'Это она!', 70),
    ),

  'ch-04.svg': () =>
    panel(
      `${boy(130, 85, 'sly')}
      <g fill="#fff" stroke="#111" stroke-width="2">
        <rect x="40" y="55" width="50" height="32" rx="3"/>
        <rect x="48" y="95" width="50" height="32" rx="3"/>
        <rect x="230" y="60" width="50" height="32" rx="3"/>
      </g>
      <text x="48" y="75" font-family="Segoe UI, Arial" font-size="9" font-weight="700">билет</text>
      <text x="56" y="115" font-family="Segoe UI, Arial" font-size="9" font-weight="700">билет</text>
      <text x="238" y="80" font-family="Segoe UI, Arial" font-size="9" font-weight="700">билет</text>
      ${tag(120, 155, 'ШКОЛА')}`,
      sfxBurst(230, 110, 'УХ!'),
      bubble(150, 24, 'Смотрите!', 72),
    ),

  'ch-05.svg': () =>
    panel(
      `${boy(45, 95, 'scared')}
      <g transform="translate(150,75)" fill="#fff" stroke="#111" stroke-width="2.4">
        <ellipse cx="50" cy="35" rx="48" ry="28"/>
        <circle cx="32" cy="28" r="4" fill="#111"/><circle cx="58" cy="28" r="4" fill="#111"/>
        <path d="M70 35 h28" stroke-width="3"/>
        <path d="M20 48 Q50 58 75 45" fill="none"/>
        <path d="M28 22 Q18 10 12 18 M42 16 Q40 4 48 10 M58 16 Q68 4 70 14" fill="none" stroke-width="2"/>
      </g>
      ${tag(175, 155, 'ЖУК')}`,
      sfxBurst(100, 24, 'КУ!'),
      bubble(20, 28, 'Ай!', 48),
    ),

  'ch-06.svg': () =>
    panel(
      `${boy(70, 88, 'happy')}${girl(185, 84)}
      ${heart(145, 50, 0.9)}${heart(165, 62, 0.7)}
      ${tag(105, 155, 'ТОМ + БЕККИ')}`,
      '',
      bubble(40, 24, 'Обручимся!', 78),
    ),

  'ch-07.svg': () =>
    panel(
      `${boy(40, 95, 'sad')}${girl(210, 88)}
      <g transform="translate(125,95)" fill="#fff" stroke="#111" stroke-width="2.2">
        <ellipse cx="28" cy="16" rx="26" ry="14"/>
        <circle cx="16" cy="14" r="3" fill="#111"/><circle cx="34" cy="14" r="3" fill="#111"/>
        <path d="M52 16 h18" stroke-width="3"/>
        <path d="M8 22 L0 30 M48 22 L56 30" stroke-width="2"/>
      </g>
      ${tag(130, 155, 'КЛЕЩ')}`,
      sfxBurst(120, 24, 'ЭХ'),
      bubble(200, 28, 'Всё!', 48),
    ),

  'ch-08.svg': () =>
    panel(
      `${boy(40, 95, 'sly')}${boy(100, 95, 'happy')}${boy(160, 95, 'sly')}
      ${pirateFlag(230, 35)}
      ${tag(210, 155, 'ПИРАТЫ')}`,
      '',
      bubble(40, 24, 'Мы пираты!', 78),
    ),

  'ch-09.svg': () =>
    panel(
      `<g fill="#fff" stroke="#111" stroke-width="2.2">
        <rect x="24" y="55" width="58" height="68"/>
        <path d="M38 55 v-18 h30 v18"/>
        <text x="38" y="96" font-family="Segoe UI, Arial" font-size="12" font-weight="700">RIP</text>
      </g>
      <g transform="translate(100,48)" fill="#fff" stroke="#111" stroke-width="2">
        <path d="M18 32 h30 l6 70 H12 Z"/>
        <circle cx="33" cy="22" r="14"/>
        <circle cx="28" cy="20" r="2.5" fill="#111"/><circle cx="38" cy="20" r="2.5" fill="#111"/>
        <path d="M28 28 Q33 31 38 28" fill="none"/>
        <!-- knife: handle + blade -->
        <rect x="48" y="58" width="14" height="10" rx="1"/>
        <path d="M62 56 L98 63 L62 70 Z"/>
      </g>
      ${boy(230, 105, 'scared')}
      ${tag(24, 155, 'КЛАДБИЩЕ')}${tag(115, 155, 'ДЖО')}`,
      sfxBurst(230, 24, '!!!'),
      bubble(200, 40, 'Бежим!', 62),
    ),

  'ch-10.svg': () =>
    panel(
      `${boy(35, 100, 'scared')}
      <g transform="translate(145,75)" fill="#fff" stroke="#111" stroke-width="2.2">
        <ellipse cx="55" cy="45" rx="48" ry="30"/>
        <circle cx="38" cy="38" r="5" fill="#111"/><circle cx="65" cy="38" r="5" fill="#111"/>
        <path d="M95 40 q22 -12 14 22" fill="none"/>
        <path d="M20 55 q-18 12 -10 24" fill="none"/>
        <path d="M45 55 Q55 62 65 55" fill="none"/>
      </g>
      ${tag(175, 155, 'ПЁС ВОЕТ')}`,
      sfxBurst(90, 24, 'У-УУ'),
      bubble(20, 28, 'Жутко...', 62),
    ),

  'ch-11.svg': () =>
    panel(
      `${boy(120, 85, 'sad')}
      <g fill="#fff" stroke="#111" stroke-width="2">
        <rect x="40" y="55" width="55" height="45" rx="4"/>
        <text x="58" y="84" font-family="Segoe UI, Arial" font-size="18" font-weight="700">?</text>
      </g>
      ${tag(110, 155, 'СОВЕСТЬ')}`,
      '',
      bubble(170, 40, 'Молчать?', 70),
    ),

  'ch-12.svg': () =>
    panel(
      `${boy(40, 95, 'sly')}
      <g transform="translate(155,68)" fill="#fff" stroke="#111" stroke-width="2.2">
        <!-- ears BEHIND head so bases are covered = look attached -->
        <path d="M28 22 L40 0 L52 22 Z"/>
        <path d="M72 22 L84 0 L96 22 Z"/>
        <ellipse cx="62" cy="48" rx="40" ry="34"/>
        <circle cx="48" cy="44" r="4" fill="#111"/>
        <circle cx="76" cy="44" r="4" fill="#111"/>
        <circle cx="49.5" cy="42.5" r="1.2" fill="#fff"/>
        <circle cx="77.5" cy="42.5" r="1.2" fill="#fff"/>
        <path d="M58 52 L62 56 L66 52" fill="#111" stroke="none"/>
        <path d="M50 60 Q62 68 74 60" fill="none"/>
        <path d="M28 52 H10 M28 58 H8 M96 52 H114 M96 58 H116" fill="none" stroke-width="1.6"/>
        <ellipse cx="62" cy="94" rx="28" ry="18"/>
        <path d="M88 90 Q118 74 112 52" fill="none" stroke-width="3" stroke-linecap="round"/>
      </g>
      <g transform="translate(115,85)" fill="#fff" stroke="#111" stroke-width="2">
        <rect x="0" y="0" width="22" height="34" rx="4"/>
        <text x="4" y="22" font-size="10" font-weight="700">Rx</text>
      </g>
      ${tag(230, 155, 'КОТ')}`,
      sfxBurst(230, 28, 'МЯУ!'),
      bubble(20, 28, 'Лекарство!', 78),
    ),

  'ch-13.svg': () =>
    panel(
      `<g transform="translate(30,75)" fill="#fff" stroke="#111" stroke-width="2.2">
        <path d="M15 65 H115 L100 40 H45 Z"/>
        <path d="M75 40 V8"/><path d="M75 8 H120 L75 30 Z" fill="#111"/>
        <circle cx="40" cy="70" r="8"/><circle cx="95" cy="70" r="8"/>
      </g>
      ${boy(210, 100, 'happy')}
      ${tag(50, 155, 'ЛОДКА')}`,
      sfxBurst(150, 24, 'В ПУТЬ'),
      bubble(190, 36, 'Остров!', 62),
    ),

  'ch-14.svg': () =>
    panel(
      `${boy(45, 95, 'happy')}${boy(115, 98, 'sly')}
      <g transform="translate(195,78)" fill="#fff" stroke="#111" stroke-width="2.2">
        <!-- crossed logs -->
        <path d="M16 72 L68 58" stroke-width="7" stroke-linecap="round"/>
        <path d="M20 56 L70 72" stroke-width="7" stroke-linecap="round"/>
        <!-- soft flame curves (not crown spikes) -->
        <path d="M34 56 Q30 38 36 28 Q42 40 40 56 Z"/>
        <path d="M42 56 Q44 32 50 24 Q54 36 52 56 Z"/>
        <path d="M50 56 Q56 40 58 32 Q60 44 56 56 Z"/>
      </g>
      ${tag(200, 155, 'КОСТЁР')}`,
      '',
      bubble(40, 28, 'Жизнь пирата!', 88),
    ),

  'ch-15.svg': () =>
    panel(
      `<g fill="#fff" stroke="#111" stroke-width="2">
        <rect x="175" y="55" width="100" height="75"/>
        <path d="M175 55 L225 28 L275 55"/>
        <rect x="212" y="90" width="22" height="40"/>
        <circle cx="200" cy="80" r="6"/><circle cx="250" cy="80" r="6"/>
      </g>
      ${boy(50, 100, 'sad')}
      ${tag(185, 155, 'ДОМ')}`,
      '',
      bubble(20, 28, 'Они плачут...', 88),
    ),

  'ch-16.svg': () =>
    panel(
      `${boy(55, 95, 'scared')}${boy(175, 95, 'scared')}
      <g transform="translate(115,75)" fill="#fff" stroke="#111" stroke-width="2">
        <rect x="0" y="18" width="50" height="8" rx="2"/>
        <ellipse cx="55" cy="16" rx="12" ry="10"/>
      </g>
      <g stroke="#111" stroke-width="1.8" fill="none">
        <path d="M155 55 q10 -20 0 -34"/><path d="M170 60 q12 -22 2 -38"/>
      </g>
      ${tag(120, 150, 'ТРУБКА')}`,
      sfxBurst(230, 24, 'КХЕ'),
      bubble(20, 28, 'Кашляет...', 78),
    ),

  'ch-17.svg': () =>
    panel(
      `<g fill="#fff" stroke="#111" stroke-width="2">
        <rect x="30" y="55" width="110" height="65"/>
        <path d="M30 55 L85 28 L140 55"/>
        <path d="M85 18 v30 M72 32 h26" stroke-width="3"/>
        <rect x="72" y="85" width="26" height="35"/>
      </g>
      ${boy(170, 95, 'happy')}${boy(230, 98, 'sly')}
      ${tag(40, 155, 'ПОХОРОНЫ')}`,
      sfxBurst(130, 24, 'ААА'),
      bubble(165, 28, 'Мы живы!', 72),
    ),

  'ch-18.svg': () =>
    panel(
      `${boy(120, 85, 'sly')}
      ${boy(35, 105, 'happy')}${boy(215, 105, 'scared')}
      ${tag(125, 155, 'СОН')}`,
      '',
      bubble(90, 24, 'Мне приснилось...', 110),
    ),

  'ch-19.svg': () =>
    panel(
      `${boy(55, 95, 'sad')}${girl(200, 88)}
      <g stroke="#111" stroke-width="3" fill="none" stroke-linecap="round">
        <path d="M130 100 H175"/><path d="M175 90 L185 110 M175 110 L185 90"/>
      </g>
      ${tag(125, 155, 'ССОРА')}`,
      sfxBurst(120, 24, 'ОЙ'),
      bubble(175, 36, 'Ой...', 48),
    ),

  'ch-20.svg': () =>
    panel(
      `${boy(85, 88, 'sly')}${girl(200, 88)}
      <g fill="#fff" stroke="#111" stroke-width="2">
        <rect x="30" y="55" width="45" height="55" rx="2"/>
        <path d="M38 75 h28"/>
        <text x="36" y="95" font-size="9" font-weight="700">книга</text>
      </g>
      ${tag(120, 155, 'СПАС')}`,
      '',
      bubble(70, 24, 'Это я!', 54),
    ),

  'ch-21.svg': () =>
    panel(
      `${boy(55, 95, 'happy')}
      <g transform="translate(160,50)" fill="#fff" stroke="#111" stroke-width="2.2">
        <ellipse cx="45" cy="85" rx="50" ry="18"/>
        <circle cx="45" cy="40" r="30"/>
        <path d="M22 32 Q45 12 68 32" fill="url(#tone)" opacity="0.4"/>
        <circle cx="34" cy="40" r="3.5" fill="#111"/><circle cx="56" cy="40" r="3.5" fill="#111"/>
        <path d="M34 55 Q45 62 56 55" fill="none"/>
        <rect x="85" y="20" width="10" height="45"/>
        <rect x="78" y="16" width="24" height="10"/>
      </g>
      ${tag(175, 155, 'УЧИТЕЛЬ')}`,
      sfxBurst(40, 30, 'ХА'),
      bubble(40, 70, 'Речь!', 52),
    ),

  'ch-22.svg': () =>
    panel(
      `${boy(55, 95, 'sly')}${boy(195, 95, 'happy')}
      <g fill="#fff" stroke="#111" stroke-width="2">
        <rect x="128" y="55" width="40" height="50" rx="2"/>
        <path d="M128 62 h40"/>
        <text x="132" y="90" font-size="9" font-weight="700">Библия</text>
      </g>
      ${tag(125, 155, 'КНИГА')}`,
      '',
      bubble(40, 28, 'В Библии...', 78),
    ),

  'ch-23.svg': () =>
    panel(
      `${boy(125, 95, 'scared')}
      <g fill="#fff" stroke="#111" stroke-width="2">
        <rect x="30" y="50" width="75" height="55" rx="2"/>
        <path d="M40 68 h55 M40 82 h40"/>
        <text x="48" y="98" font-size="10" font-weight="700">СУД</text>
        <rect x="228" y="72" width="42" height="12" rx="2"/>
        <rect x="242" y="48" width="12" height="30"/>
        <rect x="234" y="40" width="28" height="12" rx="2"/>
      </g>
      ${tag(215, 150, 'МОЛОТОК')}`,
      sfxBurst(200, 24, 'ПРАВДА'),
      bubble(90, 28, 'Это был Джо!', 88),
    ),

  'ch-24.svg': () =>
    panel(
      `${boy(55, 95, 'scared')}
      <g transform="translate(170,55)" fill="#fff" stroke="#111" stroke-width="2.2">
        <path d="M10 25 h60 l12 80 H10 Z"/>
        <circle cx="40" cy="50" r="14"/>
        <path d="M32 50 h16 M40 42 v16"/>
        <text x="24" y="95" font-size="10" font-weight="700">Джо</text>
      </g>
      ${tag(45, 155, 'СТРАХ')}`,
      '',
      bubble(20, 28, 'Он рядом...', 78),
    ),

  'ch-25.svg': () =>
    panel(
      `${boy(45, 100, 'sly')}${boy(110, 100, 'happy')}
      <g fill="#fff" stroke="#111" stroke-width="2.2">
        <path d="M210 55 v60"/><path d="M198 55 h36"/>
        <path d="M190 120 h70 v25 h-70z"/>
        <circle cx="225" cy="133" r="6" fill="#111"/>
      </g>
      ${tag(200, 155, 'ЛОПАТА')}`,
      sfxBurst(200, 28, 'КОПАЙ'),
      bubble(40, 28, 'Клад здесь!', 78),
    ),

  'ch-26.svg': () =>
    panel(
      `${boy(25, 105, 'scared')}${boy(80, 108, 'scared')}
      <g transform="translate(200,55)" fill="#fff" stroke="#111" stroke-width="2">
        <path d="M10 35 h26 l4 55 H6 Z"/>
        <circle cx="23" cy="22" r="14"/>
        <circle cx="18" cy="20" r="2.5" fill="#111"/><circle cx="28" cy="20" r="2.5" fill="#111"/>
        <path d="M18 28 Q23 31 28 28" fill="none"/>
        <g transform="translate(-10,55)">
          <rect x="0" y="0" width="55" height="32" rx="2"/>
          <path d="M8 -8 h40 l5 8 H3 Z"/>
          <rect x="22" y="10" width="12" height="10" rx="1"/>
          <circle cx="28" cy="15" r="2" fill="#111"/>
        </g>
      </g>
      <g stroke="#111" stroke-width="1.6" fill="none" opacity="0.7">
        <path d="M160 90 h30 M165 100 h28 M170 110 h24"/>
      </g>
      ${tag(145, 155, 'СУНДУК')}${tag(230, 155, 'ДЖО')}`,
      sfxBurst(110, 24, 'НЕТ!'),
      bubble(20, 28, 'Уносит!', 62),
    ),

  'ch-27.svg': () =>
    panel(
      `${boy(40, 100, 'scared')}${boy(100, 105, 'scared')}
      <g fill="#fff" stroke="#111" stroke-width="2">
        <rect x="185" y="50" width="90" height="75"/>
        <path d="M185 50 L230 28 L275 50"/>
        <rect x="215" y="80" width="24" height="45"/>
        <rect x="198" y="62" width="18" height="14"/>
        <rect x="245" y="62" width="18" height="14"/>
      </g>
      ${tag(195, 155, 'СЛЕЖКА')}`,
      '',
      bubble(20, 28, 'Тихо...', 54),
    ),

  'ch-28.svg': () =>
    panel(
      `${boy(30, 105, 'scared')}
      <g fill="#fff" stroke="#111" stroke-width="2">
        <rect x="120" y="45" width="160" height="95"/>
        <rect x="140" y="65" width="50" height="35"/>
        <rect x="210" y="65" width="45" height="55"/>
        <text x="150" y="130" font-size="10" font-weight="700">номер</text>
      </g>
      ${tag(40, 155, 'ОТЕЛЬ')}`,
      sfxBurst(70, 28, 'ШШ'),
      bubble(20, 40, 'Слышишь?', 72),
    ),

  'ch-29.svg': () =>
    panel(
      `${boy(45, 100, 'scared')}
      <g fill="#fff" stroke="#111" stroke-width="2">
        <rect x="160" y="55" width="110" height="75"/>
        <path d="M160 55 L215 28 L270 55"/>
        <rect x="200" y="90" width="28" height="40"/>
        <circle cx="245" cy="95" r="14"/>
        <path d="M237 95 h16 M245 87 v16"/>
        <text x="175" y="80" font-size="9" font-weight="700">вдова</text>
      </g>
      ${tag(40, 155, 'ГЕК')}${tag(180, 155, 'СПАС')}`,
      sfxBurst(70, 24, 'НА ПОМОЩЬ'),
      bubble(20, 50, 'Спасу!', 54),
    ),

  'ch-30.svg': () =>
    panel(
      `${boy(40, 105, 'scared')}${girl(100, 105)}
      <g fill="#fff" stroke="#111" stroke-width="2.5">
        <ellipse cx="230" cy="105" rx="60" ry="58"/>
        <ellipse cx="230" cy="110" rx="28" ry="34" fill="#111"/>
        <path d="M185 70 q45 -35 90 0" fill="none"/>
      </g>
      ${tag(195, 155, 'ПЕЩЕРА')}`,
      sfxBurst(30, 28, 'ЭХО'),
      bubble(20, 45, 'Где выход?', 78),
    ),

  'ch-31.svg': () =>
    panel(
      `${boy(80, 105, 'scared')}${girl(145, 105)}
      <g fill="#fff" stroke="#111" stroke-width="2.5">
        <path d="M18 40 L55 75 L42 160 H12 Z"/>
        <path d="M302 40 L265 75 L278 160 H308 Z"/>
      </g>
      <g transform="translate(148,42)" fill="#fff" stroke="#111" stroke-width="2">
        <rect x="6" y="10" width="24" height="30" rx="2"/>
        <rect x="10" y="2" width="16" height="10"/>
        <circle cx="18" cy="24" r="6"/>
        <path d="M18 40 v10"/>
      </g>
      ${tag(40, 155, 'ТЕМНО')}${tag(210, 28, 'ФОНАРЬ')}`,
      '',
      bubble(40, 24, 'Снова темно...', 90),
    ),

  'ch-32.svg': () =>
    panel(
      `${boy(85, 95, 'happy')}${girl(160, 92)}
      <g fill="#fff" stroke="#111" stroke-width="2">
        <rect x="35" y="40" width="70" height="24" rx="3"/>
        <text x="48" y="57" font-size="12" font-weight="700">УРА!</text>
        <rect x="215" y="40" width="70" height="24" rx="3"/>
        <text x="228" y="57" font-size="12" font-weight="700">ЖИВЫ</text>
      </g>
      ${tag(110, 155, 'НАШЛИСЬ')}`,
      sfxBurst(230, 100, 'УРА!'),
      bubble(40, 24, 'Нашлись!', 72),
    ),

  'ch-33.svg': () =>
    panel(
      `<g fill="#fff" stroke="#111" stroke-width="2.5">
        <rect x="50" y="50" width="90" height="95"/>
        <rect x="80" y="95" width="30" height="50"/>
        <circle cx="100" cy="115" r="5" fill="#111"/>
        <path d="M60 70 h70" stroke-dasharray="4 3"/>
      </g>
      ${boy(200, 95, 'sad')}
      ${tag(55, 155, 'ДВЕРЬ')}`,
      '',
      bubble(175, 28, 'Он погиб...', 78),
    ),

  'ch-34.svg': () =>
    panel(
      `${boy(45, 100, 'happy')}${boy(105, 100, 'sly')}
      <g fill="#fff" stroke="#111" stroke-width="2.2">
        <ellipse cx="230" cy="115" rx="55" ry="28"/>
        <circle cx="205" cy="100" r="12"/><circle cx="230" cy="92" r="14"/><circle cx="255" cy="102" r="11"/>
        <text x="222" y="98" font-size="10" font-weight="700">$</text>
        <text x="248" y="107" font-size="9" font-weight="700">$</text>
      </g>
      ${tag(200, 155, 'ЗОЛОТО')}`,
      sfxBurst(175, 24, 'УРА'),
      bubble(40, 28, 'Мы богаты!', 78),
    ),

  'ch-35.svg': () =>
    panel(
      `${boy(120, 90, 'sad')}
      <g fill="#fff" stroke="#111" stroke-width="2">
        <rect x="35" y="55" width="55" height="45"/>
        <path d="M45 55 v-18 h35 v18"/>
        <text x="48" y="85" font-size="9" font-weight="700">дом</text>
        <path d="M200 95 Q230 75 265 95 Q230 115 200 95" fill="none" stroke-width="2.5"/>
        <path d="M220 60 L230 40 L240 60" fill="none"/>
        <text x="215" y="130" font-size="9" font-weight="700">река</text>
      </g>
      ${tag(130, 155, 'ГЕК')}`,
      '',
      bubble(145, 28, 'Хочу на волю...', 100),
    ),

  'ch-36.svg': () =>
    panel(
      `${boy(90, 90, 'happy')}${boy(175, 95, 'sly')}
      <g fill="#fff" stroke="#111" stroke-width="2">
        <rect x="125" y="42" width="55" height="40" rx="2"/>
        <path d="M152 42 v40"/>
        <text x="133" y="67" font-size="10" font-weight="700">книга</text>
      </g>
      ${tag(115, 155, 'ФИНИШ')}`,
      sfxBurst(230, 110, 'КОНЕЦ?'),
      bubble(40, 28, 'Дальше!', 62),
    ),
}

fs.mkdirSync(outDir, { recursive: true })

let n = 0
for (const [name, factory] of Object.entries(scenes)) {
  if (!factory) {
    console.log('skip', name)
    continue
  }
  fs.writeFileSync(path.join(outDir, name), factory(), 'utf8')
  n += 1
  console.log('wrote', name)
}
console.log(`Done: ${n} scenes`)
