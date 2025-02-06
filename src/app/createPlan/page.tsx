"use client";
import { useState, useEffect } from "react";
import PlanEditor from "./PlanEditor";
import { DayPlan } from "@/types/DayPlan"; // 上で定義した型ファイルなど
import { v4 as uuidv4 } from "uuid"; // crypto.randomUUID()でもOK

export default function CreatePlanPage() {
    //   const [date, setDate] = useState("");
    const [startDate, setStartDate] = useState(""); // 例: "2025-01-01"
    const [endDate, setEndDate] = useState(""); // 例: "2025-01-06"
    const [transportation, setTransportation] = useState("車");
    const [area, setArea] = useState("");
    const [interests, setInterests] = useState<string[]>([]);
    const [customInterest, setCustomInterest] = useState("");
    const [budget, setBudget] = useState("");
    const [customBudget, setCustomBudget] = useState(""); // ユーザーのオリジナル予算

    // ローディング・エラー・レスポンス格納用
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    // const [planItems, setPlanItems] = useState<PlanItem[]>([]);
    const [isEditing, setIsEditing] = useState(false); // 編集モードのフラグ
    const [shareUrls, setShareUrls] = useState<string[]>([]);
    const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);

    const toggleInterest = (interest: string) => {
        setInterests((prev) =>
            prev.includes(interest)
                ? prev.filter((i) => i !== interest)
                : [...prev, interest]
        );
    };

    useEffect(() => {
        const storedList = localStorage.getItem("tripPlannerList");
        if (storedList) {
            const planIdArray: string[] = JSON.parse(storedList);
            // planIdごとに URL を生成
            const urls = planIdArray.map(
                (id) => `${window.location.origin}/plans/${id}`
            );
            setShareUrls(urls);
        }
    }, []);

    // ------------------
    // AI提案リクエスト
    // ------------------
    const generatePlan = async () => {
        try {
            setIsLoading(true);
            setError("");
            setDayPlans([]);
            const finalBudget =
                budget === "custom" && customBudget ? customBudget : budget;
            const res = await fetch("/api/generatePlan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    startDate,
                    endDate,
                    transportation,
                    area,
                    interests,
                    budget: finalBudget,
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
            setDayPlans(data.plan);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // ============================
    // プランをローカルストレージに保存
    // ============================
    const handleSavePlan = () => {
        if (dayPlans.length === 0) {
            alert("プランがありません");
            return;
        }
        // ユニークIDを生成
        const planId = uuidv4();
        // あるいは: const planId = crypto.randomUUID(); (ブラウザ対応要確認)

        // localStorageに保存 (キー: "tripPlanner_{planId}")
        localStorage.setItem(`tripPlanner_${planId}`, JSON.stringify(dayPlans));

        // 既存のplanIdリストを読み込み
        const storedList = localStorage.getItem("tripPlannerList");
        const planIdArray: string[] = storedList ? JSON.parse(storedList) : [];

        // 新しいplanIdを追加
        planIdArray.push(planId);
        localStorage.setItem("tripPlannerList", JSON.stringify(planIdArray));

        // shareUrlsを更新 (全planIdのURLを再生成)
        const urls = planIdArray.map(
            (id) => `${window.location.origin}/plans/${id}`
        );
        setShareUrls(urls);
    };

    // フォーム送信時のハンドラ
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        generatePlan();
    };

    return (
        <main className="max-w-screen-lg mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">お出かけプラン作成</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 日付 */}
                <div>
                    <label className="block mb-1 font-semibold">日付</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <span>～</span>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    <p className="text-sm text-gray-500">
                        ※開始日と終了日が同じ場合は1日プランとして扱う
                    </p>
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

                {/* お出かけ方式（交通手段） */}
                <div>
                    <label className="block mb-1 font-semibold">交通手段</label>
                    <select
                        value={transportation}
                        onChange={(e) => setTransportation(e.target.value)}
                    >
                        <option value="車">車</option>
                        <option value="バイク">バイク</option>
                        <option value="電車">電車</option>
                        {/* 必要に応じて追加 */}
                    </select>
                </div>

                {/* 興味ジャンル */}
                <div>
                    <label className="block mb-1 font-semibold">興味・ジャンル</label>
                    <div className="flex gap-2 flex-wrap">
                        {[
                            "カフェ",
                            "ショッピング",
                            "アウトドア",
                            "美術館",
                            "神社",
                            "温泉",
                            "キャンプ",
                            "グルメ",
                        ].map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => toggleInterest(item)}
                                className={`px-3 py-1 rounded border ${interests.includes(item)
                                    ? "bg-blue-500 text-white"
                                    : "bg-white text-gray-700"
                                    }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                    {/* ユーザーが自由入力する欄 */}
                    <div className="mt-2 flex gap-2">
                        <input
                            type="text"
                            placeholder="その他のジャンルを入力"
                            value={customInterest}
                            onChange={(e) => setCustomInterest(e.target.value)}
                            className="border px-2 py-1 rounded"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                if (customInterest.trim() !== "") {
                                    setInterests((prev) => [...prev, customInterest.trim()]);
                                    setCustomInterest("");
                                }
                            }}
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                            ジャンル追加
                        </button>
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
                        <option value="custom">その他</option>
                    </select>
                    {budget === "custom" && (
                        <div className="mt-2">
                            <label className="block mb-1 font-semibold">
                                オリジナル予算 (円)
                            </label>
                            <input
                                type="number"
                                value={customBudget}
                                onChange={(e) => setCustomBudget(e.target.value)}
                                className="w-full border px-2 py-1 rounded"
                                placeholder="例: 8000"
                            />
                        </div>
                    )}
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
            {error && <div className="mt-4 text-red-600">エラー: {error}</div>}

            {/* AI応答表示 or 編集UI */}
            {!isEditing ? (
                <div className="mt-6">
                    {/* プランがあれば表示 */}
                    {dayPlans.length > 0 ? (
                        <div className="border rounded p-3 bg-white shadow">
                            <h2 className="text-xl font-semibold mb-2">AI提案プラン</h2>
                            {/* 横並び & wrap */}
                            <div className="flex flex-wrap gap-4">
                                {dayPlans.map((day, dayIndex) => (
                                    <div
                                        key={dayIndex}
                                        className="p-4 border border-gray-300 rounded-md shadow bg-white flex-1 min-w-[300px]"
                                    // ↑ flex-1 等で横幅を調整。min-w を設定すると、一定幅以下になると改行
                                    >
                                        {/* 日付とDayインデックス */}
                                        <h3 className="text-lg font-bold mb-2">
                                            Day {dayIndex + 1} : {day.date}
                                        </h3>

                                        {/* 天気情報 */}
                                        <div className="flex items-center text-sm mb-2">
                                            <span className="mr-2">
                                                天気:{" "}
                                                <span className="font-semibold">{day.weather.icon}</span>
                                            </span>
                                            <span className="text-gray-600">
                                                (最高: {day.weather.highTemp}℃ / 最低:{" "}
                                                {day.weather.lowTemp}℃)
                                            </span>
                                        </div>

                                        {/* 宿泊施設 (複数日の場合のみ推奨) */}
                                        {day.accommodation && (
                                            <>
                                                <p className="mb-2 text-sm text-blue-700">
                                                    宿泊先:{" "}
                                                    <span className="font-semibold">
                                                        {day.accommodation?.name}
                                                    </span>
                                                </p>
                                                <p className="mb-2 text-sm text-blue-700">
                                                    お勧めポイント:{" "}
                                                    <span className="font-semibold">
                                                        {day.accommodation?.description}
                                                    </span>
                                                </p>
                                            </>
                                        )}

                                        {/* 1日のスケジュール */}
                                        <div className="space-y-2">
                                            {day.schedule.map((item, idx) => (
                                                <div key={idx} className="p-2 bg-gray-50 rounded-md">
                                                    <div className="font-semibold">{item.timeRange}</div>
                                                    <div className="font-bold">{item.spotName}</div>
                                                    <p className="text-sm text-gray-600">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}


                            </div>
                            {/* 編集ボタンを別ブロックとして配置 */}
                            <div className="mt-4 flex justify-center">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    このプランを編集
                                </button>
                            </div>
                        </div>

                    ) : (
                        <p className="text-gray-600">プランがまだありません</p>
                    )}
                </div>
            ) : (
                // isEditing === true → PlanEditorコンポーネントを表示
                <div className="mt-6">
                    <PlanEditor
                        dayPlans={dayPlans}
                        setDayPlans={setDayPlans}
                        onFinish={() => setIsEditing(false)}
                    />
                </div>
            )}
            {/* プラン保存ボタン */}
            <div className="mt-6">
                <button
                    onClick={handleSavePlan}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    プランを保存
                </button>
            </div>
            {/* シェアURL表示 */}
            {/* すべてのプランURL一覧を表示 */}
            {shareUrls.length > 0 && (
                <div className="mt-6 p-3 bg-gray-100 border rounded">
                    <h3 className="font-bold mb-2">保存済みプランURL一覧</h3>
                    {shareUrls.map((url) => (
                        <div key={url} className="mb-1">
                            <a href={url} className="text-blue-600 underline">
                                {url}
                            </a>
                        </div>
                    ))}
                    <p className="text-sm text-gray-600 mt-2">
                        ※同じ端末・同じブラウザでのみアクセス可能です
                    </p>
                </div>
            )}
        </main>
    );
}
