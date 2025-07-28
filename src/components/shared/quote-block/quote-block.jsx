import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

import dhruvAvatar from 'images/authors/dhruv-amin.png';
import lincolnBergeson from 'images/authors/lincoln-bergeson.png';
import martinSkow from 'images/authors/martin-skow.png';

const quotes = {
  dhruv: {
    quote:
      'The speed of provisioning and serverless scale-to-zero of Neon is critical for us. We can serve users iterating on quick ideas efficiently while also supporting them as they scale, without making them think about database setup.',
    author: 'Dhruv Amin',
    role: 'Co-founder at Create.xyz',
    avatar: dhruvAvatar,
  },
  lincoln: {
    quote:
      'The combination of flexible resource limits and nearly instant database provisioning made Neon a no-brainer.',
    author: 'Lincoln Bergeson',
    role: 'Infrastructure Engineer at Replit',
    avatar: lincolnBergeson,
  },
  martin: {
    quote:
      'Integrating Neon was a no-brainer. It gives every Databutton app a production-grade Postgres database in seconds, with zero overhead. Our AI agent can now create, manage, and debug the entire stack, not just code.',
    author: 'Martin Skow Røed',
    role: 'CTO and co-founder of Databutton',
    avatar: martinSkow,
  },
};

const QuoteBlock = ({ name = 'dhruv', className = '' }) => {
  const data = quotes[name];

  if (!data) return null;

  return (
    <figure className={clsx('qoute', className)}>
      <blockquote className="border-none p-0 text-2xl font-medium leading-normal tracking-tight text-gray-9">
        &quot;{data.quote}&quot;
      </blockquote>

      <figcaption className="mt-5 flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <Image
            src={data.avatar}
            alt={data.author}
            width={36}
            height={36}
            className="m-0 rounded-full object-cover"
          />
        </div>
        <div className="flex gap-1.5">
          <p className="text-sm font-medium leading-tight tracking-tight !text-gray-9">
            {data.author} <span className="text-[#A1A1AA]">— {data.role}</span>
          </p>
        </div>
      </figcaption>
    </figure>
  );
};

QuoteBlock.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default QuoteBlock;
