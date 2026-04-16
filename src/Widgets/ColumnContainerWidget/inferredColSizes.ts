import { ColumnWidgetInstance } from '../ColumnWidget/ColumnWidgetClass'

export function inferredColSizes(columns: ColumnWidgetInstance[]): number[] {
  const sizes = columns.map((col) => col.get('colSize'))
  const usedSpace = sizes.reduce((sum: number, s) => sum + (s || 0), 0)
  const unsetCount = sizes.filter((s) => !s).length
  const remaining = Math.max(12 - usedSpace, 0)
  const base = unsetCount > 0 ? Math.floor(remaining / unsetCount) : 1
  const extra = unsetCount > 0 ? remaining - base * unsetCount : 0

  let unsetIndex = 0
  return sizes.map((s) => s || base + (unsetIndex++ < extra ? 1 : 0))
}
