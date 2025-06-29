"use client";

import { MultiFileDropzoneUsage } from "@/components/upload_front";
import { useState } from "react";
import { encode } from "@/lib/huffman_code.js";
import CopyTextArea from "@/components/custom_text_area";


const Page = () => {
  const [text, setText] = useState();
  const [encoded, setEncoded] = useState(null);

  const processFile = (fileString) => {
    // console.log("Conteudo do arquivo: ", fileString);
    setText(fileString);

    const result = encode(fileString);
    setEncoded(result);
  }

  return (
    <div className="space-y-4">
      <h1 className="h3 text-center">Insira aqui o seu arquivo</h1>
      <MultiFileDropzoneUsage onUploadFile={processFile}/>
      {encoded && <div>
        <h3 className="h3 mt-6 text-center">Texto Codificado</h3>
        <CopyTextArea value={encoded}/>
      </div>}
    </div>
  );
};

export default Page;
