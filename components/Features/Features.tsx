import React  from 'react';
import Image from 'next/image';
import {Col, Container, Row } from 'react-bootstrap'
import classnames from 'classnames';

import { FeaturesItem } from './FeaturesItem/FeaturesItem';
import { Section } from '../Section/Section';


import styles from './FeaturesItem/FeaturesItem.module.css'

import serverlessPic from '../../public/images/features_serverless.svg'
import branchingPic from '../../public/images/features_branching.svg'
import availabilityPic from '../../public/images/features_availability.svg'
import deploymentPic from '../../public/images/features_deployment.svg'
import storagePic from '../../public/images/features_storage.svg'
import provenancePic from '../../public/images/features_provenance.svg'
import limitsPic from '../../public/images/features_limits.svg'
import opensourcePic from '../../public/images/features_opensource.svg'

const FEATURES = [
  {
    id: 'serverless',
    icon: serverlessPic,
    header: 'Serverless',
    description: <>
      Create a Postgres endpoint instantly and pay only for what you use on Zenith
      <br/><br/>Resources are automatically scaled based on workload
    </>
  },
  {
    id: 'branching',
    icon: branchingPic,
    header: 'Instant branching',
    description: 'Instantly branch your data from now or a historical point in time'
  },
  {
    id: 'availability',
    icon: availabilityPic,
    header: 'High availability',
    description: 'HA for Postgres out of the box '
  },
  {
    id: 'deployment',
    icon: deploymentPic,
    header: 'Edge deployment',
    description: 'Your data lives close to your users'
  },
  {
    id: 'storage',
    icon: storagePic,
    header: 'Bottomless storage',
    description: 'Your data is continuously and automatically backed up to cloud storage'
  },
  {
    id: 'limits',
    icon: limitsPic,
    header: 'High connection limits',
    description: 'High connection limits for Postgres out of the box '
  },
  {
    id: 'provenance',
    icon: provenancePic,
    header: 'Data provenance',
    description: 'Know the history of each record in your database'
  },
  {
    id: 'open_source',
    icon: opensourcePic,
    header: 'Open source',
    description: 'Zenith is built in the open on GitHub'
  },
]

export const Features = () => {
  return (
    <Section>
      <h1 className={styles.title}>
        Features
      </h1>
      <Row>
        {FEATURES.map(f => (
          <Col xs={3} key={f.id}>
            <FeaturesItem {...f} />
          </Col>
        ))}
      </Row>
   </Section>
  )
};
