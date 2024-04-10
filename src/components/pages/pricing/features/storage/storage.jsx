import Image from 'next/image';

import branchingIcon from 'icons/aws/branching.svg';
import storageIcon from 'icons/aws/storage.svg';

import image from '../images/storage-illustration.svg';

const items = [
  {
    icon: branchingIcon,
    title: 'Branch-based databases',
    text: 'Postgres databases in Neon reside within database branches. These branches, housed within projects, hold both schema and data',
  },
  {
    icon: storageIcon,
    title: 'All branches within a project share storage',
    text: 'Branch databases instantly without extra storage. Ideal for creating dev, staging, preview, and test databases cost-effectively',
  },
];

const Storage = () => (
  <div className="grid w-full grid-cols-10 items-center gap-x-10 xl:items-end xl:gap-x-6 lg:gap-y-7 md:gap-y-6">
    <div className="col-span-5 lg:col-span-full">
      <h3 className="text-4xl font-medium leading-tight tracking-tight xl:text-[32px] lg:text-[28px] md:text-[22px]">
        Storage
      </h3>
      <ul className="mt-6 flex flex-col gap-y-6">
        {items.map(({ icon, title, text }) => (
          <li className="flex items-start gap-x-3">
            <Image className="shrink-0" src={icon} width={24} height={24} alt="" />
            <div>
              <h4 className="text-[22px] font-medium leading-none tracking-tight">{title}</h4>
              <p className="mt-2.5 text-base font-light text-gray-new-70">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
    <div className="col-span-5 xl:ml-8 lg:col-span-full lg:ml-0 lg:flex lg:justify-center">
      <Image
        className="ml-10 rounded-lg 2xl:ml-8 xl:ml-0"
        width={590}
        height={332}
        src={image}
        alt="Neon storage"
      />
    </div>
  </div>
);

export default Storage;
