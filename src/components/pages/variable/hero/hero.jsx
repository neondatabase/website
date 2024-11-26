import Testimonial from 'components/pages/use-case/testimonial';
import Admonition from 'components/shared/admonition';
import LINKS from 'constants/links';

const Hero = () => (
  <section className="hero safe-paddings relative overflow-hidden">
    <h1 className="text-[56px] font-semibold leading-dense tracking-tighter xl:text-5xl lg:text-4xl md:text-[28px] md:leading-tight">
      Scale With Traffic
    </h1>
    <p className="mt-4 text-2xl leading-snug tracking-extra-tight text-gray-new-80 xl:text-xl md:mt-3 md:text-lg">
      Neon scales up and down automatically, matching your workload. Get performance when you need
      it.
    </p>
    <div className="prose-doc">
      <Admonition type="note" title="TL;DR">
        <p>
          Many applications have variable traffic, i.e. compute requirements fluctuate. This is a
          common source of "bill bloating" in managed databases; if this is you, you're probably
          provisioning a larger machine to accommodate these traffic spikes. Neon saves you the
          trouble:
        </p>
        <ul>
          <li>Databases autoscale up and down automatically according to load.</li>
          <li>You pay only for the compute you use, without downtime or manual work.</li>
          <li>
            You only pay for active databases: your dev/test instances automatically pause when
            idle.
          </li>
        </ul>
        <p>
          Neon is serverless Postgres. We have a generous Free Plan -{' '}
          <a href={LINKS.signup}>Get started here</a>
        </p>
      </Admonition>
    </div>
    <Testimonial
      text="Our database traffic peaks at nights and on weekends. Building on a database that preemptively autoscales allows us to regularly handle these traffic spikes"
      author={{
        name: 'Lex Nasser',
        company: 'Founding Engineer at 222',
      }}
      url="/blog/how-222-uses-neon-to-handle-their-frequent-spikes-in-demand"
    />
  </section>
);

export default Hero;
