import { Topbar } from "@/components/layout/Topbar";
import { CopyGenerator } from "@/components/generators/CopyGenerator";

export default function Page() {
  return (
    <>
      <Topbar
        title="Copywriting"
        subtitle="Taglines, hero lines, product stories — written with taste."
      />
      <div className="px-6 lg:px-10 py-8 max-w-[1400px] w-full mx-auto">
        <CopyGenerator />
      </div>
    </>
  );
}
