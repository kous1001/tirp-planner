"use client";

import { useState } from "react";
import { DayPlan, ScheduleItem } from "@/types/DayPlan";

type DayBlockProps = {
    dayPlan: DayPlan;
    dayIndex: number;
    removeDay: (index: number) => void;
    moveDayUp: (index: number) => void;
    moveDayDown: (index: number) => void;
    addScheduleItem: (dayIndex: number, newItem: ScheduleItem) => void;
    removeScheduleItem: (dayIndex: number, itemIndex: number) => void;
    moveScheduleItemUp: (dayIndex: number, itemIndex: number) => void;
    moveScheduleItemDown: (dayIndex: number, itemIndex: number) => void;
};

export default function DayBlock({
    dayPlan,
    dayIndex,
    removeDay,
    moveDayUp,
    moveDayDown,
    addScheduleItem,
    removeScheduleItem,
    moveScheduleItemUp,
    moveScheduleItemDown,
}: DayBlockProps) {
    // スポット追加用フォームステート
    const [showAddSpotForm, setShowAddSpotForm] = useState(false);
    const [newTimeRange, setNewTimeRange] = useState("");
    const [newSpotName, setNewSpotName] = useState("");
    const [newDescription, setNewDescription] = useState("");

    const handleAddSpot = () => {
        if (!newTimeRange || !newSpotName) {
            alert("時間帯とスポット名は必須です");
            return;
        }
        const newItem: ScheduleItem = {
            timeRange: newTimeRange,
            spotName: newSpotName,
            description: newDescription,
        };
        addScheduleItem(dayIndex, newItem);

        // リセット
        setNewTimeRange("");
        setNewSpotName("");
        setNewDescription("");
        setShowAddSpotForm(false);
    };

    const { date, accommodation, schedule } = dayPlan;

    return (
        <div className="border rounded p-3 bg-gray-50 mb-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">
                    {date}
                    {accommodation && (
                        <span className="text-sm text-gray-500">（宿泊: {accommodation.name} - {accommodation.description}）</span>
                    )}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => moveDayUp(dayIndex)}
                        className="bg-gray-200 text-sm px-2 py-1 rounded hover:bg-gray-300"
                    >
                        ↑
                    </button>
                    <button
                        onClick={() => moveDayDown(dayIndex)}
                        className="bg-gray-200 text-sm px-2 py-1 rounded hover:bg-gray-300"
                    >
                        ↓
                    </button>
                    <button
                        onClick={() => removeDay(dayIndex)}
                        className="bg-red-300 text-sm px-2 py-1 rounded hover:bg-red-400"
                    >
                        削除
                    </button>
                </div>
            </div>

            {/* スケジュール一覧 */}
            <div className="mt-3 space-y-3">
                {schedule.map((item, i) => (
                    <div key={i} className="border rounded p-2 flex gap-3 bg-white">
                        <div className="flex-grow">
                            <p className="font-bold">{item.timeRange}</p>
                            <p>{item.spotName}</p>
                            <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <button
                                onClick={() => moveScheduleItemUp(dayIndex, i)}
                                className="bg-gray-200 text-sm px-2 py-1 rounded hover:bg-gray-300"
                            >
                                ↑
                            </button>
                            <button
                                onClick={() => moveScheduleItemDown(dayIndex, i)}
                                className="bg-gray-200 text-sm px-2 py-1 rounded hover:bg-gray-300"
                            >
                                ↓
                            </button>
                            <button
                                onClick={() => removeScheduleItem(dayIndex, i)}
                                className="bg-red-300 text-sm px-2 py-1 rounded hover:bg-red-400"
                            >
                                削除
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* スポット追加ボタン */}
            {!showAddSpotForm ? (
                <button
                    onClick={() => setShowAddSpotForm(true)}
                    className="mt-3 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                >
                    + スポットを追加
                </button>
            ) : (
                <div className="border rounded p-3 mt-2 bg-white space-y-2">
                    <div>
                        <label className="block text-sm font-semibold">時間帯</label>
                        <input
                            type="text"
                            value={newTimeRange}
                            onChange={(e) => setNewTimeRange(e.target.value)}
                            className="w-full border px-2 py-1 rounded"
                            placeholder="例: 10:00 - 11:00"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold">スポット名</label>
                        <input
                            type="text"
                            value={newSpotName}
                            onChange={(e) => setNewSpotName(e.target.value)}
                            className="w-full border px-2 py-1 rounded"
                            placeholder="例: ○○美術館"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold">説明</label>
                        <textarea
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            className="w-full border px-2 py-1 rounded"
                            rows={2}
                            placeholder="概要やおすすめポイント"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleAddSpot}
                            className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                        >
                            追加
                        </button>
                        <button
                            onClick={() => {
                                setShowAddSpotForm(false);
                                setNewTimeRange("");
                                setNewSpotName("");
                                setNewDescription("");
                            }}
                            className="bg-gray-300 text-gray-700 px-4 py-1 rounded hover:bg-gray-400"
                        >
                            キャンセル
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
