import Image from 'next/image';
import PropTypes from 'prop-types';

import Button from 'components/shared/button';

import discordLogo from './images/discord.png';
import discourseLogo from './images/discourse.png';
import ellipse from './images/ellipse.svg';

const logos = {
  discourse: discourseLogo,
  discord: discordLogo,
};

const CommunityBanner = ({ buttonText, buttonUrl, children = null, logo }) => (
  <section className="not-prose relative my-10">
    <span className="absolute -inset-px block rounded-[10px] bg-[linear-gradient(90deg,rgba(48,50,54,1)50%,rgba(0,229,153,0.4)100%)]" />
    <span className="absolute -top-px right-1.5 h-px w-[28%] bg-[radial-gradient(circle,rgba(0,229,153,0.7)0%,rgba(0,229,153,0.05)100%)] sm:hidden" />
    <div className="relative flex items-center overflow-hidden rounded-[10px] bg-[#0A0A0A] p-8 sm:p-6">
      <div>
        <h2 className="!my-0 max-w-[334px] text-[26px] font-semibold leading-dense tracking-extra-tight text-white xs:text-2xl">
          {children}
        </h2>
        <Button
          className="mt-5 !px-5 !py-2.5 !font-semibold !text-black-new hover:bg-[#00e5bf]"
          to={buttonUrl}
          size="xs"
          theme="primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          {buttonText}
        </Button>
      </div>
      <img
        className="absolute right-0 top-0 !my-0 h-full md:hidden"
        src={ellipse}
        alt=""
        width={324}
        height={180}
        loading="lazy"
      />
      <Image
        className="absolute right-0 top-0 !my-0 h-full w-auto [@media(max-width:500px)]:hidden"
        src={logos[logo]}
        alt=""
        width={280}
        height={180}
        quality={90}
      />
    </div>
  </section>
);

CommunityBanner.propTypes = {
  children: PropTypes.node,
  buttonText: PropTypes.string.isRequired,
  buttonUrl: PropTypes.string.isRequired,
  logo: PropTypes.oneOf(Object.keys(logos)).isRequired,
};

export default CommunityBanner;
