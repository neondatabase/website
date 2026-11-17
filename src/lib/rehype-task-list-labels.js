import { visit } from 'unist-util-visit';

// Markdown task lists render disabled checkboxes. Associate each checkbox with
// its own item's text, keeping nested items' labels separate.
const getItemText = (node) => {
  if (node.type === 'text') return node.value;
  if (['ul', 'ol', 'input'].includes(node.tagName)) return '';
  if (node.tagName === 'img') return node.properties?.alt || '';
  return (node.children || []).map(getItemText).join('');
};

const labelItemInputs = (node, label) => {
  if (['ul', 'ol'].includes(node.tagName)) return;
  if (node.tagName === 'input' && node.properties?.type === 'checkbox') {
    if (!node.properties.ariaLabel && !node.properties.ariaLabelledBy) {
      node.properties.ariaLabel = label;
    }
  }
  node.children?.forEach((child) => labelItemInputs(child, label));
};

export default function rehypeTaskListLabels() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'li' || !node.properties?.className?.includes('task-list-item')) return;
      const label = getItemText(node).replace(/\s+/g, ' ').trim();
      if (label) labelItemInputs(node, label);
    });
  };
}
