import { Topbar } from "@/components/layout/Topbar";
import { CampaignGenerator } from "@/components/generators/CampaignGenerator";

export default function Page() {
  return (
    <>
      <Topbar
        title="Campaigns"
        subtitle="Multi-tone copy engineered for launch."
      />
      <div className="px-6 lg:px-10 py-8 max-w-[1400px] w-full mx-auto">
        <CampaignGenerator />
      </div>
    </>
  );
}
