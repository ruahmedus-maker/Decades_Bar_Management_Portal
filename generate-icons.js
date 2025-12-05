// generate-icons.js - Run this once to create placeholder icons
const fs = require('fs');
const sharp = require('sharp');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  for (const size of sizes) {
    // Create a simple SVG as placeholder
    const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#2DD4BF"/>
      <text x="50%" y="50%" font-family="Arial" font-size="${size / 5}" fill="white" text-anchor="middle" dy=".3em">${size}</text>
    </svg>`;

    try {
      await sharp(Buffer.from(svg))
        .png()
        .toFile(`public/icon-${size}x${size}.png`);
      console.log(`Generated public/icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`Error generating icon for size ${size}:`, error);
    }
  }
  console.log('Placeholder icons created successfully!');
}

generateIcons();