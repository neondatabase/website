import Button from 'components/shared/button';
import LINKS from 'constants/links';

const CommunityBanner = () => (
  <div>
    <section className="my-10 flex items-center rounded-[10px] border border-gray-new-90 bg-community-light p-6 dark:border-gray-new-20 dark:bg-community-dark">
      <div>
        <h2 className="my-2 text-xl font-semibold leading-tight text-black-new dark:text-white">
          Neon Discord Server
        </h2>
        <Button
          className="mt-3 px-5 py-2.5 !text-sm !font-bold !text-black-new hover:bg-[#00e5bf]"
          to={LINKS.discord}
          size="xs"
          theme="primary"
        >
          Join now
        </Button>
      </div>
      <img
        className="ml-auto mr-4 dark:hidden sm:hidden"
        src="/images/pages/docs/discord-logo.svg"
        width={208}
        height={56}
        alt="Discord logo"
      />
      <img
        className="ml-auto mr-4 hidden dark:block dark:sm:hidden"
        src="/images/pages/docs/discord-logo-white.svg"
        width={208}
        height={56}
        alt=""
        aria-hidden
      />
    </section>
    <section className="my-10 flex items-center rounded-[10px] border border-gray-new-90 bg-community-light p-6 dark:border-gray-new-20 dark:bg-community-dark">
      <div>
        <h2 className="my-2 text-xl font-semibold leading-tight text-black-new dark:text-white">
          Neon Discourse Community
        </h2>
        <Button
          className="mt-3 px-5 py-2.5 !text-sm !font-bold !text-black-new hover:bg-[#00e5bf]"
          to={LINKS.discourse}
          size="xs"
          theme="primary"
        >
          Join now
        </Button>
      </div>
      <img
        className="ml-auto mr-4 dark:hidden sm:hidden"
        src="/images/pages/docs/discourse-logo.svg"
        width={208}
        height={56}
        alt="Discourse logo"
      />
      <img
        className="ml-auto mr-4 hidden dark:block dark:sm:hidden"
        src="/images/pages/docs/discourse-logo-white.svg"
        width={208}
        height={56}
        alt=""
        aria-hidden
      />
    </section>
  </div>
);

export default CommunityBanner;
