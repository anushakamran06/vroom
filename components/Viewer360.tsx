"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getAmbientBoxShadow, getImageSrc, configKey } from "@/lib/utils";

const TOTAL_FRAMES = 40;
const DRAG_SENSITIVITY = 8; // px per step

interface Viewer360Props {
  model: string;
  colorSlug: string;
  colorHex: string;
  wheelIndex: number;
}

export function Viewer360({ model, colorSlug, colorHex, wheelIndex }: Viewer360Props) {
  const [degreeIndex, setDegreeIndex] = useState(0);
  const [activeConfig, setActiveConfig] = useState<string>("");
  const [pendingConfig, setPendingConfig] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [hintVisible, setHintVisible] = useState(true);
  const [imgSrc, setImgSrc] = useState("");

  const imageCache = useRef<Map<string, HTMLImageElement[]>>(new Map());
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const startDegreeIndex = useRef(0);
  const hasDragged = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const preloadConfig = useCallback(
    (mdl: string, colorS: string, wheelIdx: number) => {
      const key = configKey(mdl, colorS, wheelIdx);

      if (imageCache.current.has(key)) {
        setActiveConfig(key);
        setPendingConfig(null);
        setLoadingProgress(100);
        return;
      }

      setPendingConfig(key);
      setLoadingProgress(0);

      const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
      let loaded = 0;

      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new window.Image();
        const src = getImageSrc(mdl, colorS, wheelIdx, i);
        img.src = src;

        const finish = () => {
          images[i] = img;
          loaded++;
          const pct = Math.round((loaded / TOTAL_FRAMES) * 100);
          setLoadingProgress(pct);
          if (loaded === TOTAL_FRAMES) {
            imageCache.current.set(key, images);
            setActiveConfig(key);
            setPendingConfig(null);
          }
        };

        img.onload = finish;
        img.onerror = finish; // don't hang if an image 404s
      }
    },
    []
  );

  // Initial load
  useEffect(() => {
    preloadConfig(model, colorSlug, wheelIndex);
    // Show placeholder src immediately
    setImgSrc(getImageSrc(model, colorSlug, wheelIndex, 0));
    return () => {
      // nothing to clean up
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When color or wheel changes, preload new config in background
  useEffect(() => {
    const key = configKey(model, colorSlug, wheelIndex);
    if (key === activeConfig) return;
    preloadConfig(model, colorSlug, wheelIndex);
  }, [model, colorSlug, wheelIndex, activeConfig, preloadConfig]);

  // When active config or degree changes, update src
  useEffect(() => {
    if (!activeConfig) return;
    const cached = imageCache.current.get(activeConfig);
    if (cached && cached[degreeIndex]) {
      setImgSrc(cached[degreeIndex].src);
    } else {
      // Fall back to API URL (will load from network)
      const [mdl, colorS, wheelI] = activeConfig.split("-");
      setImgSrc(getImageSrc(mdl, colorS, parseInt(wheelI), degreeIndex));
    }
  }, [activeConfig, degreeIndex]);

  // Drag event handlers (attached to window so drag outside container still works)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = e.clientX - dragStartX.current;
      const steps = Math.round(delta / DRAG_SENSITIVITY);
      const newIndex = ((startDegreeIndex.current + steps) % TOTAL_FRAMES + TOTAL_FRAMES) % TOTAL_FRAMES;
      setDegreeIndex(newIndex);
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.classList.remove("viewer-drag-active");
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      const delta = e.touches[0].clientX - dragStartX.current;
      const steps = Math.round(delta / DRAG_SENSITIVITY);
      const newIndex = ((startDegreeIndex.current + steps) % TOTAL_FRAMES + TOTAL_FRAMES) % TOTAL_FRAMES;
      setDegreeIndex(newIndex);
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
      document.body.classList.remove("viewer-drag-active");
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    dragStartX.current = e.clientX;
    startDegreeIndex.current = degreeIndex;
    document.body.classList.add("viewer-drag-active");

    if (!hasDragged.current) {
      hasDragged.current = true;
      setHintVisible(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    dragStartX.current = e.touches[0].clientX;
    startDegreeIndex.current = degreeIndex;

    if (!hasDragged.current) {
      hasDragged.current = true;
      setHintVisible(false);
    }
  };

  const ambientStyle: React.CSSProperties = {
    boxShadow: getAmbientBoxShadow(colorHex),
    transition: "box-shadow 400ms ease",
  };

  const isLoading = pendingConfig !== null && loadingProgress < 100;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#0a0a0a]">
      {/* Ambient glow container */}
      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center ambient-container"
        style={ambientStyle}
      >
        {/* Car image */}
        <div
          className="relative w-full h-full flex items-center justify-center cursor-grab select-none"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {imgSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgSrc}
              alt={`${model} at ${degreeIndex * 9}°`}
              className="max-w-full max-h-full object-contain"
              draggable={false}
              style={{ transition: "opacity 200ms ease" }}
            />
          )}
        </div>

        {/* Drag hint */}
        {hintVisible && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-xs rounded-full px-4 py-2 pointer-events-none animate-pulse">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
            <span>Drag to rotate</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        )}

        {/* 360° badge */}
        <div className="absolute top-6 left-6 flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white/70 text-xs rounded-full px-3 py-1.5 pointer-events-none">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>360°</span>
        </div>

        {/* Degree indicator */}
        <div className="absolute top-6 right-6 text-white/40 text-xs font-mono pointer-events-none">
          {degreeIndex * 9}°
        </div>
      </div>

      {/* Loading progress bar */}
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10">
          <div
            className="h-full bg-white/60 progress-shimmer transition-all duration-150"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
      )}
    </div>
  );
}
