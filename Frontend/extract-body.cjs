const fs = require('fs');

let rawBuf = fs.readFileSync('booking_latest.html');
// Detect UTF-16 LE BOM (FF FE)
let html;
if (rawBuf[0] === 0xFF && rawBuf[1] === 0xFE) {
  html = rawBuf.toString('utf16le');
} else {
  html = rawBuf.toString('utf8');
}


// Extract <body> content
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
let content = bodyMatch ? bodyMatch[1] : html;

// Remove HTML comments
content = content.replace(/<!--[\s\S]*?-->/g, '');

// class= → className=
content = content.replace(/\bclass=/g, 'className=');

// for= → htmlFor=
content = content.replace(/\bfor=/g, 'htmlFor=');

// Fix void elements
['img', 'input', 'br', 'hr', 'meta', 'link'].forEach(tag => {
  content = content.replace(new RegExp(`<(${tag})([^>]*[^/])>`, 'gi'), '<$1$2 />');
  content = content.replace(new RegExp(`<(${tag})>`, 'gi'), '<$1 />');
});

// Fix boolean attrs
content = content.replace(/disabled=""/g, 'disabled');
content = content.replace(/checked=""/g, 'defaultChecked');
content = content.replace(/selected=""/g, 'defaultValue');

// Fix inline styles
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

// Remove the modal from the static HTML (lines containing fixed inset-0 ... the modal overlay)
// We'll add it back with state control
const modalRegex = /<div\s[^>]*class[^>]*fixed inset-0[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;
content = content.replace(modalRegex, '');

// Write result
fs.writeFileSync('booking_body.txt', content, 'utf8');
console.log('Extracted body. Length:', content.length);
