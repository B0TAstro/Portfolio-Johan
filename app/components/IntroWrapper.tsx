// app/components/IntroWrapper.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { IntroType } from "@/types";
import IntroOverlay from "./IntroOverlay";
import TransitionIntro from "./TransitionIntro";

export default function IntroWrapper({ intro }: { intro: IntroType }) {
    const [visible, setVisible] = useState(true);
    const [hideIntro, setHideIntro] = useState(false);
    const [playTransition, setPlayTransition] = useState(false);

    useEffect(() => {
        const lock = visible || playTransition;
        document.body.style.overflow = lock ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [visible, playTransition]);

    const setCookie = () => {
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 2);
        document.cookie = `introSeen=true; path=/; expires=${expiration.toUTCString()}; SameSite=Lax`;
    };

    const start = () => {
        if (!intro.transition?.url) {
            setHideIntro(true);
            setTimeout(() => {
                setVisible(false);
                setCookie();
            }, 900);
            return;
        }
        setPlayTransition(true);
    };

    return (
        <>
            {visible && (
                <IntroOverlay
                    intro={intro}
                    onRequestTransition={start}
                    fading={hideIntro}
                />
            )}

            {playTransition && intro.transition?.url && (
                <TransitionIntro
                    src={intro.transition.url}
                    halfMs={1000}
                    onHalf={() => setHideIntro(true)}
                    onDone={() => {
                        setPlayTransition(false);
                        setVisible(false);
                        setCookie();
                    }}
                />
            )}
        </>
    );
}