import Image from 'next/image';

import Container from 'components/shared/container';
import SectionLabel from 'components/shared/section-label';
import detectChangesIcon from 'icons/tools/detect-changes.svg';
import nextStepsIcon from 'icons/tools/next-steps.svg';
import understandImpactIcon from 'icons/tools/understand-impact.svg';
import upgradeAssessmentImage from 'images/pages/tools/upgrade-assessment.jpg';

const FEATURES = [
  {
    icon: detectChangesIcon,
    title: 'Detect relevant changes',
    description: 'See which Postgres version changes could affect your database and upgrade path.',
  },
  {
    icon: understandImpactIcon,
    title: 'Understand the impact',
    description: 'See why each finding matters and what needs your attention before upgrading.',
  },
  {
    icon: nextStepsIcon,
    title: 'Know what to do next',
    description: 'Get actionable guidance for each finding or copy a prompt to your coding agent.',
  },
];

const UpgradeAssessment = () => (
  <section
    className="upgrade-assessment mt-50 scroll-mt-25 safe-paddings xl:mt-40 lg:mt-30 md:mt-20"
    id="upgrade-assessment"
    aria-labelledby="upgrade-assessment-heading"
  >
    <Container size="1344">
      <SectionLabel theme="white">Upgrade assessment</SectionLabel>
      <h2
        className="mt-5 max-w-264 text-[3.5rem] leading-[1.125] tracking-tighter text-pretty text-white xl:text-[3rem] lg:text-[2.5rem] md:mt-4 md:text-[2rem]"
        id="upgrade-assessment-heading"
      >
        Know what changes, what needs attention, and what to expect before you upgrade
      </h2>
      <p className="mt-6 max-w-168 text-lg/normal tracking-extra-tight text-pretty text-gray-new-60 md:mt-5 md:text-base">
        Assess your database against a target Postgres version to uncover compatibility issues,
        required changes, and clear next steps before you upgrade.
      </p>
      <Image
        className="mt-17.5 h-auto w-full lg:mt-12 md:mt-8"
        src={upgradeAssessmentImage}
        width={1344}
        height={562}
        sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1408px) calc(100vw - 64px), 1344px"
        alt="Postgres 15 to 18 upgrade assessment showing compatibility findings, review guidance, and a prompt to copy to a coding agent"
        quality={100}
      />
      <ul className="mt-9.5 grid grid-cols-3 gap-x-33 xl:gap-x-12 lg:gap-x-8 md:mt-8 md:grid-cols-1 md:gap-y-7">
        {FEATURES.map(({ icon, title, description }) => (
          <li key={title}>
            <h3 className="flex items-center gap-2 text-base/none font-medium tracking-extra-tight text-white">
              <Image
                className="size-[16px] shrink-0 object-contain"
                src={icon}
                width={16}
                height={16}
                alt=""
              />
              {title}
            </h3>
            <p className="mt-2 text-base tracking-extra-tight text-gray-new-50">{description}</p>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default UpgradeAssessment;
