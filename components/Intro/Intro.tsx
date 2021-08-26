import React  from 'react';
import Image from 'next/image';
import {Col, Container, Row } from 'react-bootstrap'
import classnames from 'classnames';

import vercelPic from '../../public/images/partner_vercel.svg'
import netlifyPic from '../../public/images/partner_netlify.svg'
import documentationPic from '../../public/images/documentation.svg'
import consoleIntroPic from '../../public/images/console_intro.svg'

import styles from './Intro.module.css';

export const Intro = () => {
  return (
    <section className={styles.container}>
      <Container>
        <Row>
          <Col xs={6}>
            <h1 className={styles.header}>
              Serverless
              PostgreSQL
            </h1>
            <div className={styles.description}>
              Zenith is a simplified Postgres db service
              built by Postgres committers
              for every app developer
            </div>
            <div className={styles.actions}>
              <a href="" className={classnames(styles.button, styles.button_primary)}>Beta access</a>
              <a href="" className={classnames(styles.button, styles.button_link)}>
                <span className={styles.buttonIcon}>
                  <Image src={documentationPic} alt="" />
                </span>
                Documentation
              </a>
            </div>
          </Col>
          <Col xs={6} className={styles.rightCol}>
            <Image src={consoleIntroPic} alt="" />
          </Col>
        </Row>
        <Row>
          <Col className={styles.partners} xs={6}>
            <pre className={styles.partnersHeader}>
              Designing with
            </pre>
            <div className={styles.partnersList}>
              <a href="#" className={styles.partnersItem}>
                <Image src={vercelPic} />
              </a>
              <a href="#" className={styles.partnersItem}>
                <Image src={netlifyPic} />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
};
