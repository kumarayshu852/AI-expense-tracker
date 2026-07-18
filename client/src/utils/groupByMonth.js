const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

<<<<<<< HEAD
=======
// Expenses ko "June 2026", "May 2026" jaise groups mein todta hai,
// sabse naya month sabse upar rahega
>>>>>>> a40901cbfa97b0fcaaf6d09e4ee1037659ca3e41
export const groupExpensesByMonth = (expenses) => {
  const groups = {}

  expenses.forEach((exp) => {
    const date = new Date(exp.date)
<<<<<<< HEAD
    const key = `${date.getFullYear()}-${date.getMonth()}`
=======
    const key = `${date.getFullYear()}-${date.getMonth()}` // sorting ke liye stable key
>>>>>>> a40901cbfa97b0fcaaf6d09e4ee1037659ca3e41

    if (!groups[key]) {
      groups[key] = {
        key,
        label: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
        sortValue: date.getFullYear() * 12 + date.getMonth(),
        expenses: [],
        total: 0,
      }
    }

    groups[key].expenses.push(exp)
    groups[key].total += exp.type === 'expense' ? exp.amount : 0
  })

  return Object.values(groups).sort((a, b) => b.sortValue - a.sortValue)
}

<<<<<<< HEAD
=======
// Search ke liye — expense ki date ko "D/M/YYYY" format mein convert karta hai (jaise "14/6/2026")
// taaki user "14/6" type kare toh match ho jaye
>>>>>>> a40901cbfa97b0fcaaf6d09e4ee1037659ca3e41
export const formatDateForSearch = (date) => {
  const d = new Date(date)
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}