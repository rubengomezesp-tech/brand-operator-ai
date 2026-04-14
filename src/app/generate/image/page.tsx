import { Topbar } from "@/components/layout/Topbar";
import { ImageGenerator } from "@/components/generators/ImageGenerator";

export default function Page() {
  return (
    <>
      <Topbar
        title="Product Imagery"
        subtitle="Editorial-grade visuals, from a single prompt."
      />
      <div className="px-6 lg:px-10 py-8 max-w-[1400px] w-full mx-auto">
        <ImageGenerator />
      </div>
    </>
  );
}
