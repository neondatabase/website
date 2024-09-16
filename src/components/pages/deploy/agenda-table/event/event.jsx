import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';

const Event = ({
  speaker,
  company,
  time,
  event,
  description = null,
  setShowModal,
  setSelectedSpeaker,
}) => {
  const { avatar, name, role, bio } = speaker;
  const openModal = () => {
    setShowModal(true);
    setSelectedSpeaker({ ...speaker, company, event, description });
  };

  return (
    <tr
      className={clsx('group sm:flex sm:flex-col-reverse sm:pb-5 sm:pt-[18px] sm:first:pt-4', {
        'sm:cursor-pointer': bio || description,
      })}
      role={bio ? 'button' : 'row'}
      onClick={openModal}
    >
      <td className="py-4 pr-4 sm:mt-3.5 sm:flex sm:items-center sm:justify-between sm:py-0 sm:pr-0 xs:items-center">
        <div
          className={clsx(
            'group flex items-center gap-x-2.5 sm:w-full',
            bio ? 'cursor-pointer' : 'cursor-auto'
          )}
        >
          {avatar && (
            <Image
              className="rounded-full sm:h-8 sm:w-8"
              src={avatar}
              alt={name}
              width={40}
              height={40}
            />
          )}
          <div className="flex flex-col items-start text-left">
            <span className="text-base font-medium tracking-[-0.02em] sm:text-[15px]">{name}</span>
            {role && (
              <span className="mt-0.5 text-[13px] font-light text-gray-new-80">
                <span className="tracking-[-0.02em]">{role}</span>
                <span>, {company}</span>
              </span>
            )}
          </div>
        </div>
        <span className="hidden whitespace-pre text-gray-new-80 sm:block" aria-hidden>
          {time}
        </span>
      </td>
      <td
        className={clsx(
          'py-4 pr-4 text-xl tracking-[-0.02em] transition-colors duration-200 lg:text-base sm:py-0 sm:pr-0 sm:text-xl sm:leading-[1.25] xs:text-lg',
          { 'group-hover:text-green-45': bio || description }
        )}
      >
        {event}
      </td>
      <td className="whitespace-pre py-4 text-lg font-semibold leading-dense text-gray-new-80 lg:text-base sm:hidden">
        {time}
      </td>
    </tr>
  );
};

Event.propTypes = {
  speaker: PropTypes.shape({
    avatar: PropTypes.object,
    name: PropTypes.string.isRequired,
    role: PropTypes.string,
    bio: PropTypes.string,
  }).isRequired,
  event: PropTypes.string.isRequired,
  description: PropTypes.string,
  time: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  setShowModal: PropTypes.func.isRequired,
  setSelectedSpeaker: PropTypes.func.isRequired,
};

export default Event;
