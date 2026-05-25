import Image from "next/image";
import ornament from "@/public/ornament-01.svg";

export default function DetailDivider() {
  return (
    <div className="my-12 flex w-full justify-center opacity-80">
      <Image src={ornament} alt="Ornament" className="h-6 w-auto" />
    </div>
  );
}
