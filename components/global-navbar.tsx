"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navItems = [
  { label: "About", href: "/about" },
  { label: "Research", href: "/research" },
  { label: "Projects", href: "/projects" },
  { label: "Music Specimens", href: "/diary" },
  { label: "Blog", href: "/blog" },
  { label: "Knowledge", href: "/knowledge" },
  { label: "CV", href: "/cv" },
];

export function GlobalNavbar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Always show navbar at the very top
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 60) {
        // Scrolling down - hide
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-transform duration-300 ease-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Background with dewy morning atmosphere */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base layer - warm ivory with soft translucency */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf9f7]/92 via-[#f7f6f3]/88 to-[#f5f4f1]/85 backdrop-blur-[6px]" />
        
        {/* Dew glow layers - soft morning light */}
        <div className="absolute -top-6 left-1/4 h-20 w-72 rounded-full bg-[#e9f2e6]/40 blur-3xl" />
        <div className="absolute -top-4 right-1/3 h-16 w-56 rounded-full bg-[#dfeadb]/35 blur-2xl" />
        <div className="absolute top-0 left-1/2 h-12 w-40 -translate-x-1/2 rounded-full bg-[#f0f5ed]/45 blur-xl" />
        
        {/* Garden illustration SVG - delicate botanical elements */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.08]"
          viewBox="0 0 1200 80"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left side - delicate leaves and stems */}
          <path
            d="M-20 70 Q30 50 60 65 Q80 40 110 55"
            stroke="currentColor"
            strokeWidth="1"
            className="text-primary"
          />
          <ellipse cx="45" cy="55" rx="12" ry="6" className="fill-primary/30" transform="rotate(-30 45 55)" />
          <ellipse cx="85" cy="48" rx="10" ry="5" className="fill-primary/25" transform="rotate(20 85 48)" />
          <path
            d="M100 80 Q120 45 150 60"
            stroke="currentColor"
            strokeWidth="0.8"
            className="text-primary/60"
          />
          <ellipse cx="135" cy="52" rx="14" ry="6" className="fill-primary/20" transform="rotate(-15 135 52)" />
          
          {/* Center-left - small botanical cluster */}
          <path
            d="M250 75 Q280 35 320 50 Q340 25 380 45"
            stroke="currentColor"
            strokeWidth="0.8"
            className="text-primary/50"
          />
          <circle cx="290" cy="42" r="4" className="fill-primary/15" />
          <circle cx="350" cy="38" r="3" className="fill-primary/20" />
          <ellipse cx="310" cy="50" rx="8" ry="4" className="fill-primary/15" transform="rotate(25 310 50)" />
          
          {/* Center - gentle arching stem with dew drops */}
          <path
            d="M520 80 Q560 20 620 40 Q680 15 720 50"
            stroke="currentColor"
            strokeWidth="1"
            className="text-primary/40"
          />
          <circle cx="560" cy="32" r="2" className="fill-primary/30" />
          <circle cx="600" cy="28" r="2.5" className="fill-primary/25" />
          <circle cx="650" cy="30" r="2" className="fill-primary/30" />
          <ellipse cx="580" cy="38" rx="12" ry="5" className="fill-primary/15" transform="rotate(-20 580 38)" />
          <ellipse cx="640" cy="35" rx="10" ry="4" className="fill-primary/12" transform="rotate(15 640 35)" />
          
          {/* Right side - trailing vines and petals */}
          <path
            d="M850 70 Q900 30 950 55 Q1000 20 1050 45"
            stroke="currentColor"
            strokeWidth="0.8"
            className="text-primary/50"
          />
          <ellipse cx="920" cy="42" rx="11" ry="5" className="fill-primary/18" transform="rotate(-25 920 42)" />
          <ellipse cx="980" cy="35" rx="9" ry="4" className="fill-primary/15" transform="rotate(30 980 35)" />
          <circle cx="1020" cy="40" r="3" className="fill-primary/20" />
          
          {/* Far right - fading botanical elements */}
          <path
            d="M1100 75 Q1140 45 1180 60 Q1200 35 1220 50"
            stroke="currentColor"
            strokeWidth="0.6"
            className="text-primary/35"
          />
          <ellipse cx="1150" cy="52" rx="8" ry="4" className="fill-primary/12" transform="rotate(-10 1150 52)" />
        </svg>
        
        {/* Bottom border - soft dewy line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/12 to-transparent" />
      </div>

      {/* Navigation content */}
      <nav className="relative mx-auto flex h-14 max-w-7xl items-center justify-between px-6 md:px-12">
        {/* Branding - Echo Garden with a gentle, botanical feel */}
        <Link
          href="/"
          className="group flex items-center gap-1.5 transition-opacity hover:opacity-80"
        >
          {/* Small decorative leaf */}
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="text-primary/60"
          >
            <path 
              d="M12 2C8 6 4 10 4 14C4 18 8 22 12 22C16 22 20 18 20 14C20 10 16 6 12 2Z" 
              fill="currentColor" 
              fillOpacity="0.15"
            />
            <path 
              d="M12 2C8 6 4 10 4 14C4 18 8 22 12 22" 
              stroke="currentColor" 
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path 
              d="M12 8V18M12 12C10 12 8 13 8 15" 
              stroke="currentColor" 
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-serif text-lg tracking-wide text-foreground">
            <span className="font-normal">Echo</span>
            <span className="ml-0.5 font-light italic text-foreground/80">Garden</span>
          </span>
        </Link>

        {/* Navigation Items */}
        <div className="hidden items-center gap-0.5 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname.startsWith(item.href));
            const isCV = item.label === "CV";
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-2.5 py-1.5 text-[13px] transition-all ${
                  isCV
                    ? isActive
                      ? "rounded-md border border-primary/30 bg-primary/10 font-medium text-primary"
                      : "rounded-md border border-foreground/10 bg-card/40 text-foreground/75 hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                    : isActive
                      ? "font-medium text-primary"
                      : "text-foreground/65 hover:text-foreground"
                }`}
              >
                {item.label}
                {/* Active indicator - subtle underline */}
                {isActive && !isCV && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-3 -translate-x-1/2 rounded-full bg-primary/40" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile menu button */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-secondary/50 hover:text-foreground md:hidden"
          aria-label="Open menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="8" x2="20" y2="8" />
            <line x1="4" y1="16" x2="20" y2="16" />
          </svg>
        </button>
      </nav>
    </header>
  );
}
