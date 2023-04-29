/**
 * SUPER WARNING: Beware this does not escape all values!
 * If you do sql inject then congrats on hacking into your own local telemetry data 🎉
 */
export function generateSelectWithFilters(
  select: string,
  table: string,
  filters: any
) {
  const sorts = []

  // Extract out sorts
  if (filters.sorts) {
    sorts.push(...filters.sorts)
    delete filters.sorts
  }

  // Parameters must be prefixed with `$` for sqlite
  const sqlFilters: any = {}
  Object.keys(filters).forEach((key) => {
    sqlFilters[`$${key}`] = filters[key]
  })

  // Return the SQL and the filters for execution with .all or .get etc
  return [
    `SELECT ${select} FROM ${table} ${
      sorts.length > 0
        ? `ORDER BY ${sorts
            .map((sort) => {
              return `${sort.column} ${sort.type}`
            })
            .join(',')}`
        : ''
    } ${sqlFilters.$limit ? 'LIMIT $limit' : ''} `,
    sqlFilters,
  ]
}
