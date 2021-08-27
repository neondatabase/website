import React, { PropsWithChildren } from 'react';
import Image from 'next/image';
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
              <a className={styles.footerSocialItem}>
                <Image src={githubLogoPic} width={24} height={24} alt="Github repo"/>
              </a>
              <a className={styles.footerSocialItem}>
                <Image src={discordLogoPic} width={24} height={24} alt="Join our community in discord"/>
              </a>
            </div>
          </Col>
          <Col xs={6} className={styles.colRight}>
            <div className={styles.nav}>
              <div className={styles.navHeader}>Product</div>
              <div className={styles.navItem}>
                <a href="#">Features</a>
              </div>
              <div className={styles.navItem}>
                <a href="#">Features</a>
              </div>
            </div>
            <div className={styles.nav}>
              <div className={styles.navHeader}>Product</div>
              <div className={styles.navItem}>
                <a href="#">Features</a>
              </div>
              <div className={styles.navItem}>
                <a href="#">Features</a>
              </div>
            </div>
            <div className={styles.nav}>
              <div className={styles.navHeader}>Product</div>
              <div className={styles.navItem}>
                <a href="#">Features</a>
              </div>
              <div className={styles.navItem}>
                <a href="#">Features</a>
              </div>
            </div>
          </Col>
        </Row>
        <Row className={styles.companyInfo}>
          <Col xs={6} className={styles.colLeft}>
            <span className={styles.companyInfoItem}>© 2021 Zenith Labc Inc. All rights reserved.</span>
          </Col>
          <Col xs={6} className={styles.colRight}>
            <a href="#" className={styles.companyInfoItem}>Terms and Conditions</a>
            <a href="#" className={styles.companyInfoItem}>Privacy Policy</a>
          </Col>
        </Row>
      </Container>
    </footer>)
};
