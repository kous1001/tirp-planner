"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { DayPlan, ScheduleItem } from "@/types/DayPlan"; // など
import DayBlock from "./DayBlock";

type PlanEditorProps = {
    dayPlans: DayPlan[];
    setDayPlans: Dispatch<SetStateAction<DayPlan[]>>;
    onFinish: () => void;  // 編集完了 or キャンセルの合図用
};

export default function PlanEditor({ dayPlans, setDayPlans, onFinish }: PlanEditorProps) {
    // 「新しい日」を追加するフォーム制御 (日付や宿泊施設の入力)
    const [showAddDayForm, setShowAddDayForm] = useState(false);
    const [newDate, setNewDate] = useState("");
    const [newAccommodationName, setNewAccommodationName] = useState("");
    const [newAccommodationDesc, setNewAccommodationDesc] = useState("");

    // ----------------------------------------------------
    // 日ごとの操作
    // ----------------------------------------------------
    const addNewDay = () => {
        if (!newDate) {
            alert("日付を入力してください");
            return;
        }
        const newDay: DayPlan = {
            date: newDate,
            accommodation: {
                name: newAccommodationName,
                description: newAccommodationDesc
            },
            schedule: [],
            weather: {
                icon: "",
                highTemp: "",
                lowTemp: "",
            },
        };
        setDayPlans((prev) => [...prev, newDay]);

        // フォームリセット
        setNewDate("");
        setNewAccommodationName("");
        setNewAccommodationDesc("");
        setShowAddDayForm(false);
    };

    const removeDay = (index: number) => {
        setDayPlans((prev) => prev.filter((_, i) => i !== index));
    };

    const moveDayUp = (index: number) => {
        if (index === 0) return;
        setDayPlans((prev) => {
            const newArr = [...prev];
            [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
            return newArr;
        });
    };

    const moveDayDown = (index: number) => {
        setDayPlans((prev) => {
            if (index === prev.length - 1) return prev;
            const newArr = [...prev];
            [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
            return newArr;
        });
    };

    // ----------------------------------------------------
    // 各日内のスケジュール操作
    // ----------------------------------------------------
    const addScheduleItem = (dayIndex: number, newItem: ScheduleItem) => {
        setDayPlans((prev) => {
            const newArr = [...prev];
            newArr[dayIndex].schedule = [...newArr[dayIndex].schedule, newItem];
            return newArr;
        });
    };

    const removeScheduleItem = (dayIndex: number, itemIndex: number) => {
        setDayPlans((prev) => {
            const newArr = [...prev];
            newArr[dayIndex].schedule = newArr[dayIndex].schedule.filter((_, i) => i !== itemIndex);
            return newArr;
        });
    };

    const moveScheduleItemUp = (dayIndex: number, itemIndex: number) => {
        if (itemIndex === 0) return;
        setDayPlans((prev) => {
            const newArr = [...prev];
            const schedule = [...newArr[dayIndex].schedule];
            [schedule[itemIndex - 1], schedule[itemIndex]] = [schedule[itemIndex], schedule[itemIndex - 1]];
            newArr[dayIndex].schedule = schedule;
            return newArr;
        });
    };

    const moveScheduleItemDown = (dayIndex: number, itemIndex: number) => {
        setDayPlans((prev) => {
            const newArr = [...prev];
            const schedule = [...newArr[dayIndex].schedule];
            if (itemIndex < schedule.length - 1) {
                [schedule[itemIndex + 1], schedule[itemIndex]] = [schedule[itemIndex], schedule[itemIndex + 1]];
            }
            newArr[dayIndex].schedule = schedule;
            return newArr;
        });
    };


    return (
        <div className="p-3 border rounded bg-white shadow">
            <h2 className="text-xl font-bold mb-4">複数日プラン編集</h2>

            {/* 日ごとの表示 */}
            <div>
                {dayPlans.map((dayPlan, index) => <DayBlock
                    key={index}
                    dayPlan={dayPlan}
                    dayIndex={index}
                    removeDay={removeDay}
                    moveDayUp={moveDayUp}
                    moveDayDown={moveDayDown}
                    addScheduleItem={addScheduleItem}
                    removeScheduleItem={removeScheduleItem}
                    moveScheduleItemUp={moveScheduleItemUp}
                    moveScheduleItemDown={moveScheduleItemDown}
                />)}
            </div>

            {/* 新しい日を追加 */}
            {!showAddDayForm ? (
                <button
                    onClick={() => setShowAddDayForm(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    + 日を追加
                </button>
            ) : (
                <div className="border rounded p-3 mt-2 bg-gray-50 space-y-2">
                    <div>
                        <label className="block text-sm font-semibold">日付</label>
                        <input
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="w-full border px-2 py-1 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold">宿泊施設 (オプション)</label>
                        <input
                            type="text"
                            value={newAccommodationName}
                            onChange={(e) => setNewAccommodationName(e.target.value)}
                            className="w-full border px-2 py-1 rounded"
                            placeholder="例: ○○ホテル"
                        />
                        <input
                            type="text"
                            value={newAccommodationDesc}
                            onChange={(e) => setNewAccommodationDesc(e.target.value)}
                            className="w-full border px-2 py-1 rounded"
                            placeholder="例: ○○ホテル"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={addNewDay}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            追加
                        </button>
                        <button
                            onClick={() => {
                                setShowAddDayForm(false);
                                setNewDate("");
                                setNewAccommodationName("");
                                setNewAccommodationDesc("");
                            }}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            キャンセル
                        </button>
                    </div>
                </div>
            )}

            {/* 完了ボタン */}
            <div className="mt-6 flex gap-2">
                <button
                    onClick={onFinish}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    編集完了
                </button>
                <button
                    onClick={onFinish}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                    キャンセル
                </button>
            </div>
        </div>
    );
}
