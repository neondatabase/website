import Image from 'next/image';

import Container from 'components/shared/container/container';
import checkIcon from 'icons/report/check-icon.svg';

const DATA = [
  {
    percentage: '59%',
    title:
      'of companies experienced a critical production failure in the past 12 months. Including hardware failures, accidental table drop, or data corruption.',
    description:
      'Large-scale Postgres failures are not rare events. More than half of teams running multi-TB Postgres encountered a serious failure over the last year.',
  },
  {
    percentage: '30%',
    title:
      'of teams had 3+ hours of downtime — and some pushed past half a day. Only 21% recovered in less than 60 minutes.',
    description:
      'Traditional restore methods (e.g., snapshot + WAL replay) often drags on as database size climbs into the TBs.',
  },
  {
    percentage: '40%',
    title:
      'reported significant business interruptions caused by the incident. Only 8% reported little to no stress or disruption to their operations.',
    description:
      'Disruptions affect everything from user satisfaction to internal deliverables — a headache for both development teams and the broader business.',
  },
  {
    percentage: '52%',
    title:
      'of companies experienced negative customer feedback due to the incident. 48% reported a huge spike in support cases. 26% had to deal with breach of SLAs and penalties.',
    description:
      "Prolonged downtimes are more than a technical inconvenience — they're a threat to revenue & customer trust.",
  },
  {
    percentage: '72%',
    title:
      'of teams are merely somewhat confident in their ability to quickly recover from failure. Even among teams that successfully recovered, only 21% feel very confident.',
    description:
      'Developers’ confidence in their current backup/restore solutions is shaky. There’s room for improvement in the experience. ',
  },
];

const KeyInsights = () => (
  <section className="key-insights safe-paddings mt-[134px]">
    <Container
      className="relative z-10 flex !max-w-[576px] flex-col items-start text-white"
      size="xxs"
    >
      <h2 className="font-title text-5xl font-medium leading-tight tracking-tight">Key insights</h2>
      <ul className="mt-12 flex flex-col gap-y-[42px]">
        {DATA.map(({ percentage, title, description }, index) => (
          <li className="flex flex-col" key={index}>
            <span className="bg-[linear-gradient(180deg,#00E599_24.85%,#007F55_68.32%)] bg-clip-text text-[36px] font-medium leading-none tracking-tighter text-transparent">
              {percentage}
            </span>
            <h3 className="mt-2 text-xl font-medium leading-snug tracking-tight text-gray-new-90">
              {title}
            </h3>
            <div className="relative mt-5 max-w-[536px] rounded-lg border border-gray-new-20 py-3 pl-11 pr-5">
              <Image
                className="absolute left-4 top-4"
                src={checkIcon}
                width={16}
                height={16}
                alt=""
              />
              <p className="relative text-sm leading-snug tracking-tight text-gray-new-60">
                {description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default KeyInsights;
