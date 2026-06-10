import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

const RemoteLottie = ({ url, fallback = '✨', className = 'h-32 w-32', loop = true }) => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!url) return undefined;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (isMounted) setAnimationData(data);
      })
      .catch(() => setAnimationData(null));

    return () => {
      isMounted = false;
    };
  }, [url]);

  if (!animationData) {
    return (
      <div className={`grid place-items-center rounded-full bg-white/5 text-5xl ${className}`}>
        <span>{fallback}</span>
      </div>
    );
  }

  return <Lottie animationData={animationData} loop={loop} className={className} />;
};

export default RemoteLottie;
