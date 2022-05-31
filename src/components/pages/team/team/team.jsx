import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

import GithubIcon from './images/github.inline.svg';
import LinkedinIcon from './images/linkedin.inline.svg';
import TwitterIcon from './images/twitter.inline.svg';

const members = [
  {
    photo: <StaticImage src="./images/nikita-shamgunov-photo.jpg" alt="Nikita Shamgunov" />,
    name: 'Nikita Shamgunov',
    position: 'CEO',
    githubUrl: 'https://github.com/nikitashamgunov',
    linkedinUrl: 'https://www.linkedin.com/in/nikitashamgunov/',
    twitterUrl: 'https://twitter.com/NikitaShamgunov',
  },
  {
    photo: <StaticImage src="./images/heikki-linnakangas-photo.jpg" alt="Heikki Linnakangas" />,
    name: 'Heikki Linnakangas',
    position: 'Co-Founder',
    githubUrl: 'https://github.com/hlinnaka',
    linkedinUrl: 'https://www.linkedin.com/in/heikki-linnakangas-6b58bb203/',
  },
  {
    photo: <StaticImage src="./images/stas-kelvich-photo.jpg" alt="Stas Kelvich" />,
    name: 'Stas Kelvich',
    position: 'Co-Founder',
    githubUrl: 'https://github.com/kelvich',
    linkedinUrl: 'https://www.linkedin.com/in/kelvich/',
  },
  {
    photo: <StaticImage src="./images/alexey-kondratov-photo.jpg" alt="Alexey Kondratov" />,
    name: 'Alexey Kondratov',
    position: 'Software Engineer',
    githubUrl: 'https://github.com/ololobus',
    linkedinUrl: 'https://www.linkedin.com/in/alexeyko/',
  },
  {
    photo: <StaticImage src="./images/bojan-serafimov-photo.jpg" alt="Bojan Serafimov" />,
    name: 'Bojan Serafimov',
    position: 'Software Engineer',
    githubUrl: 'https://github.com/bojanserafimov',
    twitterUrl: 'https://twitter.com/Bojan93112526',
  },
  {
    photo: <StaticImage src="./images/megan-fulcher-photo.jpg" alt="Megan Fulcher" />,
    name: 'Megan Fulcher',
    position: 'Business Operations Manager',
    linkedinUrl: 'https://www.linkedin.com/in/megan-fulcher/',
  },
  {
    photo: (
      <StaticImage src="./images/anastasia-lubennikova-photo.jpg" alt="Anastasia Lubennikova" />
    ),
    name: 'Anastasia Lubennikova',
    position: 'Software Engineer',
    githubUrl: 'https://github.com/lubennikovaav',
    linkedinUrl: 'https://www.linkedin.com/in/anastasia-lubennikova-8a2295a0/',
  },
  {
    photo: (
      <StaticImage src="./images/matthias-van-de-meent-photo.jpg" alt="Matthias van de Meent" />
    ),
    name: 'Matthias van\u00a0de\u00a0Meent',
    position: 'Software Engineer',
    githubUrl: 'https://github.com/MMeent',
  },
  {
    photo: <StaticImage src="./images/arseny-sher-photo.jpg" alt="Arseny Sher" />,
    name: 'Arseny Sher',
    position: 'Software Engineer',
    githubUrl: 'https://github.com/arssher',
  },
  {
    photo: <StaticImage src="./images/konstantin-knizhnik-photo.jpg" alt="Konstantin Knizhnik" />,
    name: 'Konstantin Knizhnik',
    position: 'Software Engineer',
    githubUrl: 'https://github.com/knizhnik',
  },
  {
    photo: <StaticImage src="./images/kate-klink-photo.jpg" alt="Kate Klink" />,
    name: 'Kate Klink',
    position: 'Growth & Marketing Manager',
    githubUrl: 'https://github.com/klink',
  },
  {
    photo: <StaticImage src="./images/dmitry-ivanov-photo.jpg" alt="Dmitry Ivanov" />,
    name: 'Dmitry Ivanov',
    position: 'Software Engineer',
    githubUrl: 'https://github.com/funbringer',
  },
  {
    photo: <StaticImage src="./images/polina-semenova-photo.jpg" alt="Polina Semenova" />,
    name: 'Polina Semenova',
    position: 'Software Engineer',
    githubUrl: 'https://github.com/seymourisdead',
  },
  {
    photo: <StaticImage src="./images/peter-geoghegan-photo.jpg" alt="Peter Geoghegan" />,
    name: 'Peter Geoghegan',
    position: 'Software Engineer',
    githubUrl: 'https://github.com/petergeoghegan',
  },
  {
    photo: <StaticImage src="./images/dmitry-rodionov-photo.jpg" alt="Dmitry Rodionov" />,
    name: 'Dmitry Rodionov',
    position: 'Software Engineer',
    githubUrl: 'https://github.com/LizardWizzard',
  },
  {
    photo: <StaticImage src="./images/arthur-petukhovsky-photo.jpg" alt="Arthur Petukhovsky" />,
    name: 'Arthur Petukhovsky',
    position: 'Software Engineer',
    githubUrl: 'https://github.com/petuhovskiy',
  },
  {
    photo: <StaticImage src="./images/kirill-bulatov-photo.jpg" alt="Kirill Bulatov" />,
    name: 'Kirill Bulatov',
    position: 'Software Engineer',
    githubUrl: 'https://github.com/SomeoneToIgnore',
  },
  {
    photo: <StaticImage src="./images/anna-stepanyan-photo.jpg" alt="Anna Stepanyan" />,
    name: 'Anna Stepanyan',
    position: 'Head of Product',
    linkedinUrl: 'https://www.linkedin.com/in/annastepanyan21/',
    githubUrl: 'https://github.com/stepashka',
  },
  {
    photo: <StaticImage src="./images/irina-hliabovich-photo.jpg" alt="Irina Hliabovich" />,
    name: 'Irina Hliabovich',
    position: 'Chief of Staff',
  },
  {
    photo: <StaticImage src="./images/egor-suvorov-photo.jpg" alt="Egor Suvorov" />,
    name: 'Egor Suvorov',
    position: 'Software Engineer',
    githubUrl: 'https://github.com/yeputons',
  },
  {
    photo: <StaticImage src="./images/andrey-taranik-photo.jpg" alt="Andrey Taranik" />,
    name: 'Andrey Taranik',
    position: 'Site Reliability Engineer',
    githubUrl: 'https://github.com/cicdteam',
  },
  {
    photo: <StaticImage src="./images/anton-galitsyn-photo.jpg" alt="Anton Galitsyn" />,
    name: 'Anton Galitsyn',
    position: 'Software Engineer',
    githubUrl: 'https://github.com/agalitsyn',
  },

  {
    photo: <StaticImage src="./images/daniil-efimov-photo.jpg" alt="Daniil Efimov" />,
    name: 'Daniil Efimov',
    position: 'Software Engineer',
    githubUrl: 'https://github.com/Daniel-ef',
  },

  {
    photo: <StaticImage src="./images/anton-chaporgin-photo.jpg" alt="Anton Chaporgin" />,
    name: 'Anton Chaporgin',
    position: 'Software Engineer',
    githubUrl: 'https://github.com/antonyc',
  },
  {
    photo: <StaticImage src="./images/sergey-melnikov-photo.jpg" alt="Sergey Melnikov" />,
    name: 'Sergey Melnikov',
    position: 'Site Reliability Engineer',
    githubUrl: 'https://github.com/SergeyMelnikov',
  },
];

const Team = () => (
  <section className="safe-paddings pt-48 3xl:pt-44 2xl:pt-40 xl:pt-32 lg:pt-12 md:pt-6">
    <Container size="sm">
      <Heading tag="h1" size="md" theme="black">
        Meet the team
      </Heading>
      <p className="t-xl mt-8 2xl:mt-7 xl:mt-6">
        The Neon team consists of PostgreSQL contributors and technologists on a mission to create a
        cloud-native database service for every developer. Neon CEO is Nikita Shamgunov, co-founder
        of MemSQL / SingleStore.
      </p>
      <ul className="grid-gap-x mt-16 grid grid-cols-2 gap-y-20 xl:gap-y-10 lg:mt-12 md:mt-8 md:block md:space-y-8">
        {members.map(({ photo, name, position, githubUrl, linkedinUrl, twitterUrl }, index) => (
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
                      target="_blank"
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
                      target="_blank"
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
                      target="_blank"
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
