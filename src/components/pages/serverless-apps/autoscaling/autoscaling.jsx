import clsx from 'clsx';

import Container from 'components/shared/container/container';
import GradientBorder from 'components/shared/gradient-border/index';
import PauseableVideo from 'components/shared/pauseable-video';
import LINKS from 'constants/links';

const Autoscaling = () => (
  <section className="autoscaling safe-paddings pt-40 xl:pt-[136px] lg:pt-[108px] md:pt-20">
    <Container className="flex flex-col items-center" size="960">
      <header className="flex w-full justify-between lg:gap-28 sm:flex-col sm:items-center sm:gap-4 sm:text-center">
        <h2 className="max-w-md font-title text-[48px] font-medium leading-[0.9] tracking-tighter xl:text-[44px] xl:leading-none lg:flex-1 lg:text-4xl sm:max-w-full sm:text-[32px]">
          Thousands of connections and real-time autoscaling
        </h2>
        <p
          className={clsx(
            'mt-1 max-w-md text-lg font-light leading-snug tracking-extra-tight text-gray-new-70 xl:font-normal xl:tracking-extra-tight lg:mt-0 lg:flex-1 lg:text-base sm:max-w-full',
            '[&_a:hover]:border-gray-new-70 [&_a]:border-b [&_a]:border-gray-new-70/40 [&_a]:transition-colors [&_a]:duration-300'
          )}
        >
          Neon autoscales CPU and memory in real time based on your workload. Our{' '}
          <a href={`${LINKS.blog}/architecture-decisions-in-neon`}>autoscaling algorithm</a>{' '}
          dynamically allocates compute resources, reducing your bill — you no longer need to
          provision for peak — while ensuring good performance.
        </p>
      </header>
      <div className="relative mt-10 w-full overflow-hidden rounded-[10px] bg-[#0A0A0A]">
        {/* 
          Recommended video omtimization parameters:
          mp4: -pix_fmt yuv420p -vf scale=1920:-2 -movflags faststart -vcodec libx264 -crf 20
          webm: -c:v libvpx-vp9 -crf 20 -vf scale=1920:-2 -deadline best -an
        */}
        <PauseableVideo
          className="relative z-10 [mask-image:linear-gradient(180deg,black_calc(100%-70px),transparent)]"
          width={960}
          height={384}
        >
          <source
            src="/videos/pages/serverless-apps/autoscaling.mp4?updated=20250227180000"
            type="video/mp4"
          />
          <source
            src="/videos/pages/serverless-apps/autoscaling.webm?updated=20250227180000"
            type="video/webm"
          />
        </PauseableVideo>
        <p
          className={clsx(
            'absolute bottom-0 left-0 z-10 max-w-[784px] text-pretty p-6 font-light tracking-extra-tight text-gray-new-80 lg:relative lg:max-w-[605px] md:p-5 sm:p-4 sm:text-sm',
            '[&_a:hover]:border-gray-new-70 [&_a]:border-b [&_a]:border-gray-new-70/40 [&_a]:transition-colors [&_a]:duration-300'
          )}
        >
          Neon integrates a pooler built on{' '}
          <a href="https://www.pgbouncer.org/" target="_blank" rel="noopener noreferrer">
            PgBouncer
          </a>{' '}
          directly into its architecture: every endpoint has connection pooling enabled. Supports up
          to 10,000 concurrent connections.
        </p>
        <div className="pointer-events-none absolute inset-0 hidden mix-blend-plus-lighter lg:block">
          <span className="absolute left-1/4 top-[40%] h-1/5 w-1/5 -rotate-[68deg] rounded-[100%] bg-[#355696] blur-3xl" />
          <span className="absolute bottom-4 left-4 h-3/4 w-[18%] -rotate-[68deg] rounded-[100%] bg-[#5452A3] opacity-20 mix-blend-plus-lighter blur-3xl" />
          <span className="absolute -top-[12%] right-[20%] h-3/4 w-[23%] -rotate-[68deg] rounded-[100%] bg-[#393749] blur-3xl" />
          <span className="absolute right-4 top-[12%] h-2/3 w-1/5 -rotate-[68deg] rounded-[100%] bg-[#3E486C] blur-3xl" />
          <span className="absolute -right-20 top-5 h-2/3 w-2/3 rounded-[100%] bg-[#667CA8] opacity-40 mix-blend-color-dodge blur-2xl xs:opacity-20" />
        </div>
        <GradientBorder withBlend />
      </div>
    </Container>
  </section>
);

export default Autoscaling;
