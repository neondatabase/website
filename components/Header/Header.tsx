import React, { PropsWithChildren } from 'react';
import Image from 'next/image';
import {Col, Container, Row } from 'react-bootstrap'
import classnames from 'classnames';

import {ExternalLinks} from '../../config/externalLinks'

import logoPic from '../../public/images/zenith_logo.svg'
import discordLogoPic from '../../public/images/discord_logo_black.svg'
import githubLogoPic from '../../public/images/github_logo_black.svg'

import styles from './Header.module.css';
import Link from 'next/link';

export const Header = ({children}: PropsWithChildren<{}>) => {
  return (
    <header className={styles.container}>
      <Container>
        <Row className={styles.inner}>
          <Col xs={2} className={styles.logo}>
            <Link href="/">
              <a>
                <Image src={logoPic} alt="Zenith logo"/>
              </a>
            </Link>
          </Col>
          <Col xs={8}>
            <nav className={styles.nav}>
              <a href="#" className={styles.navItem}>Docs</a>
              <a href="#" className={styles.navItem}>Blog</a>
              <a href="#" className={styles.navItem}>Join us</a>
              <a href={ExternalLinks.Repo} className={classnames(styles.navItem, styles.navItemIcon)}>
                <Image src={githubLogoPic} alt="Github repo" width={24} height={24} />
              </a>
              <a href={ExternalLinks.DiscordServerInvite} className={classnames(styles.navItem, styles.navItemIcon)}>
                <Image src={discordLogoPic} alt="Join us in discord" width={24} height={24} />
              </a>
            </nav>
          </Col>
          <Col xs={2}>
            <a href="#" className={styles.consoleButton}>
              Console
            </a>
          </Col>
        </Row>
      </Container>
    </header>)
};
