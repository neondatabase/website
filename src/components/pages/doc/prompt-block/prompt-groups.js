// Split a prompt into display groups at blank lines. A chunk with no "- " bullets
// (like the prompt's opening sentence) joins the next group.
const toPromptGroups = (prompt) => {
  const groups = [];
  let leadIn = [];
  prompt.split(/\n\s*\n/).forEach((chunk) => {
    const lines = chunk
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    if (!lines.length) return;
    if (!lines.some((line) => line.startsWith('- '))) {
      leadIn.push(...lines);
      return;
    }
    groups.push([...leadIn, ...lines]);
    leadIn = [];
  });
  if (leadIn.length) groups.push(leadIn);
  return groups;
};

export default toPromptGroups;
