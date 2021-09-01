import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'

import {Intro} from '../components/Intro/Intro'
import { Features } from '../components/Features/Features'
import { Community } from '../components/Community/Community'
import { Benefits } from '../components/Benefits/Benefits'
import { Highlights } from '../components/Highlights/Highlights'
import { BetaAccess } from '../components/BetaAccess/BetaAccess'
import { PageTitle } from '../components/PageTitle/PageTitle'
import { Section } from '../components/Section/Section'
import { PersonProps } from '../components/People/Person/Person'
import { People } from '../components/People/People'

const LEADERSHIP: PersonProps[] = [
  {
    name: "Nikita Shamgunov",
    position: "co-founder"
  },
  {
    name: "Heikki Linnakangas",
    position: "co-founder"
  },
  {
    name: "Stas Kelvich",
    position: "co-founder"
  },
];

const BOARD: PersonProps[] = [
  {
    name: "Leigh Marie Braswell",
    position: "Founders Fund",
  },
  {
    name: "Quentin Clark",
    position: "General Catalyst",
  },
  {
    name: "Sven Strohband",
    position: "Kholsa Ventures",
  },
  {
    name: "Keith Rabois",
    position: "Founders Fund",
  },
  {
    name: "Elad Gil",
  },
]

const About: NextPage = () => {
  return (
    <>
      <Head>
        <title>About zenith</title>
      </Head>
      <PageTitle
        header="About Zenith"
        subheader="Zenith builds a simplified Postgres database service for every app developer"
      />
      <Section
        header="Leadership"
      >
        <People data={LEADERSHIP} />
      </Section>
      <Section
        header="Board of Directors"
      >
        <People data={BOARD} />
      </Section>
      <Section
        header="Investors"
        article
      >
        <p>Founders Fund (
          <a
            href="https://foundersfund.com/"
            target="_blank"
            rel="noreferrer"
          >https://foundersfund.com/</a>)</p>
        <p>Khosla Ventures (
          <a
            href="https://www.khoslaventures.com/"
            target="_blank"
            rel="noreferrer"
          >https://www.khoslaventures.com/</a>)</p>
        <p>General Catalyst (
          <a
            href="https://www.generalcatalyst.com/"
            target="_blank"
            rel="noreferrer"
          >https://www.generalcatalyst.com/</a>)</p>
        <br/>
        <br/>
        <p>Elad Gil</p>
        <p>Guillermo Rauch (vercel founder)</p>
        <p>Jordan Walke (creator of react)</p>
        <p>Mathias Biilmann (netlify co-founder)</p>
        <p>Alex Skidanov (near protocol co-founder)</p>
        <p>Oleg Rogynskyy (people.ai founder)</p>
        <p>Neha Narkhede (confluent co-founder)</p>
        <p>Tristan Handy (dbt founder)</p>
        <p>Brian Bayun (khosla ventures)</p>
        <p>Ajeet Singh (thoughtspot founder, nutanix founder)</p>
        <p>Deon Nicholas (forethought.ai co-founder)</p>
        <p>Ryan Noon (material security co-founder)</p>
        <p>Peter Zaitsev (percona co-founder)</p>
        <p>John Bicket (meraki co-founder, samsara cto)</p>
        <p>Shishir Mehrota (coda co-founder)</p>
        <p>Victor Orlovski</p>
        <p>Simon Turklj</p>
        <p>Neal Wu</p>

      </Section>
    </>
  )
}

export default About
