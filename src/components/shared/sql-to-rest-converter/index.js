import dynamic from 'next/dynamic';

const DynamicComponentWithNoSSR = dynamic(() => import('./sql-to-rest-converter'), {
  ssr: false,
});

export default DynamicComponentWithNoSSR;
