import Image from 'next/image';

import Container from 'components/shared/container';
import { aiGatewayPageContent } from 'constants/backend-platform-page-content';
import fairPricingImage from 'images/pages/ai-gateway/gateway-benefits/fair-pricing.jpg';
import simplifiedBillingImage from 'images/pages/ai-gateway/gateway-benefits/simplified-billing.jpg';
import unifiedAccessImage from 'images/pages/ai-gateway/gateway-benefits/unified-access.jpg';

const ITEM_IMAGES = {
  'unified-access': unifiedAccessImage,
  'simplified-billing': simplifiedBillingImage,
  'fair-pricing': fairPricingImage,
};

const { gatewayBenefits } = aiGatewayPageContent;

const GatewayBenefits = () => (
  <section className="gateway-benefits pt-40 safe-paddings pb-20 xl:pt-32 xl:pb-16 lg:pt-24 lg:pb-12 md:pt-20 md:pb-10">
    <Container size="1344">
      <h2 className="max-w-280 text-[3rem] leading-[1.125] tracking-tighter text-pretty xl:max-w-232 xl:text-[2.5rem] xl:leading-[1.08] lg:max-w-192 lg:text-[2.25rem] md:text-[2rem]">
        {gatewayBenefits.title}{' '}
        <span className="text-gray-new-50">{gatewayBenefits.highlightedTitle}</span>
      </h2>

      <ul className="mt-18 flex flex-col gap-y-21.75 lg:mt-12 lg:gap-y-16">
        {gatewayBenefits.items.map(({ id, label, title, description }) => (
          <li
            className="grid grid-cols-[16rem_minmax(0,1fr)] xl:grid-cols-[12rem_minmax(0,1fr)] lg:flex lg:flex-col [&:last-child]:mt-1.25 md:[&:last-child]:mt-0"
            key={id}
          >
            <span className="pt-12 text-[1.25rem] leading-tight tracking-extra-tight text-gray-new-60 lg:pt-0 lg:pb-4 lg:text-[1.125rem] md:pb-0 md:text-base">
              {label}
            </span>

            <div className="grid grid-cols-[26rem_minmax(0,1fr)] justify-between gap-x-16 border-t border-gray-new-15 pt-9.75 xl:grid-cols-[24rem_minmax(0,1fr)] xl:gap-x-12 lg:grid-cols-2 lg:gap-x-8 md:grid-cols-1 md:border-0 md:pt-2">
              <div>
                <h3 className="max-w-104 text-[2rem] leading-snug tracking-tighter text-pretty xl:text-[1.75rem] md:text-[1.5rem]">
                  {title}
                </h3>
                <p className="mt-2.5 max-w-104 text-[1.25rem] leading-normal tracking-extra-tight text-pretty text-gray-new-70 xl:text-[1.125rem] md:mt-2 md:max-w-120 md:text-base">
                  {description}
                </p>
              </div>

              <Image
                className="h-auto w-full md:mt-8"
                src={ITEM_IMAGES[id]}
                width={1216}
                height={848}
                sizes="(max-width: 47.9375rem) calc(100vw - 2.5rem), (max-width: 63.9375rem) 30rem, 38rem"
                quality={100}
                alt=""
              />
            </div>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default GatewayBenefits;
