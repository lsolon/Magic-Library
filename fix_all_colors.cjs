const fs = require('fs');
const path = require('path');

const colorMap = {
  '#0c6780': 'primary',
  '#87ceeb': 'primary-container',
  '#005870': 'on-primary-container',
  '#705d00': 'secondary',
  '#fcd400': 'secondary-container',
  '#6e5c00': 'on-secondary-container',
  '#006e1c': 'tertiary',
  '#76da75': 'tertiary-container',
  '#005f17': 'on-tertiary-container',
  '#fefccf': 'background', // Or surface
  '#1d1d03': 'on-background',
  '#e6e5b9': 'surface-variant',
  '#3f484c': 'on-surface-variant',
  '#eceabe': 'surface-container-high',
  '#f8f6c9': 'surface-container-low',
  '#f2f0c4': 'surface-container',
  '#e9c400': 'secondary-fixed-dim',
  '#ba1a1a': 'error',
  '#ffdad6': 'error-container',
  '#bfc8cd': 'outline-variant',
  '#6f787d': 'outline'
};

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let code = fs.readFileSync(fullPath, 'utf8');
      
      for (const [hex, name] of Object.entries(colorMap)) {
        const regex = new RegExp(`\\[${hex}\\]`, 'gi');
        code = code.replace(regex, name);
      }
      
      code = code.replace(/rgba\(12,\s*103,\s*128,\s*[\d.]+\)/g, 'rgba(0, 229, 255, 0.2)');
      fs.writeFileSync(fullPath, code);
    }
  }
}

processDirectory('src/views');
processDirectory('src/components');
console.log('All colors replaced universally!');
