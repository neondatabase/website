import React from 'react';

const TITLE = 'Release Notes';
const DESCRIPTION = 'The latest product updates from Neon';

const Hero = () => (
  <div className="mb-12 border-b border-b-gray-4 pb-12 md:mb-10 sm:mb-7">
    <h1 className="t-5xl font-semibold">{TITLE}</h1>
    <p className="mt-3 text-xl">{DESCRIPTION}</p>
  </div>
);

export default Hero;
