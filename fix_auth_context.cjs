const fs = require('fs');

let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

// I'll replace the messed up lines manually
const badBlockRegex = /if \(data\.avatarUrl\) \{[\s\S]*?setLoading\(false\);/g;

const goodBlock = `if (data.avatarUrl) {
              setUserAvatar(data.avatarUrl);
            } else {
              setUserAvatar(currentUser.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + currentUser.uid);
            }
          } else {
            setNeedsProfileSetup(true);
            setIsTrialExpired(false);
            setIsSubscribed(false);
            setTrialDaysLeft(30);
            setUserAvatar(currentUser.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + currentUser.uid);
          }
          setLoading(false);`;

code = code.replace(badBlockRegex, goodBlock);

fs.writeFileSync('src/contexts/AuthContext.tsx', code);
console.log('Fixed AuthContext');
