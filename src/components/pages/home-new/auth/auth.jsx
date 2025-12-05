import Container from 'components/shared/container';
import PauseableVideo from 'components/shared/pauseable-video';

import Heading from '../heading';

const Auth = () => (
  <section
    className="auth safe-paddings relative scroll-mt-[60px] pb-60 xl:pb-40 lg:scroll-mt-0 lg:pb-32 md:pb-24"
    id="auth"
  >
    <Container
      className="relative grid grid-cols-[224px_1fr] items-center gap-x-32 before:block xl:grid-cols-1 xl:px-16 xl:before:hidden lg:!px-16 md:!px-5"
      size="1600"
    >
      <div className="min-w-0 border-t border-gray-new-20 pt-9 lg:pt-7">
        <Heading
          icon="auth"
          title="<strong>Better Auth, included free.</strong> Fully-featured auth that lives in your database and branches for full-stack preview environments."
        />

        {/*
          Video optimization parameters:
            mp4: ffmpeg -i auth-origin.mov -c:v libx265 -crf 26 -vf scale=2368:-2 -preset veryslow -tag:v hvc1 -movflags faststart -an auth.mp4
            webm: ffmpeg -i auth-origin.mov -c:v libvpx-vp9 -crf 40 -vf scale=2368:-2 -deadline best -an auth.webm
          */}
        <PauseableVideo
          className="relative mt-16 w-full xl:mt-12 lg:mt-10"
          width={1184}
          height={580}
          poster="/videos/pages/home-new/auth/poster.jpg"
          loop={false}
        >
          <source src="/videos/pages/home-new/auth/auth.mp4" type="video/mp4" />
          <source src="/videos/pages/home-new/auth/auth.webm" type="video/webm" />
        </PauseableVideo>
      </div>
    </Container>
  </section>
);

export default Auth;
