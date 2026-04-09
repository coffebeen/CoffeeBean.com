import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef   = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  const pos    = useRef({ x: -100, y: -100 });
  const ring   = useRef({ x: -100, y: -100 });
  const trail  = useRef({ x: -100, y: -100 });
  const raf    = useRef<number>(0);
  const [hovered,  setHovered]  = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hidden,   setHidden]   = useState(true);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (hidden) setHidden(false);
    };

    const onDown = () => setClicking(true);
    const onUp   = () => setClicking(false);
    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);

    const onHoverIn = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [data-cursor]"))
        setHovered(true);
    };
    const onHoverOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [data-cursor]"))
        setHovered(false);
    };

    window.addEventListener("mousemove",  onMove);
    window.addEventListener("mousedown",  onDown);
    window.addEventListener("mouseup",    onUp);
    window.addEventListener("mouseover",  onHoverIn);
    window.addEventListener("mouseout",   onHoverOut);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    const animate = () => {
      const speed = 0.13;
      const trailSpeed = 0.07;

      ring.current.x  += (pos.current.x - ring.current.x)  * speed;
      ring.current.y  += (pos.current.y - ring.current.y)  * speed;
      trail.current.x += (pos.current.x - trail.current.x) * trailSpeed;
      trail.current.y += (pos.current.y - trail.current.y) * trailSpeed;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${trail.current.x}px, ${trail.current.y}px)`;
      }

      raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mousedown",  onDown);
      window.removeEventListener("mouseup",    onUp);
      window.removeEventListener("mouseover",  onHoverIn);
      window.removeEventListener("mouseout",   onHoverOut);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf.current);
    };
  }, [hidden]);

  const opacity = hidden ? 0 : 1;

  return (
    <>
      {/* Slow trail blob */}
      <div
        ref={trailRef}
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: hovered ? 64 : 48,
          height: hovered ? 64 : 48,
          borderRadius: "50%",
          background: "#c97c2f",
          opacity: opacity * (clicking ? 0.18 : 0.1),
          pointerEvents: "none",
          zIndex: 9997,
          marginLeft: hovered ? -32 : -24,
          marginTop:  hovered ? -32 : -24,
          transition: "width 0.3s, height 0.3s, margin 0.3s, opacity 0.3s",
          filter: "blur(8px)",
          willChange: "transform",
        }}
      />

      {/* Ring — follows with slight lag */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: hovered ? 44 : clicking ? 28 : 36,
          height: hovered ? 44 : clicking ? 28 : 36,
          borderRadius: "50%",
          border: `1.5px solid`,
          borderColor: hovered ? "#c97c2f" : "#c97c2f90",
          opacity: opacity * 0.85,
          pointerEvents: "none",
          zIndex: 9998,
          marginLeft: hovered ? -22 : clicking ? -14 : -18,
          marginTop:  hovered ? -22 : clicking ? -14 : -18,
          transition: "width 0.25s, height 0.25s, margin 0.25s, border-color 0.25s",
          willChange: "transform",
        }}
      />

      {/* Main dot — coffee drop shape */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0, left: 0,
          width:  hovered ? 10 : clicking ? 6 : 8,
          height: hovered ? 10 : clicking ? 6 : 8,
          borderRadius: "50%",
          background: "#c97c2f",
          opacity,
          pointerEvents: "none",
          zIndex: 9999,
          marginLeft: hovered ? -5 : clicking ? -3 : -4,
          marginTop:  hovered ? -5 : clicking ? -3 : -4,
          transition: "width 0.2s, height 0.2s, margin 0.2s",
          boxShadow: `0 0 ${hovered ? 12 : 6}px #c97c2f${hovered ? "99" : "60"}`,
          willChange: "transform",
        }}
      />
    </>
  );
}
