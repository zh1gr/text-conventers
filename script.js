const inputArea = document.querySelector(".large-area--input");
const outputArea = document.querySelector(".large-area--output");
const btnFormat = document.querySelector(".controls__button--convert");
const selectConversion = document.querySelector(".controls__select");

const conversionOptions = [
    { value: 'jsonToGolang', label: 'JSON to Golang Struct' },
    { value: 'jsonBeautify', label: 'JSON Beautify' },
    { value: 'jsonMinify', label: 'JSON Minify' },
    { value: 'base64ToText', label: 'Base64 to Text' },
    { value: 'protoBuffToTypeScript', label: 'ProtoBuff to TypeScript' }
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
            default:
                outputArea.value = "Invalid conversion type selected!";
        }
    } catch (err) {
        outputArea.value = err.message;
    }
});

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
        return atob(base64String);
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