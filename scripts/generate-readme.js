const fs = require('fs');
const path = require('path');

// Read the resource data from the JSON file
const resourcesPath = path.join(__dirname, '../data/resources.json');
const resources = JSON.parse(fs.readFileSync(resourcesPath, 'utf8')).resources;

// Generate the markdown content for the README
let readmeContent = '# Resource Collection\n\n';
readmeContent += 'A beautifully stylized collection of resources.\n\n';
readmeContent += '## Resources\n\n';

resources.forEach(resource => {
  readmeContent += `### [${resource.title}](${resource.url})\n`;
  readmeContent += `${resource.description}\n\n`;
});

// Write the generated content to README.md
const readmePath = path.join(__dirname, '../README.md');
fs.writeFileSync(readmePath, readmeContent);

console.log('README.md has been generated successfully.');
