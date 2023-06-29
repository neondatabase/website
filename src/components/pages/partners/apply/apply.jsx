import Container from 'components/shared/container';
import Link from 'components/shared/link/link';
import LINKS from 'constants/links';

import Form from './form';

const Apply = () => (
  <section className="apply-form safe-paddings mb-10 mt-[200px] xl:mb-[120px] xl:mt-36">
    <Container className="grid-gap-x grid grid-cols-12" size="lg">
      <div className="grid-gap-x col-span-10 col-start-2 grid grid-cols-10 xl:col-span-full xl:col-start-1 xl:grid-cols-12">
        <div className="col-span-5">
          <span className="inline-block rounded-[40px] bg-green-45/10 px-3.5 py-2 text-xs font-semibold uppercase leading-none text-green-45">
            Apply now
          </span>
          <h2 className="mt-2 text-[56px] font-medium leading-none tracking-tighter xl:text-[44px]">
            Become a Partner
          </h2>
          <p className="mt-4 text-lg font-light leading-snug xl:text-base">
            Not sure about the right partnership option?
            <br />
            <Link theme="green" to={LINKS.contactSales}>
              Contact us
            </Link>{' '}
            if you have questions.
          </p>

          <figure className="mt-40 max-w-[464px] xl:mt-[120px]">
            <blockquote>
              <p className="border-l border-gray-new-60 pl-3.5 text-2xl font-light tracking-tighter xl:text-xl">
                “The combination of flexible resource limits and nearly instant database
                provisioning made Neon a no-brainer.”
              </p>
            </blockquote>
            <figcaption className="mt-6 flex flex-col text-lg leading-tight tracking-[-0.02em] xl:text-base">
              Lincoln Bergeson{' '}
              <cite className="mt-1.5 not-italic text-gray-new-60">
                Infrastructure Engineer at Replit
              </cite>
            </figcaption>
          </figure>
        </div>
        <Form className="col-span-5 xl:col-span-7" />
      </div>
    </Container>
  </section>
);

export default Apply;
