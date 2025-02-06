export type WeatherInfo = {
    icon: string;     // "晴れ" "雨" などのアイコン文字
    highTemp: string; // 最高気温 (例: "25")
    lowTemp: string;  // 最低気温 (例: "18")
};

export type Accommodation ={
    name: string;
    description: string;
}
export type ScheduleItem = {
    timeRange: string;   // 例: "09:00 - 10:00"
    spotName: string;    // スポットの名前
    description: string; // 概要・おすすめポイント
};

export type DayPlan = {
    date: string;              // その日のYYYY-MM-DD (or "Day1"のように表す場合も)
    weather: WeatherInfo;      // 天気情報
    schedule: ScheduleItem[];  // 1日のスケジュール一覧
    accommodation?: Accommodation;    // 宿泊施設(複数日旅行の場合)
};

// AIから返ってくる場合は "plan" が DayPlan[] の形
export type TravelPlan = {
    plan: DayPlan[];
};
