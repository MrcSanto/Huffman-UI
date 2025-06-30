import { NextResponse } from 'next/server';
import { encodeAndExport } from '@/lib/huffman_code';
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';
import path from 'path';


const execPromise = (command) => {
    return new Promise( (resolve, reject) => {
        exec (command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erro ao executar comando: ${command}\n${error.message}\n${stderr}`);
                return reject(error);
            }
            if (stderr) {
                console.warn(`Saída de erro do comando ${command}:\n${stderr}`);
            }
            resolve({ stdout, stderr });
        });      
    });
};


export async function POST(req) {
    const { text } = await req.json();

    if (!text) {
        return NextResponse.json(
            { message: 'O texto para codificação é obrigatório.' }, 
            { status: 400 }
        );
    }

    const tmpDir = os.tmpdir();
    console.log(tmpDir);

    const fileId = uuidv4();
    const dotFilePath = path.join(tmpDir, `${fileId}.dot`);
    const svgFilePath = path.join(tmpDir, `${fileId}.svg`);

    try {
        const huffResult = await encodeAndExport(text);
        const dotContent = huffResult.dot;

        await fs.writeFile(dotFilePath, dotContent);

        // assumindo que o dot já esteja instalado no PATH do sistema...
        const command = `dot -Tsvg "${dotFilePath}" -o "${svgFilePath}"`;
        await execPromise(command);

        const svgContent = await fs.readFile(svgFilePath, 'utf8');

        await Promise.allSettled([
            fs.unlink(dotFilePath).catch(e => console.error("Erro ao limpar .dot:", e)),
            fs.unlink(svgFilePath).catch(e => console.error("Erro ao limpar .svg:", e))
        ]);

        const base64Svg = Buffer.from(svgContent).toString('base64');
        const svgDataUrl = `data:image/svg+xml;base64,${base64Svg}`;

        return NextResponse.json({
            ...huffResult,
            svgDataUrl: svgDataUrl
        }, { status: 200 });
    } catch (error) {
        console.error('Error in SVG generation API:', error);

        await Promise.allSettled([
            fs.unlink(dotFilePath).catch(() => {}),
            fs.unlink(svgFilePath).catch(() => {})
        ]);
        return NextResponse.json({
            message: 'Internal server error while generating SVG.',
            details: error.message
        }, { status: 500 });
    }

}