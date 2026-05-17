const https = require('https');
const fs = require('fs');
const path = require('path');

const screens = [
  {
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzE0ODU5NjQ2ZWUzMTQyYzBhNWZkZTBjOTYzNmY5NTkyEgsSBxDtmZOxtwUYAZIBIwoKcHJvamVjdF9pZBIVQhM2MzMxMzM0NDI1MTU5MTAxNzQ4&filename=&opi=89354086',
    file: 'src/pages/auth/login/index.tsx',
    name: 'Player Login'
  },
  {
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2EwNTkyN2RhNjdmNTQxZDU4ZTg3ODA5Nzc4MzFmN2YyEgsSBxDtmZOxtwUYAZIBIwoKcHJvamVjdF9pZBIVQhM2MzMxMzM0NDI1MTU5MTAxNzQ4&filename=&opi=89354086',
    file: 'src/pages/auth/signup/index.tsx',
    name: 'Player Sign Up'
  },
  {
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2FjZDJmYzJiZDE5YjQ4NjNiYmIyNjFhODM0NjdjMGMyEgsSBxDtmZOxtwUYAZIBIwoKcHJvamVjdF9pZBIVQhM2MzMxMzM0NDI1MTU5MTAxNzQ4&filename=&opi=89354086',
    file: 'src/pages/booking/availability/index.tsx',
    name: 'Book Pitch Availability'
  },
  {
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzgxN2I5MmU2YWE5NDQxODM5NTA2OWRmMDE5ZjYwMDQ5EgsSBxDtmZOxtwUYAZIBIwoKcHJvamVjdF9pZBIVQhM2MzMxMzM0NDI1MTU5MTAxNzQ4&filename=&opi=89354086',
    file: 'src/pages/user/activity/index.tsx',
    name: 'Personal Activity & Stats'
  },
  {
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzVhYzk1MGQ1OGY5NTRkMzY4MjEyN2M3N2EzZGZkYjlhEgsSBxDtmZOxtwUYAZIBIwoKcHJvamVjdF9pZBIVQhM2MzMxMzM0NDI1MTU5MTAxNzQ4&filename=&opi=89354086',
    file: 'src/pages/user/team/index.tsx',
    name: 'My Team & Activity'
  },
  {
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2ZiNGU5MjhiZTEyODQ5NDViMTZjZjllOGRmZTZkMTVkEgsSBxDtmZOxtwUYAZIBIwoKcHJvamVjdF9pZBIVQhM2MzMxMzM0NDI1MTU5MTAxNzQ4&filename=&opi=89354086',
    file: 'src/pages/matchmaking/feed/index.tsx',
    name: 'Social Matchmaking Feed'
  },
  {
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2JmY2IyNDc1YmExODQ5OGRhZGI5Mzk2MjZjNTU3Y2FlEgsSBxDtmZOxtwUYAZIBIwoKcHJvamVjdF9pZBIVQhM2MzMxMzM0NDI1MTU5MTAxNzQ4&filename=&opi=89354086',
    file: 'src/pages/matchmaking/messages/index.tsx',
    name: 'Private Direct Messages'
  },
  {
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2FlN2FmYWExNGZkMDRmZTZhODU2NWIyZTQ1NWMzZjlhEgsSBxDtmZOxtwUYAZIBIwoKcHJvamVjdF9pZBIVQhM2MzMxMzM0NDI1MTU5MTAxNzQ4&filename=&opi=89354086',
    file: 'src/pages/user/wallet/index.tsx',
    name: 'My Wallet & Transactions'
  },
];

function htmlToTsx(html, name) {
  // Extract body
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let content = bodyMatch ? bodyMatch[1] : html;

  // Convert HTML attributes to JSX
  content = content.replace(/\bclass=/g, 'className=');
  content = content.replace(/\bfor=/g, 'htmlFor=');
  content = content.replace(/<!--[\s\S]*?-->/g, '');

  // Fix void elements
  ['img', 'input', 'br', 'hr', 'meta', 'link'].forEach(tag => {
    content = content.replace(new RegExp(`<(${tag})([^>]*[^/])>`, 'gi'), '<$1$2 />');
    content = content.replace(new RegExp(`<(${tag})>`, 'gi'), '<$1 />');
  });

  // Fix disabled=""
  content = content.replace(/disabled=""/g, 'disabled');
  content = content.replace(/disabled="disabled"/gi, 'disabled');

  // Fix checked=""
  content = content.replace(/checked=""/g, 'checked');
  content = content.replace(/selected=""/g, 'selected');

  // Fix SVG camelCase props
  const svgCamel = {
    'stroke-width': 'strokeWidth',
    'stroke-linecap': 'strokeLinecap',
    'stroke-linejoin': 'strokeLinejoin',
    'fill-rule': 'fillRule',
    'clip-rule': 'clipRule',
    'stroke-dasharray': 'strokeDasharray',
    'font-size': null, // keep in className
  };
  Object.entries(svgCamel).forEach(([from, to]) => {
    if (to) content = content.replace(new RegExp(`${from}=`, 'g'), `${to}=`);
  });

  // Fix inline styles: style="..." -> style={{...}}
  content = content.replace(/style="([^"]*)"/g, (_, s) => {
    const obj = {};
    s.split(';').forEach(decl => {
      const [k, ...rest] = decl.split(':');
      if (k && rest.length) {
        const key = k.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        obj[key] = rest.join(':').trim();
      }
    });
    return `style={${JSON.stringify(obj)}}`;
  });

  const componentName = name.replace(/[^a-zA-Z0-9]/g, '');

  return `import React from 'react';

const ${componentName}: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      ${content}
    </div>
  );
};

export default ${componentName};
`;
}

function fetchAndSave(screen) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(screen.url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0' }
    };

    const req = https.get(options, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        let html = Buffer.concat(chunks);
        // Detect UTF-16 LE BOM
        if (html[0] === 0xFF && html[1] === 0xFE) {
          html = html.toString('utf16le');
        } else {
          html = html.toString('utf8');
        }
        const tsx = htmlToTsx(html, screen.name);
        fs.writeFileSync(screen.file, tsx, 'utf8');
        console.log(`✅ ${screen.name} -> ${screen.file}`);
        resolve();
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error(`Timeout: ${screen.name}`)); });
  });
}

(async () => {
  for (const screen of screens) {
    try {
      await fetchAndSave(screen);
    } catch (e) {
      console.error(`❌ Failed: ${screen.name} - ${e.message}`);
    }
  }
  console.log('\nDone!');
})();
