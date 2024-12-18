import Testimonial from 'components/pages/use-case/testimonial';
import Admonition from 'components/shared/admonition';
import LINKS from 'constants/links';

const Hero = () => (
  <section className="hero safe-paddings relative overflow-hidden">
    <h1 className="text-[56px] font-semibold leading-dense tracking-tighter xl:text-5xl lg:text-4xl md:text-[28px] md:leading-tight">
      Scale With Traffic
    </h1>
    <p className="mt-4 text-2xl leading-snug tracking-extra-tight text-gray-new-80 xl:text-xl md:mt-3 md:text-lg">
        Neon scales CPU and memory automatically to match your app
    </p>
    <div className="prose-doc">
      <Admonition type="note" title="TL;DR">
        <p>
         If your app has variable traffic, here's how Neon can save you time and money: 
        </p>
        <ul>
          <li>Databases autoscale. CPU and memory scale up and down automatically. When you see traffic spikes, your database provisions more compute automatically; when traffic dies, it scales down.</li>
          <li>You pay only for the compute you use. No downtime, no manual work.</li>
        </ul>
        <p>
          We have a Free Plan -{' '}
          <a href={LINKS.signup}>Get started here</a>
        </p>
      </Admonition>
    </div>
    <Testimonial
      text="Our database traffic peaks at nights and on weekends. Building on a database that preemptively autoscales allows us to regularly handle these traffic spikes."
      author={{
        name: 'Lex Nasser',
        company: 'Founding Engineer at 222',
      }}
      url="/blog/how-222-uses-neon-to-handle-their-frequent-spikes-in-demand"
    />
  </section>
);

export default Hero;
