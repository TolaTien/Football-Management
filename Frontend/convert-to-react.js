import fs from 'fs';

function htmlToJsx(html) {
  // Extract body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let content = bodyMatch ? bodyMatch[1] : html;

  // Convert class to className
  content = content.replace(/class=/g, 'className=');

  // Convert for to htmlFor
  content = content.replace(/for=/g, 'htmlFor=');

  // Close common unclosed tags
  const unclosedTags = ['img', 'input', 'br', 'hr', 'meta', 'link'];
  unclosedTags.forEach(tag => {
    const regex = new RegExp(`<${tag}([^>]*[^/])>`, 'gi');
    content = content.replace(regex, `<${tag}$1 />`);
  });

  // Convert some common svg properties to camelCase
  const svgProps = [
    'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'fill-rule', 'clip-rule',
    'stroke-dasharray', 'stroke-dashoffset', 'viewBox'
  ];
  svgProps.forEach(prop => {
    const camelCase = prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    const regex = new RegExp(`${prop}=`, 'gi');
    content = content.replace(regex, `${camelCase}=`);
  });

  // Inline styles are trickier, but let's try a basic fix or just assume we don't have complex inline styles in Stitch Tailwind outputs
  content = content.replace(/style="([^"]*)"/g, (match, styleString) => {
    const styleObj = {};
    styleString.split(';').forEach(style => {
      const parts = style.split(':');
      if (parts.length === 2) {
        const key = parts[0].trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        styleObj[key] = parts[1].trim();
      }
    });
    return `style={${JSON.stringify(styleObj)}}`;
  });

  // Remove comment tags that might break JSX if not formatted properly
  content = content.replace(/<!--[\s\S]*?-->/g, '');

  return `
import React from 'react';

const GeneratedPage: React.FC = () => {
  return (
    <>
      ${content}
    </>
  );
};

export default GeneratedPage;
`;
}

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
  console.error('Usage: node convert-to-react.js <input-html> <output-tsx>');
  process.exit(1);
}

const html = fs.readFileSync(inputPath, 'utf8');
// Fix UTF-16 if needed
const isUtf16le = html.charCodeAt(0) === 0xFFFD || html.indexOf('\u0000') !== -1;
const actualHtml = isUtf16le ? fs.readFileSync(inputPath, 'utf16le') : html;

const jsx = htmlToJsx(actualHtml);
fs.writeFileSync(outputPath, jsx, 'utf8');
console.log(`Converted ${inputPath} to ${outputPath}`);
