import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import styles from './index.css';
import { useClapAnimation3 } from '../hooks';

const initialState = {
  count: 0,
  countTotal: 267,
  isClicked: false,
};

const MediumClapContext = createContext();
const { Provider } = MediumClapContext;

const MediumClap = ({ children, onClap }) => {
  const MAXIMUM_USER_CLAPS = 10;
  const [clapState, setClapState] = useState(initialState);

  const clapAnimation = useClapAnimation3();

  const componentJustMounted = useRef(true);
  useEffect(() => {
    if (!componentJustMounted.current) {
      onClap && onClap(clapState);
    }

    componentJustMounted.current = false;
  }, [clapState, onClap]);

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

  const clapStateM = useMemo(() => ({ ...clapState, ...clapAnimation }), [clapState, clapAnimation]);

  return (
    <Provider value={clapStateM}>
      <button ref={clapAnimation.scaleRef} onClick={handleClapClick} className={styles.clap} type="button">
        {children}
      </button>
    </Provider>
  );
};

/*
 * subcomponents
 */

const ClapIcon = () => {
  const { isClicked } = useContext(MediumClapContext);
  return (
    <span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-549 338 100.1 125" className={`${styles.icon} ${isClicked && styles.checked}`}>
        <path d="M-471.2 366.8c1.2 1.1 1.9 2.6 2.3 4.1.4-.3.8-.5 1.2-.7 1-1.9.7-4.3-1-5.9-2-1.9-5.2-1.9-7.2.1l-.2.2c1.8.1 3.6.9 4.9 2.2zm-28.8 14c.4.9.7 1.9.8 3.1l16.5-16.9c.6-.6 1.4-1.1 2.1-1.5 1-1.9.7-4.4-.9-6-2-1.9-5.2-1.9-7.2.1l-15.5 15.9c2.3 2.2 3.1 3 4.2 5.3zm-38.9 39.7c-.1-8.9 3.2-17.2 9.4-23.6l18.6-19c.7-2 .5-4.1-.1-5.3-.8-1.8-1.3-2.3-3.6-4.5l-20.9 21.4c-10.6 10.8-11.2 27.6-2.3 39.3-.6-2.6-1-5.4-1.1-8.3z" />
        <path d="M-527.2 399.1l20.9-21.4c2.2 2.2 2.7 2.6 3.5 4.5.8 1.8 1 5.4-1.6 8l-11.8 12.2c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l34-35c1.9-2 5.2-2.1 7.2-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l28.5-29.3c2-2 5.2-2 7.1-.1 2 1.9 2 5.1.1 7.1l-28.5 29.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.4 1.7 0l24.7-25.3c1.9-2 5.1-2.1 7.1-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l14.6-15c2-2 5.2-2 7.2-.1 2 2 2.1 5.2.1 7.2l-27.6 28.4c-11.6 11.9-30.6 12.2-42.5.6-12-11.7-12.2-30.8-.6-42.7m18.1-48.4l-.7 4.9-2.2-4.4m7.6.9l-3.7 3.4 1.2-4.8m5.5 4.7l-4.8 1.6 3.1-3.9" />
      </svg>
    </span>
  );
};

const ClapCount = () => {
  const { count, fadeUpAndLeaveRef: ref } = useContext(MediumClapContext);
  return (
    <span ref={ref} className={styles.count}>
      +{count}
    </span>
  );
};

const ClapCountTotal = () => {
  const { countTotal, fadeUpRef: ref } = useContext(MediumClapContext);
  return (
    <span ref={ref} className={styles.total}>
      {countTotal}
    </span>
  );
};

const Usage = () => {
  const [count, setCount] = useState(0);
  const handleClap = (clapState) => {
    setCount(clapState.count);
  };

  return (
    <div style={{ width: '100%' }}>
      <MediumClap onClap={handleClap}>
        <ClapIcon />
        <ClapCount />
        <ClapCountTotal />
      </MediumClap>
      <div className={styles.info}>{`You've clicked ${count} times!`}</div>
    </div>
  );
};

export default Usage;
