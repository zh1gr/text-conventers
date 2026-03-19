const inputArea = document.querySelector(".large-area--input");
const outputArea = document.querySelector(".large-area--output");
const btnFormat = document.querySelector(".controls__button--convert");
const selectConversion = document.querySelector(".controls__select");

const conversionOptions = [
    { value: 'jsonToGolang', label: 'JSON to Golang Struct' },
    { value: 'jsonBeautify', label: 'JSON Beautify' },
    { value: 'jsonMinify', label: 'JSON Minify' },
    { value: 'base64ToText', label: 'Base64 to Text' },
    { value: 'textToBase64', label: 'Text to Base64' },
    { value: 'protoBuffToTypeScript', label: 'ProtoBuff to TypeScript' },
    { value: 'htmlToGolang', label: 'HTML to Golang Struct' },
    { value: 'dynatraceJsonToCSV', label: 'Dyntrace JSON to CSV' },
    { value: 'encodeUrl', label: 'Encode URL'},
    { value: 'decodeUrl', label: 'Decode URL'},
    { value: 'stringToStringified', label: 'String to Stringified'},
    { value: 'stringifiedToString', label: 'Stringified to String'},
    { value: 'zabbixJsonToCsv', label: 'Zabbix API JSON to CSV'}
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
                outputArea.value = base64ToText(input);
                break;
            case "textToBase64":
                outputArea.value = textToBase64(input);
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
            case "stringToStringified":
                outputArea.value = stringToStringified(input);
                break;
            case "stringifiedToString":
                outputArea.value = stringifiedToString(input);
                break;
            case "zabbixJsonToCsv":
                outputArea.value = zabbixJsonToCsv(input);
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

function stringifiedToString(stringified) {
    return JSON.parse(stringified);
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

function base64ToText(base64String) {
    try {
        const binaryString = atob(base64String);
        const bytes = Uint8Array.from(binaryString, char => char.charCodeAt(0));
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(bytes);
    } catch (e) {
        throw new Error('Invalid Base64 string:' + e);
    }
}

function textToBase64(string){
    try {
        const encoder = new TextEncoder('utf-8')
        const bytes = encoder.encode(string);
        let binary = "";
        for (let i = 0; i<bytes.length; i++) binary += String.fromCharCode(bytes[i]);
        return btoa(binary)
    } catch (e) {
        throw new Error('Error encoding:' + e)
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

function zabbixJsonToCsv(input) {
  var obj = JSON.parse(input);
  var arr = (obj && obj.result && Array.isArray(obj.result)) ? obj.result : [];
  var i, j;

  function isObj(v) { return v && typeof v === "object" && !Array.isArray(v); }
  function isArr(v) { return Array.isArray(v); }

  function normws(s) {
    return String(s)
      .replace(/\r\n/g, " ")
      .replace(/\n/g, " ")
      .replace(/\r/g, " ")
      .replace(/\t/g, " ")
      .replace(/ +/g, " ");
  }

  function cell(v) {
    if (v === null || v === undefined) return "";
    var t = typeof v;
    if (t === "string") return normws(v);
    if (t === "number" || t === "boolean") return String(v);
    return normws(JSON.stringify(v));
  }

  function csvEscape(v) {
    var s = String(v);
    s = s.replace(/"/g, '""');
    return '"' + s + '"';
  }

  function uniqKeep(list) {
    var seen = Object.create(null);
    var out = [];
    for (var k = 0; k < list.length; k++) {
      var x = list[k];
      if (!seen[x]) { seen[x] = 1; out.push(x); }
    }
    return out;
  }

  function scalarColsOrdered(node, prefixArr) {
    var out = [];
    var p = prefixArr || [];
    if (isObj(node)) {
      var keys = Object.keys(node);
      for (var k = 0; k < keys.length; k++) {
        var key = keys[k];
        var v = node[key];
        var np = p.concat([key]);
        if (isObj(v)) {
          out = out.concat(scalarColsOrdered(v, np));
        } else if (isArr(v)) {
        } else {
          out.push(np.join("."));
        }
      }
    } else if (isArr(node)) {
    } else {
      out.push(p.join("."));
    }
    return out;
  }

  function isContinuation(o) {
    if (!isObj(o)) return false;
    var keys = Object.keys(o);
    var hasArray = false;
    var hasNonArray = false;
    for (var k = 0; k < keys.length; k++) {
      var v = o[keys[k]];
      if (isArr(v)) hasArray = true;
      else hasNonArray = true;
    }
    return hasArray && !hasNonArray;
  }

  function mergeArrays(base, cont) {
    var keys = Object.keys(cont);
    for (var k = 0; k < keys.length; k++) {
      var key = keys[k];
      var v = cont[key];
      if (!isArr(v)) continue;
      var cur = base[key];
      if (!isArr(cur)) cur = [];
      base[key] = cur.concat(v);
    }
    return base;
  }

  var rows = [];
  for (i = 0; i < arr.length; i++) {
    var r = arr[i];
    if (!isObj(r)) continue;
    if (isContinuation(r) && rows.length > 0) {
      rows[rows.length - 1] = mergeArrays(rows[rows.length - 1], r);
    } else {
      rows.push(r);
    }
  }

  var roots = [];
  for (i = 0; i < rows.length; i++) {
    var row = rows[i];
    var rkeys = Object.keys(row);
    for (j = 0; j < rkeys.length; j++) {
      var rk = rkeys[j];
      if (isArr(row[rk])) roots.push(rk);
    }
  }
  roots = uniqKeep(roots);

  function isRootName(name) {
    for (var k = 0; k < roots.length; k++) if (roots[k] === name) return true;
    return false;
  }

  var scols = [];
  for (i = 0; i < rows.length; i++) {
    var cols = scalarColsOrdered(rows[i], []);
    for (j = 0; j < cols.length; j++) {
      var c = cols[j];
      var first = c.split(".")[0];
      if (!isRootName(first)) scols.push(c);
    }
  }
  scols = uniqKeep(scols);

  function arrayColsOrdered(allRows, rootsList) {
    var out = [];
    for (var rr = 0; rr < rootsList.length; rr++) {
      var root = rootsList[rr];
      // collect objects in scan order
      var firstObj = null;
      for (var a = 0; a < allRows.length && !firstObj; a++) {
        var av = allRows[a][root];
        if (!isArr(av)) continue;
        for (var b = 0; b < av.length; b++) {
          if (isObj(av[b])) { firstObj = av[b]; break; }
        }
      }
      if (!firstObj) {
        out.push(root);
      } else {
        var sch = scalarColsOrdered(firstObj, []);
        for (var s = 0; s < sch.length; s++) out.push(root + "." + sch[s]);
      }
    }
    return uniqKeep(out);
  }

  var acols = arrayColsOrdered(rows, roots);
  var colsAll = uniqKeep(scols.concat(acols));

  function getPath(obj2, parts) {
    var cur = obj2;
    for (var k = 0; k < parts.length; k++) {
      if (cur === null || cur === undefined) return null;
      if (!isObj(cur)) return null;
      cur = cur[parts[k]];
    }
    return (cur === undefined) ? null : cur;
  }

  function getScalar(row, col) {
    return getPath(row, col.split("."));
  }

  function getArray(row, col, idx) {
    var p = col.split(".");
    var root = p[0];
    var arrv = row[root];
    if (!isArr(arrv)) arrv = [];
    var el = arrv[idx];
    if (p.length === 1) return (el === undefined ? null : el);
    if (!isObj(el)) return null;
    return getPath(el, p.slice(1));
  }

  function maxRowsFor(row) {
    var m = 0;
    for (var k = 0; k < roots.length; k++) {
      var a = row[roots[k]];
      var len = isArr(a) ? a.length : 0;
      if (len > m) m = len;
    }
    return (m < 1) ? 1 : m;
  }

  var lines = [];
  var h = [];
  for (i = 0; i < colsAll.length; i++) h.push(csvEscape(colsAll[i]));
  lines.push(h.join(","));

  for (i = 0; i < rows.length; i++) {
    var row2 = rows[i];
    var n = maxRowsFor(row2);
    for (var idx = 0; idx < n; idx++) {
      var line = [];
      for (j = 0; j < colsAll.length; j++) {
        var col = colsAll[j];
        var rootName = col.split(".")[0];
        var v;
        if (isRootName(rootName)) {
          v = getArray(row2, col, idx);
        } else {
          v = (idx === 0) ? getScalar(row2, col) : null;
        }
        line.push(csvEscape(cell(v)));
      }
      lines.push(line.join(","));
    }
  }

  return lines.join("\n");
}