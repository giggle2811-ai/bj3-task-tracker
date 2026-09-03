"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg animate-pulse shadow-lg shadow-blue-500/30">
          4/10
        </div>
        <p className="text-sm font-medium text-slate-500">กำลังโหลดระบบติดตามงาน บ.จ. ๓...</p>
      </div>
    </div>
  );
}
