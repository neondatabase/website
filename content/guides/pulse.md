---
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2024-12-17T00:00:00.000Z'
updatedOn: '2024-12-17T00:00:00.000Z'
title: Building a Real-Time AI Voice Assistant with ElevenLabs
subtitle: A step-by-step guide to building your own AI Voice Assistant in a Next.js application with ElevenLabs and Postgres
---

Imagine having an AI voice assistant like Iron Man's [J.A.R.V.I.S.](https://en.wikipedia.org/wiki/J.A.R.V.I.S.), capable of understanding and responding to your needs in real-time. In this guide, you will learn how to build your very own real-time AI voice assistant using ElevenLabs, store each conversation in a Postgres database, and index them for faster retrieval.

## Prerequisites

To follow along this guide, you will need the following:

- [Node.js 18](https://nodejs.org/en) or later
- A [Neon](https://console.neon.tech/signup) account
- A [Vercel](https://vercel.com) account

## Create a new Next.js application

Let’s get started by creating a new Next.js project with the following command:

```shell shouldWrap
pnpx create-next-app@latest pulse
```

When prompted, choose:

- `Yes` when prompted to use TypeScript.
- `No` when prompted to use ESLint.
- `Yes` when prompted to use Tailwind CSS.
- `No` when prompted to use `src/` directory.
- `Yes` when prompted to use App Router.
- `No` when prompted to use Turbopack for `next dev`.
- `No` when prompted to customize the default import alias (`@/*`).

Once that is done, move into the project directory and install the necessary dependencies with the following command:

```shell
cd pulse
pnpm add @11labs/client @neondatabase/serverless motion framer-motion react-feather sonner tailwind-merge tailwind-animate
pnpm add -D tsx
```

The libraries installed include:

- `@11labs/client`: A client library to interact with [ElevenLabs API](https://elevenlabs.io/api).
- `@neondatabase/serverless`: A library to connect and interact with Neon’s serverless Postgres database.
- `motion`: A library to create animations in React applications.
- `framer-motion`: A library for animations in React.
- `react-feather`: A collection of open-source icons for React.
- `sonner`: A notification library for React to display toast notifications.
- `tailwind-merge`: A utility for merging Tailwind CSS class names.
- `tailwind-animate`: A library that provides pre-defined animations for Tailwind CSS.

The development-specific libraries include:

- `tsx`: To execute and rebuild TypeScript efficiently.

## Setting Up a Serverless Postgres

To set up a serverless Postgres, go to the [Neon console](https://console.neon.tech/app/projects) and create a new project. Once your project is created, you will receive a connection string that you can use to connect to your Neon database. The connection string will look like this:

```bash
postgresql://<user>:<password>@<endpoint_hostname>.neon.tech:<port>/<dbname>?sslmode=require
```

Replace `<user>`, `<password>`, `<endpoint_hostname>`, `<port>`, and `<dbname>` with your specific details.

Use this connection string as an environment variable designated as `DATABASE_URL` in the `.env` file.

## Database Schema Setup

Create a file named `schema.tsx` at the root of your project directory with the following code:

```tsx
// File: schema.tsx

import { neon } from '@neondatabase/serverless'
import 'dotenv/config'

const createMessagesTable = async () => {
  if (!process.env.DATABASE_URL) throw new Error(`DATABASE_URL environment variable not found.`)
  const sql = neon(process.env.DATABASE_URL)
  try {
    await sql(`CREATE TABLE IF NOT EXISTS messages (created_at SERIAL, id TEXT PRIMARY KEY, session_id TEXT, content_type TEXT, content_transcript TEXT, object TEXT, role TEXT, status TEXT, type TEXT);`)
    await sql(`CREATE INDEX IF NOT EXISTS idx_session_created_at ON messages (session_id, created_at);`)
    console.log('Setup schema succesfully.')
  } catch (error) {
    console.error(error)
    console.log('Failed to set up schema.')
  }
}

createMessagesTable()
```

The code above defines an asynchronous function `createMessagesTable` that connects to a Neon serverless Postgres database using a connection string stored in the `DATABASE_URL` environment variable, creates a `messages` table if it doesn't already exist, and sets up an index on the `session_id` and `created_at` columns for faster retrievals.

## TODO

### Typing Effect

```tsx
// File: lib/useTypingEffect.ts

import { useEffect, useState } from 'react'

export const useTypingEffect = (text: string, duration: number = 50, isTypeByLetter = false) => {
  const [currentPosition, setCurrentPosition] = useState(0)
  const items = isTypeByLetter ? text.split('') : text.split(' ')
  useEffect(() => {
    setCurrentPosition(0)
  }, [text])
  useEffect(() => {
    if (currentPosition >= items.length) return
    const intervalId = setInterval(() => {
      setCurrentPosition((prevPosition) => prevPosition + 1)
    }, duration)
    return () => {
      clearInterval(intervalId)
    }
  }, [currentPosition, items, duration])
  return items.slice(0, currentPosition).join(isTypeByLetter ? '' : ' ')
}
```

TODO - describe

### Types

```tsx
// File: lib/types.ts

export type AIState = 'idle' | 'listening' | 'speaking'

export interface Props {
  onStartListening?: () => void
  onStopListening?: () => void
  isAudioPlaying?: boolean
  currentText: string
}
```

TODO - describe

### Message

```tsx
// File: components/Message.tsx

import { Cpu, User } from 'react-feather'

export default function ({ conversationItem }: { conversationItem: { role: string; formatted: { transcript: string } } }) {
  return (
    <div className="flex flex-row items-start gap-x-3 flex-wrap max-w-full">
      <div className="rounded border p-2 max-w-max">{conversationItem.role === 'user' ? <User /> : <Cpu />}</div>
      <div className="flex flex-col gap-y-2">{conversationItem.formatted.transcript}</div>
    </div>
  )
}
```

TODO - describe

### TextAnimation

```tsx
// File: components/TextAnimation.tsx

'use client'

import { AIState, Props } from '@/lib/types'
import { useTypingEffect } from '@/lib/useTypingEffect'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function AiTalkingAnimation({ onStartListening, onStopListening, isAudioPlaying, currentText }: Props) {
  const [aiState, setAiState] = useState<AIState>('idle')
  const animatedCurrentText = useTypingEffect(currentText, 20)
  const displayedText = useTypingEffect('Click the circle to start the conversation', 20)

  const handleCircleClick = () => {
    if (aiState === 'listening' || aiState === 'speaking') {
      onStopListening?.()
      setAiState('idle')
    } else if (!isAudioPlaying) {
      onStartListening?.()
      setAiState('listening')
    }
  }

  useEffect(() => {
    if (isAudioPlaying) setAiState('speaking')
    else if (aiState === 'speaking' && currentText) setAiState('listening')
  }, [isAudioPlaying])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="relative mb-8 cursor-pointer" onClick={handleCircleClick} role="button" aria-label={aiState === 'listening' ? 'Stop listening' : 'Start listening'}>
        <motion.div
          className="w-20 h-20 bg-gradient-to-br from-pink-500 to-violet-600 rounded-full flex items-center justify-center shadow-lg"
          animate={aiState === 'idle' ? { scale: [1, 1.1, 1] } : aiState === 'speaking' ? { scale: [1, 1.2, 0.8, 1.2, 1] } : {}}
          transition={{
            repeat: Infinity,
            ease: 'easeInOut',
            duration: aiState === 'speaking' ? 0.8 : 1.5,
          }}
        />
        {aiState === 'listening' && (
          <svg className="absolute top-1/2 left-1/2 w-24 h-24 -translate-x-1/2 -translate-y-1/2" viewBox="0 0 100 100">
            <motion.circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              strokeWidth="4"
              stroke="#8B5CF6"
              transition={{
                duration: 10,
                ease: 'linear',
                repeat: Infinity,
              }}
              strokeLinecap="round"
              initial={{ pathLength: 0, rotate: -90 }}
              animate={{ pathLength: 1, rotate: 270 }}
            />
          </svg>
        )}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <p className="text-gray-800 text-lg font-mono" aria-live="polite">
          {aiState === 'listening' ? 'Listening...' : aiState === 'speaking' ? animatedCurrentText : displayedText}
        </p>
        {aiState === 'idle' && (
          <motion.div
            animate={{
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="h-5 w-2 bg-violet-600 mt-2"
          />
        )}
      </div>
    </div>
  )
}
```

TODO - describe

## Deploy to Vercel

The repository is now ready to deploy to Vercel. Use the following steps to deploy:

- Start by creating a GitHub repository containing your app's code.
- Then, navigate to the Vercel Dashboard and create a **New Project**.
- Link the new project to the GitHub repository you've just created.
- In **Settings**, update the **Environment Variables** to match those in your local `.env` file.
- Deploy.

<DetailIconCards>

<a href="https://github.com/neondatabase-labs/pulse" description="A Real-Time AI Voice Assistant" icon="github">Pulse</a>

</DetailIconCards>

## Summary

TODO - In this guide, you learned how to build a real-time AI voice assistant using ElevenLabs and store conversations in a Postgres database.

<NeedHelp />
