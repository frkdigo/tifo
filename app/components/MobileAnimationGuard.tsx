"use client";

import { MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";

const MOBILE_BREAKPOINT = 767;

type MobileAnimationGuardProps = {
  children: ReactNode;
};

export default function MobileAnimationGuard({ children }: MobileAnimationGuardProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const syncIsMobile = () => setIsMobile(mediaQuery.matches);

    syncIsMobile();
    mediaQuery.addEventListener("change", syncIsMobile);

    return () => {
      mediaQuery.removeEventListener("change", syncIsMobile);
    };
  }, []);

  const shouldLimitAnimations = useMemo(() => isMobile && pathname !== "/", [isMobile, pathname]);

  useEffect(() => {
    document.body.dataset.mobileStatic = shouldLimitAnimations ? "true" : "false";

    return () => {
      document.body.dataset.mobileStatic = "false";
    };
  }, [shouldLimitAnimations]);

  return (
    <MotionConfig reducedMotion={shouldLimitAnimations ? "always" : "never"}>
      {children}
    </MotionConfig>
  );
}
