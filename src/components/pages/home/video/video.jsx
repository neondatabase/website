import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';

import PlayIcon from './images/play.inline.svg';

const Video = () => (
  <section className="bg-black pt-80">
    <Container className="flex items-center space-x-[100px]">
      <div className="relative">
        <StaticImage className="max-w-[800px]" src="./images/cover.jpg" />
        <button className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-40 h-40 flex items-center justify-center rounded-full before:bg-[#00ace6] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-full before:mix-blend-multiply">
          <PlayIcon
            className="relative rounded-full"
            style={{ 'box-shadow': '0px 10px 20px rgba(26, 26, 26, 0.4)' }}
          />
        </button>
      </div>
      <div>
        <Heading className="max-w-[490px]" tag="h2" size="lg" theme="white">
          Distributed Database, Made Simple
        </Heading>
        <p className="max-w-[600px] t-xl mt-5 text-white">
          Go through our 5 minutes tutorials video and start using scalable, cost efficient database
          architecture for your project.
        </p>
      </div>
    </Container>
  </section>
);

export default Video;
