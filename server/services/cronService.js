const cron =require('node-cron');
const RecurringTransaction =require('../models/RecurringTransaction');
const Expense =require('../models/Expense');


// next due date calculate karo frequency ke hisaab se
const getNextDueDate =(currentDate,frequency)=>{
    const next =new Date(currentDate);
    switch(frequency){
        case 'daily':
            next.setDate(next.getDate()+1);
            break;
            case 'weekly':
                next.setDate(next.getDate()+7);
                break;
                case 'monthly':
                    next.setMonth(next.getMonth()+1);
                    break;
                    case 'yearly':
                        next.setFullYear(next.getFullYear()+1);
                        break;
                        default:
                        next.setMonth(next.getMonth()+1);
    }
    return next;
};

// har dur recurring transaction ko actual expense me convert karo

const processRecurringTransactions =async()=>{
    try{
        const now =new Date();

        // saari active transactions jo aaj ya phele due hai
        const dueTransactions =await RecurringTransaction.find({
            isActive:true,
            nextDueDate:{$lte:now},
        });
          console.log(`Processing ${dueTransactions.length} recurring transactions...`);
           for (const recurring of dueTransactions) {
      // Actual expense create karo
      await Expense.create({
        userId: recurring.userId,
        title: recurring.title,
        amount: recurring.amount,
        type: recurring.type,
        category: recurring.category,
        paymentMethod: recurring.paymentMethod,
        notes: recurring.notes
          ? `${recurring.notes} (Auto - ${recurring.frequency})`
          : `Auto recurring (${recurring.frequency})`,
        date: now,
      });

      // next due date update karo

      const nextDue =getNextDueDate(recurring.nextDueDate,recurring.frequency);
      await RecurringTransaction.findByIdAndUpdate(recurring._id,{
        nextDueDate:nextDue,
        lastProcessed:now,
      });

       console.log(`✓ Processed: ${recurring.title} — next due: ${nextDue.toDateString()}`);
        }
  } catch (error) {
    console.error('Cron job error:', error.message);

    }
};

// Har roz subah 12:00 AM pe run karo
const startCronJobs = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running recurring transactions cron job...');
    await processRecurringTransactions();
  });

  console.log('Cron jobs started.');
};

module.exports = { startCronJobs, processRecurringTransactions };