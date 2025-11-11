// fix-build.js
const fs = require('fs');
const path = require('path');

// Files that need quick fixes
const filesToFix = [
  {
    file: './src/components/FullScreenTest.tsx',
    fixes: [
      {
        find: "interface TestItem {\n  id: string;\n  question: string;\n  options: string[];\n  correctAnswer: number;\n}",
        replace: ""
      }
    ]
  },
  {
    file: './src/components/sections/AlohaPosSection.tsx',
    fixes: [
      {
        find: "cocktail waitress's",
        replace: "cocktail waitress&apos;s"
      },
      {
        find: "don't",
        replace: "don&apos;t"
      },
      {
        find: "it's",
        replace: "it&apos;s"
      }
    ]
  },
  {
    file: './src/components/sections/BarCleaningsSection.tsx',
    fixes: [
      {
        find: "cocktail waitress's",
        replace: "cocktail waitress&apos;s"
      }
    ]
  },
  {
    file: './src/components/sections/ProceduresSection.tsx',
    fixes: [
      {
        find: '"beer and a shot"',
        replace: "&quot;beer and a shot&quot;"
      },
      {
        find: "bartender's",
        replace: "bartender&apos;s"
      }
    ]
  }
];

// Apply fixes
filesToFix.forEach(({ file, fixes }) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    fixes.forEach(({ find, replace }) => {
      content = content.replace(new RegExp(find, 'g'), replace);
    });
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed: ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});

console.log('Build fixes applied!');