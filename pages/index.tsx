import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import {Col, Container, Row } from 'react-bootstrap'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Zenith</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.intro}>
        <Container>
          <Row>
            <Col xs={6}>
              <div className={styles.introHeader}>
                Serverless
                PostgreSQL
              </div>
              <div className={styles.introDesc}>
                Zenith is a simplified Postgres db service
                built by Postgres committers
                for every app developer
              </div>
            </Col>
            <Col xs={6}></Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default Home
