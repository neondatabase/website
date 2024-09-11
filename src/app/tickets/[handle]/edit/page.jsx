import Link from 'next/link';
import { notFound } from 'next/navigation';

import DynamicTicket from 'components/pages/deploy/dynamic-ticket';
import SocialShare from 'components/pages/tickets/social-share';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import SEO_DATA from 'constants/seo-data';
import ArrowLeftIcon from 'icons/arrow-left-thin.inline.svg';
import buildOgImageUrl from 'utils/build-og-image-url';
import getMetadata from 'utils/get-metadata';
import prisma from 'utils/prisma';

// eslint-disable-next-line react/prop-types
const TicketEditPage = async ({ params }) => {
  // eslint-disable-next-line no-use-before-define, react/prop-types
  const userData = await getTicketData(params.handle);

  if (!userData) return notFound();

  const userName = userData.name || userData.login;

  const shareUrl = `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}/tickets/${userData.login}`;

  return (
    <Layout>
      <section className="overflow-hidden">
        <Container
          className="relative z-10 grid flex-grow grid-cols-12 gap-10 pb-[176px] pt-40 xl:grid-cols-1 xl:gap-0 xl:pb-[120px] xl:pt-28 lg:py-9 lg:pb-[104px] md:py-4 md:pb-20 md:pt-5"
          size="1344"
        >
          <div className="pointer-events-none relative z-10 col-span-4 col-start-1 self-center 2xl:col-start-1 xl:col-span-full xl:self-end xl:text-center">
            <h1 className="relative z-50 text-[62px] font-semibold leading-none tracking-[-0.05em] text-white 2xl:max-w-[420px] xl:mx-auto xl:max-w-[579px] md:max-w-[500px] md:text-[52px]">
              {userName}&apos;s <br className="hidden md:block" />
              Ticket
            </h1>
            <p className="relative z-50 mt-5 max-w-[610px] font-mono text-[1.15rem] font-light leading-tight tracking-tight text-white 2xl:max-w-[500px] xl:mx-auto xl:max-w-[420px] xl:max-w-[579px] xl:text-lg xl:leading-[1.375] xl:tracking-tighter lg:mt-4 lg:text-base">
              Choose the ticket color and gather a watch party for the upcoming Neon Deploy! See you
              on <time dateTime="2024-10-01T17:00:00Z">October 1st, 10 a.m. PT</time>
            </p>
            <Link
              className="pointer-events-auto mt-[18px] inline-flex items-end text-lg leading-none tracking-[-0.02em] text-green-45 underline decoration-green-45/40 underline-offset-[8px] transition-colors duration-200 hover:decoration-green-45 lg:text-base"
              href="/stage"
            >
              <span>Watch the event live</span>
              <ArrowLeftIcon className="ml-2.5 h-auto w-[18px] rotate-180" />
            </Link>
            <SocialShare className="pointer-events-auto mt-11 lg:mt-8 sm:mt-6" url={shareUrl} />
          </div>
          <div className="col-span-6 col-start-6 self-center 2xl:-ml-10 xl:col-span-full xl:self-start lg:ml-0">
            <DynamicTicket userData={userData} withColorPicker />
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default TicketEditPage;

async function getTicketData(handle) {
  let userData = null;

  if (handle) {
    try {
      userData = await prisma.user.findFirstOrThrow({
        where: {
          login: handle,
        },
        select: {
          name: true,
          email: true,
          login: true,
          colorSchema: true,
          image: true,
          id: true,
        },
      });
    } catch (err) {
      console.log('err', err);
      userData = null;
    }
  }

  return userData;
}

export async function generateStaticParams() {
  const users = await prisma.user.findMany();
  return users.map((user) => ({
    handle: user.login,
  }));
}

export async function generateMetadata({ params }) {
  const { handle } = params;
  let userData;

  if (handle) {
    try {
      userData = await prisma.user.findUnique({
        where: {
          login: handle,
        },
        select: {
          name: true,
          email: true,
          login: true,
          image: true,
          id: true,
          colorSchema: true,
        },
      });
    } catch (err) {
      console.log('Ticket page head query err', err);
    }
  }

  if (userData) {
    return getMetadata({
      ...SEO_DATA.ticket(userData),
      pathname: `/tickets/${userData.login}/edit`,
      imagePath: buildOgImageUrl(userData),
    });
  }

  return getMetadata({ ...SEO_DATA['404-ticket'] });
}

export const revalidate = 0;
