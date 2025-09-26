import React, { useEffect, useRef, useState } from 'react';

interface Props {
  src: string;
  poster?: string;
  className?: string;
  autoPlayOnHover?: boolean;
}

// Lightweight lazy video preview: loads metadata only when in viewport; plays on hover
export const ExerciseVideoPreview: React.FC<Props> = ({ src, poster, className='', autoPlayOnHover=true }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [hoverPlay, setHoverPlay] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if(!el) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          setVisible(true);
          observer.disconnect();
        }
      });
    }, { threshold: 0.25 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if(!videoRef.current) return;
    if(hoverPlay) {
      videoRef.current.play().catch(()=>{});
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [hoverPlay]);

  return (
    <div
      ref={containerRef}
      className={"relative group w-full h-full " + className}
      onMouseEnter={() => autoPlayOnHover && setHoverPlay(true)}
      onMouseLeave={() => autoPlayOnHover && setHoverPlay(false)}
    >
      {visible ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">Loading...</div>
      )}
      {autoPlayOnHover && <div className="absolute bottom-1 right-1 text-[10px] px-1 py-0.5 rounded bg-black/50 text-white opacity-0 group-hover:opacity-100 transition">hover to play</div>}
    </div>
  );
};

export default ExerciseVideoPreview;
