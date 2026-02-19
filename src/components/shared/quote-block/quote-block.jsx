import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

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
import oliverStenbomAvatar from 'images/authors/oliver-stenbom.jpg';
import pierreBurgyAvatar from 'images/authors/pierre-burgy.jpg';
import rickBlalockAvatar from 'images/authors/rick-blalock.jpg';
import thorstenRiessAvatar from 'images/authors/thorsten-riess.jpg';

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

const QuoteBlock = ({ author, className = '', quote, role }) => {
  const authorData = quotes[author];
  if (!authorData) {
    return null;
  }
  const { avatar, name } = authorData;

  return (
    <section className={clsx('quote my-8 border-l-2 border-green-44 pl-6', className)}>
      <figure className="my-10 lg:my-8 md:my-6">
        <blockquote className="max-w-[710px] border-none p-0 font-mono text-xl !font-normal leading-snug tracking-tighter text-black-new dark:text-gray-9 sm:text-[18px] sm:leading-snug">
          &quot;{quote}&quot;
        </blockquote>

        <figcaption className="mt-5 flex items-center gap-3 md:mt-4">
          <div className="relative size-9 overflow-hidden rounded-full sm:size-7">
            <Image
              src={avatar}
              alt={name}
              width={32}
              height={32}
              className="m-0 rounded-full object-cover sm:h-7 sm:w-7"
            />
          </div>
          <div className="flex gap-1.5">
            <div className="text-base font-medium leading-snug tracking-tighter text-black-new dark:text-gray-9 sm:text-[13px]">
              {name}{' '}
              <span className="font-normal text-gray-new-30 dark:text-[#A1A1AA]">— {role}</span>
            </div>
          </div>
        </figcaption>
      </figure>
    </section>
  );
};

QuoteBlock.propTypes = {
  author: PropTypes.string.isRequired,
  quote: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default QuoteBlock;
