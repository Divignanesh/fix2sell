/**
 * Split CSV text into rows. Newlines inside double-quoted fields are kept as part of the cell.
 */
function splitCsvRows(text) {
  const rows = []
  let current = ''
  let inQuotes = false
  let i = 0
  while (i < text.length) {
    const c = text[i]
    if (c === '"') {
      inQuotes = !inQuotes
      current += c
      i += 1
    } else if (!inQuotes && (c === '\n' || c === '\r')) {
      if (c === '\r' && text[i + 1] === '\n') i += 1
      rows.push(current)
      current = ''
      i += 1
    } else {
      current += c
      i += 1
    }
  }
  if (current.length > 0) rows.push(current)
  return rows
}

/**
 * Minimal CSV parser for browser. Handles quoted fields, commas and newlines inside quotes.
 */
function parseCsv(text) {
  const normalized = typeof text === 'string' && text.charCodeAt(0) === 0xfeff ? text.slice(1) : text
  const lines = splitCsvRows(normalized).filter((line) => line.trim() !== '')
  if (lines.length === 0) return { headers: [], rows: [] }

  const parseRow = (line) => {
    const out = []
    let i = 0
    while (i < line.length) {
      if (line[i] === '"') {
        let cell = ''
        i += 1
        while (i < line.length) {
          if (line[i] === '"') {
            i += 1
            if (line[i] === '"') {
              cell += '"'
              i += 1
            } else break
          } else {
            cell += line[i]
            i += 1
          }
        }
        out.push(cell.trim())
        if (i < line.length && line[i] === ',') i += 1
      } else {
        let cell = ''
        while (i < line.length && line[i] !== ',') {
          cell += line[i]
          i += 1
        }
        out.push(cell.trim())
        if (line[i] === ',') i += 1
      }
    }
    return out
  }

  const headers = parseRow(lines[0])
  const rows = lines.slice(1).map(parseRow)
  return { headers, rows }
}

/** Normalize header: lowercase, no spaces (e.g. "Before Image" -> "beforeimage"). */
function normalizeKey(h) {
  return h.trim().toLowerCase().replace(/\s+/g, '')
}

/** Merge extra cells into URL columns when row has more cells than headers. */
function normalizeRowLength(row, headerCount) {
  let r = row.slice()
  for (let k = 0; k < r.length - headerCount; k++) {
    const i = 1 + k
    r = r.slice(0, i).concat([r[i] + r[i + 1]]).concat(r.slice(i + 2))
  }
  return r
}

export function csvToObjects(text) {
  const { headers, rows } = parseCsv(text)
  const headerCount = headers.length
  return rows.map((row) => {
    const normalized = normalizeRowLength(row, headerCount)
    const obj = {}
    headers.forEach((h, i) => {
      const key = normalizeKey(h)
      if (key) obj[key] = normalized[i] !== undefined ? String(normalized[i]).trim() : ''
    })
    return obj
  })
}
