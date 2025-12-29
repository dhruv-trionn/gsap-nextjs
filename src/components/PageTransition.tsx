'use client';

import gsap from 'gsap';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

const STRIPE_COUNT = 8;

export default function PageTransition({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const isTransitioning = useRef(false);

    const overlayRef = useRef<HTMLDivElement | null>(null);
    const blockRefs = useRef<HTMLDivElement[]>([]);
    const handlersRef = useRef<((e: MouseEvent) => void)[]>([]);

    /* ---------------------------------- */
    /* Create stripes ONCE */
    /* ---------------------------------- */
    useEffect(() => {
        if (!overlayRef.current || blockRefs.current.length) return;

        for (let i = 0; i < STRIPE_COUNT; i++) {
            const block = document.createElement('div');
            block.className = 'block';
            overlayRef.current.appendChild(block);
            blockRefs.current.push(block);
        }

        gsap.set(blockRefs.current, {
            scaleX: 0,
            transformOrigin: 'left',
        });
    }, []);

    /* ---------------------------------- */
    /* Page reveal (on route load) */
    /* ---------------------------------- */
    useEffect(() => {
        revealPage();
        attachLinkInterceptors();

        return () => cleanupLinks();
        // eslint-disable-next-line
    }, [pathname]);

    /* ---------------------------------- */
    /* Intercept internal links */
    /* ---------------------------------- */
    const attachLinkInterceptors = () => {
        cleanupLinks();

        const links = document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]');

        links.forEach((link) => {
            const handler = (e: MouseEvent) => {
                if (
                    e.defaultPrevented ||
                    e.metaKey ||
                    e.ctrlKey ||
                    e.shiftKey ||
                    e.button !== 0
                )
                    return;

                const url = new URL(link.href).pathname;
                if (url === pathname || isTransitioning.current) return;

                e.preventDefault();
                startExit(url);
            };

            handlersRef.current.push(handler);
            link.addEventListener('click', handler);
        });
    };

    const cleanupLinks = () => {
        const links = document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]');

        links.forEach((link, i) => {
            const handler = handlersRef.current[i];
            if (handler) link.removeEventListener('click', handler);
        });

        handlersRef.current = [];
    };

    /* ---------------------------------- */
    /* Exit animation */
    /* ---------------------------------- */
    const startExit = (url: string) => {
        isTransitioning.current = true;

        gsap.timeline({
            onComplete: () => router.push(url),
        }).to(blockRefs.current, {
            scaleX: 1,
            duration: 0.9,
            stagger: 0.03,
            ease: 'power4.inOut',
            transformOrigin: 'left',
        });
    };

    /* ---------------------------------- */
    /* Enter animation */
    /* ---------------------------------- */
    const revealPage = () => {
        gsap.set(blockRefs.current, {
            scaleX: 1,
            transformOrigin: 'right',
        });

        gsap.to(blockRefs.current, {
            scaleX: 0,
            duration: 0.4,
            stagger: 0.03,
            ease: 'power4.inOut',
            onComplete: () => {
                isTransitioning.current = false;
            },
        });
    };

    return (
        <>
            <div ref={overlayRef} />
            {children}
        </>
    );
}
