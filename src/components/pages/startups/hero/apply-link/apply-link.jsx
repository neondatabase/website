import Image from 'next/image';

import Button from 'components/shared/button';
import Link from 'components/shared/link';
import { cn } from 'utils/cn';

import LINKS from '../../../../../constants/links';
import formPattern from '../../../../../images/pages/contact-sales/form-pattern.png';

const APPLY_URL = 'https://sites.google.com/databricks.com/startup-program-apply';

const ApplyLink = () => (
  <div
    className={cn(
      'relative z-10 grid scroll-mt-10 gap-y-6 overflow-hidden border border-gray-new-20 bg-black-pure/80 px-8 py-7',
      'xl:gap-5 xl:px-7 xl:py-6 lg:max-w-full md:px-5 md:py-5'
    )}
    id="startups-form"
  >
    <h2 className="text-xl leading-snug font-medium tracking-tighter text-white">
      Apply to the Databricks Startup Program
    </h2>
    <p className="leading-snug tracking-tight text-gray-new-70">
      Tell us about your startup and we&apos;ll get back to you within a few business days.
    </p>
    <div className="relative z-0 col-span-full mt-1 flex items-end justify-between gap-6 sm:flex-col sm:items-start sm:gap-4">
      <p className="max-w-[300px] text-sm leading-[1.5] tracking-tight text-gray-new-60 sm:max-w-full">
        By applying you agree to the{' '}
        <Link className="decoration-dashed" to={LINKS.websiteTerms} theme="grey-85-underlined">
          Terms of Use
        </Link>{' '}
        and acknowledge the{' '}
        <Link className="decoration-dashed" to={LINKS.privacyPolicy} theme="grey-85-underlined">
          Privacy Notice
        </Link>
        .
      </p>
      <Button
        className="min-w-[152px] px-10 sm:w-full sm:min-w-0"
        to={APPLY_URL}
        theme="white-filled"
        size="new"
        target="_blank"
        rel="noopener noreferrer"
      >
        Apply Now
      </Button>
    </div>
    <Image
      className="absolute -right-px -bottom-px -z-10 max-w-none"
      src={formPattern}
      alt=""
      width={576}
      height={228}
      priority
    />
  </div>
);

export default ApplyLink;
