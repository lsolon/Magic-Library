const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

const newRule = `
    match /access_logs/{logId} {
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow read: if request.auth != null && request.auth.token.email == 'leandrosolon@gmail.com';
    }
  }
}
`;

code = code.replace("  }\n}", newRule);

fs.writeFileSync('firestore.rules', code);
console.log('Patched firestore.rules');
