"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface BackButtonProps {
  className?: string;
}

export default function BackButton({ className }: BackButtonProps) {
  const router = useRouter();

  function handleClick() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }

  return (
    <button className={className} onClick={handleClick}>
      Tilbage
    </button>
  );
}
