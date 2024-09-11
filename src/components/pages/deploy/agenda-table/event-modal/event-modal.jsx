import Image from 'next/image';
import Link from 'next/link';
import PropTypes from 'prop-types';

import CloseIcon from 'icons/close-gradient.inline.svg';
import GithubIcon from 'icons/github.inline.svg';
import LinkedinIcon from 'icons/linkedin-logo.inline.svg';
import XIcon from 'icons/x-logo.inline.svg';

const EventModal = ({
  avatar,
  name,
  role,
  bio = null,
  xUrl = null,
  linkedinUrl = null,
  githubUrl = null,
  event,
  description,
  closeModal,
}) => (
  <div className="relative z-10 rounded-[10px] bg-black px-6 pb-7 pt-6">
    <button className="absolute right-6 top-6" type="button" onClick={closeModal}>
      <CloseIcon className="h-6 w-6" />
      <span className="sr-only">Close modal</span>
    </button>
    <div className="flex items-center gap-x-2.5">
      {avatar && (
        <Image
          className="rounded-full sm:h-8 sm:w-8"
          src={avatar}
          alt={name}
          width={42}
          height={42}
        />
      )}
      <div className="flex flex-col items-start leading-dense">
        <span className="text-xl font-medium tracking-[-0.02em] sm:text-lg">{name}</span>
        {role && (
          <span className="text-gray-80 mt-1 text-sm font-light tracking-[-0.02em]">{role}</span>
        )}
      </div>
    </div>
    <div className="border-gray-15 text-gray-90 mt-4 border-t pt-4 text-sm font-light leading-[1.25]">
      {bio}
    </div>
    {(xUrl || linkedinUrl || githubUrl) && (
      <div className="mt-4 flex gap-x-5 text-white">
        {xUrl && (
          <Link
            className="hover:text-primary-4 transition-colors duration-200"
            href={xUrl}
            rel="noreferrer noopener"
            target="_blank"
          >
            <XIcon className="h-4 w-4" />
          </Link>
        )}
        {linkedinUrl && (
          <Link
            className="hover:text-primary-4 transition-colors duration-200"
            href={linkedinUrl}
            rel="noreferrer noopener"
            target="_blank"
          >
            <LinkedinIcon className="h-4 w-4" />
          </Link>
        )}
        {githubUrl && (
          <Link
            className="hover:text-primary-4 transition-colors duration-200"
            href={githubUrl}
            rel="noreferrer noopener"
            target="_blank"
          >
            <GithubIcon className="h-4 w-4" />
          </Link>
        )}
      </div>
    )}
    {description && (
      <div className="mt-11">
        <span className="block text-xl leading-dense tracking-[-0.02em] sm:text-lg">{event}</span>
        <p className="text-gray-90 border-gray-15 mt-4 border-t pt-4 text-sm font-light leading-[1.25]">
          {description}
        </p>
      </div>
    )}
  </div>
);

EventModal.propTypes = {
  avatar: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  bio: PropTypes.string,
  xUrl: PropTypes.string,
  linkedinUrl: PropTypes.string,
  githubUrl: PropTypes.string,
  event: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default EventModal;
