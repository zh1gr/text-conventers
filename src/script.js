const inputArea = document.querySelector(".large-area--input");
const outputArea = document.querySelector(".large-area--output");
const btnFormat = document.querySelector(".controls__button--convert");
const selectConversion = document.querySelector(".controls__select");

const conversionOptions = [
    { value: 'jsonToGolang', label: 'JSON to Golang Struct' },
    { value: 'jsonBeautify', label: 'JSON Beautify' },
    { value: 'jsonMinify', label: 'JSON Minify' },
    { value: 'base64ToText', label: 'Base64 to Text' },
    { value: 'protoBuffToTypeScript', label: 'ProtoBuff to TypeScript' },
    { value: 'htmlToGolang', label: 'HTML to Golang Struct' },
    { value: 'dynatraceJsonToCSV', label: 'Dyntrace JSON to CSV' },
    { value: 'encodeUrl', label: 'Encode URL'},
    { value: 'decodeUrl', label: 'Decode URL'},
    { value: 'stringified', label: 'String to Stringified'}
];

function loadOptions() {
    conversionOptions.forEach(option => {
        const optElement = document.createElement('option');
        optElement.value = option.value;
        optElement.textContent = option.label;
        selectConversion.appendChild(optElement);
    });
}

document.addEventListener("DOMContentLoaded", loadOptions);

btnFormat.addEventListener("click", () => {
    const conversionType = selectConversion.value;
    let input = inputArea.value;

    try {
        switch (conversionType) {
            case "jsonToGolang":
                outputArea.value = jsonToGolang(input);
                break;
            case "jsonBeautify":
                outputArea.value = jsonBeautify(input);
                break;
            case "jsonMinify":
                outputArea.value = jsonMinify(input);
                break;
            case "base64ToText":
                outputArea.value = decodeByte(input);
                break;
            case "protoBuffToTypeScript":
                outputArea.value = protoBuffToTypeScript(input);
                break;
            case "htmlToGolang":
                outputArea.value = htmlToGolang(input);
                break;
            case "dynatraceJsonToCSV":
                outputArea.value = dynatraceJsonToCSV(input);
                break;
            case "encodeUrl":
                outputArea.value = encodeUrl(input);
                break;
            case "decodeUrl":
                outputArea.value = decodeUrl(input);
                break;
            case "stringified":
                outputArea.value = stringToStringified(input);
                break;
            default:
                outputArea.value = "Invalid conversion type selected!";
        }
    } catch (err) {
        outputArea.value = err.message;
    }
});

function stringToStringified(string){
    return JSON.stringify(string)
}

function encodeUrl(string) {
    return encodeURIComponent(string)
}

function decodeUrl(string) {
    return decodeURIComponent(string)
}

function jsonBeautify(json) {
    try {
        return JSON.stringify(JSON.parse(json), null, 4);
    } catch (e) {
        throw new Error('Invalid JSON format');
    }
}

function jsonMinify(json) {
    try {
        return JSON.stringify(JSON.parse(json));
    } catch (e) {
        throw new Error('Invalid JSON format');
    }
}

function decodeByte(base64String) {
    try {
        const binaryString = atob(base64String);
        const bytes = Uint8Array.from(binaryString, char => char.charCodeAt(0));
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(bytes);
    } catch (e) {
        throw new Error('Invalid Base64 string');
    }
}


function capitalizeFirstLetter(string) {
    return string
        .split(/[-_]/)
        .map(part => {
            if (part === part.toUpperCase()) {
                return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
            }
            return part.charAt(0).toUpperCase() + part.slice(1);
        })
        .join('');
}

function convertToGoType(value, fieldName) {
    const valueType = typeof value;
    if (valueType === "string") return "string";
    if (valueType === "number") return Number.isInteger(value) ? "int" : "float64";
    if (valueType === "boolean") return "bool";
    if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'object') {
            let nestedStructName = capitalizeFirstLetter(fieldName);
            return "[]" + nestedStructName;
        }
        return "[]" + convertToGoType(value[0], fieldName);
    }
    if (valueType === "object" && value !== null) {
        return capitalizeFirstLetter(fieldName);
    }
    return "interface{}";
}

function generateGoStruct(jsonObject, structName) {
    let goStruct = `type ${structName} struct {\n`;
    let nestedStructs = "";

    for (const [key, value] of Object.entries(jsonObject)) {
        let fieldName = capitalizeFirstLetter(key);
        let fieldType = convertToGoType(value, key);

        if (fieldType === fieldName) {
            let nestedStruct = generateGoStruct(value, fieldName);
            nestedStructs += "\n" + nestedStruct;
        } else if (fieldType.startsWith("[]") && typeof value[0] === "object") {
            let nestedStruct = generateGoStruct(value[0], fieldName);
            nestedStructs += "\n" + nestedStruct;
        }

        goStruct += `\t${fieldName} ${fieldType} \`json:"${key}"\`\n`;
    }

    goStruct += `}\n`;

    return goStruct + nestedStructs;
}

function jsonToGolang(jsonInput) {
    try {
        const jsonObj = JSON.parse(jsonInput);
        return generateGoStruct(jsonObj, "Root")
    } catch (e) {
        throw new Error('Invalid JSON format');
    }
}

function protoBuffToTypeScript(proto) {
    try {
        return protoToTypescript(proto)
    } catch (e) {
        console.log(e)
        throw new Error('Invalid JSON format');
    }
}

function protoToTypescript(protoText) {
    const lines = protoText.split("\n");
    let tsDefinitions = "";
    let insideMessage = false;
    let insideEnum = false;
    let currentEnumName = "";
    let currentMessageName = "";

    lines.forEach((line) => {
        line = line.trim();

        if (line.startsWith("message")) {
            insideMessage = true;
            insideEnum = false;
            currentMessageName = line.split(" ")[1].replace("{", "").trim();
            tsDefinitions += `interface ${currentMessageName} {\n`;
        } else if (line.startsWith("enum")) {
            insideEnum = true;
            insideMessage = false;
            currentEnumName = line.split(" ")[1].replace("{", "").trim();
            tsDefinitions += `enum ${currentEnumName} {\n`;
        } else if (line.startsWith("}")) {
            tsDefinitions += `}\n\n`;
            insideMessage = false;
            insideEnum = false;
        } else if (insideMessage && line !== "") {
            if (line.startsWith("repeated")) {
                const parts = line.split(" ");
                const repeatedType = protobufTypeToTSType(parts[1]);
                const fieldName = parts[2];
                tsDefinitions += `  ${fieldName}: ${repeatedType}[];\n`;
            }
            else if (line.startsWith("map")) {
                const mapParts = line.match(/map<(.+),\s*(.+)>/);
                const keyType = protobufTypeToTSType(mapParts[1]);
                const valueType = protobufTypeToTSType(mapParts[2]);
                const fieldName = line.split(" ")[2];
                tsDefinitions += `  ${fieldName}: Map<${keyType}, ${valueType}>;\n`;
            }
            else {
                const parts = line.split(" ");
                const type = parts[0];
                const fieldName = parts[1];
                const tsType = protobufTypeToTSType(type);
                tsDefinitions += `  ${fieldName}: ${tsType};\n`;
            }
        } else if (insideEnum && line !== "") {
            const enumValue = line.split("=")[0].trim();
            tsDefinitions += `  ${enumValue},\n`;
        }
    });

    return tsDefinitions;
}

function protobufTypeToTSType(protoType) {
    switch (protoType) {
        case "int32":
        case "int64":
        case "uint32":
        case "uint64":
        case "float":
        case "double":
            return "number";
        case "string":
            return "string";
        case "bool":
            return "boolean";
        case "bytes":
            return "Uint8Array";
        default:
            return protoType;
    }
}

function htmlToGolang(html) {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const body = doc.body;
        const goStruct = generateGoStructFromHTML(body, 'Document', new Set());

        return goStruct;
    } catch (e) {
        throw new Error('Invalid HTML format');
    }
}

function generateGoStructFromHTML(node, structName, structNames) {
    if (structNames.has(structName)) {
        return '';
    }
    structNames.add(structName);

    let structDef = `type ${structName} struct {\n`;

    const children = Array.from(node.childNodes).filter(n => n.nodeType === Node.ELEMENT_NODE);
    const hasText = Array.from(node.childNodes).some(n => n.nodeType === Node.TEXT_NODE && n.nodeValue.trim() !== '');

    if (hasText) {
        structDef += `\tText string \`html:",innerhtml"\`\n`;
    }

    if (node.attributes && node.attributes.length > 0) {
        Array.from(node.attributes).forEach(attr => {
            const fieldName = capitalize(convertToCamelCase(attr.name));
            structDef += `\t${fieldName} string \`html:"${attr.name},attr"\`\n`;
        });
    }

    const childMap = {};
    children.forEach(child => {
        const name = capitalize(convertToCamelCase(child.nodeName.toLowerCase()));
        if (!childMap[name]) {
            childMap[name] = { count: 0, nodes: [] };
        }
        childMap[name].count += 1;
        childMap[name].nodes.push(child);
    });

    Object.keys(childMap).forEach(name => {
        const childInfo = childMap[name];
        let fieldName = name;
        let fieldType = name;

        if (childInfo.count > 1) {
            fieldType = `[]${name}`;
            structDef += `\t${fieldName} ${fieldType} \`html:"${childInfo.nodes[0].nodeName.toLowerCase()}"\`\n`;
        } else {
            structDef += `\t${fieldName} ${fieldType} \`html:"${childInfo.nodes[0].nodeName.toLowerCase()}"\`\n`;
        }
    });

    structDef += '}\n\n';

    Object.keys(childMap).forEach(name => {
        const childInfo = childMap[name];
        const childNode = childInfo.nodes[0]; // Use first node as representative
        structDef += generateGoStructFromHTML(childNode, name, structNames);
    });

    return structDef;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function convertToCamelCase(str) {
    return str.replace(/[-_](.)/g, (_, char) => char.toUpperCase());
}

function dynatraceJsonToCSV(input) {
  try {
    const data = typeof input === 'string' ? JSON.parse(input) : input;
    const { columnNames, values } = data;
    if (!Array.isArray(columnNames) || !Array.isArray(values)) {
      throw new Error('Invalid JSON structure: missing columnNames/values arrays');
    }

    const spColName = 'useraction.stringProperties';
    const spIndex = columnNames.indexOf(spColName);
    const needsEscape = v => /[",\n\r]/.test(v) || /^\s|\s$/.test(v);
    const escapeCSV = v => (needsEscape(v) ? `"${v.replace(/"/g, '""')}"` : v);

    const getFromStringProps = (propsArr, wantedKey) => {
      if (!Array.isArray(propsArr)) return '';
      const found = propsArr.find(x => x && x.key === wantedKey);
      return found && found.value != null ? String(found.value) : '';
    };

    const header = columnNames.map(escapeCSV).join(',');

    const rows = values.map(row => {
      return columnNames.map((colName, i) => {
        let val = row[i];
        const m = /^useraction\.stringProperties\.(.+)$/.exec(colName);
        if ((val === null || val === undefined) && m && spIndex !== -1) {
          val = getFromStringProps(row[spIndex], m[1]);
        }

        if (val !== null && val !== undefined && typeof val === 'object') {
          val = JSON.stringify(val);
        }

        val = (val === null || val === undefined) ? '' : String(val);

        return escapeCSV(val);
      }).join(',');
    });

    return [header, ...rows].join('\n') + '\n';
  } catch (e) {
    throw new Error('Error converting JSON to CSV: ' + e.message);
  }
}
