const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_ICON = path.join(process.cwd(), 'src/app/icon.jpg'); // Adjust source as needed, checking icon.jpg first
const PUBLIC_DIR = path.join(process.cwd(), 'public');

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
    if (!fs.existsSync(SOURCE_ICON)) {
        console.error('Source icon not found:', SOURCE_ICON);
        // Fallback to checking public/icon.jpg if src isn't there
        const publicSource = path.join(PUBLIC_DIR, 'icon.jpg');
        if (!fs.existsSync(publicSource)) {
            console.error('No source icon.jpg found in src/app or public/');
            process.exit(1);
        }
    }

    console.log(`Generating icons from ${SOURCE_ICON}...`);

    for (const size of SIZES) {
        const fileName = `icon-${size}x${size}.png`;
        const outputPath = path.join(PUBLIC_DIR, fileName);

        try {
            await sharp(SOURCE_ICON)
                .resize(size, size)
                .toFile(outputPath);
            console.log(`Generated ${fileName}`);
        } catch (error) {
            console.error(`Error generating ${fileName}:`, error);
        }
    }
}

generateIcons();
