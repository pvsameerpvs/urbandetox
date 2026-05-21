"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@urbandetox/ui";
import { Badge } from "@urbandetox/ui";
import { Input } from "@urbandetox/ui";
import { Textarea } from "@urbandetox/ui";
import { Card, CardContent } from "@urbandetox/ui";
import { getHeroImages, setHeroImages, getActiveHeroIndex, setActiveHeroIndex, getHeroText, setHeroText, DEFAULT_TEXT, type HeroText } from "@/lib/hero";
import { toast } from "sonner";
import { RotateCcw, Eye, Check, ImageIcon, Type, AlignLeft, MousePointerClick } from "lucide-react";
import Link from "next/link";
import { HeroSlot } from "@/components/shared/HeroSlot";

const DEFAULT_HERO = "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=2000&auto=format&fit=crop";

export default function HeroImagePage() {
  const [images, setImages] = useState<string[]>(getHeroImages);
  const [activeIndex, setActiveIndex] = useState<number>(getActiveHeroIndex);
  const [text, setText] = useState<HeroText>(getHeroText);

  const currentImage = images[activeIndex] || DEFAULT_HERO;

  const handleUpload = useCallback((index: number, img: string) => {
    setImages((prev) => {
      const next = [...prev];
      next[index] = img;
      return next;
    });
  }, []);

  const handleDelete = useCallback((index: number) => {
    setImages((prev) => {
      const next = [...prev];
      next[index] = "";
      if (index === activeIndex) {
        const firstAvailable = next.findIndex((img) => img && !img.startsWith("placeholder"));
        const newActive = firstAvailable >= 0 ? firstAvailable : 0;
        setActiveIndex(newActive);
      }
      return next;
    });
  }, [activeIndex]);

  const handleSelect = useCallback((index: number) => {
    if (images[index] && !images[index].startsWith("placeholder")) {
      setActiveIndex(index);
    }
  }, [images]);

  const handleSave = () => {
    setHeroImages(images);
    setActiveHeroIndex(activeIndex);
    setHeroText(text);
    toast.success("Hero saved. Image and text are now live on the homepage.");
  };

  const handleReset = () => {
    setImages([DEFAULT_HERO, "", "", "", ""]);
    setActiveIndex(0);
    setText(DEFAULT_TEXT);
    setHeroImages([DEFAULT_HERO, "", "", "", ""]);
    setActiveHeroIndex(0);
    setHeroText(DEFAULT_TEXT);
    toast.success("Reset to default image and text.");
  };

  const updateText = (key: keyof HeroText, value: string) => {
    setText((prev) => ({ ...prev, [key]: value }));
  };

  const filledCount = images.filter((img) => img && !img.startsWith("placeholder")).length;
  const isDefault = JSON.stringify(text) === JSON.stringify(DEFAULT_TEXT);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-px w-6 bg-brand" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Homepage</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Hero Section</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-lg">
            Manage the full-screen hero image and all text content on the homepage. Upload up to 5 images and click any to make it live.
          </p>
        </div>
        <Button variant="outline" className="rounded-xl h-10 text-sm shrink-0" asChild>
          <Link href="/" target="_blank" rel="noopener noreferrer">
            <Eye className="mr-1.5 h-4 w-4" /> Preview Homepage
          </Link>
        </Button>
      </div>

      {/* Live Preview */}
      <Card className="border border-border/40 rounded-2xl bg-white overflow-hidden">
        <CardContent className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-px w-6 bg-brand/60" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Live Preview</span>
            <span className="text-xs text-muted-foreground">({filledCount} of 5 slots filled)</span>
          </div>

          <div className="relative aspect-[21/9] rounded-xl overflow-hidden border border-border/40">
            <Image src={currentImage || DEFAULT_HERO} alt="Active hero preview" fill className="object-cover" sizes="900px" unoptimized={currentImage?.startsWith("data:image")} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-4 py-2 mb-4 border border-white/20">
                <span className="text-sm font-semibold tracking-wide uppercase text-white">{text.badge}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center text-balance leading-tight">
                {text.headline1}
                <span className="block mt-1 text-white">{text.headline2}</span>
              </h1>
              <p className="mt-3 text-sm text-white text-balance max-w-md mx-auto text-center">{text.subheadline}</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="rounded-full bg-white text-black px-5 py-2 text-xs font-bold uppercase">{text.ctaPrimary}</span>
                <span className="rounded-full border border-white/30 text-white px-5 py-2 text-xs">{text.ctaSecondary}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Text Content Editor */}
      <Card className="border border-border/40 rounded-2xl bg-white overflow-hidden">
        <CardContent className="p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-px w-6 bg-brand/60" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground inline-flex items-center gap-2">
              <Type className="h-4 w-4" /> Hero Text Content
            </span>
            {!isDefault && (
              <Badge variant="outline" className="text-[10px] h-5 border-amber-200 text-amber-600 bg-amber-50">
                Modified
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Badge Label</label>
              <Input value={text.badge} onChange={(e) => updateText("badge", e.target.value)} placeholder="e.g. Curated Offbeat Escapes" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Primary CTA</label>
              <Input value={text.ctaPrimary} onChange={(e) => updateText("ctaPrimary", e.target.value)} placeholder="e.g. Explore Detox" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Headline (Line 1)</label>
              <Input value={text.headline1} onChange={(e) => updateText("headline1", e.target.value)} placeholder="e.g. Disconnect from routine." className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Headline (Line 2 — Brand Color)</label>
              <Input value={text.headline2} onChange={(e) => updateText("headline2", e.target.value)} placeholder="e.g. Step into your next detox." className="h-11 rounded-xl" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5">
              <AlignLeft className="h-3.5 w-3.5" /> Subheadline / Description
            </label>
            <Textarea value={text.subheadline} onChange={(e) => updateText("subheadline", e.target.value)} placeholder="Short description under the headline..." className="min-h-[80px] rounded-xl text-sm" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5">
              <MousePointerClick className="h-3.5 w-3.5" /> Secondary CTA
            </label>
            <Input value={text.ctaSecondary} onChange={(e) => updateText("ctaSecondary", e.target.value)} placeholder="e.g. View Upcoming" className="h-11 rounded-xl" />
          </div>
        </CardContent>
      </Card>

      {/* 5 Slot Grid */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-6 bg-brand/60" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground inline-flex items-center gap-2">
            <ImageIcon className="h-4 w-4" /> Image Gallery
          </span>
          <span className="text-xs text-muted-foreground">Click any image to make it live</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <HeroSlot key={i} index={i} image={images[i] || ""} isActive={i === activeIndex} onSelect={() => handleSelect(i)} onDelete={() => handleDelete(i)} onUpload={(img) => handleUpload(i, img)} />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button onClick={handleSave} className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-6 font-semibold shadow-lg shadow-brand/10">
          <Check className="mr-1.5 h-4 w-4" /> Save All Changes
        </Button>
        <Button variant="outline" onClick={handleReset} className="rounded-xl h-11 px-6">
          <RotateCcw className="mr-1.5 h-4 w-4" /> Reset Everything
        </Button>
      </div>
    </div>
  );
}
