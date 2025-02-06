"use client";

import { Dispatch, SetStateAction, useState } from "react";

// プランアイテムの型
export type PlanItem = {
  timeRange: string;
  spotName: string;
  description: string;
};

type PlanEditorProps = {
  planItems: PlanItem[];
  setPlanItems: Dispatch<SetStateAction<PlanItem[]>>;
  onFinish: () => void;  // 編集完了 or キャンセルの合図用
};

export default function PlanEditor({
  planItems,
  setPlanItems,
  onFinish,
}: PlanEditorProps) {
  // 新規追加フォーム制御用
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTimeRange, setNewTimeRange] = useState("");
  const [newSpotName, setNewSpotName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // 順番を上へ
  const moveItemUp = (index: number) => {
    if (index === 0) return;
    setPlanItems((prev) => {
      const newArr = [...prev];
      [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
      return newArr;
    });
  };

  // 順番を下へ
  const moveItemDown = (index: number) => {
    setPlanItems((prev) => {
      if (index === prev.length - 1) return prev;
      const newArr = [...prev];
      [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
      return newArr;
    });
  };

  // 削除
  const removeItem = (index: number) => {
    setPlanItems((prev) => prev.filter((_, i) => i !== index));
  };

  // 新規アイテム追加
  const addNewItem = () => {
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

    // フォームリセット
    setNewTimeRange("");
    setNewSpotName("");
    setNewDescription("");
    setShowAddForm(false);
  };

  return (
    <div className="p-3 border rounded bg-white shadow">
      <h2 className="text-xl font-bold mb-4">プラン編集</h2>

      {/* プラン一覧 */}
      <div className="space-y-4">
        {planItems.map((item, index) => (
          <div
            key={index}
            className="border rounded p-3 flex items-start gap-3 bg-gray-50"
          >
            <div className="flex-grow">
              <p className="font-bold">{item.timeRange}</p>
              <p>{item.spotName}</p>
              <p className="text-sm text-gray-600">{item.description}</p>
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
      <div className="mt-4">
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + アイテムを追加
          </button>
        )}
        {showAddForm && (
          <div className="border rounded p-3 mt-2 bg-gray-50 space-y-2">
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
                rows={2}
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
                onClick={() => {
                  setShowAddForm(false);
                  setNewTimeRange("");
                  setNewSpotName("");
                  setNewDescription("");
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => onFinish()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          編集完了
        </button>
        <button
          onClick={() => onFinish()}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}
