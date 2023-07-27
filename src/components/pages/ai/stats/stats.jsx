import Image from 'next/image';

import Container from 'components/shared/container/container';

import githubBg from './images/github-bg.png';
import github from './images/github.svg';
import hnswBg from './images/hnsw-bg.png';
import scaleBg from './images/scale-bg.png';

const Stats = () => (
  <section className="stats safe-paddings mt-40">
    <Container className="grid grid-cols-12" size="medium">
      <div className="col-span-full flex flex-col items-center">
        <span className="relative before:absolute before:inset-0 before:z-10 before:rounded-[40px] before:bg-black-new after:absolute after:-inset-px after:rounded-[40px] after:bg-[linear-gradient(180deg,rgba(0,229,153,0.2)20%,rgba(0,229,153,0.6)100%)]">
          <span className="relative z-20 block rounded-[40px] bg-[linear-gradient(180deg,rgba(0,229,153,0.00)0%,rgba(0,229,153,0.10)100%)] px-[13px] py-1.5 text-sm font-medium leading-none tracking-extra-tight text-green-45">
            Fast and Accurate
          </span>
        </span>
        <h2 className="mt-5 max-w-[708px] text-center text-5xl font-medium leading-none">
          Scale your AI apps to millions of rows with Neon
        </h2>
      </div>
      <div className="col-span-10 col-start-2 mt-12 grid grid-cols-[287px_auto_287px] gap-x-7">
        <div className="grid gap-y-7">
          <div className="relative flex flex-col items-center overflow-hidden rounded-xl bg-gray-new-8 pb-[30px] pt-5">
            <Image
              className="absolute left-1/2 top-1/2 h-full w-auto -translate-x-1/2 -translate-y-1/2 rounded-xl"
              src={githubBg}
              width={287}
              height={202}
              alt=""
            />
            <img
              className="relative z-10"
              src={github}
              width={120}
              height={120}
              alt=""
              loading="lazy"
            />
            <span className="relative z-10 mt-3.5 text-lg font-medium leading-none">
              Fully open-source
            </span>
          </div>
          <div className="relative overflow-hidden rounded-xl bg-gray-new-8 py-[38px]">
            <Image
              className="absolute inset-0 rounded-xl"
              src={scaleBg}
              width={287}
              height={257}
              alt=""
            />
            <div className="relative z-10 flex flex-col items-center justify-center ">
              <span className="text-2xl leading-none">Scales to</span>
              <span className="text-[112px] font-semibold leading-none tracking-[-0.08em] text-green-45">
                1M+
              </span>
              <span className="text-[32px] leading-none tracking-extra-tight text-green-45">
                rows
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-7">
          <div className="rounded-xl bg-gray-new-8 px-6">
            <h3 className="text-20 pb-5 pt-4 text-xl leading-none tracking-extra-tight">
              Explore the lates release of pg_embedding
            </h3>
            <div className="border-t border-dashed border-gray-new-15 pb-7 pt-6">
              <p className="text-[13px] uppercase leading-none tracking-wider text-gray-new-50">
                Query execution time (ms) at 99% recall
              </p>
              <div className="mt-5 flex items-center space-x-2.5">
                <span className="inline-block h-8 w-[17.5%] rounded bg-[linear-gradient(90deg,rgba(0,229,153,0.20)0%,#00E599_67.45%,#4DFFC4_93.23%)]" />
                <span className="text-[13px] leading-none text-gray-new-90">1.9s</span>
              </div>
              <div className="mt-5 flex items-center space-x-2.5">
                <span className="inline-block h-8 w-[93%] rounded bg-[linear-gradient(90deg,rgba(255,255,255,0.20)0%,#FFF_100%)] opacity-60" />
                <span className="text-[13px] leading-none text-gray-new-90">10s</span>
              </div>
              <div className="mt-6 flex items-center space-x-5">
                <span className="flex items-center space-x-1.5 leading-none">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-45" />
                  <span>HNSW</span>
                </span>
                <span className="flex items-center space-x-1.5 leading-none">
                  <span className="inline-block h-2 w-2 rounded-full bg-white/60" />
                  <span>ivf-flat</span>
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-gray-new-8 px-7 pb-7 pt-6">
            <p className="text-[26px] font-light leading-snug tracking-extra-tight">
              The new pg_embedding extension brings{' '}
              <mark className="bg-transparent text-green-45">20x the speed</mark> for{' '}
              <mark className="bg-transparent text-green-45">99% accuracy</mark> to graph-based
              approximate nearest neighbor search in your Postgres databases.
            </p>
          </div>
        </div>
        <div className="grid grid-rows-2 gap-y-7">
          <div className="flex flex-col items-center rounded-2xl bg-[linear-gradient(225deg,#9FD_6.87%,#6FC_24.88%,#00E599_85.59%)] px-[52px] pb-10 pt-8 text-black-new">
            <span className="text-bg-clipped space-x-2 bg-[linear-gradient(180deg,#0C0D0D_19.17%,rgba(12,13,13,0.80)67.50%)] leading-none">
              <span className="text-[120px] font-medium tracking-[-0.08em]">20</span>
              <span className="text-[80px] font-bold">x</span>
            </span>
            <span className="mt-2 text-xl font-medium leading-none tracking-extra-tight">
              Faster than ivf-flat
            </span>
          </div>
          <div className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-gray-new-8">
            <Image
              className="absolute left-1/2 top-1/2 h-full w-auto -translate-x-1/2 -translate-y-1/2 rounded-2xl"
              src={hnswBg}
              width={287}
              height={236}
              alt=""
            />
            <span className="text-bg-clipped relative z-10 max-w-[127px] bg-[linear-gradient(180deg,#FFF_28.26%,#BFBFBF_100%)] text-center text-[44px] font-medium leading-[1.05] tracking-extra-tight">
              Uses HNSW
            </span>
          </div>
        </div>
      </div>
    </Container>
  </section>
);

export default Stats;
