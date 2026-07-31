import Button from 'components/shared/button';
import Link from 'components/shared/link';

import LINKS from '../../../../../constants/links';

const APPLY_URL = 'https://sites.google.com/databricks.com/startup-program-apply';

const ApplyLink = () => (
  <div className="flex scroll-mt-10 flex-col items-start gap-5 sm:w-full" id="startups-form">
    <Button
      className="min-w-[200px] px-10 sm:w-full sm:min-w-0"
      to={APPLY_URL}
      theme="white-filled"
      size="new"
      target="_blank"
      rel="noopener noreferrer"
    >
      Apply Now
    </Button>
    <p className="max-w-[420px] text-sm leading-[1.5] tracking-tight text-gray-new-60">
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
  </div>
);

export default ApplyLink;
