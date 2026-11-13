
const {pool} = require('../config/db');

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const getDateRange = (range = 'month') => {
  const allowedRanges = ['today', '7d', '30d', 'month'];

  if (!allowedRanges.includes(range)) {
    range = 'month';
  }

  switch (range) {
    case 'today':
      return {
        start: 'CURDATE()',
        end: 'DATE_ADD(CURDATE(), INTERVAL 1 DAY)',
      };

    case '7d':
      return {
        start: 'DATE_SUB(CURDATE(), INTERVAL 6 DAY)',
        end: 'DATE_ADD(CURDATE(), INTERVAL 1 DAY)',
      };

    case '30d':
      return {
        start: 'DATE_SUB(CURDATE(), INTERVAL 29 DAY)',
        end: 'DATE_ADD(CURDATE(), INTERVAL 1 DAY)',
      };

    default:
      return {
        start: 'DATE_FORMAT(CURDATE(), "%Y-%m-01")',
        end: 'DATE_ADD(CURDATE(), INTERVAL 1 DAY)',
      };
  }
};

const getRangeCondition = (column, range) => {
  const dates = getDateRange(range);

  return `${column} >= ${dates.start}
          AND ${column} < ${dates.end}`;
};

const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// 1. DASHBOARD SUMMARY
// GET /api/dashboard/summary?range=month
// --------------------------------------------------

exports.getDashboardSummary = async (req, res, next) => {
  try {
    // Get company ID from authenticated user.
    // Adjust this property if your auth middleware uses another name.
    const companyId = req.user?.company_id;

    if (!companyId) {
      return res.status(401).json({
        success: false,
        message: 'Company ID not found in authenticated user',
      });
    }

    // 1. Product statistics
    const [productRows] = await pool.query(`
      SELECT
        COUNT(*) AS totalProducts,
        COALESCE(SUM(stock_qty * cost_price), 0) AS stockValue,

        SUM(
          CASE
            WHEN stock_qty > 0 AND stock_qty <= min_stock
            THEN 1 ELSE 0
          END
        ) AS lowStock,

        SUM(
          CASE
            WHEN stock_qty <= 0
            THEN 1 ELSE 0
          END
        ) AS outOfStock

      FROM products
      WHERE company_id = ?
        AND status = 'active'
    `, [companyId]);

    // 2. Today's sales
    const [salesRows] = await pool.query(`
      SELECT
        COALESCE(SUM(total), 0) AS todaySales,
        COUNT(*) AS todayTransactions
      FROM sales
      WHERE company_id = ?
        AND sale_date = CURDATE()
        AND status != 'cancelled'
    `, [companyId]);

    // 3. Current month sales
    const [monthlyRows] = await pool.query(`
      SELECT
        COALESCE(SUM(total), 0) AS monthlySales
      FROM sales
      WHERE company_id = ?
        AND sale_date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
        AND sale_date <= CURDATE()
        AND status != 'cancelled'
    `, [companyId]);

    // 4. Previous month sales
    const [previousRows] = await pool.query(`
      SELECT
        COALESCE(SUM(total), 0) AS previousSales
      FROM sales
      WHERE company_id = ?
        AND sale_date >= DATE_FORMAT(
          DATE_SUB(CURDATE(), INTERVAL 1 MONTH),
          '%Y-%m-01'
        )
        AND sale_date < DATE_FORMAT(CURDATE(), '%Y-%m-01')
        AND status != 'cancelled'
    `, [companyId]);

    // 5. Invoice statistics
    // We'll verify invoice column names before finalizing this query.
const [invoiceRows] = await pool.query(`
  SELECT
    COALESCE(
      SUM(
        CASE
          WHEN status != 'cancelled'
          THEN GREATEST(total - paid_amount, 0)
          ELSE 0
        END
      ), 0
    ) AS pendingPayments,

    SUM(
      CASE
        WHEN status IN ('pending', 'partial', 'overdue')
        THEN 1 ELSE 0
      END
    ) AS pendingInvoices

  FROM invoices
  WHERE company_id = ?
`, [companyId]);

    // 6. Today's purchases
    // We'll verify purchase column names before finalizing this query.
  const [purchaseRows] = await pool.query(`
  SELECT
    COALESCE(SUM(total), 0) AS todayPurchases
  FROM purchases
  WHERE company_id = ?
    AND purchase_date = CURDATE()
    AND status = 'received'
`, [companyId]);

    const monthlySales = Number(monthlyRows[0].monthlySales);
    const previousSales = Number(previousRows[0].previousSales);

    const monthlySalesChange = previousSales > 0
      ? ((monthlySales - previousSales) / previousSales) * 100
      : monthlySales > 0 ? 100 : 0;

    return res.json({
      totalProducts: Number(productRows[0].totalProducts),
      stockValue: Number(productRows[0].stockValue),
      todaySales: Number(salesRows[0].todaySales),
      todayTransactions: Number(salesRows[0].todayTransactions),
      monthlySales,
      monthlySalesChange: Number(monthlySalesChange.toFixed(2)),
      lowStock: Number(productRows[0].lowStock || 0),
      outOfStock: Number(productRows[0].outOfStock || 0),
      pendingPayments: Number(invoiceRows[0].pendingPayments),
      pendingInvoices: Number(invoiceRows[0].pendingInvoices || 0),
      todayPurchases: Number(purchaseRows[0].todayPurchases),
    });

  } catch (error) {
    console.error('Dashboard Summary Error:', error);
    next(error);
  }
};


// --------------------------------------------------
// 2. STOCK ALERTS
// GET /api/dashboard/stock-alerts
// --------------------------------------------------

exports.getStockAlerts = asyncHandler(async (req, res) => {
  try {
    const companyId = req.user?.company_id;

    if (!companyId) {
      return res.status(401).json({
        success: false,
        message: 'Company ID not found',
      });
    }

    const [rows] = await pool.query(`
      SELECT
        id,
        name,
        sku,
        stock_qty AS available,
        min_stock AS minStock,
        COALESCE(target_stock, min_stock * 3) AS targetStock
      FROM products
      WHERE company_id = ?
        AND status = 'active'
        AND stock_qty <= min_stock
      ORDER BY stock_qty ASC
    `, [companyId]);

    return res.json(rows.map(row => ({
      ...row,
      available: Number(row.available),
      minStock: Number(row.minStock),
      targetStock: Number(row.targetStock),
    })));

  } catch (error) {
    console.error('Stock Alerts Error:', error);
    throw error;
  }
});


// --------------------------------------------------
// 3. MONTHLY SALES
// GET /api/dashboard/monthly-sales?months=6
// --------------------------------------------------


exports.getMonthlySales = asyncHandler(async (req, res) => {
  try {
    const companyId = req.user?.company_id;

    if (!companyId) {
      return res.status(401).json({
        success: false,
        message: 'Company ID not found',
      });
    }

    const months = Math.min(
      Math.max(parseInt(req.query.months, 10) || 6, 1),
      24
    );

    const [rows] = await pool.query(`
      SELECT
        YEAR(sale_date) AS year,
        MONTH(sale_date) AS monthNumber,
        COALESCE(SUM(total), 0) AS sales
      FROM sales
      WHERE company_id = ?
        AND sale_date >= DATE_FORMAT(
          DATE_SUB(CURDATE(), INTERVAL ? MONTH),
          '%Y-%m-01'
        )
        AND sale_date < DATE_ADD(CURDATE(), INTERVAL 1 DAY)
        AND status != 'cancelled'
      GROUP BY YEAR(sale_date), MONTH(sale_date)
      ORDER BY year ASC, monthNumber ASC
    `, [companyId, months - 1]);

    const result = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      const year = date.getFullYear();
      const monthNumber = date.getMonth() + 1;

      const existing = rows.find(
        row =>
          Number(row.year) === year &&
          Number(row.monthNumber) === monthNumber
      );

      result.push({
        month: date.toLocaleString('en-US', {
          month: 'short',
        }),
        sales: Number(existing?.sales || 0),
      });
    }

    return res.json(result);

  } catch (error) {
    console.error('Monthly Sales Error:', error);
    throw error;
  }
});


// --------------------------------------------------
// 4. PURCHASE VS SALES
// GET /api/dashboard/purchase-vs-sales?months=6
// --------------------------------------------------


exports.getPurchaseVsSales = asyncHandler(async (req, res) => {
  try {
    const companyId = req.user?.company_id;

    if (!companyId) {
      return res.status(401).json({
        success: false,
        message: 'Company ID not found',
      });
    }

    const months = Math.min(
      Math.max(parseInt(req.query.months, 10) || 6, 1),
      24
    );

    // 1. Monthly sales
    const [salesRows] = await pool.query(`
      SELECT
        YEAR(sale_date) AS year,
        MONTH(sale_date) AS monthNumber,
        COALESCE(SUM(total), 0) AS sales
      FROM sales
      WHERE company_id = ?
        AND sale_date >= DATE_FORMAT(
          DATE_SUB(CURDATE(), INTERVAL ? MONTH),
          '%Y-%m-01'
        )
        AND sale_date < DATE_ADD(CURDATE(), INTERVAL 1 DAY)
        AND status != 'cancelled'
      GROUP BY YEAR(sale_date), MONTH(sale_date)
    `, [companyId, months - 1]);

    // 2. Monthly purchases
    const [purchaseRows] = await pool.query(`
      SELECT
        YEAR(purchase_date) AS year,
        MONTH(purchase_date) AS monthNumber,
        COALESCE(SUM(total), 0) AS purchases
      FROM purchases
      WHERE company_id = ?
        AND purchase_date >= DATE_FORMAT(
          DATE_SUB(CURDATE(), INTERVAL ? MONTH),
          '%Y-%m-01'
        )
        AND purchase_date < DATE_ADD(CURDATE(), INTERVAL 1 DAY)
        AND status = 'received'
      GROUP BY YEAR(purchase_date), MONTH(purchase_date)
    `, [companyId, months - 1]);

    // 3. Combine monthly results
    const result = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      const year = date.getFullYear();
      const monthNumber = date.getMonth() + 1;

      const sale = salesRows.find(
        row =>
          Number(row.year) === year &&
          Number(row.monthNumber) === monthNumber
      );

      const purchase = purchaseRows.find(
        row =>
          Number(row.year) === year &&
          Number(row.monthNumber) === monthNumber
      );

      result.push({
        month: date.toLocaleString('en-US', {
          month: 'short',
        }),
        sales: Number(sale?.sales || 0),
        purchases: Number(purchase?.purchases || 0),
      });
    }

    return res.json(result);

  } catch (error) {
    console.error('Purchase Vs Sales Error:', error);
    throw error;
  }
});


// --------------------------------------------------
// 5. TOP PRODUCTS
// GET /api/dashboard/top-products?range=month
// --------------------------------------------------


exports.getTopProducts = asyncHandler(async (req, res) => {
  try {
    const companyId = req.user?.company_id;

    if (!companyId) {
      return res.status(401).json({
        success: false,
        message: 'Company ID not found',
      });
    }

    const { range = 'month' } = req.query;

    const allowedRanges = ['today', '7d', '30d', 'month'];

    if (!allowedRanges.includes(range)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date range',
      });
    }

    // Date conditions
    const dateConditions = {
      today: `
        s.sale_date = CURDATE()
      `,
      '7d': `
        s.sale_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        AND s.sale_date <= CURDATE()
      `,
      '30d': `
        s.sale_date >= DATE_SUB(CURDATE(), INTERVAL 29 DAY)
        AND s.sale_date <= CURDATE()
      `,
      month: `
        s.sale_date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
        AND s.sale_date <= CURDATE()
      `,
    };

    const [rows] = await pool.query(`
      SELECT
        p.id,
        p.name,
        p.sku,

        COALESCE(SUM(si.qty), 0) AS unitsSold,

        COALESCE(SUM(si.line_total), 0) AS revenue,

        p.stock_qty AS stock

      FROM products p

      INNER JOIN sale_items si
        ON si.product_id = p.id

      INNER JOIN sales s
        ON s.id = si.sale_id

      WHERE p.company_id = ?
        AND s.company_id = ?
        AND p.status = 'active'
        AND s.status != 'cancelled'
        AND ${dateConditions[range]}

      GROUP BY
        p.id,
        p.name,
        p.sku,
        p.stock_qty

      ORDER BY unitsSold DESC

      LIMIT 10
    `, [companyId, companyId]);

    return res.json(rows.map(row => ({
      id: Number(row.id),
      name: row.name,
      sku: row.sku,
      unitsSold: Number(row.unitsSold),
      revenue: Number(row.revenue),
      stock: Number(row.stock),
    })));

  } catch (error) {
    console.error('Top Products Error:', error);
    throw error;
  }
});


// --------------------------------------------------
// 6. RECENT SALES
// GET /api/dashboard/recent-sales
// --------------------------------------------------


exports.getRecentSales = asyncHandler(async (req, res) => {
  try {
    const companyId = req.user?.company_id;

    if (!companyId) {
      return res.status(401).json({
        success: false,
        message: 'Company ID not found',
      });
    }

    const [rows] = await pool.query(`
      SELECT
        s.id,
        s.number,
        c.name AS customer,
        s.sale_date AS date,
        s.total,
        s.payment_status AS paymentStatus,
        s.status

      FROM sales s

      LEFT JOIN customers c
        ON c.id = s.customer_id
        AND c.company_id = s.company_id

      WHERE s.company_id = ?

      ORDER BY s.sale_date DESC, s.id DESC

      LIMIT 10
    `, [companyId]);

    return res.json(rows.map(row => ({
      ...row,
      id: Number(row.id),
      total: Number(row.total),
    })));

  } catch (error) {
    console.error('Recent Sales Error:', error);
    throw error;
  }
});


// --------------------------------------------------
// 7. RECENT PURCHASES
// GET /api/dashboard/recent-purchases
// --------------------------------------------------


exports.getRecentPurchases = asyncHandler(async (req, res) => {
  try {
    const companyId = req.user?.company_id;

    if (!companyId) {
      return res.status(401).json({
        success: false,
        message: 'Company ID not found',
      });
    }

    const [rows] = await pool.query(`
      SELECT
        p.id,
        p.number,
        s.name AS supplier,
        p.purchase_date AS date,
        p.total,
        p.status

      FROM purchases p

      LEFT JOIN suppliers s
        ON s.id = p.supplier_id

      WHERE p.company_id = ?

      ORDER BY p.purchase_date DESC, p.id DESC

      LIMIT 10
    `, [companyId]);

    return res.json(rows.map(row => ({
      ...row,
      id: Number(row.id),
      total: Number(row.total),
    })));

  } catch (error) {
    console.error('Recent Purchases Error:', error);
    throw error;
  }
});


// --------------------------------------------------
// 8. RECENT ACTIVITY
// GET /api/dashboard/recent-activity
// --------------------------------------------------


exports.getRecentActivity = asyncHandler(async (req, res) => {
  try {
    const companyId = req.user?.company_id;

    if (!companyId) {
      return res.status(401).json({
        success: false,
        message: 'Company ID not found',
      });
    }

    const [rows] = await pool.query(`
      SELECT *
      FROM (

        -- SALES
        SELECT
          s.id,
          'sale' AS type,
          CONCAT(
            'Sale ',
            s.number,
            ' ',
            CASE
              WHEN s.status = 'completed' THEN 'completed'
              ELSE s.status
            END
          ) AS text,
          s.created_at AS at,
          u.name AS user

        FROM sales s
        LEFT JOIN users u
          ON u.id = s.created_by
        WHERE s.company_id = ?

        UNION ALL

        -- PURCHASES
        SELECT
          p.id,
          'purchase' AS type,
          CONCAT(
            'Purchase ',
            p.number,
            ' ',
            p.status
          ) AS text,
          p.created_at AS at,
          u.name AS user

        FROM purchases p
        LEFT JOIN users u
          ON u.id = p.created_by
        WHERE p.company_id = ?

        UNION ALL

        -- PAYMENTS
        SELECT
          pay.id,
          'payment' AS type,
          CONCAT(
            'Payment of ',
            FORMAT(pay.amount, 2),
            ' recorded for ',
            COALESCE(i.number, 'Unknown invoice')
          ) AS text,
          pay.paid_at AS at,
          u.name AS user

        FROM payments pay
        LEFT JOIN invoices i
          ON i.id = pay.invoice_id
          AND i.company_id = pay.company_id
        LEFT JOIN users u
          ON u.id = pay.created_by
        WHERE pay.company_id = ?

        UNION ALL

        -- STOCK ADJUSTMENTS
        SELECT
          sm.id,
          'adjust' AS type,
          CONCAT(
            'Stock ',
            sm.type,
            ' for ',
            COALESCE(pr.name, 'Unknown product'),
            ' (',
            CASE
              WHEN sm.type = 'out' THEN CONCAT('-', sm.qty)
              ELSE CONCAT('+', sm.qty)
            END,
            ')'
          ) AS text,
          sm.created_at AS at,
          u.name AS user

        FROM stock_movements sm
        LEFT JOIN products pr
          ON pr.id = sm.product_id
          AND pr.company_id = sm.company_id
        LEFT JOIN users u
          ON u.id = sm.created_by
        WHERE sm.company_id = ?

        UNION ALL

        -- INVOICES
        SELECT
          i.id,
          'invoice' AS type,
          CONCAT(
            'Invoice ',
            i.number,
            ' generated'
          ) AS text,
          i.created_at AS at,
          NULL AS user

        FROM invoices i
        WHERE i.company_id = ?

      ) AS activity

      ORDER BY at DESC
      LIMIT 10
    `, [
      companyId,
      companyId,
      companyId,
      companyId,
      companyId
    ]);

    return res.json(rows);

  } catch (error) {
    console.error('Recent Activity Error:', error);
    throw error;
  }
});

