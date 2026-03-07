"use client";

import OrganicCanvas from "@/components/OrganicCanvas";

export default function OrganicCanvasPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Organic Canvas</h1>
        <p className="text-slate-500">
          Draw and visualize chemical structures.
        </p>
      </header>
      <div className="h-[calc(100vh-200px)]">
        <OrganicCanvas />
      </div>
    </div>
  );
}
