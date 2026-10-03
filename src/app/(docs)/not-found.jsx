import Hero from 'components/pages/error/hero';
import SEO_DATA from 'constants/seo-data';

const DocsNotFoundPage = () => (
  <div className="min-w-0 flex-1">
    <title>{SEO_DATA[404].title}</title>

    <Hero
      title="Page not found..."
      text="Sorry, the page you are looking for doesn't exist or has been moved."
    />
  </div>
);

export default DocsNotFoundPage;
