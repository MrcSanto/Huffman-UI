import { useState } from "react";
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';


export default function CopyTextArea({ value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!navigator.clipboard) {
        console.warn("Clipboard API não está disponível!")
        return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar texto:", err);
    }
  };

  return (
    <div className="relative">
      <textarea
        readOnly
        value={value}
        className="w-full h-64 p-4 pr-4 pt-10 border border-gray-300 rounded-md resize-none bg-white text-sm text-green-500"
      />
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 flex items-center gap-1 px-3 py-1.5 bg-gray-800 text-white text-xs rounded hover:bg-gray-700 transition"
      >
        {copied ? (
          <>
            <CheckIcon className="h-4 w-4 text-green-400" />
            Copiado!
          </>
        ) : (
          <>
            <ClipboardIcon className="h-4 w-4" />
            Copiar
          </>
        )}
      </button>
    </div>
  );
}
