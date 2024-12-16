'use client';

import { useState } from 'react';

import CustomModal from 'components/shared/custom-modal';
import { DEPLOY_AGENDA } from 'constants/deploy';

import Event from './event';
import EventModal from './event-modal';

const AgendaTable = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);

  const closeEventModal = (e) => {
    e.stopPropagation();
    setShowEventModal(false);
  };

  return (
    <section className="relative mb-[72px] mt-[116px] xl:mt-0 lg:mb-16 lg:mt-8 md:mb-14">
      <div className="relative mx-auto grid w-full max-w-[1760px] flex-grow grid-cols-12 gap-10 text-white 2xl:px-14 xl:grid-cols-1 xl:gap-0 xl:px-11 xl:py-11 lg:px-8 lg:py-9 md:px-4 md:py-4 sm:py-0">
        <div className="col-span-8 col-start-3 mx-auto w-full max-w-[1152px] 2xl:col-span-full 2xl:col-start-1 lg:-mx-8 lg:w-auto lg:max-w-none lg:overflow-x-auto lg:px-8 md:-mx-4 md:px-4 sm:mx-0 sm:w-full sm:overflow-visible sm:px-0">
          <table className="w-full lg:min-w-[680px] sm:min-w-fit">
            <thead className="border-b border-gray-new-15 text-left text-sm font-medium leading-none text-gray-new-60 sm:hidden">
              <tr>
                <th className="pb-5 pr-4 tracking-[0.02em]">Speaker</th>
                <th className="pb-5 pr-4 tracking-[0.02em]">Talk</th>
                {/* <th className="pb-5 tracking-[0.02em]">Schedule (PT)</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-new-15 border-b border-t border-gray-new-15 text-lg leading-dense md:text-base">
              {DEPLOY_AGENDA.map(({ event, company, time, speaker, description }, index) => (
                <Event
                  event={event}
                  speaker={speaker}
                  company={company}
                  time={time}
                  description={description}
                  setShowModal={setShowEventModal}
                  setSelectedSpeaker={setSelectedEvent}
                  key={index}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedEvent?.bio && (
        <CustomModal name={selectedEvent.name} isOpen={showEventModal} closeModal={closeEventModal}>
          <EventModal {...selectedEvent} isOpen={showEventModal} closeModal={closeEventModal} />
        </CustomModal>
      )}
    </section>
  );
};

export default AgendaTable;
