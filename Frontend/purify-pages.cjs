const fs = require('fs');
const path = require('path');

const pages = [
  'src/pages/user/dashboard/index.tsx',
  'src/pages/user/activity/index.tsx',
  'src/pages/user/team/index.tsx',
  'src/pages/user/wallet/index.tsx',
  'src/pages/booking/availability/index.tsx',
  'src/pages/matchmaking/feed/index.tsx',
  'src/pages/matchmaking/messages/index.tsx',
];

pages.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Remove Sidebar and Header blocks
  // Regex to remove <Sidebar /> and any <header>...</header> blocks
  content = content.replace(/<Sidebar\s*\/?>/g, '');
  content = content.replace(/<header[^>]*>[\s\S]*?<\/header>/g, '');
  
  // 2. Remove the outermost div/main wrapper if it has layout classes
  // We want to keep the inner content.
  // We'll look for the first <div> or <main> that has ml-[260px] or min-h-screen or bg-background
  content = content.replace(/<(div|main)[^>]*(ml-\[260px\]|min-h-screen|bg-background)[^>]*>/g, '<>');
  content = content.replace(/<\/(div|main)>\s*<\/(\w+)>\s*$/g, '</>$2'); // Close the fragment
  
  // Specifically for availability which has complex state
  if (filePath.includes('availability')) {
    // Keep the main content div but remove the outer wrapper
    content = content.replace(/<main className="ml-\[260px\][^>]*>/, '<div className="p-8">');
    content = content.replace(/<\/main>/, '</div>');
    content = content.replace(/<div className="min-h-screen bg-background">/, '<>');
    content = content.replace(/<\/div>(\s*);(\s*)\};/g, '</>$1$2};');
  }

  // 3. Clean up imports
  content = content.replace(/import Sidebar from '@shared\/components\/Sidebar';\n/g, '');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Purified: ${filePath}`);
});
