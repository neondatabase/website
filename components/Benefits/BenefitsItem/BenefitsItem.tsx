import React from 'react';
import Image from 'next/image';
import classnames from 'classnames';

import {Col, Container, Row } from 'react-bootstrap';

import styles from './BenefitsItem.module.css';

interface BenefitsItemProps {
  icon: any;
  header: string;
  description: React.ReactNode;
}

export const BenefitsItem = ({header, description, icon}: BenefitsItemProps) => {
  return (
    <Row className={styles.container}>
      <Col xs={{span: 8, offset: 2}}>
        <div className={styles.icon}>
          <Image src={icon} alt="" />
        </div>
        <h2 className={styles.header}>{header}</h2>
        <div className={styles.text}>{description}</div>
      </Col>
    </Row>
  )
}