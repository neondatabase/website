import React  from 'react';
import Image from 'next/image';
import {Col, Container, Row } from 'react-bootstrap'
import classnames from 'classnames';

import styles from './FeaturesItem.module.css';

interface FeaturesItemProps {
  id: string;
  header: string;
  description: React.ReactNode;
}

export const FeaturesItem = ({header, description}: FeaturesItemProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}></div>
      <div className={styles.header}>{header}</div>
      <div className={styles.description}>{description}</div>
    </div>
  )
};
