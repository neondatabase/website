import lottie, { AnimationItem } from 'lottie-web';
import { useEffect, useRef, useState, MutableRefObject } from 'react';
import { useInView, IntersectionObserverEntry } from 'react-intersection-observer';

interface LottieOptions {
  animationData: {
    assets: Array<{ p?: string }>;
  };
  autoplay: boolean;
  loop: boolean;
}

interface UseLottieOptions {
  lottieOptions: LottieOptions;
  useInViewOptions?: IntersectionObserverInit;
  events?: { [key: string]: (e: any) => void };
  isInView?: boolean;
}

interface UseLottieReturn {
  animation: AnimationItem | null;
  isAnimationReady: boolean;
  isAnimationPlaying: boolean;
  isAnimationFinished: boolean;
  animationRef: MutableRefObject<HTMLDivElement | null>;
  animationVisibilityRef: (node?: Element | null) => void;
  animationEntry: IntersectionObserverEntry | undefined;
}

export default function useLottie({
  lottieOptions,
  useInViewOptions = {},
  events = {},
  isInView,
}: UseLottieOptions): UseLottieReturn {
  const shouldWaitForImagesToLoad = !!lottieOptions.animationData.assets.find(
    (asset) => asset.p?.includes('.png') || asset.p?.includes('.jpg')
  );

  const animationRef = useRef<HTMLDivElement | null>(null);
  const [animation, setAnimation] = useState<AnimationItem | null>(null);
  const [isAnimationReady, setIsAnimationReady] = useState(!shouldWaitForImagesToLoad);
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);
  const [animationVisibilityRef, isInViewInternal, animationEntry] = useInView({
    threshold: 0.4,
    triggerOnce: !lottieOptions.loop,
    ...useInViewOptions,
  });

  useEffect(() => {
    const lottieAnimation = lottie.loadAnimation({
      renderer: 'svg',
      container: animationRef.current,
      autoplay: false,
      loop: false,
      ...lottieOptions,
    });

    Object.entries({
      loaded_images() {
        setIsAnimationReady(true);
      },
      complete() {
        setIsAnimationFinished(true);
      },
      ...events,
    }).forEach(([eventName, callback]) => {
      lottieAnimation.addEventListener(eventName, callback.bind(lottieAnimation));
    });

    setAnimation(lottieAnimation);

    return () => lottieAnimation.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (animation && isAnimationReady) {
      if (isInViewInternal || isInView) {
        animation.play();
        setIsAnimationPlaying(true);
      } else {
        animation.pause();
        setIsAnimationPlaying(false);
      }
    }
  }, [animation, isAnimationReady, isInViewInternal, isInView]);

  return {
    animation,
    isAnimationReady,
    isAnimationPlaying,
    isAnimationFinished,
    animationRef,
    animationVisibilityRef,
    animationEntry,
  };
}
