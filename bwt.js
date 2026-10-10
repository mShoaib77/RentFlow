<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>RentFlow - Landlord Rent Tracker</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <style>
    :root {
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --navy: #0f172a;
      --sidebar-bg: #0f172a;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --border: #e2e8f0;
      --text: #0f172a;
      --text-muted: #64748b;
      --success: #10b981;
      --success-bg: #ecfdf5;
      --warning: #f59e0b;
      --warning-bg: #fffbeb;
      --danger: #ef4444;
      --danger-bg: #fef2f2;
      --info: #6366f1;
      --info-bg: #eef2ff;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: var(--bg); color: var(--text); min-height: 100vh; display: flex; }
    
    /* Layout */
    .sidebar { width: 260px; background: var(--sidebar-bg); color: #cbd5e1; display: flex; flex-direction: column; position: fixed; inset: 0 auto 0 0; z-index: 40; }
    .brand { padding: 24px; border-bottom: 1px solid #1e293b; display: flex; items-center; gap: 12px; }
    .brand-logo { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); display: grid; place-items: center; color: white; font-weight: 900; font-size: 20px; }
    .brand h2 { font-size: 18px; color: white; line-height: 1.2; }
    .brand small { font-size: 10px; color: #94a3b8; letter-spacing: 1px; font-weight: 700; }
    
    .nav { padding: 20px 12px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
    .nav-label { font-size: 10px; font-weight: 800; color: #64748b; letter-spacing: 1.2px; padding: 0 12px 6px; text-transform: uppercase; }
    .nav button { background: transparent; border: 0; color: #94a3b8; text-align: left; padding: 12px 14px; border-radius: 10px; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: all 0.15s; }
    .nav button:hover { background: #1e293b; color: white; }
    .nav button.active { background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(37,99,235,0.25); }
    .nav-bottom { padding: 20px; border-top: 1px solid #1e293b; font-size: 12px; }
    .nav-user { display: flex; align-items: center; gap: 10px; }
    .avatar { width: 34px; height: 34px; border-radius: 8px; background: #334155; color: white; display: grid; place-items: center; font-weight: 700; }

    .main { margin-left: 260px; flex: 1; min-height: 100vh; display: flex; flex-direction: column; }
    .topbar { background: white; border-bottom: 1px solid var(--border); padding: 16px 32px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 30; }
    .topbar h1 { font-size: 20px; font-weight: 800; }
    .topbar p { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .topbar-actions { display: flex; gap: 10px; align-items: center; }

    .content { padding: 32px; max-width: 1400px; width: 100%; margin: 0 auto; flex: 1; display: flex; flex-direction: column; gap: 24px; }
    .panel { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }

    /* Buttons & Inputs */
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 700; border: 0; cursor: pointer; transition: all 0.15s; }
    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:hover { background: var(--primary-hover); }
    .btn-secondary { background: #f1f5f9; color: #334155; }
    .btn-secondary:hover { background: #e2e8f0; }
    .btn-danger { background: var(--danger-bg); color: var(--danger); border: 1px solid #fecaca; }
    .btn-sm { padding: 6px 12px; font-size: 11px; border-radius: 8px; }

    input, select, textarea { width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: 10px; font-size: 13px; background: white; color: var(--text); outline: none; }
    input:focus, select:focus, textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37,99,235,0.15); }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-top: 16px; }
    .form-group label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px; }

    /* KPIs */
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .kpi-card { background: white; border: 1px solid var(--border); border-radius: 16px; padding: 20px; }
    .kpi-head { display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); }
    .kpi-val { font-size: 26px; font-weight: 900; margin: 12px 0 4px; }
    .kpi-desc { font-size: 11px; color: var(--text-muted); }

    /* Tables */
    .table-container { width: 100%; overflow-x: auto; margin-top: 16px; }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
    th { padding: 12px 16px; background: #f8fafc; font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; border-bottom: 1px solid var(--border); }
    td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
    tr:hover td { background: #fafafa; }

    /* Badges */
    .badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 800; }
    .badge-paid { background: var(--success-bg); color: var(--success); border: 1px solid #a7f3d0; }
    .badge-partial { background: var(--info-bg); color: var(--info); border: 1px solid #c7d2fe; }
    .badge-pending { background: var(--warning-bg); color: var(--warning); border: 1px solid #fde68a; }
    .badge-overdue { background: var(--danger-bg); color: var(--danger); border: 1px solid #fecaca; }

    /* Progress bar */
    .progress-bar-wrap { height: 10px; background: #e2e8f0; border-radius: 99px; overflow: hidden; margin: 16px 0 8px; }
    .progress-bar-fill { height: 100%; background: linear-gradient(90deg, #3b82f6, #1d4ed8); border-radius: 99px; transition: width 0.3s; }

    /* Modals */
    .modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(4px); z-index: 50; display: none; place-items: center; padding: 16px; }
    .modal-overlay.open { display: grid; }
    .modal { background: white; border-radius: 20px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; padding: 28px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
    .modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 14px; }
    .modal-head h3 { font-size: 18px; font-weight: 800; }
    .close-btn { background: transparent; border: 0; font-size: 20px; cursor: pointer; color: #94a3b8; }

    /* Property Cards */
    .prop-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .prop-card { background: white; border: 1px solid var(--border); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; gap: 16px; }

    .hidden { display: none !important; }
    @media (max-width: 900px) {
      .kpi-grid { grid-template-columns: repeat(2, 1fr); }
      .sidebar { width: 80px; }
      .sidebar .brand h2, .sidebar .brand small, .sidebar .nav-label, .sidebar .nav button span, .sidebar .nav-user div { display: none; }
      .main { margin-left: 80px; }
    }
  </style>
</head>
<body>

  <!-- Sidebar -->
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-logo">R</div>
      <div>
        <h2>RentFlow</h2>
        <small>LANDLORD TRACKER</small>
      </div>
    </div>
    <div class="nav">
      <span class="nav-label">Workspace</span>
      <button class="active" onclick="switchTab('dashboard')"><span>📊</span> <span>Dashboard</span></button>
      <button onclick="switchTab('rent')"><span>📅</span> <span>Rent Status</span></button>
      <button onclick="switchTab('payments')"><span>💳</span> <span>Payments & Receipts</span></button>
      <button onclick="switchTab('tenants')"><span>👥</span> <span>Tenants Directory</span></button>
      <button onclick="switchTab('properties')"><span>🏢</span> <span>Properties</span></button>
    </div>
    <div class="nav-bottom">
      <div class="nav-user">
        <div class="avatar">L</div>
        <div>
          <strong>John Sterling</strong><br>
          <small style="color:#64748b">Landlord Account</small>
        </div>
      </div>
    </div>
  </aside>

  <!-- Main Workspace -->
  <main class="main">
    <header class="topbar">
      <div>
        <h1 id="pageTitle">Dashboard</h1>
        <p id="pageSubtitle">Complete monthly overview of rent collections and tenant dues</p>
      </div>
      <div class="topbar-actions">
        <label style="font-size:12px; font-weight:700; color:var(--text-muted)">CYCLE:
          <input id="globalMonth" type="month" style="width:auto; padding:6px 10px;" onchange="handleMonthChange(this.value)">
        </label>
        <button class="btn btn-primary btn-sm" onclick="openPaymentModal()">+ Record Payment</button>
      </div>
    </header>

    <div class="content">

      <!-- 1. DASHBOARD TAB -->
      <section id="tab-dashboard" class="tab-pane">
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-head"><span>Expected Rent</span> <span>💵</span></div>
            <div class="kpi-val" id="kpiExpected">$0</div>
            <div class="kpi-desc" id="kpiTenantsCount">0 active tenants</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-head"><span style="color:var(--success)">Collected Rent</span> <span>↗</span></div>
            <div class="kpi-val" style="color:var(--success)" id="kpiCollected">$0</div>
            <div class="kpi-desc" id="kpiRate">0% collection rate</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-head"><span style="color:var(--warning)">Pending Balance</span> <span>⏱</span></div>
            <div class="kpi-val" style="color:var(--warning)" id="kpiPending">$0</div>
            <div class="kpi-desc" id="kpiPendingCount">0 tenants pending</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-head"><span style="color:var(--danger)">Overdue Rent</span> <span>⚠️</span></div>
            <div class="kpi-val" style="color:var(--danger)" id="kpiOverdue">0</div>
            <div class="kpi-desc" id="kpiOverdueDesc">Past scheduled due day</div>
          </div>
        </div>

        <div class="panel" style="margin-top: 20px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3>Monthly Rent Collection Progress</h3>
            <span class="badge badge-paid" id="dashRateBadge">0% Collected</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" id="dashProgressBar" style="width: 0%"></div>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:12px; color:var(--text-muted);">
            <span id="progressCollectedLabel">$0 collected</span>
            <span id="progressTargetLabel">$0 target</span>
          </div>
        </div>

        <div class="panel" style="margin-top: 20px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <h3>Rent Status Breakdown This Month</h3>
            <button class="btn btn-secondary btn-sm" onclick="switchTab('rent')">View Full Status Table →</button>
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Property</th>
                  <th>Monthly Rent</th>
                  <th>Paid This Month</th>
                  <th>Balance Due</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="dashTableRows"></tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- 2. RENT STATUS TAB -->
      <section id="tab-rent" class="tab-pane hidden">
        <div class="panel">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div>
              <h3>Monthly Tenant Rent Reconciliation</h3>
              <p style="font-size:12px; color:var(--text-muted)">Live status tracking: Paid in Full, Partially Paid, Pending, or Overdue</p>
            </div>
            <div style="display:flex; gap:10px;">
              <select id="rentStatusFilter" onchange="renderRentStatus()" style="width:160px;">
                <option value="All">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Tenant Name</th>
                  <th>Property & Unit</th>
                  <th>Monthly Rent</th>
                  <th>Paid So Far</th>
                  <th>Outstanding</th>
                  <th>Due Day</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="rentTableRows"></tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- 3. PAYMENTS & RECEIPTS TAB -->
      <section id="tab-payments" class="tab-pane hidden">
        <div class="panel">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <div>
              <h3>Payment Transactions & PDF Receipts</h3>
              <p style="font-size:12px; color:var(--text-muted)">Audit log of all payments with instant PDF receipt download</p>
            </div>
            <button class="btn btn-primary btn-sm" onclick="openPaymentModal()">+ Record Payment</button>
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Receipt No</th>
                  <th>Tenant</th>
                  <th>Rent Month</th>
                  <th>Date Paid</th>
                  <th>Payment Mode</th>
                  <th>Amount</th>
                  <th>PDF Receipt</th>
                </tr>
              </thead>
              <tbody id="paymentTableRows"></tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- 4. TENANTS DIRECTORY TAB -->
      <section id="tab-tenants" class="tab-pane hidden">
        <div class="panel">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <div>
              <h3>Tenants Directory</h3>
              <p style="font-size:12px; color:var(--text-muted)">Manage tenant leases, monthly rents, due dates, deposits, and move-outs</p>
            </div>
            <button class="btn btn-primary btn-sm" onclick="openTenantModal()">+ Register Tenant</button>
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Property & Flat</th>
                  <th>Monthly Rent</th>
                  <th>Due Day</th>
                  <th>Deposit</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="tenantTableRows"></tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- 5. PROPERTIES TAB -->
      <section id="tab-properties" class="tab-pane hidden">
        <div class="panel" style="margin-bottom: 20px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <h3>Your Property Portfolio</h3>
              <p style="font-size:12px; color:var(--text-muted)">Manage buildings, complexes, and addresses</p>
            </div>
            <button class="btn btn-primary btn-sm" onclick="openPropertyModal()">+ Add Property</button>
          </div>
        </div>
        <div class="prop-grid" id="propCardsContainer"></div>
      </section>

    </div>
  </main>

  <!-- MODAL: RECORD PAYMENT -->
  <div class="modal-overlay" id="paymentModal">
    <div class="modal">
      <div class="modal-head">
        <h3>Record Rent Payment</h3>
        <button class="close-btn" onclick="closeModal('paymentModal')">&times;</button>
      </div>
      <form onsubmit="handleRecordPayment(event)">
        <div class="form-group">
          <label>Select Tenant *</label>
          <select id="payTenantSelect" required onchange="updatePayFormPreview()"></select>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label>Rent Month *</label>
            <input type="month" id="payMonth" required onchange="updatePayFormPreview()" />
          </div>
          <div class="form-group">
            <label>Amount Paid ($) *</label>
            <input type="number" step="0.01" min="1" id="payAmount" required placeholder="0.00" />
          </div>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label>Date Received *</label>
            <input type="date" id="payDate" required />
          </div>
          <div class="form-group">
            <label>Payment Mode *</label>
            <select id="payMode">
              <option value="UPI">UPI / Instant Transfer</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
              <option value="Card">Card</option>
            </select>
          </div>
        </div>
        <div class="form-group" style="margin-top:14px;">
          <label>Reference / Note</label>
          <input type="text" id="payNotes" placeholder="e.g. UPI Ref / Cheque #4012" />
        </div>
        <div id="payPreviewBox" style="margin-top:16px; padding:12px; background:#eff6ff; border-radius:10px; font-size:12px; color:#1e40af;"></div>
        <div style="margin-top:20px; display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" class="btn btn-secondary" onclick="closeModal('paymentModal')">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Payment & Generate PDF</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: ADD / EDIT TENANT -->
  <div class="modal-overlay" id="tenantModal">
    <div class="modal">
      <div class="modal-head">
        <h3 id="tenantModalTitle">Register Tenant</h3>
        <button class="close-btn" onclick="closeModal('tenantModal')">&times;</button>
      </div>
      <form onsubmit="handleSaveTenant(event)">
        <input type="hidden" id="tenantEditId" />
        <div class="form-group">
          <label>Assigned Property *</label>
          <select id="tenantProperty" required></select>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label>Full Name *</label>
            <input type="text" id="tenantName" required placeholder="Tenant Name" />
          </div>
          <div class="form-group">
            <label>Phone Number *</label>
            <input type="tel" id="tenantPhone" required placeholder="+1 (555) 000-0000" />
          </div>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label>Flat / Unit / Room</label>
            <input type="text" id="tenantRoom" placeholder="e.g. Flat 301" />
          </div>
          <div class="form-group">
            <label>Monthly Rent ($) *</label>
            <input type="number" step="0.01" min="1" id="tenantRent" required placeholder="1200" />
          </div>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label>Rent Due Day (1-31) *</label>
            <input type="number" min="1" max="31" id="tenantDue" value="5" required />
          </div>
          <div class="form-group">
            <label>Security Deposit ($)</label>
            <input type="number" step="0.01" min="0" id="tenantDeposit" value="0" />
          </div>
        </div>
        <div style="margin-top:20px; display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" class="btn btn-secondary" onclick="closeModal('tenantModal')">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Tenant</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: ADD PROPERTY -->
  <div class="modal-overlay" id="propertyModal">
    <div class="modal" style="max-width: 450px;">
      <div class="modal-head">
        <h3>Add Property</h3>
        <button class="close-btn" onclick="closeModal('propertyModal')">&times;</button>
      </div>
      <form onsubmit="handleSaveProperty(event)">
        <div class="form-group">
          <label>Property Name *</label>
          <input type="text" id="propName" required placeholder="e.g. Skyline Heights" />
        </div>
        <div class="form-group" style="margin-top:14px;">
          <label>Full Address *</label>
          <textarea rows="3" id="propAddress" required placeholder="Street, area, city"></textarea>
        </div>
        <div style="margin-top:20px; display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" class="btn btn-secondary" onclick="closeModal('propertyModal')">Cancel</button>
          <button type="submit" class="btn btn-primary">Create Property</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: TENANT HISTORY -->
  <div class="modal-overlay" id="historyModal">
    <div class="modal" style="max-width: 700px;">
      <div class="modal-head">
        <h3 id="historyTitle">Tenant Payment Ledger</h3>
        <button class="close-btn" onclick="closeModal('historyModal')">&times;</button>
      </div>
      <div id="historyDetails" style="margin-bottom:16px; font-size:13px; color:var(--text-muted);"></div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Receipt</th>
              <th>Month</th>
              <th>Date</th>
              <th>Mode</th>
              <th>Amount</th>
              <th>PDF</th>
            </tr>
          </thead>
          <tbody id="historyRows"></tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- JAVASCRIPT LOGIC (SQLite Data Engine, PDF Generator & Reactivity) -->
  <script>
    // In-memory Database with seed data
    const now = new Date();
    const curMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    let db = {
      properties: [
        { id: 1, name: "Skyline Heights", address: "104 Boulevard Avenue, Metro City" },
        { id: 2, name: "Pineview Apartments", address: "12 Evergreen Lane, Metro City" }
      ],
      tenants: [
        { id: 1, propertyId: 1, name: "Sarah Jenkins", phone: "+1 (555) 234-5678", rent: 1450, dueDay: 5, deposit: 2900, active: 1, room: "Apt 301" },
        { id: 2, propertyId: 1, name: "Marcus Vance", phone: "+1 (555) 345-6789", rent: 1200, dueDay: 5, deposit: 2400, active: 1, room: "Apt 104" },
        { id: 3, propertyId: 2, name: "Elena Rostova", phone: "+1 (555) 456-7890", rent: 1600, dueDay: 10, deposit: 3200, active: 1, room: "Suite 2B" },
        { id: 4, propertyId: 2, name: "David Kim", phone: "+1 (555) 567-8901", rent: 1100, dueDay: 15, deposit: 2200, active: 1, room: "Flat 12" }
      ],
      payments: [
        { id: 1, tenantId: 1, month: curMonth, amount: 1450, date: todayStr, mode: "Bank Transfer", receiptNo: "REC-2026-001", notes: "Full payment" },
        { id: 2, tenantId: 2, month: curMonth, amount: 600, date: todayStr, mode: "UPI", receiptNo: "REC-2026-002", notes: "Partial installment" }
      ]
    };

    let selectedMonth = curMonth;

    function init() {
      document.getElementById('globalMonth').value = curMonth;
      document.getElementById('payMonth').value = curMonth;
      document.getElementById('payDate').value = todayStr;
      renderAll();
    }

    function handleMonthChange(val) {
      selectedMonth = val;
      renderAll();
    }

    function switchTab(tabId) {
      document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('hidden'));
      document.getElementById(`tab-${tabId}`).classList.remove('hidden');
      document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'));
      const activeBtn = Array.from(document.querySelectorAll('.nav button')).find(b => b.getAttribute('onclick')?.includes(tabId));
      if (activeBtn) activeBtn.classList.add('active');
      const titles = { dashboard: 'Dashboard', rent: 'Rent Status', payments: 'Payments & Receipts', tenants: 'Tenants Directory', properties: 'Properties' };
      document.getElementById('pageTitle').innerText = titles[tabId];
    }

    function getPaidForTenantMonth(tId, month) {
      return db.payments
        .filter(p => p.tenantId === tId && p.month === month)
        .reduce((sum, p) => sum + Number(p.amount), 0);
    }

    function getTenantStatus(tenant, month) {
      const paid = getPaidForTenantMonth(tenant.id, month);
      if (paid >= tenant.rent) return 'Paid';
      if (paid > 0) return 'Partially Paid';
      const [y, m] = month.split('-').map(Number);
      const lastDay = new Date(y, m, 0).getDate();
      const actualDueDay = Math.min(tenant.dueDay, lastDay);
      const dueDate = new Date(y, m - 1, actualDueDay, 23, 59, 59);
      return new Date().getTime() > dueDate.getTime() ? 'Overdue' : 'Pending';
    }

    function getStatusBadge(status) {
      switch (status) {
        case 'Paid': return `<span class="badge badge-paid">✓ Paid</span>`;
        case 'Partially Paid': return `<span class="badge badge-partial">⏱ Partial</span>`;
        case 'Pending': return `<span class="badge badge-pending">⏱ Pending</span>`;
        case 'Overdue': return `<span class="badge badge-overdue">⚠️ Overdue</span>`;
      }
    }

    function renderAll() {
      renderDashboard();
      renderRentStatus();
      renderPayments();
      renderTenants();
      renderProperties();
    }

    // 1. Dashboard
    function renderDashboard() {
      const activeTenants = db.tenants.filter(t => t.active === 1);
      const expected = activeTenants.reduce((s, t) => s + t.rent, 0);
      const collected = activeTenants.reduce((s, t) => s + getPaidForTenantMonth(t.id, selectedMonth), 0);
      const pending = Math.max(0, expected - collected);
      const rate = expected > 0 ? Math.min(100, Math.round((collected / expected) * 100)) : 0;
      
      let overdueCount = 0;
      let pendingCount = 0;
      activeTenants.forEach(t => {
        const st = getTenantStatus(t, selectedMonth);
        if (st === 'Overdue') overdueCount++;
        if (st === 'Pending' || st === 'Partially Paid') pendingCount++;
      });

      document.getElementById('kpiExpected').innerText = `$${expected.toFixed(2)}`;
      document.getElementById('kpiTenantsCount').innerText = `${activeTenants.length} active tenants`;
      document.getElementById('kpiCollected').innerText = `$${collected.toFixed(2)}`;
      document.getElementById('kpiRate').innerText = `${rate}% collection rate`;
      document.getElementById('kpiPending').innerText = `$${pending.toFixed(2)}`;
      document.getElementById('kpiPendingCount').innerText = `${pendingCount} tenants pending`;
      document.getElementById('kpiOverdue').innerText = overdueCount;
      document.getElementById('kpiOverdueDesc').innerText = overdueCount === 0 ? "✓ None overdue" : "Immediate follow-up";

      document.getElementById('dashRateBadge').innerText = `${rate}% Collected`;
      document.getElementById('dashProgressBar').style.width = `${rate}%`;
      document.getElementById('progressCollectedLabel').innerText = `$${collected.toFixed(2)} collected`;
      document.getElementById('progressTargetLabel').innerText = `$${expected.toFixed(2)} target`;

      const rows = activeTenants.map(t => {
        const prop = db.properties.find(p => p.id === t.propertyId);
        const paid = getPaidForTenantMonth(t.id, selectedMonth);
        const balance = Math.max(0, t.rent - paid);
        const status = getTenantStatus(t, selectedMonth);
        return `<tr>
          <td><strong>${t.name}</strong><br><small style="color:#64748b">${t.room || ''}</small></td>
          <td>${prop?.name || '—'}</td>
          <td>$${t.rent.toFixed(2)}</td>
          <td style="color:var(--success); font-weight:700;">$${paid.toFixed(2)}</td>
          <td style="color:${balance > 0 ? 'var(--danger)' : '#64748b'}; font-weight:700;">$${balance.toFixed(2)}</td>
          <td>${getStatusBadge(status)}</td>
          <td>${balance > 0 ? `<button class="btn btn-primary btn-sm" onclick="openPaymentForTenant(${t.id})">Pay</button>` : '✓'}</td>
        </tr>`;
      }).join('');
      document.getElementById('dashTableRows').innerHTML = rows || `<tr><td colspan="7" style="text-align:center; padding:20px; color:#64748b">No tenants registered yet.</td></tr>`;
    }

    // 2. Rent Status Table
    function renderRentStatus() {
      const filter = document.getElementById('rentStatusFilter').value;
      const activeTenants = db.tenants.filter(t => t.active === 1);
      const rows = activeTenants
        .map(t => {
          const prop = db.properties.find(p => p.id === t.propertyId);
          const paid = getPaidForTenantMonth(t.id, selectedMonth);
          const balance = Math.max(0, t.rent - paid);
          const status = getTenantStatus(t, selectedMonth);
          return { t, prop, paid, balance, status };
        })
        .filter(item => filter === 'All' || item.status === filter)
        .map(({ t, prop, paid, balance, status }) => {
          return `<tr>
            <td><strong>${t.name}</strong><br><small style="color:#64748b">${t.phone}</small></td>
            <td>${prop?.name || '—'} (${t.room || 'Standard'})</td>
            <td>$${t.rent.toFixed(2)}</td>
            <td style="color:var(--success); font-weight:700;">$${paid.toFixed(2)}</td>
            <td style="color:${balance > 0 ? 'var(--danger)' : '#64748b'}; font-weight:700;">$${balance.toFixed(2)}</td>
            <td>${t.dueDay}th of month</td>
            <td>${getStatusBadge(status)}</td>
            <td>
              <div style="display:flex; gap:6px;">
                ${balance > 0 ? `<button class="btn btn-primary btn-sm" onclick="openPaymentForTenant(${t.id})">Pay</button>` : ''}
                <button class="btn btn-secondary btn-sm" onclick="openHistoryModal(${t.id})">History</button>
              </div>
            </td>
          </tr>`;
        }).join('');
      document.getElementById('rentTableRows').innerHTML = rows || `<tr><td colspan="8" style="text-align:center; padding:20px; color:#64748b">No rent records found.</td></tr>`;
    }

    // 3. Payments
    function renderPayments() {
      const rows = [...db.payments].reverse().map(p => {
        const tenant = db.tenants.find(t => t.id === p.tenantId);
        return `<tr>
          <td><strong style="color:var(--primary); font-family:monospace">${p.receiptNo}</strong></td>
          <td><strong>${tenant?.name || 'Tenant'}</strong></td>
          <td>${p.month}</td>
          <td>${p.date}</td>
          <td><span style="background:#f1f5f9; padding:2px 8px; border-radius:4px; font-size:11px;">${p.mode}</span></td>
          <td style="color:var(--success); font-weight:800;">$${Number(p.amount).toFixed(2)}</td>
          <td>
            <button class="btn btn-primary btn-sm" onclick="downloadPdfReceipt(${p.id})">📥 Download PDF</button>
          </td>
        </tr>`;
      }).join('');
      document.getElementById('paymentTableRows').innerHTML = rows || `<tr><td colspan="7" style="text-align:center; padding:20px; color:#64748b">No payments recorded.</td></tr>`;
    }

    // 4. Tenants Directory
    function renderTenants() {
      const rows = db.tenants.map(t => {
        const prop = db.properties.find(p => p.id === t.propertyId);
        return `<tr>
          <td><strong>${t.name}</strong><br><small style="color:#64748b">${t.phone}</small></td>
          <td>${prop?.name || '—'} (${t.room || '—'})</td>
          <td>$${t.rent.toFixed(2)}</td>
          <td>${t.dueDay}th</td>
          <td>$${t.deposit.toFixed(2)}</td>
          <td>${t.active === 1 ? `<span class="badge badge-paid">Active</span>` : `<span class="badge badge-pending">Moved Out</span>`}</td>
          <td>
            <div style="display:flex; gap:6px;">
              <button class="btn btn-secondary btn-sm" onclick="openHistoryModal(${t.id})">History</button>
              <button class="btn btn-sm ${t.active === 1 ? 'btn-danger' : 'btn-primary'}" onclick="toggleTenantActive(${t.id})">
                ${t.active === 1 ? 'Move Out' : 'Reactivate'}
              </button>
            </div>
          </td>
        </tr>`;
      }).join('');
      document.getElementById('tenantTableRows').innerHTML = rows;
    }

    // 5. Properties
    function renderProperties() {
      const cards = db.properties.map(p => {
        const tCount = db.tenants.filter(t => t.propertyId === p.id && t.active === 1).length;
        const rev = db.tenants.filter(t => t.propertyId === p.id && t.active === 1).reduce((s, t) => s + t.rent, 0);
        return `<div class="prop-card">
          <div>
            <span style="font-size:24px;">🏢</span>
            <h3 style="margin-top:8px;">${p.name}</h3>
            <p style="font-size:12px; color:var(--text-muted); margin-top:4px;">📍 ${p.address}</p>
          </div>
          <div style="border-top:1px solid #f1f5f9; padding-top:12px; display:flex; justify-content:space-between; font-size:12px;">
            <span>Active Tenants: <strong>${tCount}</strong></span>
            <span style="color:var(--success); font-weight:800;">$${rev.toFixed(2)}/mo</span>
          </div>
        </div>`;
      }).join('');
      document.getElementById('propCardsContainer').innerHTML = cards;
    }

    // Handlers & Forms
    function openPaymentModal() {
      const select = document.getElementById('payTenantSelect');
      select.innerHTML = db.tenants.filter(t => t.active === 1).map(t => `<option value="${t.id}">${t.name} (${t.room || ''}) - $${t.rent}/mo</option>`).join('');
      document.getElementById('payMonth').value = selectedMonth;
      updatePayFormPreview();
      document.getElementById('paymentModal').classList.add('open');
    }

    function openPaymentForTenant(tId) {
      openPaymentModal();
      document.getElementById('payTenantSelect').value = tId;
      updatePayFormPreview();
    }

    function updatePayFormPreview() {
      const tId = Number(document.getElementById('payTenantSelect').value);
      const m = document.getElementById('payMonth').value;
      const tenant = db.tenants.find(t => t.id === tId);
      if (!tenant) return;
      const paid = getPaidForTenantMonth(tId, m);
      const remaining = Math.max(0, tenant.rent - paid);
      document.getElementById('payAmount').value = remaining > 0 ? remaining : tenant.rent;
      document.getElementById('payPreviewBox').innerHTML = `Monthly Rent: <strong>$${tenant.rent}</strong> | Paid this month: <strong>$${paid}</strong> | Outstanding balance: <strong>$${remaining}</strong>`;
    }

    function handleRecordPayment(e) {
      e.preventDefault();
      const tId = Number(document.getElementById('payTenantSelect').value);
      const m = document.getElementById('payMonth').value;
      const amt = parseFloat(document.getElementById('payAmount').value);
      const dt = document.getElementById('payDate').value;
      const mode = document.getElementById('payMode').value;
      const notes = document.getElementById('payNotes').value;
      const receiptNo = `REC-${m.replace('-','')}-${Math.floor(1000 + Math.random() * 9000)}`;

      const newPay = { id: db.payments.length + 1, tenantId: tId, month: m, amount: amt, date: dt, mode, receiptNo, notes };
      db.payments.push(newPay);
      closeModal('paymentModal');
      renderAll();
      downloadPdfReceipt(newPay.id);
    }

    function openTenantModal() {
      const select = document.getElementById('tenantProperty');
      select.innerHTML = db.properties.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
      document.getElementById('tenantModal').classList.add('open');
    }

    function handleSaveTenant(e) {
      e.preventDefault();
      const propId = Number(document.getElementById('tenantProperty').value);
      const name = document.getElementById('tenantName').value;
      const phone = document.getElementById('tenantPhone').value;
      const room = document.getElementById('tenantRoom').value;
      const rent = parseFloat(document.getElementById('tenantRent').value);
      const dueDay = parseInt(document.getElementById('tenantDue').value, 10);
      const deposit = parseFloat(document.getElementById('tenantDeposit').value) || 0;

      db.tenants.push({ id: db.tenants.length + 1, propertyId: propId, name, phone, rent, dueDay, deposit, active: 1, room });
      closeModal('tenantModal');
      renderAll();
    }

    function openPropertyModal() {
      document.getElementById('propertyModal').classList.add('open');
    }

    function handleSaveProperty(e) {
      e.preventDefault();
      const name = document.getElementById('propName').value;
      const address = document.getElementById('propAddress').value;
      db.properties.push({ id: db.properties.length + 1, name, address });
      closeModal('propertyModal');
      renderAll();
    }

    function toggleTenantActive(id) {
      const t = db.tenants.find(t => t.id === id);
      if (!t) return;
      if (t.active === 1 && !confirm(`Mark ${t.name} as moved out? All historical payments will be preserved.`)) return;
      t.active = t.active === 1 ? 0 : 1;
      renderAll();
    }

    function openHistoryModal(tId) {
      const tenant = db.tenants.find(t => t.id === tId);
      const prop = db.properties.find(p => p.id === tenant.propertyId);
      const pays = db.payments.filter(p => p.tenantId === tId);
      const total = pays.reduce((s, p) => s + Number(p.amount), 0);

      document.getElementById('historyTitle').innerText = `${tenant.name} - Payment History`;
      document.getElementById('historyDetails').innerHTML = `Property: <strong>${prop?.name}</strong> (${tenant.room}) | Monthly Rent: <strong>$${tenant.rent}</strong> | Total Lifetime Collected: <strong style="color:var(--success)">$${total.toFixed(2)}</strong>`;
      
      const rows = pays.map(p => `<tr>
        <td style="font-family:monospace; color:var(--primary)">${p.receiptNo}</td>
        <td>${p.month}</td>
        <td>${p.date}</td>
        <td>${p.mode}</td>
        <td style="color:var(--success); font-weight:700;">$${Number(p.amount).toFixed(2)}</td>
        <td><button class="btn btn-secondary btn-sm" onclick="downloadPdfReceipt(${p.id})">📥 PDF</button></td>
      </tr>`).join('');
      document.getElementById('historyRows').innerHTML = rows || `<tr><td colspan="6" style="text-align:center; padding:16px;">No payments recorded for this tenant.</td></tr>`;
      document.getElementById('historyModal').classList.add('open');
    }

    function closeModal(id) {
      document.getElementById(id).classList.remove('open');
    }

    // Professional PDF Receipt Generator (via jsPDF)
    function downloadPdfReceipt(paymentId) {
      const payment = db.payments.find(p => p.id === paymentId);
      if (!payment) return;
      const tenant = db.tenants.find(t => t.id === payment.tenantId);
      const prop = db.properties.find(p => p.id === tenant?.propertyId);
      const totalPaidMonth = getPaidForTenantMonth(tenant.id, payment.month);
      const balance = Math.max(0, tenant.rent - totalPaidMonth);

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Top Banner
      doc.setFillColor(30, 58, 138);
      doc.rect(0, 0, 210, 36, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("RENT PAYMENT RECEIPT", 14, 22);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("RENTFLOW OFFICIAL ACKNOWLEDGMENT", 14, 30);

      // Receipt Meta
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(10);
      doc.text(`Receipt No: ${payment.receiptNo}`, 130, 18);
      doc.text(`Date Issued: ${payment.date}`, 130, 26);

      // Section Cards
      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, 46, 86, 38, 3, 3, 'FD');
      doc.roundedRect(110, 46, 86, 38, 3, 3, 'FD');

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(30, 58, 138);
      doc.text("PROPERTY & LANDLORD", 18, 54);
      doc.text("TENANT DETAILS", 114, 54);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(9);
      doc.text(`Property: ${prop?.name || 'Property'}`, 18, 62);
      doc.text(`Address: ${prop?.address || 'On File'}`, 18, 70);
      doc.text(`Landlord: John Sterling`, 18, 78);

      doc.text(`Name: ${tenant?.name || 'Tenant'}`, 114, 62);
      doc.text(`Phone: ${tenant?.phone || '—'}`, 114, 70);
      doc.text(`Unit: ${tenant?.room || '—'} | Month: ${payment.month}`, 114, 78);

      // Table Header
      doc.setFillColor(30, 58, 138);
      doc.rect(14, 96, 182, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("Description", 18, 102);
      doc.text("Payment Mode", 110, 102);
      doc.text("Amount Received", 160, 102);

      // Table Row
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "normal");
      doc.text(`Monthly Rent - ${payment.month}`, 18, 116);
      doc.text(`${payment.mode}`, 110, 116);
      doc.setFont("helvetica", "bold");
      doc.text(`$${Number(payment.amount).toFixed(2)}`, 160, 116);

      // Summary Box
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(110, 132, 86, 42, 3, 3);
      doc.setFont("helvetica", "normal");
      doc.text("Monthly Rent Contract:", 114, 142);
      doc.text(`$${tenant.rent.toFixed(2)}`, 180, 142);
      doc.text("Total Paid This Month:", 114, 150);
      doc.text(`$${totalPaidMonth.toFixed(2)}`, 180, 150);
      doc.text("Remaining Balance:", 114, 158);
      doc.text(`$${balance.toFixed(2)}`, 180, 158);

      doc.setFillColor(239, 246, 255);
      doc.roundedRect(110, 164, 86, 12, 2, 2, 'F');
      doc.setTextColor(30, 58, 138);
      doc.setFont("helvetica", "bold");
      doc.text("AMOUNT PAID:", 114, 172);
      doc.text(`$${Number(payment.amount).toFixed(2)}`, 175, 172);

      // Stamp Status
      doc.setDrawColor(16, 185, 129);
      doc.setFillColor(236, 253, 245);
      doc.roundedRect(14, 136, 80, 24, 3, 3, 'FD');
      doc.setTextColor(5, 150, 105);
      doc.setFontSize(12);
      doc.text(balance <= 0 ? "PAID IN FULL" : "PARTIAL PAYMENT", 28, 150);

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text("Generated by RentFlow Management. Official digital receipt for accounting records.", 14, 280);

      doc.save(`Receipt-${payment.receiptNo}.pdf`);
    }

    // Run app on load
    window.onload = init;
  </script>
</body>
</html>