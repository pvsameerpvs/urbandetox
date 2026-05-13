"use client";

import { useState, useEffect } from "react";
import { getHeroImage, getHeroText } from "@/lib/hero";
import { HeroBackground } from "./HeroBackground";
import { HeroTextContent } from "./HeroTextContent";
import { HeroSearchBar } from "./HeroSearchBar";

export function HeroSection() {
  const [heroImage, setHeroImage] = useState<string>("");
  const [heroText, setHeroText] = useState(getHeroText());

  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroImage(getHeroImage());
      setHeroText(getHeroText());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative h-screen flex flex-col overflow-hidden">
      <HeroBackground heroImage={heroImage} />
      <HeroTextContent heroText={heroText} />
      <HeroSearchBar />
    </section>
  );
}
