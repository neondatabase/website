const fs = require('fs');
const path = require('path');

const { glob } = require('glob');
// Specify the directory where the markdown files are located
const docsDir = 'content/postgresql'; // Change this to your specific directory

// This function reads the directory and returns a list of file names
function getMarkdownFiles(directory) {
  return glob.sync(`${directory}/**/*.md`, {
    ignore: ['**/RELEASE_NOTES_TEMPLATE.md', '**/README.md', '**/unused/**'],
  });
}

// This function reads the content of a file and extracts the slugs
function extractSlugsAndTitle(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Regular expression to extract the link to the previous and next page
  const prevRegex = /\[Prev\]\((.*?)\s*".*?"\)/;
  const nextRegex = /\[Next\]\((.*?)\s*".*?"\)/;

  const prevMatch = content.match(prevRegex);
  const nextMatch = content.match(nextRegex);

  // Extract the actual slugs from the regex match
  const prevSlug = prevMatch ? prevMatch[1].replace('.html', '') : null;
  const nextSlug = nextMatch ? nextMatch[1].replace('.html', '') : null;

  const titleRegex = /\|\s*(.*?)\s*\|/g; // Global search for all table row beginnings

  let title = 'No title found'; // Default text if no title is found
  let match;

  // Check all instances of the regex match and find the title
  while ((match = titleRegex.exec(content)) !== null) {
    // The first capturing group (.*?) is non-greedy and captures the content of the first cell
    if (match[1] && match[1].trim() !== '') {
      title = match[1].trim();
      break; // Exit the loop once the first non-empty title is found
    }
  }

  return { prevSlug, nextSlug, title };
}

// Main function to process all markdown files and construct the sidebar array
function createSidebar() {
  const sidebar = [];

  // Get all markdown files
  const files = getMarkdownFiles(docsDir);

  files.forEach((file) => {
    // Extract slugs from the file content
    const { prevSlug, nextSlug, title } = extractSlugsAndTitle(file);

    // Determine the current slug from the file name
    const currentSlug = path.basename(file, '.md');

    console.log(`Current slug: ${currentSlug} - ${title}`);

    // Add the data to the sidebar array
    sidebar.push({
      currentSlug,
      title,
      prevSlug,
      nextSlug,
    });
  });

  return sidebar;
}

// Execute the function to create the sidebar
const sidebar = createSidebar();
function reconstructList(entries) {
  // First, we will create a map for quick lookup
  const slugMap = new Map();

  // Filling the map
  entries.forEach((entry) => {
    slugMap.set(entry.currentSlug, {
      prevSlug: entry.prevSlug,
      nextSlug: entry.nextSlug,
      title: entry.title,
    });
  });

  // Finding all entries without a previous link, these are starting points
  const startingPoints = entries.filter((entry) => entry.prevSlug === null);

  // Here, we reconstruct the lists. There might be multiple lists if there are disjoint sets of documents.
  const reconstructedLists = startingPoints.map((start) => {
    const list = [];
    let currentPoint = start;

    while (currentPoint) {
      list.push(currentPoint);

      // Moving to the next point using the map for quick lookup
      const nextPointSlug = currentPoint.nextSlug;
      const nextPoint = nextPointSlug
        ? {
            currentSlug: nextPointSlug,
            ...slugMap.get(nextPointSlug), // this gets prevSlug and nextSlug from the map
          }
        : null;

      currentPoint = nextPoint;
    }

    return list;
  });

  // If there are multiple starting points, you'll have multiple lists
  // Here, for simplicity, we just concatenate them all
  return [].concat(...reconstructedLists);
}

// Usage
const orderedArray = reconstructList(sidebar);

async function saveSidebarToFile(sidebar) {
  // Convert the JavaScript object to a JSON string
  const jsonContent = JSON.stringify(sidebar, null, 2);

  // Define the directory path and file path
  const dirPath = 'content/postgresql/sidebar'; // Change this to your specific directory
  const filePath = path.join(dirPath, 'sidebar.json');

  // Check if the directory exists, if not create it
  fs.mkdirSync(dirPath, { recursive: true });

  // Use fs.writeFile to save the file
  fs.writeFile(filePath, jsonContent, 'utf8', (error) => {
    if (error) {
      console.error('An error occurred while writing JSON to file:', error);
      return;
    }
    console.log('Sidebar JSON file has been saved.');
  });
}

// Execute the function to create the sidebar and save it to a file
async function executeScript() {
  try {
    await saveSidebarToFile(orderedArray);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

executeScript();
