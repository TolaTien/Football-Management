const fs = require('fs');
const path = require('path');

// Pages that have a sidebar to replace
const pages = [
  'src/pages/user/dashboard/index.tsx',
  'src/pages/user/activity/index.tsx',
  'src/pages/user/team/index.tsx',
  'src/pages/user/wallet/index.tsx',
  'src/pages/pitches/booking/index.tsx',
  'src/pages/booking/availability/index.tsx',
  'src/pages/matchmaking/feed/index.tsx',
  'src/pages/matchmaking/messages/index.tsx',
];

pages.forEach((filePath) => {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Replace the import line
  content = content.replace(
    /^import React from 'react';/m,
    `import React from 'react';\nimport { history } from '@umijs/max';\nimport Sidebar from '@shared/components/Sidebar';`
  );

  // 2. Replace the <aside ...> ... </aside> block with <Sidebar />
  // Match from <aside className="fixed left-0 ... to </aside>
  const asideRegex = /<aside\s+className="fixed left-0[\s\S]*?<\/aside>/;
  if (asideRegex.test(content)) {
    content = content.replace(asideRegex, '<Sidebar />');
    console.log(`✅ Replaced sidebar in: ${filePath}`);
  } else {
    console.log(`ℹ️  No fixed sidebar found in: ${filePath}`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('\nDone!');
