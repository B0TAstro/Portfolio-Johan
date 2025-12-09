"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
    src?: string;
    alt: string;
    caption?: string;
    className?: string;
    imageClassName?: string;
    priority?: boolean;
    loading: "lazy";
    sizes?: string;
};

const cx = (...c: Array<string | undefined | false>) => c.filter(Boolean).join(" ");

export default function FullscreenImage({
    src,
    alt,
    caption,
    className,
    imageClassName,
    priority,
    loading = "lazy",
    sizes = "100vw",
}: Props) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = prevOverflow;
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    if (!src) return null;

    return (
        <>
            <div
                className={cx("relative w-full h-full cursor-pointer", className)}
                role="button"
                tabIndex={0}
                onClick={() => setOpen(true)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setOpen(true);
                }}
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes={sizes}
                    priority={priority}
                    loading={priority ? "eager" : loading}
                    className={imageClassName}
                />
            </div>

            {open && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm cursor-pointer"
                    onClick={() => setOpen(false)}
                >
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div
                            className="relative w-[min(92vw,1400px)] h-[min(88vh,900px)] cursor-pointer"
                            onClick={() => setOpen(false)}
                        >
                            <Image
                                src={src}
                                alt={alt}
                                fill
                                sizes="92vw"
                                priority
                                className="object-contain"
                            />
                        </div>
                    </div>

                    {caption && (
                        <div className="absolute bottom-6 inset-x-0 px-6 text-center text-sm text-white/80">
                            {caption}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}