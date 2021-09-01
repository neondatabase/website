import React from 'react';
import Image from 'next/image';
import classnames from 'classnames';

import {Col, Container, Row } from 'react-bootstrap';

import { BenefitsItem } from './BenefitsItem/BenefitsItem';

import storagePic from '../../public/images/benefits_storage.svg'
import postgresPic from '../../public/images/benefits_postgres.svg'
import compatiblePic from '../../public/images/benefits_compatible.svg'

import styles from './Benefits.module.css';

const BENEFITS = [
  {
    id: 'storage',
    icon: storagePic,
    header: 'Storage Engine Internals',
    description: <>
      On the surface Zenith is a single Postgres
      end point for your app. Internally we modified
      Postgres’s storage engine to use the the cloud
      <br/>
      <br/>
      <a href="">Learn more →</a>
    </>
  },
  {
    id: 'postgres',
    icon: postgresPic,
    header: 'Postgres is in our DNA',
    description: <>
      Zenith is developed by Postgres committers and
      contributors behind major contributions
      to the Postgres internal storage machinery
      <br/>
      <br/>
      <ul>
        <li>Bottom-up index deletion</li>
        <li>B-Tree deduplication</li>
        <li>UPSERT -- ON CONFLICT UPDATE</li>
        <li>Hot standby</li>
      </ul>
    </>
  },
  {
    id: 'compatible',
    icon: compatiblePic,
    header: 'Zenith is 100% Postgres Compatible',
    description: <>
      PostgreSQL functionality like
      full text search indexing, PostGIS, and
      extensions work automatically
      <br/>
      <br/>
      <a href="">Learn more →</a>
    </>
  },
]

export const Benefits = () => {
  return (
    <section className={styles.container}>
      <Container>
        {BENEFITS.map(h => <BenefitsItem key={h.id} {...h} />)}
      </Container>
    </section>)
}