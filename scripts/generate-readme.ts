import * as fs from 'fs';
import * as path from 'path';
import { Resource } from '../types';

interface ResourceData {
  resources: Resource[];
}

const generateReadme = (): void => {
  try {
    // Read the resource data from the JSON file
    const resourcesPath = path.join(__dirname, '../data/resources.json');
    const resources = JSON.parse(fs.readFileSync(resourcesPath, 'utf8')) as ResourceData;

    // Generate the markdown content for the README
    const readmeContent = [
      '# Resource Collection',
      '',
      'A beautifully stylized collection of resources.',
      '',
      '## Resources',
      '',
      ...resources.resources.map(resource => [
        `### [${resource.title}](${resource.url})`,
        resource.description,
        ''
      ]).flat()
    ].join('\n');

    // Write the generated content to README.md
    const readmePath = path.join(__dirname, '../README.md');
    fs.writeFileSync(readmePath, readmeContent);

    console.log('README.md has been generated successfully.');
  } catch (error) {
    console.error('Error generating README:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
};

// Execute the function
generateReadme();