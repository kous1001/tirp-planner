// app/plans/[planId]/PlanDetailClient.tsx (Client Component)
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type PlanItem = {
  timeRange: string;
  spotName: string;
  description: string;
};

type Props = {
  planId: string;
};

export default function PlanDetailClient({ planId }: Props) {
  const router = useRouter();
  const [planItems, setPlanItems] = useState<PlanItem[] | null>(null);

  useEffect(() => {
    // マウント後に localStorage から読み込み
    const stored = localStorage.getItem(`tripPlanner_${planId}`);
    if (!stored) {
      // 見つからない場合、notFound 風の処理
      alert("このプランは存在しません (同じブラウザで作成したものではない可能性)");
      router.push("/"); // トップへリダイレクトなど
    } else {
      const parsed = JSON.parse(stored) as PlanItem[];
      setPlanItems(parsed);
    }
  }, [planId, router]);

  if (!planItems) {
    return <p>読み込み中...</p>;
  }

  return (
    <div className="mt-4">
      {planItems.map((item, idx) => (
        <div key={idx} className="mb-3 border rounded p-2">
          <p className="font-bold">{item.timeRange}</p>
          <p>{item.spotName}</p>
          <p className="text-sm text-gray-600">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
