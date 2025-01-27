import LINKS from 'constants/links';
import DiscordIcon from 'icons/discord-sm.inline.svg';
import LinkedInIcon from 'icons/linkedin-sm.inline.svg';
import XIcon from 'icons/x.inline.svg';
import YouTubeIcon from 'icons/youtube-sm.inline.svg';

const socialLinks = [
  {
    name: 'X',
    url: LINKS.twitter,
    icon: XIcon,
  },
  {
    name: 'LinkedIn',
    url: LINKS.linkedin,
    icon: LinkedInIcon,
  },
  {
    name: 'YouTube',
    url: LINKS.youtube,
    icon: YouTubeIcon,
  },
  {
    name: 'Discord',
    url: LINKS.discord,
    icon: DiscordIcon,
  },
];

const Socials = () => (
  <>
    <span className="text-[15px] font-medium -tracking-extra-tight text-gray-new-70">
      Follow us
    </span>
    <ul className="mt-3 flex flex-wrap gap-4">
      {socialLinks.map(({ name, url, icon: Icon }, index) => (
        <li className="flex items-center" key={index}>
          <a
            className="group flex items-center justify-center rounded-full"
            aria-label={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon className="h-4 w-auto text-gray-new-70 transition-colors duration-200 group-hover:text-green-45" />
          </a>
        </li>
      ))}
    </ul>
  </>
);

export default Socials;
