'use client';

import { m, AnimatePresence, domAnimation, LazyMotion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

import Container from 'components/shared/container/container';
import ArrowDownIcon from 'icons/report/arrow-down.inline.svg';
import quoteIcon from 'icons/report/quote.svg';
import usersIcon from 'icons/report/users-icon.svg';

const storyVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.025,
      duration: 0.2,
    },
  }),
  exit: { opacity: 0, y: -10, transition: { duration: 0.22 } },
};

const DATA = [
  {
    description:
      'We had an admin drop a crucial table (accidentally) as a result of a typo in the sql command. Took 2h to restore operations.',
    role: 'Staff Software Engineer from a',
    company: 'SaaS company',
    team: '5k-10k',
  },
  {
    description:
      'We experienced power loss and brownout recovery corrupted our local hot backup. Had to build a whole new machine and try to recover data. Took a week.',
    role: 'Senior Software Developer from a',
    company: 'SaaS company',
    team: '51–200',
  },
  {
    description:
      'A database failure caused a significant performance degradation, leading to slow response times for critical applications for around 16-20 hours. The internal team faced mounting pressure, working extended hours to identify the issue, restore backups, and mitigate further delays, resulting in high stress and disrupted workflows across development and operations teams.',
    role: 'DevOps Engineer from a',
    company: 'Semiconductors company ',
    team: '10k+',
  },
  {
    description:
      'A certain table record got all cleared during our night shift. Due to being night shift production was not really affected, but getting IT and others to support was difficult. Our audits logs did not record the issue, so we had to go backups.',
    role: 'Software Engineer from a',
    company: 'Healthcare company',
    team: '51–200',
  },
  {
    description:
      'Our  biggest problem was that our HA standbys were lagging, so when we tried to failover, it wasn’t ready to take over immediately. On top of that, the recovery process was way too manual, which slowed everything down even more. It really highlighted how much we needed to test our end-to-end recovery process better.',
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
  {
    description:
      "Our failure situation reminded me of dad's anecdote of when the entire family gathered around the TV to watch Nixon resign. Because all members of my team were trying to resolve the issue with our database.",
    role: 'Cloud  Administrator from a',
    company: 'Food and Beverage company',
    team: '1k–5k',
  },
  {
    description:
      'The team pushed an update to optimize db writes by tweaking indexing strategies.About 30 minutes after deployment, customers started reporting missing transactions.Also replication lag in the read-replicas meant some users were seeing outdated or incorrect balances.Customer trust was at stake—this was a financial application, meaning real money was on the line.The incident affected over 50,000 users in a 2-hour window.',
    role: 'Lead automation Engineer at a',
    company: 'Saas company',
    team: '10k+',
  },
  {
    description:
      'A critical production database crash wiped out recent transactions due to a misconfigured backup  causing downtime and it eventually forced us to rebuild lost data from logs and user feedback and reports.',
    role: 'Full-stack Developer at a',
    company: 'Saas company',
    team: '2–10',
  },
  {
    description:
      'We recently had an incident where some of our DB upload jobs failed to run due to a change made by another internal team which had inadvertently broke our job. This resulted in a few client complaints and downtime as we worked to resolve the issue. It also pulled me away from other important tasks.',
    role: 'Principal Software Engineer from a',
    company: 'Fintech company',
    team: '10k+',
  },
  {
    description:
      "A younger developer was doing a migration that involved changing the field name for photos in user accounts. Unfortunately, the migration wasn't well tested but still made it through PRs and into prod. Users couldn't see their profile photos when logging in and service tickets as well as social media comments went through the roof. We were able to test and get the hotfix out a few hours later, but the damage had already been done for a lot of customers.",
    role: 'Software Engineer at a',
    company: 'Manufacturing company',
    team: '501–1k',
  },
  {
    description:
      'Our team faced a major production database incident when an unoptimized reporting query caused a full-table lock in our PostgreSQL cluster. The query, missing proper indexing, led to excessive disk I/O and memory usage, slowing down the entire system. As deadlocks increased and connections were exhausted, API response times deteriorated, batch jobs failed, and our alerting system flooded with warnings. Customers experienced significant delays, and critical business operations were disrupted.',
    role: 'Sr. Software Engineer from an',
    company: 'Insurance company',
    team: '10k+',
  },
  {
    description:
      'The most recent database production incident was due to a server failure in one of the data centers and automatic failover failed to kick in due to a misconfiguration. We had to manually switch over to the other database which could only be done after the issue was identified, which resulted in a lot of failed transactions and unhappy customers.',
    role: 'Lead Software Engineer from a',
    company: 'Financial services company',
    team: '10k+',
  },
  {
    description:
      'Our PostgreSQL database suddenly became unresponsive, severely impacting our operations. The issue affected multiple teams, Level 1 support was flooded with complaints, developers scrambled to diagnose the issue. As we investigated, we discovered that an unexpectedly large batch of updated had caused table bloat, leading to  excessive disk I/O. Unfortunately, our failover mechanism could not keep up with the degraded performance, extending the downtime. We had to restore from the recent backup to ensure data integrity and get services back online.',
    role: 'System Administrator from the',
    company: 'IT industry',
    team: '2–10',
  },
  {
    description:
      "We saw extreme disk I/O and abnormally slow queries. In a matter of minutes, alarms began blowing—our main database server's disk was at 99%. Before we could respond, PostgreSQL crashed violently. We switched a replica over to be the new primary to bring the application back online. We removed duplicate WAL archives manually to free up space. Our latest full backup was bad! It hadn't been properly tested, and the archive was incomplete.Thankfully, previous backups were fine, and we used WAL replay to recover as far back as 10 minutes before the crash.",
    role: 'Security Software Developer from an',
    company: 'Electronic company',
    team: '10k+',
  },
];

const RecoveryStories = () => {
  const [visibleStories, setVisibleStories] = useState(5);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleShowMore = () => {
    if (isExpanded) {
      setVisibleStories(5);
      setIsExpanded(false);
    } else {
      setVisibleStories(DATA.length);
      setIsExpanded(true);
    }
  };

  return (
    <section className="recovery-stories safe-paddings mt-[155px] xl:mt-[140px] sm:mt-[126px]">
      <Container className="flex !max-w-xl flex-col items-start lg:!max-w-[642px]" size="xxs">
        <h2 className="relative z-10 font-title text-5xl font-medium leading-tight tracking-extra-tight xl:text-[44px] lg:text-4xl sm:text-[32px]">
          Recovery horror stories
        </h2>
        <m.ul className="recovery-stories-list mt-11 flex flex-col gap-y-9 xl:mt-10 xl:gap-y-7 lg:mt-[38px] sm:mt-7">
          <LazyMotion features={domAnimation}>
            <AnimatePresence>
              {DATA.slice(0, visibleStories).map(({ description, role, company, team }, index) => (
                <m.li
                  className="border-b border-dashed border-gray-new-15 pb-9 xl:pb-7"
                  key={index}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={storyVariants}
                >
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
                      <Image src={usersIcon} width={18} height={18} alt="" />
                      <span className="text-gray-new-60">Team:</span>
                      <span className="font-medium text-gray-new-80">{team}</span>
                    </div>
                  </div>
                </m.li>
              ))}
            </AnimatePresence>
          </LazyMotion>
        </m.ul>
        {DATA.length > 5 && (
          <button
            className="mt-5 flex items-center gap-x-2 text-[15px] font-medium text-white transition-colors hover:text-green-45 lg:mt-3 xs:mx-auto"
            type="button"
            aria-expanded={isExpanded}
            aria-controls="recovery-stories-list"
            onClick={handleShowMore}
          >
            {isExpanded ? 'Show less' : 'Show more'}
            <span className="sr-only">recovery stories</span>
            <ArrowDownIcon
              className={isExpanded && 'mt-0.5 rotate-180'}
              width={12}
              height={7}
              alt=""
              aria-hidden
            />
          </button>
        )}
        <Image
          className="pointer-events-none absolute -left-[115px] -top-[120px] z-[1] xl:-left-[83px] lg:-left-[48px] sm:-left-[27px] sm:-top-[90px] sm:max-w-[150px]"
          src={quoteIcon}
          width={195}
          height={170}
          alt=""
        />
      </Container>
    </section>
  );
};

export default RecoveryStories;
