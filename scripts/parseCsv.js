/**
 * Minimal CSV parser for Node (no deps).
 * Handles quoted fields and commas inside quotes.
 * @param {string} text - Raw CSV string
 * @returns {{ headers: string[], rows: string[][] }}
 */
function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '')
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

/**
 * Convert rows to array of objects using first row as keys.
 * @param {string} text - Raw CSV string
 * @returns {Record<string, string>[]}
 */
function csvToObjects(text) {
  const { headers, rows } = parseCsv(text)
  return rows.map((row) => {
    const obj = {}
    headers.forEach((h, i) => {
      const key = h.trim().toLowerCase()
      if (key) obj[key] = row[i] !== undefined ? String(row[i]).trim() : ''
    })
    return obj
  })
}

export { parseCsv, csvToObjects }
