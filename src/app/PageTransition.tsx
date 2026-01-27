'use client';

import { useGSAP } from '@gsap/react';
import { usePathname, useRouter } from 'next/navigation';
import { useRef } from 'react';
import { Overlay } from './overlay';


export default function PageTransition({ children }: { children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const overlayInstance = useRef<Overlay | null>(null);
  const isAnimating = useRef(false);

  const router = useRouter();
  const pathname = usePathname();

  useGSAP(
    () => {
      if (!overlayRef.current) return;

      // Create overlay ONCE
      if (!overlayInstance.current) {
        overlayInstance.current = new Overlay(overlayRef.current, {
          rows: 6,
          columns: 11,
        });
      }

      const overlay = overlayInstance.current;

      const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        const link = e.currentTarget as HTMLAnchorElement;

        if (
          isAnimating.current ||
          link.target === '_blank' ||
          link.href === window.location.href
        ) {
          return;
        }

        isAnimating.current = true;

        overlay!
          .show({
            transformOrigin: '0% 50%',
            duration: 0.5,
            ease: 'power4.in',
            stagger: {
              grid: [overlay!.options.rows, overlay!.options.columns],
              from: 'start',
              each: 0.04,
            },
          })
          .then(() => {
            router.push(link.href);
          });
      };

      const links = document.querySelectorAll<HTMLAnchorElement>('a[href]');

      links.forEach((link) => {
        link.addEventListener('click', handleClick);
      });

      return () => {
        links.forEach((link) => {
          link.removeEventListener('click', handleClick);
        });
      };
    },
    {
      scope: overlayRef,
      dependencies: [pathname]
    }
  );

  /**
   * IN animation (runs after route change)
   */
  useGSAP(
    () => {
      if (!overlayInstance.current) return;

      overlayInstance.current
        .hide({
          transformOrigin: '100% 50%',
          duration: 1,
          ease: 'power4.out',
          stagger: {
            grid: [overlayInstance.current.options.rows, overlayInstance.current.options.columns],
            from: 'start',
            each: 0.06,
          },
        })
        .then(() => {
          isAnimating.current = false;
        });
    },
    {
      scope: overlayRef,
      dependencies: [pathname],
    }
  );

  return (
    <>
      {children}
      <div ref={overlayRef} className="overlay" />
    </>
  );
}
