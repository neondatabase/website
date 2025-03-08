#!/usr/bin/env node

/**
 * This script selects a random CTA and updates the introduction.md file
 * It can be run as part of the build process to randomly rotate CTAs
 */

const fs = require('fs');
const path = require('path');

// Define the CTAs that will be randomly rotated
const CTAS = [
  {
    title: 'Manage Neon from Cursor ✨',
    description:
      "Manage your Neon Postgres databases directly from Cursor and other AI tools with simple, conversational commands using the Neon MCP Server. No SQL or API calls needed—just ask. <a href='/docs/ai/connect-mcp-clients-to-neon'>Learn how</a>.",
  },
  {
    title: 'Did you know?',
    description:
      "Neon's database branching can help you integrate Postgres into your development workflow. Branch your data like code. <a href='/docs/get-started-with-neon/workflow-primer'>Read our primer</a> to learn&nbsp;how.",
  },
];

// Select a random CTA
const randomIndex = Math.floor(Math.random() * CTAS.length);
const selectedCta = CTAS[randomIndex];

// Path to the introduction.md file
const introFilePath = path.join(__dirname, '../content/docs/introduction.md');

try {
  // Read the current content of the file
  let content = fs.readFileSync(introFilePath, 'utf8');

  // Find the CTA section in the markdown file
  const ctaRegex = /<CTA.*?><\/CTA>/s;

  if (!ctaRegex.test(content)) {
    console.error('Could not find CTA component in introduction.md');
    process.exit(1);
  }

  // Create the new CTA component string with proper escaping for quotes
  const newCtaString = `<CTA title="${selectedCta.title.replace(/"/g, '\\"')}" description="${selectedCta.description.replace(/"/g, '\\"')}" isIntro></CTA>`;

  // Replace the existing CTA with the new one
  content = content.replace(ctaRegex, newCtaString);

  // Write the updated content back to the file
  fs.writeFileSync(introFilePath, content, 'utf8');

  console.log(`Updated introduction.md with randomly selected CTA: "${selectedCta.title}"`);
} catch (error) {
  console.error('Error updating introduction.md:', error);
  process.exit(1);
}
