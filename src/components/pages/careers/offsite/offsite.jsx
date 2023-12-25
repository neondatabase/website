import YoutubeIframe from 'components/pages/doc/youtube-iframe';
import Container from 'components/shared/container';

const Offsite = () => (
  <section className="offsite safe-paddings mt-32 bg-gray-new-98 py-32 2xl:mt-28 2xl:py-28 xl:mt-20 xl:py-20 lg:mt-16 lg:py-16">
    <Container className="grid grid-cols-12 items-center gap-x-10 lg:grid-cols-1" size="md">
      <div className="relative col-span-6 col-start-2 max-w-[750px] before:absolute before:-bottom-4 before:-right-4 before:h-full before:w-full before:rounded-md before:bg-secondary-3 3xl:col-start-1 lg:order-1 lg:col-span-full lg:mt-8 lg:max-w-none md:before:-bottom-3 md:before:-right-3">
        <YoutubeIframe
          className="rounded-md"
          embedId="ieGjj-f0Br0?si=zbG2CrxbM1bGwdC2"
          isDocPost={false}
        />
      </div>
      <div className="col-span-4 -ml-10 3xl:col-span-5 3xl:col-start-8 lg:col-span-full lg:ml-0">
        <h2 className="text-5xl font-bold leading-dense 2xl:text-[36px] xl:text-3xl lg:text-center lg:text-[36px] md:text-[32px]">
          Explore our team’s offsite journey in Barcelona
        </h2>
        <div className="mt-8 space-y-5 text-xl 2xl:mt-7 2xl:text-lg xl:mt-6 xl:space-y-4 xl:text-base lg:mx-auto lg:max-w-2xl lg:text-center lg:text-lg sm:space-y-3 sm:text-base">
          <p>
            Join us on a visual tour through our offsite gathering in Barcelona, explore the best
            moments, thrilling activities, and bonding experiences.
          </p>
          <p>
            Every frame showcases our culture, serving as a testament to our collaborative spirit
            that propels us toward greater heights.
          </p>
          <p>
            Discover the heart of our team away from the office and get a glimpse into our vibrant
            corporate culture.
          </p>
        </div>
      </div>
    </Container>
  </section>
);

export default Offsite;
