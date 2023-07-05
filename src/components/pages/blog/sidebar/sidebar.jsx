import BlogNavLink from 'components/pages/blog/blog-nav-link';
import Search from 'components/shared/search';
import LINKS from 'constants/links';
import GitHubIcon from 'icons/github-sm.inline.svg';
import LinkedInIcon from 'icons/linkedin-sm.inline.svg';
import TwitterIcon from 'icons/twitter-sm.inline.svg';
import YouTubeIcon from 'icons/youtube-sm.inline.svg';

const categories = [
  {
    name: 'All posts',
    slug: 'all',
  },
  {
    name: 'Engineering',
    slug: 'engineering',
  },
  {
    name: 'Company',
    slug: 'company',
  },
  {
    name: 'Community',
    slug: 'community',
  },
];

const socialLinks = [
  {
    name: 'Twitter',
    url: LINKS.twitter,
    icon: TwitterIcon,
  },
  {
    name: 'LinkedIn',
    url: LINKS.linkedin,
    icon: LinkedInIcon,
  },
  {
    name: 'GitHub',
    url: LINKS.github,
    icon: GitHubIcon,
  },
  {
    name: 'YouTube',
    url: LINKS.youtube,
    icon: YouTubeIcon,
  },
];

const Sidebar = () => (
  <aside className="col-span-2 pb-10 lt:col-span-full lt:pb-0">
    <div className="relative flex h-full flex-col gap-y-10 lt:h-auto lt:min-h-fit">
      <div className="relative flex-1">
        <nav className="no-scrollbars sticky top-10 md:-mx-4 md:max-w-5xl md:overflow-auto md:px-4">
          <Search
            className="z-30 max-w-[170px]"
            indexName={process.env.NEXT_PUBLIC_ALGOLIA_BLOG_INDEX_NAME}
            isBlog
          />
          <ul className="mt-8 flex flex-col lt:flex-row lt:gap-x-7 lt:pt-8 md:after:shrink-0 md:after:grow-0 md:after:basis-px md:after:content-['']">
            {categories.map(({ name, slug }, index) => (
              <li className="flex py-1.5 first:pt-0 last:pb-0 lt:py-0" key={index}>
                <BlogNavLink name={name} slug={slug} />
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="sticky bottom-10 lt:hidden">
        <span className="text-xs font-semibold uppercase leading-none tracking-[0.02em] text-gray-new-70">
          Follow us
        </span>
        <ul className="mt-4 flex flex-wrap gap-4">
          {socialLinks.map(({ name, url, icon: Icon }, index) => (
            <li className="flex items-center" key={index}>
              <a
                className="group flex items-center justify-center rounded-full"
                aria-label={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon className="h-4 w-4 text-gray-new-70 transition-colors duration-200 group-hover:text-green-45" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </aside>
);

export default Sidebar;
