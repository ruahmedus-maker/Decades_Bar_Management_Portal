// scripts/upload-banners.js
const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');

async function uploadBanners() {
  const bannersDir = path.join(process.cwd(), 'public/images/decades');
  const files = [
    'banner-main.jpg',
    'banner-main2.jpg', 
    'banner-main3.jpg',
    'banner-main4.jpg',
    'banner-main5.jpg'
  ];

  console.log('📤 Uploading banner images to Vercel Blob...\n');

  const results = [];
  
  for (const file of files) {
    try {
      const filePath = path.join(bannersDir, file);
      const fileBuffer = fs.readFileSync(filePath);
      
      const blob = await put(`decades-${file}`, fileBuffer, {
        access: 'public',
      });
      
      console.log(`✅ ${file} → ${blob.url}`);
      results.push(blob.url);
    } catch (error) {
      console.log(`❌ ${file} failed:`, error.message);
    }
  }

  console.log('\n🎉 Upload complete! Add these URLs to DecadesBanner.tsx:');
  console.log(JSON.stringify(results, null, 2));
}

uploadBanners().catch(console.error);