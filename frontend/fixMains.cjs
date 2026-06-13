const fs = require('fs');
const path = require('path');

const d = path.join(__dirname, 'src', 'pages');
const files = ['AdminDashboard.jsx','GreenProfile.jsx','MyReturns.jsx','OutgrownIt.jsx',
               'ProductDetail.jsx','ReturnFlow.jsx','ReturnInterception.jsx','SellerDashboard.jsx'];

files.forEach(f => {
  let c = fs.readFileSync(path.join(d, f), 'utf8');
  
  // The wrapper template is:
  //   <main className="flex-grow">
  //     <div className="max-w-...">
  //       [INNER CONTENT which may contain <main>...</main>]
  //     </div>
  //   </main>
  //
  // The inner <main> from Stitch HTML needs to become <div>
  // and its </main> needs to become </div>
  
  // Find all <main and </main> occurrences with positions
  let opens = [];
  let closes = [];
  let re;
  
  re = /<main[\s>]/g;
  let m;
  while ((m = re.exec(c)) !== null) opens.push(m.index);
  
  re = /<\/main>/g;
  while ((m = re.exec(c)) !== null) closes.push(m.index);
  
  console.log(`${f}: ${opens.length} opens, ${closes.length} closes`);
  
  if (opens.length === 2 && closes.length === 2) {
    // Replace the SECOND open <main with <div
    // Replace the FIRST close </main> with </div>
    // (because the inner main opens second but closes first)
    
    // Work backwards to not mess up indices
    // First close is the inner main's close
    // Second open is the inner main's open
    
    let result = c;
    // Replace second <main (the inner one) 
    let secondOpenIdx = opens[1];
    result = result.substring(0, secondOpenIdx) + '<div' + result.substring(secondOpenIdx + 5);
    
    // Now find closes again (indices may have shifted by 1 char)
    closes = [];
    re = /<\/main>/g;
    while ((m = re.exec(result)) !== null) closes.push(m.index);
    
    // Replace first </main> (the inner one's close)
    if (closes.length >= 2) {
      let firstCloseIdx = closes[0];
      result = result.substring(0, firstCloseIdx) + '</div>' + result.substring(firstCloseIdx + 7);
    }
    
    fs.writeFileSync(path.join(d, f), result);
    console.log(`  ✓ Fixed ${f}`);
  } else {
    console.log(`  - Skipped ${f} (unexpected count)`);
  }
});
