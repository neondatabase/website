import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

import GithubIcon from './images/github.inline.svg';
import LinkedinIcon from './images/linkedin.inline.svg';
import TwitterIcon from './images/twitter.inline.svg';

const items = [
  {
    photo: <StaticImage src="./images/nikita-shamgunov-photo.jpg" alt="Nikita Shamgunov" />,
    name: 'Nikita Shamgunov',
    position: 'CEO',
    githubUrl: '/',
    linkedinUrl: '/',
    twitterUrl: '/',
  },
  {
    photo: <StaticImage src="./images/heikki-linnakangas-photo.jpg" alt="Heikki Linnakangas" />,
    name: 'Heikki Linnakangas',
    position: 'Co-Founder',
    githubUrl: '/',
    linkedinUrl: '/',
    twitterUrl: '/',
  },
  {
    photo: <StaticImage src="./images/stas-kelvich-photo.jpg" alt="Stas Kelvich" />,
    name: 'Stas Kelvich',
    position: 'Co-Founder',
    githubUrl: '/',
    linkedinUrl: '/',
    twitterUrl: '/',
  },
  {
    photo: <StaticImage src="./images/megan-fulcher-photo.jpg" alt="Megan Fulcher" />,
    name: 'Megan Fulcher',
    position: 'Business Operations Manager',
    linkedinUrl: '/',
    twitterUrl: '/',
  },
  {
    photo: <StaticImage src="./images/cristofer-calzoni-photo.jpg" alt="Cristofer Calzoni" />,
    name: 'Cristofer Calzoni',
    position: 'Software Engineer',
    githubUrl: '/',
    linkedinUrl: '/',
    twitterUrl: '/',
  },
  {
    photo: <StaticImage src="./images/marcus-baptista-photo.jpg" alt="Marcus Baptista" />,
    name: 'Marcus Baptista',
    position: 'Software Engineer',
    githubUrl: '/',
    linkedinUrl: '/',
  },
  {
    photo: <StaticImage src="./images/nolan-westervelt-photo.jpg" alt="Nolan Westervelt" />,
    name: 'Nolan Westervelt',
    position: 'Software Engineer',
    linkedinUrl: '/',
    twitterUrl: '/',
  },
  {
    photo: <StaticImage src="./images/ahmad-lipshutz-photo.jpg" alt="Ahmad Lipshutz" />,
    name: 'Ahmad Lipshutz',
    position: 'Software Engineer',
    githubUrl: '/',
    linkedinUrl: '/',
  },
  {
    photo: <StaticImage src="./images/leo-botosh-photo.jpg" alt="Leo Botosh" />,
    name: 'Leo Botosh',
    position: 'Software Engineer',
    githubUrl: '/',
    linkedinUrl: '/',
    twitterUrl: '/',
  },
  {
    photo: <StaticImage src="./images/charlie-vetrovs-photo.jpg" alt="Charlie Vetrovs" />,
    name: 'Charlie Vetrovs',
    position: 'Software Engineer',
    githubUrl: '/',
    linkedinUrl: '/',
    twitterUrl: '/',
  },
  {
    photo: <StaticImage src="./images/zain-herwitz-photo.jpg" alt="Zain Herwitz" />,
    name: 'Zain Herwitz',
    position: 'Software Engineer',
    githubUrl: '/',
    linkedinUrl: '/',
    twitterUrl: '/',
  },
  {
    photo: <StaticImage src="./images/maria-calzoni-photo.jpg" alt="Maria Calzoni" />,
    name: 'Maria Calzoni',
    position: 'Software Engineer',
    twitterUrl: '/',
  },
  {
    photo: <StaticImage src="./images/carter-culhane-photo.jpg" alt="Carter Culhane" />,
    name: 'Carter Culhane',
    position: 'Software Engineer',
    githubUrl: '/',
    linkedinUrl: '/',
    twitterUrl: '/',
  },
  {
    photo: <StaticImage src="./images/terry-gouse-photo.jpg" alt="Terry Gouse" />,
    name: 'Terry Gouse',
    position: 'Software Engineer',
    githubUrl: '/',
    linkedinUrl: '/',
    twitterUrl: '/',
  },
  {
    photo: <StaticImage src="./images/lydia-levin-photo.jpg" alt="Lydia Levin" />,
    name: 'Lydia Levin',
    position: 'Software Engineer',
    githubUrl: '/',
    linkedinUrl: '/',
    twitterUrl: '/',
  },
  {
    photo: <StaticImage src="./images/andrey-taranik-photo.jpg" alt="Andrey Taranik" />,
    name: 'Andrey Taranik',
    position: 'Site Reliability Engineer',
    githubUrl: '/',
    linkedinUrl: '/',
    twitterUrl: '/',
  },
  {
    photo: <StaticImage src="./images/anton-shyrabokau-photo.jpg" alt="Anton Shyrabokau" />,
    name: 'Anton Shyrabokau',
    position: 'Software Engineer',
    githubUrl: '/',
    linkedinUrl: '/',
    twitterUrl: '/',
  },
  {
    photo: <StaticImage src="./images/anna-stepanyan-photo.jpg" alt="Anna Stepanyan" />,
    name: 'Anna Stepanyan',
    position: 'Software Engineer',
    linkedinUrl: '/',
    twitterUrl: '/',
  },
  {
    photo: <StaticImage src="./images/anton-chaporgin-photo.jpg" alt="Anton Chaporgin" />,
    name: 'Anton Chaporgin',
    position: 'Software Engineer',
    githubUrl: '/',
    linkedinUrl: '/',
  },
  {
    photo: <StaticImage src="./images/egor-suvorov-photo.jpg" alt="Egor Suvorov" />,
    name: 'Egor Suvorov',
    position: 'Software Engineer',
    githubUrl: '/',
    linkedinUrl: '/',
    twitterUrl: '/',
  },
  {
    photo: <StaticImage src="./images/nolan-curtis-photo.jpg" alt="Nolan Curtis" />,
    name: 'Nolan Curtis',
    position: 'Software Engineer',
    githubUrl: '/',
    linkedinUrl: '/',
    twitterUrl: '/',
  },
  {
    photo: <StaticImage src="./images/marilyn-saris-photo.jpg" alt="Marilyn Saris" />,
    name: 'Marilyn Saris',
    position: 'Software Engineer',
    linkedinUrl: '/',
  },
  {
    photo: <StaticImage src="./images/jaxson-bergson-photo.jpg" alt="Jaxson Bergson" />,
    name: 'Jaxson Bergson',
    position: 'Software Engineer',
    githubUrl: '/',
    linkedinUrl: '/',
    twitterUrl: '/',
  },
];

const Team = () => (
  <section className="safe-paddings pt-48 3xl:pt-44 2xl:pt-40 xl:pt-32 lg:pt-12 md:pt-6">
    <Container size="sm">
      <Heading tag="h1" size="md" theme="black">
        Meet the team
      </Heading>
      <p className="t-xl mt-8 2xl:mt-7 xl:mt-6">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat.
      </p>
      <p className="t-xl mt-6 2xl:mt-5 xl:mt-4">
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
      <ul className="grid-gap-x mt-16 grid grid-cols-2 gap-y-20 xl:gap-y-10 lg:mt-12 md:mt-8 md:block md:space-y-8">
        {items.map(({ photo, name, position, githubUrl, linkedinUrl, twitterUrl }, index) => (
          <li className="flex" key={index}>
            <div className="w-36 shrink-0 xs:w-32">{photo}</div>
            <div className="ml-5 xs:ml-3">
              <h3 className="max-w-[100px] text-2xl font-semibold leading-tight md:max-w-none xs:text-[20px] xs:leading-tight">
                {name}
              </h3>
              <p className="t-base mt-2 !leading-snug text-gray-2 xs:mt-1">{position}</p>
              <ul className="mt-3 flex space-x-2 xs:mt-2">
                {githubUrl && (
                  <li>
                    <Link
                      className="text-gray-2 transition-colors duration-200 hover:text-black"
                      to={githubUrl}
                    >
                      <span className="sr-only">Github</span>
                      <GithubIcon className="xs:h-6 xs:w-6" />
                    </Link>
                  </li>
                )}
                {linkedinUrl && (
                  <li>
                    <Link
                      className="text-gray-2 transition-colors duration-200 hover:text-[#0a66c2]"
                      to={linkedinUrl}
                    >
                      <span className="sr-only">Linkedin</span>
                      <LinkedinIcon className="xs:h-6 xs:w-6" />
                    </Link>
                  </li>
                )}
                {twitterUrl && (
                  <li>
                    <Link
                      className="text-gray-2 transition-colors duration-200 hover:text-[#309ce8]"
                      to={twitterUrl}
                    >
                      <span className="sr-only">Twitter</span>
                      <TwitterIcon className="xs:h-6 xs:w-6" />
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default Team;
