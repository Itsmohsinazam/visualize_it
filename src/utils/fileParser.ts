export async function parseFile(file: File): Promise<any[]> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  if (fileType === 'application/json' || fileName.endsWith('.json')) {
    return parseJSON(file);
  } else if (
    fileType === 'text/csv' ||
    fileName.endsWith('.csv') ||
    fileType === 'application/vnd.ms-excel'
  ) {
    return parseCSV(file);
  } else {
    throw new Error(`Unsupported file type: ${fileType || 'unknown'}. Please use CSV or JSON.`);
  }
}

async function parseJSON(file: File): Promise<any[]> {
  const text = await file.text();
  const data = JSON.parse(text);

  if (Array.isArray(data)) {
    return data;
  } else if (typeof data === 'object') {
    return [data];
  } else {
    throw new Error('JSON file must contain an object or array');
  }
}

async function parseCSV(file: File): Promise<any[]> {
  const text = await file.text();
  const lines = text.trim().split('\n');

  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }

  const headers = parseCSVLine(lines[0]);

  const data = lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    return row;
  });

  return data.filter((row) => Object.values(row).some((val) => val !== ''));
}

function parseCSVLine(line: string): string[] {
  const result = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

