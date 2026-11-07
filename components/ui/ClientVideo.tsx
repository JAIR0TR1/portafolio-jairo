"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Video vertical (9/16) de un cliente: póster hasta que entra en pantalla (lazy),
 * controles nativos, silenciado por defecto y sin reproducción automática.
 */
export function ClientVideo({ src, poster, label }: { src: string; poster?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative aspect-[9/16] overflow-hidden rounded-[20px] border border-line bg-card">
      {near ? (
        <video
          src={src}
          poster={poster}
          controls
          muted
          playsInline
          preload="metadata"
          aria-label={label}
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        poster && (
          // eslint-disable-next-line @next/next/no-img-element -- póster liviano antes de montar el video
          <img src={poster} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
        )
      )}
    </div>
  );
}
