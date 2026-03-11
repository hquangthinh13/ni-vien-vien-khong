import { fetchIntroductionPage } from "@/features/introductionPage/api/introductionPage.api";
import IntroTimelineView from "@/features/introductionPage/ui/IntroTimelineView";
import lineOrnament from "@/public/ornament-01.svg";
import Image from "next/image";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Thời Khóa Tu Tập",
};
export default async function IntroductionPage() {
  const response = await fetchIntroductionPage({
    populate: "*",
  });

  const data = response.data;

  if (!data) return <div>Không tìm thấy dữ liệu.</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 my-10">
      <div className="flex flex-col gap-6 items-center mb-6">
        <h2 className="font-bold text-2xl uppercase tracking-wider relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-primary">
          {data.title}
        </h2>
        <div className="opacity-80">
          <Image src={lineOrnament} alt="Ornament" className="w-auto h-6" />
        </div>
      </div>{" "}
      <IntroTimelineView data={data} />
    </div>
  );
}
