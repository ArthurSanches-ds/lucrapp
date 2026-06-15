const sharp = require('sharp');
const fs = require('fs');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 680">
  <rect width="680" height="680" fill="#0a0a0a" rx="120"/>
  <rect x="20" y="20" width="640" height="640" fill="none" stroke="#1a3a4a" stroke-width="12" rx="104"/>
  <rect x="32" y="32" width="616" height="616" fill="none" stroke="#1a3a4a" stroke-width="4" rx="96" opacity="0.5"/>
  <circle cx="340" cy="190" r="52" fill="#1a3a4a"/>
  <text x="340" y="207" text-anchor="middle" font-family="Arial, sans-serif" font-size="52" font-weight="900" fill="#3d5a3e">$</text>
  <text x="340" y="390" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="120" font-weight="900" fill="#3d5a3e" letter-spacing="-4">Lucr</text>
  <text x="340" y="510" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="120" font-weight="900" fill="#3d5a3e" letter-spacing="-4">App</text>
  <line x1="160" y1="415" x2="520" y2="415" stroke="#1a3a4a" stroke-width="2" opacity="0.6"/>
</svg>`;

const svgBuffer = Buffer.from(svg);

const tamanhos = [192, 512];

async function gerarIcones() {
  for (const tamanho of tamanhos) {
    await sharp(svgBuffer)
      .resize(tamanho, tamanho)
      .png()
      .toFile(`public/icons/icon-${tamanho}.png`);
    console.log(`Gerado: icon-${tamanho}.png`);
  }
}

gerarIcones();