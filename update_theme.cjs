const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

const newColors = `  --color-primary: #00e5ff;
  --color-primary-container: #003d4d;
  --color-on-primary-container: #b3f7ff;
  --color-secondary: #ffc107;
  --color-secondary-container: #4d3900;
  --color-on-secondary-container: #ffe082;
  --color-tertiary: #b057fa;
  --color-tertiary-container: #3c0966;
  --color-on-tertiary-container: #e8baff;
  
  --color-background: #090a1e;
  --color-on-background: #e0e0f5;
  --color-surface: #151538;
  --color-on-surface: #e0e0f5;
  --color-surface-variant: #262654;
  --color-on-surface-variant: #b0b0d1;
  
  --color-surface-container-lowest: #050614;
  --color-surface-container-low: #0f102b;
  --color-surface-container: #1a1a40;
  --color-surface-container-high: #242454;
  --color-surface-container-highest: #31316b;
  
  --color-outline: #6b6b9e;
  --color-outline-variant: #3a3a66;
  
  --color-error: #ff5252;
  --color-error-container: #4d0000;
  --color-on-error: #ffffff;
  --color-on-error-container: #ffdad6;`;

css = css.replace(/--color-primary:.*--color-on-error-container: [^;]+;/s, newColors);

// Also replace the body background with a nice gradient and add a starry background
const newBody = `body {
    font-family: var(--font-quicksand);
    background-color: var(--color-background);
    background-image: 
      radial-gradient(circle at 15% 50%, rgba(13, 85, 148, 0.2), transparent 25%),
      radial-gradient(circle at 85% 30%, rgba(105, 33, 168, 0.2), transparent 25%);
    color: var(--color-on-background);
    min-height: 100vh;
  }`;

css = css.replace(/body\s*{[^}]+}/, newBody);

// Update glass panel for dark mode
const newGlass = `.glass-panel {
    background: rgba(30, 30, 80, 0.5);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(0, 229, 255, 0.2);
  }`;
  
css = css.replace(/\.glass-panel\s*{[^}]+}/, newGlass);

// Update magic shadow
const newShadow = `.magic-shadow {
    box-shadow: 0 10px 25px -5px rgba(0, 229, 255, 0.15), 0 8px 10px -6px rgba(0, 229, 255, 0.1);
  }`;
css = css.replace(/\.magic-shadow\s*{[^}]+}/, newShadow);

// progress glow
const newGlow = `@keyframes pulse-glow {
    0% { box-shadow: 0 0 5px rgba(0, 229, 255, 0.3); }
    100% { box-shadow: 0 0 15px rgba(0, 229, 255, 0.8); }
  }`;
css = css.replace(/@keyframes pulse-glow\s*{[^}]+}/, newGlow);

fs.writeFileSync('src/index.css', css);
