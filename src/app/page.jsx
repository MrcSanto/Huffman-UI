"use client";

import { MultiFileDropzoneUsage } from "@/components/upload_front";
import { useState } from "react";
import { getReadableChar } from "@/lib/utils";
import { ZoomableImage } from "@/components/custom_image_area";

const Page = () => {
  const [text, setText] = useState("");
  const [encoded, setEncoded] = useState(null);

  const [freqMap, setFreqMap] = useState(null);
  const [binaryMap, setBinaryMap] = useState(null);

  const [svgDataUrl, setSvgDataUrl] = useState(null);
  const [dotContent, setDotContent] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isOpen, setIsOpen] = useState(true);

  const processFile = async (fileString) => {
    // console.log("Conteudo do arquivo: ", fileString);
    setText(fileString);
    setIsLoading(true); // Iniciar carregamento
    setError(null);      // Limpar erros anteriores
    setEncoded(null);    // Limpar resultados anteriores
    setFreqMap(null);
    setBinaryMap(null);
    setSvgDataUrl(null);
    setDotContent(null);

    try {
      const response = await fetch('/api/generate-svg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({text: fileString}),
      });

      const data = await response.json();

      if (response.ok) {
        setEncoded(data.encoded);
        setFreqMap(data.frequencyMap);
        setBinaryMap(data.binaryMap);
        setSvgDataUrl(data.svgDataUrl);
        setDotContent(data.dot);
      } else {
        console.error("API Error:", data.message || data.details);
        setError(data.message || data.details || "Unknown error processing file.")
      }
    } catch (apiError) {
      console.error("Error calling /api/generate-svg:", apiError);
      setError("Could not connect to the server to process the file.");
    } finally {
      setIsLoading(false); 
    }
  }

  return (
    <div className="bg-white relative flex min-h-screen h-screen overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 left-4 z-50 bg-accent text-white p-2 rounded shadow-lg"
      >
        {isOpen ? '←' : '→'}
      </button>

      <aside
        className={`bg-secondary p-8 overflow-y-auto h-full transition-all duration-500 ease-in-out z-40 ${
          isOpen ? 'w-[35%]' : 'w-0 overflow-hidden'
        }`}
      >
        {isOpen && (
          <div>
            <h1 className="h2 text-center pt-10 pb-5">Insira aqui o seu arquivo</h1>
            <MultiFileDropzoneUsage onUploadFile={processFile} />

            {isLoading && (
              <div className="mt-8 text-center text-accent">
                Processando arquivo e gerando árvore...
              </div>
            )}

            {error && (
              <div className="mt-8 text-center text-red-500">
                <p>Ocorreu um erro:</p>
                <p>{error}</p>
              </div>
            )}

            {freqMap && (
              <div className="mt-8 bg-secondary p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-2 text-accent">
                  Frequência de Caracteres
                </h2>
                <p className="text-sm text-neutral-400 mb-4">
                  O mapa abaixo mostra com que frequência cada caractere aparece no texto original. Caracteres especiais como espaços ou quebras de linha são representados por nomes descritivos.
                </p>
                <div>
                  <table className="w-full text-sm text-left text-white">
                    <thead className="text-xs uppercase text-neutral-500 border-b border-neutral-700">
                      <tr>
                        <th className="py-2 px-3">Caractere</th>
                        <th className="py-2 px-3">Frequência</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(freqMap).map(([char, freq]) => (
                        <tr key={char} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                          <td className="py-2 px-3">
                            {getReadableChar(char)}
                          </td>
                          <td className="py-2 px-3">{freq}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {binaryMap && (
              <div className="mt-8 bg-secondary p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-2 text-accent">
                  Códigos Huffman
                </h2>
                <p className="text-sm text-neutral-400 mb-4">
                  Abaixo estão os códigos binários gerados para cada caractere no texto.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-white">
                    <thead className="text-xs uppercase text-neutral-500 border-b border-neutral-700">
                      <tr>
                        <th className="py-2 px-3">Caractere</th>
                        <th className="py-2 px-3">Código</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(binaryMap).map(([char, code]) => (
                        <tr key={char} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                          <td className="py-2 px-3">{getReadableChar(char)}</td>
                          <td className="py-2 px-3 text-green-400 font-mono">{code}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {encoded && (
              <div>
                <h3 className="h3 mt-6 text-center">Texto Codificado</h3>
                <div className="text-sm whitespace-pre-wrap break-words bg-gray-900 text-green-400 p-4 rounded max-h-96 overflow-y-auto">
                  {encoded}
                </div>
              </div>
            )}
          </div>
        )}
      </aside>

      <div
        className={`transition-all duration-300 ease-in-out bg-white flex items-center justify-center h-full ${
          isOpen ? 'w-[65%]' : 'w-full'
        }`}
      >
        {isLoading ? (
          <div className="text-gray-500">Gerando imagem...</div>
        ) : svgDataUrl ? (
          <ZoomableImage src={svgDataUrl} alt="Árvore de Huffman" />
        ) : (
          <div className="text-neutral-800 text-sm text-center px-10">
            Nenhuma árvore gerada ainda.
            <br />
            Faça upload de um arquivo para ver a visualização aqui.
          </div>
        )}
      </div>


    </div>
  );
};

export default Page;
