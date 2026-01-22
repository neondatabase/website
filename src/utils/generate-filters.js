export function generateFilters(templates) {
  const typeSet = new Set();
  const frameworkSet = new Set();
  const cssSet = new Set();

  templates.forEach((template) => {
    template.type.forEach((t) => typeSet.add(t));
    template.framework.forEach((f) => frameworkSet.add(f));
    template.css.forEach((c) => cssSet.add(c));
  });

  return [
    {
      type: 'Type',
      items: Array.from(typeSet)
        .sort()
        .map((type) => ({ name: type, value: type.toLowerCase() })),
    },
    {
      type: 'Framework',
      items: Array.from(frameworkSet)
        .sort()
        .map((framework) => ({ name: framework, value: framework.toLowerCase() })),
    },
    {
      type: 'CSS',
      items: Array.from(cssSet)
        .sort()
        .map((css) => ({ name: css, value: css.toLowerCase() })),
    },
  ];
}
