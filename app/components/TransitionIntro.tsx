// app/components/TransitionIntro.tsx

"use client";

import { useEffect, useRef } from "react";

type Props = {
    src: string;
    halfMs?: number;
    onHalf: () => void;
    onDone: () => void;
};

export default function TransitionIntro({ src, halfMs = 1000, onHalf, onDone }: Props) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const halfTriggeredRef = useRef(false);
    const halfTimerRef = useRef<number | null>(null);

    useEffect(() => {
        const videoEl = videoRef.current;
        if (!videoEl) return;

        const startPlayback = async () => {
            try {
                await videoEl.play();
            } catch {
                // si l'autoplay est bloqué, on laisse la vidéo démarrer à l'interaction
            }
            halfTimerRef.current = window.setTimeout(() => {
                if (!halfTriggeredRef.current) {
                    halfTriggeredRef.current = true;
                    onHalf();
                }
            }, halfMs);
        };

        const handleEnded = () => {
            if (!halfTriggeredRef.current) {
                halfTriggeredRef.current = true;
                onHalf();
            }
            onDone();
        };

        videoEl.addEventListener("ended", handleEnded);
        startPlayback();

        return () => {
            videoEl.removeEventListener("ended", handleEnded);
            if (halfTimerRef.current) window.clearTimeout(halfTimerRef.current);
        };
    }, [halfMs, onHalf, onDone]);

    return (
        <div className="fixed inset-0 z-[200] pointer-events-none">
            <video
                ref={videoRef}
                src={src}
                playsInline
                muted
                preload="auto"
                className="w-full h-full object-cover"
            />
        </div>
    );
}
