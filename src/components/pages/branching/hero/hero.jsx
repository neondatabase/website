import Label from 'components/shared/label';
import background from 'images/pages/branching/bg.png';

const Hero = () => (
  <section className="hero mx-auto ">
    <div className="w-full max-w-[1216px] text-left">
      <div className="max-w-168 mx-auto md:max-w-xs">
        <Label>Branching</Label>
        <h1 className="mx-auto mt-5 font-sans text-[60px] font-normal leading-dense tracking-tighter xl:text-[56px] lg:text-5xl md:text-[32px]">
          Mastering Database
          <br /> Branching Workflows
        </h1>
        <p className="mt-6 text-lg leading-normal tracking-extra-tight text-gray-new-60 xl:mt-3 lg:mx-auto lg:text-base">
          Ship software faster using Neon branches
        </p>
      </div>
    </div>
    <div className="absolute -z-10 h-auto w-full ">
      <Image width={1920} height={848} alt="background" src={background} />
    </div>
  </section>
);

export default Hero;
