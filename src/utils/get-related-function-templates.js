import {
  MANUAL_TEMPLATE_RECOMMENDATIONS,
  TEMPLATE_CATEGORY_RECOMMENDATIONS,
} from 'config/function-template-recommendations';

import { REGISTRY_FIRST_PARTY_CATEGORY, registryTemplateCategories } from './function-registry';

const topicCategories = (template) =>
  registryTemplateCategories(template).filter(
    (category) => category !== REGISTRY_FIRST_PARTY_CATEGORY
  );

const getCategoryPriorities = (template, categoryOrder) => {
  const priorities = new Map();
  topicCategories(template).forEach((category) => {
    const neighbours = Object.hasOwn(categoryOrder, category) ? categoryOrder[category] : [];
    [...neighbours, category].forEach((target, rank) => {
      if (target !== REGISTRY_FIRST_PARTY_CATEGORY) {
        priorities.set(target, Math.min(priorities.get(target) ?? Infinity, rank));
      }
    });
  });
  return priorities;
};

const getRelatedFunctionTemplates = (
  template,
  templates,
  {
    limit = 8,
    manual = MANUAL_TEMPLATE_RECOMMENDATIONS,
    categoryOrder = TEMPLATE_CATEGORY_RECOMMENDATIONS,
  } = {}
) => {
  if (limit <= 0) return [];

  const available = new Map(
    templates.filter((item) => item.id !== template.id).map((item) => [item.id, item])
  );

  // Presence, rather than list length, selects manual mode. Never auto-fill it.
  if (Object.hasOwn(manual, template.id)) {
    return [...new Set(manual[template.id])]
      .map((id) => available.get(id))
      .filter(Boolean)
      .slice(0, limit);
  }

  const priorities = getCategoryPriorities(template, categoryOrder);
  return [...available.values()]
    .map((item) => ({
      template: item,
      rank: Math.min(
        ...topicCategories(item).map((category) => priorities.get(category) ?? Infinity)
      ),
    }))
    .filter(({ rank }) => Number.isFinite(rank))
    .sort((a, b) => a.rank - b.rank || a.template.id.localeCompare(b.template.id, 'en'))
    .slice(0, limit)
    .map((item) => item.template);
};

export default getRelatedFunctionTemplates;
