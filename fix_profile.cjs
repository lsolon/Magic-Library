const fs = require('fs');
let code = fs.readFileSync('src/views/Profile.tsx', 'utf8');

// The block starts with {/* Badges Section */} and ends with <div className="md:col-span-2 space-y-6"> (wait, no, it's just before {/* Right Column: Edit Profile Form */})
// Let's remove it from there.

const badgeRegex = /\{\/\* Badges Section \*\/\}[\s\S]*?\{\/\* Right Column: Edit Profile Form \*\/\}/;
const match = code.match(badgeRegex);

if (match) {
  const badgeSection = match[0].replace('{/* Right Column: Edit Profile Form */}', '').trim();
  
  // Remove from old location
  code = code.replace(badgeRegex, '{/* Right Column: Edit Profile Form */}');
  
  // Insert inside the left column, right after the stats/avatar panel, or right after preset avatars.
  // The left column ends with:
  //               </div>
  //             </div>
  //           </div>
  // Let's insert it before the closing of the left column.
  
  const leftColumnEndMarker = `                ))}
              </div>
            </div>`;
  
  code = code.replace(leftColumnEndMarker, leftColumnEndMarker + '\n\n' + badgeSection);
  fs.writeFileSync('src/views/Profile.tsx', code);
  console.log('Fixed');
} else {
  console.log('Regex did not match');
}
