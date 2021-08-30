import React  from 'react';
import Image from 'next/image';
import {Col, Container, Row } from 'react-bootstrap'
import classnames from 'classnames';

import styles from './FeaturesItem.module.css';

interface FeaturesItemProps {
  id: string;
  icon: any;
  header: string;
  description: React.ReactNode;
}

export const FeaturesItem = ({header, description, icon}: FeaturesItemProps) => {
  return (
    <div className={styles.container}>
      {icon && <div className={styles.icon}>
        <Image src={icon} layout="responsive" alt="" />
      </div>}
      <div className={styles.header}>{header}</div>
      <div className={styles.description}>{description}</div>
    </div>
  )
};
