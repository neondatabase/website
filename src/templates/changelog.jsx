/* eslint-disable react/prop-types */
import { graphql } from 'gatsby';
import React from 'react';

import ChangelogPostList from 'components/pages/changelog-content/changelog-post-list';
import Container from 'components/shared/container';
import Layout from 'components/shared/layout';
import Link from 'components/shared/link/link';
import SubscribeMinimalistic from 'components/shared/subscribe-minimalistic';
import { CHANGELOG_BASE_PATH } from 'constants/changelog';
import LINKS from 'constants/links';
import SEO_DATA from 'constants/seo-data';
import DiscordIcon from 'icons/subscribe-discord.inline.svg';
import GithubIcon from 'icons/subscribe-github.inline.svg';
import TwitterIcon from 'icons/subscribe-twitter.inline.svg';

import Heading from '../components/shared/heading/heading';

const links = [
  {
    icon: TwitterIcon,
    to: LINKS.twitter,
  },
  {
    icon: DiscordIcon,
    to: LINKS.discord,
  },
  {
    icon: GithubIcon,
    to: LINKS.github,
  },
];

const TITLE = 'Changelog';
const DESCRIPTION = 'Latest product updates by Neon’s team';

const ChangelogPage = ({
  data: {
    allMdx: { nodes },
  },
}) => (
  <Layout seo={{ ...SEO_DATA.changelog, pathname: CHANGELOG_BASE_PATH }} headerTheme="white">
    <Container size="sm" className="mb-10 border-b border-b-gray-4 pb-12 pt-48">
      <Heading size="md" tag="h3" theme="black">
        {TITLE}
      </Heading>
      <div className="flex justify-between ">
        <p className="mt-auto text-xl">{DESCRIPTION}</p>
        <ul className="flex space-x-[26px] 2xl:space-x-5 xl:space-x-[16px] lg:mt-3.5">
          {links.map(({ icon: Icon, to }, index) => (
            <li className="relative" key={index}>
              <span
                className="absolute -bottom-1.5 -left-1.5 h-full w-full rounded-full bg-secondary-5 xl:-bottom-1 xl:-left-1"
                aria-hidden
              />
              <Link
                className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full border-4 border-black bg-white transition-transform duration-200 hover:translate-y-1.5 hover:-translate-x-1.5 2xl:h-16 2xl:w-16 xl:h-14 xl:w-14"
                to={to}
              >
                <Icon className="h-8 xl:h-7" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Container>
    <ChangelogPostList items={nodes} />
    <SubscribeMinimalistic />
  </Layout>
);

export const query = graphql`
  query {
    allMdx(filter: { fileAbsolutePath: { regex: "/content/changelog/" } }) {
      nodes {
        slug
        body
        frontmatter {
          version
        }
      }
    }
  }
`;

export default ChangelogPage;
