"use client";

import dynamic from "next/dynamic";

const PWARegister = dynamic(() => import("./PWARegister"), { ssr: false });

export default function PWAWrapper() {
  return (
    <>
      <PWARegister />
    </>
  );
}
