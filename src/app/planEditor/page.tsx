"use client";

import { useState } from "react";

// プランアイテムの型定義
type PlanItem = {
  timeRange: string;
  spotName: string;
  description: string;
};

export default function PlanEditorPage() {
  // 例: 初期データ (AI提案後などに置き換えてもOK)
  const [planItems, setPlanItems] = useState<PlanItem[]>([
    {
      timeRange: "10:00 - 11:00",
      spotName: "カフェABC",
      description: "美味しいコーヒーで朝食を楽しむ",
    },
    {
      timeRange: "11:30 - 12:30",
      spotName: "○○公園",
      description: "自然を感じながら散策",
    },
    {
      timeRange: "13:00 - 14:00",
      spotName: "△△食堂",
      description: "ランチで地元の名物を味わう",
    },
  ]);

  // 新規アイテム追加フォームの開閉や入力ステート
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTimeRange, setNewTimeRange] = useState("");
  const [newSpotName, setNewSpotName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  /**
   * 上へ移動
   */
  const moveItemUp = (index: number) => {
    if (index === 0) return; // 先頭は上に移動できない
    setPlanItems((prev) => {
      const newArr = [...prev];
      const temp = newArr[index - 1];
      newArr[index - 1] = newArr[index];
      newArr[index] = temp;
      return newArr;
    });
  };

  /**
   * 下へ移動
   */
  const moveItemDown = (index: number) => {
    setPlanItems((prev) => {
      if (index === prev.length - 1) return prev; // 最後は下に移動できない
      const newArr = [...prev];
      const temp = newArr[index + 1];
      newArr[index + 1] = newArr[index];
      newArr[index] = temp;
      return newArr;
    });
  };

  /**
   * 削除
   */
  const removeItem = (index: number) => {
    setPlanItems((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * 新規アイテム追加
   */
  const addNewItem = () => {
    // フォームが空の場合のバリデーション (簡易)
    if (!newTimeRange || !newSpotName) {
      alert("時間帯とスポット名は必須です");
      return;
    }

    const newItem: PlanItem = {
      timeRange: newTimeRange,
      spotName: newSpotName,
      description: newDescription,
    };
    setPlanItems((prev) => [...prev, newItem]);

    // 入力フォームをリセット＆非表示に
    setNewTimeRange("");
    setNewSpotName("");
    setNewDescription("");
    setShowAddForm(false);
  };

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">プラン編集機能サンプル</h1>

      {/* 現在のプラン一覧 */}
      <div className="space-y-4">
        {planItems.map((item, index) => (
          <div
            key={index}
            className="border rounded p-3 flex items-start gap-3 bg-white shadow"
          >
            <div className="flex-grow">
              <p className="font-bold">{item.timeRange}</p>
              <p>{item.spotName}</p>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => moveItemUp(index)}
                className="text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
              >
                ↑
              </button>
              <button
                onClick={() => moveItemDown(index)}
                className="text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
              >
                ↓
              </button>
              <button
                onClick={() => removeItem(index)}
                className="text-sm bg-red-300 px-2 py-1 rounded hover:bg-red-400"
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 新規追加 */}
      <div className="mt-6">
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + アイテムを追加
          </button>
        )}
        {showAddForm && (
          <div className="border rounded p-3 mt-2 bg-white shadow space-y-2">
            <div>
              <label className="block text-sm font-semibold">時間帯</label>
              <input
                type="text"
                value={newTimeRange}
                onChange={(e) => setNewTimeRange(e.target.value)}
                className="w-full border px-2 py-1 rounded"
                placeholder="例) 14:00 - 15:00"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">スポット名</label>
              <input
                type="text"
                value={newSpotName}
                onChange={(e) => setNewSpotName(e.target.value)}
                className="w-full border px-2 py-1 rounded"
                placeholder="例) ○○美術館"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">説明</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full border px-2 py-1 rounded"
                rows={3}
                placeholder="概要やおすすめポイントなど"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={addNewItem}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                追加
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
