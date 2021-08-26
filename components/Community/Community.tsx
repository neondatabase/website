import React  from 'react';
import Image from 'next/image';
import {Col, Container, Row } from 'react-bootstrap'
import classnames from 'classnames';

import discordPic from "../../public/images/discord_logo_color.svg"
import twitterPic from "../../public/images/twitter_logo_color.svg"

import styles from './Community.module.css';

export const Community = () => {
  return (
    <section className={styles.container}>
      <div className={styles.bg}>
        <Container>
          <h2 className={styles.header}>Join the community</h2>
          <div className={styles.text}>
            Interact with the team building Zenith and <br />
            devs building apps on Zenith
          </div>
          <div className={styles.links}>
            <a href="#" className={styles.linksItem}>
              <Image src={discordPic} />
            </a>
            <a href="#" className={styles.linksItem}>
              <Image src={twitterPic} />
            </a>
          </div>
        </Container>
      </div>
    </section>
  )
};
