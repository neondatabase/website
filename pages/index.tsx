import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'

import {Intro} from '../components/Intro/Intro'
import { Features } from '../components/Features/Features'
import { Community } from '../components/Community/Community'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Zenith</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Intro />
      <Features />
      <Community />
    </>
  )
}

export default Home
