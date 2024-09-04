const filters = [
  {
    type: 'Types',
    items: [
      {
        name: 'Starter',
        value: 'starter',
      },
      {
        name: 'Chatbot',
        value: 'chatbot',
      },
      {
        name: 'Engine',
        value: 'engine',
      },
    ],
  },
  {
    type: 'Frameworks',
    items: [
      { name: 'Next.js', value: 'nextjs' },
      { name: 'LlamaIndex', value: 'llamaindex' },
      { name: 'LangChain', value: 'langchain' },
      { name: 'Astro', value: 'astro' },
      { name: 'Express', value: 'express' },
      { name: 'Fastify', value: 'fastify' },
      { name: 'Hono', value: 'hono' },
      { name: 'Nest.js', value: 'nestjs' },
      { name: 'Node.js', value: 'nodejs' },
      { name: 'Python', value: 'python' },
      { name: 'Remix', value: 'remix' },
      { name: 'Solid Start', value: 'solidstart' },
      { name: 'SvelteKit', value: 'sveltekit' },
      { name: 'Waku', value: 'waku' },
      { name: 'Angular', value: 'angular' },
      { name: 'Wasp', value: 'wasp' },
      { name: 'Analog', value: 'Analog' },
    ],
  },
  {
    type: 'CSS',
    items: [{ name: 'TailwindCSS', value: 'tailwindcss' }],
  },
];

const FilterBar = () => (
  <form>
    <input
      className="h-9 rounded border bg-transparent bg-[left_0.625rem_center] bg-no-repeat p-2.5 pl-[34px] text-sm leading-none tracking-extra-tight dark:border-gray-new-20 dark:bg-[url('/images/templates/search-dark-mode.svg')]"
      type="search"
      placeholder="Search"
    />
    <ul className="mt-8 flex flex-col divide-y divide-gray-new-15/80">
      {filters.map(({ type, items }) => (
        <li className="flex flex-col pb-6 pt-6 first:pt-0 last:pb-0">
          <fieldset>
            <legend className="block font-semibold leading-tight tracking-extra-tight">
              {type}
            </legend>
            <div className="mt mt-4 flex flex-col gap-y-3">
              {items.map(({ name, value }) => (
                <label className="flex items-center gap-2.5 dark:text-gray-new-90">
                  <input
                    className="h-4 w-4 appearance-none rounded-sm border bg-center bg-no-repeat transition-colors duration-100 checked:bg-[url('/images/templates/check-dark-mode.svg')] dark:border-gray-new-30 dark:checked:border-white dark:checked:bg-white"
                    type="checkbox"
                    name={value}
                  />
                  {name}
                </label>
              ))}
            </div>
          </fieldset>
        </li>
      ))}
    </ul>
  </form>
);

export default FilterBar;
