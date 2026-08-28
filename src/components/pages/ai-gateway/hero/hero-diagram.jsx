import Image from 'next/image';
import PropTypes from 'prop-types';

import AlibabaIcon from 'images/pages/ai-gateway/hero/diagram/alibaba.svg';
import AnthropicIcon from 'images/pages/ai-gateway/hero/diagram/anthropic.svg';
import AppPreview from 'images/pages/ai-gateway/hero/diagram/app-preview.jpg';
import FlowArrow from 'images/pages/ai-gateway/hero/diagram/flow-arrow.svg';
import GoogleIcon from 'images/pages/ai-gateway/hero/diagram/google.svg';
import OpenAIIcon from 'images/pages/ai-gateway/hero/diagram/openai.svg';
import { cn } from 'utils/cn';

const SERVICES = ['Functions', 'Lakebase Postgres', 'AI Gateway', 'Storage', 'Auth'];

const PROVIDERS = [
  { name: 'OpenAI', icon: OpenAIIcon },
  { name: 'Alibaba', icon: AlibabaIcon, isCompact: true },
  { name: 'Google', icon: GoogleIcon },
  { name: 'Anthropic', icon: AnthropicIcon },
];

const BRANCHES = [
  { rowClass: 'row-start-1', isOuter: true },
  { rowClass: 'row-start-3' },
  { rowClass: 'row-start-5' },
  { rowClass: 'row-start-7', isOuter: true },
];

const HeroDiagram = ({ className }) => (
  <div
    className={cn('w-full overflow-hidden', className)}
    role="img"
    aria-label="A Neon backend routing AI Gateway requests to models from multiple providers"
  >
    <div className="[container-type:inline-size] aspect-[672/251] w-full sm:w-[115%] sm:translate-x-[-2.8%]">
      <div
        className="relative grid size-full grid-cols-[25.744cqw_7.738cqw_21.131cqw_18.601cqw_9.896cqw] items-center overflow-hidden bg-gray-new-8 bg-[repeating-linear-gradient(90deg,_#131415_0,_#131415_0.372cqw,_#161718_0.372cqw,_#161718_0.496cqw)] pr-[10.937cqw] pl-[5.952cqw] sm:grid-cols-[25.744cqw_7.738cqw_21.131cqw_14cqw_12cqw]"
        aria-hidden="true"
      >
        <div className="overflow-hidden border border-gray-new-20 bg-black-pure">
          <div className="grid h-[1.86cqw] grid-cols-3 items-center border-b border-gray-new-20 bg-gray-new-10 px-[0.5cqw]">
            <div className="flex gap-x-[0.3cqw]" aria-hidden="true">
              <span className="size-[0.5cqw] rounded-full bg-[#FF5A48]" />
              <span className="size-[0.5cqw] rounded-full bg-gray-new-20" />
              <span className="size-[0.5cqw] rounded-full bg-green-44" />
            </div>
            <span className="text-center text-[clamp(0.375rem,0.818cqw,0.6875rem)] leading-none whitespace-nowrap text-gray-new-98">
              https://my-app
            </span>
          </div>
          <Image
            className="block h-auto w-full"
            src={AppPreview}
            width={688}
            height={372}
            sizes="(max-width: 39.9375rem) calc(29.6056vw - 0.7401rem), (max-width: 47.9375rem) calc(25.744vw - 0.6436rem), (max-width: 63.9375rem) calc(25.744vw - 1.0298rem), 21.625rem"
            quality={100}
            alt=""
            loading="eager"
            draggable={false}
          />
        </div>

        <Image
          className="ml-[0.521cqw] h-[0.446cqw] w-[6.696cqw] max-w-none"
          src={FlowArrow}
          width={90}
          height={6}
          alt=""
          draggable={false}
          loading="eager"
        />

        <div className="grid h-[25.744cqw] grid-rows-5 gap-y-[0.595cqw] border border-dashed border-gray-new-40 bg-gray-new-15/50 p-[0.967cqw]">
          {SERVICES.map((service) => (
            <div
              className={cn(
                'flex items-center justify-center border border-gray-new-20 bg-black-pure text-[clamp(0.375rem,1.19cqw,1rem)] leading-none tracking-tighter text-gray-new-50 sm:text-[0.4375rem]',
                service === 'AI Gateway' && 'border-[#e4f1eb] bg-[#E4F1EB] text-gray-new-8'
              )}
              key={service}
            >
              {service}
            </div>
          ))}
        </div>

        <div className="grid h-[19.494cqw] grid-cols-[10.119cqw_8.482cqw] items-center sm:grid-cols-[7.6cqw_6.4cqw]">
          <span className="ml-[0.595cqw] h-px bg-gray-new-40" />
          <div className="grid h-full grid-cols-[0.595cqw_minmax(0,1fr)] grid-rows-[0_5.357cqw_0_5.357cqw_0_5.506cqw_0] py-[1.637cqw] pr-[0.595cqw]">
            <span className="col-start-1 row-start-1 row-end-8 w-full rounded-l-[0.4cqw] border-y border-l border-gray-new-40" />
            {BRANCHES.map(({ rowClass, isOuter }) => (
              <span
                className={cn(
                  'flex items-center',
                  rowClass,
                  isOuter ? 'col-start-2' : 'col-span-2 col-start-1'
                )}
                key={rowClass}
              >
                <span className="h-px min-w-0 flex-1 bg-gray-new-40" />
                <span className="h-[0.446cqw] w-[0.372cqw] shrink-0 bg-gray-new-40 [clip-path:polygon(0_0,100%_50%,0_100%)]" />
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-y-[2.232cqw]">
          {PROVIDERS.map(({ name, icon, isCompact }) => (
            <div
              className={cn(
                'flex h-[3.274cqw] w-[10cqw] items-center gap-x-[1.042cqw] border border-gray-new-20 bg-black-pure px-[1.19cqw] text-[clamp(0.375rem,1.19cqw,1rem)] leading-none tracking-tighter text-gray-new-80 sm:w-[13cqw] sm:text-[0.4375rem]',
                isCompact && 'h-[2.976cqw]'
              )}
              key={name}
            >
              <Image
                className="size-[1.786cqw] shrink-0"
                src={icon}
                width={24}
                height={24}
                alt=""
                draggable={false}
                loading="eager"
              />
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

HeroDiagram.propTypes = {
  className: PropTypes.string,
};

export default HeroDiagram;
