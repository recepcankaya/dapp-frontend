"use client";
import Image from "next/image";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";

export default function CampaignCarousel({ campaigns }: { campaigns: any[] }) {
  return (
    <AwesomeSlider>
      {campaigns.map((campaign) => (
        <div key={campaign.campaign_id}>
          <div
            data-src={`${campaign.campaign_name.replace(
              "ipfs://",
              "https://ipfs.io/ipfs/"
            )}`}
          />
        </div>
      ))}
    </AwesomeSlider>
  );
}
