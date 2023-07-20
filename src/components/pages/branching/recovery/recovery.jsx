import Container from 'components/shared/container';
import Heading from 'components/shared/heading';

const items = [
  'Create a branch from a past point in time to reproduce an issue.',
  'Instantly restore a production database from a past point in time.',
  'Recover lost data with a branch created from a past point in time.',
  'Instantly create backup branches that you can connect to and inspect at any time.',
];

const Recovery = () => (
  <section className="recovery safe-paddings bg-black pt-[200px] text-white 2xl:pt-36 xl:pt-32 lg:pt-28 md:pt-20">
    <Container size="sm">
      <Heading className="t-5xl font-bold" tag="h2">
        Data recovery and debugging
      </Heading>
      <div className="grid-gap-x mt-10 grid grid-cols-10 items-center lg:mt-6">
        <ol className="col-span-4 max-w-[484px] divide-y divide-dashed divide-gray-2 lg:col-span-full lg:max-w-none">
          {items.map((item, index) => (
            <li className="t-xl flex space-x-4 py-5 leading-snug" key={index}>
              <span className="font-semibold text-primary-1">{index + 1}.</span>
              <p>{item}</p>
            </li>
          ))}
        </ol>
        <img
          className="col-span-6 lg:col-span-full lg:mt-10 lg:w-full"
          src="/images/pages/branching/screen.svg"
          width={710}
          height={420}
          alt=""
          loading="lazy"
          aria-hidden
        />
      </div>
    </Container>
  </section>
);

export default Recovery;
