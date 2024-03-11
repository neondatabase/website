import Image from 'next/image';

import Container from 'components/shared/container';
import clouflareIcon from 'icons/home/logos/cloudflare.svg';
import hasuraIcon from 'icons/home/logos/hasura.svg';
import koyebIcon from 'icons/home/logos/koyeb.svg';
import replitIcon from 'icons/home/logos/replit.svg';
import vercelIcon from 'icons/home/logos/vercel.svg';
import wundergraphIcon from 'icons/home/logos/wundergraph.svg';

const logos = [
  {
    logo: vercelIcon,
    alt: 'Vercel',
    width: 100,
  },
  {
    logo: koyebIcon,
    alt: 'Koyeb',
    width: 107,
  },
  {
    logo: wundergraphIcon,
    alt: 'WunderGraph',
    width: 133,
  },
  {
    logo: hasuraIcon,
    alt: 'Hasura',
    width: 97,
  },
  {
    logo: replitIcon,
    alt: 'Replit',
    width: 104,
  },
  {
    logo: clouflareIcon,
    alt: 'Cloudflare',
    width: 161,
  },
];

const Logos = () => (
  <section className="safe-paddings mt-[172px] bg-black">
    <Container className="z-20 flex items-center justify-between" size="1100">
      <h2 className="max-w-[370px] text-[36px] font-medium leading-dense tracking-extra-tight text-white">
        We separated storage and&nbsp;compute.
      </h2>
      <ul className="mr-[108px] grid grid-cols-[0.61fr_.664fr_1fr] justify-center gap-x-14 gap-y-12">
        {logos.map(({ logo, width, alt }) => (
          <li key={alt}>
            <Image className="h-7 w-auto" src={logo} height={28} width={width} alt={alt} />
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default Logos;
