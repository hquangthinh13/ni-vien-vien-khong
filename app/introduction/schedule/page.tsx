import { fetchIntroductionPage } from "@/components/IntroductionPage/IntroductionPage.service";
import IntroTimelineView from "@/components/IntroductionPage/IntroTimelineView";

export default async function IntroductionPage() {
  // Fetch dữ liệu với population cần thiết (ví dụ: coverImage, activities)
  const response = await fetchIntroductionPage({
    populate: "*",
  });

  const data = response.data;

  if (!data) return <div>Không tìm thấy dữ liệu.</div>;

  return (
    <main className="max-w-6xl mx-auto">
      <IntroTimelineView data={data} />
    </main>
  );
}
