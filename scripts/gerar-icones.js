const sharp = require('sharp');

async function gerarIcones() {
  const tamanhos = [192, 512];

  for (const size of tamanhos) {
    const metade = size / 2;
    const raio = size * 0.15;
    const stroke = size * 0.03;
    const circulo = size * 0.12;
    const fontSize = size * 0.28;
    const fontSizeSifrao = size * 0.13;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="${size}" height="${size}" fill="#0a0a0a" rx="${raio}"/>
      <rect x="${stroke}" y="${stroke}" width="${size - stroke * 2}" height="${size - stroke * 2}" fill="none" stroke="#1a3a4a" stroke-width="${stroke}" rx="${raio * 0.85}"/>
      <circle cx="${metade}" cy="${size * 0.28}" r="${circulo}" fill="#1a3a4a"/>
      <rect x="${size * 0.2}" y="${size * 0.45}" width="${size * 0.6}" height="${fontSize}" fill="#3d5a3e" rx="4"/>
      <rect x="${size * 0.2}" y="${size * 0.62}" width="${size * 0.6}" height="${fontSize * 0.6}" fill="#3d5a3e" rx="4"/>
    </svg>`;

    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(`public/icons/icon-${size}.png`);

    console.log(`Gerado: icon-${size}.png`);
  }
}

gerarIcones();