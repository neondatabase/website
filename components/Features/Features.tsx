import React  from 'react';
import Image from 'next/image';
import {Col, Container, Row } from 'react-bootstrap'
import classnames from 'classnames';

import styles from './Features.module.css';
import { FeaturesItem } from './FeaturesItem/FeaturesItem';

const FEATURES = [
  {
    id: 'serverless',
    header: 'Serverless',
    description: <>
      Create a Postgres endpoint in seconds and pay only for what you use on Zenith
      <br/>Resources are automatically scaled based on workload
    </>
  },
  {
    id: 'branching',
    header: 'Instant branching',
    description: 'Instantly branch your data from now or a historical point in time'
  }
]

export const Features = () => {
  return (
    <section className={styles.container}>
      <Container>
        <h2 className={styles.header}>Features</h2>
        <Row>
          {FEATURES.map(f => (
            <Col xs={3}>
              <FeaturesItem {...f} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
)
};
