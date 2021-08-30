import classnames from 'classnames';
import React from 'react';
import { Container } from 'react-bootstrap';

import styles from './Section.module.css';

interface SectionProps
  extends React.HTMLAttributes<HTMLElement> {
  header?: React.ReactNode;
  article?: boolean;
}

export const Section = ({header, children, article, ...props}: React.PropsWithChildren<SectionProps>) => {
  return <section className={classnames(props.className, styles.container, {
    [styles.article]: article,
  })}>
    <Container>
      {header &&
        <h2 className={styles.header}>
          {header}
        </h2>
      }
      {children}
    </Container>
  </section>
}