"use client";
import QRCode from "react-qr-code";
import { Clipboard } from "flowbite-react";
import { useSearchParams } from "next/navigation";
import CopyLinkInput from "@/components/ui/copyLinkInput";

type SharePageProps = {
  event: string;
};

const SharePage = ({ event = "https://google.com" }: SharePageProps) => {
  const searchParams = useSearchParams();
  const event_id = searchParams.get("event_id");

  const shareableUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/event?event_id=${event_id}`;

  if (!event_id) {
    return <div>No event selected</div>;
  }

  return (
    <div className="max-w-md mx-auto grid gap-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Use the provided link or QR code to get the shareable URL for this
        specific event.
      </p>
      <QRCode
        size={256}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        value={event}
        viewBox={`0 0 256 256`}
      />
    </div>
  );
};

export default SharePage;
