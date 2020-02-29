import { useLayoutEffect, useRef, useState } from 'react';
import mojs from 'mo-js';

export const useClapAnimation = () => {
  const [animationTimeline, setAnimationTimeline] = useState(new mojs.Timeline());
  const scaleRef = useRef();
  const countTotalRef = useRef();
  const countRef = useRef();

  const tlDuration = 300;

  useLayoutEffect(() => {
    const scaleButton = new mojs.Html({
      el: scaleRef.current,
      duration: tlDuration,
      scale: { 1.3: 1 },
      easing: mojs.easing.ease.out,
    });

    const countTotal = new mojs.Html({
      el: countTotalRef.current,
      duration: tlDuration,
      delay: (3 * tlDuration) / 2,
      opacity: { 0: 1 },
      y: { 0: -3 },
    });

    const count = new mojs.Html({
      el: countRef.current,
      opacity: { 0: 1 },
      duration: tlDuration,
      y: { 0: -30 },
    }).then({
      opacity: { 1: 0 },
      y: -80,
      duration: tlDuration / 2,
    });

    const triangleBurst = new mojs.Burst({
      parent: scaleRef.current,
      radius: { 50: 95 },
      count: 5,
      angle: 30,
      children: {
        shape: 'polygon',
        radius: { 6: 0 },
        stroke: 'rgba(255, 54, 0, 0.5)',
        strokeWidth: 2,
        angle: 210,
        speed: 0.2,
        delay: 30,
        duration: tlDuration,
        easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
      },
    });

    const circleBurst = new mojs.Burst({
      parent: scaleRef.current,
      radius: { 50: 75 },
      count: 5,
      angle: 25,
      children: {
        shape: 'circle',
        fill: 'rgba(149, 165, 166, 0.5)',
        radius: { 3: 0 },
        angle: 210,
        speed: 0.2,
        delay: 30,
        easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
      },
    });

    scaleRef.current.style.transform = 'scale(1,1)';

    const newAnimationTimeline = animationTimeline.add([scaleButton, countTotal, count, triangleBurst, circleBurst]);
    setAnimationTimeline(newAnimationTimeline);
  }, [animationTimeline]);

  return { timeline: animationTimeline, scaleRef, countTotalRef, countRef };
};
