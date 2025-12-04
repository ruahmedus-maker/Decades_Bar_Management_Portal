// update-memory.js
const fs = require('fs');
const readline = require('readline');

async function updateMemory() {
  console.log('📝 UPDATING CHAT MEMORY...\n');
  
  const memoryFile = 'CHAT_MEMORY.md';
  const quickStartFile = 'QUICK_START.txt';
  
  // Update timestamp
  let content = fs.readFileSync(memoryFile, 'utf8');
  const currentDate = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  content = content.replace(/Last Updated: .*/, `Last Updated: ${currentDate}`);
  
  console.log('What did we work on? (2-3 bullet points, press Enter twice when done):');
  console.log('Example: "Fixed progress tracking, added debug logs"');
  console.log('');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  let notes = [];
  let lineCount = 0;
  
  for await (const line of rl) {
    if (line.trim() === '') {
      lineCount++;
      if (lineCount >= 2) break;
    } else {
      lineCount = 0;
      notes.push(`- ${line}`);
    }
  }
  
  rl.close();
  
  if (notes.length > 0) {
    // Insert notes under RECENT FIXES
    const newSection = `\n### ${currentDate}\n\n${notes.join('\n')}\n`;
    content = content.replace(/(### RECENT FIXES:.*?\n)/, `$1${newSection}`);
    
    fs.writeFileSync(memoryFile, content);
    console.log('\n✅ Memory updated!');
  } else {
    fs.writeFileSync(memoryFile, content);
    console.log('\n⚠️  No notes, just updated timestamp.');
  }
  
  // Show QUICK_START for next session
  console.log('\n📋 Quick Start for next chat (COPY THIS):');
  console.log('='.repeat(40));
  console.log(fs.readFileSync(quickStartFile, 'utf8'));
  console.log('='.repeat(40));
  console.log('\n🚀 Next session: Paste the above text FIRST!');
}

updateMemory().catch(console.error);