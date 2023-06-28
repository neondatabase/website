import React from 'react';

import airplaneLogo from './images/airplane.svg';
import bunnyshellLogo from './images/bunnyshell.svg';
import cloudflareLogo from './images/cloudflare.svg';
import fabricIoLogo from './images/fabric.svg';
import hasuraLogo from './images/hasura.svg';
import illaLogo from './images/illa.svg';
import octolisLogo from './images/octolis.svg';
import replitLogo from './images/replit.svg';
import snapletLogo from './images/snaplet.svg';
import vercelLogo from './images/vercel.svg';
import wundergraphLogo from './images/wundergraph.svg';

const logos = [
  {
    src: bunnyshellLogo,
    alt: 'Bunnyshell',
  },
  {
    src: vercelLogo,
    alt: 'Vercel',
  },
  {
    src: replitLogo,
    alt: 'Replit',
  },
  {
    src: hasuraLogo,
    alt: 'Hasura',
  },
  {
    src: illaLogo,
    alt: 'Illa',
  },
  {
    src: octolisLogo,
    alt: 'Octolis',
  },
  {
    src: cloudflareLogo,
    alt: 'Cloudflare',
  },
  {
    src: airplaneLogo,
    alt: 'Airplane',
  },
  {
    src: wundergraphLogo,
    alt: 'Wundergraph',
  },
  {
    src: fabricIoLogo,
    alt: 'TheFabric.IO consulting',
  },
  {
    src: snapletLogo,
    alt: 'Snaplet',
  },
];

const Logos = () => (
  <div className="logos relative flex overflow-x-hidden">
    <ul className="animate-logos whitespace-nowrap">
      {logos.map(({ src, alt }, index) => (
        <li key={`logo_${index}`} className="inline-block">
          <img className="mx-11 h-12 max-w-none" src={src} alt={alt} />
        </li>
      ))}
    </ul>
    <ul className="absolute top-0 animate-logos-hidden whitespace-nowrap">
      {logos.map(({ src, alt }, index) => (
        <li key={index} className="inline-block">
          <img className="mx-11 h-12 max-w-none" src={src} alt={alt} />
        </li>
      ))}
    </ul>
  </div>
);
export default Logos;
