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
  
  // Replace the messy fragments and mismatched closing tags
  // We want the component to just return a single <div className="p-8">...</div>
  // which will go inside the <main> of UserLayout.
  
  // 1. Find the first meaningful content (usually starts with a div or section)
  // We'll look for everything inside the first return's outermost wrapper.
  
  // Strategy: Replace everything from 'return (' to the end with a clean version.
  const returnMatch = content.match(/return \([\s\S]*?\);/);
  if (returnMatch) {
    let innerContent = returnMatch[0];
    
    // Remove Sidebar, Header, etc.
    innerContent = innerContent.replace(/<Sidebar\s*\/?>/g, '');
    innerContent = innerContent.replace(/<header[^>]*>[\s\S]*?<\/header>/g, '');
    
    // Strip outer main/div wrappers
    innerContent = innerContent.replace(/<(main|div)[^>]*(ml-\[260px\]|min-h-screen|bg-background)[^>]*>/g, '');
    
    // Clean up closing tags at the end
    innerContent = innerContent.replace(/<\/(main|div)>\s*<\/(main|div|div)>\s*\);/g, '</div>\n  );');
    
    // Ensure it starts with a div
    if (!innerContent.includes('<div className="p-8">')) {
       innerContent = innerContent.replace(/return \(\s*(<>\s*)?/, 'return (\n    <div className="p-8">\n      ');
    }
    
    content = content.replace(/return \([\s\S]*?\);/, innerContent);
  }

  // 2. Fix the component name and exports if they got messed up
  content = content.replace(/<>\s*<>\s*<div/g, '<div');
  content = content.replace(/<\/div>\s*<\/main>\s*<\/div>/g, '</div>');
  content = content.replace(/<\/div>\s*<\/main>/g, '</div>');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Cleaned tags: ${filePath}`);
});
