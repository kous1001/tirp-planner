import PlanDetailClient from "./PlanDetailClient";
// export const dynamic = "force-dynamic";
export const dynamicParams = true;
// サーバーコンポーネントの場合、localStorageは直接使えないため
// クライアントコンポーネント化する必要があります。
// 以下はサーバーコンポーネントのファイルで書いていますが、
// 実際には "use client" としてクライアントコンポーネント化するか、
// もしくは別の方法（例: Routerイベント後に取りに行く）を使う必要があります.

// 簡易例としてサーバーコンポーネントで書く -> 実行時エラーの可能性
// 実際には "use client" を付けてReactコンポーネントで実装する想定。

export default async function PlanDetailPage({ params }: { params: { planId: string } }) {
  const { planId } = params;

  // ★【重要】App RouterのServer ComponentではブラウザAPI(localStorage)に直接アクセス不可です。
  //    そのため、本当は(notFound)のような動きしかできない。
  //    "use client" 化するか、他の方法が必要です。

  // 仕方なく「プランは見つかりませんでした」としておくサンプル:
  // (実際にはServer Componentでは localStorage に触れない)
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">プラン詳細</h1>
      <PlanDetailClient planId={planId} />
    </div>
  );
}
