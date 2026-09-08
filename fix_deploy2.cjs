const fs = require('fs');
let code = fs.readFileSync('.github/workflows/deploy.yml', 'utf8');

code = code.replace(
  `        run: |
          npm install
          npx vite build`,
  `        run: |
          npm install
          npm run build`
);

fs.writeFileSync('.github/workflows/deploy.yml', code);
console.log('Fixed deploy.yml');
