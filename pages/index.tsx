import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'

import {Intro} from '../components/Intro/Intro'
import { Features } from '../components/Features/Features'
import { Community } from '../components/Community/Community'
import { Benefits } from '../components/Benefits/Benefits'
import { Highlights } from '../components/Highlights/Highlights'
import { BetaAccess } from '../components/BetaAccess/BetaAccess'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Zenith</title>
      </Head>
      <Intro />
      <Features />
      <Highlights />
      <Community />
      <Benefits />
      <BetaAccess />
    </>
  )
}

export default Home
