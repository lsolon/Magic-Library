const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

// The problematic lines:
//   @keyframes pulse-glow {
//     0% { box-shadow: 0 0 5px rgba(0, 229, 255, 0.3); }
//     100% { box-shadow: 0 0 15px rgba(0, 229, 255, 0.8); }
//   }
//     100% { box-shadow: 0 0 15px rgba(135, 206, 235, 1); }
//   }

css = css.replace(/@keyframes pulse-glow \{[\s\S]*?100% \{ box-shadow: 0 0 15px rgba\(135, 206, 235, 1\); \}\n  \}/, 
`@keyframes pulse-glow {
    0% { box-shadow: 0 0 5px rgba(0, 229, 255, 0.3); }
    100% { box-shadow: 0 0 15px rgba(0, 229, 255, 0.8); }
  }`);

fs.writeFileSync('src/index.css', css);
