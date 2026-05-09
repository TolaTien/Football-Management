const fs = require('fs');
const path = require('path');

// Pages that now live inside UserLayout - strip their standalone Sidebar/Header/wrapper
const pages = [
  'src/pages/user/dashboard/index.tsx',
  'src/pages/user/activity/index.tsx',
  'src/pages/user/team/index.tsx',
  'src/pages/user/wallet/index.tsx',
  'src/pages/matchmaking/feed/index.tsx',
  'src/pages/matchmaking/messages/index.tsx',
];

pages.forEach((filePath) => {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Remove Sidebar import
  content = content.replace(/\nimport Sidebar from '@shared\/components\/Sidebar';\n/, '\n');

  // Remove <Sidebar /> usage
  content = content.replace(/\s*<Sidebar \/>\n?/g, '\n');

  // Remove history import if not used elsewhere
  // (keep it if used for navigation)
  if (!content.includes('history.push') && !content.includes('history.replace')) {
    content = content.replace(/import \{ history \} from '@umijs\/max';\n/, '');
    content = content.replace(/import \{ history, useLocation \} from '@umijs\/max';\n/, "import { useLocation } from '@umijs/max';\n");
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Cleaned: ${filePath}`);
});

console.log('\nDone! Pages are now pure content - UserLayout provides sidebar+header.');
