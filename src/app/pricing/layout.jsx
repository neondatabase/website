// eslint-disable-next-line react/prop-types
const PricingLayout = ({ children }) => (
  <>
    <head>
      <link
        rel="preload"
        crossOrigin="anonymous"
        href="/animations/pages/pricing/pricing.riv"
        as="fetch"
        media="(min-width: 1024px)"
      />
    </head>
    {children}
  </>
);

export default PricingLayout;
