"use client";
import QRCode from "react-qr-code";
import { Clipboard } from "flowbite-react";
import { useSearchParams } from "next/navigation";

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
      <div className="relative">
        <label htmlFor="npm-install" className="sr-only">
          Event URL
        </label>
        <input
          id="npm-install"
          type="text"
          className="col-span-6 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          value={shareableUrl}
          disabled
          readOnly
        />
        <Clipboard.WithIcon valueToCopy={shareableUrl} />
      </div>
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
