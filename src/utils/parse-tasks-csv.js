function splitCsvLine(line, delimiter) {
    const values = [];
    let current = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"' && insideQuotes && nextChar === '"') {
            current += '"';
            i += 1;
            continue;
        }

        if (char === '"') {
            insideQuotes = !insideQuotes;
            continue;
        }

        if (char === delimiter && !insideQuotes) {
            values.push(current.trim());
            current = '';
            continue;
        }

        current += char;
    }

    values.push(current.trim());
    return values;
}

function normalizeHeader(header) {
    return header
        .replace(/^\uFEFF/, '')
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ');
}

function detectDelimiter(line) {
    const commaCount = (line.match(/,/g) ?? []).length;
    const semicolonCount = (line.match(/;/g) ?? []).length;
    return semicolonCount > commaCount ? ';' : ',';
}

export function parseTasksCsv(csvContent) {
    const lines = csvContent
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean);

    if (lines.length < 2) {
        return [];
    }

    const delimiter = detectDelimiter(lines[0]);
    const headers = splitCsvLine(lines[0], delimiter).map(normalizeHeader);

    const titleIndex = headers.findIndex(header =>
        ['task name', 'taskname', 'title', 'task', 'nome da tarefa', 'nome tarefa'].includes(header)
    );
    const descriptionIndex = headers.findIndex(header =>
        ['description', 'descricao', 'descrição'].includes(header)
    );

    if (titleIndex === -1 || descriptionIndex === -1) {
        throw new Error('CSV header must contain "Task Name" and "Description" columns');
    }

    return lines.slice(1).map(line => {
        const columns = splitCsvLine(line, delimiter);
        const title = columns[titleIndex] ?? '';
        const description = columns[descriptionIndex] ?? '';

        return { title, description };
    }).filter(task => task.title && task.description);
}
