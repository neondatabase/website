import Image from 'next/image';
import PropTypes from 'prop-types';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

import GithubIcon from './images/github.inline.svg';
import LinkedinIcon from './images/linkedin.inline.svg';
import XIcon from './images/x.inline.svg';

const Team = ({ title, description, members }) => (
  <section className="safe-paddings pt-48 3xl:pt-44 2xl:pt-40 xl:pt-32 lg:pt-12 md:pt-6">
    <Container size="xs">
      <Heading tag="h1" size="md" theme="black">
        {title}
      </Heading>
      <p className="t-xl mt-8 2xl:mt-7 xl:mt-6">{description}</p>
      <ul className="grid-gap-x mt-16 grid grid-cols-2 gap-y-20 xl:gap-y-10 lg:mt-12 md:mt-8 md:block md:space-y-8">
        {members.map(({ photo, name, position, githubUrl, linkedinUrl, twitterUrl }, index) => (
          <li className="flex" key={index}>
            <Image
              className="h-36 w-36 shrink-0 xs:h-32 xs:w-32"
              src={photo.src}
              srcSet={photo.srcset || null}
              width={144}
              height={144}
              alt={name}
              // load first 6 images in first screen immediately, the rest lazily
              loading={index > 5 ? 'lazy' : 'eager'}
            />
            <div className="ml-5 xs:ml-3">
              <h3 className="max-w-[100px] text-2xl font-semibold leading-snug md:max-w-none xs:text-[20px] xs:leading-tight">
                {name}
              </h3>
              <p className="t-base mt-2 leading-snug text-gray-2 xs:mt-1">{position}</p>
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
                      className="text-gray-2 transition-colors duration-200 hover:text-black"
                      to={twitterUrl}
                      target="_blank"
                    >
                      <span className="sr-only">X</span>
                      <XIcon className="xs:h-6 xs:w-6" />
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

Team.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  members: PropTypes.arrayOf(
    PropTypes.shape({
      photo: PropTypes.shape({
        src: PropTypes.string.isRequired,
        srcset: PropTypes.string,
      }).isRequired,
      name: PropTypes.string.isRequired,
      position: PropTypes.string.isRequired,
      githubUrl: PropTypes.string,
      linkedinUrl: PropTypes.string,
      twitterUrl: PropTypes.string,
    })
  ).isRequired,
};

export default Team;
