"use client";
import QRCode from "react-qr-code";
import { Clipboard } from "flowbite-react";

type SharePageProps = {
  event: string;
};

const SharePage = ({ event = "https://google.com" }: SharePageProps) => {
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
          value="https://www.placeholder.com/event/asdg23asdfasd"
          disabled
          readOnly
        />
        <Clipboard.WithIcon valueToCopy="https://www.placeholder.com/event/asdg23asdfasd" />
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
