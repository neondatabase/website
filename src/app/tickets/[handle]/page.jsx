// import Link from 'next/link';
import { notFound } from 'next/navigation';

import Button from 'components/pages/deploy/button';
import DynamicTicket from 'components/pages/deploy/dynamic-ticket';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
// import ArrowLeftIcon from 'icons/arrow-left-thin.inline.svg';
import buildOgImageUrl from 'utils/build-og-image-url';
import getMetadata from 'utils/get-metadata';
import prisma from 'utils/prisma';

// eslint-disable-next-line react/prop-types
const TicketPage = async ({ params }) => {
  // eslint-disable-next-line no-use-before-define, react/prop-types
  const userData = await getTicketData(params.handle);

  if (!userData) return notFound();

  const userName = userData.name || userData.login;

  return (
    <Layout>
      <section className="overflow-hidden">
        <Container
          className="relative z-10 grid flex-grow grid-cols-12 gap-10 pb-[176px] pt-40 xl:grid-cols-1 xl:gap-0 xl:pb-[120px] xl:pt-28 lg:py-9 lg:pb-[104px] md:py-4 md:pb-20 md:pt-5"
          size="1344"
        >
          <div className="pointer-events-none relative z-10 col-span-4 col-start-1 self-center 2xl:col-start-1 xl:col-span-full xl:self-end xl:text-center">
            <Link to={LINKS.deploy} theme="green" size="sm" className="mb-2 font-semibold">
              Neon Deploy
            </Link>
            <h1 className="relative z-50 font-title text-[62px] font-medium leading-none tracking-[-0.06em] text-white xl:mx-auto xl:max-w-[579px] md:max-w-[500px] md:text-[52px]">
              {userName}&apos;s <br className="hidden md:block" />
              Ticket
            </h1>
            <p className="relative z-50 mt-5 max-w-[363px] text-[1.15rem] font-light leading-tight tracking-tight text-gray-new-70 xl:mx-auto xl:max-w-[579px] xl:text-lg xl:leading-[1.375] xl:tracking-tighter lg:mt-4 lg:max-w-[610px] lg:text-base">
              Join {userName.split(' ')[0]} at Neon Deploy on{' '}
              <time dateTime="2024-10-30T17:00:00Z">October 30th, 10 a.m. PT</time>
            </p>
            {/* <Link
              className="pointer-events-auto mt-[18px] flex items-end text-lg leading-none tracking-[-0.02em] text-green-45 underline decoration-green-45/40 underline-offset-[8px] transition-colors duration-200 hover:decoration-green-45 xl:justify-center lg:text-base"
              href={LINKS.stage}
            >
              <span>Watch the event live</span>
              <ArrowLeftIcon className="ml-2.5 h-auto w-[18px] rotate-180" />
            </Link> */}

            <Button
              className="pointer-events-auto mt-11"
              size="md"
              theme="primary"
              href={LINKS.deploy}
              isAnimated
            >
              Grab yours
            </Button>
          </div>
          <div className="col-span-6 col-start-6 self-center 2xl:col-start-6 2xl:-ml-10 xl:col-span-full xl:self-start lg:ml-0">
            <DynamicTicket userData={userData} />
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default TicketPage;

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
    delete userData.email;
    return getMetadata({
      ...SEO_DATA.ticket(userData),
      pathname: `/tickets/${userData.login}`,
      imagePath: buildOgImageUrl(userData),
    });
  }

  return getMetadata({ ...SEO_DATA['404-ticket'] });
}

export async function generateStaticParams() {
  const users = await prisma.user.findMany();

  return users.map((user) => ({
    handle: user.login,
  }));
}

export const revalidate = 0;
