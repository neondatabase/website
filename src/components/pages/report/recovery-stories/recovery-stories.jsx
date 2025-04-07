import Image from 'next/image';

import Container from 'components/shared/container/container';
import usersIcon from 'icons/report/users-icon.svg';

const DATA = [
  {
    description:
      'We experienced power loss and brownout recovery corrupted our local hot backup. Had to build a whole new machine and try to recover data. Took a week.',
    role: 'Senior Software Developer from a',
    company: 'SaaS company',
    team: '51-200',
  },
  {
    description:
      'A database failure caused a significant performance degradation, leading to slow response times for critical applications for around 16-20 hours. The internal team faced mounting pressure, working extended hours to identify the issue, restore backups, and mitigate further delays, resulting in high stress and disrupted workflows across development and operations teams.',
    role: 'DevOps Engineer from a',
    company: 'Semiconductors company',
    team: '10K+',
  },
  {
    description:
      'A certain table record got all cleared during our night shift. Due to being night shift production was not really affected, but getting IT and others to support was difficult. Our audits logs did not record the issue, so we had to go backups.',
    role: 'Software Engineer from a',
    company: 'Healthcare company',
    team: '51-200',
  },
  {
    description:
      'Our biggest problem was that our HA standbys were lagging, so when we tried to failover, it wasn’t ready to take over immediately. On top of that, the recovery process was way too manual, which slowed everything down even more. It really highlighted how much we needed to test our end-to-end recovery process better.',
    role: 'CEO of a',
    company: 'SaaS startup',
    team: '<10',
  },
  {
    description:
      'We have had cases where an analyst has deleted large volumes of data from an application database, incurring large vacuums, low disk (due to WAL overhead under logical replication), and high IOPS/CPU due to various other inefficiencies. Our failure mode in this case was to reprioritize critical queries and strategically run vacuums, since failing over would not save us.',
    role: 'Senior Staff Software Engineer from a',
    company: 'Saas company',
    team: '51–200',
  },
];

const RecoveryStories = () => (
  <section className="recovery-stories safe-paddings mt-[155px] lg:mt-[140px] sm:mt-[126px]">
    <Container className="relative z-10 flex !max-w-[576px] flex-col items-start" size="xxs">
      <h2 className="font-title text-5xl font-medium leading-tight tracking-extra-tight lg:text-[44px] md:text-[40px] sm:text-[32px]">
        Recovery horror stories
      </h2>
      <ul className="mt-11 flex flex-col gap-y-[35px] lg:gap-y-[27px] md:mt-[38px] sm:mt-[28px]">
        {DATA.map(({ description, role, company, team }, index) => (
          <li className="border-b border-dashed border-gray-new-15 pb-9 lg:pb-7" key={index}>
            <p className="text-lg leading-normal tracking-extra-tight text-gray-new-90 sm:text-[16px]">
              {description}
            </p>
            <div className="mt-3 flex items-center gap-x-2 text-sm leading-snug tracking-extra-tight sm:flex-col sm:items-start sm:gap-y-1">
              <p className="flex items-center gap-x-1 text-gray-new-60 sm:flex-wrap">
                <span>{role}</span>
                <span className="text-green-45">{company}</span>
              </p>
              <span className="text-gray-new-15 sm:hidden" aria-hidden>
                •
              </span>
              <div className="flex items-center gap-x-2 sm:gap-x-1">
                <Image className="" src={usersIcon} width={18} height={18} alt="" />
                <span className="text-gray-new-60">Team:</span>
                <span className="font-medium text-gray-new-80">{team}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default RecoveryStories;
