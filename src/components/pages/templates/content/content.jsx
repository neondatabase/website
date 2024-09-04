'use client';

import { useState } from 'react';

import FilterBar from 'components/pages/templates/filter-bar';
import TemplatesList from 'components/pages/templates/templates-list';

const templates = [
  {
    title: 'Hybrid Search',
    description: 'A full-featured, hackable Next.js Hybrid Search built with OpenAI.',
    url: '/',
    types: ['starter'],
    frameworks: ['nextjs'],
    css: ['tailwindcss'],
  },
  {
    title: 'Chat with PDF (OpenAI + LlamaIndex)',
    description:
      'A full-featured, hackable Next.js Chat with PDF chatbot built with OpenAI and LlamaIndex.',
    url: '/',
    types: ['chatbot'],
    frameworks: ['nextjs', 'llamaindex'],
    css: ['tailwindcss'],
  },
  {
    title: 'AI Chatbot (OpenAI + LlamaIndex)',
    description: 'A full-featured, hackable Next.js AI chatbot built with OpenAI and LlamaIndex.',
    url: '/',
    types: ['chatbot'],
    frameworks: ['nextjs', 'llamaindex'],
    css: ['tailwindcss'],
  },
  {
    title: 'RAG Chatbot (OpenAI + LlamaIndex)',
    description: 'A full-featured, hackable Next.js RAG chatbot built with OpenAI and LlamaIndex.',
    url: '/',
    types: ['chatbot'],
    frameworks: ['nextjs', 'llamaindex'],
    css: ['tailwindcss'],
  },
  {
    title: 'Semantic Search Chatbot (OpenAI + LlamaIndex)',
    description:
      'A full-featured, hackable Next.js Semantic Search chatbot built with OpenAI and LlamaIndex.',
    url: '/',
    types: ['chatbot'],
    frameworks: ['nextjs', 'llamaindex'],
    css: ['tailwindcss'],
  },
  {
    title: 'Reverse Image Search (OpenAI + LlamaIndex)',
    description:
      'A full-featured, hackable Next.js Reverse Image Search Engine built with OpenAI and LlamaIndex.',
    url: '/',
    types: ['chatbot'],
    frameworks: ['nextjs', 'llamaindex'],
    css: ['tailwindcss'],
  },
  {
    title: 'Chat with PDF (OpenAI + LangChain)',
    description:
      'A full-featured, hackable Next.js Chat with PDF chatbot built with OpenAI and LangChain.',
    url: '/',
    types: ['chatbot'],
    frameworks: ['nextjs', 'langchain'],
    css: ['tailwindcss'],
  },
  {
    title: 'AI Chatbot (OpenAI + LangChain)',
    description: 'A full-featured, hackable Next.js AI chatbot built with OpenAI and LangChain.',
    url: '/',
    types: ['chatbot'],
    frameworks: ['nextjs', 'langchain'],
    css: ['tailwindcss'],
  },
];
const Content = () => {
  const [filteredTemplates, setFilteredTemplates] = useState({
    filters: {},
    items: templates,
  });
  return (
    <>
      <TemplatesList templates={filteredTemplates.items} />
      <aside className="col-span-1">
        <FilterBar
          templates={templates}
          filteredTemplates={filteredTemplates}
          setFilteredTemplates={setFilteredTemplates}
        />
      </aside>
    </>
  );
};

export default Content;
