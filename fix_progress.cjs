const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let code = fs.readFileSync(fullPath, 'utf8');
      
      // Make progress bar bright cyan (primary) instead of dark primary-container
      code = code.replace(/"bg-primary-container progress-glow"/g, '"bg-primary progress-glow"');
      
      fs.writeFileSync(fullPath, code);
    }
  }
}

processDirectory('src/views');
processDirectory('src/components');
console.log('Progress bar fixed to bright primary!');
