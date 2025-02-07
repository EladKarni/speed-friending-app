import { Clipboard } from "flowbite-react";

const CopyLinkInput = ({ url }: { url: string }) => {
  return (
    <div className="relative">
      <label htmlFor="npm-install" className="sr-only">
        Event URL
      </label>
      <input
        id="npm-install"
        type="text"
        className="col-span-6 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        value={url}
        disabled
        readOnly
      />
      <Clipboard.WithIcon valueToCopy={url} />
    </div>
  );
};

export default CopyLinkInput;
