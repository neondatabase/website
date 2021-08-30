import React from 'react';
import {Col, Row } from 'react-bootstrap';
import { Person, PersonProps } from './Person/Person';

interface PeopleProps {
  data: PersonProps[]
}

export const People = ({data}: PeopleProps) => {
  return <Row>
    {data.map(person => (
      <Col xs={4} key={person.name}>
        <Person {...person} />
      </Col>))}
  </Row>
};