import { NextResponse } from "next/server";
import { OpenAI } from "openai";

// 環境変数からOpenAIのAPIキーを取得
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // .env.localに設定
});

export async function POST(request: Request) {
    try {
        const { startDate, endDate, area, interests, budget, transportation } = await request.json();

        // 必要に応じて入力チェック
        if (!startDate || !endDate || !transportation || !area) {
            return NextResponse.json(
                { error: "Date and area are required." },
                { status: 400 }
            );
        }

        // ----------------------------
        // 1) AIに送るプロンプトの作成
        // ----------------------------
        // ここでは単純なテキスト生成例を挙げますが、
        // 実際には「JSON形式で返してね」と促すなど工夫してください。
        const prompt = `
        - あなたは非常に優秀な旅行プランナーAIです。
        - ユーザーの利用可能な時間と予算を考慮し、満足度が高くなるようなお出かけ/旅行プランを提案してください。
        - 期間が複数日ある場合は、各日ごとにおすすめの宿泊施設を1つ提案してください。
        - また、訪問する観光地の最新の天気予報（天気アイコン、最高気温、最低気温）も含めてください。
        
        以下がユーザーの希望条件です:
        期間: ${startDate}～${endDate}
        エリア: ${area}
        交通手段: ${transportation}
        興味ジャンル: ${interests?.join("、") || "指定なし"}
        予算: ${budget ? `1人あたり～${budget}円` : "特に指定なし"}
        
        【出力形式】
        必ず下記のJSON構造で回答してください（厳守）:
        
        {
          "plan": [
            {
              "date": "YYYY-MM-DD",
              "weather": {
                "icon": "晴れ/雨などのアイコン",
                "highTemp": "最高気温（数値）",
                "lowTemp": "最低気温（数値）"
              },
              "schedule": [
                {
                  "timeRange": "xx:xx - xx:xx",
                  "spotName": "スポットの名前",
                  "description": "概要やおすすめポイント"
                }
              ],
              "accommodation(複数日の場合に推奨)": {
                "name": "宿泊施設名",
                "description": "宿泊施設の特徴やおすすめポイント"
              }
            }
          ]
        }
        
        必ず上記のJSON形式を厳守し、鍵カッコや配列構造を変えないでください。
        `;
        // ----------------------------
        // 2) OpenAI API呼び出し
        // ----------------------------
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // GPT-4を使う場合は "gpt-4"
            messages: [
                { role: "system", content: "あなたは優秀な旅行プランナーAIです。" },
                { role: "user", content: prompt },
            ],
            temperature: 0.1,
        });

        // 3) レスポンスを取得
        const rawOutput = response.choices[0]?.message?.content?.trim();
        if (!rawOutput) {
            return NextResponse.json({ error: "No response from AI" }, { status: 500 });
        }

        // ----------------------------
        // 3) 文字列をJSONにパース
        // ----------------------------
        // GPTが正しくJSONを返さない可能性もあるのでtry-catchで対応
        let planData;
        try {
            planData = JSON.parse(rawOutput);
        } catch (err) {
            console.log(err);
            // JSONパースに失敗したらデータをそのまま返す or エラー処理
            return NextResponse.json(
                { error: "Failed to parse AI response as JSON", rawOutput },
                { status: 500 }
            );
        }

        // 結果を返却
        return NextResponse.json(planData, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("[generatePlan Error]", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
