class HuffNode{
    constructor(freq, data, left, right){
        this.freq = freq;
        this.data = data;
        this.left = left;
        this.right = right;
    }
}

function exportToDot(root, huffCodeMap){
    let dot = "digraph G {\n";
    const queue = [root];

    const ptrId = node => 'node' + node._id;

    // atribuindo identificadores unicos aos nós
    let idCounter = 0;
    function assignIds(node){
        if (!node || node._id !== undefined) return;
        node._id = idCounter++;
        assignIds(node.left);
        assignIds(node.right);
    }

    assignIds(root);

    while (queue.length > 0){
        const node = queue.shift()
        const nodeName = ptrId(node);

        let label = "";
        let isLeaf = !node.left && !node.right;

        if (isLeaf){
            let charStr;
            switch (node.data){
                case ' ': charStr = 'SPACE'; break;
                case '\n': charStr = 'NEWLINE'; break;
                case '"': charStr = 'ASPAS'; break;
                case '>': charStr = 'maior que'; break;
                case '<': charStr = 'menor que'; break;
                case '{': charStr = 'abre chave'; break;
                case '}': charStr = 'fecha chave'; break;
                case '|': charStr = 'pipe'; break;
                default: charStr = node.data;
            }

            const binCode = huffCodeMap[node.data] || "";
            label = `{{'${charStr}'|${node.freq}}|${binCode}}`;
            dot += `    ${nodeName} [shape=record, label="${label}"];\n`;
        }else{
            label = `${node.freq}`;
            dot += `    ${nodeName} [label="${label}"];\n`;
        }

        if (node.left) {
            const leftName = ptrId(node.left);
            dot += `    ${nodeName} -> ${leftName} [label="0"];\n`;
            queue.push(node.left);
        }
        if (node.right) {
            const rightName = ptrId(node.right);
            dot += `    ${nodeName} -> ${rightName} [label="1"];\n`;
            queue.push(node.right);
        }
    }

    dot += "}\n"
    return dot;
}

export async function encodeAndExport(str) {
    let mapping = {}
    for(const char of str){
        mapping[char] = (mapping[char] || 0) + 1
    }

    const root = generateTree(mapping);

    const charBinaryMapping = {}
    setBinaryCode(root, "", charBinaryMapping);

    const dotContent = exportToDot(root, charBinaryMapping);

    let encoded = "";
    for (const char of str){
        encoded += charBinaryMapping[char];
    }

    // ordenando o mapa de frequencias, de forma decrescente
    const sortedMapping = Object.fromEntries(
        Object.entries(mapping).sort((a, b) => b[1] - a[1])
    );

    return {
        encoded,
        frequencyMap: sortedMapping,
        binaryMap: charBinaryMapping,
        dot: dotContent,
    };
}

function setBinaryCode(node, path, map){
    if (!node) return;

    if (!node.left && !node.right){
        map[node.data] = path;
    }

    //left
    setBinaryCode(node.left, path + "0", map);

    //right
    setBinaryCode(node.right, path + "1", map);
}

function generateTree(mapping){
    const priorityQ = Object.keys(mapping).map(
        char => new HuffNode(mapping[char], char, null, null)
    );

    priorityQ.sort((a, b) => a.freq - b.freq);


    while (priorityQ.length > 1){
        const first = priorityQ.shift();
        const second = priorityQ.shift();

        let mergeNode = new HuffNode((first.freq + second.freq), '-', first, second);

        priorityQ.push(mergeNode);
        priorityQ.sort((a, b) => a.freq - b.freq);
    }

    return priorityQ[0];
}
