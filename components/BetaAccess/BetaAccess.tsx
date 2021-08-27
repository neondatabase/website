import React from 'react';
import Image from 'next/image';

import {Col, Container, Row } from 'react-bootstrap';

import styles from './BetaAccess.module.css';
import { BetaAccessButton } from '../BetaAccessButton/BetaAccessButton';

export const BetaAccess = () => {
  return <section className={styles.container}>
    <Container>
      <h2 className={styles.header}>Start building on Postgres  in seconds</h2>
      <div>
        <BetaAccessButton />
      </div>
    </Container>
  </section>
}