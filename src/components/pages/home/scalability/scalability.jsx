import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import React from 'react';

import Container from 'components/shared/container';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';

const title = 'On Demand Scalability';
const text = {
  paragraph1:
    'Zenith compute node is a modified postgres instance which is used only to process data retrieved from the multi-tenant storage. Compute node is swift to start and can be reconfigured on the fly. Without any activity compute shuts down to save resources and will be started on any incoming connection.',
  paragraph2:
    'While compute node is a modified postgres it is still fully app-compatible with the vanilla postgres. And we are committed to bring back our changes back to the community.',
};
const linkName = "Explore Zenith's architecture";
const linkPath = '/';

const Scalability = () => {
  const { illustration } = useStaticQuery(graphql`
    query {
      illustration: file(relativePath: { eq: "pages/home/scalability/illustration.png" }) {
        childImageSharp {
          gatsbyImageData(width: 880)
        }
      }
    }
  `);
  return (
    <section className="mt-48">
      <Container>
        <div className="md:block grid grid-cols-12 gap-x-10 items-center">
          <div className="col-start-2 col-end-7">
            <Heading tag="h2" size="lg" theme="black">
              {title}
            </Heading>
            <div className="t-xl mt-8 max-w-[600px]">
              <p>{text.paragraph1}</p>
              <p className="mt-5">{text.paragraph2}</p>
            </div>
            <Link
              className="inline-block text-xl text-black font-semibold mt-6"
              to={linkPath}
              theme="underline-secondary-3"
            >
              {linkName}
            </Link>
          </div>
          <div className="col-span-6">
            <GatsbyImage
              // fix: shift the image to the left taking into account the shadow
              className="-ml-5"
              image={getImage(illustration)}
              alt="Black Friday Started!"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Scalability;
