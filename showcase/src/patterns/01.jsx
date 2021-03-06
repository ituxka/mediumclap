import React, { useEffect, useRef, useState } from 'react';
import mojs from 'mo-js';
import styles from './index.css';

const initialState = {
  count: 0,
  countTotal: 267,
  isClicked: false,
};

/*
 *   Higher Order Component
 */
const withClapAnimation = (WrappedComponent) => {
  return (props) => {
    const [animationTimeline, setAnimationTimeline] = useState(new mojs.Timeline());
    const scaleRef = useRef();
    const countTotalRef = useRef();
    const countRef = useRef();

    const tlDuration = 300;

    useEffect(() => {
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

      const newAnimationTimeline = animationTimeline.add([scaleButton, countTotal, count, triangleBurst, circleBurst]);
      setAnimationTimeline(newAnimationTimeline);
    }, [animationTimeline]);

    const animationProps = { timeline: animationTimeline, scaleRef, countTotalRef, countRef };

    return <WrappedComponent {...props} clapAnimation={animationProps} />;
  };
};

const MediumClap = ({ clapAnimation }) => {
  const MAXIMUM_USER_CLAPS = 10;
  const [clapState, setClapState] = useState(initialState);
  const { count, countTotal, isClicked } = clapState;

  const handleClapClick = () => {
    clapAnimation.timeline.replay();
    setClapState((state) => {
      const count = Math.min(state.count + 1, MAXIMUM_USER_CLAPS);
      const countTotal = state.count < MAXIMUM_USER_CLAPS ? state.countTotal + 1 : state.countTotal;

      return {
        count,
        countTotal,
        isClicked: true,
      };
    });
  };

  return (
    <button ref={clapAnimation.scaleRef} onClick={handleClapClick} className={styles.clap} type="button">
      <ClapIcon isClicked={isClicked} />
      <ClapCount ref={clapAnimation.countRef} count={count} />
      <CountTotal ref={clapAnimation.countTotalRef} countTotal={countTotal} />
    </button>
  );
};

/*
 * subcomponents
 */

const ClapIcon = ({ isClicked }) => {
  return (
    <span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-549 338 100.1 125" className={`${styles.icon} ${isClicked && styles.checked}`}>
        <path d="M-471.2 366.8c1.2 1.1 1.9 2.6 2.3 4.1.4-.3.8-.5 1.2-.7 1-1.9.7-4.3-1-5.9-2-1.9-5.2-1.9-7.2.1l-.2.2c1.8.1 3.6.9 4.9 2.2zm-28.8 14c.4.9.7 1.9.8 3.1l16.5-16.9c.6-.6 1.4-1.1 2.1-1.5 1-1.9.7-4.4-.9-6-2-1.9-5.2-1.9-7.2.1l-15.5 15.9c2.3 2.2 3.1 3 4.2 5.3zm-38.9 39.7c-.1-8.9 3.2-17.2 9.4-23.6l18.6-19c.7-2 .5-4.1-.1-5.3-.8-1.8-1.3-2.3-3.6-4.5l-20.9 21.4c-10.6 10.8-11.2 27.6-2.3 39.3-.6-2.6-1-5.4-1.1-8.3z" />
        <path d="M-527.2 399.1l20.9-21.4c2.2 2.2 2.7 2.6 3.5 4.5.8 1.8 1 5.4-1.6 8l-11.8 12.2c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l34-35c1.9-2 5.2-2.1 7.2-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l28.5-29.3c2-2 5.2-2 7.1-.1 2 1.9 2 5.1.1 7.1l-28.5 29.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.4 1.7 0l24.7-25.3c1.9-2 5.1-2.1 7.1-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l14.6-15c2-2 5.2-2 7.2-.1 2 2 2.1 5.2.1 7.2l-27.6 28.4c-11.6 11.9-30.6 12.2-42.5.6-12-11.7-12.2-30.8-.6-42.7m18.1-48.4l-.7 4.9-2.2-4.4m7.6.9l-3.7 3.4 1.2-4.8m5.5 4.7l-4.8 1.6 3.1-3.9" />
      </svg>
    </span>
  );
};

const ClapCount = React.forwardRef(({ count }, ref) => {
  return (
    <span ref={ref} className={styles.count}>
      +{count}
    </span>
  );
});

const CountTotal = React.forwardRef(({ countTotal }, ref) => {
  return (
    <span ref={ref} className={styles.total}>
      {countTotal}
    </span>
  );
});

export default withClapAnimation(MediumClap);
