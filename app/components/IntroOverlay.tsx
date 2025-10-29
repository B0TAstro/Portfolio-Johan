// app/components/IntroOverlay.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { IntroType } from "@/types";
import LinktreeLogo from "@/public/icons/linktree-logo.png";
import { Instagram, Linkedin, Twitter, Facebook } from "lucide-react";

type Props = {
    intro: IntroType;
    onRequestTransition: () => void;
    fading?: boolean;
};

export default function IntroOverlay({ intro, onRequestTransition, fading = false }: Props) {
    const renderIcon = (platform: string) => {
        const icons: Record<string, React.ReactElement> = {
            linktree: (
                <Image
                    src={LinktreeLogo}
                    alt="Linktree"
                    width={44}
                    height={44}
                    className="object-contain w-6 h-6"
                />
            ),
            instagram: <Instagram className="w-6 h-6" />,
            linkedin: <Linkedin className="w-6 h-6" />,
            twitter: <Twitter className="w-6 h-6" />,
            facebook: <Facebook className="w-6 h-6" />,
        };
        return icons[platform] || null;
    };

    const handleClick = (mouseEvent: React.MouseEvent<HTMLDivElement>) => {
        const target = mouseEvent.target as HTMLElement;
        if (target.closest("a")) return;
        onRequestTransition();
    };

    return (
        <section
            onClick={handleClick}
            className={`fixed inset-0 z-[100] cursor-pointer transition-all duration-[500ms] ease-[cubic-bezier(0.83,0,0.17,1)] ${fading ? "opacity-0" : "opacity-100"}`}
            style={{ willChange: "opacity" }}
        >
            <div className="absolute inset-0 z-0">
                {intro.backgroundMedia.type === "video" && intro.backgroundMedia.video?.url ? (
                    <video
                        src={intro.backgroundMedia.video.url}
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover"
                    />
                ) : intro.backgroundMedia.image?.url ? (
                    <Image
                        src={intro.backgroundMedia.image.url}
                        alt={intro.backgroundMedia.image.alt || "Background"}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : null}
            </div>

            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
                {intro.logoMedia.type === "video" && intro.logoMedia.video?.url ? (
                    <video
                        src={intro.logoMedia.video.url}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-24 h-24 md:w-40 md:h-40 object-contain"
                    />
                ) : intro.logoMedia.image?.url ? (
                    <Image
                        src={intro.logoMedia.image.url}
                        alt={intro.logoMedia.image.alt || intro.title}
                        width={150}
                        height={150}
                        className="w-24 h-24 md:w-40 md:h-40 object-contain"
                        priority
                    />
                ) : null}
            </div>

            <div className="absolute bottom-65 right-0 md:bottom-30 md:right-10 z-10 prose prose-invert prose-lg text-white text-center text-2xl md:text-5xl font-thin md:text-right flex md:block items-center justify-center w-full md:w-auto md:h-auto custom-strong">
                <PortableText value={intro.description} />
            </div>

            {intro.socialLinks && intro.socialLinks.length > 0 && (
                <div className="absolute bottom-6 w-full z-10">
                    <div className="flex justify-center gap-5">
                        {intro.socialLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:opacity-80 transition-opacity"
                                onClick={(clickEvent) => clickEvent.stopPropagation()}
                            >
                                {link.platform === "other" && link.customIcon?.url ? (
                                    <Image
                                        src={link.customIcon.url}
                                        alt={link.customIcon.alt || "Social icon"}
                                        width={44}
                                        height={44}
                                        className="w-6 h-6 object-contain"
                                    />
                                ) : (
                                    renderIcon(link.platform)
                                )}
                            </Link>
                        ))}
                    </div>
                    <p className="font-light text-[12px] text-center mt-3">
                        © Johan Vuillerme {new Date().getFullYear()}
                    </p>
                </div>
            )}
        </section>
    );
}