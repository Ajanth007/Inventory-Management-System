
const {pool} = require("../config/db");

exports.getAccountingOverview = async (req, res, next) => {
  try {
    const companyId = req.user.company_id;

    const [[sales]] = await pool.query(
      `SELECT COALESCE(SUM(total), 0) AS revenue
       FROM sales
       WHERE company_id = ?
         AND status = 'completed'`,
      [companyId]
    );

    const [[expenses]] = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS expenses
       FROM expenses
       WHERE company_id = ?
         AND status = 'paid'`,
      [companyId]
    );

    const [[receivables]] = await pool.query(
      `SELECT COALESCE(SUM(total - paid_amount), 0) AS receivables
       FROM invoices
       WHERE company_id = ?
         AND status IN ('pending', 'partial', 'overdue')`,
      [companyId]
    );

    const [[costs]] = await pool.query(
      `SELECT COALESCE(SUM(si.qty * si.unit_cost), 0) AS cost_of_goods
       FROM sale_items si
       INNER JOIN sales s ON s.id = si.sale_id
       WHERE s.company_id = ?
         AND s.status = 'completed'`,
      [companyId]
    );

    const [monthly] = await pool.query(
      `SELECT
        DATE_FORMAT(months.month_date, '%b') AS month,
        COALESCE(s.revenue, 0) AS revenue,
        COALESCE(e.expenses, 0) AS expenses
       FROM (
         SELECT
           DATE_FORMAT(
             DATE_SUB(CURRENT_DATE,
               INTERVAL seq MONTH), '%Y-%m-01'
           ) AS month_date
         FROM (
           SELECT 0 AS seq UNION ALL
           SELECT 1 UNION ALL SELECT 2 UNION ALL
           SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
         ) numbers
       ) months
       LEFT JOIN (
         SELECT
           DATE_FORMAT(sale_date, '%Y-%m-01') AS month_date,
           SUM(total) AS revenue
         FROM sales
         WHERE company_id = ?
           AND status = 'completed'
           AND sale_date >= DATE_SUB(CURRENT_DATE, INTERVAL 5 MONTH)
         GROUP BY DATE_FORMAT(sale_date, '%Y-%m-01')
       ) s ON s.month_date = months.month_date
       LEFT JOIN (
         SELECT
           DATE_FORMAT(expense_date, '%Y-%m-01') AS month_date,
           SUM(amount) AS expenses
         FROM expenses
         WHERE company_id = ?
           AND status = 'paid'
           AND expense_date >= DATE_SUB(CURRENT_DATE, INTERVAL 5 MONTH)
         GROUP BY DATE_FORMAT(expense_date, '%Y-%m-01')
       ) e ON e.month_date = months.month_date
       ORDER BY months.month_date`,
      [companyId, companyId]
    );

    const revenue = Number(sales.revenue);
    const expenseAmount = Number(expenses.expenses);
    const costOfGoods = Number(costs.cost_of_goods);

    res.json({
      kpis: {
        revenue,
        expenses: expenseAmount,
        netProfit: revenue - costOfGoods - expenseAmount,
        receivables: Number(receivables.receivables)
      },

      monthly,

      reports: [
        {
          id: 1,
          name: "Sales Report",
          description: "Completed sales and revenue"
        },
        {
          id: 2,
          name: "Expense Report",
          description: "Paid company expenses"
        },
        {
          id: 3,
          name: "Profit Report",
          description: "Revenue minus cost of goods and expenses"
        }
      ]
    });

  } catch (error) {
    next(error);
  }
};
