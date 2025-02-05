// app/createPlan/page.tsx
"use client";

import { useState } from "react";

export default function CreatePlanPage() {
  // フォームの入力内容をステート管理
  const [date, setDate] = useState("");
  const [area, setArea] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: AI提案APIにリクエストを送る処理を追加予定
    alert(`AI提案する: 日付=${date}, エリア=${area}, 興味=${interests.join(", ")}, 予算=${budget}`);
  };

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">お出かけプラン作成</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 日付 */}
        <div>
          <label className="block mb-1 font-semibold">日付</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        {/* エリア */}
        <div>
          <label className="block mb-1 font-semibold">エリア</label>
          <input
            type="text"
            placeholder="例: 東京駅周辺"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        {/* 興味ジャンル */}
        <div>
          <label className="block mb-1 font-semibold">興味・ジャンル</label>
          <div className="flex gap-2 flex-wrap">
            {["カフェ", "ショッピング", "アウトドア", "美術館"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleInterest(item)}
                className={`px-3 py-1 rounded border ${
                  interests.includes(item)
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* 予算 */}
        <div>
          <label className="block mb-1 font-semibold">予算</label>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          >
            <option value="">選択してください</option>
            <option value="3000">~3,000円</option>
            <option value="5000">~5,000円</option>
            <option value="10000">~10,000円</option>
          </select>
        </div>

        <button
          type="submit"
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          AIに提案させる
        </button>
      </form>
    </main>
  );
}
