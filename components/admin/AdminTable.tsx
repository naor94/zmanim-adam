"use client"

interface Column<T> {
  key: string
  label: string
  render?: (item: T) => React.ReactNode
}

interface Props<T extends { id: string }> {
  items: T[]
  columns: Column<T>[]
  onEdit: (item: T) => void
  onDelete: (item: T) => void
  onAdd: () => void
  addLabel?: string
  loading?: boolean
}

export default function AdminTable<T extends { id: string }>({
  items,
  columns,
  onEdit,
  onDelete,
  onAdd,
  addLabel = "הוסף חדש",
  loading = false,
}: Props<T>) {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={onAdd} className="admin-btn btn-primary">
          + {addLabel}
        </button>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cyan-50 border-b border-cyan-200">
                {columns.map((col) => (
                  <th key={col.key} className="p-3 text-right text-cyan-800 font-medium">
                    {col.label}
                  </th>
                ))}
                <th className="p-3 text-right text-cyan-800 font-medium">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center text-gray-400 py-8">
                    טוען...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center text-gray-400 py-8">
                    אין פריטים
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    {columns.map((col) => (
                      <td key={col.key} className="p-3 text-gray-700">
                        {col.render
                          ? col.render(item)
                          : String((item as any)[col.key] ?? "-")}
                      </td>
                    ))}
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(item)}
                          className="admin-btn btn-ghost text-xs py-1 px-2"
                        >
                          עריכה
                        </button>
                        <button
                          onClick={() => onDelete(item)}
                          className="admin-btn btn-danger text-xs py-1 px-2"
                        >
                          מחיקה
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
