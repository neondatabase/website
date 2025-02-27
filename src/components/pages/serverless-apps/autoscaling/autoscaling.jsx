import Container from 'components/shared/container/container';
import PauseableVideo from 'components/shared/pauseable-video';

const Autoscaling = () => (
  <section className="autoscaling safe-paddings pt-40 xl:pt-[136px] lg:pt-[104px] md:pt-20">
    <Container className="flex flex-col items-center" size="960">
      <header className="flex w-full justify-between lg:gap-28 sm:flex-col sm:items-center sm:gap-4 sm:text-center">
        <h2 className="max-w-md font-title text-[48px] font-medium leading-[0.9] tracking-tighter xl:text-[44px] xl:leading-none lg:flex-1 lg:text-4xl sm:max-w-full sm:text-[32px]">
          Thousands of connections and real-time autoscaling
        </h2>
        <p className="mt-1 max-w-md text-lg font-light leading-snug tracking-extra-tight text-gray-new-70 xl:font-normal xl:tracking-extra-tight lg:mt-0 lg:flex-1 lg:text-base sm:max-w-full">
          Neon autoscales CPU and memory in real time based on your workload. Our autoscaling
          algorithm dynamically allocates compute resources, reducing your bill — you no longer need
          to provision for peak — while ensuring good performance.
        </p>
      </header>
      <div className="relative mt-10 w-full">
        {/* 
          Recommended video omtimization parameters:
          mp4: -pix_fmt yuv420p -vf scale=1920:-2 -movflags faststart -vcodec libx264 -crf 20
          webm: -c:v libvpx-vp9 -crf 20 -vf scale=1920:-2 -deadline best -an
        */}
        <PauseableVideo className="" width={960} height={384}>
          <source src="/videos/pages/serverless-apps/autoscaling.mp4" type="video/mp4" />
          <source src="/videos/pages/serverless-apps/autoscaling.webm" type="video/webm" />
        </PauseableVideo>
        <p className="absolute bottom-0 left-0 max-w-[784px] p-6 font-light tracking-extra-tight text-gray-new-80 lg:relative lg:mt-4 lg:p-0">
          Neon integrates a pooler built on PgBouncer directly into its architecture: every endpoint
          has connection pooling enabled. Connections scale automatically with traffic up to 10,000
          concurrently.
        </p>
      </div>
    </Container>
  </section>
);

export default Autoscaling;
