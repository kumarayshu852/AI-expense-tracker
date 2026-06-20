import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// CSV Export — Excel mein khulta hai
export const exportToCSV = (expenses, filename = 'expenses-report') => {
  if (!expenses.length) return

  const headers = ['Title', 'Type', 'Category', 'Payment Method', 'Amount', 'Date', 'Notes']

  const rows = expenses.map((e) => [
    e.title,
    e.type,
    e.category,
    e.paymentMethod,
    e.amount,
    new Date(e.date).toLocaleDateString('en-IN'),
    e.notes || '',
  ])

  // CSV mein comma/quote escape karna zaroori hai, warna columns toot jayenge
  const escapeCSV = (value) => {
    const str = String(value)
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCSV).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

// PDF Export — formatted table ke saath
export const exportToPDF = (expenses, summary = {}, filename = 'expenses-report') => {
  if (!expenses.length) return

  const doc = new jsPDF()

  // Header
  doc.setFontSize(18)
  doc.setTextColor(139, 92, 246) // primary purple
  doc.text('AI Expense Tracker - Report', 14, 18)

  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 14, 25)

  // Summary boxes
  if (summary.totalIncome !== undefined) {
    doc.setFontSize(11)
    doc.setTextColor(0)
    doc.text(`Total Income: Rs.${summary.totalIncome?.toLocaleString('en-IN') || 0}`, 14, 35)
    doc.text(`Total Expenses: Rs.${summary.totalExpenses?.toLocaleString('en-IN') || 0}`, 14, 42)
    doc.text(`Savings: Rs.${summary.savings?.toLocaleString('en-IN') || 0}`, 14, 49)
  }

  // Table
  autoTable(doc, {
    startY: summary.totalIncome !== undefined ? 56 : 32,
    head: [['Title', 'Type', 'Category', 'Payment', 'Amount', 'Date']],
    body: expenses.map((e) => [
      e.title,
      e.type,
      e.category,
      e.paymentMethod,
      `Rs.${e.amount.toLocaleString('en-IN')}`,
      new Date(e.date).toLocaleDateString('en-IN'),
    ]),
    theme: 'striped',
    headStyles: { fillColor: [139, 92, 246] },
    styles: { fontSize: 9 },
  })

  doc.save(`${filename}.pdf`)
}