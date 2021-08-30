import React from 'react';
import { Container } from 'react-bootstrap';

import styles from './PageTitle.module.css';

interface PageTitleProps {
  header: React.ReactNode,
  subheader?: React.ReactNode,
}

export const PageTitle = ({header, subheader}: PageTitleProps) => {
  return <section className={styles.container}>
    <Container>
      <h1 className={styles.header}>{header}</h1>
      {subheader &&
        <div className={styles.subheader}>{subheader}</div>
      }
    </Container>
  </section>
}