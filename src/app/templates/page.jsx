import FilterBar from 'components/pages/templates/filter-bar';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import Link from 'components/shared/link';

const items = [
  {
    title: 'Hybrid Search',
    description: 'A full-featured, hackable Next.js Hybrid Search built with OpenAI.',
    url: '/',
  },
  {
    title: 'Chat with PDF (OpenAI + LlamaIndex)',
    description:
      'A full-featured, hackable Next.js Chat with PDF chatbot built with OpenAI and LlamaIndex.',
    url: '/',
  },
  {
    title: 'AI Chatbot (OpenAI + LlamaIndex)',
    description: 'A full-featured, hackable Next.js AI chatbot built with OpenAI and LlamaIndex.',
    url: '/',
  },
  {
    title: 'RAG Chatbot (OpenAI + LlamaIndex)',
    description: 'A full-featured, hackable Next.js RAG chatbot built with OpenAI and LlamaIndex.',
    url: '/',
  },
  {
    title: 'Semantic Search Chatbot (OpenAI + LlamaIndex)',
    description:
      'A full-featured, hackable Next.js Semantic Search chatbot built with OpenAI and LlamaIndex.',
    url: '/',
  },
  {
    title: 'Reverse Image Search (OpenAI + LlamaIndex)',
    description:
      'A full-featured, hackable Next.js Reverse Image Search Engine built with OpenAI and LlamaIndex.',
    url: '/',
  },
  {
    title: 'Chat with PDF (OpenAI + LangChain)',
    description:
      'A full-featured, hackable Next.js Chat with PDF chatbot built with OpenAI and LangChain.',
    url: '/',
  },
  {
    title: 'AI Chatbot (OpenAI + LangChain)',
    description: 'A full-featured, hackable Next.js AI chatbot built with OpenAI and LangChain.',
    url: '/',
  },
];

const TemplatesPage = () => (
  <Layout headerWithBorder burgerWithoutBorder isHeaderSticky hasThemesSupport>
    <div className="safe-paddings flex flex-1 flex-col dark:bg-black-pure dark:text-white lg:block">
      <Container
        className="grid w-full flex-1 grid-cols-5 pb-20 pt-16 xl:gap-x-7 lg:block lg:gap-x-5 lg:pt-11 md:pt-10 sm:pt-8"
        size="960"
      >
        <div className="col-span-4 col-start-1 max-w-[703px]">
          <h1 className="font-title text-4xl font-medium leading-none tracking-extra-tight">
            Find your Template
          </h1>
          <p className="mt-2.5 max-w-[558px] text-lg font-light leading-snug tracking-extra-tight dark:text-gray-new-80">
            Jumpstart your app development process with pre-built solutions from Neon and our
            community.
          </p>
        </div>
        <div className="col-span-5 col-start-1 grid grid-cols-5">
          <ul className="col-span-4 mt-14 max-w-[703px] divide-y divide-gray-new-15/80">
            {items.map(({ title, description, url }) => (
              <li className="pb-6 pt-6 first:pt-0 last:pb-0" key={url}>
                <Link className="group flex items-center justify-between" to={url}>
                  <div>
                    <h2 className="text-lg font-semibold leading-tight tracking-extra-tight transition-colors duration-200 group-hover:text-primary-1">
                      {title}
                    </h2>
                    <p className="mt-1.5 max-w-[480px] leading-snug tracking-extra-tight dark:text-gray-new-50">
                      {description}
                    </p>
                  </div>
                  <button
                    className="shrink whitespace-nowrap rounded-full border px-3 py-2 text-[13px] font-medium leading-none tracking-extra-tight transition-colors duration-200 dark:border-gray-new-30 dark:text-gray-new-80 dark:group-hover:border-white dark:group-hover:bg-white dark:group-hover:text-black-new"
                    type="button"
                  >
                    Use Template
                  </button>
                </Link>
              </li>
            ))}
          </ul>

          <aside className="col-span-1">
            <FilterBar />
          </aside>
        </div>
      </Container>
    </div>
  </Layout>
);

export default TemplatesPage;
