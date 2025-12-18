// update-memory.js
const fs = require('fs');
const readline = require('readline');
const path = require('path');

const CONTEXT_FILE = path.join(__dirname, 'CURRENT_CONTEXT.md');

async function updateContext() {
  console.log('📝 UPDATING PROJECT CONTEXT...\n');

  if (!fs.existsSync(CONTEXT_FILE)) {
    console.error('❌ CURRENT_CONTEXT.md not found!');
    process.exit(1);
  }

  let content = fs.readFileSync(CONTEXT_FILE, 'utf8');

  // Update timestamp
  const currentDate = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  content = content.replace(/\*Last Updated: .*\*/, `*Last Updated: ${currentDate}*`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

  console.log('--- SESSION UPDATES ---');

  const focus = await askQuestion('1. Current Focus (What is the main goal right now?): ');
  const changes = await askQuestion('2. Recent Changes (Comma-separated list of achievements): ');
  const roadblocks = await askQuestion('3. Active Roadblocks (Any issues or blockers?): ');

  rl.close();

  // Update Focus Section
  if (focus.trim()) {
    content = content.replace(/(## 🎯 Current Focus\n)([\s\S]*?)(?=\n##|$)/, `$1- ${focus}\n`);
  }

  // Update Recent Changes Section
  if (changes.trim()) {
    const changesList = changes.split(',').map(s => `- ${s.trim()}`).join('\n');
    content = content.replace(/(## 🛠 Recent Changes\n)([\s\S]*?)(?=\n##|$)/, `$1${changesList}\n`);
  }

  // Update Roadblocks Section
  if (roadblocks.trim()) {
    content = content.replace(/(## 🚧 Active Roadblocks & Issues\n)([\s\S]*?)(?=\n##|$)/, `$1- ${roadblocks}\n`);
  } else {
    content = content.replace(/(## 🚧 Active Roadblocks & Issues\n)([\s\S]*?)(?=\n##|$)/, `$1- None currently reported.\n`);
  }

  fs.writeFileSync(CONTEXT_FILE, content);

  console.log('\n✅ CURRENT_CONTEXT.md updated successfully!');
  console.log(`🕒 Timestamp: ${currentDate}`);
}

updateContext().catch((err) => {
  console.error('❌ Error updating context:', err);
  process.exit(1);
});