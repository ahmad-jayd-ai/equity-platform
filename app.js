// ==========================================================================
// EQUITY PLATFORM - CORE CONTROLLER & SHARIA BUSINESS ENGINE (ES6 JS)
// ==========================================================================

// --- CURRENCY FLAG HELPERS ---
function getCurrencyFlag(curr) {
  switch (curr) {
    case 'USD': return '🇺🇸';
    case 'IQD': return '🇮🇶';
    case 'EUR': return '🇪🇺';
    case 'AED': return '🇦🇪';
    default: return '';
  }
}

function formatCurrencyName(curr) {
  const flag = getCurrencyFlag(curr);
  return flag ? `${flag} ${curr}` : curr;
}

// --- DATA EXPORT HELPERS ---
function exportToCSV(filename, headers, rows) {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(val => {
      let str = String(val === null || val === undefined ? '' : val);
      str = str.replace(/"/g, '""');
      return `"${str}"`;
    }).join(','))
  ].join('\n');
  
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportToPDF(title, headers, rows) {
  const printWindow = window.open('', '_blank', 'width=1000,height=800');
  if (!printWindow) {
    alert(state.activeLanguage === 'ar' ? 'يرجى السماح بفتح النوافذ المنبثقة لتتمكن من تصدير PDF.' : 'Please allow popups to export to PDF.');
    return;
  }
  const isRtl = state.activeLanguage === 'ar';
  const direction = isRtl ? 'rtl' : 'ltr';
  const alignment = isRtl ? 'right' : 'left';
  
  const tableRows = rows.map(row => `
    <tr>
      ${row.map(cell => `<td>${cell}</td>`).join('')}
    </tr>
  `).join('');
  
  const tableHeaders = headers.map(h => `<th>${h}</th>`).join('');
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="${state.activeLanguage}" dir="${direction}">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;800&display=swap');
        body {
          font-family: 'Tajawal', sans-serif;
          margin: 40px;
          color: #2d2621;
          direction: ${direction};
          text-align: ${alignment};
          background-color: #fff;
        }
        h2 {
          color: #ae7c50;
          border-bottom: 2px solid #ae7c50;
          padding-bottom: 10px;
          margin-bottom: 25px;
          font-weight: 800;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #e7dfd5;
          padding: 12px;
          text-align: ${alignment};
          font-size: 0.9rem;
        }
        th {
          background-color: #fcfbf9;
          color: #8b5a2b;
          font-weight: 700;
        }
        tr:nth-child(even) {
          background-color: #fdfdfd;
        }
        .footer {
          margin-top: 40px;
          font-size: 0.8rem;
          color: #8c857b;
          text-align: center;
          border-top: 1px solid #e7dfd5;
          padding-top: 15px;
        }
      </style>
    </head>
    <body>
      <h2>${title}</h2>
      <table>
        <thead>
          <tr>
            ${tableHeaders}
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
      <div class="footer">
        ${state.activeLanguage === 'ar' ? 'أكويتي للحلول المالية - تقرير تلقائي مصاحب لموازنة العملة العكسية' : 'Equity Platform - Automated report generated under Sharia controls'}
      </div>
      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() { window.close(); }, 500);
        }
      </script>
    </body>
    </html>
  `;
  
  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

// --- ROLEX CLOCK HANDS UPDATER ---
function updateRolexClock() {
  const hrHand = document.getElementById('rolex-hour-hand');
  const minHand = document.getElementById('rolex-minute-hand');
  const secHand = document.getElementById('rolex-second-hand');
  const dateVal = document.getElementById('rolex-date-val');
  
  if (!hrHand || !minHand) return;
  
  const now = new Date();
  const secs = now.getSeconds();
  const mins = now.getMinutes();
  const hrs = now.getHours();
  
  const secDeg = secs * 6;
  const minDeg = mins * 6 + secs * 0.1;
  const hrDeg = (hrs % 12) * 30 + mins * 0.5;
  
  hrHand.style.transform = `rotate(${hrDeg}deg)`;
  minHand.style.transform = `rotate(${minDeg}deg)`;
  if (secHand) secHand.style.transform = `rotate(${secDeg}deg)`;
  
  if (dateVal) {
    dateVal.innerText = now.getDate();
  }
}

// --- TRANSLATION DICTIONARIES ---
const translations = {
  ar: {
    appTitle: "equity platform",
    appSubTitle: "نظام إدارة السيولة والاستثمار المالي",
    devBy: "تطوير: شركة جيدو للحلول البرمجية (Jido-IT)",
    
    // Navigation
    dashboard: "الواجهة الرئيسة",
    monthly_balance: "الميزان الشهري",
    capitalBalance: "ميزان رأس المال",
    netCapital: "صافي رأس مال الشركة المشغل",
    funderCapital: "إجمالي رأس مال الممولين",
    operatorCapital: "إجمالي رأس مال المشغلين",
    creditors: "عقود الممولين (Inflows)",
    debtors: "عقود المشغلين (Outflows)",
    calculator: "الحاسبة وجدول السداد",
    ledgers: "دفتر الحسابات",
    analysis: "التحليل المالي والتوصيات",
    
    // General Metrics
    totalCreditorCap: "إجمالي أموال الممولين",
    totalDebtorCap: "إجمالي أموال المشغلين",
    expectedArbitrage: "أرباح فروقات الصرف المتوقعة",
    activeContracts: "العقود النشطة",
    funderContracts: "عقود الممولين (الدائنين)",
    operatorContracts: "عقود المشغلين (المدينين)",
    ratesTitle: "أسعار الصرف (مقابل USD)",
    ratesSubtitle: "تحديث أسعار الصرف لتعديل حسابات الأرباح تلقائياً",
    
    // Forms & Fields
    contractDetails: "تفاصيل العقد",
    createContract: "إبرام عقد مضاربة جديد",
    funderName: "اسم الممول (الدائن)",
    operatorName: "اسم المشغل (المدين)",
    principal: "رأس المال (Principal)",
    principalCurrency: "عملة رأس المال",
    returnCurrency: "عملة العوائد (عكسية)",
    dividendRate: "نسبة ربح المصالحة السنوية (Sulh Dividend)",
    duration: "مدة التشغيل (بالأشهر)",
    startDate: "تاريخ البدء",
    saveContractBtn: "حفظ وتوثيق العقد",
    validationMatchError: "تنبيه شرعي حرج: يمنع مطابقة عملة رأس المال مع عملة العوائد في نفس العقد لضمان تحقيق فوائد الصرف العكسي.",
    validationRequired: "يرجى ملء جميع الحقول المطلوبة.",
    successSaved: "تم حفظ العقد بنجاح وتحديث جداول الاسترداد.",
    dividendTypeLabel: "طريقة تحديد أرباح المصالحة",
    divTypeRate: "نسبة مئوية سنوية (%)",
    divTypeFixed: "مبلغ شهري ثابت بعملة العائد",
    monthlyAmountLabel: "مبلغ العائد الشهري الثابت",
    
    // Tables & Actions
    name: "الطرف الثاني",
    status: "حالة العقد",
    actions: "الإجراءات",
    active: "نشط",
    completed: "مكتمل",
    delete: "حذف العقد",
    confirmDelete: "هل أنت متأكد من رغبتك في حذف هذا العقد؟",
    noContracts: "لا توجد عقود مسجلة حالياً.",
    resetData: "تصفير وإفراغ كافة البيانات",
    confirmReset: "هل أنت متأكد من رغبتك في حذف كافة عقود الممولين والمشغلين وتصفير المنصة بالكامل؟ (لا يمكن التراجع)",
    exportData: "تصدير نسخة احتياطية",
    importData: "استيراد نسخة احتياطية",
    exportDataTooltip: "تنزيل نسخة احتياطية من البيانات بصيغة JSON",
    importDataTooltip: "رفع واستعادة نسخة احتياطية من البيانات",
    importSuccess: "تم استيراد البيانات واستعادة المنصة بنجاح!",
    importError: "فشل استيراد الملف. يرجى التأكد من اختيار ملف نسخة احتياطية صحيح وصالح.",
    
    // Calculator & Scheduler
    simTitle: "محاكي العقود وجدولة الدفعات",
    simSubtitle: "محاكاة الحسابات الشرعية وجدول الاسترداد للعملات العكسية قبل التعاقد الرسمي",
    calculateBtn: "توليد جدول الدفعات",
    scheduleTitle: "جدول استرداد رأس المال وتوزيع أرباح المصالحة",
    timelineTitle: "الجدول الزمني للتدفقات المالية القادمة",
    paymentDate: "تاريخ الاستحقاق",
    paymentType: "نوع التدفق",
    payoutFunder: "أرباح ممول (خارج)",
    collectOperator: "أرباح مشغل (داخل)",
    principalReturn: "استرداد رأس المال",
    amount: "المبلغ (بالعملة الأصلية)",
    amountInReturn: "المبلغ المستحق (بعملة العائد العكسية)",
    equivalentUSD: "القيمة المكافئة بالدولار USD",
    
    // Chart
    chartTitle: "مقارنة تدفقات الأرباح الشهرية (USD)",
    chartInflow: "تحصيلات من المشغلين",
    chartOutflow: "دفعات للممولين",
    chartNet: "صافي أرباح الفروقات (Arbitrage)",
    
    // Accounting Ledgers
    ledgerTitle: "دفاتر الحسابات المحاسبية",
    ledgerSubtitle: "كشوف الحركات والأرصدة للممولين والمشغلين وحساب أرباح المنصة المركزي",
    profitsAccount: "حساب الأرباح المركزي (الربح)",
    creditorAccounts: "حسابات الممولين (الدائنين)",
    debtorAccounts: "حسابات المشغلين (المدينين)",
    accountName: "الحساب",
    outstandingBalance: "الرصيد المستحق الحالي",
    settledBalance: "إجمالي المسوى/المدفوع",
    viewStatement: "كشف الحساب",
    payBtn: "تسجيل صرف",
    collectBtn: "تسجيل تحصيل",
    outstandingDues: "جدول مستحقات الدورة الحالية (الذمم)",
    noDues: "لا توجد مستحقات معلقة حالياً. تم تسوية جميع الدفعات.",
    postEntryTitle: "تسجيل حركة محاسبية يدوية",
    description: "البيان / الحركة",
    debit: "مدين (Debit)",
    credit: "دائن (Credit)",
    balance: "الرصيد المتبقي",
    date: "التاريخ",
    statementOf: "كشف حساب للطرف الثاني:",
    platformStatement: "كشف حساب الأرباح الصافية للمنصة",
    
    // Sharia Context Footer
    shariaFooter: "أكويتي للحلول المالية - مبني بالكامل وفق ضوابط المضاربة الشرعية المعتمدة ومحركات تسعير العملة العكسية."
  },
  en: {
    appTitle: "equity platform",
    appSubTitle: "Liquidity Management & Financial Investment",
    devBy: "Developed by: Jido-IT Software Solutions",
    
    // Navigation
    dashboard: "Main Interface",
    monthly_balance: "Monthly Balance",
    capitalBalance: "Capital Balance",
    netCapital: "Net Deployed Capital",
    funderCapital: "Total Funder Capital",
    operatorCapital: "Total Operator Capital",
    creditors: "Funder Contracts (Inflows)",
    debtors: "Operator Contracts (Outflows)",
    calculator: "Calculator & Scheduler",
    ledgers: "Ledgers",
    analysis: "Financial Analysis & Recommendations",
    
    // General Metrics
    totalCreditorCap: "Total Funder Capital",
    totalDebtorCap: "Total Operator Capital",
    expectedArbitrage: "Expected Arbitrage Profit",
    activeContracts: "Active Contracts",
    funderContracts: "Funder Contracts (Creditors)",
    operatorContracts: "Operator Contracts (Debtors)",
    ratesTitle: "Exchange Rates (vs USD)",
    ratesSubtitle: "Update exchange rates to automatically recalculate arbitrage profits",
    
    // Forms & Fields
    contractDetails: "Contract Details",
    createContract: "Conclude New Mudarabah Contract",
    funderName: "Funder Name (Creditor)",
    operatorName: "Operator Name (Debtor)",
    principal: "Principal Capital",
    principalCurrency: "Principal Currency",
    returnCurrency: "Return Currency (Inverse)",
    dividendRate: "Sulh Dividend Rate (Annualized)",
    duration: "Duration (Months)",
    startDate: "Start Date",
    saveContractBtn: "Save & Document Contract",
    validationMatchError: "Critical Sharia Alert: Principal currency and Return currency cannot match in the same contract to guarantee inverse exchange rate benefits.",
    validationRequired: "Please fill in all required fields.",
    successSaved: "Contract saved successfully and schedule generated.",
    dividendTypeLabel: "Dividend Pricing Type",
    divTypeRate: "Annual Percentage Rate (%)",
    divTypeFixed: "Fixed Monthly Amount in Return Currency",
    monthlyAmountLabel: "Fixed Monthly Dividend Amount",
    
    // Tables & Actions
    name: "Counterparty",
    status: "Status",
    actions: "Actions",
    active: "Active",
    completed: "Completed",
    delete: "Delete Contract",
    confirmDelete: "Are you sure you want to delete this contract?",
    noContracts: "No contracts recorded yet.",
    resetData: "Reset and Clear All Data",
    confirmReset: "Are you sure you want to delete all contracts (funders & operators) and completely reset the platform? (This cannot be undone)",
    exportData: "Export Backup",
    importData: "Import Backup",
    exportDataTooltip: "Download a backup of your data as JSON",
    importDataTooltip: "Upload and restore a data backup",
    importSuccess: "Data imported and platform restored successfully!",
    importError: "Failed to import file. Please make sure to choose a valid backup file.",
    
    // Calculator & Scheduler
    simTitle: "Contract Simulator & Scheduler",
    simSubtitle: "Simulate Sharia calculations and inverse currency payback tables before formal contract signoff",
    calculateBtn: "Generate Payment Schedule",
    scheduleTitle: "Capital Recovery & Sulh Dividend Distribution Schedule",
    timelineTitle: "Upcoming Cash Flow Timeline",
    paymentDate: "Due Date",
    paymentType: "Flow Type",
    payoutFunder: "Funder Dividend (Outflow)",
    collectOperator: "Operator Dividend (Inflow)",
    principalReturn: "Principal Return",
    amount: "Amount (Original Currency)",
    amountInReturn: "Payable Amount (Inverse Currency)",
    equivalentUSD: "Equivalent Value in USD",
    
    // Chart
    chartTitle: "Monthly Dividend Flows Comparison (USD)",
    chartInflow: "Collections from Operators",
    chartOutflow: "Payouts to Funders",
    chartNet: "Net Arbitrage Profit",
    
    // Accounting Ledgers
    ledgerTitle: "Accounting Ledgers",
    ledgerSubtitle: "Statements of account transactions, balances, and platform central profits account",
    profitsAccount: "Central Profits Account (الربح)",
    creditorAccounts: "Funder Accounts (Creditors)",
    debtorAccounts: "Operator Accounts (Debtors)",
    accountName: "Account Name",
    outstandingBalance: "Current Balance (Due)",
    settledBalance: "Total Settled / Paid",
    viewStatement: "View Statement",
    payBtn: "Payout",
    collectBtn: "Collect",
    outstandingDues: "Current Cycle Outstanding Accounts Receivable/Payable",
    noDues: "No outstanding payments due. All entries settled.",
    postEntryTitle: "Post Ledger Entry",
    description: "Description",
    debit: "Debit",
    credit: "Credit",
    balance: "Balance",
    date: "Date",
    statementOf: "Account Statement for:",
    platformStatement: "Platform Net Profits Statement",
    
    // Sharia Context Footer
    shariaFooter: "Equity Financial Solutions - Fully built according to Sharia-compliant Mudarabah rules and inverse currency pricing engines."
  }
};

// --- APPLICATION STATE ---
let state = {
  activeLanguage: 'ar',
  activeTab: 'dashboard',
  theme: 'dark',
  balanceDisplayCurrency: 'IQD',
  exchangeRates: {
    USD: 1.0,
    IQD: 1450.0,
    EUR: 0.92,
    AED: 3.67
  },
  contracts: [],
  transactions: [] // Ledger transaction logs
};

let statementDateFilters = {
  accountId: '',
  startDate: '',
  endDate: ''
};

// --- MOCK MUDARABAH DATA ---
const defaultContracts = [
  // --- REAL FUNDER CONTRACTS (CREDITORS) ---
  {
    id: "cnt_f_001",
    partyName: "صفاء احمد حسن",
    type: "creditor",
    principal: 30000,
    principalCurrency: "USD",
    returnCurrency: "IQD",
    dividendType: "fixed",
    dividendRate: 0,
    monthlyDividendAmount: 900000, // 300,000 per 10k principal
    customExchangeRate: 1450.0,
    duration: 24,
    startDate: "2026-01-01",
    status: "active"
  },
  {
    id: "cnt_f_002",
    partyName: "محمد جايد بدر",
    type: "creditor",
    principal: 20000,
    principalCurrency: "USD",
    returnCurrency: "IQD",
    dividendType: "fixed",
    dividendRate: 0,
    monthlyDividendAmount: 600000, // 300,000 per 10k principal
    customExchangeRate: 1450.0,
    duration: 24,
    startDate: "2026-01-01",
    status: "active"
  },
  {
    id: "cnt_f_003",
    partyName: "علي الساعدي",
    type: "creditor",
    principal: 50000,
    principalCurrency: "USD",
    returnCurrency: "IQD",
    dividendType: "fixed",
    dividendRate: 0,
    monthlyDividendAmount: 1500000, // 300,000 per 10k principal
    customExchangeRate: 1450.0,
    duration: 24,
    startDate: "2026-01-01",
    status: "active"
  },
  {
    id: "cnt_f_004",
    partyName: "سيد محمد ضياء الدين",
    type: "creditor",
    principal: 50000,
    principalCurrency: "USD",
    returnCurrency: "IQD",
    dividendType: "fixed",
    dividendRate: 0,
    monthlyDividendAmount: 1500000, // 300,000 per 10k principal
    customExchangeRate: 1450.0,
    duration: 24,
    startDate: "2026-01-01",
    status: "active"
  },
  {
    id: "cnt_f_005",
    partyName: "د خضير جاسم",
    type: "creditor",
    principal: 60000,
    principalCurrency: "USD",
    returnCurrency: "IQD",
    dividendType: "fixed",
    dividendRate: 0,
    monthlyDividendAmount: 1800000, // 300,000 per 10k principal
    customExchangeRate: 1450.0,
    duration: 24,
    startDate: "2026-01-01",
    status: "active"
  },
  {
    id: "cnt_f_006",
    partyName: "د إيهاب عبد الرزاق",
    type: "creditor",
    principal: 10000,
    principalCurrency: "USD",
    returnCurrency: "IQD",
    dividendType: "fixed",
    dividendRate: 0,
    monthlyDividendAmount: 300000, // 300,000 per 10k principal
    customExchangeRate: 1450.0,
    duration: 24,
    startDate: "2026-01-01",
    status: "active"
  },
  {
    id: "cnt_f_007",
    partyName: "د احمد الزيدي",
    type: "creditor",
    principal: 30000,
    principalCurrency: "USD",
    returnCurrency: "IQD",
    dividendType: "fixed",
    dividendRate: 0,
    monthlyDividendAmount: 1050000, // 350,000 per 10k principal
    customExchangeRate: 1450.0,
    duration: 24,
    startDate: "2026-01-01",
    status: "active"
  },
  {
    id: "cnt_f_008",
    partyName: "احمد موسى",
    type: "creditor",
    principal: 15000,
    principalCurrency: "USD",
    returnCurrency: "IQD",
    dividendType: "fixed",
    dividendRate: 0,
    monthlyDividendAmount: 450000, // 300,000 per 10k principal
    customExchangeRate: 1450.0,
    duration: 24,
    startDate: "2026-01-01",
    status: "active"
  },
  {
    id: "cnt_f_009",
    partyName: "امجد أبو حيدر",
    type: "creditor",
    principal: 5000,
    principalCurrency: "USD",
    returnCurrency: "IQD",
    dividendType: "fixed",
    dividendRate: 0,
    monthlyDividendAmount: 150000, // 300,000 per 10k principal
    customExchangeRate: 1450.0,
    duration: 24,
    startDate: "2026-01-01",
    status: "active"
  },
  {
    id: "cnt_f_010",
    partyName: "د فرات عبد الرضا",
    type: "creditor",
    principal: 15000,
    principalCurrency: "USD",
    returnCurrency: "IQD",
    dividendType: "fixed",
    dividendRate: 0,
    monthlyDividendAmount: 450000, // 300,000 per 10k principal
    customExchangeRate: 1450.0,
    duration: 24,
    startDate: "2026-01-01",
    status: "active"
  },
  // --- EXISTING DEBTOR (OPERATOR) CONTRACTS ---
  {
    id: "cnt_d_001",
    partyName: "اسيا سيل 1",
    type: "debtor",
    principal: 88950000,
    principalCurrency: "IQD",
    returnCurrency: "USD",
    dividendType: "fixed",
    dividendRate: 0,
    monthlyDividendAmount: 2400,
    customExchangeRate: 1450.0,
    duration: 24,
    startDate: "2026-01-01",
    status: "active",
    isInternal: true,
    notes: "جدول التسديد: كل 3 اشهر"
  },
  {
    id: "cnt_d_002",
    partyName: "اسيا سيل 2",
    type: "debtor",
    principal: 40000,
    principalCurrency: "USD",
    returnCurrency: "IQD",
    dividendType: "fixed",
    dividendRate: 0,
    monthlyDividendAmount: 2400000,
    customExchangeRate: 1450.0,
    duration: 24,
    startDate: "2026-01-01",
    status: "active",
    isInternal: true,
    notes: "جدول التسديد: كل 3 اشهر"
  },
  {
    id: "cnt_d_003",
    partyName: "اسيا سيل 3",
    type: "debtor",
    principal: 70450000,
    principalCurrency: "IQD",
    returnCurrency: "USD",
    dividendType: "fixed",
    dividendRate: 0,
    monthlyDividendAmount: 2000,
    customExchangeRate: 1450.0,
    duration: 24,
    startDate: "2026-01-01",
    status: "active",
    isInternal: true,
    notes: "جدول التسديد: كل 3 اشهر"
  },
  {
    id: "cnt_d_004",
    partyName: "اسيا سيل 4",
    type: "debtor",
    principal: 20000,
    principalCurrency: "USD",
    returnCurrency: "IQD",
    dividendType: "fixed",
    dividendRate: 0,
    monthlyDividendAmount: 1200000,
    customExchangeRate: 1450.0,
    duration: 24,
    startDate: "2026-01-01",
    status: "active",
    isInternal: true,
    notes: "جدول التسديد: كل 6 اشهر"
  },
  {
    id: "cnt_d_005",
    partyName: "اسيا سيل 5",
    type: "debtor",
    principal: 50000,
    principalCurrency: "USD",
    returnCurrency: "IQD",
    dividendType: "fixed",
    dividendRate: 0,
    monthlyDividendAmount: 3000000,
    customExchangeRate: 1450.0,
    duration: 6,
    startDate: "2026-01-01",
    status: "active",
    isInternal: true,
    notes: "جدول التسديد: كل 6 اشهر"
  }
];

// Timezone-safe local date formatter
function formatLocalDate(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// --- FINANCIAL CALCULATOR HELPERS ---
function convertToUSD(amount, currency) {
  const rate = state.exchangeRates[currency] || 1.0;
  return amount / rate;
}

function convertFromUSD(amount, targetCurrency) {
  const rate = state.exchangeRates[targetCurrency] || 1.0;
  return amount * rate;
}

function convertCurrency(amount, from, to) {
  if (from === to) return amount;
  return convertFromUSD(convertToUSD(amount, from), to);
}

// Custom contract currency conversion using locked rate if specified
function convertContractCurrency(amount, from, to, contract) {
  if (from === to) return amount;
  
  if (contract && contract.customExchangeRate && contract.customExchangeRate > 0) {
    const tempRates = { ...state.exchangeRates };
    if (contract.returnCurrency === 'IQD' || contract.principalCurrency === 'IQD') {
      tempRates['IQD'] = contract.customExchangeRate;
      tempRates['USD'] = 1.0;
    } else {
      tempRates[contract.returnCurrency] = contract.customExchangeRate;
    }
    
    const rateFrom = tempRates[from] || 1.0;
    const rateTo = tempRates[to] || 1.0;
    return (amount / rateFrom) * rateTo;
  }
  
  return convertCurrency(amount, from, to);
}

// --- ARABIC AND ENGLISH TAFQEET (NUMBERS TO WORDS) ALGORITHMS ---
function tafqeetArabic(amount, currencyCode) {
  if (amount === undefined || amount === null || isNaN(amount) || amount <= 0) {
    return "";
  }
  
  // Split into integer and fractional parts (max 2 decimal places)
  const parts = parseFloat(amount.toFixed(2)).toString().split(".");
  const integerPart = parseInt(parts[0], 10);
  const fractionalPart = parts[1] ? parseInt(parts[1].padEnd(2, "0").substring(0, 2), 10) : 0;
  
  if (integerPart === 0 && fractionalPart === 0) {
    return "";
  }
  
  const ones = ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة", "عشرة"];
  const teens = ["عشرة", "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر", "سبعة عشر", "ثمانية عشر", "تسعة عشر"];
  const tens = ["", "", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"];
  const hundreds = ["", "مائة", "مئتان", "ثلاثمائة", "أربعمائة", "خمسمائة", "ستمائة", "سبعمائة", "ثمانمائة", "تسعمائة"];
  
  function getThreeDigitsWord(n) {
    if (n === 0) return "";
    let words = [];
    
    const h = Math.floor(n / 100);
    const rem = n % 100;
    
    if (h > 0) {
      words.push(hundreds[h]);
    }
    
    if (rem > 0) {
      if (words.length > 0) words.push("و");
      
      if (rem <= 10) {
        words.push(ones[rem]);
      } else if (rem < 20) {
        words.push(teens[rem - 10]);
      } else {
        const o = rem % 10;
        const t = Math.floor(rem / 10);
        if (o > 0) {
          words.push(ones[o]);
          words.push("و");
        }
        words.push(tens[t]);
      }
    }
    
    return words.join(" ");
  }
  
  function numberToArabicWords(num) {
    if (num === 0) return "صفر";
    
    let words = [];
    
    // Billions
    const billions = Math.floor(num / 1000000000);
    let rem = num % 1000000000;
    if (billions > 0) {
      if (billions === 1) {
        words.push("مليار");
      } else if (billions === 2) {
        words.push("ملياران");
      } else if (billions >= 3 && billions <= 10) {
        words.push(getThreeDigitsWord(billions) + " مليارات");
      } else {
        words.push(getThreeDigitsWord(billions) + " مليار");
      }
    }
    
    // Millions
    const millions = Math.floor(rem / 1000000);
    rem = rem % 1000000;
    if (millions > 0) {
      if (words.length > 0) words.push("و");
      if (millions === 1) {
        words.push("مليون");
      } else if (millions === 2) {
        words.push("مليونان");
      } else if (millions >= 3 && millions <= 10) {
        words.push(getThreeDigitsWord(millions) + " ملايين");
      } else {
        words.push(getThreeDigitsWord(millions) + " مليون");
      }
    }
    
    // Thousands
    const thousands = Math.floor(rem / 1000);
    rem = rem % 1000;
    if (thousands > 0) {
      if (words.length > 0) words.push("و");
      if (thousands === 1) {
        words.push("ألف");
      } else if (thousands === 2) {
        words.push("ألفان");
      } else if (thousands >= 3 && thousands <= 10) {
        words.push(getThreeDigitsWord(thousands) + " آلاف");
      } else {
        words.push(getThreeDigitsWord(thousands) + " ألف");
      }
    }
    
    // Units
    if (rem > 0) {
      if (words.length > 0) words.push("و");
      words.push(getThreeDigitsWord(rem));
    }
    
    return words.join(" ").replace(/\s+/g, " ").trim();
  }
  
  const currencyMap = {
    USD: {
      singular: "دولار أمريكي",
      plural: "دولارات أمريكية",
      accusative: "دولاراً أمريكياً",
      fractionSingular: "سنت",
      fractionPlural: "سنتات",
      fractionAccusative: "سنتاً"
    },
    IQD: {
      singular: "دينار عراقي",
      plural: "دنانير عراقية",
      accusative: "ديناراً عراقياً",
      fractionSingular: "فلس",
      fractionPlural: "فلوس",
      fractionAccusative: "فلساً"
    },
    EUR: {
      singular: "يورو",
      plural: "يورو",
      accusative: "يورو",
      fractionSingular: "سنت",
      fractionPlural: "سنتات",
      fractionAccusative: "سنتاً"
    },
    AED: {
      singular: "درهم إماراتي",
      plural: "دراهم إماراتية",
      accusative: "درهماً إماراتياً",
      fractionSingular: "فلس",
      fractionPlural: "فلوس",
      fractionAccusative: "فلساً"
    }
  };
  
  const curr = currencyMap[currencyCode] || {
    singular: currencyCode,
    plural: currencyCode,
    accusative: currencyCode,
    fractionSingular: "جزء",
    fractionPlural: "أجزاء",
    fractionAccusative: "جزءاً"
  };
  
  let result = "";
  
  if (integerPart > 0) {
    let integerWords = numberToArabicWords(integerPart);
    let currencyLabel = curr.singular;
    
    const lastTwoDigits = integerPart % 100;
    
    if (integerPart === 1) {
      integerWords = "";
      currencyLabel = curr.singular + " واحد";
    } else if (integerPart === 2) {
      integerWords = "";
      if (currencyCode === 'USD') currencyLabel = "دولاران أمريكيان";
      else if (currencyCode === 'IQD') currencyLabel = "ديناران عراقيان";
      else if (currencyCode === 'EUR') currencyLabel = "يورووان";
      else if (currencyCode === 'AED') currencyLabel = "درهمان إماراتيان";
      else currencyLabel = curr.singular + " اثنان";
    } else if (lastTwoDigits >= 3 && lastTwoDigits <= 10) {
      currencyLabel = curr.plural;
    } else if (lastTwoDigits >= 11 && lastTwoDigits <= 99) {
      currencyLabel = curr.accusative;
    }
    
    result = (integerWords + " " + currencyLabel).trim();
  }
  
  if (fractionalPart > 0) {
    let fractionWords = numberToArabicWords(fractionalPart);
    let fractionLabel = curr.fractionSingular;
    
    const lastTwoDigits = fractionalPart % 100;
    
    if (fractionalPart === 1) {
      fractionWords = "";
      fractionLabel = curr.fractionSingular + " واحد";
    } else if (fractionalPart === 2) {
      fractionWords = "";
      if (curr.fractionSingular === "سنت") fractionLabel = "سنتان";
      else if (curr.fractionSingular === "فلس") fractionLabel = "فلسان";
      else fractionLabel = curr.fractionSingular + " اثنان";
    } else if (lastTwoDigits >= 3 && lastTwoDigits <= 10) {
      fractionLabel = curr.fractionPlural;
    } else if (lastTwoDigits >= 11 && lastTwoDigits <= 99) {
      fractionLabel = curr.fractionAccusative;
    }
    
    if (result !== "") {
      result += " و " + (fractionWords + " " + fractionLabel).trim();
    } else {
      result = (fractionWords + " " + fractionLabel).trim();
    }
  }
  
  return result ? (result + " فقط لا غير").replace(/\s+و\s+/g, " و") : "";
}

function tafqeetEnglish(amount, currencyCode) {
  if (amount === undefined || amount === null || isNaN(amount) || amount <= 0) {
    return "";
  }
  
  const parts = parseFloat(amount.toFixed(2)).toString().split(".");
  const integerPart = parseInt(parts[0], 10);
  const fractionalPart = parts[1] ? parseInt(parts[1].padEnd(2, "0").substring(0, 2), 10) : 0;
  
  if (integerPart === 0 && fractionalPart === 0) {
    return "";
  }
  
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  
  function getThreeDigitsWord(n) {
    if (n === 0) return "";
    let str = "";
    
    const h = Math.floor(n / 100);
    const rem = n % 100;
    
    if (h > 0) {
      str += ones[h] + " Hundred";
    }
    
    if (rem > 0) {
      if (str !== "") str += " and ";
      if (rem < 20) {
        str += ones[rem];
      } else {
        const o = rem % 10;
        const t = Math.floor(rem / 10);
        str += tens[t];
        if (o > 0) {
          str += "-" + ones[o];
        }
      }
    }
    return str;
  }
  
  function numberToEnglishWords(num) {
    if (num === 0) return "Zero";
    let words = [];
    
    const billions = Math.floor(num / 1000000000);
    let rem = num % 1000000000;
    if (billions > 0) {
      words.push(getThreeDigitsWord(billions) + " Billion");
    }
    
    const millions = Math.floor(rem / 1000000);
    rem = rem % 1000000;
    if (millions > 0) {
      words.push(getThreeDigitsWord(millions) + " Million");
    }
    
    const thousands = Math.floor(rem / 1000);
    rem = rem % 1000;
    if (thousands > 0) {
      words.push(getThreeDigitsWord(thousands) + " Thousand");
    }
    
    if (rem > 0) {
      words.push(getThreeDigitsWord(rem));
    }
    
    return words.join(" ").trim();
  }
  
  const currencyNames = {
    USD: { singular: "US Dollar", plural: "US Dollars", centsSingular: "Cent", centsPlural: "Cents" },
    IQD: { singular: "Iraqi Dinar", plural: "Iraqi Dinars", centsSingular: "Fils", centsPlural: "Fils" },
    EUR: { singular: "Euro", plural: "Euros", centsSingular: "Cent", centsPlural: "Cents" },
    AED: { singular: "UAE Dirham", plural: "UAE Dirhams", centsSingular: "Fils", centsPlural: "Fils" }
  };
  
  const names = currencyNames[currencyCode] || { singular: currencyCode, plural: currencyCode + "s", centsSingular: "Cent", centsPlural: "Cents" };
  
  let result = "";
  if (integerPart > 0) {
    const word = numberToEnglishWords(integerPart);
    const label = integerPart === 1 ? names.singular : names.plural;
    result = `${word} ${label}`;
  }
  
  if (fractionalPart > 0) {
    const word = numberToEnglishWords(fractionalPart);
    const label = fractionalPart === 1 ? names.centsSingular : names.centsPlural;
    if (result !== "") {
      result += ` and ${word} ${label}`;
    } else {
      result = `${word} ${label}`;
    }
  }
  
  return result ? result + " Only" : "";
}

// Calculates monthly return payments (Sulh_Dividend) in the return currency
function calculateMonthlyReturn(contract) {
  if (contract.dividendType === 'fixed') {
    return contract.monthlyDividendAmount;
  }
  const monthlyRate = (contract.dividendRate / 100) / 12;
  const monthlyPrincipalReturnVal = contract.principal * monthlyRate; // In Principal Currency
  return convertContractCurrency(monthlyPrincipalReturnVal, contract.principalCurrency, contract.returnCurrency, contract);
}

// Calculates total annualized expected return in USD for arbitrage comparison
function calculateAnnualReturnUSD(contract) {
  if (contract.dividendType === 'fixed') {
    const annualDividend = contract.monthlyDividendAmount * 12; // In returnCurrency
    return convertContractCurrency(annualDividend, contract.returnCurrency, 'USD', contract);
  }
  const annualDividendInPrincipal = contract.principal * (contract.dividendRate / 100);
  return convertContractCurrency(annualDividendInPrincipal, contract.principalCurrency, 'USD', contract);
}

// --- DOUBLE-ENTRY ACCOUNTING LEDGER ENGINE ---

// Calculates balances of all parties dynamically based on contract schedules and posted transactions
function getAccountBalances() {
  const balances = {
    creditors: {},
    debtors: {},
    profits: 0, // Platform profits balance
    internalOperations: 0 // Company internal operations balance (in IQD)
  };
  
  // Initialize balances for each contract
  state.contracts.forEach(c => {
    const isCompleted = c.status === 'completed';
    balances[c.type === 'creditor' ? 'creditors' : 'debtors'][c.id] = {
      partyName: c.partyName,
      contractId: c.id,
      currency: c.returnCurrency,
      principalCurrency: c.principalCurrency,
      principal: isCompleted ? 0 : c.principal,
      totalDividendsDue: 0,
      totalDividendsSettled: 0,
      balance: 0, // Current outstanding balance
      isInternal: c.isInternal || false
    };
    
    // Add internal operations principal to the central internalOperations account
    if (c.isInternal && !isCompleted) {
      const principalIQD = convertContractCurrency(c.principal, c.principalCurrency, 'IQD', c);
      balances.internalOperations += principalIQD;
    }
  });
  
  // Aggregate transactions
  state.transactions.forEach(t => {
    if (t.type === 'profit_posted') {
      balances.profits += t.amount;
    } else {
      const group = t.partyType === 'creditor' ? 'creditors' : 'debtors';
      const partyBal = balances[group][t.contractId];
      if (partyBal) {
        if (t.type === 'dividend_due') {
          partyBal.totalDividendsDue += t.amount;
          partyBal.balance += t.amount; // Increments due balance
        } else if (t.type === 'payout' || t.type === 'collect') {
          partyBal.totalDividendsSettled += t.amount;
          partyBal.balance -= t.amount; // Reduces balance when paid/collected
        }
      }
    }
  });
  
  return balances;
}

// Returns transactions filter for a specific contract account
function getPartyTransactions(contractId) {
  return state.transactions.filter(t => t.contractId === contractId);
}

// Dynamic party-level consolidated balances aggregator
function getConsolidatedBalances() {
  const contractBalances = getAccountBalances();
  const creditorsByParty = {};
  const debtorsByParty = {};
  
  // Aggregate creditors (funders)
  Object.values(contractBalances.creditors).forEach(cb => {
    const name = cb.partyName.trim();
    if (!creditorsByParty[name]) {
      creditorsByParty[name] = {
        partyName: cb.partyName,
        type: 'creditor',
        contracts: [],
        principals: {},
        dues: {},
        settleds: {},
        balances: {},
        isInternal: cb.isInternal
      };
    }
    const party = creditorsByParty[name];
    party.contracts.push(cb.contractId);
    
    party.principals[cb.principalCurrency] = (party.principals[cb.principalCurrency] || 0) + cb.principal;
    party.dues[cb.currency] = (party.dues[cb.currency] || 0) + cb.totalDividendsDue;
    party.settleds[cb.currency] = (party.settleds[cb.currency] || 0) + cb.totalDividendsSettled;
    party.balances[cb.currency] = (party.balances[cb.currency] || 0) + cb.balance;
    if (cb.isInternal) party.isInternal = true;
  });
  
  // Aggregate debtors (operators)
  Object.values(contractBalances.debtors).forEach(db => {
    const name = db.partyName.trim();
    if (!debtorsByParty[name]) {
      debtorsByParty[name] = {
        partyName: db.partyName,
        type: 'debtor',
        contracts: [],
        principals: {},
        dues: {},
        settleds: {},
        balances: {},
        isInternal: db.isInternal
      };
    }
    const party = debtorsByParty[name];
    party.contracts.push(db.contractId);
    
    party.principals[db.principalCurrency] = (party.principals[db.principalCurrency] || 0) + db.principal;
    party.dues[db.currency] = (party.dues[db.currency] || 0) + db.totalDividendsDue;
    party.settleds[db.currency] = (party.settleds[db.currency] || 0) + db.totalDividendsSettled;
    party.balances[db.currency] = (party.balances[db.currency] || 0) + db.balance;
    if (db.isInternal) party.isInternal = true;
  });
  
  return {
    creditors: Object.values(creditorsByParty),
    debtors: Object.values(debtorsByParty),
    profits: contractBalances.profits,
    internalOperations: contractBalances.internalOperations
  };
}

// Multi-currency formatter helper for consolidated views
function formatMultiCurrency(amounts) {
  const parts = [];
  Object.keys(amounts).forEach(curr => {
    const amt = amounts[curr];
    if (amt !== 0) {
      parts.push(`${amt.toLocaleString()} ${formatCurrencyName(curr)}`);
    }
  });
  return parts.length > 0 ? parts.join(" + ") : `0`;
}

// Auto-generates monthly dividend due installments (accruals) based on calendar months
function generateDues() {
  const today = new Date();
  let updated = false;
  
  state.contracts.forEach(c => {
    if (c.status === 'completed') return;
    if (!c.startDate || isNaN(Date.parse(c.startDate))) {
      console.warn(`Skipping dues generation for contract ${c.id} due to invalid start date.`);
      return;
    }
    const start = new Date(c.startDate);
    const startYear = start.getFullYear();
    const startMonth = start.getMonth();
    const startDay = start.getDate();
    const monthlyAmount = calculateMonthlyReturn(c);
    
    for (let m = 1; m <= c.duration; m++) {
      const targetMonth = startMonth + m;
      const targetYear = startYear + Math.floor(targetMonth / 12);
      const actualMonth = targetMonth % 12;
      
      // Prevent rolling over to the next month for shorter months like February
      const lastDayOfTargetMonth = new Date(targetYear, actualMonth + 1, 0).getDate();
      const clampedDay = Math.min(startDay, lastDayOfTargetMonth);
      const dueDate = new Date(targetYear, actualMonth, clampedDay);
      
      // If the monthly installment is due (in the past or today)
      if (dueDate <= today) {
        // Check if dividend_due for this period is already recorded
        const exists = state.transactions.some(
          t => t.contractId === c.id && t.period === m && t.type === 'dividend_due'
        );
        
        if (!exists) {
          // 1. Post the monthly due liability/entitlement
          state.transactions.push({
            id: `tx_due_${c.id.slice(-4)}_${m}_${Date.now().toString().slice(-4)}`,
            contractId: c.id,
            partyName: c.partyName,
            partyType: c.type,
            date: formatLocalDate(dueDate),
            type: 'dividend_due',
            period: m,
            amount: monthlyAmount,
            currency: c.returnCurrency,
            description: state.activeLanguage === 'ar' 
              ? `استحقاق أرباح المصالحة - الشهر ${m}` 
              : `Accrual of Sulh Dividend - Month ${m}`
          });
          
          updated = true;
        }
      }
    }
  });
  
  // Cleanly recalculate arbitrage spreads whenever dues are generated
  recalculateArbitrageSpreads();
  saveState();
}

// Cleanly recalculates all arbitrage spreads from scratch to prevent duplicates or stale records
function recalculateArbitrageSpreads() {
  // 1. Remove all profit_posted transactions
  state.transactions = state.transactions.filter(t => t.type !== 'profit_posted');
  
  // 2. Reset profitPosted flag on all dividend_due transactions
  state.transactions.forEach(t => {
    if (t.type === 'dividend_due') {
      delete t.profitPosted;
    }
  });
  
  // 3. Post monthly arbitrage spreads from scratch
  postMonthlyArbitrageSpreads();
}

// Posts corresponding monthly arbitrage profit spreads to Platform Profits Account
function postMonthlyArbitrageSpreads() {
  // Find all due transactions and aggregate by month/year
  const operatorDues = {};
  const funderDues = {};
  
  state.transactions.forEach(t => {
    if (t.type === 'dividend_due') {
      const monthKey = t.date.slice(0, 7); // e.g. "2026-02"
      if (!t.profitPosted) {
        if (t.partyType === 'debtor') {
          if (!operatorDues[monthKey]) operatorDues[monthKey] = [];
          operatorDues[monthKey].push(t);
        } else {
          if (!funderDues[monthKey]) funderDues[monthKey] = [];
          funderDues[monthKey].push(t);
        }
      }
    }
  });
  
  // For each month, calculate net spreads
  Object.keys(operatorDues).forEach(monthKey => {
    // If there is also funder dues in that month, or calculate overall operator vs funder
    const ops = operatorDues[monthKey];
    const funds = funderDues[monthKey] || [];
    
    // Sum operator dues in USD
    let opUSD = 0;
    let fundUSD = 0;
    let returnCurrency = 'IQD'; // Arbitrage logged in IQD default
    
    ops.forEach(t => {
      const cnt = state.contracts.find(c => c.id === t.contractId);
      opUSD += cnt ? convertContractCurrency(t.amount, t.currency, 'USD', cnt) : convertToUSD(t.amount, t.currency);
    });
    funds.forEach(t => {
      const cnt = state.contracts.find(c => c.id === t.contractId);
      fundUSD += cnt ? convertContractCurrency(t.amount, t.currency, 'USD', cnt) : convertToUSD(t.amount, t.currency);
    });
    
    const spreadUSD = opUSD - fundUSD;
    if (spreadUSD > 0) {
      const spreadReturnCurrency = convertFromUSD(spreadUSD, returnCurrency);
      
      // Post to Profit Account
      state.transactions.push({
        id: `tx_prof_${monthKey.replace('-', '_')}_${Date.now().toString().slice(-4)}`,
        contractId: 'platform_profits',
        partyName: 'Platform Profits',
        partyType: 'platform',
        date: `${monthKey}-28`, // Post at end of month
        type: 'profit_posted',
        amount: spreadReturnCurrency,
        currency: returnCurrency,
        description: state.activeLanguage === 'ar'
          ? `فوارق أرباح الصرف العكسي المتراكمة لشهر ${monthKey}`
          : `Accrued inverse currency arbitrage spread for ${monthKey}`
      });
      
      // Mark as posted to prevent double posting
      ops.forEach(t => t.profitPosted = true);
      funds.forEach(t => t.profitPosted = true);
    }
  });
}

// Manual mock setup to load historical transaction ledger balances
function initMockTransactions() {
  if (!state.transactions) state.transactions = [];
  
  // Create deposit/withdrawal transactions for each contract if not already present
  let addedNew = false;
  state.contracts.forEach(c => {
    if (!c.startDate || isNaN(Date.parse(c.startDate))) {
      console.warn(`Skipping transaction init for contract ${c.id} due to invalid start date.`);
      return;
    }
    const hasInitTx = state.transactions.some(t => t.contractId === c.id && t.type === 'deposit');
    if (!hasInitTx) {
      const isCreditor = c.type === 'creditor';
      state.transactions.push({
        id: `tx_init_${c.id.slice(-4)}`,
        contractId: c.id,
        partyName: c.partyName,
        partyType: c.type,
        date: c.startDate,
        type: 'deposit',
        amount: c.principal,
        currency: c.principalCurrency,
        description: isCreditor 
          ? (state.activeLanguage === 'ar' ? 'إيداع رأس مال المضاربة' : 'Capital Principal Deposit')
          : (state.activeLanguage === 'ar' ? 'استلام رأس مال للتشغيل' : 'Capital Principal Withdrawal')
      });
      addedNew = true;
    }
  });
  
  // Generate dues based on history
  generateDues();
  
  // Pre-settle Month 1 (Feb) and Month 2 (Mar) to show active ledger records only for brand new setup
  const isBrandNew = state.transactions.filter(t => t.type === 'deposit').length === state.contracts.length && addedNew && state.transactions.length <= state.contracts.length;
  if (isBrandNew) {
    state.transactions.forEach(t => {
      if (t.type === 'dividend_due' && (t.date.includes('-02-') || t.date.includes('-03-'))) {
        const isFunder = t.partyType === 'creditor';
        
        state.transactions.push({
          id: `tx_settle_${t.id.slice(-6)}`,
          contractId: t.contractId,
          partyName: t.partyName,
          partyType: t.partyType,
          date: t.date,
          type: isFunder ? 'payout' : 'collect',
          period: t.period,
          amount: t.amount,
          currency: t.currency,
          description: isFunder
            ? (state.activeLanguage === 'ar' ? `تسديد أرباح شهر ${t.period} للممول` : `Dividend Payout Month ${t.period}`)
            : (state.activeLanguage === 'ar' ? `تحصيل أرباح شهر ${t.period} من المشغل` : `Collected Dividend Month ${t.period}`)
        });
      }
    });
  }
  
  saveState();
}

// Records a manual payout (to Funder) or collection (from Operator)
function postSettlePayment(txId) {
  const dueTx = state.transactions.find(t => t.id === txId);
  if (!dueTx) return;
  
  const isFunder = dueTx.partyType === 'creditor';
  
  // Insert settlement transaction
  state.transactions.push({
    id: `tx_settle_${Date.now().toString().slice(-6)}`,
    contractId: dueTx.contractId,
    partyName: dueTx.partyName,
    partyType: dueTx.partyType,
    date: new Date().toISOString().split('T')[0],
    type: isFunder ? 'payout' : 'collect',
    period: dueTx.period,
    amount: dueTx.amount,
    currency: dueTx.currency,
    description: isFunder
      ? (state.activeLanguage === 'ar' ? `صرف وتسديد أرباح شهر ${dueTx.period} للممول` : `Sulh Dividend Payout Month ${dueTx.period}`)
      : (state.activeLanguage === 'ar' ? `تحصيل واستلام أرباح شهر ${dueTx.period} من المشغل` : `Collected Sulh Dividend Month ${dueTx.period}`)
  });
  
  saveState();
  renderApp();
}

// Automatically processes capital principal refunds and marks the contract as completed
function returnContractCapital(contractId) {
  const contract = state.contracts.find(c => c.id === contractId);
  if (!contract) return;
  
  const isFunder = contract.type === 'creditor';
  const isAr = state.activeLanguage === 'ar';
  
  // Calculate capital value in Return Currency
  const returnAmount = convertContractCurrency(contract.principal, contract.principalCurrency, contract.returnCurrency, contract);
  
  // Custom alert text
  const confirmMsg = isAr
    ? `هل تريد تسجيل حركة إعادة رأس المال لهذا العقد وتصفيته بالكامل؟\n\nالطرف الثاني: ${contract.partyName}\nأصل رأس المال: ${contract.principal.toLocaleString()} ${contract.principalCurrency}\nالمبلغ المستحق السداد (بالعملة العكسية): ${returnAmount.toLocaleString(undefined, {maximumFractionDigits: 0})} ${contract.returnCurrency}\n\nتنبيه: سيتم تحويل حالة العقد إلى "مكتمل" وإثبات السداد محاسبياً في الدفاتر.`
    : `Do you want to post the capital refund and close this contract?\n\nParty: ${contract.partyName}\nPrincipal: ${contract.principal.toLocaleString()} ${contract.principalCurrency}\nEquivalent Repayment: ${returnAmount.toLocaleString(undefined, {maximumFractionDigits: 2})} ${contract.returnCurrency}\n\nNotice: This contract status will change to "Completed" and payment will be posted to ledger.`;
    
  if (confirm(confirmMsg)) {
    // 1. Change status to completed
    contract.status = 'completed';
    
    // 2. Post redemption transaction
    state.transactions.push({
      id: `tx_cap_ret_${contract.id.slice(-4)}_${Date.now().toString().slice(-4)}`,
      contractId: contract.id,
      partyName: contract.partyName,
      partyType: contract.type,
      date: new Date().toISOString().split('T')[0],
      type: isFunder ? 'payout' : 'collect',
      period: contract.duration, // Final period/limit
      amount: returnAmount,
      currency: contract.returnCurrency,
      description: isFunder
        ? (isAr ? 'إعادة وتصفية أصل رأس مال العقد - مكتمل' : 'Redemption of Contract Capital Principal - Completed')
        : (isAr ? 'استرداد وتصفية أصل رأس مال العقد - مكتمل' : 'Redemption of Contract Capital Principal - Completed')
    });
    
    saveState();
    renderApp();
  }
}

// --- STATE MANAGEMENT ---
function saveState() {
  localStorage.setItem('equity_state', JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem('equity_state');
  if (saved) {
    try {
      state = JSON.parse(saved);
      
      // Auto-migrate to the new 2026 contracts if old 2024 contracts are detected in state OR if contracts list is empty
      const hasOld2024 = state.contracts && state.contracts.some(c => c.startDate === '2024-01-01');
      if (!state.contracts || state.contracts.length === 0 || hasOld2024) {
        console.log("Empty or old 2024 contracts detected, auto-resetting to new 2026 defaults");
        state.contracts = [...defaultContracts];
        state.transactions = [];
        saveState();
      } else {
        // Smart migration for debtors: replace old default operators or populate if empty, without wiping user custom contracts
        const hasOldDebtors = state.contracts.some(c => c.partyName === 'شركة جبال الفاو للمقاولات' || c.partyName === 'المشغل التجريبي (مجموعة بابل)');
        const hasNoDebtors = !state.contracts.some(c => c.type === 'debtor');
        
        if (hasOldDebtors || hasNoDebtors) {
          console.log("Migrating default operators to Asia Cell, preserving user custom contracts...");
          // 1. Remove old default operators
          state.contracts = state.contracts.filter(c => c.partyName !== 'شركة جبال الفاو للمقاولات' && c.partyName !== 'المشغل التجريبي (مجموعة بابل)');
          
          // 2. Add the 5 Asia Cell contracts from defaultContracts if they don't exist
          defaultContracts.forEach(dc => {
            if (dc.type === 'debtor' && !state.contracts.some(c => c.partyName === dc.partyName)) {
              state.contracts.push(dc);
            }
          });
          
          // 3. Remove transactions associated with the deleted old operators
          state.transactions = state.transactions.filter(tx => tx.contractId !== 'cnt_d_001' && tx.contractId !== 'cnt_d_user');
          
          saveState();
        }
      }

      // Ensure transactions array exists
      if (!state.transactions) state.transactions = [];
      if (!state.balanceDisplayCurrency) state.balanceDisplayCurrency = 'IQD';
      state.editingContractId = null; // Reset edit state on load
      state.showContractModal = false;
      
      // Migrate and correct historical transaction dates for calendar month alignment and timezone safety
      if (state.transactions && state.contracts) {
        state.transactions.forEach(t => {
          if (t.type === 'dividend_due') {
            const c = state.contracts.find(cnt => cnt.id === t.contractId);
            if (c) {
              const start = new Date(c.startDate);
              const startYear = start.getFullYear();
              const startMonth = start.getMonth();
              const startDay = start.getDate();
              
              const targetMonth = startMonth + t.period;
              const targetYear = startYear + Math.floor(targetMonth / 12);
              const actualMonth = targetMonth % 12;
              
              const lastDayOfTargetMonth = new Date(targetYear, actualMonth + 1, 0).getDate();
              const clampedDay = Math.min(startDay, lastDayOfTargetMonth);
              const expectedDueDate = new Date(targetYear, actualMonth, clampedDay);
              
              const expectedDateStr = formatLocalDate(expectedDueDate);
              if (t.date !== expectedDateStr) {
                console.log(`Migrated transaction ${t.id} date from ${t.date} to ${expectedDateStr}`);
                t.date = expectedDateStr;
              }
            }
          }
        });
        
        // Also align payout/collect transactions of matching period/contract to the new due date
        state.transactions.forEach(t => {
          if (t.type === 'payout' || t.type === 'collect') {
            if (t.contractId && t.period) {
              const matchingDue = state.transactions.find(
                du => du.contractId === t.contractId && du.period === t.period && du.type === 'dividend_due'
              );
              if (matchingDue && t.date !== matchingDue.date) {
                t.date = matchingDue.date;
              }
            }
          }
        });
      }
    } catch (e) {
      console.error("Error loading state, initializing with defaults", e);
    }
  } else {
    state.contracts = defaultContracts;
    state.transactions = [];
    state.editingContractId = null;
    state.showContractModal = false;
    saveState();
  }

  // Ensure all operator contracts (debtors) are marked as internal operations
  if (state.contracts) {
    state.contracts.forEach(c => {
      if (c.type === 'debtor') {
        c.isInternal = true;
      }
    });
  }
  
  // Apply theme on load
  if (!state.theme) state.theme = 'dark';
  document.body.className = state.theme === 'beige' ? 'theme-beige' : '';
}

// --- APP NAVIGATION AND TRANSLATION ROUTING ---
function changeTab(tabId) {
  state.activeTab = tabId;
  state.editingContractId = null; // Clear edit mode when switching tabs
  state.showContractModal = false;
  saveState();
  renderApp();
}

function toggleLanguage(lang) {
  state.activeLanguage = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  saveState();
  renderApp();
}

// --- CORE RENDERING ENGINE ---
function renderApp() {
  const appContainer = document.getElementById('app');
  appContainer.innerHTML = '';
  
  // Create Main Layout grid
  const appLayout = document.createElement('div');
  appLayout.className = 'app-container';
  
  // Render Sidebar and Sidebar items
  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';
  sidebar.innerHTML = renderSidebarHTML();
  
  // Render Main view panel
  const mainContent = document.createElement('main');
  mainContent.className = 'main-content';
  
  // Header section
  const contentHeader = document.createElement('header');
  contentHeader.className = 'content-header';
  contentHeader.innerHTML = renderHeaderHTML();
  mainContent.appendChild(contentHeader);
  
  // Main view content wrapper
  const viewContainer = document.createElement('div');
  viewContainer.className = 'view-container';
  
  // Tab Routing
  switch (state.activeTab) {
    case 'dashboard':
      viewContainer.innerHTML = renderDashboardHTML();
      break;
    case 'creditors':
      viewContainer.innerHTML = renderContractsHTML('creditor');
      break;
    case 'debtors':
      viewContainer.innerHTML = renderContractsHTML('debtor');
      break;
    case 'calculator':
      viewContainer.innerHTML = renderCalculatorHTML();
      break;
    case 'ledgers':
      viewContainer.innerHTML = renderLedgersHTML();
      break;
    case 'analysis':
      viewContainer.innerHTML = renderAnalysisHTML();
      break;
    case 'monthly_balance':
      viewContainer.innerHTML = renderMonthlyBalanceHTML();
      break;
  }
  
  mainContent.appendChild(viewContainer);
  
  // Footer
  const footer = document.createElement('footer');
  footer.className = 'sharia-footer-info';
  footer.style.textAlign = 'center';
  footer.style.marginTop = '40px';
  footer.style.fontSize = '0.8rem';
  footer.style.color = 'var(--text-muted)';
  footer.style.borderTop = '1px solid var(--border-color)';
  footer.style.paddingTop = '15px';
  footer.innerText = translations[state.activeLanguage].shariaFooter + " | " + translations[state.activeLanguage].devBy;
  mainContent.appendChild(footer);
  
  appLayout.appendChild(sidebar);
  appLayout.appendChild(mainContent);
  
  appContainer.appendChild(appLayout);
  
  // Execute interactive setups & Chart renderers
  setupEventListeners();
  if (state.activeTab === 'dashboard') {
    renderDashboardChart();
  }
  
  // Re-generate Lucide SVG icons dynamically
  lucide.createIcons();
  
  // Update the analog Rolex clock immediately
  updateRolexClock();
}

// --- HTML GENERATORS ---

function renderSidebarHTML() {
  const t = translations[state.activeLanguage];
  const activeTab = state.activeTab;
  
  return `
    <div>
      <div class="logo-section">
        <div class="logo-icon" style="background: var(--color-gold-light); color: var(--color-gold);">
          <i data-lucide="landmark"></i>
        </div>
        <span class="logo-text">${t.appTitle}</span>
      </div>
      <ul class="nav-links">
        <li class="nav-item ${activeTab === 'dashboard' ? 'active' : ''}">
          <a class="nav-link" data-tab="dashboard">
            <i data-lucide="layout-dashboard"></i>
            <span class="nav-text">${t.dashboard}</span>
          </a>
        </li>
        <li class="nav-item ${activeTab === 'creditors' ? 'active' : ''}">
          <a class="nav-link" data-tab="creditors">
            <i data-lucide="arrow-down-left"></i>
            <span class="nav-text">${t.creditors}</span>
          </a>
        </li>
        <li class="nav-item ${activeTab === 'debtors' ? 'active' : ''}">
          <a class="nav-link" data-tab="debtors">
            <i data-lucide="arrow-up-right"></i>
            <span class="nav-text">${t.debtors}</span>
          </a>
        </li>
        <li class="nav-item ${activeTab === 'ledgers' ? 'active' : ''}">
          <a class="nav-link" data-tab="ledgers">
            <i data-lucide="book-open"></i>
            <span class="nav-text">${t.ledgers}</span>
          </a>
        </li>
        <li class="nav-item ${activeTab === 'analysis' ? 'active' : ''}">
          <a class="nav-link" data-tab="analysis">
            <i data-lucide="trending-up"></i>
            <span class="nav-text">${t.analysis}</span>
          </a>
        </li>
        <li class="nav-item ${activeTab === 'monthly_balance' ? 'active' : ''}">
          <a class="nav-link" data-tab="monthly_balance">
            <i data-lucide="bar-chart-3"></i>
            <span class="nav-text">${t.monthly_balance}</span>
          </a>
        </li>
        <li class="nav-item ${activeTab === 'calculator' ? 'active' : ''}">
          <a class="nav-link" data-tab="calculator">
            <i data-lucide="calculator"></i>
            <span class="nav-text">${t.calculator}</span>
          </a>
        </li>
      </ul>
    </div>
    
    <div class="sidebar-footer">
      <!-- Backup Actions -->
      <div class="backup-actions" style="display: flex; gap: 8px; margin-top: 15px; width: 100%;">
        <button class="btn btn-secondary" id="btn-export-db" style="flex: 1; padding: 10px; font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px;" title="${t.exportDataTooltip}">
          <i data-lucide="download"></i>
          <span>${t.exportData}</span>
        </button>
        <button class="btn btn-secondary" id="btn-import-db" style="flex: 1; padding: 10px; font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px;" title="${t.importDataTooltip}">
          <i data-lucide="upload"></i>
          <span>${t.importData}</span>
        </button>
      </div>
      <input type="file" id="import-db-file" accept=".json" style="display: none;">

      <button class="btn btn-danger btn-reset-db" id="btn-reset-db-sidebar" style="width: 100%; margin-top: 10px; padding: 10px; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 8px;">
        <i data-lucide="refresh-cw"></i>
        <span>${t.resetData}</span>
      </button>
    </div>
  `;
}

function getUnpaidOperatorDues() {
  return state.transactions.filter(tx => {
    if (tx.type !== 'dividend_due' || tx.partyType !== 'debtor') return false;
    // Check if there is a matching collection transaction for this contract & period
    const isSettled = state.transactions.some(
      settled => settled.contractId === tx.contractId && 
                 settled.period === tx.period && 
                 settled.type === 'collect'
    );
    return !isSettled;
  });
}

function renderHeaderHTML() {
  const t = translations[state.activeLanguage];
  let titleStr = '';
  let subStr = '';
  
  switch (state.activeTab) {
    case 'dashboard':
      titleStr = t.dashboard;
      subStr = t.appSubTitle;
      break;
    case 'creditors':
      titleStr = t.funderContracts;
      subStr = "إدارة رؤوس أموال الممولين المستلمة لغرض التشغيل";
      break;
    case 'debtors':
      titleStr = t.operatorContracts;
      subStr = "إدارة وتتبع رؤوس أموال الممنوحة للمشغلين الخارجيين";
      break;
    case 'calculator':
      titleStr = t.simTitle;
      subStr = t.simSubtitle;
      break;
    case 'ledgers':
      titleStr = t.ledgerTitle;
      subStr = t.ledgerSubtitle;
      break;
    case 'analysis':
      titleStr = t.analysis;
      subStr = state.activeLanguage === 'ar' 
        ? "مؤشرات وتوصيات تصفية العقود وموازنة محفظة العملات" 
        : "Exposure balancing, liquidation recommendations & financial insights";
      break;
    case 'monthly_balance':
      titleStr = t.monthly_balance;
      subStr = state.activeLanguage === 'ar' 
        ? "ميزان الأرباح والخسائر للتدفقات الشهرية بالدينار العراقي (IQD)" 
        : "Monthly balance sheet & profits in Iraqi Dinar (IQD)";
      break;
  }
  
  const unpaidDues = getUnpaidOperatorDues();
  const badgeHtml = unpaidDues.length > 0 ? `<span class="bell-badge">${unpaidDues.length}</span>` : '';
  
  let dropdownItemsHtml = '';
  if (unpaidDues.length === 0) {
    dropdownItemsHtml = `
      <div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
        ${state.activeLanguage === 'ar' ? 'لا توجد دفعات مستحقة معلقة' : 'No pending payments'}
      </div>
    `;
  } else {
    dropdownItemsHtml = unpaidDues.map(due => {
      return `
        <div class="notif-item">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
            <div style="flex: 1;">
              <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-primary); text-align: start;">${due.partyName}</div>
              <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px; text-align: start;">
                ${state.activeLanguage === 'ar' 
                  ? `الشهر ${due.period} | استحقاق: ${due.date}` 
                  : `Month ${due.period} | Due: ${due.date}`}
              </div>
            </div>
            <div style="text-align: end; min-width: 90px;">
              <div style="color: var(--color-danger); font-family: var(--font-english); font-weight: 800; font-size: 0.85rem;">
                ${due.amount.toLocaleString()} ${due.currency}
              </div>
            </div>
          </div>
          <button class="btn btn-primary btn-collect-notif" data-id="${due.id}" style="padding: 4px 8px; font-size: 0.75rem; border-radius: var(--radius-sm); width: 100%; margin-top: 4px; display: flex; align-items: center; justify-content: center; gap: 4px;">
            <i data-lucide="check" style="width: 12px; height: 12px;"></i>
            <span>${state.activeLanguage === 'ar' ? 'تحصيل الآن' : 'Collect Now'}</span>
          </button>
        </div>
      `;
    }).join('');
  }

  return `
    <div class="page-title">
      <h1>${titleStr}</h1>
      <p>${subStr}</p>
    </div>
    <div class="header-actions" style="display: flex; align-items: center; gap: 12px;">
      <!-- Rolex Datejust 16233 Gold Fluted Bezel Analog Clock -->
      <div class="rolex-clock" style="position: relative; width: 54px; height: 54px; border-radius: 50%; background: conic-gradient(from 0deg, #f2d479 0%, #bca052 4%, #d4af37 8%, #f2d479 12%, #bca052 16%, #d4af37 20%, #f2d479 24%, #bca052 28%, #d4af37 32%, #f2d479 36%, #bca052 40%, #d4af37 44%, #f2d479 48%, #bca052 52%, #d4af37 56%, #f2d479 60%, #bca052 64%, #d4af37 68%, #f2d479 72%, #bca052 76%, #d4af37 80%, #f2d479 84%, #bca052 88%, #d4af37 92%, #f2d479 96%, #bca052 100%); box-shadow: 0 3px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-inline-end: 8px;">
        <!-- Dial Background (Emerald Green sunburst effect representing wealth and investment growth) -->
        <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: radial-gradient(circle, #059669 0%, #064e3b 100%); box-shadow: inset 0 1px 3px rgba(0,0,0,0.45); border: 0.5px solid rgba(212, 175, 55, 0.35);"></div>
        
        <!-- Rolex Crown Logo at 12 o'clock in Gold -->
        <svg viewBox="0 0 24 24" style="position: absolute; top: 7.5px; width: 6.5px; height: 6.5px; fill: #d4af37; z-index: 10;">
          <path d="M2 18h20v2H2zM3 17l2.5-9 3.5 5.5 3-10 3 10 3.5-5.5 2.5 9z"/>
        </svg>
        
        <!-- Cyclops magnifying glass Date window at 3 o'clock -->
        <div style="position: absolute; right: 5.5px; top: calc(50% - 5px); width: 9px; height: 10px; background: #fff; border: 0.8px solid #d4af37; border-radius: 1px; display: flex; align-items: center; justify-content: center; z-index: 8; box-shadow: 0 0.5px 1.5px rgba(0,0,0,0.3);">
          <span id="rolex-date-val" style="font-family: var(--font-english); font-size: 6px; font-weight: 900; color: #000; line-height: 1;">28</span>
        </div>
        <!-- Cyclops Lens Overlay (magnifying glass reflection) -->
        <div style="position: absolute; right: 4px; top: calc(50% - 6.5px); width: 12px; height: 13px; border-radius: 2px; background: rgba(255,255,255,0.4); backdrop-filter: blur(0.2px); border: 0.5px solid rgba(255,255,255,0.6); z-index: 9; pointer-events: none; box-shadow: inset 0 0.5px 1px rgba(255,255,255,0.8);"></div>
        
        <!-- Luxury Hour Indices (Gold Batons) -->
        <div style="position: absolute; width: 44px; height: 44px; z-index: 5; pointer-events: none;">
          <div style="position: absolute; top: 1px; left: calc(50% - 1px); width: 2px; height: 5px; background: #d4af37; transform-origin: 1px 21px; transform: rotate(30deg); border-radius: 0.5px;"></div>
          <div style="position: absolute; top: 1px; left: calc(50% - 1px); width: 2px; height: 5px; background: #d4af37; transform-origin: 1px 21px; transform: rotate(60deg); border-radius: 0.5px;"></div>
          <div style="position: absolute; top: 1px; left: calc(50% - 1px); width: 2px; height: 5px; background: #d4af37; transform-origin: 1px 21px; transform: rotate(120deg); border-radius: 0.5px;"></div>
          <div style="position: absolute; top: 1px; left: calc(50% - 1px); width: 2px; height: 5px; background: #d4af37; transform-origin: 1px 21px; transform: rotate(150deg); border-radius: 0.5px;"></div>
          <div style="position: absolute; top: 1px; left: calc(50% - 1px); width: 2px; height: 5px; background: #d4af37; transform-origin: 1px 21px; transform: rotate(180deg); border-radius: 0.5px;"></div>
          <div style="position: absolute; top: 1px; left: calc(50% - 1px); width: 2px; height: 5px; background: #d4af37; transform-origin: 1px 21px; transform: rotate(210deg); border-radius: 0.5px;"></div>
          <div style="position: absolute; top: 1px; left: calc(50% - 1px); width: 2px; height: 5px; background: #d4af37; transform-origin: 1px 21px; transform: rotate(240deg); border-radius: 0.5px;"></div>
          <div style="position: absolute; top: 1px; left: calc(50% - 1px); width: 2px; height: 5px; background: #d4af37; transform-origin: 1px 21px; transform: rotate(270deg); border-radius: 0.5px;"></div>
          <div style="position: absolute; top: 1px; left: calc(50% - 1px); width: 2px; height: 5px; background: #d4af37; transform-origin: 1px 21px; transform: rotate(300deg); border-radius: 0.5px;"></div>
          <div style="position: absolute; top: 1px; left: calc(50% - 1px); width: 2px; height: 5px; background: #d4af37; transform-origin: 1px 21px; transform: rotate(330deg); border-radius: 0.5px;"></div>
        </div>

        <!-- Gold Rolex Hands -->
        <div id="rolex-hour-hand" style="position: absolute; width: 2px; height: 12px; background: #d4af37; top: 15px; left: 26px; transform-origin: bottom center; transform: rotate(0deg); border-radius: 1px; z-index: 11; box-shadow: 0 0.5px 1.5px rgba(0,0,0,0.3);"></div>
        <div id="rolex-minute-hand" style="position: absolute; width: 1.5px; height: 17px; background: #d4af37; top: 10px; left: 26.25px; transform-origin: bottom center; transform: rotate(0deg); border-radius: 1px; z-index: 12; box-shadow: 0 0.5px 1.5px rgba(0,0,0,0.3);"></div>
        <div id="rolex-second-hand" style="position: absolute; width: 0.8px; height: 19px; background: #d4af37; top: 8px; left: 26.6px; transform-origin: bottom center; transform: rotate(0deg); z-index: 13; border-radius: 0.5px;"></div>
        
        <!-- Center gold pin -->
        <div style="position: absolute; width: 4.5px; height: 4.5px; border-radius: 50%; background: #d4af37; border: 0.5px solid #fff; z-index: 14; box-shadow: 0 0.5px 1.5px rgba(0,0,0,0.4);"></div>
      </div>

      <!-- Compact Language Toggles -->
      <div class="lang-switch" style="display: flex; background: rgba(0, 0, 0, 0.15); border: 1px solid var(--border-color); padding: 2px; border-radius: var(--radius-sm); gap: 2px; height: 28px; align-items: center;">
        <button class="lang-btn ${state.activeLanguage === 'ar' ? 'active' : ''}" data-lang="ar" style="padding: 2px 6px; font-size: 0.72rem; font-weight: 700; border: none; background: ${state.activeLanguage === 'ar' ? 'var(--color-gold)' : 'transparent'}; color: ${state.activeLanguage === 'ar' ? 'var(--bg-primary)' : 'var(--text-secondary)'}; cursor: pointer; transition: all 0.2s; border-radius: 4px; line-height: 1.2;">
          ar
        </button>
        <button class="lang-btn ${state.activeLanguage === 'en' ? 'active' : ''}" data-lang="en" style="padding: 2px 6px; font-size: 0.72rem; font-weight: 700; border: none; background: ${state.activeLanguage === 'en' ? 'var(--color-gold)' : 'transparent'}; color: ${state.activeLanguage === 'en' ? 'var(--bg-primary)' : 'var(--text-secondary)'}; cursor: pointer; transition: all 0.2s; border-radius: 4px; line-height: 1.2;">
          en
        </button>
      </div>

      <!-- Shrunk Theme Toggle Switch -->
      <button class="theme-btn" data-theme="${state.theme === 'dark' ? 'beige' : 'dark'}" style="width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: rgba(0,0,0,0.15); color: var(--text-secondary); cursor: pointer; transition: all 0.2s; padding: 0;" title="${state.activeLanguage === 'ar' ? 'تبديل المظهر' : 'Toggle Theme'}">
        <i data-lucide="${state.theme === 'beige' ? 'moon' : 'sun'}" style="width: 14px; height: 14px; color: var(--color-gold);"></i>
      </button>

      <!-- Notification Bell -->
      <div class="bell-container">
        <button class="bell-btn" id="notification-bell-btn" title="${state.activeLanguage === 'ar' ? 'التنبيهات' : 'Notifications'}">
          <i data-lucide="bell" style="width: 20px; height: 20px;"></i>
          ${badgeHtml}
        </button>
        <div class="notification-dropdown" id="notification-dropdown-menu">
          <div class="notif-header">
            ${state.activeLanguage === 'ar' ? 'تنبيهات مستحقات المشغلين' : 'Operator Dues Alerts'}
          </div>
          <div class="notif-body">
            ${dropdownItemsHtml}
          </div>
          <div class="notif-footer">
            ${state.activeLanguage === 'ar' ? 'إجمالي الدفعات المستحقة' : 'Total Outstanding Payments'}: ${unpaidDues.length}
          </div>
        </div>
      </div>
      
      <!-- Date Indicator -->
      <div style="font-family: var(--font-english); font-size: 0.85rem; color: var(--text-secondary); background: rgba(0,0,0,0.05); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); display: flex; align-items: center; gap: 8px; height: 32px;">
        <i data-lucide="calendar" style="width: 14px; height: 14px; color: var(--color-gold);"></i>
        <span id="current-time-indicator">${new Date().toLocaleDateString(state.activeLanguage === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US')}</span>
      </div>
    </div>
  `;
}

function renderDashboardHTML() {
  const t = translations[state.activeLanguage];
  
  // Calculate Totals in USD
  let totalCreditorUSD = 0;
  let totalInternalCreditorUSD = 0;
  let totalExternalCreditorUSD = 0;
  let totalDebtorUSD = 0;
  let expectedInflowUSD = 0; // Debtor dividend yield
  let expectedOutflowUSD = 0; // Creditor dividend payout
  
  state.contracts.forEach(cnt => {
    if (cnt.status === 'completed') return;
    
    const principalUSD = convertToUSD(cnt.principal, cnt.principalCurrency);
    const annualReturnUSD = calculateAnnualReturnUSD(cnt);
    
    if (cnt.type === 'creditor') {
      totalCreditorUSD += principalUSD;
      expectedOutflowUSD += annualReturnUSD;
      if (cnt.isInternal) {
        totalInternalCreditorUSD += principalUSD;
      } else {
        totalExternalCreditorUSD += principalUSD;
      }
    } else {
      totalDebtorUSD += principalUSD;
      expectedInflowUSD += annualReturnUSD;
    }
  });
  
  const netArbitrageUSD = expectedInflowUSD - expectedOutflowUSD;
  const arbitragePercent = totalCreditorUSD > 0 ? (netArbitrageUSD / totalCreditorUSD) * 100 : 0;

  return `
    <!-- Top Stats Cards -->
    <div class="dashboard-grid">
      <div class="premium-card stat-card success">
        <div class="stat-header">
          <span class="stat-title">${t.totalCreditorCap}</span>
          <div class="stat-icon">
            <i data-lucide="trending-up"></i>
          </div>
        </div>
        <div class="stat-body">
          <div class="stat-value">
            $${totalCreditorUSD.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            <span class="stat-unit">${formatCurrencyName('USD')}</span>
          </div>
          <div class="stat-footer" style="flex-direction: column; align-items: flex-start; gap: 4px;">
            <div style="display: flex; align-items: center; gap: 6px; width: 100%;">
              <i data-lucide="check-circle-2" style="width: 12px; height: 12px; color: var(--color-success)"></i>
              <span class="trend-up">${state.contracts.filter(c => c.type === 'creditor' && c.status !== 'completed').length} ${t.activeContracts}</span>
            </div>
            <div style="font-size: 0.72rem; color: var(--text-secondary); width: 100%; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 4px; display: flex; justify-content: space-between;">
              <span>${state.activeLanguage === 'ar' ? 'تشغيل داخلي' : 'Internal Ops'}: $${totalInternalCreditorUSD.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
              <span>${state.activeLanguage === 'ar' ? 'خارجي' : 'External'}: $${totalExternalCreditorUSD.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="premium-card stat-card danger">
        <div class="stat-header">
          <span class="stat-title">${t.totalDebtorCap}</span>
          <div class="stat-icon">
            <i data-lucide="trending-down"></i>
          </div>
        </div>
        <div class="stat-body">
          <div class="stat-value">
            $${totalDebtorUSD.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            <span class="stat-unit">${formatCurrencyName('USD')}</span>
          </div>
          <div class="stat-footer" style="flex-direction: column; align-items: flex-start; gap: 4px;">
            <div style="display: flex; align-items: center; gap: 6px; width: 100%;">
              <i data-lucide="check-circle-2" style="width: 12px; height: 12px; color: var(--color-danger)"></i>
              <span class="trend-down">${state.contracts.filter(c => c.type === 'debtor' && c.status !== 'completed').length} ${t.activeContracts}</span>
            </div>
            <div style="font-size: 0.72rem; color: var(--text-secondary); width: 100%; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 4px; display: flex; justify-content: space-between;">
              <span>${state.activeLanguage === 'ar' ? 'تشغيل داخلي بالكامل' : '100% Internal Operations'}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="premium-card stat-card gold">
        <div class="stat-header">
          <span class="stat-title">${t.expectedArbitrage}</span>
          <div class="stat-icon">
            <i data-lucide="coins"></i>
          </div>
        </div>
        <div class="stat-body">
          <div class="stat-value">
            $${netArbitrageUSD.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            <span class="stat-unit">${formatCurrencyName('USD')} / yr</span>
          </div>
          <div class="stat-footer">
            <i data-lucide="percent" style="width: 12px; height: 12px; color: var(--color-gold)"></i>
            <span class="trend-up" style="color: var(--color-gold)">+${arbitragePercent.toFixed(2)}% Yield</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Chart and Rates Row -->
    <div class="dashboard-details-grid">
      <div class="premium-card" style="height: 380px; display: flex; flex-direction: column;">
        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
          <i data-lucide="bar-chart-3" style="color: var(--color-gold);"></i>
          ${t.chartTitle}
        </h3>
        <div style="flex: 1; position: relative;">
          <canvas id="arbitrageChart"></canvas>
        </div>
      </div>
      
      <div class="premium-card" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <h3 style="font-size: 1.1rem; font-weight: 700; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="globe-2" style="color: var(--color-gold);"></i>
            ${t.ratesTitle}
          </h3>
          <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 5px; margin-bottom: 15px;">
            ${t.ratesSubtitle}
          </p>
          <div class="rate-list">
            ${Object.keys(state.exchangeRates).map(curr => {
              if (curr === 'USD') return '';
              return `
                <div class="rate-item">
                  <span class="rate-name">1 ${formatCurrencyName('USD')} =</span>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <input type="number" step="0.01" class="rate-input" data-curr="${curr}" value="${state.exchangeRates[curr]}">
                    <span style="font-weight: 700; font-size: 0.85rem;">${formatCurrencyName(curr)}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        <div style="border-top: 1px solid var(--border-color); padding-top: 15px; margin-top: 15px; font-size: 0.8rem; color: var(--text-muted);">
          <i data-lucide="info" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle; margin-inline-end: 4px;"></i>
          تغيير أسعار الصرف يؤثر لحظياً على تقييم العقود وتوزيع أرباح المصالحة.
        </div>
      </div>
    </div>
    
    <!-- Donut Charts Row -->
    <div class="dashboard-charts-grid">
      <div class="premium-card" style="height: 380px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 15px; width: 100%; display: flex; align-items: center; gap: 8px;">
          <i data-lucide="pie-chart" style="color: var(--color-gold);"></i>
          ${state.activeLanguage === 'ar' ? 'توزيع رأس المال الاستثماري النشط' : 'Active Investment Capital Distribution'}
        </h3>
        <div style="flex: 1; position: relative; width: 100%; max-height: 280px; display: flex; justify-content: center; align-items: center;">
          <canvas id="capitalDonutChart"></canvas>
        </div>
      </div>
      <div class="premium-card" style="height: 380px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 15px; width: 100%; display: flex; align-items: center; gap: 8px;">
          <i data-lucide="donut" style="color: var(--color-gold);"></i>
          ${state.activeLanguage === 'ar' ? 'توزيع المستحقات القائمة حسب الشريك' : 'Outstanding Balances by Partner'}
        </h3>
        <div style="flex: 1; position: relative; width: 100%; max-height: 280px; display: flex; justify-content: center; align-items: center;">
          <canvas id="balanceDonutChart"></canvas>
        </div>
      </div>
    </div>
    
    <!-- Recent Timeline Summary -->
    <div class="premium-card">
      <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
        <i data-lucide="calendar" style="color: var(--color-gold);"></i>
        ${t.timelineTitle} (3 Months Out)
      </h3>
      <div class="timeline" id="dashboard-timeline">
        ${renderUnifiedTimelineHTML(3)}
      </div>
    </div>
  `;
}

function renderContractsHTML(contractType) {
  const t = translations[state.activeLanguage];
  const list = state.contracts.filter(c => c.type === contractType);
  const isCreditor = contractType === 'creditor';
  const editingContract = state.editingContractId ? state.contracts.find(c => c.id === state.editingContractId) : null;
  const isEditing = editingContract !== null;
  
  const isModalOpen = state.showContractModal || isEditing;
  const modalHTML = isModalOpen ? `
    <div class="modal-backdrop" id="contract-form-modal">
      <div class="print-contract-modal" style="width: 95%; max-width: 600px; padding: 25px; max-height: 90vh; overflow: hidden; display: flex; flex-direction: column;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 15px; flex-shrink: 0;">
          <h3 style="font-size: 1.1rem; font-weight: 700; display: flex; align-items: center; gap: 8px; margin: 0; color: var(--color-gold);">
            <i data-lucide="${isEditing ? 'pencil' : 'plus-circle'}"></i>
            ${isEditing ? (state.activeLanguage === 'ar' ? `تعديل العقد: ${editingContract.partyName}` : `Edit Contract: ${editingContract.partyName}`) : (state.activeLanguage === 'ar' ? 'إبرام عقد مضاربة جديد' : 'New Speculation Contract')}
          </h3>
          <button class="btn btn-secondary" id="btn-close-contract-modal" style="padding: 6px 12px; font-size: 0.8rem; border-radius: var(--radius-sm);">
            ${state.activeLanguage === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
        
        <form id="contract-form" data-type="${contractType}" style="overflow-y: auto; flex: 1; padding-inline-end: 8px;">
          <div style="display: flex; flex-direction: column; gap: 15px; padding-bottom: 10px;">
            <!-- Funder/Operator Name -->
            <div class="form-group">
              <label for="form-party-name">${isCreditor ? t.funderName : t.operatorName}</label>
              <input type="text" id="form-party-name" class="form-control" placeholder="${isCreditor ? 'مثال: شركة النخبة المالية' : 'مثال: مجموعة بابل للتجارة'}" value="${isEditing ? editingContract.partyName : ''}" required>
            </div>
            
            <!-- Internal Operations Toggle (Creditors only) -->
            ${isCreditor ? `
            <div class="form-group" style="display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(174, 124, 80, 0.05); border: 1px solid var(--border-color); border-radius: var(--radius-sm); margin-bottom: 5px;">
              <input type="checkbox" id="form-is-internal" style="width: 18px; height: 18px; cursor: pointer; accent-color: var(--color-gold);" ${isEditing && editingContract.isInternal ? 'checked' : ''}>
              <label for="form-is-internal" style="margin: 0; font-weight: bold; cursor: pointer; color: var(--color-gold); font-size: 0.9rem;">
                تشغيل داخلي بواسطة الشركة (Internal Operations)
              </label>
            </div>
            ` : ''}
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <!-- Principal amount -->
              <div class="form-group">
                <label for="form-principal">${t.principal}</label>
                <input type="number" id="form-principal" class="form-control" placeholder="10,000" min="1" value="${isEditing ? editingContract.principal : ''}" required style="font-family: var(--font-english);">
                <div class="number-preview-box" id="form-principal-preview" style="display: none;"></div>
              </div>
              
              <!-- Principal Currency -->
              <div class="form-group">
                <label for="form-principal-curr">${t.principalCurrency}</label>
                <select id="form-principal-curr" class="form-control" style="font-family: var(--font-english);">
                  <option value="USD" ${isEditing && editingContract.principalCurrency === 'USD' ? 'selected' : (!isEditing ? 'selected' : '')}>🇺🇸 USD</option>
                  <option value="EUR" ${isEditing && editingContract.principalCurrency === 'EUR' ? 'selected' : ''}>🇪🇺 EUR</option>
                  <option value="IQD" ${isEditing && editingContract.principalCurrency === 'IQD' ? 'selected' : ''}>🇮🇶 IQD</option>
                  <option value="AED" ${isEditing && editingContract.principalCurrency === 'AED' ? 'selected' : ''}>🇦🇪 AED</option>
                </select>
              </div>
            </div>
            
            <!-- Return Currency -->
            <div class="form-group">
              <label for="form-return-curr">${t.returnCurrency}</label>
              <select id="form-return-curr" class="form-control" style="font-family: var(--font-english); font-weight: bold; border-color: rgba(212, 175, 55, 0.4);">
                <option value="IQD" ${isEditing && editingContract.returnCurrency === 'IQD' ? 'selected' : (!isEditing ? 'selected' : '')}>🇮🇶 IQD</option>
                <option value="USD" ${isEditing && editingContract.returnCurrency === 'USD' ? 'selected' : ''}>🇺🇸 USD</option>
                <option value="EUR" ${isEditing && editingContract.returnCurrency === 'EUR' ? 'selected' : ''}>🇪🇺 EUR</option>
                <option value="AED" ${isEditing && editingContract.returnCurrency === 'AED' ? 'selected' : ''}>🇦🇪 AED</option>
              </select>
            </div>

            <!-- Custom Exchange Rate for this contract -->
            <div class="form-group" id="form-exch-rate-group">
              <label for="form-custom-exch-rate">سعر الصرف المعتمد للعقد (1 USD = ?)</label>
              <input type="number" step="0.01" id="form-custom-exch-rate" class="form-control" value="${isEditing ? editingContract.customExchangeRate : state.exchangeRates['IQD']}" style="font-family: var(--font-english);" required>
            </div>

            <!-- Pricing type: Percentage Rate or Fixed Amount -->
            <div class="form-group">
              <label for="form-dividend-type">${t.dividendTypeLabel}</label>
              <select id="form-dividend-type" class="form-control">
                <option value="rate" ${isEditing && editingContract.dividendType === 'rate' ? 'selected' : (!isEditing ? 'selected' : '')}>${t.divTypeRate}</option>
                <option value="fixed" ${isEditing && editingContract.dividendType === 'fixed' ? 'selected' : ''}>${t.divTypeFixed}</option>
              </select>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr; gap: 12px;">
              <!-- Rate Container -->
              <div class="form-group" id="form-rate-group" style="${isEditing && editingContract.dividendType === 'fixed' ? 'display: none;' : ''}">
                <label for="form-rate">${t.dividendRate}</label>
                <input type="number" id="form-rate" step="0.1" class="form-control" placeholder="8.5" value="${isEditing ? editingContract.dividendRate : ''}" style="font-family: var(--font-english);">
              </div>
              
              <!-- Fixed Amount Container -->
              <div class="form-group" id="form-fixed-amount-group" style="${isEditing && editingContract.dividendType === 'fixed' ? 'display: block;' : 'display: none;'}">
                <label for="form-fixed-amount">${t.monthlyAmountLabel}</label>
                <input type="number" id="form-fixed-amount" class="form-control" placeholder="300000" value="${isEditing ? editingContract.monthlyDividendAmount : ''}" style="font-family: var(--font-english);">
                <div class="number-preview-box" id="form-fixed-amount-preview" style="display: none;"></div>
              </div>
            </div>
            
            <!-- Sharia Engine validation notice placeholder -->
            <div id="sharia-error-placeholder" style="display: none;"></div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <!-- Duration -->
              <div class="form-group">
                <label for="form-duration">${t.duration}</label>
                <input type="number" id="form-duration" class="form-control" placeholder="12" min="1" value="${isEditing ? editingContract.duration : ''}" required style="font-family: var(--font-english);">
              </div>
              
              <!-- Start Date -->
              <div class="form-group">
                <label for="form-start-date">${t.startDate}</label>
                <input type="date" id="form-start-date" class="form-control" value="${isEditing ? editingContract.startDate : new Date().toISOString().split('T')[0]}" required style="font-family: var(--font-english);">
              </div>
            </div>

            <!-- Notes Field -->
            <div class="form-group">
              <label for="form-notes">${state.activeLanguage === 'ar' ? 'ملاحظات العقد' : 'Contract Notes'}</label>
              <textarea id="form-notes" class="form-control" placeholder="${state.activeLanguage === 'ar' ? 'اكتب ملاحظات إضافية حول هذا العقد هنا...' : 'Write any additional notes about this contract here...'}" rows="3">${isEditing ? (editingContract.notes || '') : ''}</textarea>
            </div>
            
            ${isEditing ? `
              <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button type="submit" class="btn btn-primary" style="flex: 1;">
                  <i data-lucide="check-square"></i>
                  <span>${state.activeLanguage === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}</span>
                </button>
                <button type="button" class="btn btn-secondary" id="btn-cancel-edit" style="flex: 1;">
                  <i data-lucide="x-circle"></i>
                  <span>${state.activeLanguage === 'ar' ? 'إلغاء التعديل' : 'Cancel'}</span>
                </button>
              </div>
            ` : `
              <button type="submit" class="btn btn-primary" style="margin-top: 10px; width: 100%;">
                <i data-lucide="check-square"></i>
                <span>${t.saveContractBtn}</span>
              </button>
            `}
          </div>
        </form>
      </div>
    </div>
  ` : '';

  return `
    <div style="width: 100%;">
      <!-- Table List Column -->
      <div class="premium-card" style="width: 100%; box-sizing: border-box;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
          <h3 style="font-size: 1.2rem; font-weight: 700; margin: 0; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="file-text" style="color: var(--color-gold)"></i>
            ${isCreditor ? t.funderContracts : t.operatorContracts}
          </h3>
          <div style="display: flex; gap: 10px; align-items: center;">
            <div class="export-dropdown no-print">
              <button class="btn btn-secondary btn-export-toggle" style="padding: 8px 16px; font-size: 0.85rem; display: flex; align-items: center; gap: 6px;">
                <i data-lucide="download" style="width: 16px; height: 16px; color: var(--color-gold);"></i>
                <span>${state.activeLanguage === 'ar' ? 'تصدير البيانات' : 'Export Data'}</span>
                <i data-lucide="chevron-down" style="width: 12px; height: 12px; opacity: 0.7;"></i>
              </button>
              <div class="export-dropdown-menu">
                <button class="export-menu-item btn-export-contracts-pdf" data-contract-type="${contractType}">
                  <i data-lucide="printer" style="width: 14px; height: 14px; color: var(--color-gold);"></i>
                  <span>${state.activeLanguage === 'ar' ? 'تحميل PDF' : 'Download PDF'}</span>
                </button>
                <button class="export-menu-item btn-export-contracts-sheets" data-contract-type="${contractType}">
                  <i data-lucide="file-spreadsheet" style="width: 14px; height: 14px; color: var(--color-success);"></i>
                  <span>${state.activeLanguage === 'ar' ? 'تصدير Sheets' : 'Export Sheets'}</span>
                </button>
              </div>
            </div>
            
            <button class="btn btn-primary" id="btn-new-contract" style="padding: 8px 16px; font-size: 0.85rem; display: flex; align-items: center; gap: 6px;">
              <i data-lucide="plus-circle" style="width: 16px; height: 16px;"></i>
              <span>${state.activeLanguage === 'ar' ? 'إبرام عقد جديد' : 'Conclude New Contract'}</span>
            </button>
          </div>
        </div>
        
        ${list.length > 0 ? `
        <div class="search-wrapper">
          <div class="search-input-icon">
            <i data-lucide="search" style="width: 16px; height: 16px;"></i>
          </div>
          <input type="text" class="search-control" id="search-contracts" placeholder="${state.activeLanguage === 'ar' ? 'بحث باسم الطرف الثاني...' : 'Search by party name...'}">
        </div>
        ` : ''}
        
        <div class="table-container">
          ${list.length === 0 ? `
            <div style="text-align: center; padding: 40px; color: var(--text-muted);">
              <i data-lucide="folder-open" style="width: 48px; height: 48px; margin-bottom: 10px; opacity: 0.5;"></i>
              <p>${t.noContracts}</p>
            </div>
          ` : `
            <table class="premium-table">
              <thead>
                <tr>
                  <th>${t.name}</th>
                  <th>${t.principal}</th>
                  <th>عملة العائد</th>
                  <th>طريقة الأرباح</th>
                  <th>معدل الأرباح</th>
                  <th>المدة</th>
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                ${list.map(c => {
                  const monthlyDiv = calculateMonthlyReturn(c);
                  const isFixed = c.dividendType === 'fixed';
                  const isCompleted = c.status === 'completed';
                  return `
                    <tr style="${isCompleted ? 'opacity: 0.65;' : ''}">
                      <td style="font-weight: 700; color: var(--text-primary);">${c.partyName}</td>
                      <td>
                        <span style="font-family: var(--font-english); font-weight: bold;">
                          ${c.principal.toLocaleString()}
                        </span>
                        <span style="font-size: 0.8rem; color: var(--text-secondary); margin-inline-start: 4px;">
                          ${formatCurrencyName(c.principalCurrency)}
                        </span>
                      </td>
                      <td>
                        <span style="font-weight: 800; color: var(--color-gold); font-family: var(--font-english);">
                          ${formatCurrencyName(c.returnCurrency)}
                        </span>
                      </td>
                      <td>
                        <span style="font-size: 0.8rem; color: var(--text-secondary);">
                          ${isFixed ? t.divTypeFixed : t.divTypeRate}
                        </span>
                      </td>
                      <td>
                        <span style="font-family: var(--font-english); font-weight: 700; color: ${isFixed ? 'var(--color-gold)' : 'var(--text-primary)'}">
                          ${isFixed ? monthlyDiv.toLocaleString() + ' ' + formatCurrencyName(c.returnCurrency) + (state.activeLanguage === 'ar' ? ' /شهر' : ' /mo') : '%' + c.dividendRate}
                        </span>
                      </td>
                      <td>
                        <span style="font-family: var(--font-english);">${c.duration}</span>
                      </td>
                      <td>
                        <span class="badge ${isCompleted ? 'badge-success' : 'badge-gold'}" style="font-size: 0.7rem; padding: 2px 8px;">
                          <i data-lucide="${isCompleted ? 'check-circle' : 'activity'}" style="width: 10px; height: 10px; vertical-align: middle;"></i>
                          <span style="margin-inline-start: 4px; vertical-align: middle;">
                            ${isCompleted ? (state.activeLanguage === 'ar' ? 'مكتمل' : 'Completed') : (state.activeLanguage === 'ar' ? 'نشط' : 'Active')}
                          </span>
                        </span>
                      </td>
                      <td>
                        <button class="btn btn-secondary btn-print-contract" data-id="${c.id}" style="padding: 6px 12px; font-size: 0.75rem; border-radius: var(--radius-sm); margin-inline-end: 5px;" title="${state.activeLanguage === 'ar' ? 'طباعة العقد' : 'Print Contract'}">
                          <i data-lucide="printer" style="width: 12px; height: 12px; color: var(--color-gold);"></i>
                        </button>
                        <button class="btn btn-secondary btn-edit-contract" data-id="${c.id}" style="padding: 6px 12px; font-size: 0.75rem; border-radius: var(--radius-sm); margin-inline-end: 5px;" title="${state.activeLanguage === 'ar' ? 'تعديل العقد' : 'Edit Contract'}">
                          <i data-lucide="pencil" style="width: 12px; height: 12px; color: var(--color-gold);"></i>
                        </button>
                        ${!isCompleted ? `
                        <button class="btn btn-secondary btn-return-capital" data-id="${c.id}" style="padding: 6px 12px; font-size: 0.75rem; border-radius: var(--radius-sm); margin-inline-end: 5px;" title="${state.activeLanguage === 'ar' ? 'إعادة رأس المال وتصفية العقد' : 'Return Capital & Close Contract'}">
                          <i data-lucide="banknote" style="width: 12px; height: 12px; color: var(--color-success);"></i>
                        </button>
                        ` : ''}
                        <button class="btn btn-secondary btn-delete" data-id="${c.id}" style="padding: 6px 12px; font-size: 0.75rem; border-radius: var(--radius-sm);" title="${t.delete}">
                          <i data-lucide="trash-2" style="width: 12px; height: 12px; color: var(--color-danger);"></i>
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          `}
        </div>
      </div>
      
      <!-- Modal Overlay container -->
      ${modalHTML}
    </div>
  `;
}

function renderCalculatorHTML() {
  const t = translations[state.activeLanguage];
  
  return `
    <div class="premium-card">
      <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
        <i data-lucide="calculator" style="color: var(--color-gold);"></i>
        ${t.simTitle}
      </h3>
      
      <div class="calc-container">
        <!-- Form for simulator parameters -->
        <div>
          <form id="calc-form" style="display: flex; flex-direction: column; gap: 15px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="form-group">
                <label for="calc-principal">${t.principal}</label>
                <input type="number" id="calc-principal" class="form-control" value="10000" min="1" required style="font-family: var(--font-english);">
                <div class="number-preview-box" id="calc-principal-preview" style="display: none;"></div>
              </div>
              
              <div class="form-group">
                <label for="calc-principal-curr">${t.principalCurrency}</label>
                <select id="calc-principal-curr" class="form-control" style="font-family: var(--font-english);">
                  <option value="USD" selected>🇺🇸 USD</option>
                  <option value="EUR">🇪🇺 EUR</option>
                  <option value="IQD">🇮🇶 IQD</option>
                  <option value="AED">🇦🇪 AED</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label for="calc-return-curr">${t.returnCurrency}</label>
              <select id="calc-return-curr" class="form-control" style="font-family: var(--font-english); font-weight: bold; border-color: rgba(212, 175, 55, 0.4);">
                <option value="IQD" selected>🇮🇶 IQD</option>
                <option value="USD">🇺🇸 USD</option>
                <option value="EUR">🇪🇺 EUR</option>
                <option value="AED">🇦🇪 AED</option>
              </select>
            </div>

            <!-- Custom Exchange Rate for simulation -->
            <div class="form-group" id="calc-exch-rate-group">
              <label for="calc-custom-exch-rate">سعر الصرف للمحاكاة (1 USD = ?)</label>
              <input type="number" step="0.01" id="calc-custom-exch-rate" class="form-control" value="${state.exchangeRates['IQD']}" style="font-family: var(--font-english);" required>
            </div>

            <div class="form-group">
              <label for="calc-dividend-type">${t.dividendTypeLabel}</label>
              <select id="calc-dividend-type" class="form-control">
                <option value="rate">${t.divTypeRate}</option>
                <option value="fixed" selected>${t.divTypeFixed}</option>
              </select>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr; gap: 12px;">
              <div class="form-group" id="calc-rate-group" style="display: none;">
                <label for="calc-rate">${t.dividendRate}</label>
                <input type="number" id="calc-rate" step="0.1" class="form-control" value="24.8" style="font-family: var(--font-english);">
              </div>
              
              <div class="form-group" id="calc-fixed-amount-group">
                <label for="calc-fixed-amount">${t.monthlyAmountLabel}</label>
                <input type="number" id="calc-fixed-amount" class="form-control" value="300000" style="font-family: var(--font-english);">
                <div class="number-preview-box" id="calc-fixed-amount-preview" style="display: none;"></div>
              </div>
            </div>
            
            <div id="calc-sharia-error" style="display: none;"></div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="form-group">
                <label for="calc-duration">${t.duration}</label>
                <input type="number" id="calc-duration" class="form-control" value="12" min="1" required style="font-family: var(--font-english);">
              </div>
              
              <div class="form-group">
                <label for="calc-start-date">${t.startDate}</label>
                <input type="date" id="calc-start-date" class="form-control" value="${new Date().toISOString().split('T')[0]}" required style="font-family: var(--font-english);">
              </div>
            </div>
            
            <button type="submit" class="btn btn-primary">
              <i data-lucide="play-circle"></i>
              ${t.calculateBtn}
            </button>
          </form>
        </div>
        
        <!-- Results Column -->
        <div class="calculator-results" id="calculator-results-box">
          <div style="text-align: center; color: var(--text-secondary); padding: 30px;">
            <i data-lucide="help-circle" style="width: 48px; height: 48px; opacity: 0.5; margin-bottom: 10px;"></i>
            <p>أدخل بيانات العقد الافتراضي واضغط على توليد الجدول لعرض النتائج الشرعية والجدولة الزمنية.</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Timeline details -->
    <div class="premium-card" style="margin-top: 25px; display: none;" id="calc-schedule-card">
      <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
        <i data-lucide="table" style="color: var(--color-gold);"></i>
        ${t.scheduleTitle}
      </h3>
      <div class="table-container">
        <table class="premium-table" id="calc-schedule-table">
          <thead>
            <!-- Will be dynamically filled -->
          </thead>
          <tbody>
            <!-- Will be dynamically filled -->
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderLedgersHTML() {
  const t = translations[state.activeLanguage];
  const balances = getConsolidatedBalances();
  const contractBalances = getAccountBalances();
  
  // Calculate Funder (Creditor) Totals
  const creditorTotals = { principals: {}, dues: {}, balances: {} };
  balances.creditors.forEach(cb => {
    Object.keys(cb.principals).forEach(curr => { creditorTotals.principals[curr] = (creditorTotals.principals[curr] || 0) + cb.principals[curr]; });
    Object.keys(cb.dues).forEach(curr => { creditorTotals.dues[curr] = (creditorTotals.dues[curr] || 0) + cb.dues[curr]; });
    Object.keys(cb.balances).forEach(curr => { creditorTotals.balances[curr] = (creditorTotals.balances[curr] || 0) + cb.balances[curr]; });
  });

  // Calculate Operator (Debtor) Totals
  const debtorTotals = { principals: {}, dues: {}, balances: {} };
  balances.debtors.forEach(db => {
    Object.keys(db.principals).forEach(curr => { debtorTotals.principals[curr] = (debtorTotals.principals[curr] || 0) + db.principals[curr]; });
    Object.keys(db.dues).forEach(curr => { debtorTotals.dues[curr] = (debtorTotals.dues[curr] || 0) + db.dues[curr]; });
    Object.keys(db.balances).forEach(curr => { debtorTotals.balances[curr] = (debtorTotals.balances[curr] || 0) + db.balances[curr]; });
  });

  return `
    <!-- Account Balances Row -->
    <div class="dashboard-grid">
      <!-- Profits Account -->
      <div class="premium-card stat-card gold">
        <div class="stat-header">
          <span class="stat-title">${t.profitsAccount}</span>
          <div class="stat-icon">
            <i data-lucide="shield-check"></i>
          </div>
        </div>
        <div class="stat-body">
          <div class="stat-value">
            ${balances.profits.toLocaleString()}
            <span class="stat-unit">${formatCurrencyName('IQD')}</span>
          </div>
          <div class="stat-footer">
            <button class="btn btn-secondary btn-statement" data-id="platform_profits" style="padding: 4px 8px; font-size: 0.75rem; width: 100%;">
              <i data-lucide="file-spreadsheet" style="width: 12px; height: 12px;"></i>
              ${t.viewStatement}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Company Internal Operations Portfolio -->
      <div class="premium-card stat-card gold" style="border-color: rgba(174, 124, 80, 0.4);">
        <div class="stat-header">
          <span class="stat-title">${state.activeLanguage === 'ar' ? 'محفظة التشغيل الداخلي' : 'Internal Operations'}</span>
          <div class="stat-icon" style="background-color: var(--color-gold-light); color: var(--color-gold);">
            <i data-lucide="home"></i>
          </div>
        </div>
        <div class="stat-body">
          <div class="stat-value" style="color: var(--color-gold);">
            ${balances.internalOperations.toLocaleString()}
            <span class="stat-unit">${formatCurrencyName('IQD')}</span>
          </div>
          <div class="stat-footer">
            <span class="trend-neutral">${state.contracts.filter(c => c.isInternal && c.status !== 'completed').length} ${state.activeLanguage === 'ar' ? 'عقود تشغيل داخلي' : 'internal contracts'}</span>
          </div>
        </div>
      </div>
      
      <!-- Total Creditor Outstanding Due -->
      <div class="premium-card stat-card success">
        <div class="stat-header">
          <span class="stat-title">إجمالي مستحقات الممولين المعلقة</span>
          <div class="stat-icon">
            <i data-lucide="wallet"></i>
          </div>
        </div>
        <div class="stat-body">
          <div class="stat-value" style="color: var(--color-success);">
            ${Object.values(contractBalances.creditors).reduce((acc, curr) => acc + curr.balance, 0).toLocaleString()}
            <span class="stat-unit">${formatCurrencyName('IQD')}</span>
          </div>
          <div class="stat-footer">
            <span class="trend-neutral">${balances.creditors.length} حساب متعامل ممول</span>
          </div>
        </div>
      </div>
      
      <!-- Total Debtor Outstanding Due -->
      <div class="premium-card stat-card danger">
        <div class="stat-header">
          <span class="stat-title">إجمالي ذمم المشغلين المعلقة</span>
          <div class="stat-icon">
            <i data-lucide="receipt"></i>
          </div>
        </div>
        <div class="stat-body">
          <div class="stat-value" style="color: var(--color-danger);">
            ${Object.values(contractBalances.debtors).reduce((acc, curr) => acc + curr.balance, 0).toLocaleString()}
            <span class="stat-unit">${formatCurrencyName('IQD')}</span>
          </div>
          <div class="stat-footer">
            <span class="trend-neutral">${balances.debtors.length} حساب متعامل مشغل</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Unified Accounts Lists and Transactions Details -->
    <div style="display: flex; flex-direction: column; gap: 25px; margin-bottom: 30px;">
      
      <div class="search-wrapper" style="margin-bottom: 0;">
        <div class="search-input-icon">
          <i data-lucide="search" style="width: 16px; height: 16px;"></i>
        </div>
        <input type="text" class="search-control" id="search-ledgers" placeholder="${state.activeLanguage === 'ar' ? 'بحث باسم الحساب الموحد...' : 'Search by consolidated account name...'}">
      </div>

      <!-- Funder Accounts Ledger Table -->
      <div class="premium-card">
        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
          <i data-lucide="shield-check" style="color: var(--color-gold)"></i>
          أرصدة حسابات الأستاذ الموحدة للممولين (حسابات دائنة)
        </h3>
        <div class="table-container">
          <table class="premium-table">
            <thead>
              <tr>
                <th>${t.accountName}</th>
                <th>نوع الحساب</th>
                <th>إجمالي رأس المال</th>
                <th>إجمالي المستحقات</th>
                <th>الرصيد المعلق المجمع</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              ${balances.creditors.map(cb => `
                <tr>
                  <td style="font-weight: 700; color: var(--text-primary);">${cb.partyName}</td>
                  <td>
                    <span class="badge ${cb.isInternal ? 'badge-gold' : 'badge-success'}">
                      ${cb.isInternal ? (state.activeLanguage === 'ar' ? 'تشغيل داخلي' : 'Internal Ops') : (state.activeLanguage === 'ar' ? 'حساب ممول' : 'Funder')}
                    </span>
                    <span style="font-size: 0.75rem; color: var(--text-muted); margin-inline-start: 6px;">
                      (${cb.contracts.length} ${state.activeLanguage === 'ar' ? 'عقود' : 'contracts'})
                    </span>
                  </td>
                  <td>${formatMultiCurrency(cb.principals)}</td>
                  <td style="font-family: var(--font-english);">${formatMultiCurrency(cb.dues)}</td>
                  <td style="font-family: var(--font-english); font-weight: bold; color: var(--color-gold);">${formatMultiCurrency(cb.balances)}</td>
                  <td>
                    <button class="btn btn-secondary btn-statement" data-id="party:${cb.partyName}" style="padding: 6px 10px; font-size: 0.8rem;" title="${state.activeLanguage === 'ar' ? 'كشف الحساب الموحد' : 'Consolidated Statement'}">
                      <i data-lucide="file-text" style="width: 14px; height: 14px;"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr style="background-color: rgba(255, 255, 255, 0.05); font-weight: bold; border-top: 2px solid var(--border-color);">
                <td colspan="2" style="text-align: start;">المجموع الكلي (Totals)</td>
                <td style="font-family: var(--font-english);">${formatMultiCurrency(creditorTotals.principals)}</td>
                <td style="font-family: var(--font-english);">${formatMultiCurrency(creditorTotals.dues)}</td>
                <td style="font-family: var(--font-english); color: var(--color-gold);">${formatMultiCurrency(creditorTotals.balances)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Operator Accounts Ledger Table -->
      <div class="premium-card">
        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
          <i data-lucide="shield-alert" style="color: var(--color-danger)"></i>
          أرصدة حسابات الأستاذ الموحدة للمشغلين (حسابات مدينة)
        </h3>
        <div class="table-container">
          <table class="premium-table">
            <thead>
              <tr>
                <th>${t.accountName}</th>
                <th>نوع الحساب</th>
                <th>إجمالي رأس المال</th>
                <th>إجمالي المستحقات</th>
                <th>الرصيد المعلق المجمع</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              ${balances.debtors.map(db => `
                <tr>
                  <td style="font-weight: 700; color: var(--text-primary);">${db.partyName}</td>
                  <td>
                    <span class="badge ${db.isInternal ? 'badge-gold' : 'badge-danger'}">
                      ${db.isInternal ? (state.activeLanguage === 'ar' ? 'تشغيل داخلي' : 'Internal Ops') : (state.activeLanguage === 'ar' ? 'حساب مشغل' : 'Operator')}
                    </span>
                    <span style="font-size: 0.75rem; color: var(--text-muted); margin-inline-start: 6px;">
                      (${db.contracts.length} ${state.activeLanguage === 'ar' ? 'عقود' : 'contracts'})
                    </span>
                  </td>
                  <td>${formatMultiCurrency(db.principals)}</td>
                  <td style="font-family: var(--font-english);">${formatMultiCurrency(db.dues)}</td>
                  <td style="font-family: var(--font-english); font-weight: bold; color: var(--color-danger);">${formatMultiCurrency(db.balances)}</td>
                  <td>
                    <button class="btn btn-secondary btn-statement" data-id="party:${db.partyName}" style="padding: 6px 10px; font-size: 0.8rem;" title="${state.activeLanguage === 'ar' ? 'كشف الحساب الموحد' : 'Consolidated Statement'}">
                      <i data-lucide="file-text" style="width: 14px; height: 14px;"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr style="background-color: rgba(255, 255, 255, 0.05); font-weight: bold; border-top: 2px solid var(--border-color);">
                <td colspan="2" style="text-align: start;">المجموع الكلي (Totals)</td>
                <td style="font-family: var(--font-english);">${formatMultiCurrency(debtorTotals.principals)}</td>
                <td style="font-family: var(--font-english);">${formatMultiCurrency(debtorTotals.dues)}</td>
                <td style="font-family: var(--font-english); color: var(--color-danger);">${formatMultiCurrency(debtorTotals.balances)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Selected Statement Details View -->
    <div class="premium-card" id="ledger-statement-panel" style="display: none;">
      <!-- Dynamic Statement Content -->
    </div>
  `;
}

function getMonthlyBalanceData(targetCurrency = 'IQD') {
  const monthsData = {}; // key: YYYY-MM
  
  state.transactions.forEach(tx => {
    if (tx.type !== 'dividend_due') return;
    
    // Grouping by calendar month (YYYY-MM)
    const monthKey = tx.date.substring(0, 7); // e.g. "2024-02"
    if (!monthsData[monthKey]) {
      monthsData[monthKey] = {
        month: monthKey,
        funderDues: 0,
        operatorDues: 0
      };
    }
    
    // Convert amount to target currency using contract custom rate if available
    const contract = state.contracts.find(c => c.id === tx.contractId);
    const amountInTarget = contract
      ? convertContractCurrency(tx.amount, tx.currency, targetCurrency, contract)
      : convertCurrency(tx.amount, tx.currency, targetCurrency);
    
    if (tx.partyType === 'creditor') {
      monthsData[monthKey].funderDues += amountInTarget;
    } else if (tx.partyType === 'debtor') {
      monthsData[monthKey].operatorDues += amountInTarget;
    }
  });
  
  // Sort months chronologically
  const sortedMonths = Object.values(monthsData).sort((a, b) => a.month.localeCompare(b.month));
  return sortedMonths;
}

function getCapitalBalanceData(targetCurrency = 'IQD') {
  let totalFunderCapital = 0;
  let totalOperatorCapital = 0;
  
  state.contracts.forEach(c => {
    if (c.status === 'completed') return;
    
    // Respect custom locked exchange rates on contracts if specified
    const capitalInTarget = convertContractCurrency(c.principal, c.principalCurrency, targetCurrency, c);
    
    if (c.type === 'creditor') {
      totalFunderCapital += capitalInTarget;
    } else if (c.type === 'debtor') {
      totalOperatorCapital += capitalInTarget;
    }
  });
  
  const netCapital = totalOperatorCapital - totalFunderCapital;
  
  return {
    totalFunderCapital,
    totalOperatorCapital,
    netCapital
  };
}

function formatMonthName(monthStr, lang) {
  if (!monthStr || !monthStr.includes('-')) return monthStr;
  const parts = monthStr.split('-');
  const year = parts[0];
  const monthNum = parseInt(parts[1], 10);
  
  const arMonths = [
    "كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران",
    "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"
  ];
  const enMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  if (lang === 'ar') {
    return `${arMonths[monthNum - 1]} ${year}`;
  } else {
    return `${enMonths[monthNum - 1]} ${year}`;
  }
}

function renderMonthlyBalanceHTML() {
  const t = translations[state.activeLanguage];
  const isAr = state.activeLanguage === 'ar';
  
  const targetCurrency = state.balanceDisplayCurrency || 'IQD';
  const monthlyData = getMonthlyBalanceData(targetCurrency);
  
  let totalFunderDues = 0;
  let totalOperatorDues = 0;
  
  monthlyData.forEach(d => {
    totalFunderDues += d.funderDues;
    totalOperatorDues += d.operatorDues;
  });
  
  const totalNet = totalOperatorDues - totalFunderDues;
  const netStatusClass = totalNet >= 0 ? 'success' : 'danger';
  const netBadgeClass = totalNet >= 0 ? 'badge-success' : 'badge-danger';
  
  // Format helper for numbers with currency symbol
  function formatVal(amount) {
    if (targetCurrency === 'IQD') {
      return amount.toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' ' + (isAr ? 'د.ع' : 'IQD');
    } else {
      return '$' + amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  }
  
  // Format helper for USD capital balance values (locked to USD as requested)
  function formatUSD(amount) {
    return '$' + amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  
  // Translation values
  const labelFunderDues = isAr ? "مستحقات الممولين بذمتي" : "Owed to Funders (Outflow)";
  const labelOperatorDues = isAr ? "مستحقات المشغلين لي" : "Owed by Operators (Inflow)";
  const labelNetProfit = isAr ? "الأرباح / الخسائر الصافية" : "Net Profit / Loss";
  const labelMonth = isAr ? "الشهر التقويمي" : "Calendar Month";
  const labelExchangeRateUsed = isAr ? "سعر الصرف المعتمد حالياً" : "Exchange Rate";
  const labelCurrencyUnification = isAr ? `ملاحظة: تم توحيد كافة المبالغ بـ ${targetCurrency === 'IQD' ? 'الدينار العراقي (IQD)' : 'الدولار الأمريكي (USD)'}` : `Note: All values unified in ${targetCurrency === 'IQD' ? 'Iraqi Dinar (IQD)' : 'US Dollar (USD)'}`;
  const labelStatus = isAr ? "الحالة" : "Status";
  const labelProfit = isAr ? "ربح صافي" : "Net Profit";
  const labelLoss = isAr ? "خسارة صافية" : "Net Loss";
  
  const currentRateIQD = state.exchangeRates['IQD'] || 1450.0;
  
  let rowsHtml = '';
  if (monthlyData.length === 0) {
    rowsHtml = `
      <tr>
        <td colspan="5" style="text-align: center; color: var(--text-secondary); padding: 30px;">
          <div style="font-size: 1.5rem; margin-bottom: 8px; opacity: 0.5;">
            <i data-lucide="info"></i>
          </div>
          <div>${isAr ? 'لا توجد دفعات مستحقة مسجلة حتى الآن لتوليد الميزان الشهري.' : 'No due transactions recorded yet.'}</div>
        </td>
      </tr>
    `;
  } else {
    rowsHtml = monthlyData.map(d => {
      const monthLabel = formatMonthName(d.month, state.activeLanguage);
      const netVal = d.operatorDues - d.funderDues;
      const rowNetClass = netVal >= 0 ? 'color: var(--color-success); font-weight: bold;' : 'color: var(--color-danger); font-weight: bold;';
      const badgeText = netVal >= 0 ? labelProfit : labelLoss;
      const badgeStyleClass = netVal >= 0 ? 'badge-success' : 'badge-danger';
      
      return `
        <tr>
          <td style="font-weight: 700;">${monthLabel}</td>
          <td style="font-family: var(--font-english); font-weight: 600;">${formatVal(d.funderDues)}</td>
          <td style="font-family: var(--font-english); font-weight: 600;">${formatVal(d.operatorDues)}</td>
          <td style="font-family: var(--font-english); ${rowNetClass}">${netVal >= 0 ? '+' : ''}${formatVal(netVal)}</td>
          <td>
            <span class="badge ${badgeStyleClass}">
              <i data-lucide="${netVal >= 0 ? 'trending-up' : 'trending-down'}" style="width: 12px; height: 12px;"></i>
              ${badgeText}
            </span>
          </td>
        </tr>
      `;
    }).join('');
  }
  
  // Calculate Capital Balance (Locked to USD as requested by user)
  const capitalData = getCapitalBalanceData('USD');
  const totalFunderCapital = capitalData.totalFunderCapital;
  const totalOperatorCapital = capitalData.totalOperatorCapital;
  const netCapital = capitalData.netCapital;
  const capStatusClass = netCapital >= 0 ? 'success' : 'danger';
  const capBadgeClass = netCapital >= 0 ? 'badge-success' : 'badge-danger';
  
  // Diagnosis box for Capital Balance
  let diagnosisHtml = '';
  const activeContractsCount = state.contracts.filter(c => c.status !== 'completed').length;
  if (activeContractsCount === 0) {
    diagnosisHtml = `
      <div class="alert-box" style="display: flex; align-items: center; gap: 10px; padding: 15px; border-radius: var(--radius-md); background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-color); color: var(--text-secondary); font-size: 0.85rem;">
        <i data-lucide="info" style="color: var(--color-gold); flex-shrink: 0;"></i>
        <div>${isAr ? 'لا توجد عقود نشطة حالياً لتشخيص الميزان.' : 'No active contracts recorded yet for capital diagnosis.'}</div>
      </div>
    `;
  } else if (Math.abs(netCapital) < 0.01) {
    diagnosisHtml = `
      <div class="alert-box" style="display: flex; align-items: center; gap: 10px; padding: 15px; border-radius: var(--radius-md); background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.2); color: var(--color-success); font-size: 0.85rem;">
        <i data-lucide="check-circle-2" style="flex-shrink: 0;"></i>
        <div>
          <strong>${isAr ? 'توازن تمويلي كامل (حالة مثالية):' : 'Full Financing Balance (Ideal State):'}</strong>
          ${isAr 
            ? 'يتطابق إجمالي رأس مال الممولين مع رأس المال الممنوح للمشغلين تماماً. لا توجد أي سيولة معطلة في الصندوق ولا حاجة لتمويل ذاتي إضافي.' 
            : 'Funder capital matches deployed operator capital exactly. No idle liquidity or self-funding required.'}
        </div>
      </div>
    `;
  } else if (netCapital > 0) {
    diagnosisHtml = `
      <div class="alert-box" style="display: flex; align-items: center; gap: 10px; padding: 15px; border-radius: var(--radius-md); background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2); color: #3b82f6; font-size: 0.85rem;">
        <i data-lucide="info" style="flex-shrink: 0;"></i>
        <div>
          <strong>${isAr ? 'تمويل مغطى من الشركة (Self-Funded Deployed Capital):' : 'Additional Company Self-Funding:'}</strong>
          ${isAr 
            ? `رأس المال الممنوح للمشغلين يتجاوز تمويل الممولين بقيمة <strong>${formatUSD(netCapital)}</strong>. تقوم الشركة حالياً بتمويل هذا الفارق ذاتياً للتشغيل الداخلي.` 
            : `Operator capital exceeds funder capital by <strong>${formatUSD(netCapital)}</strong>. The company is self-funding this difference.`}
        </div>
      </div>
    `;
  } else {
    // netCapital < 0
    diagnosisHtml = `
      <div class="alert-box" style="display: flex; align-items: center; gap: 10px; padding: 15px; border-radius: var(--radius-md); background: rgba(245, 158, 11, 0.05); border: 1px solid rgba(245, 158, 11, 0.25); color: var(--color-warning); font-size: 0.85rem;">
        <i data-lucide="alert-triangle" style="flex-shrink: 0;"></i>
        <div>
          <strong>${isAr ? 'تنبيه: سيولة معطلة غير مستغلة (Idle Liquidity Slack):' : 'Warning: Idle Capital Liquidity:'}</strong>
          ${isAr 
            ? `لديك سيولة غير مشغلة بقيمة <strong>${formatUSD(Math.abs(netCapital))}</strong> مستلمة من الممولين ولكنها لم تُمنح للمشغلين. هذه السيولة معطلة وتكلفك دفع أرباح عوائد دون توليد دخل.` 
            : `You have idle liquidity of <strong>${formatUSD(Math.abs(netCapital))}</strong> received from funders but not deployed. This costs dividends without yield.`}
        </div>
      </div>
    `;
  }
  
  return `
    <!-- Dual Currency Selector Switch -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; flex-wrap: wrap; gap: 15px; background: rgba(255, 255, 255, 0.01); padding: 12px 18px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-secondary);">${isAr ? 'عرض الحسابات بـ:' : 'Display Balances in:'}</span>
        <div class="lang-switch" style="margin: 0; display: inline-flex; width: 220px;">
          <button class="lang-btn balance-curr-btn ${targetCurrency === 'IQD' ? 'active' : ''}" data-curr="IQD" style="padding: 6px;">
            <span>${isAr ? 'دينار (IQD)' : 'Dinar (IQD)'}</span>
          </button>
          <button class="lang-btn balance-curr-btn ${targetCurrency === 'USD' ? 'active' : ''}" data-curr="USD" style="padding: 6px;">
            <span>${isAr ? 'دولار (USD)' : 'Dollar (USD)'}</span>
          </button>
        </div>
      </div>
      
      <div style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; background: rgba(255, 255, 255, 0.02); padding: 6px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
        <i data-lucide="refresh-cw" style="width: 14px; height: 14px; color: var(--color-gold);"></i>
        <span>${labelExchangeRateUsed}: <strong>$1 = ${currentRateIQD.toLocaleString()} IQD</strong></span>
      </div>
    </div>

    <!-- SECTION 1: MONTHLY PROFITS AND LOSSES BALANCE -->
    <div style="margin-bottom: 35px;">
      <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; color: var(--text-primary);">
        <i data-lucide="line-chart" style="color: var(--color-gold);"></i>
        ${isAr ? 'ميزان الإيرادات والأرباح التشغيلية الشهرية' : 'Monthly Revenues & Yield Balance Sheet'}
      </h3>
      
      <div class="dashboard-grid">
        <div class="premium-card stat-card danger">
          <div class="stat-header">
            <span class="stat-title">${labelFunderDues}</span>
            <div class="stat-icon">
              <i data-lucide="arrow-up-right" style="color: var(--color-danger);"></i>
            </div>
          </div>
          <div class="stat-body">
            <div class="stat-value" style="font-size: 1.4rem; font-family: var(--font-english);">
              ${formatVal(totalFunderDues)}
            </div>
            <div class="stat-footer">
              <span style="color: var(--text-secondary); font-size: 0.75rem;">${isAr ? 'مجموع الالتزامات المترتبة بذمتك للممولين' : 'Total obligations to funders'}</span>
            </div>
          </div>
        </div>
        
        <div class="premium-card stat-card success">
          <div class="stat-header">
            <span class="stat-title">${labelOperatorDues}</span>
            <div class="stat-icon">
              <i data-lucide="arrow-down-left" style="color: var(--color-success);"></i>
            </div>
          </div>
          <div class="stat-body">
            <div class="stat-value" style="font-size: 1.4rem; font-family: var(--font-english);">
              ${formatVal(totalOperatorDues)}
            </div>
            <div class="stat-footer">
              <span style="color: var(--text-secondary); font-size: 0.75rem;">${isAr ? 'مجموع مستحقات عوائد التشغيل العائدة لك' : 'Total operator returns due'}</span>
            </div>
          </div>
        </div>
        
        <div class="premium-card stat-card ${netStatusClass}">
          <div class="stat-header">
            <span class="stat-title">${labelNetProfit}</span>
            <div class="stat-icon">
              <i data-lucide="trending-up" style="color: var(--color-${netStatusClass});"></i>
            </div>
          </div>
          <div class="stat-body">
            <div class="stat-value" style="font-size: 1.4rem; color: var(--color-${netStatusClass}); font-family: var(--font-english);">
              ${totalNet >= 0 ? '+' : ''}${formatVal(totalNet)}
            </div>
            <div class="stat-footer" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <span style="color: var(--text-secondary); font-size: 0.75rem;">${isAr ? 'الصافي المالي الإجمالي التراكمي' : 'Cumulative net balance'}</span>
              <span class="badge ${netBadgeClass}" style="padding: 2px 8px; font-size: 0.7rem;">
                ${totalNet >= 0 ? labelProfit : labelLoss}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Table of monthly yield breakdown -->
      <div class="premium-card" style="margin-top: 15px;">
        <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
          <span>${labelCurrencyUnification}</span>
          <span>${isAr ? `إجمالي الفحوصات: ${monthlyData.length} شهور` : `Total periods: ${monthlyData.length} months`}</span>
        </div>
        <div class="table-container">
          <table class="premium-table">
            <thead>
              <tr>
                <th>${labelMonth}</th>
                <th>${labelFunderDues}</th>
                <th>${labelOperatorDues}</th>
                <th>${labelNetProfit}</th>
                <th>${labelStatus}</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- SECTION 2: CAPITAL PRINCIPAL BALANCE -->
    <div style="margin-top: 35px; border-top: 1px solid var(--border-color); padding-top: 25px;">
      <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 15px; display: flex; align-items: center; justify-content: space-between; color: var(--text-primary);">
        <span style="display: flex; align-items: center; gap: 8px;">
          <i data-lucide="wallet" style="color: var(--color-gold);"></i>
          ${t.capitalBalance}
        </span>
        <span style="font-size: 0.75rem; color: var(--text-secondary); background: rgba(255, 255, 255, 0.03); padding: 4px 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
          ${isAr ? 'محتسب بالدولار فقط (USD)' : 'Calculated in USD only'}
        </span>
      </h3>
      
      <div class="dashboard-grid" style="margin-bottom: 15px;">
        <div class="premium-card stat-card danger">
          <div class="stat-header">
            <span class="stat-title">${t.funderCapital}</span>
            <div class="stat-icon">
              <i data-lucide="shield-alert" style="color: var(--color-danger);"></i>
            </div>
          </div>
          <div class="stat-body">
            <div class="stat-value" style="font-size: 1.4rem; font-family: var(--font-english);">
              ${formatUSD(totalFunderCapital)}
            </div>
            <div class="stat-footer">
              <span style="color: var(--text-secondary); font-size: 0.75rem;">${isAr ? 'مجموع رؤوس الأموال المستحقة بذمتك للممولين' : 'Total principal capital owed to funders'}</span>
            </div>
          </div>
        </div>
        
        <div class="premium-card stat-card success">
          <div class="stat-header">
            <span class="stat-title">${t.operatorCapital}</span>
            <div class="stat-icon">
              <i data-lucide="shield-check" style="color: var(--color-success);"></i>
            </div>
          </div>
          <div class="stat-body">
            <div class="stat-value" style="font-size: 1.4rem; font-family: var(--font-english);">
              ${formatUSD(totalOperatorCapital)}
            </div>
            <div class="stat-footer">
              <span style="color: var(--text-secondary); font-size: 0.75rem;">${isAr ? 'مجموع رؤوس الأموال الموظفة لدى المشغلين' : 'Total principal capital deployed to operators'}</span>
            </div>
          </div>
        </div>
        
        <div class="premium-card stat-card ${capStatusClass}">
          <div class="stat-header">
            <span class="stat-title">${t.netCapital}</span>
            <div class="stat-icon">
              <i data-lucide="wallet" style="color: var(--color-${capStatusClass});"></i>
            </div>
          </div>
          <div class="stat-body">
            <div class="stat-value" style="font-size: 1.4rem; color: var(--color-${capStatusClass}); font-family: var(--font-english);">
              ${netCapital >= 0 ? '+' : ''}${formatUSD(netCapital)}
            </div>
            <div class="stat-footer" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <span style="color: var(--text-secondary); font-size: 0.75rem;">${isAr ? 'رأس المال الفعلي المشغل ذاتياً' : 'Net self-funded deployed capital'}</span>
              <span class="badge ${capBadgeClass}" style="padding: 2px 8px; font-size: 0.7rem;">
                ${netCapital >= 0 ? (isAr ? 'تمويل مغطى' : 'Self-funded') : (isAr ? 'فجوة سيولة' : 'Liquidity gap')}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Smart diagnosis box -->
      <div style="margin-top: 15px;">
        ${diagnosisHtml}
      </div>
    </div>
  `;
}

function calculateRedemptionProfit(contract) {
  const isFunder = contract.type === 'creditor';
  
  // Calculate return amount (in return currency)
  const returnAmount = convertContractCurrency(contract.principal, contract.principalCurrency, contract.returnCurrency, contract);
  
  // Current value of returnAmount in principalCurrency at current market rate
  const currentValInPrincipal = convertCurrency(returnAmount, contract.returnCurrency, contract.principalCurrency);
  
  // Profit/Loss calculation in principal currency
  const profit = isFunder
    ? contract.principal - currentValInPrincipal
    : currentValInPrincipal - contract.principal;
    
  // Convert profit to USD for uniform comparisons
  const profitUSD = convertToUSD(profit, contract.principalCurrency);
  
  return {
    profit,
    profitUSD,
    currency: contract.principalCurrency,
    returnAmount,
    currentValInPrincipal
  };
}

function renderAnalysisHTML() {
  const t = translations[state.activeLanguage];
  const isAr = state.activeLanguage === 'ar';
  
  const activeContracts = state.contracts.filter(c => c.status !== 'completed');
  const funderContracts = activeContracts.filter(c => c.type === 'creditor');
  const operatorContracts = activeContracts.filter(c => c.type === 'debtor');
  
  // --- FINANCIAL EXPOSURE & HEDGING CALCULATIONS ---
  let funderUSD = 0;
  let operatorUSD = 0;
  funderContracts.forEach(c => {
    funderUSD += convertContractCurrency(c.principal, c.principalCurrency, 'USD', c);
  });
  operatorContracts.forEach(c => {
    operatorUSD += convertContractCurrency(c.principal, c.principalCurrency, 'USD', c);
  });
  
  const usdPrincipalRatio = funderUSD > 0 ? (operatorUSD / funderUSD) * 100 : 0;
  
  let funderMonthlyReturnsIQD = 0;
  let operatorMonthlyReturnsIQD = 0;
  funderContracts.forEach(c => {
    const monthlyReturnVal = calculateMonthlyReturn(c);
    funderMonthlyReturnsIQD += convertContractCurrency(monthlyReturnVal, c.returnCurrency, 'IQD', c);
  });
  operatorContracts.forEach(c => {
    const monthlyReturnVal = calculateMonthlyReturn(c);
    operatorMonthlyReturnsIQD += convertContractCurrency(monthlyReturnVal, c.returnCurrency, 'IQD', c);
  });
  
  const iqdHedgingRatio = funderMonthlyReturnsIQD > 0 ? (operatorMonthlyReturnsIQD / funderMonthlyReturnsIQD) * 100 : 0;
  
  // --- PORTFOLIO ORIGINAL CURRENCY BALANCE CALCULATIONS ---
  let funderPrincipalUSD = 0;
  let funderPrincipalIQD = 0;
  let operatorPrincipalUSD = 0;
  let operatorPrincipalIQD = 0;

  funderContracts.forEach(c => {
    if (c.principalCurrency === 'USD') {
      funderPrincipalUSD += c.principal;
    } else if (c.principalCurrency === 'IQD') {
      funderPrincipalIQD += c.principal;
    }
  });

  operatorContracts.forEach(c => {
    if (c.principalCurrency === 'USD') {
      operatorPrincipalUSD += c.principal;
    } else if (c.principalCurrency === 'IQD') {
      operatorPrincipalIQD += c.principal;
    }
  });

  const marketRateIQD = state.exchangeRates['IQD'] || 1450.0;
  
  // --- DUAL CURRENCY STRUCTURE RATIO CALCULATIONS ---
  // 1. Funding Contracts
  const fundingIQDVal = funderPrincipalIQD / marketRateIQD;
  const fundingUSDVal = funderPrincipalUSD;
  const fundingTotalVal = fundingIQDVal + fundingUSDVal;
  const fundingIQDPercent = fundingTotalVal > 0 ? (fundingIQDVal / fundingTotalVal) * 100 : 50;
  const fundingUSDPercent = fundingTotalVal > 0 ? (fundingUSDVal / fundingTotalVal) * 100 : 50;

  // 2. Operator Contracts
  const operatorIQDVal = operatorPrincipalIQD / marketRateIQD;
  const operatorUSDVal = operatorPrincipalUSD;
  const operatorTotalVal = operatorIQDVal + operatorUSDVal;
  const operatorIQDPercent = operatorTotalVal > 0 ? (operatorIQDVal / operatorTotalVal) * 100 : 50;
  const operatorUSDPercent = operatorTotalVal > 0 ? (operatorUSDVal / operatorTotalVal) * 100 : 50;

  // 3. Outstanding Dues (المستحقات)
  const unpaidDues = state.transactions.filter(tx => {
    if (tx.type !== 'dividend_due') return false;
    const isSettled = state.transactions.some(
      settled => settled.contractId === tx.contractId && 
                 settled.period === tx.period && 
                 (settled.type === 'payout' || settled.type === 'collect')
    );
    return !isSettled;
  });
  let duesIQD = 0;
  let duesUSD = 0;
  unpaidDues.forEach(tx => {
    if (tx.currency === 'IQD') duesIQD += tx.amount;
    else if (tx.currency === 'USD') duesUSD += tx.amount;
  });
  const duesIQDVal = duesIQD / marketRateIQD;
  const duesUSDVal = duesUSD;
  const duesTotalVal = duesIQDVal + duesUSDVal;
  const duesIQDPercent = duesTotalVal > 0 ? (duesIQDVal / duesTotalVal) * 100 : 50;
  const duesUSDPercent = duesTotalVal > 0 ? (duesUSDVal / duesTotalVal) * 100 : 50;

  // 4. Settled Payments (المدفوعات)
  const settledPayments = state.transactions.filter(tx => tx.type === 'payout' || tx.type === 'collect');
  let paymentsIQD = 0;
  let paymentsUSD = 0;
  settledPayments.forEach(tx => {
    if (tx.currency === 'IQD') paymentsIQD += tx.amount;
    else if (tx.currency === 'USD') paymentsUSD += tx.amount;
  });
  const paymentsIQDVal = paymentsIQD / marketRateIQD;
  const paymentsUSDVal = paymentsUSD;
  const paymentsTotalVal = paymentsIQDVal + paymentsUSDVal;
  const paymentsIQDPercent = paymentsTotalVal > 0 ? (paymentsIQDVal / paymentsTotalVal) * 100 : 50;
  const paymentsUSDPercent = paymentsTotalVal > 0 ? (paymentsUSDVal / paymentsTotalVal) * 100 : 50;

  // --- ADVISORY RECOMMENDATIONS FOR CURRENCY STRUCTURE ---
  // Funding Contracts Recommendation
  let fundingRecommendationAr = '';
  let fundingRecommendationEn = '';
  if (fundingUSDPercent > 65) {
    fundingRecommendationAr = 'يهيمن الدولار على التمويل. يُنصح بتحفيز عقود التمويل بالدينار العراقي (IQD) لتقليل الضغط على السيولة الصعبة وتحقيق توازن أفضل.';
    fundingRecommendationEn = 'USD dominates funding. We advise onboarding more IQD funders to reduce foreign currency liabilities and balance the portfolio.';
  } else if (fundingIQDPercent > 65) {
    fundingRecommendationAr = 'تركز عالٍ للتمويل بالدينار. يُنصح بزيادة التمويل بالدولار (USD) لحماية رأس مال المنصة من مخاطر تقلبات وتضخم العملة المحلية.';
    fundingRecommendationEn = 'High IQD concentration. We recommend onboarding USD funders to shield the funding base against local currency devaluation.';
  } else {
    fundingRecommendationAr = 'توزيع العملات في التمويل متوازن ومثالي. يحقق تحوطاً طبيعياً ممتازاً ويقلل مخاطر تركز العملة الواحدة.';
    fundingRecommendationEn = 'Funding currency mix is well-balanced. This provides optimal natural hedging and lowers single-currency exposure.';
  }

  // Operator Contracts Recommendation
  let operatorRecommendationAr = '';
  let operatorRecommendationEn = '';
  if (operatorUSDPercent > 65) {
    operatorRecommendationAr = 'تركز تشغيلي عالٍ بالدولار. تأكد من قدرة المشغلين على سداد عوائد بالدولار. يُنصح بزيادة التوزيع بالدينار لتتناسب مع التكاليف المحلية.';
    operatorRecommendationEn = 'High USD operator concentration. Ensure operators have robust USD yields. We suggest expanding IQD operator deployments.';
  } else if (operatorIQDPercent > 65) {
    operatorRecommendationAr = 'تركز تشغيلي عالٍ بالدينار. يُنصح بالتحول التدريجي نحو صياغة عقود تشغيل جديدة بالدولار لحماية عوائد المنصة من تقلبات سعر الصرف.';
    operatorRecommendationEn = 'High IQD operator concentration. We suggest structuring future deployments in USD to secure returns in stable currency.';
  } else {
    operatorRecommendationAr = 'توزيع عقود التشغيل متوازن ويضمن عوائد مستقرة موزعة بين الأنشطة التشغيلية المحلية والدولارية.';
    operatorRecommendationEn = 'Operator deployments are balanced, securing stable returns across domestic and dollarized operations.';
  }

  // Outstanding Dues Recommendation
  let duesRecommendationAr = '';
  let duesRecommendationEn = '';
  if (duesUSDPercent > 65) {
    duesRecommendationAr = 'مستحقات معلقة ضخمة بالدولار. لتجنب تأخير التحصيل، يُنصح بقبول تسويات مؤقتة بالدينار العراقي بسعر السوق الموازي لتسريع السيولة.';
    duesRecommendationEn = 'Heavy USD outstanding dues. To prevent collection delays, consider accepting temporary IQD settlements at the market rate.';
  } else if (duesIQDPercent > 65) {
    duesRecommendationAr = 'مستحقات معلقة ضخمة بالدينار. أي تأخير في التحصيل يعرض القيمة للتراجع. يُنصح بالتحصيل العاجل بالدينار وتجنب تراكم الديون المحلية.';
    duesRecommendationEn = 'Heavy IQD outstanding dues. Delays expose value to devaluation. We advise immediate collections to limit IQD outstanding balances.';
  } else {
    duesRecommendationAr = 'توازن هيكلي ممتاز في مستحقات العملتين، مما يقلل من مخاطر تركز الديون المعلقة ويسهل تسوية المدفوعات.';
    duesRecommendationEn = 'Excellent balance in outstanding dues. This mitigates outstanding debt concentration and simplifies cross-currency settlement.';
  }

  // Settled Payments Recommendation
  let paymentsRecommendationAr = '';
  let paymentsRecommendationEn = '';
  if (paymentsUSDPercent > 65) {
    paymentsRecommendationAr = 'غالبية المدفوعات بالدولار. يُنصح بالاحتفاظ باحتياطي كافٍ بالدينار العراقي (IQD) لتغطية النفقات الإدارية والمصاريف التشغيلية المحلية.';
    paymentsRecommendationEn = 'Payments are mostly in USD. Maintain adequate IQD cash reserves to handle domestic administrative overheads and local fees.';
  } else if (paymentsIQDPercent > 65) {
    paymentsRecommendationAr = 'غالبية المدفوعات بالدينار. يُنصح بتحويل فائض السيولة بالدينار إلى دولار أمريكي لحفظ القيمة وتأمين الاحتياطيات من التضخم.';
    paymentsRecommendationEn = 'Payments are mostly in IQD. We advise converting surplus cash reserves from IQD into USD to lock in asset values and hedge inflation.';
  } else {
    paymentsRecommendationAr = 'حركة المدفوعات والسيولة التاريخية تتم بتوازن مالي ممتاز، مما يدعم مرونة خزينة المنصة لمواجهة التغيرات.';
    paymentsRecommendationEn = 'Historical payment velocity is balanced, supporting treasury resilience and robust liquidity management.';
  }

  const currencyDistributionHTML = `
    <!-- Currency Distribution & Linear Indicators Section -->
    <div class="premium-card" style="margin-bottom: 25px;">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
        <i data-lucide="split" style="color: var(--color-gold); width: 22px; height: 22px;"></i>
        <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--color-gold); margin: 0; display: flex; align-items: center; justify-content: space-between; width: 100%;">
          <span>${isAr ? 'تحليل هيكل توزيع العملات الثنائي (د.ع / $)' : 'Dual Currency Structural Ratio Analysis (IQD / USD)'}</span>
          <span style="font-size: 0.75rem; font-weight: 400; opacity: 0.8; font-family: var(--font-english); border: 1px solid var(--color-gold); padding: 2px 6px; border-radius: 4px;">RATIO METRICS</span>
        </h3>
      </div>

      <div class="currency-ratio-grid">
        <!-- 1. Funding Contracts Card -->
        <div class="currency-ratio-card">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem; display: flex; align-items: center; gap: 6px;">
                <i data-lucide="arrow-down-left" style="color: var(--color-success); width: 16px; height: 16px;"></i>
                ${isAr ? 'عقود التمويل (الممولين)' : 'Funding Contracts (Funders)'}
              </span>
              <span class="badge badge-gold" style="font-family: var(--font-english); font-size: 0.65rem;">${isAr ? 'رأس المال' : 'Capital'}</span>
            </div>
            
            <div class="currency-bar-track" style="background: linear-gradient(90deg, var(--color-gold) 0%, var(--color-gold) ${fundingIQDPercent}%, var(--color-success) ${fundingIQDPercent}%, var(--color-success) 100%);">
              <div class="currency-bar-split" style="left: ${fundingIQDPercent}%;"></div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; font-weight: 600; margin-bottom: 5px;">
              <div style="color: var(--color-gold); display: flex; flex-direction: column;">
                <span style="font-family: var(--font-english);">${fundingIQDPercent.toFixed(1)}% IQD</span>
                <span style="font-size: 0.7rem; opacity: 0.75; font-family: var(--font-english); font-weight: normal;">${funderPrincipalIQD.toLocaleString()} IQD</span>
              </div>
              <div style="color: var(--color-success); display: flex; flex-direction: column; align-items: flex-end;">
                <span style="font-family: var(--font-english);">${fundingUSDPercent.toFixed(1)}% USD</span>
                <span style="font-size: 0.7rem; opacity: 0.75; font-family: var(--font-english); font-weight: normal;">$${funderPrincipalUSD.toLocaleString()} USD</span>
              </div>
            </div>
          </div>
          
          <div class="currency-bar-rec">
            <strong>${isAr ? 'توصية الخبير المالي:' : 'Advisor Recommendation:'}</strong>
            ${isAr ? fundingRecommendationAr : fundingRecommendationEn}
          </div>
        </div>

        <!-- 2. Operator Contracts Card -->
        <div class="currency-ratio-card">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem; display: flex; align-items: center; gap: 6px;">
                <i data-lucide="arrow-up-right" style="color: var(--color-danger); width: 16px; height: 16px;"></i>
                ${isAr ? 'عقود التشغيل (المشغلين)' : 'Operator Contracts (Operators)'}
              </span>
              <span class="badge badge-gold" style="font-family: var(--font-english); font-size: 0.65rem;">${isAr ? 'التشغيل' : 'Deployment'}</span>
            </div>
            
            <div class="currency-bar-track" style="background: linear-gradient(90deg, var(--color-gold) 0%, var(--color-gold) ${operatorIQDPercent}%, var(--color-success) ${operatorIQDPercent}%, var(--color-success) 100%);">
              <div class="currency-bar-split" style="left: ${operatorIQDPercent}%;"></div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; font-weight: 600; margin-bottom: 5px;">
              <div style="color: var(--color-gold); display: flex; flex-direction: column;">
                <span style="font-family: var(--font-english);">${operatorIQDPercent.toFixed(1)}% IQD</span>
                <span style="font-size: 0.7rem; opacity: 0.75; font-family: var(--font-english); font-weight: normal;">${operatorPrincipalIQD.toLocaleString()} IQD</span>
              </div>
              <div style="color: var(--color-success); display: flex; flex-direction: column; align-items: flex-end;">
                <span style="font-family: var(--font-english);">${operatorUSDPercent.toFixed(1)}% USD</span>
                <span style="font-size: 0.7rem; opacity: 0.75; font-family: var(--font-english); font-weight: normal;">$${operatorPrincipalUSD.toLocaleString()} USD</span>
              </div>
            </div>
          </div>
          
          <div class="currency-bar-rec">
            <strong>${isAr ? 'توصية الخبير المالي:' : 'Advisor Recommendation:'}</strong>
            ${isAr ? operatorRecommendationAr : operatorRecommendationEn}
          </div>
        </div>

        <!-- 3. Outstanding Dues Card -->
        <div class="currency-ratio-card">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem; display: flex; align-items: center; gap: 6px;">
                <i data-lucide="clock" style="color: var(--color-warning); width: 16px; height: 16px;"></i>
                ${isAr ? 'المستحقات المعلقة (أرباح مستحقة)' : 'Outstanding Dues (Receivables)'}
              </span>
              <span class="badge badge-warning" style="font-family: var(--font-english); font-size: 0.65rem;">${isAr ? 'معلقة' : 'Pending'}</span>
            </div>
            
            <div class="currency-bar-track" style="background: linear-gradient(90deg, var(--color-gold) 0%, var(--color-gold) ${duesIQDPercent}%, var(--color-success) ${duesIQDPercent}%, var(--color-success) 100%);">
              <div class="currency-bar-split" style="left: ${duesIQDPercent}%;"></div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; font-weight: 600; margin-bottom: 5px;">
              <div style="color: var(--color-gold); display: flex; flex-direction: column;">
                <span style="font-family: var(--font-english);">${duesIQDPercent.toFixed(1)}% IQD</span>
                <span style="font-size: 0.7rem; opacity: 0.75; font-family: var(--font-english); font-weight: normal;">${duesIQD.toLocaleString()} IQD</span>
              </div>
              <div style="color: var(--color-success); display: flex; flex-direction: column; align-items: flex-end;">
                <span style="font-family: var(--font-english);">${duesUSDPercent.toFixed(1)}% USD</span>
                <span style="font-size: 0.7rem; opacity: 0.75; font-family: var(--font-english); font-weight: normal;">$${duesUSD.toLocaleString()} USD</span>
              </div>
            </div>
          </div>
          
          <div class="currency-bar-rec">
            <strong>${isAr ? 'توصية الخبير المالي:' : 'Advisor Recommendation:'}</strong>
            ${isAr ? duesRecommendationAr : duesRecommendationEn}
          </div>
        </div>

        <!-- 4. Settled Payments Card -->
        <div class="currency-ratio-card">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem; display: flex; align-items: center; gap: 6px;">
                <i data-lucide="check-circle" style="color: var(--color-success); width: 16px; height: 16px;"></i>
                ${isAr ? 'المدفوعات التاريخية (المسددة)' : 'Settled Payments (Historical)'}
              </span>
              <span class="badge badge-success" style="font-family: var(--font-english); font-size: 0.65rem;">${isAr ? 'مسددة' : 'Settled'}</span>
            </div>
            
            <div class="currency-bar-track" style="background: linear-gradient(90deg, var(--color-gold) 0%, var(--color-gold) ${paymentsIQDPercent}%, var(--color-success) ${paymentsIQDPercent}%, var(--color-success) 100%);">
              <div class="currency-bar-split" style="left: ${paymentsIQDPercent}%;"></div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; font-weight: 600; margin-bottom: 5px;">
              <div style="color: var(--color-gold); display: flex; flex-direction: column;">
                <span style="font-family: var(--font-english);">${paymentsIQDPercent.toFixed(1)}% IQD</span>
                <span style="font-size: 0.7rem; opacity: 0.75; font-family: var(--font-english); font-weight: normal;">${paymentsIQD.toLocaleString()} IQD</span>
              </div>
              <div style="color: var(--color-success); display: flex; flex-direction: column; align-items: flex-end;">
                <span style="font-family: var(--font-english);">${paymentsUSDPercent.toFixed(1)}% USD</span>
                <span style="font-size: 0.7rem; opacity: 0.75; font-family: var(--font-english); font-weight: normal;">$${paymentsUSD.toLocaleString()} USD</span>
              </div>
            </div>
          </div>
          
          <div class="currency-bar-rec">
            <strong>${isAr ? 'توصية الخبير المالي:' : 'Advisor Recommendation:'}</strong>
            ${isAr ? paymentsRecommendationAr : paymentsRecommendationEn}
          </div>
        </div>
      </div>
    </div>
  `;

  // USD Principal Balance recommendation
  let usdBalanceAdviceAr = '';
  let usdBalanceAdviceEn = '';
  
  if (operatorPrincipalUSD < funderPrincipalUSD) {
    usdBalanceAdviceAr = `فائض تمويل بالدولار غير مغطى تشغيلياً بقيمة <strong>$${(funderPrincipalUSD - operatorPrincipalUSD).toLocaleString()} USD</strong>. يُنصح بإبرام <strong>عقود مشغلين جديدة بالدولار الأمريكي (USD)</strong>.`;
    usdBalanceAdviceEn = `Surplus USD funding of <strong>$${(funderPrincipalUSD - operatorPrincipalUSD).toLocaleString()} USD</strong> is unallocated. We recommend new <strong>USD Operator contracts</strong>.`;
  } else if (operatorPrincipalUSD > funderPrincipalUSD) {
    usdBalanceAdviceAr = `التزامات تشغيل الدولار تفوق التمويل المتوفر بقيمة <strong>$${(operatorPrincipalUSD - funderPrincipalUSD).toLocaleString()} USD</strong>. يُنصح بجذب <strong>عقود ممولين جديدة بالدولار الأمريكي (USD)</strong>.`;
    usdBalanceAdviceEn = `USD operator deployments exceed funder capital by <strong>$${(operatorPrincipalUSD - funderPrincipalUSD).toLocaleString()} USD</strong>. We recommend onboarding <strong>USD Funder contracts</strong>.`;
  } else {
    usdBalanceAdviceAr = `رأس مال الدولار متوازن تماماً بين الممولين والمشغلين.`;
    usdBalanceAdviceEn = `USD capital is perfectly balanced between funders and operators.`;
  }

  // IQD Principal Balance recommendation
  let iqdBalanceAdviceAr = '';
  let iqdBalanceAdviceEn = '';
  
  if (operatorPrincipalIQD < funderPrincipalIQD) {
    iqdBalanceAdviceAr = `فائض تمويل بالدينار غير مغطى تشغيلياً بقيمة <strong>${(funderPrincipalIQD - operatorPrincipalIQD).toLocaleString()} IQD</strong>. يُنصح بإبرام <strong>عقود مشغلين جديدة بالدينار العراقي (IQD)</strong>.`;
    iqdBalanceAdviceEn = `Surplus IQD funding of <strong>${(funderPrincipalIQD - operatorPrincipalIQD).toLocaleString()} IQD</strong> is unallocated. We recommend new <strong>IQD Operator contracts</strong>.`;
  } else if (operatorPrincipalIQD > funderPrincipalIQD) {
    iqdBalanceAdviceAr = `التزامات تشغيل الدينار تفوق التمويل المتوفر بقيمة <strong>${(operatorPrincipalIQD - funderPrincipalIQD).toLocaleString()} IQD</strong>. يُنصح بجذب <strong>عقود ممولين جديدة بالدينار العراقي (IQD)</strong>.`;
    iqdBalanceAdviceEn = `IQD operator deployments exceed funder capital by <strong>${(operatorPrincipalIQD - funderPrincipalIQD).toLocaleString()} IQD</strong>. We recommend onboarding <strong>IQD Funder contracts</strong>.`;
  } else {
    iqdBalanceAdviceAr = `رأس مال الدينار متوازن تماماً بين الممولين والمشغلين.`;
    iqdBalanceAdviceEn = `IQD capital is perfectly balanced between funders and operators.`;
  }

  // FX Arbitrage Recommendation based on market rate
  let fxRecommendationAr = '';
  let fxRecommendationEn = '';
  
  if (marketRateIQD > 1460) {
    fxRecommendationAr = `سعر صرف السوق الحالي مرتفع (الدولار قوي: <strong>1 USD = ${marketRateIQD} IQD</strong>). هذا هو الوقت الأمثل لجذب <strong>عقود تمويل (ممولين) بالدولار الأمريكي (USD) وعوائد بالدينار العراقي (IQD)</strong> لتأمين عوائد مرتفعة، وبالمقابل يُنصح بصياغة <strong>عقود تشغيل (مشغلين) بالدينار العراقي (IQD) وعوائد بالدولار (USD)</strong> لتأمين أرباح فروقات صرف عكسية عالية للمنصة عند التصفية.`;
    fxRecommendationEn = `The current market rate is high (strong USD: <strong>1 USD = ${marketRateIQD} IQD</strong>). This is the optimal time to onboard <strong>USD Funders with IQD returns</strong> to lock in high yields, and establish <strong>IQD Operators with USD returns</strong> to capture maximum inverse arbitrage margins for the platform.`;
  } else {
    fxRecommendationAr = `سعر صرف السوق الحالي منخفض أو مستقر (الدينار قوي: <strong>1 USD = ${marketRateIQD} IQD</strong>). يُنصح بالتحوط عن طريق إبرام <strong>عقود تمويل (ممولين) بالدينار العراقي (IQD) مع عوائد بالدولار (USD)</strong> لحفظ القيمة، وبالمقابل صياغة <strong>عقود تشغيل (مشغلين) بالدولار الأمريكي (USD) مع عوائد بالدينار العراقي (IQD)</strong> للاستفادة من صعود الصرف المتوقع لاحقاً.`;
    fxRecommendationEn = `The current market rate is low or stable (strong IQD: <strong>1 USD = ${marketRateIQD} IQD</strong>). It is advised to hedge by onboarding <strong>IQD Funders with USD returns</strong>, and deploying <strong>USD Operators with IQD returns</strong> to benefit from anticipated exchange rate movements.`;
  }

  // Generate professional advisor recommendations
  let principalAnalysisAr = '';
  let principalAnalysisEn = '';
  let principalRecommendationAr = '';
  let principalRecommendationEn = '';
  let principalStatusColor = ''; // css color
  let principalStatusIcon = ''; // lucide icon name
  
  if (funderUSD === 0 && operatorUSD === 0) {
    principalStatusColor = 'var(--text-secondary)';
    principalStatusIcon = 'info';
    principalAnalysisAr = 'لا توجد عقود نشطة حالياً لإجراء تحليل لمطابقة رأس المال الأساسي.';
    principalAnalysisEn = 'No active contracts currently available to run a principal capital matching analysis.';
    principalRecommendationAr = 'يرجى تسجيل عقود ممولين ومشغلين لتوليد توصيات التحوط الخاصة بالسيولة.';
    principalRecommendationEn = 'Please register active funder and operator contracts to generate custom liquidity hedging recommendations.';
  } else if (usdPrincipalRatio < 90) {
    principalStatusColor = 'var(--color-warning)';
    principalStatusIcon = 'alert-triangle';
    principalAnalysisAr = `<strong>انكشاف السيولة المعطلة (Dormant Cash):</strong> نسبة تشغيل رأس المال الممول بلغت <strong>${usdPrincipalRatio.toFixed(1)}%</strong> فقط. تم توجيه رأس مال نشط قدره <strong>$${operatorUSD.toLocaleString(undefined, {maximumFractionDigits:0})} USD</strong> للمشغلين من إجمالي <strong>$${funderUSD.toLocaleString(undefined, {maximumFractionDigits:0})} USD</strong> مستلمة من الممولين. هذا يعني وجود سيولة نقدية كبيرة راكدة في الخزينة لا تحقق عوائد.`;
    principalAnalysisEn = `<strong>Dormant Cash Exposure:</strong> The capital utilization ratio stands at only <strong>${usdPrincipalRatio.toFixed(1)}%</strong>. Active deployed operator capital is <strong>$${operatorUSD.toLocaleString(undefined, {maximumFractionDigits:0})} USD</strong> out of <strong>$${funderUSD.toLocaleString(undefined, {maximumFractionDigits:0})} USD</strong> in total funder commitments, pointing to high idle treasury cash.`;
    principalRecommendationAr = `<strong>خطوات التحوط المقترحة:</strong> يُنصح بتسريع تغطية الفرص المتاحة وجلب مشغلين نشطين إضافيين لتشغيل النقد الفائض، أو تعليق قبول اشتراكات تمويلية جديدة مؤقتاً لتجنب تكلفة الفرصة الضائعة التي تقلل عوائد المنصة الكلية.`;
    principalRecommendationEn = `<strong>Actionable Hedging Steps:</strong> We advise accelerating mudarabah allocations to new active operators to deploy idle cash. Alternatively, temporarily pause accepting new funder capital to avoid diluting overall platform yields.`;
  } else if (usdPrincipalRatio > 105) {
    principalStatusColor = 'var(--color-danger)';
    principalStatusIcon = 'alert-octagon';
    principalAnalysisAr = `<strong>مخاطرة تجاوز الحدود المعتمدة (Principal Over-Allocation):</strong> إجمالي التمويل النشط للمشغلين البالغ <strong>$${operatorUSD.toLocaleString(undefined, {maximumFractionDigits:0})} USD</strong> يفوق رأس مال الممولين البالغ <strong>$${funderUSD.toLocaleString(undefined, {maximumFractionDigits:0})} USD</strong> بنسبة <strong>${usdPrincipalRatio.toFixed(1)}%</strong>. هذا الفارق يتم تمويله حالياً من السيولة الخاصة بالمنصة أو عبر رافعة مالية طارئة.`;
    principalAnalysisEn = `<strong>Principal Over-Allocation:</strong> Operator capital deployments total <strong>$${operatorUSD.toLocaleString(undefined, {maximumFractionDigits:0})} USD</strong>, which exceeds funder commitments of <strong>$${funderUSD.toLocaleString(undefined, {maximumFractionDigits:0})} USD</strong> by <strong>${usdPrincipalRatio.toFixed(1)}%</strong>. The platform is self-funding this difference.`;
    principalRecommendationAr = `<strong>خطوات التحوط المقترحة:</strong> يجب إطلاق جولات استثمارية عاجلة لجذب ممولين جدد لتمويل هذا العجز لتجنب تجميد أموال المنصة التشغيلية، ومواءمة التدفقات للحد من أخطار طلبات التصفية المفاجئة للمشغلين.`;
    principalRecommendationEn = `<strong>Actionable Hedging Steps:</strong> We recommend launching immediate fundraising campaigns to attract new funder capital. This replaces platform-funded capital with external funder liabilities, safeguarding platform liquidity.`;
  } else {
    principalStatusColor = 'var(--color-success)';
    principalStatusIcon = 'check-circle';
    principalAnalysisAr = `<strong>تطابق هيكلي مثالي:</strong> نسبة تشغيل النقد بلغت <strong>${usdPrincipalRatio.toFixed(1)}%</strong> وهي في النطاق النموذجي الآمن. يوجد موازنة تامة بين الالتزامات المستلمة ومصارف تشغيلها، مما يمنع تعطل السيولة ويحافظ على استدامة العوائد.`;
    principalAnalysisEn = `<strong>Optimal Principal Alignment:</strong> The capital utilization ratio is at a healthy <strong>${usdPrincipalRatio.toFixed(1)}%</strong>. Received capital is closely matched with active operator deployments, minimizing yield drag and keeping operations optimized.`;
    principalRecommendationAr = `<strong>خطوات التحوط المقترحة:</strong> الاستمرار في السياسة الحالية مع المحافظة على هامش سيولة احتياطية بمعدل 5% لمواجهة أي طلبات تصفية طارئة دون التسبب في خلل بالتدفقات التشغيلية.`;
    principalRecommendationEn = `<strong>Actionable Hedging Steps:</strong> Maintain the current deployment run-rate. Keep a 5% liquid cash reserve on standby to settle emergency contract redemptions without disrupting ongoing operations.`;
  }
  
  let iqdStatusColor = '';
  let iqdStatusIcon = '';
  let iqdAnalysisAr = '';
  let iqdAnalysisEn = '';
  let iqdRecommendationAr = '';
  let iqdRecommendationEn = '';
  
  if (funderMonthlyReturnsIQD === 0 && operatorMonthlyReturnsIQD === 0) {
    iqdStatusColor = 'var(--text-secondary)';
    iqdStatusIcon = 'info';
    iqdAnalysisAr = 'لا توجد دفعات أرباح نشطة حالياً لإجراء تحليل التحوط النقدي للدينار.';
    iqdAnalysisEn = 'No active dividend payments currently available to analyze currency exchange hedging.';
    iqdRecommendationAr = 'يرجى تسجيل وتفعيل العقود الاستثمارية لتفعيل مؤشرات التحوط النقدي.';
    iqdRecommendationEn = 'Please record and activate contracts to trigger real-time exchange rate hedging indices.';
  } else if (iqdHedgingRatio < 95) {
    iqdStatusColor = 'var(--color-danger)';
    iqdStatusIcon = 'alert-octagon';
    iqdAnalysisAr = `<strong>عجز صرف الدينار العراقي (FX Deficit Exposure):</strong> عوائد الدينار الواردة من المشغلين <strong>(${operatorMonthlyReturnsIQD.toLocaleString(undefined, {maximumFractionDigits:0})} IQD)</strong> تغطي فقط <strong>${iqdHedgingRatio.toFixed(1)}%</strong> من التزامات توزيع الأرباح للممولين <strong>(${funderMonthlyReturnsIQD.toLocaleString(undefined, {maximumFractionDigits:0})} IQD)</strong>. المنصة مضطرة لشراء الدينار شهرياً بسعر الصرف الموازي لتسديد عجز الممولين، مما يعرضها لمخاطر خسائر فروق الصرف الكبيرة.`;
    iqdAnalysisEn = `<strong>FX Deficit Exposure:</strong> Incoming returns in IQD from operators <strong>(${operatorMonthlyReturnsIQD.toLocaleString(undefined, {maximumFractionDigits:0})} IQD)</strong> cover only <strong>${iqdHedgingRatio.toFixed(1)}%</strong> of monthly payouts to funders <strong>(${funderMonthlyReturnsIQD.toLocaleString(undefined, {maximumFractionDigits:0})} IQD)</strong>. This forces the platform to purchase IQD from the open market, risking exchange losses.`;
    iqdRecommendationAr = `<strong>خطوات التحوط المقترحة:</strong> يُنصح بتعديل شروط عقود المشغلين الجدد لزيادة الدفعات النقدية بالدينار، أو الاتفاق مع بعض الممولين الكبار لتحويل استلام عوائدهم إلى الدولار بدلاً من الدينار، لتقليص الانكشاف الصرفي الفوري.`;
    iqdRecommendationEn = `<strong>Actionable Hedging Steps:</strong> We strongly advise structuring future operator contracts with higher IQD returns, or negotiating with key funders to transition their monthly payouts to USD to shrink the net currency deficit.`;
  } else if (iqdHedgingRatio > 105) {
    iqdStatusColor = 'var(--color-success)';
    iqdStatusIcon = 'check-circle';
    iqdAnalysisAr = `<strong>فائض تدفقات الدينار العراقي (IQD Cashflow Surplus):</strong> عوائد الدينار الواردة من المشغلين تفوق متطلبات الصرف للممولين بنسبة بلغت <strong>${iqdHedgingRatio.toFixed(1)}%</strong> (صافي فائض بقيمة <strong>${(operatorMonthlyReturnsIQD - funderMonthlyReturnsIQD).toLocaleString(undefined, {maximumFractionDigits:0})} IQD</strong> شهرياً). هذا يمنح المنصة حماية ومصداً كبيراً ضد تذبذبات السوق.`;
    iqdAnalysisEn = `<strong>IQD Cashflow Surplus:</strong> Incoming IQD returns exceed funder liabilities by <strong>${iqdHedgingRatio.toFixed(1)}%</strong> (net surplus of <strong>${(operatorMonthlyReturnsIQD - funderMonthlyReturnsIQD).toLocaleString(undefined, {maximumFractionDigits:0})} IQD</strong>). This creates an excellent buffer against local currency fluctuations.`;
    iqdRecommendationAr = `<strong>خطوات التحوط المقترحة:</strong> يُنصح بشدة بتحويل الفائض الشهري من الدينار العراقي فوراً إلى دولار أمريكي لحماية القيمة الشرائية وحفظ المكاسب من مخاطر التضخم وانخفاض قيمة العملة المحلية.`;
    iqdRecommendationEn = `<strong>Actionable Hedging Steps:</strong> We recommend converting the excess monthly IQD returns into USD assets immediately at prevailing rates to protect accumulated reserves from purchasing power erosion or local currency depreciation.`;
  } else {
    iqdStatusColor = 'var(--color-success)';
    iqdStatusIcon = 'check-circle';
    iqdAnalysisAr = `<strong>تحوط نقدي متوازن:</strong> نسبة تحوط التدفقات الشهرية تبلغ <strong>${iqdHedgingRatio.toFixed(1)}%</strong> وهي نسبة ممتازة ومثالية. التدفقات الخارجة والداخلة بالدينار متطابقة مما يقلل تماماً الحاجة لشراء أو بيع العملة من السوق الموازي ويحقق استقراراً صرفياً شاملاً للمنصة.`;
    iqdAnalysisEn = `<strong>Balanced Currency Hedging:</strong> Monthly cashflow hedging stands at <strong>${iqdHedgingRatio.toFixed(1)}%</strong>. This indicates an optimal match where incoming IQD returns offset outgoing funder distributions perfectly, neutralizing FX volatility.`;
    iqdRecommendationAr = `<strong>خطوات التحوط المقترحة:</strong> الاستمرار في السياسة التشغيلية المتوازنة الحالية ومراقبة سعر الصرف الموازي عن كثب للكشف المبكر عن أي انحرافات تدعو لتحديث نسب التحوط.`;
    iqdRecommendationEn = `<strong>Actionable Hedging Steps:</strong> Continue current operations. Regularly track official and parallel exchange rate indices to detect any emerging deviations early.`;
  }

  const generateRows = (list, emptyMsg) => {
    if (list.length === 0) {
      return `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-secondary); padding: 30px;">
            <div style="font-size: 1.5rem; margin-bottom: 8px; opacity: 0.5;">
              <i data-lucide="info"></i>
            </div>
            <div>${emptyMsg}</div>
          </td>
        </tr>
      `;
    }
    
    return list.map(c => {
      const isFunder = c.type === 'creditor';
      const contractRate = c.customExchangeRate || 1.0;
      const currentRate = (c.returnCurrency === 'IQD' || c.principalCurrency === 'IQD')
        ? (state.exchangeRates['IQD'] || 1450.0)
        : 1.0;
        
      const analysis = calculateRedemptionProfit(c);
      const profitUSD = analysis.profitUSD;
      const profit = analysis.profit;
      
      const isProfit = profitUSD > 0.01;
      const profitColor = isProfit ? 'var(--color-success)' : 'var(--color-danger)';
      const profitSign = isProfit ? '+' : '';
      
      const profitText = `${profitSign}${profit.toLocaleString(undefined, {maximumFractionDigits: 2})} ${formatCurrencyName(c.principalCurrency)} (${profitSign}$${profitUSD.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USD)`;
      
      let recText = '';
      let badgeClass = '';
      let recIcon = '';
      
      if (isProfit) {
        recText = isFunder
          ? (isAr ? 'ينصح بالإعادة الآن (أرباح صرف)' : 'Return capital now (arbitrage gain)')
          : (isAr ? 'ينصح بالاسترداد الآن (أرباح صرف)' : 'Recover capital now (arbitrage gain)');
        badgeClass = 'badge-success';
        recIcon = 'check-circle';
      } else {
        recText = isAr 
          ? 'ينصح بالانتظار (تجنب تصفية الخسارة)' 
          : 'Keep active (avoid arbitrage loss)';
        badgeClass = 'badge-warning';
        recIcon = 'alert-circle';
      }
      
      return `
        <tr>
          <td style="font-weight: 700; color: var(--text-primary);">${c.partyName}</td>
          <td style="font-family: var(--font-english); font-weight: 600;">
            ${c.principal.toLocaleString()} ${formatCurrencyName(c.principalCurrency)}
          </td>
          <td style="font-family: var(--font-english);">
            1 USD = ${contractRate.toLocaleString()} ${c.returnCurrency === 'USD' ? c.principalCurrency : c.returnCurrency}
          </td>
          <td style="font-family: var(--font-english);">
            1 USD = ${currentRate.toLocaleString()} ${c.returnCurrency === 'USD' ? c.principalCurrency : c.returnCurrency}
          </td>
          <td style="font-family: var(--font-english); font-weight: 600; color: var(--color-gold);">
            ${analysis.returnAmount.toLocaleString(undefined, {maximumFractionDigits: 2})} ${formatCurrencyName(c.returnCurrency)}
          </td>
          <td style="font-family: var(--font-english); font-weight: bold; color: ${profitColor};">
            ${profitText}
          </td>
          <td>
            <span class="badge ${badgeClass}" style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px;">
              <i data-lucide="${recIcon}" style="width: 12px; height: 12px;"></i>
              <span>${recText}</span>
            </span>
          </td>
        </tr>
      `;
    }).join('');
  };
  
  const headersHtml = `
    <thead>
      <tr>
        <th>${isAr ? 'الطرف الثاني' : 'Counterparty'}</th>
        <th>${isAr ? 'رأس المال الأساسي' : 'Starting Principal'}</th>
        <th>${isAr ? 'سعر صرف التعاقع' : 'Contract Rate'}</th>
        <th>${isAr ? 'سعر الصرف الحالي' : 'Current Market Rate'}</th>
        <th>${isAr ? 'مبلغ التصفية (عكسي)' : 'Redemption Payoff'}</th>
        <th>${isAr ? 'صافي الربح/الخسارة التقريبي' : 'Approx. Net Profit'}</th>
        <th>${isAr ? 'التوصية' : 'Recommendation'}</th>
      </tr>
    </thead>
  `;

  return `
    <div class="analysis-view" style="animation: fadeIn 0.3s ease-in-out;">
      
      ${currencyDistributionHTML}
      
      <!-- Currency Exposure & Hedging Dashboard -->
      <div class="dashboard-grid" style="margin-bottom: 25px; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
        
        <!-- Card 1: Profitable Liquidations -->
        <div class="premium-card stat-card info" style="background: linear-gradient(135deg, rgba(6, 78, 59, 0.15) 0%, rgba(5, 150, 105, 0.02) 100%); border-color: rgba(5, 150, 105, 0.2); height: auto;">
          <div class="stat-header" style="margin-bottom: 12px;">
            <span class="stat-title" style="font-weight: 600; color: var(--text-primary);">${isAr ? 'تصفية العقود الرابحة' : 'Profitable Arbitrage Liquidations'}</span>
            <div class="stat-icon"><i data-lucide="trending-up" style="color: var(--color-success)"></i></div>
          </div>
          <div class="stat-body">
            <div class="stat-value" style="font-size: 1.8rem; color: var(--color-success); font-family: var(--font-english); font-weight: 800; line-height: 1;">
              ${activeContracts.filter(c => calculateRedemptionProfit(c).profitUSD > 0.01).length}
            </div>
            <div style="color: var(--text-secondary); font-size: 0.75rem; margin-top: 8px;">
              ${isAr ? 'عدد العقود التي تحقق أرباح فروقات صرف حالياً عند التصفية العكسية' : 'Active contracts yielding positive currency redemption arbitrage'}
            </div>
          </div>
        </div>

        <!-- Card 2: USD Principal Matching Ratio -->
        <div class="premium-card stat-card" style="background: linear-gradient(135deg, rgba(139, 90, 43, 0.1) 0%, rgba(139, 90, 43, 0.02) 100%); border-color: var(--color-gold-glow); height: auto;">
          <div class="stat-header" style="margin-bottom: 12px;">
            <span class="stat-title" style="font-weight: 600; color: var(--text-primary);">${isAr ? 'تطابق رأس المال الأساسي (USD)' : 'USD Principal Match'}</span>
            <div class="stat-icon"><i data-lucide="coins" style="color: var(--color-gold)"></i></div>
          </div>
          <div class="stat-body">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <div class="stat-value" style="font-size: 1.8rem; color: var(--color-gold); font-family: var(--font-english); font-weight: 800; line-height: 1;">
                ${usdPrincipalRatio.toFixed(1)}%
              </div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); font-family: var(--font-english);">
                $${operatorUSD.toLocaleString(undefined, {maximumFractionDigits:0})} / $${funderUSD.toLocaleString(undefined, {maximumFractionDigits:0})}
              </div>
            </div>
            <div style="background: rgba(255,255,255,0.05); border-radius: 4px; height: 6px; margin-top: 10px; overflow: hidden; border: 1px solid var(--border-color);">
              <div style="background: linear-gradient(90deg, var(--color-gold) 0%, ${usdPrincipalRatio > 105 ? 'var(--color-danger)' : (usdPrincipalRatio < 90 ? 'var(--color-warning)' : 'var(--color-success)')} 100%); width: ${Math.min(usdPrincipalRatio, 100)}%; height: 100%; border-radius: 4px;"></div>
            </div>
            <div style="color: var(--text-secondary); font-size: 0.75rem; margin-top: 8px;">
              ${isAr ? 'رأس مال المشغلين مقارنةً بالممولين النشطين بالدولار' : 'Ratio of active deployed operator USD to received funder USD'}
            </div>
          </div>
        </div>

        <!-- Card 3: IQD Cashflow Hedging Ratio -->
        <div class="premium-card stat-card" style="background: linear-gradient(135deg, rgba(5, 150, 105, 0.1) 0%, rgba(5, 150, 105, 0.02) 100%); border-color: rgba(5, 150, 105, 0.15); height: auto;">
          <div class="stat-header" style="margin-bottom: 12px;">
            <span class="stat-title" style="font-weight: 600; color: var(--text-primary);">${isAr ? 'تحوط عوائد الدينار (IQD)' : 'IQD Return Cashflow Hedging'}</span>
            <div class="stat-icon"><i data-lucide="shield-check" style="color: var(--color-success)"></i></div>
          </div>
          <div class="stat-body">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <div class="stat-value" style="font-size: 1.8rem; color: var(--color-success); font-family: var(--font-english); font-weight: 800; line-height: 1;">
                ${iqdHedgingRatio.toFixed(1)}%
              </div>
              <div style="font-size: 0.75rem; color: var(--text-secondary); font-family: var(--font-english);">
                ${(operatorMonthlyReturnsIQD/1000).toLocaleString(undefined, {maximumFractionDigits:0})}k / ${(funderMonthlyReturnsIQD/1000).toLocaleString(undefined, {maximumFractionDigits:0})}k
              </div>
            </div>
            <div style="background: rgba(255,255,255,0.05); border-radius: 4px; height: 6px; margin-top: 10px; overflow: hidden; border: 1px solid var(--border-color);">
              <div style="background: linear-gradient(90deg, var(--color-gold) 0%, ${iqdHedgingRatio < 95 ? 'var(--color-danger)' : 'var(--color-success)'} 100%); width: ${Math.min(iqdHedgingRatio, 100)}%; height: 100%; border-radius: 4px;"></div>
            </div>
            <div style="color: var(--text-secondary); font-size: 0.75rem; margin-top: 8px;">
              ${isAr ? 'عائد المشغلين الوارد مقابل التزامات الممولين بالدينار' : 'Incoming operator returns vs outgoing funder liabilities in IQD'}
            </div>
          </div>
        </div>

      </div>

      <!-- Professional Advisory Report -->
      <div class="premium-card" style="margin-bottom: 25px; border: 1px dashed var(--color-gold); background: rgba(139, 90, 43, 0.03); box-shadow: 0 4px 20px rgba(139, 90, 43, 0.05);">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px; border-bottom: 1px solid rgba(139, 90, 43, 0.15); padding-bottom: 10px;">
          <i data-lucide="briefcase" style="color: var(--color-gold); width: 20px; height: 20px;"></i>
          <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--color-gold); margin: 0; display: flex; align-items: center; gap: 8px; justify-content: space-between; width: 100%;">
            <span>${isAr ? 'تقرير استشاري مالي متخصص: انكشاف العملات والتحوط' : 'Professional Advisory Report: FX Exposure & Hedging'}</span>
            <span style="font-size: 0.75rem; font-weight: 400; opacity: 0.8; font-family: var(--font-english); border: 1px solid var(--color-gold); padding: 2px 6px; border-radius: 4px;">OFFICIAL REPORT</span>
          </h3>
        </div>
        
        <div class="advisory-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          <!-- USD Principal Alignment -->
          <div style="padding: 10px; border-inline-start: 3px solid ${principalStatusColor}; background: rgba(255,255,255,0.01); border-radius: 0 4px 4px 0;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <i data-lucide="${principalStatusIcon}" style="color: ${principalStatusColor}; width: 16px; height: 16px;"></i>
              <span style="font-weight: 700; color: var(--text-primary); font-size: 0.9rem;">
                ${isAr ? 'محاذاة رأس المال بالدولار (USD Principal)' : 'USD Principal Capital Alignment'}
              </span>
            </div>
            <div style="font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary); margin-bottom: 8px;">
              ${isAr ? principalAnalysisAr : principalAnalysisEn}
            </div>
            <div style="font-size: 0.85rem; line-height: 1.5; color: var(--text-primary); font-weight: 600; border-top: 1px solid var(--border-color); padding-top: 6px;">
              <span style="color: var(--color-gold);">${isAr ? 'توجيه التحوط:' : 'Hedging Action:'}</span>
              ${isAr ? principalRecommendationAr : principalRecommendationEn}
            </div>
          </div>
          
          <!-- IQD Return Cashflow Hedging -->
          <div style="padding: 10px; border-inline-start: 3px solid ${iqdStatusColor}; background: rgba(255,255,255,0.01); border-radius: 0 4px 4px 0;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <i data-lucide="${iqdStatusIcon}" style="color: ${iqdStatusColor}; width: 16px; height: 16px;"></i>
              <span style="font-weight: 700; color: var(--text-primary); font-size: 0.9rem;">
                ${isAr ? 'تحوط تدفقات عوائد الدينار (IQD Cashflow)' : 'IQD Cashflow Return Hedging'}
              </span>
            </div>
            <div style="font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary); margin-bottom: 8px;">
              ${isAr ? iqdAnalysisAr : iqdAnalysisEn}
            </div>
            <div style="font-size: 0.85rem; line-height: 1.5; color: var(--text-primary); font-weight: 600; border-top: 1px solid var(--border-color); padding-top: 6px;">
              <span style="color: var(--color-gold);">${isAr ? 'توجيه التحوط:' : 'Hedging Action:'}</span>
              ${isAr ? iqdRecommendationAr : iqdRecommendationEn}
            </div>
          </div>
        </div>

        <!-- FX Strategy & Contract Allocator Section -->
        <div style="margin-top: 20px; border-top: 1px solid rgba(139, 90, 43, 0.15); padding-top: 15px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
            <i data-lucide="shuffle" style="color: var(--color-gold); width: 18px; height: 18px;"></i>
            <span style="font-weight: 700; color: var(--color-gold); font-size: 0.95rem;">
              ${isAr ? 'توجيهات العملة والتعاقدات المثلى (FX & Contract Allocator)' : 'Optimal Currency Allocation & Contract Structuring'}
            </span>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px;">
            <!-- Asset Balance Status Card -->
            <div style="background: rgba(255,255,255,0.01); padding: 12px; border-radius: 4px; border: 1px solid var(--border-color); display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="font-weight: 600; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
                  <span>${isAr ? 'توازن أصول العملات للمحفظة' : 'Portfolio Currency Asset Balances'}</span>
                  <span class="badge badge-secondary" style="font-family: var(--font-english); font-size: 0.65rem; padding: 2px 4px;">BALANCES</span>
                </div>
                <ul style="margin: 0; padding-inline-start: 15px; font-size: 0.8rem; line-height: 1.5; color: var(--text-secondary);">
                  <li style="margin-bottom: 6px;">${usdBalanceAdviceAr ? (isAr ? usdBalanceAdviceAr : usdBalanceAdviceEn) : ''}</li>
                  <li>${iqdBalanceAdviceAr ? (isAr ? iqdBalanceAdviceAr : iqdBalanceAdviceEn) : ''}</li>
                </ul>
              </div>
            </div>
            
            <!-- FX Strategy Advice Card -->
            <div style="background: rgba(255,255,255,0.01); padding: 12px; border-radius: 4px; border: 1px solid var(--border-color); display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="font-weight: 600; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
                  <span>${isAr ? 'استراتيجية صياغة العقود حسب السوق' : 'Market-Driven FX Contract Strategy'}</span>
                  <span class="badge badge-gold" style="font-family: var(--font-english); font-size: 0.65rem; padding: 2px 4px;">FX STRATEGY</span>
                </div>
                <div style="font-size: 0.8rem; line-height: 1.5; color: var(--text-secondary);">
                  ${isAr ? fxRecommendationAr : fxRecommendationEn}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Funder Contracts Section -->
      <div class="premium-card" style="margin-bottom: 25px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
          <h3 style="font-size: 1.1rem; font-weight: 700; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="arrow-down-left" style="color: var(--color-success)"></i>
            <span>${isAr ? 'تصفية عقود الممولين (دائن)' : 'Funder Contracts Redemption Analyzer'}</span>
          </h3>
          
          <div class="export-dropdown no-print">
            <button class="btn btn-secondary btn-export-toggle" style="padding: 6px 12px; font-size: 0.8rem; display: flex; align-items: center; gap: 6px;">
              <i data-lucide="download" style="width: 14px; height: 14px; color: var(--color-gold);"></i>
              <span>${isAr ? 'تصدير البيانات' : 'Export Data'}</span>
              <i data-lucide="chevron-down" style="width: 12px; height: 12px; opacity: 0.7;"></i>
            </button>
            <div class="export-dropdown-menu">
              <button class="export-menu-item btn-export-analysis-pdf" data-contract-type="creditor">
                <i data-lucide="printer" style="width: 14px; height: 14px; color: var(--color-gold);"></i>
                <span>${isAr ? 'تحميل PDF' : 'Download PDF'}</span>
              </button>
              <button class="export-menu-item btn-export-analysis-sheets" data-contract-type="creditor">
                <i data-lucide="file-spreadsheet" style="width: 14px; height: 14px; color: var(--color-success);"></i>
                <span>${isAr ? 'تصدير Sheets' : 'Export Sheets'}</span>
              </button>
            </div>
          </div>
        </div>
        
        <div class="table-container">
          <table class="premium-table">
            ${headersHtml}
            <tbody>
              ${generateRows(funderContracts, isAr ? 'لا توجد عقود ممولين نشطة حالياً لإجراء التحليل المالي.' : 'No active funder contracts for analysis.')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Operator Contracts Section -->
      <div class="premium-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
          <h3 style="font-size: 1.1rem; font-weight: 700; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="arrow-up-right" style="color: var(--color-danger)"></i>
            <span>${isAr ? 'تصفية عقود المشغلين (مدين)' : 'Operator Contracts Redemption Analyzer'}</span>
          </h3>
          
          <div class="export-dropdown no-print">
            <button class="btn btn-secondary btn-export-toggle" style="padding: 6px 12px; font-size: 0.8rem; display: flex; align-items: center; gap: 6px;">
              <i data-lucide="download" style="width: 14px; height: 14px; color: var(--color-gold);"></i>
              <span>${isAr ? 'تصدير البيانات' : 'Export Data'}</span>
              <i data-lucide="chevron-down" style="width: 12px; height: 12px; opacity: 0.7;"></i>
            </button>
            <div class="export-dropdown-menu">
              <button class="export-menu-item btn-export-analysis-pdf" data-contract-type="debtor">
                <i data-lucide="printer" style="width: 14px; height: 14px; color: var(--color-gold);"></i>
                <span>${isAr ? 'تحميل PDF' : 'Download PDF'}</span>
              </button>
              <button class="export-menu-item btn-export-analysis-sheets" data-contract-type="debtor">
                <i data-lucide="file-spreadsheet" style="width: 14px; height: 14px; color: var(--color-success);"></i>
                <span>${isAr ? 'تصدير Sheets' : 'Export Sheets'}</span>
              </button>
            </div>
          </div>
        </div>
        
        <div class="table-container">
          <table class="premium-table">
            ${headersHtml}
            <tbody>
              ${generateRows(operatorContracts, isAr ? 'لا توجد عقود مشغلين نشطة حالياً لإجراء التحليل المالي.' : 'No active operator contracts for analysis.')}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  `;
}

function renderAccountStatement(accountId) {
  const t = translations[state.activeLanguage];
  const panel = document.getElementById('ledger-statement-panel');
  if (!panel) return;
  
  panel.style.display = 'block';
  
  // Reset date filters if different accountId is loaded
  if (statementDateFilters.accountId !== accountId) {
    statementDateFilters.accountId = accountId;
    statementDateFilters.startDate = '';
    statementDateFilters.endDate = '';
  }
  
  let accountName = '';
  let txList = [];
  let contract = null;
  const isPartyView = accountId.startsWith('party:');
  let partyName = '';
  let partyContracts = [];
  let isFunder = false;
  
  if (isPartyView) {
    partyName = accountId.substring(6);
    partyContracts = state.contracts.filter(c => c.partyName.trim() === partyName.trim());
    isFunder = partyContracts.some(c => c.type === 'creditor');
    accountName = state.activeLanguage === 'ar' 
      ? `كشف الحساب الموحد للمتعامل: ${partyName}`
      : `Consolidated Account Statement for: ${partyName}`;
    
    const contractIds = partyContracts.map(c => c.id);
    txList = state.transactions.filter(t => contractIds.includes(t.contractId));
  } else if (accountId === 'platform_profits') {
    accountName = t.platformStatement;
    txList = state.transactions.filter(t => t.contractId === 'platform_profits');
  } else {
    contract = state.contracts.find(c => c.id === accountId);
    accountName = `${t.statementOf} ${contract ? contract.partyName : accountId}`;
    txList = state.transactions.filter(t => t.contractId === accountId);
  }
  
  // Sort transactions by date chronologically
  txList.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Find unpaid dues for this statement (including creditors/funders & debtors/operators)
  let unpaidDues = [];
  if (isPartyView) {
    unpaidDues = state.transactions.filter(t => {
      if (t.type !== 'dividend_due') return false;
      const cnt = state.contracts.find(c => c.id === t.contractId);
      if (!cnt || cnt.partyName.trim() !== partyName.trim()) return false;
      
      const isSettled = state.transactions.some(
        settled => settled.contractId === t.contractId && 
                   settled.period === t.period && 
                   (settled.type === 'payout' || settled.type === 'collect')
      );
      return !isSettled;
    });
  } else if (contract) {
    unpaidDues = state.transactions.filter(t => {
      if (t.type !== 'dividend_due' || t.contractId !== contract.id) return false;
      
      const isSettled = state.transactions.some(
        settled => settled.contractId === t.contractId && 
                   settled.period === t.period && 
                   (settled.type === 'payout' || settled.type === 'collect')
      );
      return !isSettled;
    });
  }
  
  let alertsHtml = '';
  if (unpaidDues.length > 0) {
    alertsHtml = `
      <div class="alerts-card no-print" style="margin-bottom: 20px;">
        <div class="alerts-header">
          <div class="alerts-icon">
            <i data-lucide="bell"></i>
          </div>
          <span class="alerts-title">${state.activeLanguage === 'ar' ? 'تنبيهات دفعات معلقة مستحقة للصرف / التحصيل' : 'Pending Settlement/Collection Alerts'}</span>
        </div>
        <div class="alerts-list">
          ${unpaidDues.map(due => {
            const isFunderDue = due.partyType === 'creditor';
            return `
              <div class="alert-item">
                <div class="alert-info">
                  <span class="alert-party" style="font-weight: 700;">${due.partyName}</span>
                  <div class="alert-details">
                    ${state.activeLanguage === 'ar' 
                      ? `${isFunderDue ? 'تنبيه تسديد (صرف):' : 'تنبيه تحصيل:'} الشهر ${due.period} | تاريخ الاستحقاق: ${due.date} | رقم العقد: ${due.contractId}` 
                      : `${isFunderDue ? 'Payout Alert:' : 'Collection Alert:'} Month ${due.period} | Due Date: ${due.date} | Contract ID: ${due.contractId}`}
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span class="alert-amount" style="color: ${isFunderDue ? 'var(--color-gold)' : 'var(--color-danger)'}; font-family: var(--font-english); font-weight: 800;">
                    ${due.amount.toLocaleString()} ${due.currency}
                  </span>
                  <button class="btn btn-primary btn-collect-alert" data-id="${due.id}" style="padding: 6px 12px; font-size: 0.8rem; border-radius: var(--radius-sm);">
                    <i data-lucide="${isFunderDue ? 'arrow-up-right' : 'check'}" style="width: 14px; height: 14px;"></i>
                    <span>${state.activeLanguage === 'ar' ? (isFunderDue ? 'تسديد الآن' : 'تحصيل الآن') : (isFunderDue ? 'Pay Now' : 'Collect Now')}</span>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // Calculate opening balance and filter txList by period
  const startDate = statementDateFilters.startDate;
  const endDate = statementDateFilters.endDate;
  
  const openingBalances = {};
  const periodTxList = [];
  
  txList.forEach(tx => {
    const isBeforeStart = startDate && tx.date < startDate;
    const isAfterEnd = endDate && tx.date > endDate;
    
    if (isBeforeStart) {
      if (tx.type === 'dividend_due' || tx.type === 'profit_posted') {
        openingBalances[tx.currency] = (openingBalances[tx.currency] || 0) + tx.amount;
      } else if (tx.type === 'payout' || tx.type === 'collect') {
        openingBalances[tx.currency] = (openingBalances[tx.currency] || 0) - tx.amount;
      }
    } else if (!isAfterEnd) {
      periodTxList.push(tx);
    }
  });

  const principalTotals = {};
  const drTotals = {};
  const crTotals = {};
  
  let totalPrincipal = 0;
  let totalDr = 0;
  let totalCr = 0;
  let principalCurrency = contract ? contract.principalCurrency : 'USD';
  let returnCurrency = contract ? contract.returnCurrency : 'IQD';
  
  const runningBalances = { ...openingBalances };
  
  periodTxList.forEach(tx => {
    if (tx.type === 'deposit' || tx.type === 'withdrawal') {
      principalTotals[tx.currency] = (principalTotals[tx.currency] || 0) + tx.amount;
      totalPrincipal += tx.amount;
      principalCurrency = tx.currency;
    } else if (tx.type === 'dividend_due' || tx.type === 'profit_posted') {
      crTotals[tx.currency] = (crTotals[tx.currency] || 0) + tx.amount;
      runningBalances[tx.currency] = (runningBalances[tx.currency] || 0) + tx.amount;
      totalCr += tx.amount;
      returnCurrency = tx.currency;
    } else if (tx.type === 'payout' || tx.type === 'collect') {
      drTotals[tx.currency] = (drTotals[tx.currency] || 0) + tx.amount;
      runningBalances[tx.currency] = (runningBalances[tx.currency] || 0) - tx.amount;
      totalDr += tx.amount;
      returnCurrency = tx.currency;
    }
  });
  
  let customFormHTML = '';
  if (isPartyView) {
    customFormHTML = `
      <div class="custom-payout-section no-print">
        <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 12px; color: var(--color-gold); display: flex; align-items: center; gap: 8px;">
          <i data-lucide="plus-circle"></i>
          ${state.activeLanguage === 'ar' ? 'تسجيل حركة صرف مخصصة (سحب / صرف مقطوع) - موحد' : 'Post Custom Consolidated Payout/Collection'}
        </h4>
        <form id="custom-payout-form" style="display: flex; gap: 15px; flex-wrap: wrap; align-items: flex-end; background-color: rgba(0, 0, 0, 0.15); border: 1px dashed var(--border-color); padding: 15px; border-radius: var(--radius-md);">
          <div class="form-group" style="flex: 1.5; min-width: 200px;">
            <label>${state.activeLanguage === 'ar' ? 'اختر العقد المستهدف للقيد' : 'Select target contract to post to'}</label>
            <select id="custom-pay-contract-id" class="form-control" style="font-family: var(--font-english); font-weight: bold;" required>
              ${partyContracts.map(pc => `
                <option value="${pc.id}">
                  [عقد ${pc.id.slice(-4)}] ${pc.principal.toLocaleString()} ${pc.principalCurrency} -> ${pc.returnCurrency} (${pc.startDate})
                </option>
              `).join('')}
            </select>
          </div>
          <div class="form-group" style="flex: 1; min-width: 150px;">
            <label>${state.activeLanguage === 'ar' ? 'المبلغ المطلوب بالعملة العكسية' : 'Amount in Return Currency'}</label>
            <input type="number" id="custom-pay-amount" class="form-control" placeholder="أدخل قيمة الحركة" required min="1" step="any">
          </div>
          <div class="form-group" style="flex: 1.5; min-width: 200px;">
            <label>البيان / الوصف</label>
            <input type="text" id="custom-pay-desc" class="form-control" placeholder="بيان الحركة" value="${isFunder ? 'تسديد دفعة مالية مخصصة للممول' : 'تحصيل دفعة مالية مخصصة من المشغل'}" required>
          </div>
          <div class="form-group" style="width: 150px;">
            <label>التاريخ</label>
            <input type="date" id="custom-pay-date" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
          </div>
          <button type="submit" class="btn btn-primary" style="padding: 11px 20px;">
            <span>تسجيل الحركة</span>
          </button>
        </form>
      </div>
    `;
  } else if (contract) {
    customFormHTML = `
      <div class="custom-payout-section no-print">
        <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 12px; color: var(--color-gold); display: flex; align-items: center; gap: 8px;">
          <i data-lucide="plus-circle"></i>
          تسجيل حركة صرف مخصصة (سحب / صرف مقطوع)
        </h4>
        <form id="custom-payout-form" style="display: flex; gap: 15px; flex-wrap: wrap; align-items: flex-end; background-color: rgba(0, 0, 0, 0.15); border: 1px dashed var(--border-color); padding: 15px; border-radius: var(--radius-md);">
          <input type="hidden" id="custom-pay-contract-id" value="${contract.id}">
          <div class="form-group" style="flex: 1; min-width: 150px;">
            <label>المبلغ المطلوب بالعملة العكسية (${contract.returnCurrency})</label>
            <input type="number" id="custom-pay-amount" class="form-control" placeholder="أدخل قيمة الحركة" required min="1" step="any">
          </div>
          <div class="form-group" style="flex: 1.5; min-width: 200px;">
            <label>البيان / الوصف</label>
            <input type="text" id="custom-pay-desc" class="form-control" placeholder="بيان الحركة" value="${contract.type === 'creditor' ? 'تسديد دفعة مالية مخصصة للممول' : 'تحصيل دفعة مالية مخصصة من المشغل'}" required>
          </div>
          <div class="form-group" style="width: 150px;">
            <label>التاريخ</label>
            <input type="date" id="custom-pay-date" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
          </div>
          <button type="submit" class="btn btn-primary" style="padding: 11px 20px;">
            <span>تسجيل الحركة</span>
          </button>
        </form>
      </div>
    `;
  }
  
  // Date Filters HTML
  const dateFilterHTML = `
    <div class="statement-filters no-print" style="display: flex; gap: 15px; flex-wrap: wrap; margin-bottom: 20px; background-color: rgba(255, 255, 255, 0.02); padding: 15px; border-radius: var(--radius-md); border: 1px solid var(--border-color); align-items: flex-end;">
      <div class="form-group" style="flex: 1; min-width: 150px; margin-bottom: 0;">
        <label style="margin-bottom: 6px; font-size: 0.8rem; display: block; font-weight: bold; color: var(--text-secondary);">
          ${state.activeLanguage === 'ar' ? 'تاريخ بداية كشف الحساب' : 'Start Date'}
        </label>
        <input type="date" id="statement-filter-start-date" class="form-control" value="${startDate || ''}">
      </div>
      <div class="form-group" style="flex: 1; min-width: 150px; margin-bottom: 0;">
        <label style="margin-bottom: 6px; font-size: 0.8rem; display: block; font-weight: bold; color: var(--text-secondary);">
          ${state.activeLanguage === 'ar' ? 'تاريخ نهاية كشف الحساب' : 'End Date'}
        </label>
        <input type="date" id="statement-filter-end-date" class="form-control" value="${endDate || ''}">
      </div>
      <div style="display: flex; gap: 8px;">
        <button id="btn-apply-statement-filters" class="btn btn-primary" style="padding: 10px 16px;">
          <i data-lucide="filter" style="width: 14px; height: 14px;"></i>
          <span>${state.activeLanguage === 'ar' ? 'تصفية' : 'Filter'}</span>
        </button>
        <button id="btn-clear-statement-filters" class="btn btn-secondary" style="padding: 10px 16px;">
          <i data-lucide="x" style="width: 14px; height: 14px;"></i>
          <span>${state.activeLanguage === 'ar' ? 'إلغاء' : 'Reset'}</span>
        </button>
      </div>
    </div>
  `;

  let openingBalanceRowHtml = '';
  if (startDate) {
    openingBalanceRowHtml = `
      <tr style="background-color: rgba(255, 255, 255, 0.03); font-style: italic;">
        <td style="font-family: var(--font-english); font-size: 0.85rem; color: var(--text-muted);">${startDate}</td>
        <td style="font-weight: bold; color: var(--color-gold);">${state.activeLanguage === 'ar' ? 'رصيد افتتاحي منقول (سابق)' : 'Opening Balance Carried Forward'}</td>
        <td>-</td>
        <td>-</td>
        <td style="font-family: var(--font-english); font-weight: bold; color: var(--color-gold);">
          ${formatMultiCurrency(openingBalances)}
        </td>
        <td class="no-print"></td>
      </tr>
    `;
  }

  panel.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
      <h3 style="font-size: 1.1rem; font-weight: 700; display: flex; align-items: center; gap: 8px;">
        <i data-lucide="file-spreadsheet" style="color: var(--color-gold)"></i>
        ${accountName}
      </h3>
      <div style="display: flex; gap: 10px; align-items: center;">
        <div class="export-dropdown no-print">
          <button class="btn btn-secondary btn-export-toggle" style="padding: 6px 12px; font-size: 0.8rem; display: flex; align-items: center; gap: 6px;">
            <i data-lucide="download" style="width: 14px; height: 14px; color: var(--color-gold);"></i>
            <span>${state.activeLanguage === 'ar' ? 'تصدير الكشف' : 'Export Statement'}</span>
            <i data-lucide="chevron-down" style="width: 12px; height: 12px; opacity: 0.7;"></i>
          </button>
          <div class="export-dropdown-menu">
            <button class="export-menu-item btn-export-statement-pdf" data-account-id="${accountId}">
              <i data-lucide="printer" style="width: 14px; height: 14px; color: var(--color-gold);"></i>
              <span>${state.activeLanguage === 'ar' ? 'تحميل PDF' : 'Download PDF'}</span>
            </button>
            <button class="export-menu-item btn-export-statement-sheets" data-account-id="${accountId}">
              <i data-lucide="file-spreadsheet" style="width: 14px; height: 14px; color: var(--color-success);"></i>
              <span>${state.activeLanguage === 'ar' ? 'تصدير Sheets' : 'Export Sheets'}</span>
            </button>
          </div>
        </div>
        <button class="btn btn-secondary btn-undo-last no-print" style="padding: 6px 12px; font-size: 0.8rem; display: flex; align-items: center; gap: 6px;">
          <i data-lucide="rotate-ccw" style="width: 14px; height: 14px; color: var(--color-warning);"></i>
          <span>تراجع عن آخر حركة</span>
        </button>
        <button class="btn btn-secondary no-print" onclick="document.getElementById('ledger-statement-panel').style.display='none'" style="padding: 6px 12px; font-size: 0.8rem;">
          إغلاق
        </button>
      </div>
    </div>
    
    ${dateFilterHTML}
    ${alertsHtml}
    
    <div class="table-container">
      <table class="premium-table">
        <thead>
          <tr>
            <th>${t.date}</th>
            <th>${t.description}</th>
            <th>${t.debit}</th>
            <th>${t.credit}</th>
            <th>${t.balance}</th>
            <th class="no-print" style="width: 80px;">التحكم</th>
          </tr>
        </thead>
        <tbody>
          ${openingBalanceRowHtml}
          ${periodTxList.length === 0 ? `
            <tr>
              <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 20px;">
                ${state.activeLanguage === 'ar' ? 'لا توجد حركات خلال الفترة المحددة' : 'No transactions within this period'}
              </td>
            </tr>
          ` : (() => {
            const currentBalances = { ...openingBalances };
            return periodTxList.map(tx => {
              const isDeposit = tx.type === 'deposit' || tx.type === 'withdrawal';
              
              let dr = '-';
              let cr = '-';
              
              if (tx.type === 'deposit') {
                cr = `${tx.amount.toLocaleString()} ${formatCurrencyName(tx.currency)}`;
              } else if (tx.type === 'withdrawal') {
                dr = `${tx.amount.toLocaleString()} ${formatCurrencyName(tx.currency)}`;
              } else if (tx.type === 'dividend_due') {
                cr = `${tx.amount.toLocaleString()} ${formatCurrencyName(tx.currency)}`;
                currentBalances[tx.currency] = (currentBalances[tx.currency] || 0) + tx.amount;
              } else if (tx.type === 'payout' || tx.type === 'collect') {
                dr = `${tx.amount.toLocaleString()} ${formatCurrencyName(tx.currency)}`;
                currentBalances[tx.currency] = (currentBalances[tx.currency] || 0) - tx.amount;
              } else if (tx.type === 'profit_posted') {
                cr = `${tx.amount.toLocaleString()} ${formatCurrencyName(tx.currency)}`;
                currentBalances[tx.currency] = (currentBalances[tx.currency] || 0) + tx.amount;
              }
              
              const isManual = tx.type !== 'dividend_due' && tx.type !== 'profit_posted';
              
              let descHTML = tx.description;
              if (isPartyView) {
                descHTML = `<span style="font-family: var(--font-english); font-size: 0.75rem; background: var(--color-gold-light); color: var(--color-gold); padding: 2px 6px; border-radius: var(--radius-sm); margin-inline-start: 8px;">عقد ${tx.contractId.slice(-4)}</span>` + tx.description;
              }
              
              return `
                <tr>
                  <td style="font-family: var(--font-english); font-size: 0.85rem; color: var(--text-muted);">${tx.date}</td>
                  <td style="font-weight: 600;">${descHTML}</td>
                  <td style="color: var(--color-danger); font-family: var(--font-english);">${dr}</td>
                  <td style="color: var(--color-success); font-family: var(--font-english);">${cr}</td>
                  <td style="font-family: var(--font-english); font-weight: bold; color: var(--color-gold);">
                    ${isDeposit ? '-' : `${(currentBalances[tx.currency] || 0).toLocaleString()} ${formatCurrencyName(tx.currency)}`}
                  </td>
                  <td class="no-print">
                    ${isManual ? `
                      <button class="btn btn-secondary btn-delete-tx" data-id="${tx.id}" style="padding: 4px 8px; font-size: 0.7rem; border-radius: var(--radius-sm); border-color: rgba(245,158,11,0.25);" title="تراجع وحذف">
                        <i data-lucide="rotate-ccw" style="width: 12px; height: 12px; color: var(--color-warning);"></i>
                      </button>
                    ` : '-'}
                  </td>
                </tr>
              `;
            }).join('');
          })()}
          <tr style="background-color: rgba(255, 255, 255, 0.05); font-weight: bold; border-top: 2px solid var(--border-color);">
            <td colspan="2" style="text-align: start;">المجموع الكلي (Totals)</td>
            <td style="color: var(--color-danger); font-family: var(--font-english);">
              ${formatMultiCurrency(drTotals)}
            </td>
            <td style="color: var(--color-success); font-family: var(--font-english);">
              ${formatMultiCurrency(crTotals)}
              ${totalPrincipal > 0 ? `<br><small style="color: var(--text-secondary); font-size: 0.75rem;">رأس المال: ${formatMultiCurrency(principalTotals)}</small>` : ''}
            </td>
            <td style="font-family: var(--font-english); color: var(--color-gold); font-size: 1rem;">
              ${formatMultiCurrency(runningBalances)}
            </td>
            <td class="no-print"></td>
          </tr>
        </tbody>
      </table>
    </div>
    
    ${customFormHTML}
  `;
  
  lucide.createIcons();
  
  // Date Filters Listeners
  const applyFiltersBtn = panel.querySelector('#btn-apply-statement-filters');
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', () => {
      statementDateFilters.startDate = panel.querySelector('#statement-filter-start-date').value;
      statementDateFilters.endDate = panel.querySelector('#statement-filter-end-date').value;
      renderAccountStatement(accountId);
    });
  }
  
  const clearFiltersBtn = panel.querySelector('#btn-clear-statement-filters');
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      statementDateFilters.startDate = '';
      statementDateFilters.endDate = '';
      renderAccountStatement(accountId);
    });
  }

  // Custom payout form submit listener
  const cpForm = document.getElementById('custom-payout-form');
  if (cpForm) {
    cpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const amt = parseFloat(document.getElementById('custom-pay-amount').value);
      const desc = document.getElementById('custom-pay-desc').value.trim();
      const dt = document.getElementById('custom-pay-date').value;
      
      let targetContractId = '';
      if (isPartyView) {
        targetContractId = document.getElementById('custom-pay-contract-id').value;
      } else if (contract) {
        targetContractId = contract.id;
      }
      
      const targetContract = state.contracts.find(c => c.id === targetContractId);
      if (!targetContract || isNaN(amt) || amt <= 0) return;
      
      const isFunder = targetContract.type === 'creditor';
      
      state.transactions.push({
        id: `tx_custom_${Date.now().toString().slice(-6)}`,
        contractId: targetContractId,
        partyName: targetContract.partyName,
        partyType: targetContract.type,
        date: dt,
        type: isFunder ? 'payout' : 'collect',
        amount: amt,
        currency: targetContract.returnCurrency,
        description: desc
      });
      
      saveState();
      renderApp();
      renderAccountStatement(accountId);
    });
  }
  
  // Single transaction delete triggers
  panel.querySelectorAll('.btn-delete-tx').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const txId = btn.getAttribute('data-id');
      if (confirm(state.activeLanguage === 'ar' ? 'هل تريد التراجع عن هذه الحركة المالية وحذفها؟' : 'Are you sure you want to delete and undo this transaction?')) {
        state.transactions = state.transactions.filter(t => t.id !== txId);
        saveState();
        renderApp();
        renderAccountStatement(accountId);
      }
    });
  });
  
  // Undo last action trigger
  const undoBtn = panel.querySelector('.btn-undo-last');
  if (undoBtn) {
    const manualTxs = txList.filter(t => t.type !== 'dividend_due' && t.type !== 'profit_posted');
    if (manualTxs.length === 0) {
      undoBtn.style.opacity = '0.5';
      undoBtn.style.cursor = 'not-allowed';
      undoBtn.title = state.activeLanguage === 'ar' ? 'لا توجد حركات يدوية للتراجع عنها' : 'No manual transactions to undo';
    } else {
      undoBtn.addEventListener('click', () => {
        const lastTx = manualTxs[manualTxs.length - 1];
        const confirmMsg = state.activeLanguage === 'ar'
          ? `هل تريد التراجع عن الحركة الأخيرة: "${lastTx.description}" بقيمة ${lastTx.amount.toLocaleString()}؟`
          : `Do you want to undo the last action: "${lastTx.description}" for amount ${lastTx.amount.toLocaleString()}?`;
        if (confirm(confirmMsg)) {
          state.transactions = state.transactions.filter(t => t.id !== lastTx.id);
          saveState();
          renderApp();
          renderAccountStatement(accountId);
        }
      });
    }
  }
  
  // Collect alert click handler inside statement panel
  panel.querySelectorAll('.btn-collect-alert').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dueId = btn.getAttribute('data-id');
      postSettlePayment(dueId);
      renderApp();
      renderAccountStatement(accountId);
    });
  });
  
  // Print statement trigger
  const printBtn = panel.querySelector('.btn-print-statement');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      document.body.classList.add('printing-statement');
      window.print();
      document.body.classList.remove('printing-statement');
    });
  }
  
  // Smooth scroll down to the statement panel
  panel.scrollIntoView({ behavior: 'smooth' });
}

// Generates the upcoming payments list in dashboard
function renderUnifiedTimelineHTML(limitMonths = 3) {
  const t = translations[state.activeLanguage];
  const items = [];
  const today = new Date();
  
  state.contracts.forEach(cnt => {
    if (cnt.status === 'completed') return;
    
    const start = new Date(cnt.startDate);
    const startYear = start.getFullYear();
    const startMonth = start.getMonth();
    const startDay = start.getDate();
    const monthlyReturnVal = calculateMonthlyReturn(cnt);
    
    for (let m = 1; m <= cnt.duration; m++) {
      const targetMonth = startMonth + m;
      const targetYear = startYear + Math.floor(targetMonth / 12);
      const actualMonth = targetMonth % 12;
      
      const lastDayOfTargetMonth = new Date(targetYear, actualMonth + 1, 0).getDate();
      const clampedDay = Math.min(startDay, lastDayOfTargetMonth);
      const payDate = new Date(targetYear, actualMonth, clampedDay);
      
      if (payDate >= today && payDate <= new Date(today.getFullYear(), today.getMonth() + limitMonths, today.getDate())) {
        items.push({
          contractId: cnt.id,
          partyName: cnt.partyName,
          type: cnt.type,
          date: payDate,
          amount: monthlyReturnVal,
          currency: cnt.returnCurrency,
          isPrincipalReturn: false
        });
      }
      
      if (m === cnt.duration) {
        const principalDate = new Date(targetYear, actualMonth, clampedDay);
        if (principalDate >= today && principalDate <= new Date(today.getFullYear(), today.getMonth() + limitMonths, today.getDate())) {
          items.push({
            contractId: cnt.id,
            partyName: cnt.partyName,
            type: cnt.type,
            date: principalDate,
            amount: cnt.principal,
            currency: cnt.principalCurrency,
            isPrincipalReturn: true
          });
        }
      }
    }
  });
  
  items.sort((a, b) => a.date - b.date);
  
  if (items.length === 0) {
    return `<p style="text-align: center; color: var(--text-muted); padding: 15px;">لا توجد معاملات مجدولة في الأشهر الـ ${limitMonths} القادمة.</p>`;
  }
  
  return items.slice(0, 5).map(item => {
    const isOutflow = item.type === 'creditor';
    const isPrincipal = item.isPrincipalReturn;
    
    let typeLabel = '';
    let flowClass = '';
    
    if (isPrincipal) {
      typeLabel = `${t.principalReturn}`;
      flowClass = isOutflow ? 'outflow' : 'inflow';
    } else {
      typeLabel = isOutflow ? t.payoutFunder : t.collectOperator;
      flowClass = isOutflow ? 'outflow' : 'inflow';
    }
    
    const cnt = state.contracts.find(c => c.id === item.contractId);
    const valueUSD = cnt ? convertContractCurrency(item.amount, item.currency, 'USD', cnt) : convertToUSD(item.amount, item.currency);
    const dateFormatted = item.date.toLocaleDateString(state.activeLanguage === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
    
    return `
      <div class="timeline-item ${flowClass}">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="timeline-date">${dateFormatted}</div>
          <div class="timeline-title" style="display: flex; justify-content: space-between;">
            <span style="font-weight: 800;">${item.partyName}</span>
            <span class="badge ${isOutflow ? 'badge-warning' : 'badge-success'}">${typeLabel}</span>
          </div>
          <div class="timeline-meta">
            <span>
              ${t.amountInReturn}: 
              <span class="timeline-amount" style="color: ${isOutflow ? 'var(--color-gold)' : 'var(--color-success)'}">
                ${item.amount.toLocaleString(undefined, {maximumFractionDigits: 2})} ${item.currency}
              </span>
            </span>
            <span style="font-family: var(--font-english); font-size: 0.85rem;">
              ~ $${valueUSD.toLocaleString(undefined, {maximumFractionDigits: 2})} USD
            </span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// --- SIMULATED CONTRACT MATH GENERATION ---
function generateSimulationResults(principal, principalCurr, returnCurr, type, rateOrAmount, duration, startDate, customExchangeRate) {
  const t = translations[state.activeLanguage];
  
  if (principalCurr === returnCurr) {
    return {
      success: false,
      errorMsg: t.validationMatchError
    };
  }
  
  // Create a temporary rates object
  const tempRates = { ...state.exchangeRates };
  if (customExchangeRate && customExchangeRate > 0) {
    tempRates[returnCurr] = customExchangeRate;
  }
  
  // Custom convert function locally for simulator using tempRates
  const simConvert = (amount, from, to) => {
    if (from === to) return amount;
    const toUSD = (val, curr) => val / (tempRates[curr] || 1.0);
    const fromUSD = (val, curr) => val * (tempRates[curr] || 1.0);
    return fromUSD(toUSD(amount, from), to);
  };
  
  const simToUSD = (val, curr) => val / (tempRates[curr] || 1.0);
  
  let monthlyDividendInReturn = 0;
  let totalDividendsInReturn = 0;
  
  if (type === 'fixed') {
    monthlyDividendInReturn = rateOrAmount;
    totalDividendsInReturn = monthlyDividendInReturn * duration;
  } else {
    const annualDividendInPrincipal = principal * (rateOrAmount / 100);
    const monthlyDividendInPrincipal = annualDividendInPrincipal / 12;
    monthlyDividendInReturn = simConvert(monthlyDividendInPrincipal, principalCurr, returnCurr);
    totalDividendsInReturn = monthlyDividendInReturn * duration;
  }
  
  const schedule = [];
  const start = new Date(startDate);
  const startYear = start.getFullYear();
  const startMonth = start.getMonth();
  const startDay = start.getDate();
  
  for (let m = 1; m <= duration; m++) {
    const targetMonth = startMonth + m;
    const targetYear = startYear + Math.floor(targetMonth / 12);
    const actualMonth = targetMonth % 12;
    
    // Prevent rolling over to next month
    const lastDayOfTargetMonth = new Date(targetYear, actualMonth + 1, 0).getDate();
    const clampedDay = Math.min(startDay, lastDayOfTargetMonth);
    const payDate = new Date(targetYear, actualMonth, clampedDay);
    
    schedule.push({
      period: m,
      date: formatLocalDate(payDate),
      type: 'dividend',
      originalAmount: type === 'fixed' ? simConvert(monthlyDividendInReturn, returnCurr, principalCurr) : (principal * (rateOrAmount / 100) / 12),
      originalCurrency: principalCurr,
      payableAmount: monthlyDividendInReturn,
      payableCurrency: returnCurr,
      valUSD: simToUSD(monthlyDividendInReturn, returnCurr)
    });
    
    if (m === Number(duration)) {
      schedule.push({
        period: m,
        date: formatLocalDate(payDate),
        type: 'principal',
        originalAmount: principal,
        originalCurrency: principalCurr,
        payableAmount: principal,
        payableCurrency: principalCurr,
        valUSD: simToUSD(principal, principalCurr)
      });
    }
  }
  
  return {
    success: true,
    data: {
      principal,
      principalCurr,
      returnCurr,
      type,
      rateOrAmount,
      duration,
      startDate,
      customExchangeRate,
      monthlyDividendInReturn,
      totalDividendsInReturn,
      schedule
    }
  };
}

// --- INTERACTIVE EVENT LISTENERS & LOGIC BINDINGS ---
function setupEventListeners() {
  // Tabs Navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const tab = link.getAttribute('data-tab');
      if (tab) changeTab(tab);
    });
  });
  
  // Language Switch
  document.querySelectorAll('.lang-btn').forEach(btn => {
    // Only bind to general lang buttons, not balance currency toggle buttons
    if (btn.classList.contains('balance-curr-btn')) return;
    btn.addEventListener('click', (e) => {
      const lang = btn.getAttribute('data-lang');
      if (lang) toggleLanguage(lang);
    });
  });
  
  // Theme Switch
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const theme = btn.getAttribute('data-theme');
      if (theme) {
        state.theme = theme;
        document.body.className = theme === 'beige' ? 'theme-beige' : '';
        saveState();
        renderApp();
      }
    });
  });
  
  // Balance Sheet Currency Switch
  document.querySelectorAll('.balance-curr-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const curr = btn.getAttribute('data-curr');
      if (curr) {
        state.balanceDisplayCurrency = curr;
        saveState();
        renderApp();
      }
    });
  });
  
  // Export backup handler
  const exportBtn = document.getElementById('btn-export-db');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      const dateStr = new Date().toISOString().slice(0, 10);
      downloadAnchor.setAttribute("download", `equity_backup_${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }

  // Import backup handler
  const importBtn = document.getElementById('btn-import-db');
  const fileInput = document.getElementById('import-db-file');
  if (importBtn && fileInput) {
    importBtn.addEventListener('click', () => {
      fileInput.click();
    });
    
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = function(evt) {
        try {
          const importedState = JSON.parse(evt.target.result);
          
          if (importedState && typeof importedState === 'object' && Array.isArray(importedState.contracts)) {
            state = importedState;
            if (!state.transactions) state.transactions = [];
            if (!state.exchangeRates) {
              state.exchangeRates = { USD: 1.0, IQD: 1450.0, EUR: 0.92, AED: 3.67 };
            }
            if (!state.activeLanguage) state.activeLanguage = 'ar';
            if (!state.activeTab) state.activeTab = 'dashboard';
            
            saveState();
            
            document.documentElement.lang = state.activeLanguage;
            document.documentElement.dir = state.activeLanguage === 'ar' ? 'rtl' : 'ltr';
            
            recalculateArbitrageSpreads();
            renderApp();
            
            const t = translations[state.activeLanguage];
            alert(t.importSuccess);
          } else {
            throw new Error("Invalid state structure");
          }
        } catch (err) {
          console.error("Failed to import state:", err);
          const t = translations[state.activeLanguage];
          alert(t.importError);
        }
        fileInput.value = '';
      };
      reader.readAsText(file);
    });
  }

  // Reset database handler
  const resetBtn = document.getElementById('btn-reset-db-sidebar');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const t = translations[state.activeLanguage];
      if (confirm(t.confirmReset)) {
        state.contracts = [...defaultContracts];
        state.transactions = [];
        initMockTransactions();
        saveState();
        renderApp();
      }
    });
  }
  
  // Currency input updates
  document.querySelectorAll('.rate-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const curr = input.getAttribute('data-curr');
      const val = parseFloat(input.value);
      if (curr && val > 0) {
        state.exchangeRates[curr] = val;
        saveState();
        renderApp();
      }
    });
  });
  
  // Delete contract click handler
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const t = translations[state.activeLanguage];
      if (confirm(t.confirmDelete)) {
        state.contracts = state.contracts.filter(c => c.id !== id);
        // Clean ledger transactions related to deleted contract
        state.transactions = state.transactions.filter(tx => tx.contractId !== id);
        if (state.editingContractId === id) {
          state.editingContractId = null;
        }
        recalculateArbitrageSpreads();
        saveState();
        renderApp();
      }
    });
  });

  // Edit contract click handler
  document.querySelectorAll('.btn-edit-contract').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      state.editingContractId = id;
      saveState();
      renderApp();
    });
  });

  // Return Capital click handler
  document.querySelectorAll('.btn-return-capital').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      returnContractCapital(id);
    });
  });

  // Cancel edit contract handler
  const cancelEditBtn = document.getElementById('btn-cancel-edit');
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', (e) => {
      state.editingContractId = null;
      saveState();
      renderApp();
    });
  }

  // Dashboard collect from alert handler
  document.querySelectorAll('.btn-collect-alert').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const dueTxId = btn.getAttribute('data-id');
      postSettlePayment(dueTxId);
    });
  });

  // Statement button trigger
  document.querySelectorAll('.btn-statement').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const accountId = btn.getAttribute('data-id');
      renderAccountStatement(accountId);
    });
  });

  // Post payment dues settle trigger
  document.querySelectorAll('.btn-settle-due').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const dueTxId = btn.getAttribute('data-id');
      postSettlePayment(dueTxId);
    });
  });

  // Print contract click handler
  document.querySelectorAll('.btn-print-contract').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      showPrintContractModal(id);
    });
  });

  // Dynamic show/hide rate vs fixed fields in Contract Form
  const formDivTypeSel = document.getElementById('form-dividend-type');
  if (formDivTypeSel) {
    formDivTypeSel.addEventListener('change', (e) => {
      const isFixed = formDivTypeSel.value === 'fixed';
      document.getElementById('form-rate-group').style.display = isFixed ? 'none' : 'block';
      document.getElementById('form-fixed-amount-group').style.display = isFixed ? 'block' : 'none';
    });
  }

  // Dynamic show/hide rate vs fixed fields in Calculator Form
  const calcDivTypeSel = document.getElementById('calc-dividend-type');
  if (calcDivTypeSel) {
    calcDivTypeSel.addEventListener('change', (e) => {
      const isFixed = calcDivTypeSel.value === 'fixed';
      document.getElementById('calc-rate-group').style.display = isFixed ? 'none' : 'block';
      document.getElementById('calc-fixed-amount-group').style.display = isFixed ? 'block' : 'none';
    });
  }
  
  // Creditors/Debtors forms submit
  const contractForm = document.getElementById('contract-form');
  if (contractForm) {
    const type = contractForm.getAttribute('data-type');
    const pCurrSel = document.getElementById('form-principal-curr');
    const rCurrSel = document.getElementById('form-return-curr');
    const errorBox = document.getElementById('sharia-error-placeholder');
    
    const checkShariaWarning = () => {
      if (pCurrSel.value === rCurrSel.value) {
        errorBox.innerHTML = `
          <div class="sharia-warning-box">
            <i data-lucide="alert-triangle"></i>
            <span>${translations[state.activeLanguage].validationMatchError}</span>
          </div>
        `;
        errorBox.style.display = 'block';
        lucide.createIcons();
      } else {
        errorBox.style.display = 'none';
      }
    };
    
    pCurrSel.addEventListener('change', checkShariaWarning);
    rCurrSel.addEventListener('change', () => {
      checkShariaWarning();
      // Auto-update exchange rate input value with current global rate for return currency
      const exchInput = document.getElementById('form-custom-exch-rate');
      if (exchInput) {
        exchInput.value = state.exchangeRates[rCurrSel.value] || 1.0;
      }
    });
    
    contractForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const t = translations[state.activeLanguage];
      
      const partyName = document.getElementById('form-party-name').value.trim();
      const principal = parseFloat(document.getElementById('form-principal').value);
      const principalCurrency = pCurrSel.value;
      const returnCurrency = rCurrSel.value;
      
      const divType = formDivTypeSel.value;
      const dividendRate = divType === 'rate' ? parseFloat(document.getElementById('form-rate').value) : 0;
      const monthlyDividendAmount = divType === 'fixed' ? parseFloat(document.getElementById('form-fixed-amount').value) : 0;
      const customExchangeRate = parseFloat(document.getElementById('form-custom-exch-rate').value) || 1.0;
      
      const duration = parseInt(document.getElementById('form-duration').value);
      const startDate = document.getElementById('form-start-date').value;
      const notes = document.getElementById('form-notes') ? document.getElementById('form-notes').value.trim() : '';
      
      const isInternal = document.getElementById('form-is-internal') ? document.getElementById('form-is-internal').checked : false;
      
      if (principalCurrency === returnCurrency) {
        checkShariaWarning();
        const shakeTarget = errorBox.querySelector('.sharia-warning-box');
        if (shakeTarget) {
          shakeTarget.style.animation = 'none';
          setTimeout(() => { shakeTarget.style.animation = 'shake 0.5s ease-in-out'; }, 10);
        }
        return;
      }
      
      if (state.editingContractId) {
        const contract = state.contracts.find(c => c.id === state.editingContractId);
        if (contract) {
          contract.partyName = partyName;
          contract.principal = principal;
          contract.principalCurrency = principalCurrency;
          contract.returnCurrency = returnCurrency;
          contract.dividendType = divType;
          contract.dividendRate = dividendRate;
          contract.monthlyDividendAmount = monthlyDividendAmount;
          contract.customExchangeRate = customExchangeRate;
          contract.duration = duration;
          contract.startDate = startDate;
          contract.notes = notes;
          contract.isInternal = type === 'creditor' ? isInternal : true;
          
          // Update the initial deposit transaction
          const initTx = state.transactions.find(tx => tx.contractId === contract.id && tx.type === 'deposit');
          if (initTx) {
            initTx.amount = principal;
            initTx.currency = principalCurrency;
            initTx.date = startDate;
            initTx.partyName = partyName;
            initTx.description = type === 'creditor'
              ? (isInternal 
                  ? (state.activeLanguage === 'ar' ? 'إيداع رأس مال (تشغيل داخلي)' : 'Capital Deposit (Internal Operations)')
                  : (state.activeLanguage === 'ar' ? 'إيداع رأس مال المضاربة' : 'Capital Principal Deposit'))
              : (state.activeLanguage === 'ar' ? 'استلام رأس مال للتشغيل' : 'Capital Principal Withdrawal');
          }
          
          // Clean unpaid dividend_due records for this contract so they can be re-generated
          state.transactions = state.transactions.filter(tx => {
            if (tx.contractId !== contract.id || tx.type !== 'dividend_due') return true;
            const isSettled = state.transactions.some(
              settled => settled.contractId === contract.id &&
                         settled.period === tx.period &&
                         (settled.type === 'payout' || settled.type === 'collect')
            );
            return isSettled;
          });
          
          state.editingContractId = null;
        }
      } else {
        const contractId = "cnt_" + (type === 'creditor' ? 'f_' : 'd_') + Date.now().toString().slice(-6);
        
        const newContract = {
          id: contractId,
          partyName,
          type,
          principal,
          principalCurrency,
          returnCurrency,
          dividendType: divType,
          dividendRate,
          monthlyDividendAmount,
          customExchangeRate,
          duration,
          startDate,
          notes,
          status: "active",
          isInternal: type === 'creditor' ? isInternal : true
        };
        
        state.contracts.push(newContract);
        
        state.transactions.push({
          id: `tx_init_${contractId.slice(-4)}`,
          contractId: contractId,
          partyName: partyName,
          partyType: type,
          date: startDate,
          type: 'deposit',
          amount: principal,
          currency: principalCurrency,
          description: type === 'creditor'
            ? (isInternal 
                ? (state.activeLanguage === 'ar' ? 'إيداع رأس مال (تشغيل داخلي)' : 'Capital Deposit (Internal Operations)')
                : (state.activeLanguage === 'ar' ? 'إيداع رأس مال المضاربة' : 'Capital Principal Deposit'))
            : (state.activeLanguage === 'ar' ? 'استلام رأس مال للتشغيل' : 'Capital Principal Withdrawal')
        });
      }
      
      generateDues();
      state.showContractModal = false;
      saveState();
      alert(t.successSaved);
      renderApp();
    });
  }
  
  // Sharia Calculator Form submit
  const calcForm = document.getElementById('calc-form');
  if (calcForm) {
    const pCurrSel = document.getElementById('calc-principal-curr');
    const rCurrSel = document.getElementById('calc-return-curr');
    const errorBox = document.getElementById('calc-sharia-error');
    
    const checkCalcSharia = () => {
      if (pCurrSel.value === rCurrSel.value) {
        errorBox.innerHTML = `
          <div class="sharia-warning-box" style="margin-bottom: 15px;">
            <i data-lucide="alert-triangle"></i>
            <span>${translations[state.activeLanguage].validationMatchError}</span>
          </div>
        `;
        errorBox.style.display = 'block';
        lucide.createIcons();
      } else {
        errorBox.style.display = 'none';
      }
    };
    
    pCurrSel.addEventListener('change', checkCalcSharia);
    rCurrSel.addEventListener('change', () => {
      checkCalcSharia();
      const exchInput = document.getElementById('calc-custom-exch-rate');
      if (exchInput) {
        exchInput.value = state.exchangeRates[rCurrSel.value] || 1.0;
      }
    });
    
    calcForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const principal = parseFloat(document.getElementById('calc-principal').value);
      const principalCurrency = pCurrSel.value;
      const returnCurrency = rCurrSel.value;
      
      const divType = calcDivTypeSel.value;
      const rateOrAmount = divType === 'rate' 
        ? parseFloat(document.getElementById('calc-rate').value) 
        : parseFloat(document.getElementById('calc-fixed-amount').value);
      const customExchRate = parseFloat(document.getElementById('calc-custom-exch-rate').value) || 1.0;
        
      const duration = parseInt(document.getElementById('calc-duration').value);
      const startDate = document.getElementById('calc-start-date').value;
      
      if (principalCurrency === returnCurrency) {
        checkCalcSharia();
        const shakeTarget = errorBox.querySelector('.sharia-warning-box');
        if (shakeTarget) {
          shakeTarget.style.animation = 'none';
          setTimeout(() => { shakeTarget.style.animation = 'shake 0.5s ease-in-out'; }, 10);
        }
        return;
      }
      
      const res = generateSimulationResults(principal, principalCurrency, returnCurrency, divType, rateOrAmount, duration, startDate, customExchRate);
      if (res.success) {
        renderCalculatorResults(res.data);
      }
    });
  }

  // --- Dynamic Number & Tafqeet Preview Initialization ---
  const initPreviewHelper = (inputId, currencyId, previewId) => {
    const inputEl = document.getElementById(inputId);
    const currencyEl = document.getElementById(currencyId);
    const previewEl = document.getElementById(previewId);
    
    if (!inputEl || !previewEl) return;
    
    const update = () => {
      const val = parseFloat(inputEl.value);
      const curr = currencyEl ? currencyEl.value : 'USD';
      
      if (isNaN(val) || val <= 0) {
        previewEl.style.display = 'none';
        previewEl.innerText = '';
        return;
      }
      
      const formattedVal = val.toLocaleString(undefined, { maximumFractionDigits: 2 });
      
      let tafqeetText = '';
      if (state.activeLanguage === 'ar') {
        tafqeetText = tafqeetArabic(val, curr);
      } else {
        tafqeetText = tafqeetEnglish(val, curr);
      }
      
      if (tafqeetText) {
        previewEl.innerText = `${formattedVal} ${curr} (${tafqeetText})`;
        previewEl.style.display = 'block';
      } else {
        previewEl.style.display = 'none';
        previewEl.innerText = '';
      }
    };
    
    inputEl.addEventListener('input', update);
    if (currencyEl) {
      currencyEl.addEventListener('change', update);
    }
    
    // Initial run for default/existing values
    update();
  };

  // Bind contract form fields
  initPreviewHelper('form-principal', 'form-principal-curr', 'form-principal-preview');
  initPreviewHelper('form-fixed-amount', 'form-return-curr', 'form-fixed-amount-preview');
  
  // Bind calculator fields
  initPreviewHelper('calc-principal', 'calc-principal-curr', 'calc-principal-preview');
  initPreviewHelper('calc-fixed-amount', 'calc-return-curr', 'calc-fixed-amount-preview');

  // --- REAL-TIME SEARCH FOR CONTRACTS ---
  const searchContractsInput = document.getElementById('search-contracts');
  if (searchContractsInput) {
    searchContractsInput.addEventListener('input', function() {
      const query = this.value.toLowerCase().trim();
      const rows = document.querySelectorAll('.view-container .premium-table tbody tr');
      rows.forEach(row => {
        const partyNameCell = row.querySelector('td:first-child');
        if (partyNameCell) {
          const text = partyNameCell.textContent.toLowerCase();
          if (text.includes(query)) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        }
      });
    });
  }

  // --- REAL-TIME SEARCH FOR LEDGERS ---
  const searchLedgersInput = document.getElementById('search-ledgers');
  if (searchLedgersInput) {
    searchLedgersInput.addEventListener('input', function() {
      const query = this.value.toLowerCase().trim();
      const rows = document.querySelectorAll('.view-container .premium-table tbody tr');
      rows.forEach(row => {
        const partyNameCell = row.querySelector('td:first-child');
        if (partyNameCell) {
          const text = partyNameCell.textContent.toLowerCase();
          if (text.includes(query)) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        }
      });
    });
  }

  // --- NOTIFICATION BELL INTERACTION ---
  const bellBtn = document.getElementById('notification-bell-btn');
  const dropdownMenu = document.getElementById('notification-dropdown-menu');
  if (bellBtn && dropdownMenu) {
    bellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = dropdownMenu.style.display === 'block';
      dropdownMenu.style.display = isVisible ? 'none' : 'block';
    });
    
    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!bellBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.style.display = 'none';
      }
    });
  }

  // Bind the collect click inside notification dropdown
  document.querySelectorAll('.btn-collect-notif').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dueTxId = btn.getAttribute('data-id');
      postSettlePayment(dueTxId);
    });
  });

  // --- NEW CONTRACT MODAL TOGGLES ---
  const newContractBtn = document.getElementById('btn-new-contract');
  if (newContractBtn) {
    newContractBtn.addEventListener('click', () => {
      state.showContractModal = true;
      saveState();
      renderApp();
    });
  }

  const closeContractModalBtn = document.getElementById('btn-close-contract-modal');
  if (closeContractModalBtn) {
    closeContractModalBtn.addEventListener('click', () => {
      state.showContractModal = false;
      state.editingContractId = null;
      saveState();
      renderApp();
    });
  }

  // Close contract modal when clicking on the backdrop
  const contractModalBackdrop = document.getElementById('contract-form-modal');
  if (contractModalBackdrop) {
    contractModalBackdrop.addEventListener('click', (e) => {
      if (e.target === contractModalBackdrop) {
        state.showContractModal = false;
        state.editingContractId = null;
        saveState();
        renderApp();
      }
    });
  }

  // --- EXPORT DROPDOWNS SETUP ---
  // Toggle dropdown on button click
  document.querySelectorAll('.btn-export-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = btn.parentElement;
      const menu = parent.querySelector('.export-dropdown-menu');
      if (menu) {
        const isOpen = menu.style.display === 'block';
        // Close all dropdowns
        document.querySelectorAll('.export-dropdown-menu').forEach(m => m.style.display = 'none');
        menu.style.display = isOpen ? 'none' : 'block';
      }
    });
  });

  // Close dropdowns when clicking anywhere outside
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.export-dropdown-menu').forEach(m => m.style.display = 'none');
  });

  // Export Contracts PDF click handler
  document.querySelectorAll('.btn-export-contracts-pdf').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const type = btn.getAttribute('data-contract-type');
      const isCreditor = type === 'creditor';
      const list = state.contracts.filter(c => c.type === type);
      
      const t = translations[state.activeLanguage];
      const isAr = state.activeLanguage === 'ar';
      const title = isCreditor ? 
        (isAr ? 'عقود الممولين (الدائنين)' : 'Funder Contracts') : 
        (isAr ? 'عقود المشغلين (المدينين)' : 'Operator Contracts');
      
      const headers = isAr ? 
        ["الطرف الثاني", "رأس المال", "عملة العائد", "طريقة الأرباح", "معدل الأرباح/المبلغ", "المدة", "الحالة", "تاريخ البدء"] :
        ["Counterparty", "Principal", "Return Currency", "Dividend Type", "Rate/Amount", "Duration", "Status", "Start Date"];
      
      const rows = list.map(c => {
        const isFixed = c.dividendType === 'fixed';
        const rateOrAmountText = isFixed ? 
          `${c.monthlyDividendAmount.toLocaleString()} ${formatCurrencyName(c.returnCurrency)}` : 
          `%${c.dividendRate}`;
        const divTypeLabel = isFixed ? 
          (isAr ? 'مبلغ ثابت' : 'Fixed Amount') : 
          (isAr ? 'نسبة مئوية' : 'Percentage');
        
        return [
          c.partyName,
          `${c.principal.toLocaleString()} ${c.principalCurrency}`,
          c.returnCurrency,
          divTypeLabel,
          rateOrAmountText,
          `${c.duration} ${isAr ? 'أشهر' : 'Months'}`,
          c.status === 'completed' ? (isAr ? 'مكتمل' : 'Completed') : (isAr ? 'نشط' : 'Active'),
          c.startDate
        ];
      });
      
      exportToPDF(title, headers, rows);
    });
  });

  // Export Contracts Sheets click handler
  document.querySelectorAll('.btn-export-contracts-sheets').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const type = btn.getAttribute('data-contract-type');
      const isCreditor = type === 'creditor';
      const list = state.contracts.filter(c => c.type === type);
      
      const isAr = state.activeLanguage === 'ar';
      const filename = isCreditor ? 'funder_contracts.csv' : 'operator_contracts.csv';
      
      const headers = isAr ? 
        ["الطرف الثاني", "رأس المال", "عملة رأس المال", "عملة العائد", "طريقة الأرباح", "معدل الأرباح/المبلغ", "المدة بالشهور", "الحالة", "تاريخ البدء"] :
        ["Counterparty", "Principal", "Principal Currency", "Return Currency", "Dividend Type", "Rate or Amount", "Duration Months", "Status", "Start Date"];
      
      const rows = list.map(c => {
        const isFixed = c.dividendType === 'fixed';
        const rateOrAmountText = isFixed ? c.monthlyDividendAmount : c.dividendRate;
        const divTypeLabel = isFixed ? 'fixed' : 'rate';
        
        return [
          c.partyName,
          c.principal,
          c.principalCurrency,
          c.returnCurrency,
          divTypeLabel,
          rateOrAmountText,
          c.duration,
          c.status,
          c.startDate
        ];
      });
      
      exportToCSV(filename, headers, rows);
    });
  });

  // Export Statement PDF click handler
  document.querySelectorAll('.btn-export-statement-pdf').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.body.classList.add('printing-statement');
      window.print();
      document.body.classList.remove('printing-statement');
    });
  });

  // Export Statement Sheets click handler
  document.querySelectorAll('.btn-export-statement-sheets').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const accountId = btn.getAttribute('data-account-id');
      const isAr = state.activeLanguage === 'ar';
      
      let accountName = '';
      let txList = [];
      const isPartyView = accountId.startsWith('party:');
      
      if (isPartyView) {
        const partyName = accountId.substring(6);
        const partyContracts = state.contracts.filter(c => c.partyName.trim() === partyName.trim());
        accountName = partyName;
        const contractIds = partyContracts.map(c => c.id);
        txList = state.transactions.filter(t => contractIds.includes(t.contractId));
      } else if (accountId === 'platform_profits') {
        accountName = isAr ? 'أرباح المنصة الصافية' : 'Platform Net Profits';
        txList = state.transactions.filter(t => t.contractId === 'platform_profits');
      } else {
        const contract = state.contracts.find(c => c.id === accountId);
        accountName = contract ? contract.partyName : accountId;
        txList = state.transactions.filter(t => t.contractId === accountId);
      }
      
      txList.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      const startDate = statementDateFilters.startDate;
      const endDate = statementDateFilters.endDate;
      const filtered = txList.filter(tx => {
        const isBeforeStart = startDate && tx.date < startDate;
        const isAfterEnd = endDate && tx.date > endDate;
        return !isBeforeStart && !isAfterEnd;
      });
      
      const filename = `statement_${accountName.replace(/\s+/g, '_')}.csv`;
      
      const headers = isAr ? 
        ["التاريخ", "الحركة / البيان", "العملة", "مدين (Debit / خارج)", "دائن (Credit / داخل)", "الرصيد الجاري"] :
        ["Date", "Description", "Currency", "Debit", "Credit", "Running Balance"];
      
      let runningBal = 0;
      const rows = filtered.map(tx => {
        const isDebit = tx.type === 'payout' || tx.type === 'collect' || tx.type === 'withdrawal';
        const debitVal = isDebit ? tx.amount : 0;
        const creditVal = !isDebit ? tx.amount : 0;
        
        if (tx.type === 'dividend_due' || tx.type === 'profit_posted') {
          runningBal += tx.amount;
        } else if (tx.type === 'payout' || tx.type === 'collect') {
          runningBal -= tx.amount;
        }
        
        return [
          tx.date,
          tx.description,
          tx.currency,
          debitVal || '-',
          creditVal || '-',
          runningBal
        ];
      });
      
      exportToCSV(filename, headers, rows);
    });
  });

  // Export Analysis Sheets click handler
  document.querySelectorAll('.btn-export-analysis-sheets').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const type = btn.getAttribute('data-contract-type');
      const isAr = state.activeLanguage === 'ar';
      
      const activeContracts = state.contracts.filter(c => c.status !== 'completed');
      const list = activeContracts.filter(c => c.type === type);
      const isFunder = type === 'creditor';
      
      const filename = isFunder ? 'funder_redemption_analysis.csv' : 'operator_redemption_analysis.csv';
      
      const headers = isAr ? 
        ["الطرف الثاني", "رأس المال الأساسي", "سعر صرف التعاقد", "سعر الصرف الحالي", "مبلغ التصفية العكسي", "صافي الربح/الخسارة التقريبي", "التوصية"] :
        ["Counterparty", "Starting Principal", "Contract Rate", "Current Market Rate", "Redemption Payoff", "Approx Net Profit", "Recommendation"];
      
      const rows = list.map(c => {
        const contractRate = c.customExchangeRate || 1.0;
        const currentRate = (c.returnCurrency === 'IQD' || c.principalCurrency === 'IQD')
          ? (state.exchangeRates['IQD'] || 1450.0)
          : 1.0;
          
        const analysis = calculateRedemptionProfit(c);
        const profit = analysis.profit;
        const profitUSD = analysis.profitUSD;
        
        const isProfit = profitUSD > 0.01;
        const profitSign = isProfit ? '+' : '';
        const profitText = `${profitSign}${profit.toFixed(2)} ${c.principalCurrency} (${profitSign}$${profitUSD.toFixed(2)} USD)`;
        
        let recText = '';
        if (isProfit) {
          recText = isFunder ?
            (isAr ? 'ينصح بالإعادة الآن' : 'Return capital now') :
            (isAr ? 'ينصح بالاسترداد الآن' : 'Recover capital now');
        } else {
          recText = isAr ? 'ينصح بالانتظار' : 'Keep active';
        }
        
        return [
          c.partyName,
          `${c.principal} ${c.principalCurrency}`,
          `1 USD = ${contractRate} ${c.returnCurrency}`,
          `1 USD = ${currentRate} ${c.returnCurrency}`,
          `${analysis.returnAmount.toFixed(2)} ${c.returnCurrency}`,
          profitText,
          recText
        ];
      });
      
      exportToCSV(filename, headers, rows);
    });
  });

  // Export Analysis PDF click handler
  document.querySelectorAll('.btn-export-analysis-pdf').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const type = btn.getAttribute('data-contract-type');
      const isAr = state.activeLanguage === 'ar';
      
      const activeContracts = state.contracts.filter(c => c.status !== 'completed');
      const list = activeContracts.filter(c => c.type === type);
      const isFunder = type === 'creditor';
      
      const title = isFunder ? 
        (isAr ? 'تصفية عقود الممولين (دائن)' : 'Funder Contracts Redemption Analyzer') :
        (isAr ? 'تصفية عقود المشغلين (مدين)' : 'Operator Contracts Redemption Analyzer');
      
      const headers = isAr ? 
        ["الطرف الثاني", "رأس المال الأساسي", "سعر صرف التعاقد", "سعر الصرف الحالي", "مبلغ التصفية العكسي", "صافي الربح/الخسارة التقريبي", "التوصية"] :
        ["Counterparty", "Starting Principal", "Contract Rate", "Current Market Rate", "Redemption Payoff", "Approx Net Profit", "Recommendation"];
      
      const rows = list.map(c => {
        const contractRate = c.customExchangeRate || 1.0;
        const currentRate = (c.returnCurrency === 'IQD' || c.principalCurrency === 'IQD')
          ? (state.exchangeRates['IQD'] || 1450.0)
          : 1.0;
          
        const analysis = calculateRedemptionProfit(c);
        const profit = analysis.profit;
        const profitUSD = analysis.profitUSD;
        
        const isProfit = profitUSD > 0.01;
        const profitSign = isProfit ? '+' : '';
        const profitText = `${profitSign}${profit.toLocaleString(undefined, {maximumFractionDigits: 2})} ${c.principalCurrency} (${profitSign}$${profitUSD.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USD)`;
        
        let recText = '';
        if (isProfit) {
          recText = isFunder ?
            (isAr ? 'ينصح بالإعادة الآن (أرباح صرف)' : 'Return capital now (arbitrage gain)') :
            (isAr ? 'ينصح بالاسترداد الآن (أرباح صرف)' : 'Recover capital now (arbitrage gain)');
        } else {
          recText = isAr ? 'ينصح بالانتظار (تجنب الخسارة)' : 'Keep active (avoid loss)';
        }
        
        return [
          c.partyName,
          `${c.principal.toLocaleString()} ${c.principalCurrency}`,
          `1 USD = ${contractRate.toLocaleString()} ${c.returnCurrency}`,
          `1 USD = ${currentRate.toLocaleString()} ${c.returnCurrency}`,
          `${analysis.returnAmount.toLocaleString(undefined, {maximumFractionDigits: 2})} ${c.returnCurrency}`,
          profitText,
          recText
        ];
      });
      
      exportToPDF(title, headers, rows);
    });
  });
}

// --- RENDER SIMULATION RESULTS & TABLE IN CALCULATOR ---
function renderCalculatorResults(data) {
  const t = translations[state.activeLanguage];
  const resultsBox = document.getElementById('calculator-results-box');
  const scheduleCard = document.getElementById('calc-schedule-card');
  const scheduleTable = document.getElementById('calc-schedule-table');
  
  const totalInterestRepInReturn = data.totalDividendsInReturn;
  const tempRates = { ...state.exchangeRates };
  if (data.customExchangeRate && data.customExchangeRate > 0) {
    tempRates[data.returnCurr] = data.customExchangeRate;
  }
  const returnUSDValue = totalInterestRepInReturn / (tempRates[data.returnCurr] || 1.0);
  
  resultsBox.innerHTML = `
    <h4 style="font-weight: 800; color: var(--color-gold); margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
      <i data-lucide="check-circle"></i>
      محاكاة ناجحة ومطابقة شرعياً
    </h4>
    <div class="calc-res-item">
      <span class="calc-res-label">الربح الشهري المتوقع للمصالحة:</span>
      <span class="calc-res-val" style="color: var(--color-success);">
        ${data.monthlyDividendInReturn.toLocaleString(undefined, {maximumFractionDigits: 2})} ${data.returnCurr}
      </span>
    </div>
    <div class="calc-res-item">
      <span class="calc-res-label">مجموع أرباح المصالحة (كامل المدة):</span>
      <span class="calc-res-val">
        ${data.totalDividendsInReturn.toLocaleString(undefined, {maximumFractionDigits: 2})} ${data.returnCurr}
      </span>
    </div>
    <div class="calc-res-item">
      <span class="calc-res-label">قيمة الأرباح بالدولار USD:</span>
      <span class="calc-res-val" style="color: var(--color-gold);">
        ~$${returnUSDValue.toLocaleString(undefined, {maximumFractionDigits: 2})} USD
      </span>
    </div>
    <div class="calc-res-item">
      <span class="calc-res-label">إجمالي المستردات (رأس المال + الأرباح):</span>
      <span class="calc-res-val">
        ${data.principal.toLocaleString()} ${data.principalCurr} + ${data.totalDividendsInReturn.toLocaleString(undefined, {maximumFractionDigits: 2})} ${data.returnCurr}
      </span>
    </div>
  `;
  
  scheduleCard.style.display = 'block';
  
  scheduleTable.querySelector('thead').innerHTML = `
    <tr>
      <th>فترة الاستحقاق</th>
      <th>تاريخ الاستحقاق</th>
      <th>نوع الاستحقاق</th>
      <th>المبلغ الأصلي</th>
      <th>مبلغ السداد المستحق</th>
      <th>القيمة التقريبية بالـ USD</th>
    </tr>
  `;
  
  scheduleTable.querySelector('tbody').innerHTML = data.schedule.map(item => {
    const isPrincipal = item.type === 'principal';
    
    return `
      <tr>
        <td style="font-family: var(--font-english); font-weight: 700;">الشهر ${item.period}</td>
        <td style="font-family: var(--font-english);">${item.date}</td>
        <td>
          <span class="badge ${isPrincipal ? 'badge-warning' : 'badge-success'}">
            ${isPrincipal ? t.principalReturn : t.payoutFunder}
          </span>
        </td>
        <td>
          <span style="font-family: var(--font-english); font-weight: 600;">
            ${item.originalAmount.toLocaleString(undefined, {maximumFractionDigits: 2})}
          </span>
          <span style="font-size: 0.75rem; color: var(--text-muted); margin-inline-start: 4px;">
            ${item.originalCurrency}
          </span>
        </td>
        <td style="font-weight: bold; color: ${isPrincipal ? 'var(--text-primary)' : 'var(--color-gold)'}">
          <span style="font-family: var(--font-english);">
            ${item.payableAmount.toLocaleString(undefined, {maximumFractionDigits: 2})}
          </span>
          <span style="font-size: 0.8rem; margin-inline-start: 4px;">
            ${item.payableCurrency}
          </span>
        </td>
        <td style="font-family: var(--font-english); color: var(--text-secondary);">
          $${item.valUSD.toLocaleString(undefined, {maximumFractionDigits: 2})}
        </td>
      </tr>
    `;
  }).join('');
  
  lucide.createIcons();
}

// --- CHART.JS RENDERING LOGIC ---
// --- CHART.JS RENDERING LOGIC ---
let activeChart = null;
let activeCapitalChart = null;
let activeBalanceChart = null;

function renderDashboardChart() {
  const ctx = document.getElementById('arbitrageChart');
  if (!ctx) return;
  
  const t = translations[state.activeLanguage];
  
  if (activeChart) activeChart.destroy();
  if (activeCapitalChart) activeCapitalChart.destroy();
  if (activeBalanceChart) activeBalanceChart.destroy();
  
  const isBeige = state.theme === 'beige';
  const labelColor = isBeige ? '#2d2621' : '#f8fafc';
  const gridColor = isBeige ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
  const tickColor = isBeige ? '#5c524b' : '#94a3b8';
  
  const months = [];
  const today = new Date();
  for (let i = 0; i < 6; i++) {
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + i, 1);
    months.push(nextMonth.toLocaleDateString(state.activeLanguage === 'ar' ? 'ar-EG' : 'en-US', {
      month: 'short', year: '2-digit'
    }));
  }
  
  const monthlyInflows = new Array(6).fill(0);
  const monthlyOutflows = new Array(6).fill(0);
  const netArbitrage = new Array(6).fill(0);
  
  state.contracts.forEach(cnt => {
    if (cnt.status === 'completed') return;
    
    const monthlyDiv = calculateMonthlyReturn(cnt);
    const monthlyDivUSD = convertToUSD(monthlyDiv, cnt.returnCurrency);
    const start = new Date(cnt.startDate);
    
    for (let i = 0; i < 6; i++) {
      const targetMonth = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const diffMonths = (targetMonth.getFullYear() - start.getFullYear()) * 12 + (targetMonth.getMonth() - start.getMonth());
      
      if (diffMonths >= 0 && diffMonths < cnt.duration) {
        if (cnt.type === 'creditor') {
          monthlyOutflows[i] += monthlyDivUSD;
        } else {
          monthlyInflows[i] += monthlyDivUSD;
        }
      }
    }
  });
  
  for (let i = 0; i < 6; i++) {
    netArbitrage[i] = monthlyInflows[i] - monthlyOutflows[i];
  }
  
  const goldColor = '#d4af37';
  const successColor = '#10b981';
  const dangerColor = '#ef4444';
  
  activeChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: t.chartInflow,
          data: monthlyInflows,
          backgroundColor: 'rgba(16, 185, 129, 0.45)',
          borderColor: successColor,
          borderWidth: 1.5,
          borderRadius: 4
        },
        {
          label: t.chartOutflow,
          data: monthlyOutflows,
          backgroundColor: 'rgba(239, 68, 68, 0.45)',
          borderColor: dangerColor,
          borderWidth: 1.5,
          borderRadius: 4
        },
        {
          label: t.chartNet,
          data: netArbitrage,
          type: 'line',
          borderColor: goldColor,
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointBackgroundColor: goldColor,
          pointBorderColor: '#fff',
          pointHoverRadius: 6,
          fill: false,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            color: gridColor
          },
          ticks: {
            color: tickColor,
            font: {
              family: 'Tajawal'
            }
          }
        },
        y: {
          grid: {
            color: gridColor
          },
          ticks: {
            color: tickColor,
            font: {
              family: 'Tajawal'
            },
            callback: function(value) {
              return '$' + value.toLocaleString();
            }
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: labelColor,
            font: {
              family: 'Tajawal'
            }
          }
        },
        tooltip: {
          titleFont: {
            family: 'Tajawal'
          },
          bodyFont: {
            family: 'Tajawal'
          },
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += '$' + context.parsed.y.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' USD';
              }
              return label;
            }
          }
        }
      }
    }
  });

  // --- DONUT CHARTS LOGIC ---
  const donutColors = [
    'rgba(174, 124, 80, 0.65)',  // Gold
    'rgba(16, 185, 129, 0.65)',  // Green
    'rgba(59, 130, 246, 0.65)',  // Blue
    'rgba(245, 158, 11, 0.65)',  // Orange
    'rgba(139, 92, 246, 0.65)',  // Purple
    'rgba(236, 72, 153, 0.65)',  // Pink
    'rgba(20, 184, 166, 0.65)',  // Teal
    'rgba(100, 116, 139, 0.65)'  // Slate
  ];
  const donutBorders = [
    '#ae7c50',
    '#10b981',
    '#3b82f6',
    '#f59e0b',
    '#8b5cf6',
    '#ec4899',
    '#14b8a6',
    '#64748b'
  ];

  // 1. Capital share donut
  const partnerCapital = {};
  state.contracts.forEach(c => {
    if (c.status === 'completed') return;
    const name = c.partyName.trim();
    const capUSD = convertToUSD(c.principal, c.principalCurrency);
    partnerCapital[name] = (partnerCapital[name] || 0) + capUSD;
  });

  let capLabels = Object.keys(partnerCapital);
  let capData = Object.values(partnerCapital);

  if (capLabels.length === 0) {
    capLabels = [state.activeLanguage === 'ar' ? 'لا توجد عقود نشطة' : 'No Active Contracts'];
    capData = [0];
  }

  const capCanvas = document.getElementById('capitalDonutChart');
  if (capCanvas) {
    activeCapitalChart = new Chart(capCanvas, {
      type: 'doughnut',
      data: {
        labels: capLabels,
        datasets: [{
          data: capData,
          backgroundColor: donutColors.slice(0, capLabels.length),
          borderColor: donutBorders.slice(0, capLabels.length),
          borderWidth: 1.5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            rtl: state.activeLanguage === 'ar',
            labels: {
              color: labelColor,
              font: { family: 'Tajawal', size: 11 }
            }
          },
          tooltip: {
            titleFont: { family: 'Tajawal' },
            bodyFont: { family: 'Tajawal' },
            callbacks: {
              label: function(context) {
                const val = context.parsed;
                return ' ' + context.label + ': $' + val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' USD';
              }
            }
          }
        }
      }
    });
  }

  // 2. Outstanding balance share donut
  const balObj = {};
  const consolidated = getConsolidatedBalances();

  consolidated.creditors.forEach(cb => {
    let balUSD = 0;
    Object.keys(cb.balances).forEach(curr => {
      balUSD += convertToUSD(cb.balances[curr], curr);
    });
    if (Math.abs(balUSD) > 0.01) {
      const name = cb.partyName.trim();
      balObj[name] = (balObj[name] || 0) + Math.abs(balUSD);
    }
  });

  consolidated.debtors.forEach(db => {
    let balUSD = 0;
    Object.keys(db.balances).forEach(curr => {
      balUSD += convertToUSD(db.balances[curr], curr);
    });
    if (Math.abs(balUSD) > 0.01) {
      const name = db.partyName.trim();
      balObj[name] = (balObj[name] || 0) + Math.abs(balUSD);
    }
  });

  let balLabels = Object.keys(balObj);
  let balData = Object.values(balObj);

  if (balLabels.length === 0) {
    balLabels = [state.activeLanguage === 'ar' ? 'لا توجد مستحقات معلقة' : 'No Outstanding Balances'];
    balData = [0];
  }

  const balCanvas = document.getElementById('balanceDonutChart');
  if (balCanvas) {
    activeBalanceChart = new Chart(balCanvas, {
      type: 'doughnut',
      data: {
        labels: balLabels,
        datasets: [{
          data: balData,
          backgroundColor: donutColors.slice(0, balLabels.length),
          borderColor: donutBorders.slice(0, balLabels.length),
          borderWidth: 1.5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            rtl: state.activeLanguage === 'ar',
            labels: {
              color: labelColor,
              font: { family: 'Tajawal', size: 11 }
            }
          },
          tooltip: {
            titleFont: { family: 'Tajawal' },
            bodyFont: { family: 'Tajawal' },
            callbacks: {
              label: function(context) {
                const val = context.parsed;
                return ' ' + context.label + ': $' + val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' USD';
              }
            }
          }
        }
      }
    });
  }
}

// --- SYSTEM INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.getElementById('app');
  if (!appContainer) return; // Exit if run inside unit test page
  
  try {
    loadState();
    
    // Set html document defaults
    document.documentElement.lang = state.activeLanguage || 'ar';
    document.documentElement.dir = (state.activeLanguage || 'ar') === 'ar' ? 'rtl' : 'ltr';
    
    // Initialize ledger accounts and verify outstanding dues
    initMockTransactions();
    
    renderApp();
  } catch (err) {
    console.error("Critical initialization error, resetting state in-memory only (local storage preserved):", err);
    
    // Fallback state
    state = {
      activeLanguage: 'ar',
      activeTab: 'dashboard',
      exchangeRates: {
        USD: 1.0,
        IQD: 1450.0,
        EUR: 0.92,
        AED: 3.67
      },
      contracts: [...defaultContracts],
      transactions: []
    };
    
    try {
      initMockTransactions();
  
      renderApp();
    } catch (innerErr) {
      console.error("Failed to render even with default state:", innerErr);
      appContainer.innerHTML = `
        <div style="padding: 40px; color: #ef4444; text-align: center; font-family: 'Tajawal', sans-serif;">
          <h3 style="margin-bottom: 10px;">حدث خطأ غير متوقع أثناء تحميل المنصة</h3>
          <p>يرجى مسح ذاكرة التخزين المؤقت للمتصفح (Clear Browser Cache) وإعادة المحاولة.</p>
        </div>
      `;
    }
  }
  
  // Start Rolex Clock updater interval
  setInterval(updateRolexClock, 1000);
});

// --- FORMAL PRINTABLE CONTRACT MODAL ENGINE ---
function showPrintContractModal(contractId) {
  const contract = state.contracts.find(c => c.id === contractId);
  if (!contract) return;

  const t = translations[state.activeLanguage];
  const formattedPrincipal = contract.principal.toLocaleString();
  const tafqeetText = state.activeLanguage === 'ar' 
    ? tafqeetArabic(contract.principal, contract.principalCurrency) 
    : tafqeetEnglish(contract.principal, contract.principalCurrency);
  
  const monthlyReturn = calculateMonthlyReturn(contract);
  
  const modalBackdrop = document.createElement('div');
  modalBackdrop.className = 'modal-backdrop';
  modalBackdrop.id = 'contract-print-modal-container';
  
  const modal = document.createElement('div');
  modal.className = 'print-contract-modal';
  
  const contractText = state.activeLanguage === 'ar' ? `
    <div class="contract-paper" dir="rtl">
      <div class="contract-title">عقد مضاربة استثماري شرعي</div>
      
      <div class="contract-section">
        <p><strong>إنه في يوم:</strong> ${contract.startDate}، تم الاتفاق والتعاقد والتراضي بين كل من الطرفين التاليين:</p>
      </div>
      
      <div class="contract-section">
        <h4>الطرف الأول (المضارب):</h4>
        <p>شركة جيدو للحلول البرمجية (Jido-IT) ويمثلها المدير المسؤول بصفته مضارباً بالجهد والعمل في تشغيل الأموال.</p>
      </div>
      
      <div class="contract-section">
        <h4>الطرف الثاني (رب المال / الممول):</h4>
        <p>السيد/السيدة: <strong>${contract.partyName}</strong> بصفته مالكاً وممولاً لرأس المال.</p>
      </div>
      
      <div class="contract-section">
        <h4>بند 1: رأس المال المقدم (Principal)</h4>
        <p>قدم الطرف الثاني (رب المال) للطرف الأول (المضارب) مبلغاً وقدره <strong>${formattedPrincipal} ${contract.principalCurrency}</strong> (فقط <strong>${tafqeetText}</strong>) للتشغيل في الأعمال التجارية والاستثمارية المشروعة التابعة للطرف الأول.</p>
      </div>
      
      <div class="contract-section">
        <h4>بند 2: العوائد والأرباح الشرعية (Sulh Dividend)</h4>
        <p>اتفق الطرفان على توزيع أرباح شهرية دورية ناتجة عن فروقات الصرف العكسي تُدفع بالعملة العكسية وهي <strong>${contract.returnCurrency}</strong>.
        ${contract.dividendType === 'fixed' 
          ? `وقد تم تحديد العائد الشهري بمبلغ مقطوع وقدره <strong>${contract.monthlyDividendAmount.toLocaleString()} ${contract.returnCurrency}</strong> لكل $10,000 استثمار.` 
          : `وقد تم تحديد العائد السنوي بنسبة <strong>%${contract.dividendRate}</strong> متناسبة مع رأس المال المودع.`}
        تُصرف هذه الأرباح بصفة دورية عند نهاية كل شهر مالي.</p>
      </div>
      
      <div class="contract-section">
        <h4>بند 3: مدة العقد ونفاذه</h4>
        <p>مدة هذا العقد <strong>${contract.duration} شهراً</strong> تبدأ من تاريخ <strong>${contract.startDate}</strong> وتنتهي بحلول نهاية المدة المتفق عليها، حيث يلتزم الطرف الأول برد رأس المال الأصلي للطرف الثاني.</p>
      </div>
      
      <div class="contract-section">
        <h4>بند 4: الإقرار والضوابط الشرعية</h4>
        <p>يقر الطرفان بمعرفتهما التامة بضوابط عقد المضاربة الشرعي وعقود الصرف العكسي المعتمدة، وأن هذا العقد محكوم بنظام الشريعة والضوابط المعتمدة في دولة التشغيل.</p>
      </div>
      
      ${contract.notes ? `
      <div class="contract-section">
        <h4>ملاحظات إضافية وشروط خاصة:</h4>
        <p style="white-space: pre-wrap;">${contract.notes}</p>
      </div>
      ` : ''}
      
      <div class="contract-signatures">
        <div class="signature-line">
          <p>توقيع الطرف الأول (المضارب)</p>
          <div class="signature-border"></div>
        </div>
        <div class="signature-line">
          <p>توقيع الطرف الثاني (رب المال)</p>
          <div class="signature-border"></div>
        </div>
      </div>
    </div>
  ` : `
    <div class="contract-paper" dir="ltr">
      <div class="contract-title">SHARIA INVESTMENT MUDARABAH CONTRACT</div>
      
      <div class="contract-section">
        <p>This agreement is entered into on <strong>${contract.startDate}</strong> by and between:</p>
      </div>
      
      <div class="contract-section">
        <h4>First Party (Al-Mudarib / Operator):</h4>
        <p>Jido-IT Software Solutions, represented by the managing director, acting as the operating partner.</p>
      </div>
      
      <div class="contract-section">
        <h4>Second Party (Rab-Al-Mal / Funder):</h4>
        <p>Mr./Mrs. <strong>${contract.partyName}</strong>, acting as the investing partner.</p>
      </div>
      
      <div class="contract-section">
        <h4>Clause 1: Principal Capital</h4>
        <p>The Second Party has provided the First Party a capital sum of <strong>${formattedPrincipal} ${contract.principalCurrency}</strong> (<strong>${tafqeetText}</strong>) for operations in Sharia-compliant business activities managed by the First Party.</p>
      </div>
      
      <div class="contract-section">
        <h4>Clause 2: Dividends and Profits</h4>
        <p>The parties agree that profits generated from inverse currency benefits will be distributed in the inverse return currency, namely <strong>${contract.returnCurrency}</strong>.
        ${contract.dividendType === 'fixed'
          ? `The monthly dividend is set at <strong>${contract.monthlyDividendAmount.toLocaleString()} ${contract.returnCurrency}</strong> per $10,000 principal.`
          : `The annual dividend rate is set at <strong>${contract.dividendRate}%</strong> per annum of the principal capital.`}
        Dividends are distributed monthly at the end of each billing cycle.</p>
      </div>
      
      <div class="contract-section">
        <h4>Clause 3: Contract Duration</h4>
        <p>This contract is valid for a duration of <strong>${contract.duration} months</strong>, starting on <strong>${contract.startDate}</strong>, after which the principal capital will be recovered by the Second Party.</p>
      </div>
      
      ${contract.notes ? `
      <div class="contract-section">
        <h4>Additional Notes & Special Conditions:</h4>
        <p style="white-space: pre-wrap;">${contract.notes}</p>
      </div>
      ` : ''}
      
      <div class="contract-signatures">
        <div class="signature-line">
          <p>First Party (Al-Mudarib)</p>
          <div class="signature-border"></div>
        </div>
        <div class="signature-line">
          <p>Second Party (Rab-Al-Mal)</p>
          <div class="signature-border"></div>
        </div>
      </div>
    </div>
  `;
  
  modal.innerHTML = `
    <div class="modal-actions no-print" style="display: flex; justify-content: flex-end; gap: 10px;">
      <button class="btn btn-primary" id="btn-do-print-contract">
        <i data-lucide="printer"></i>
        <span>${state.activeLanguage === 'ar' ? 'طباعة العقد' : 'Print'}</span>
      </button>
      <button class="btn btn-secondary" id="btn-close-print-modal">
        <span>${state.activeLanguage === 'ar' ? 'إلغاء' : 'Close'}</span>
      </button>
    </div>
    
    <div id="printable-contract-document">
      ${contractText}
    </div>
  `;
  
  modalBackdrop.appendChild(modal);
  document.body.appendChild(modalBackdrop);
  lucide.createIcons();
  
  // Event listeners
  document.getElementById('btn-close-print-modal').addEventListener('click', () => {
    document.body.removeChild(modalBackdrop);
  });
  
  document.getElementById('btn-do-print-contract').addEventListener('click', () => {
    window.print();
  });
}
