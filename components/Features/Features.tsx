import React  from 'react';
import Image from 'next/image';
import {Col, Container, Row } from 'react-bootstrap'
import classnames from 'classnames';

import { FeaturesItem } from './FeaturesItem/FeaturesItem';
import { Section } from '../Section/Section';

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
      Create a Postgres endpoint in seconds and pay only for what you use on Zenith
      <br/>Resources are automatically scaled based on workload
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
    header: 'High Availability',
    description: 'HA for Postgres out of the box '
  },
  {
    id: 'deployment',
    icon: deploymentPic,
    header: 'Edge Deployment',
    description: 'Your data lives close to your users'
  },
  {
    id: 'storage',
    icon: storagePic,
    header: 'Bottomless Storage',
    description: 'Your data is continuously and automatically backed up to cloud storage'
  },
  {
    id: 'provenance',
    icon: provenancePic,
    header: 'Data Provenance',
    description: 'Know the history of each record in your database'
  },
  {
    id: 'limits',
    icon: limitsPic,
    header: 'High Connection Limits',
    description: 'High connection limits for Postgres out of the box '
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
    <Section
      header="Features"
    >
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
