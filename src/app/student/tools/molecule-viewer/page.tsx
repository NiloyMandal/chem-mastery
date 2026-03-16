"use client";

import dynamic from "next/dynamic";

const MoleculeViewer = dynamic(
  () => import("@/components/MoleculeViewer"),
  { ssr: false }
);

export default function MoleculeViewerPage() {
  return <MoleculeViewer />;
}
