"use client";
import { useState } from "react";
import PlanEditor, { PlanItem } from "./PlanEditor";


export default function CreatePlanPage() {
  const [date, setDate] = useState("");
  const [area, setArea] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState("");

  // ローディング・エラー・レスポンス格納用
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [planItems, setPlanItems] = useState<PlanItem[]>([]);
  const [isEditing, setIsEditing] = useState(false); // 編集モードのフラグ

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  // ------------------
  // AI提案リクエスト
  // ------------------
  const generatePlan = async () => {
    try {
      setIsLoading(true);
      setError("");
      setPlanItems([]);

      const res = await fetch("/api/generatePlan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          area,
          interests,
          budget,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "API Error");
      }

      const data = await res.json();
      // data.planが存在するか確認
      if (!data.plan || !Array.isArray(data.plan)) {
        throw new Error("Invalid AI response format");
      }

      // plan配列をステートに保存
      setPlanItems(data.plan);
    } catch (err: unknown) {
        if(err instanceof Error){
            setError(err.message);
        }
    } finally {
      setIsLoading(false);
    }
  };

  // フォーム送信時のハンドラ
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generatePlan();
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

        {/* 提案ボタン */}
        <button
          type="submit"
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? "AI提案中..." : "AIに提案させる"}
        </button>
      </form>

      {/* エラー表示 */}
      {error && (
        <div className="mt-4 text-red-600">
          エラー: {error}
        </div>
      )}

       {/* AI応答表示 or 編集UI */}
       {!isEditing ? (
        <div className="mt-6">
          {/* プランがあれば表示 */}
          {planItems.length > 0 ? (
            <div className="border rounded p-3 bg-white shadow">
              <h2 className="text-xl font-semibold mb-2">AI提案プラン</h2>
              {planItems.map((item, idx) => (
                <div key={idx} className="mb-3">
                  <p className="font-bold">{item.timeRange}</p>
                  <p>{item.spotName}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
              {/* 編集ボタン */}
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                このプランを編集
              </button>
            </div>
          ) : (
            <p className="text-gray-600">プランがまだありません</p>
          )}
        </div>
      ) : (
        // isEditing === true → PlanEditorコンポーネントを表示
        <div className="mt-6">
          <PlanEditor
            planItems={planItems}
            setPlanItems={setPlanItems}
            onFinish={() => setIsEditing(false)}
          />
        </div>
      )}
    </main>
  );
}
