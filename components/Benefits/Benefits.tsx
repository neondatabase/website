import React from 'react';
import Image from 'next/image';

import {Col, Container, Row } from 'react-bootstrap';

import startPic from '../../public/images/benefits_start.svg'
import branchPic from '../../public/images/benefits_branch.svg'

import styles from './Benefits.module.css';
import classnames from 'classnames';

export const Benefits = () => {
  return <section className={styles.container}>
    <Container>
      <Row className={styles.row}>
        <Col xs={6} className={classnames(styles.col_text, styles.col_left)}>
          <h2 className={styles.header}>Start building on Postgres in seconds</h2>
          <div className={styles.text}>Setup in {'<'}1 minute and create a <br/>
            Postgres endpoint instantly. Zenith <br/>
            removes the painful parts of setting <br/>
            up and managing your database  </div>
        </Col>
        <Col xs={6} className={classnames(styles.col_image, styles.col_right)}>
          <Image src={startPic} />
        </Col>
      </Row>
      <Row className={classnames(styles.row)}>
        <Col xs={6} className={classnames(styles.col_image, styles.col_left)}>
          <Image src={startPic} />
        </Col>
        <Col xs={6} className={classnames(styles.col_text, styles.col_right)}>
          <h2 className={styles.header}>Iterate fast</h2>
          <div className={styles.text}>
            Instantly create copy-on-write <br />
            branches of your database with one <br />
            command. Branch from now or a<br />
            historical point in time.
          </div>
        </Col>
      </Row>
    </Container>
  </section>
}