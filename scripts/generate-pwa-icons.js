const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Icône carrée "N" stylisée, cohérente avec l'identité Circuit & Signal :
// fond ink (#0B0E14), trait cuivre (#E8542C), point signal vert (#1FA67A).
const svg = `
<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#0B0E14"/>
  <path d="M160 380V132L352 380V132" stroke="#E8542C" stroke-width="34" stroke-linecap="square" fill="none"/>
  <circle cx="160" cy="132" r="16" fill="#E8542C"/>
  <circle cx="352" cy="380" r="16" fill="#1FA67A"/>
</svg>
`;

const outDir = path.join(__dirname, "..", "public", "icons");
fs.mkdirSync(outDir, { recursive: true });

const sizes = [192, 512];

async function run() {
  for (const size of sizes) {
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(path.join(outDir, `icon-${size}.png`));
    console.log(`icon-${size}.png OK`);
  }

  // Icône "maskable" (avec marge de sécurité pour le masque adaptatif Android)
  const maskableSvg = `
  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" fill="#0B0E14"/>
    <path d="M196 340V172L316 340V172" stroke="#E8542C" stroke-width="28" stroke-linecap="square" fill="none"/>
    <circle cx="196" cy="172" r="13" fill="#E8542C"/>
    <circle cx="316" cy="340" r="13" fill="#1FA67A"/>
  </svg>
  `;
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(outDir, "icon-maskable-512.png"));
  console.log("icon-maskable-512.png OK");
}

run();
