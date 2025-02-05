// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-6">
        AIでお出かけプランを作ろう
      </h1>
      <p className="text-gray-700 text-center max-w-xl mb-8">
        このサイトでは、あなたの希望条件に合わせてAIが最適なプランを提案します。
        <br />
        まずは「プランを作る」ボタンから始めてみましょう。
      </p>

      <Link
        href="/createPlan"
        className="px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition-colors"
      >
        プランを作る
      </Link>
    </main>
  );
}
