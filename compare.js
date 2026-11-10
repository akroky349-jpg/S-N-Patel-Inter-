const fs = require('fs');

const files = ['facilities.html', 'index.html', 'about.html', 'academics.html'];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const headerMatch = content.match(/<header[\s\S]*?<\/header>/);
  console.log(`\n=================== ${f} ===================`);
  if (headerMatch) {
    console.log(headerMatch[0]);
  }
});
