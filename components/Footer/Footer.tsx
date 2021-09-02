import React, { PropsWithChildren } from 'react';
import Image from 'next/image';
import Link from 'next/link'
import {Col, Container, Row } from 'react-bootstrap'
import classnames from 'classnames';

import {ExternalLinks} from '../../config/externalLinks'

import logoPic from '../../public/images/zenith_logo.svg'
import discordLogoPic from '../../public/images/discord_logo_black.svg'
import githubLogoPic from '../../public/images/github_logo_black.svg'

import styles from './Footer.module.css';

export const Footer = ({children}: PropsWithChildren<{}>) => {
  return (
    <footer className={styles.container}>
      <Container>
        <Row>
          <Col xs={6} className={styles.colLeft}>
            <div className={styles.logo}>
              <Image src={logoPic} alt="Zenith logo"/>
            </div>
            <div className={styles.footerSocial}>
              <div className={styles.footerSocialItem}>
                <Link href={ExternalLinks.Repo}>
                  <a>
                    <Image src={githubLogoPic} width={24} height={24} alt="Github repo"/>
                  </a>
                </Link>
              </div>
              <div className={styles.footerSocialItem}>

                <Link  href={ExternalLinks.DiscordServerInvite}>
                  <a>
                    <Image src={discordLogoPic} width={24} height={24} alt="Join our community in discord"/>
                  </a>
                </Link>
              </div>
            </div>
          </Col>
          <Col xs={6} className={styles.colRight}>
            <div className={styles.nav}>
              <div className={styles.navHeader}>Product</div>
              <div className={styles.navItem}>
                <a href="#">Features</a>
              </div>
              <div className={styles.navItem}>
                <a href="#">Pricing</a>
              </div>
            </div>
            <div className={styles.nav}>
              <div className={styles.navHeader}>Developers</div>
              <div className={styles.navItem}>
                <a href="#">Documentation</a>
              </div>
              <div className={styles.navItem}>
                <a href="#">API Reference</a>
              </div>
              <div className={styles.navItem}>
                <a href="#">Guides</a>
              </div>
            </div>
            <div className={styles.nav}>
              <div className={styles.navHeader}>Company</div>
              <div className={styles.navItem}>
                <Link href="/about">
                  <a>About</a>
                </Link>
              </div>
              <div className={styles.navItem}>
                <a href="#">Join Us</a>
              </div>
              <div className={styles.navItem}>
                <a href="#">Blog</a>
              </div>
            </div>
          </Col>
        </Row>
        <Row className={styles.companyInfo}>
          <Col xs={6} className={styles.colLeft}>
            <span className={styles.companyInfoItem}>© 2021 Zenith Labs Inc. All rights reserved.</span>
          </Col>
          <Col xs={6} className={styles.colRight}>
            <a href="#" className={styles.companyInfoItem}>Terms and Conditions</a>
            <a href="#" className={styles.companyInfoItem}>Privacy Policy</a>
          </Col>
        </Row>
      </Container>
    </footer>)
};
