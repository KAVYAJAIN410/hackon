const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  let content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
  
  if (content.includes('<a ') && !content.includes('import { Link }')) {
    content = content.replace("import React from 'react';", "import React from 'react';\nimport { Link } from 'react-router-dom';");
  }

  // Replace <a href="#"> with <Link to="#"> 
  content = content.replace(/<a([^>]+)href="([^"]*)"/g, '<Link$1to="$2"');
  content = content.replace(/<\/a>/g, '</Link>');
  
  // Specific rewrites for flow
  if (file === 'ProductDetail.jsx') {
    // "Return / Trade-In" button
    content = content.replace(/<button([^>]+)>([^<]*)Return \/ Trade-In([^<]*)<\/button>/, '<Link to="/return-flow"><button$1>$2Return / Trade-In$3</button></Link>');
  }
  if (file === 'ReturnFlow.jsx') {
     if (!content.includes('import { Link }')) {
        content = content.replace("import React from 'react';", "import React from 'react';\nimport { Link } from 'react-router-dom';");
     }
     content = content.replace(/<button([^>]+bg-amazon-dark[^>]+)>([\s\S]*?)Continue([\s\S]*?)<\/button>/, '<Link to="/return-interception"><button$1>$2Continue$3</button></Link>');
  }
  if (file === 'ReturnInterception.jsx') {
     if (!content.includes('import { Link }')) {
        content = content.replace("import React from 'react';", "import React from 'react';\nimport { Link } from 'react-router-dom';");
     }
     content = content.replace(/<button([^>]+bg-\[\#007185\][^>]+)>([\s\S]*?)Accept Repair([\s\S]*?)<\/button>/, '<Link to="/my-returns"><button$1>$2Accept Repair$3</button></Link>');
     content = content.replace(/<button([^>]+bg-white[^>]+)>([\s\S]*?)Continue Return([\s\S]*?)<\/button>/, '<Link to="/my-returns"><button$1>$2Continue Return$3</button></Link>');
  }
  if (file === 'OutgrownIt.jsx') {
     if (!content.includes('import { Link }')) {
        content = content.replace("import React from 'react';", "import React from 'react';\nimport { Link } from 'react-router-dom';");
     }
     content = content.replace(/<button([^>]+)>([\s\S]*?)Trade In \/ Recycle([\s\S]*?)<\/button>/g, '<Link to="/return-flow"><button$1>$2Trade In / Recycle$3</button></Link>');
  }
  if (file === 'GreenProfile.jsx') {
     if (!content.includes('import { Link }')) {
        content = content.replace("import React from 'react';", "import React from 'react';\nimport { Link } from 'react-router-dom';");
     }
     content = content.replace(/<button([^>]+)>([\s\S]*?)View Carbon Offset History([\s\S]*?)<\/button>/, '<Link to="/my-returns"><button$1>$2View Carbon Offset History$3</button></Link>');
  }
  
  fs.writeFileSync(path.join(pagesDir, file), content);
});

// Also fix ProductCard and Landing
let pc = fs.readFileSync(path.join(__dirname, 'src', 'components', 'marketplace', 'ProductCard.jsx'), 'utf8');
if (!pc.includes('import { Link }')) {
  pc = pc.replace("import React from 'react';", "import React from 'react';\nimport { Link } from 'react-router-dom';");
}
pc = pc.replace('<h3', '<Link to="/product-detail"><h3');
pc = pc.replace('</h3>', '</h3></Link>');
fs.writeFileSync(path.join(__dirname, 'src', 'components', 'marketplace', 'ProductCard.jsx'), pc);

let hero = fs.readFileSync(path.join(__dirname, 'src', 'components', 'landing', 'HeroSection.jsx'), 'utf8');
if (!hero.includes('import { Link }')) {
  hero = hero.replace("import React from 'react';", "import React from 'react';\nimport { Link } from 'react-router-dom';");
}
hero = hero.replace(/<button([^>]+bg-\[\#FF9900\][^>]+)>([\s\S]*?)Explore Marketplace([\s\S]*?)<\/button>/, '<Link to="/marketplace"><button$1>$2Explore Marketplace$3</button></Link>');
hero = hero.replace(/<button([^>]+bg-white[^>]+)>([\s\S]*?)Start a Return([\s\S]*?)<\/button>/, '<Link to="/outgrown-it"><button$1>$2Start a Return$3</button></Link>');
fs.writeFileSync(path.join(__dirname, 'src', 'components', 'landing', 'HeroSection.jsx'), hero);
