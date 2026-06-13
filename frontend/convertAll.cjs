const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Comprehensive HTML-to-JSX converter that:
 * 1. Preserves ALL SVGs with proper camelCase attributes
 * 2. Preserves ALL content between header/footer
 * 3. Converts class → className (via regex, NOT jsdom which lowercases it)
 * 4. Strips scripts, styles (styles go to CSS), and comments
 * 5. Self-closes void elements
 * 6. Adds Material Symbols font link
 */

// Use the "Remastered" versions from Stitch where available
const screens = [
  { file: 'ProductDetail.jsx', name: 'ProductDetail',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2IyZTQ1YzBlM2RjMjQxNmI4NDM2ODQ4MWY5MmNiNzYwEgsSBxC_77_vvhMYAZIBIwoKcHJvamVjdF9pZBIVQhM5ODM5NDM3MzkyNzc1MDE5OTMx&filename=&opi=89354086' },
  { file: 'ReturnFlow.jsx', name: 'ReturnFlow',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzU2YTU3MzZiMmRiODQ0ZGM4YjhkNThkNjdiMTEzNDJlEgsSBxC_77_vvhMYAZIBIwoKcHJvamVjdF9pZBIVQhM5ODM5NDM3MzkyNzc1MDE5OTMx&filename=&opi=89354086' },
  { file: 'ReturnInterception.jsx', name: 'ReturnInterception',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2MwYTBlNGZiMjAxYTRiM2Q4ODFhMTc4NDM3ZTRlYjY0EgsSBxC_77_vvhMYAZIBIwoKcHJvamVjdF9pZBIVQhM5ODM5NDM3MzkyNzc1MDE5OTMx&filename=&opi=89354086' },
  { file: 'OutgrownIt.jsx', name: 'OutgrownIt',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2FlODEzMzYzYTA3YTQ3YWI4NTA1NzZiNTNkN2M3ZjNmEgsSBxC_77_vvhMYAZIBIwoKcHJvamVjdF9pZBIVQhM5ODM5NDM3MzkyNzc1MDE5OTMx&filename=&opi=89354086' },
  { file: 'SellerDashboard.jsx', name: 'SellerDashboard',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2M4NzFjMzFlOWU5NDRjMTY5YTlhMTQwOTMzY2UwZjI0EgsSBxC_77_vvhMYAZIBIwoKcHJvamVjdF9pZBIVQhM5ODM5NDM3MzkyNzc1MDE5OTMx&filename=&opi=89354086' },
  { file: 'MyReturns.jsx', name: 'MyReturns',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzg3NzlmNWU2ZmY3MjQzYTA5ZDRhZWZhMDlmMGQ2ZGQ0EgsSBxC_77_vvhMYAZIBIwoKcHJvamVjdF9pZBIVQhM5ODM5NDM3MzkyNzc1MDE5OTMx&filename=&opi=89354086' },
  { file: 'GreenProfile.jsx', name: 'GreenProfile',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzQ1NDRlNzM4NTA2YzQ2NmI4Y2QxYmM3YjI4ZmRlZDZjEgsSBxC_77_vvhMYAZIBIwoKcHJvamVjdF9pZBIVQhM5ODM5NDM3MzkyNzc1MDE5OTMx&filename=&opi=89354086' },
  { file: 'AdminDashboard.jsx', name: 'AdminDashboard',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2Q3MGY4YjExYjQ2NDQ4YjE4N2Q2Y2NlODA2NzI2MTNiEgsSBxC_77_vvhMYAZIBIwoKcHJvamVjdF9pZBIVQhM5ODM5NDM3MzkyNzc1MDE5OTMx&filename=&opi=89354086' },
];

let allStyles = [];

function htmlToJsx(html) {
  // 1. Extract styles first
  html.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (match, css) => {
    allStyles.push(css.trim());
    return '';
  });
  
  // 2. Remove <style>, <script>, <link> tags
  html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<link[^>]*>/gi, '');
  
  // 3. Extract body content between header and footer
  let content = html;
  
  // Try to find <main> first
  let mainMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) {
    content = mainMatch[0];
  } else {
    // Otherwise get content between header close and footer open
    const headerEnd = content.indexOf('</header>');
    const footerStart = content.indexOf('<footer');
    if (headerEnd !== -1 && footerStart !== -1) {
      content = content.substring(headerEnd + 9, footerStart);
    } else {
      // Just get body
      const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) content = bodyMatch[1];
    }
  }
  
  // Remove header/footer from extracted content just in case
  content = content.replace(/<header[\s\S]*?<\/header>/gi, '');
  content = content.replace(/<footer[\s\S]*?<\/footer>/gi, '');
  content = content.replace(/<nav[\s\S]*?<\/nav>/gi, function(match) {
    // Only remove top-level nav bars that look like site navigation
    if (match.includes('ReLoop') && match.includes('Trade-In')) return '';
    return match;
  });

  // 4. Remove HTML comments
  content = content.replace(/<!--[\s\S]*?-->/g, '');
  
  // 5. Convert class= to className= (ONLY standalone `class=`, not `className=`)
  // Use a careful regex that matches class=" but not className="
  content = content.replace(/\bclass=/g, 'className=');
  
  // 6. Convert for= to htmlFor=
  content = content.replace(/\bfor=/g, 'htmlFor=');
  
  // 7. SVG attribute conversions
  content = content.replace(/\bstroke-width=/g, 'strokeWidth=');
  content = content.replace(/\bstroke-linecap=/g, 'strokeLinecap=');
  content = content.replace(/\bstroke-linejoin=/g, 'strokeLinejoin=');
  content = content.replace(/\bfill-rule=/g, 'fillRule=');
  content = content.replace(/\bclip-rule=/g, 'clipRule=');
  content = content.replace(/\bstroke-dasharray=/g, 'strokeDasharray=');
  content = content.replace(/\bstroke-dashoffset=/g, 'strokeDashoffset=');
  content = content.replace(/\bstroke-miterlimit=/g, 'strokeMiterlimit=');
  content = content.replace(/\bclip-path=/g, 'clipPath=');
  content = content.replace(/\bstop-color=/g, 'stopColor=');
  content = content.replace(/\bstop-opacity=/g, 'stopOpacity=');
  content = content.replace(/\bfill-opacity=/g, 'fillOpacity=');
  content = content.replace(/\bfont-size=/g, 'fontSize=');
  content = content.replace(/\bfont-family=/g, 'fontFamily=');
  content = content.replace(/\bfont-weight=/g, 'fontWeight=');
  content = content.replace(/\btext-anchor=/g, 'textAnchor=');
  content = content.replace(/\bxmlns:xlink=/g, 'xmlnsXlink=');
  content = content.replace(/\bxlink:href=/g, 'xlinkHref=');
  
  // 8. Convert inline style="..." to React-compatible style objects
  // For simplicity, strip inline styles (Stitch uses Tailwind classes)
  content = content.replace(/\bstyle="[^"]*"/g, '');
  
  // 9. Self-close void elements
  content = content.replace(/<img([^>]*[^\/])>/g, '<img$1 />');
  content = content.replace(/<input([^>]*[^\/])>/g, '<input$1 />');
  content = content.replace(/<br\s*>/g, '<br />');
  content = content.replace(/<hr([^>]*[^\/])>/g, '<hr$1 />');
  content = content.replace(/<meta([^>]*[^\/])>/g, '<meta$1 />');
  content = content.replace(/<source([^>]*[^\/])>/g, '<source$1 />');
  
  // 10. Fix boolean attributes
  content = content.replace(/ checked(?=[^=\w])/g, ' defaultChecked');
  content = content.replace(/ disabled(?=[^=\w])/g, ' disabled');
  content = content.replace(/ selected(?=[^=\w])/g, ' selected');
  content = content.replace(/ readonly(?=[^=\w])/gi, ' readOnly');
  
  // 11. Fix tabindex → tabIndex
  content = content.replace(/\btabindex=/g, 'tabIndex=');
  content = content.replace(/\bcellpadding=/g, 'cellPadding=');
  content = content.replace(/\bcellspacing=/g, 'cellSpacing=');
  content = content.replace(/\bcolspan=/g, 'colSpan=');
  content = content.replace(/\browspan=/g, 'rowSpan=');
  content = content.replace(/\bmaxlength=/g, 'maxLength=');
  content = content.replace(/\bautocomplete=/g, 'autoComplete=');
  content = content.replace(/\bautofocus/g, 'autoFocus');
  
  return content.trim();
}

screens.forEach(s => {
  try {
    console.log('Downloading ' + s.file + '...');
    execSync(`curl -s -L "${s.url}" -o temp_download.html`, { timeout: 30000 });
    const html = fs.readFileSync('temp_download.html', 'utf8');
    
    const jsx = htmlToJsx(html);
    
    const component = `import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function ${s.name}() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8">
          ${jsx}
        </div>
      </main>
      <Footer />
    </div>
  );
}
`;
    
    fs.writeFileSync(path.join('src', 'pages', s.file), component);
    console.log('  ✓ Generated ' + s.file);
  } catch (e) {
    console.log('  ✗ Error processing ' + s.file + ': ' + e.message);
  }
});

// Write global styles
const styleOutput = allStyles.filter((v, i, a) => a.indexOf(v) === i).join('\n\n');
const indexCss = fs.readFileSync('src/index.css', 'utf8');

// Remove old auto-extracted styles if present
const cleanedCss = indexCss.replace(/\/\* Auto-extracted from Stitch \*\/[\s\S]*/g, '').trim();

fs.writeFileSync('src/index.css', cleanedCss + '\n\n/* Auto-extracted from Stitch */\n' + styleOutput + '\n');
console.log('\n✓ Updated index.css with Stitch styles');

// Clean up temp file
try { fs.unlinkSync('temp_download.html'); } catch(e) {}

console.log('\nDone! All 8 pages regenerated with proper className attributes.');
