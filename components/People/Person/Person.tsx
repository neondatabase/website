import React from 'react';

import styles from './Person.module.css';

export interface PersonProps {
  name: string;
  position?: string;
  // image?: string;
}

export const Person = ({name, position}: PersonProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.image}></div>
      <div className={styles.name}>{name}</div>
      <div className={styles.position}>{position}</div>
    </div>
  )
};