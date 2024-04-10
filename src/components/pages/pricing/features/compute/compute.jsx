import Image from 'next/image';

import Tooltip from 'components/shared/tooltip';
import compatibilityIcon from 'icons/ai/compatibility.svg';
import timerIcon from 'icons/landing/timer.svg';

import image from '../images/compute-illustration.svg';

const items = [
  {
    icon: compatibilityIcon,
    title: 'Serverless compute',
    text: 'Compute size is measured in <span class="font-medium text-white underline decoration-dotted underline-offset-4" data-tooltip-id="cu-icon" data-tooltip-html="1 CU = 1 vCPU, 4 GB RAM">CUs</span>. Database branches auto-scale from 0.25 to 8 CU based on load and down to zero when inactive',
  },
  {
    icon: timerIcon,
    title: 'Compute usage measured in CU-hours',
    text: 'Example: a 4 CU compute running for 20 hours uses 80 compute hours. Monthly plans include generous usage, with extra hours billed separately',
  },
];

const Compute = () => (
  <div className="grid w-full grid-cols-10 items-center gap-x-10 xl:gap-x-6 lg:gap-y-7 md:gap-y-6">
    <div className="order-1 col-span-5 ml-10 justify-self-start 2xl:ml-8 lg:order-none lg:col-span-full lg:ml-0 lg:justify-self-stretch">
      <h3 className="text-4xl font-medium leading-tight tracking-tighter xl:text-[32px] lg:text-[28px] md:text-[22px]">
        Compute
      </h3>
      <ul className="mt-6 flex flex-col gap-y-6">
        {items.map(({ icon, title, text }) => (
          <li className="flex items-start gap-x-3">
            <Image className="shrink-0" src={icon} width={24} height={24} alt="" />
            <div>
              <h4 className="text-[22px] font-medium leading-none tracking-tight">{title}</h4>
              <p
                className="mt-2.5 text-base font-light text-gray-new-70"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </div>
            <Tooltip id="cu-icon" arrowColor="#242628" />
          </li>
        ))}
      </ul>
    </div>
    <div className="col-span-5 lg:col-span-full lg:flex lg:justify-center">
      <Image className="rounded-lg" src={image} width={590} height={332} alt="Neon compute" />
    </div>
  </div>
);

export default Compute;
