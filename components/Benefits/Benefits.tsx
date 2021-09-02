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
      Postgres’s storage engine to use the the cloud.
      <br/>
      <br/>
      <a href="">Learn more&nbsp;&nbsp;&nbsp;→</a>
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
        <li><a href="https://www.postgresql.org/docs/14/btree-implementation.html#BTREE-DELETION">Bottom-up index deletion</a></li>
        <li><a href="https://blog.discourse.org/2021/04/standing-on-the-shoulders-of-a-giant-elephant/">B-Tree deduplication</a></li>
        <li><a href="https://www.postgresql.org/docs/current/sql-insert.html#SQL-ON-CONFLICT">UPSERT -- ON CONFLICT UPDATE</a></li>
        <li><a href="https://www.postgresql.org/docs/14/hot-standby.html">Hot standby</a></li>
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
      <a href="">Learn more&nbsp;&nbsp;&nbsp;→</a>
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