// optimize-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = 'public/images/decades';
const outputDir = 'public/images/decades-optimized';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir).filter(file => 
  file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
);

files.forEach(async (file) => {
  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, file);
  
  try {
    await sharp(inputPath)
      .resize(1920, 1080) // Resize to reasonable dimensions
      .jpeg({ quality: 80 }) // Reduce quality
      .toFile(outputPath);
    
    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    
    console.log(`✅ ${file}: ${(originalSize/1024/1024).toFixed(2)}MB → ${(optimizedSize/1024/1024).toFixed(2)}MB`);
  } catch (error) {
    console.log(`❌ Error optimizing ${file}:`, error.message);
  }
});