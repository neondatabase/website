import Image from 'next/image';
import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import alexCoAvatar from 'images/authors/alex-co.jpg';
import benHalpernAvatar from 'images/authors/ben-halpern.jpg';
import benVinegarAvatar from 'images/authors/ben-vinegar.jpg';
import codyJenkinsAvatar from 'images/authors/cody-jenkins.jpg';
import dhruvAminAvatar from 'images/authors/dhruv-amin2.jpg';
import dominicWhyteAvatar from 'images/authors/dominic-whyte.jpg';
import himanshuBhandohAvatar from 'images/authors/himanshu-bhandoh.jpg';
import jamesRossAvatar from 'images/authors/james-ross.jpg';
import jeremyBermanAvatar from 'images/authors/jeremy-berman.jpg';
import joeHorsnellAvatar from 'images/authors/joe-horsnell.jpg';
import jonathanReyesAvatar from 'images/authors/jonathan-reyes.jpg';
import jorgeFerreiroAvatar from 'images/authors/jorge-ferreiro.jpg';
import julianBenegasAvatar from 'images/authors/julian-benegas.jpg';
import lincolnBergesonAvatar from 'images/authors/lincoln-bergeson.jpg';
import martinSkowAvatar from 'images/authors/martin-skow.jpg';
import oliJuhlAvatar from 'images/authors/oli-juhl.png';
import oliverStenbomAvatar from 'images/authors/oliver-stenbom.jpg';
import pierreBurgyAvatar from 'images/authors/pierre-burgy.jpg';
import rickBlalockAvatar from 'images/authors/rick-blalock.jpg';
import thorstenRiessAvatar from 'images/authors/thorsten-riess.jpg';
import { cn } from 'utils/cn';

const quotes = {
  'dhruv-amin': {
    name: 'Dhruv Amin',
    avatar: dhruvAminAvatar,
  },
  'lincoln-bergeson': {
    name: 'Lincoln Bergeson',
    avatar: lincolnBergesonAvatar,
  },
  'martin-skow-røed': {
    name: 'Martin Skow Røed',
    avatar: martinSkowAvatar,
  },
  'alex-co': {
    name: 'Alex Co',
    avatar: alexCoAvatar,
  },
  'ben-halpern': {
    name: 'Ben Halpern',
    avatar: benHalpernAvatar,
  },
  'ben-vinegar': {
    name: 'Ben Vinegar',
    avatar: benVinegarAvatar,
  },
  'cody-jenkins': {
    name: 'Cody Jenkins',
    avatar: codyJenkinsAvatar,
  },
  'dominic-whyte': {
    name: 'Dominic Whyte',
    avatar: dominicWhyteAvatar,
  },
  'joe-horsnell': {
    name: 'Joe Horsnell',
    avatar: joeHorsnellAvatar,
  },
  'himanshu-bhandoh': {
    name: 'Himanshu Bhandoh',
    avatar: himanshuBhandohAvatar,
  },
  'james-ross': {
    name: 'James Ross',
    avatar: jamesRossAvatar,
  },
  'jeremy-berman': {
    name: 'Jeremy Berman',
    avatar: jeremyBermanAvatar,
  },
  'jonathan-reyes': {
    name: 'Jonathan Reyes',
    avatar: jonathanReyesAvatar,
  },
  'jorge-ferreiro': {
    name: 'Jorge Ferreiro',
    avatar: jorgeFerreiroAvatar,
  },
  'julian-benegas': {
    name: 'Julian Benegas',
    avatar: julianBenegasAvatar,
  },
  'oli-juhl': {
    name: 'Oliver Juhl',
    avatar: oliJuhlAvatar,
  },
  'oliver-stenbom': {
    name: 'Oliver Stenbom',
    avatar: oliverStenbomAvatar,
  },
  'pierre-burgy': {
    name: 'Pierre Burgy',
    avatar: pierreBurgyAvatar,
  },
  'rick-blalock': {
    name: 'Rick Blalock',
    avatar: rickBlalockAvatar,
  },
  'thorsten-riess': {
    name: 'Thorsten Rieß',
    avatar: thorstenRiessAvatar,
  },
};

const QuoteBlock = ({ author, className = '', quote, text, role, link }) => {
  const actualQuote = quote || text;

  let name;
  let avatar;
  let company;
  if (typeof author === 'string') {
    const authorData = quotes[author];
    if (!authorData) return null;
    name = authorData.name;
    avatar = authorData.avatar;
    company = role;
  } else if (author && typeof author === 'object') {
    name = author.name;
    company = author.company;
    avatar = author.avatar || null;
  }

  if (!name) return null;

  return (
    <section className={cn('quote my-8 border-l-2 border-green-44 pl-6', className)}>
      <figure className="flex flex-col gap-5">
        <blockquote className="max-w-[710px] border-none p-0 font-mono text-xl leading-snug font-normal tracking-extra-tight text-black-pure dark:text-white sm:text-lg">
          &quot;{actualQuote}&quot;
        </blockquote>

        <figcaption className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            {avatar && (
              <div className="relative overflow-hidden rounded-full">
                <Image
                  className="pointer-events-none m-0 size-8 rounded-full object-cover sm:size-7"
                  src={avatar}
                  alt={name}
                  width={32}
                  height={32}
                />
              </div>
            )}
            <div className="flex items-center gap-1.5 text-base leading-snug tracking-tight">
              <span className="font-medium text-black-pure dark:text-white">{name}</span>
              {company && (
                <>
                  <span className="font-normal text-gray-new-40 dark:text-gray-new-70">—</span>
                  <cite className="font-normal text-gray-new-40 not-italic dark:text-gray-new-70">
                    {company}
                  </cite>
                </>
              )}
            </div>
          </div>
          {link && (
            <Link
              className="shrink-0 text-base leading-none font-medium tracking-tight text-black-pure no-underline dark:text-white"
              arrowClassName="text-gray-new-40 dark:text-gray-new-70"
              to={link}
              withArrow
            >
              Read case study
            </Link>
          )}
        </figcaption>
      </figure>
    </section>
  );
};

QuoteBlock.propTypes = {
  author: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      name: PropTypes.string,
      company: PropTypes.string,
      avatar: PropTypes.object,
    }),
  ]).isRequired,
  quote: PropTypes.string,
  text: PropTypes.string,
  role: PropTypes.string,
  link: PropTypes.string,
  className: PropTypes.string,
};

export default QuoteBlock;
