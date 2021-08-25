import React, { PropsWithChildren } from 'react';
import Image from 'next/image';
import {Col, Container, Row } from 'react-bootstrap'
import classnames from 'classnames';

import {ExternalLinks} from '../../config/externalLinks'
import {Header} from '../Header/Header'
import {Footer} from '../Footer/Footer'

import headerLogoPic from '../../public/images/header_logo.svg'
import discordLogoPic from '../../public/images/discord_logo_black.svg'

import styles from './Layout.module.css';

export const Layout = ({children}: PropsWithChildren<{}>) => {
  return <div className={styles.layout}>
    <Header />
    <main className={styles.main}>
      {children}
    </main>
    <Footer />
  </div>
};
