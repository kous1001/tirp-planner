"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { DayPlan } from "@/types/DayPlan"; // ScheduleItemを削除
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from "@hello-pangea/dnd";

type PlanEditorProps = {
    dayPlans: DayPlan[];
    setDayPlans: Dispatch<SetStateAction<DayPlan[]>>;
    onFinish: () => void; // 編集完了 or キャンセルの合図用
};

export default function PlanEditor({
    dayPlans,
    setDayPlans,
    onFinish,
}: PlanEditorProps) {
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
                description: newAccommodationDesc,
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

    // ----------------------------------------------------
    // 各日内のスケジュール操作
    // ----------------------------------------------------

    // ドラッグ終了時のハンドラー
    const handleDragEnd = (result: DropResult, dayIndex: number) => {
        if (!result.destination) return;

        const items = Array.from(dayPlans[dayIndex].schedule);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const newDayPlans = [...dayPlans];
        newDayPlans[dayIndex] = {
            ...newDayPlans[dayIndex],
            schedule: items,
        };
        setDayPlans(newDayPlans);
    };

    const handleTimeChange = (dayIndex: number, itemIndex: number, value: string) => {
        setDayPlans(prev => {
            const newPlans = [...prev];
            newPlans[dayIndex].schedule[itemIndex].timeRange = value;
            return newPlans;
        });
    };

    const handleSpotChange = (dayIndex: number, itemIndex: number, value: string) => {
        setDayPlans(prev => {
            const newPlans = [...prev];
            newPlans[dayIndex].schedule[itemIndex].spotName = value;
            return newPlans;
        });
    };

    const handleDeleteSpot = (dayIndex: number, itemIndex: number) => {
        setDayPlans(prev => {
            const newPlans = [...prev];
            newPlans[dayIndex].schedule = newPlans[dayIndex].schedule.filter((_, i) => i !== itemIndex);
            return newPlans;
        });
    };

    const handleDescriptionChange = (dayIndex: number, itemIndex: number, value: string) => {
        setDayPlans(prev => {
            const newPlans = [...prev];
            newPlans[dayIndex].schedule[itemIndex].description = value;
            return newPlans;
        });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">プラン編集</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
                {dayPlans.map((day, dayIndex) => (
                    <div key={dayIndex} className="border p-4 rounded-lg min-w-[300px]">
                        <h3 className="text-lg font-semibold mb-4">
                            Day {dayIndex + 1}: {day.date}
                        </h3>
                        
                        <DragDropContext 
                            onDragEnd={(result: DropResult) => handleDragEnd(result, dayIndex)}
                        >
                            <Droppable droppableId={`day-${dayIndex}`}>
                                {(provided: DroppableProvided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="space-y-2"
                                    >
                                        {day.schedule.map((item, itemIndex) => (
                                            <Draggable
                                                key={itemIndex}
                                                draggableId={`item-${dayIndex}-${itemIndex}`}
                                                index={itemIndex}
                                            >
                                                {(provided: DraggableProvided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="bg-white p-4 rounded shadow-sm border hover:border-blue-500 cursor-move"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <input
                                                                type="text"
                                                                value={item.timeRange}
                                                                onChange={(e) => handleTimeChange(dayIndex, itemIndex, e.target.value)}
                                                                className="border rounded px-2 py-1 w-32"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={item.spotName}
                                                                onChange={(e) => handleSpotChange(dayIndex, itemIndex, e.target.value)}
                                                                className="border rounded px-2 py-1 flex-1 mx-2"
                                                            />
                                                            <button
                                                                onClick={() => handleDeleteSpot(dayIndex, itemIndex)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                削除
                                                            </button>
                                                        </div>
                                                        <textarea
                                                            value={item.description}
                                                            onChange={(e) => handleDescriptionChange(dayIndex, itemIndex, e.target.value)}
                                                            className="border rounded px-2 py-1 w-full mt-2"
                                                            rows={2}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>

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
                                    <label className="block text-sm font-semibold">
                                        宿泊施設 (オプション)
                                    </label>
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
                                        placeholder="説明など"
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
                ))}
            </div>
        </div>
    );
}
