"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

export function FavoriteButton({ className = "" }: { className?: string }) {
  const [saved, setSaved] = useState(false);

  return <button
    type="button"
    aria-label={saved ? "Quitar de favoritos" : "Guardar prenda"}
    aria-pressed={saved}
    onClick={() => setSaved(current => !current)}
    className={className}
  >
    <Heart size={17} fill={saved ? "currentColor" : "none"}/>
  </button>;
}
