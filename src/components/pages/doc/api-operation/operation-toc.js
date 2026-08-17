export function buildOperationToc(operation, renderFacts = {}) {
  let index = 0;
  const nextIndex = () => index++;
  const items = [{ title: 'Quick start', id: 'quick-start', level: 1, index: nextIndex() }];
  const hasRequestBody = renderFacts.hasRequestBody ?? !!operation.requestBody;

  if (operation.parameters?.length) {
    items.push({ title: 'Parameters', id: 'parameters', level: 1, index: nextIndex() });
  }

  if (hasRequestBody) {
    const requestBodyItem = {
      title: 'Request body',
      id: 'request-body',
      level: 1,
      index: nextIndex(),
    };
    if (operation.requestBody.sections?.length) {
      requestBodyItem.items = operation.requestBody.sections.map((section) => ({
        title: section.label,
        id: `body-${section.id}`,
        level: 2,
        index: nextIndex(),
      }));
    }
    items.push(requestBodyItem);
  }

  if (operation.response) {
    items.push({ title: 'Response', id: 'response', level: 1, index: nextIndex() });
  }

  if (operation.errors?.length) {
    items.push({ title: 'Errors', id: 'errors', level: 1, index: nextIndex() });
  }

  return items;
}
