const fs = require('fs');
let html = fs.readFileSync('player_dashboard.html');
if (html[0] === 0xff && html[1] === 0xfe) html = html.toString('utf16le');
else html = html.toString('utf8');

const match = html.match(/tailwind\.config\s*=\s*(\{[\s\S]*?\});/);
if (match) {
  let cfg = match[1];
  cfg = `/** @type {import('tailwindcss').Config} */\nmodule.exports = ` + cfg.replace(/\}$/, `,\n  content: ['./src/**/*.{js,jsx,ts,tsx}']\n}`);
  fs.writeFileSync('tailwind.config.js', cfg);
  console.log('Tailwind config updated.');
} else {
  console.log('Tailwind config not found.');
}
