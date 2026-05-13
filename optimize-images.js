const sharp = require('sharp');
const path = require('path');

// Map each used image to its max display width (px) and WebP quality
const images = [
  // Hero main — LCP image, ~50vw, needs good quality
  { src: '16.jpg', width: 1200, quality: 82 },
  // Hero grid overlay — 220px column
  { src: '05.jpg', width: 500,  quality: 78 },
  { src: '12.jpg', width: 500,  quality: 78 },
  { src: '11.jpg', width: 500,  quality: 78 },
  // Tagline band
  { src: '04.jpg', width: 900,  quality: 80 },
  // Full-width banner
  { src: '15.jpg', width: 1600, quality: 78 },
  // Menu block images (~40% width)
  { src: '01.jpg', width: 800,  quality: 80 },
  { src: '08.jpg', width: 800,  quality: 80 },
  // Photo strip (~25vw each)
  { src: '02.jpg', width: 700,  quality: 78 },
  { src: '03.jpg', width: 700,  quality: 78 },
  { src: '06.jpg', width: 700,  quality: 78 },
  { src: '07.jpg', width: 700,  quality: 78 },
];

const dir = path.join(__dirname, 'images');

(async () => {
  for (const { src, width, quality } of images) {
    const input  = path.join(dir, src);
    const output = path.join(dir, src.replace('.jpg', '.webp'));

    const info = await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toFile(output);

    const orig = require('fs').statSync(input).size;
    console.log(
      `${src} → ${src.replace('.jpg','.webp')}  ` +
      `${Math.round(orig/1024)}KB → ${Math.round(info.size/1024)}KB  ` +
      `(${info.width}×${info.height})`
    );
  }
  console.log('\nDone.');
})();
