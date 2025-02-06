import { NextResponse } from "next/server";
import { OpenAI } from "openai";

// 環境変数からOpenAIのAPIキーを取得
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // .env.localに設定
  });

export async function POST(request: Request) {
  try {
    const { date, area, interests, budget } = await request.json();

    // 必要に応じて入力チェック
    if (!date || !area) {
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
あなたは旅行プランナーです。
ユーザーから以下の条件で、1日の簡単なお出かけプランを提案してください。

日付: ${date}
エリア: ${area}
興味ジャンル: ${interests?.join("、") || "指定なし"}
予算: ${budget ? `1人あたり～${budget}円` : "特に指定なし"}

下記の形式で回答してください（JSON形式）:
{
  "plan": [
    {
      "timeRange": "xx:xx - xx:xx",
      "spotName": "スポットの名前",
      "description": "概要やおすすめポイント"
    },
    ...
  ]
}
必ず上記の形式を厳守してください。
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
    if(error instanceof Error){
        console.error("[generatePlan Error]", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
