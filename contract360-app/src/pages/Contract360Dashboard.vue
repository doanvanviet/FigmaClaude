<template>
  <div class="app-shell">
    <!-- ── Global Header ── -->
    <ControlHeader app-name="Contract 360" :no-meta="true">
      <template #header-search>
        <div class="search-box-header">
          <TIcon name="search" />
          <input type="text" placeholder="Tìm kiếm..." />
        </div>
      </template>
    </ControlHeader>

    <div class="body-row">
      <!-- ── Sidebar (dùng classes mds-ui: sidebar-host / sidebar / sidebar-item) ── -->
      <div class="sidebar-host" :class="{ 'sidebar-host--expanded': sidebarExpanded }">
        <aside class="sidebar" :class="{ expanded: sidebarExpanded }">
          <div class="sidebar-inner">

            <div class="sb-group-label">OPERATIONS SYSTEM</div>
            <nav class="sidebar-nav c360-nav">
              <button
                v-for="item in opsItems" :key="item.id"
                class="sidebar-item" :class="{ active: activeNav === item.id }"
                :title="item.label"
                @click="activeNav = item.id"
              >
                <TIcon :name="item.icon" />
                <span class="sidebar-item__label">{{ item.label }}</span>
              </button>
            </nav>

            <div class="sb-divider" />

            <div class="sb-group-label">ADMINISTRATION SYSTEM</div>
            <nav class="sidebar-nav c360-nav">
              <button
                v-for="item in adminItems" :key="item.id"
                class="sidebar-item" :class="{ active: activeNav === item.id }"
                :title="item.label"
                @click="activeNav = item.id"
              >
                <TIcon :name="item.icon" />
                <span class="sidebar-item__label">{{ item.label }}</span>
                <span v-if="item.badge" class="sb-badge">{{ item.badge }}</span>
              </button>
            </nav>

          </div>

          <button class="btn-collapse" @click="toggleSidebar"
            :title="sidebarExpanded ? 'Thu gọn' : 'Mở rộng'">
            <svg v-if="sidebarExpanded" viewBox="0 0 16.5 9.83333" fill="none" width="18" height="11">
              <path d="M9.08333 0.75H15.75M9.08333 9.08333H15.75M12.4167 4.91667H15.75M0.75 4.91667H9.08333M4.5 1.16667L0.75 4.91667L4.5 8.66667"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else viewBox="0 0 16.5 9.83333" fill="none" width="18" height="11">
              <path d="M0.75 0.75H7.41667M0.75 9.08333H7.41667M0.75 4.91667H4.08333M15.75 4.91667H7.41667M12 1.16667L15.75 4.91667L12 8.66667"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </aside>
      </div>

      <!-- ── Main ── -->
      <main class="c360-main">
        <!-- Page Header row -->
        <div class="c360-page-header">
          <div class="c360-ph-left">
            <h1 class="c360-title">CONTRACT 360 DASHBOARD</h1>
            <p class="c360-subtitle">Customer, Contract, Delivery, Revenue, Cash Collection and Commission View</p>
          </div>
          <div class="c360-ph-right">
            <span class="data-updated">Data updated: 04/08/2026 10:39 AM</span>
            <button class="btn-icon btn-icon--outline" title="Làm mới dữ liệu"><TIcon name="refresh" /></button>
            <button class="btn btn--outline btn--neutral perspective-btn">
              Perspective: <strong>Chairman / Board of Directors</strong>
              <TIcon name="chevron-down" />
            </button>
            <button class="btn btn--outline btn--neutral"><TIcon name="download" />&nbsp;Export</button>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="c360-filter-bar">
          <!-- Row 1 — basic filters -->
          <div class="fb-row">
            <div class="ibox ibox--sm fb-isel">
              <TIcon name="calendar" class="ibox__icon" />
              <span class="fb-isel__label">Period:</span>
              <select class="ibox__native ibox__native--select" v-model="periodMode">
                <option v-for="opt in periodOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
              <TIcon name="chevron-down" class="ibox__icon" />
            </div>
            <div class="fb-sep" />
            <div class="ibox ibox--sm fb-isel">
              <span class="fb-isel__label">Company:</span>
              <select class="ibox__native ibox__native--select" v-model="filterCompany">
                <option value="">All Companies</option>
                <option v-for="opt in companyOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
              <TIcon name="chevron-down" class="ibox__icon" />
            </div>
            <div class="ibox ibox--sm fb-isel">
              <span class="fb-isel__label">Segment:</span>
              <select class="ibox__native ibox__native--select" v-model="filterSegment">
                <option value="">All Segments</option>
                <option v-for="opt in segmentOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
              <TIcon name="chevron-down" class="ibox__icon" />
            </div>
            <div class="ibox ibox--sm fb-isel">
              <span class="fb-isel__label">Unit:</span>
              <select class="ibox__native ibox__native--select" v-model="filterUnit">
                <option value="">All Units</option>
                <option v-for="opt in unitOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
              <TIcon name="chevron-down" class="ibox__icon" />
            </div>
            <div class="ibox ibox--sm fb-isel">
              <span class="fb-isel__label">Team:</span>
              <select class="ibox__native ibox__native--select" v-model="filterTeam">
                <option value="">All Teams</option>
                <option v-for="opt in teamOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
              <TIcon name="chevron-down" class="ibox__icon" />
            </div>
            <div class="fb-sep" />
            <div class="ibox ibox--sm fb-isel">
              <TIcon name="user" class="ibox__icon" />
              <span class="fb-isel__label">Salesperson:</span>
              <select class="ibox__native ibox__native--select" v-model="filterSalesperson">
                <option value="">All Salespeople</option>
                <option v-for="opt in salespersonOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
              <TIcon name="chevron-down" class="ibox__icon" />
            </div>
            <button
              :class="['btn', showAdvancedFilters ? 'btn--primary' : 'btn--outline btn--neutral', 'fb-more-btn']"
              @click="showAdvancedFilters = !showAdvancedFilters"
            >
              <TIcon name="filter" />
              {{ showAdvancedFilters ? 'Hide Filters' : 'More Filters' }}
            </button>
          </div>

          <!-- Row 2 — advanced filters (ẩn/hiện) -->
          <div v-if="showAdvancedFilters" class="fb-row fb-row--advanced">
            <div class="ibox ibox--sm fb-isel">
              <span class="fb-isel__label">Step:</span>
              <select class="ibox__native ibox__native--select" v-model="filterStep">
                <option value="">All Steps</option>
                <option v-for="opt in stepOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
              <TIcon name="chevron-down" class="ibox__icon" />
            </div>
            <div class="fb-sep" />
            <div class="ibox ibox--sm fb-isel">
              <span class="fb-isel__label">Department:</span>
              <select class="ibox__native ibox__native--select" v-model="filterDepartment">
                <option value="">All Departments</option>
                <option v-for="opt in departmentOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
              <TIcon name="chevron-down" class="ibox__icon" />
            </div>
            <div class="fb-sep" />
            <div class="fb-group">
              <span class="fb-label">Custom Date:</span>
              <AppDatebox v-model="dateFrom" style="width:140px" />
              <TIcon name="arrow-right" class="fb-arrow" />
              <AppDatebox v-model="dateTo" style="width:140px" />
            </div>
          </div>
        </div>

        <!-- Scrollable content -->
        <div class="c360-scroll">
          <div class="c360-content">

            <!-- ── KPI Cards ── -->
            <div class="kpi-grid">
              <div v-for="card in kpiCards" :key="card.id" class="kpi-card">
                <div class="kpi-card__head">
                  <span class="kpi-num">{{ card.id }}.</span>
                  <span class="kpi-card-title">{{ card.title }}</span>
                  <span class="kpi-card-icon" :style="{ color: card.iconColor }">
                    <TIcon :name="card.icon" />
                  </span>
                </div>
                <div class="kpi-val" :style="{ color: card.valueColor || 'var(--text-primary)' }">
                  {{ card.value }}
                  <span v-if="card.valueSuffix" class="kpi-val-suffix" :style="{ color: card.suffixColor }">
                    {{ card.valueSuffix }}
                  </span>
                </div>
                <div class="kpi-metrics">
                  <div v-for="m in card.metrics" :key="m.label + m.value" class="kpi-metric-row">
                    <span class="kpi-ml">{{ m.label }}</span>
                    <span class="kpi-mv" :class="{ 'is-link': m.isLink }" :style="{ color: m.color }">
                      {{ m.value }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- ── Process Flow ── -->
            <div class="pf-section">
              <div class="pf-head">
                <div>
                  <h2 class="section-title">Contract Revenue Process Flow (6 Sequential Steps)</h2>
                  <p class="section-sub">Click any circular node to inspect detailed customer records for that milestone</p>
                </div>
              </div>
              <div class="pf-flow">
                <template v-for="(step, idx) in processSteps" :key="step.id">
                  <button class="pf-step" :style="{ '--step-color': step.color }">
                    <div class="pf-circle" :style="{ background: step.bgLight }">
                      <TIcon :name="step.icon" />
                    </div>
                    <div class="pf-step-label">{{ step.label }}</div>
                    <div class="pf-step-value">{{ step.value }}</div>
                    <div class="pf-step-sub">{{ step.sub }}</div>
                  </button>
                  <div v-if="idx < processSteps.length - 1" class="pf-connector">
                    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <polyline points="1,1 8,8 1,15"
                        :stroke="step.color" stroke-opacity="0.3"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      <polyline points="10,1 17,8 10,15"
                        :stroke="processSteps[idx + 1].color" stroke-opacity="0.9"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                </template>
              </div>
            </div>

            <!-- ── Block Sections ── -->
            <div class="block-grid">
              <div v-for="block in blockSections" :key="block.id" class="block-card">
                <div class="block-card__head">
                  <span class="block-label-tag" :style="{ background: block.labelColor }">{{ block.label }}</span>
                  <span class="block-head-icon"><TIcon name="file-text" /></span>
                </div>
                <div class="block-card__title">{{ block.title }}</div>
                <div class="block-card__subtitle">{{ block.subtitle }}</div>
                <div class="block-metrics">
                  <div v-for="m in block.metrics" :key="m.label" class="block-metric-row">
                    <span class="block-ml">{{ m.label }}</span>
                    <span class="block-mv" :style="{ color: m.color || 'var(--text-primary)' }">{{ m.value }}</span>
                  </div>
                </div>
                <button class="block-breakdown-btn">
                  Click for full breakdown <TIcon name="arrow-right" />
                </button>
              </div>
            </div>

            <!-- ── Attention Table ── -->
            <div class="attention-panel">
              <div class="attention-panel__head">
                <div class="ap-head-left">
                  <TIcon name="alert-triangle" class="attention-warn-icon" />
                  <div>
                    <h2 class="attention-title">Customers / Contracts Requiring Attention</h2>
                    <p class="attention-sub">Filtered contracts with active risk alerts, SLA delays, or outstanding receivables</p>
                  </div>
                </div>
                <div class="ap-head-right">
                  <span class="ap-total">Total 55 contracts</span>
                  <button class="btn btn--primary">View All (53 more) →</button>
                </div>
              </div>

              <div class="attention-table-wrap">
                <table class="attention-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Contract</th>
                      <th>Product</th>
                      <th>Contract Value</th>
                      <th>Discount</th>
                      <th>Onboard</th>
                      <th>Invoice</th>
                      <th>Sales Rev.</th>
                      <th>Collected</th>
                      <th>AR</th>
                      <th>Status</th>
                      <th>Alert</th>
                      <th>Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in attentionRows" :key="row.contract">
                      <td>
                        <span class="row-dot" :style="{ background: row.dotColor }"></span>
                        {{ row.customer }}
                      </td>
                      <td>{{ row.contract }}</td>
                      <td>{{ row.product }}</td>
                      <td class="val-link">{{ row.contractValue }}</td>
                      <td>{{ row.discount }}</td>
                      <td>{{ row.onboard }}</td>
                      <td>{{ row.invoice }}</td>
                      <td>{{ row.salesRev }}</td>
                      <td>{{ row.collected }}</td>
                      <td style="color:var(--text-warning);font-weight:var(--fw-medium)">{{ row.ar }}</td>
                      <td>
                        <span :class="['status-chip', row.statusClass]">{{ row.status }}</span>
                      </td>
                      <td>
                        <span :class="['alert-chip', row.alertClass]">{{ row.alert }}</span>
                      </td>
                      <td>{{ row.owner }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="attention-footer">
                + 53 more contracts in progress — Click to view complete list modal
              </div>
            </div>

          </div><!-- /c360-content -->
        </div><!-- /c360-scroll -->
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ControlHeader from '@mds/components/ControlHeader.vue'
import TIcon         from '@mds/components/TIcon.vue'
import AppDatebox    from '@mds/components/AppDatebox.vue'

const SIDEBAR_KEY = 'mds-sidebar-expanded'
const _stored = localStorage.getItem(SIDEBAR_KEY)
const sidebarExpanded = ref(_stored !== null ? _stored === 'true' : true)
function toggleSidebar() {
  sidebarExpanded.value = !sidebarExpanded.value
  localStorage.setItem(SIDEBAR_KEY, sidebarExpanded.value)
}

const activeNav           = ref('overview')
const showAdvancedFilters = ref(false)
const dateFrom            = ref('2026-01-01')
const dateTo              = ref('2026-12-31')

/* ── Filter bar values ── */
const periodMode       = ref('all')
const filterCompany    = ref('misa')
const filterSegment    = ref('')
const filterUnit       = ref('')
const filterTeam       = ref('')
const filterSalesperson = ref('')
const filterStep       = ref('')
const filterDepartment = ref('')

/* ── Filter bar options ── */
const periodOptions = [
  { value: 'month',      label: 'June 2026' },
  { value: 'all',        label: 'All Time' },
  { value: 'cumulative', label: 'Cumulative' },
]
const companyOptions = [
  { value: 'misa', label: 'MISA JSC' },
]
const segmentOptions = [
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'sme',        label: 'SME' },
  { value: 'startup',    label: 'Startup' },
]
const unitOptions = [
  { value: 'unit1', label: 'Unit 1' },
  { value: 'unit2', label: 'Unit 2' },
  { value: 'unit3', label: 'Unit 3' },
]
const teamOptions = [
  { value: 'team1', label: 'Team North' },
  { value: 'team2', label: 'Team South' },
  { value: 'team3', label: 'Team Central' },
]
const salespersonOptions = [
  { value: 'sp1', label: 'Nguyen Van A' },
  { value: 'sp2', label: 'Tran Thi B' },
  { value: 'sp3', label: 'Le Van C' },
]
const stepOptions = [
  { value: 'signed',     label: 'Contract Signed' },
  { value: 'onboard',    label: 'Onboarding' },
  { value: 'invoice',    label: 'Invoicing' },
  { value: 'revenue',    label: 'Sales Revenue' },
  { value: 'cash',       label: 'Cash Collection' },
  { value: 'commission', label: 'Commission' },
]
const departmentOptions = [
  { value: 'sales', label: 'Sales' },
  { value: 'cs',    label: 'Customer Success' },
  { value: 'hr',    label: 'HR' },
  { value: 'ops',   label: 'Operations' },
]

/* ── Sidebar items ── */
const opsItems = [
  { id: 'overview',   icon: 'layout-dashboard', label: 'Executive Overview' },
  { id: 'revenue',    icon: 'coin',             label: 'My Revenue & Income' },
  { id: 'operations', icon: 'briefcase',        label: 'Operations Managemen...' },
  { id: 'contracts',  icon: 'file-text',        label: 'Contract Details' },
  { id: 'analytics',  icon: 'chart-bar',        label: 'Analytics Dashboard' },
]
const adminItems = [
  { id: 'health',    icon: 'settings',       label: 'Health Score Config', badge: 'NI' },
  { id: 'approval',  icon: 'circle-check',   label: 'Approval Management' },
  { id: 'customers', icon: 'users',          label: 'Customer Management' },
  { id: 'sla',       icon: 'clipboard-list', label: 'SLA Management' },
]

/* ── KPI Cards ── */
const kpiCards = [
  {
    id: 1, title: 'Total Contract Value',
    icon: 'file-text', iconColor: 'var(--text-secondary)',
    value: '120,500,000,000 đ',
    metrics: [
      { label: 'Signed Volume:', value: '1,240 contracts', isLink: true, color: 'var(--text-link)' },
    ],
  },
  {
    id: 2, title: 'Onboarding Progress',
    icon: 'link', iconColor: '#e879f9',
    value: '76%', valueSuffix: 'Avg Complete', suffixColor: 'var(--text-success)',
    metrics: [
      { label: 'Delayed:',  value: '18 delayed',        color: 'var(--text-danger)' },
      { label: 'Pending:',  value: '42 not onboarded',  color: 'var(--text-secondary)' },
    ],
  },
  {
    id: 3, title: 'Invoiced Revenue',
    icon: 'file-invoice', iconColor: 'var(--text-secondary)',
    value: '96,800,000,000 đ',
    metrics: [
      { label: 'Ratio:',      value: '80% of total',       color: 'var(--text-secondary)' },
      { label: 'Uninvoiced:', value: '23,700,000,000 đ',   color: 'var(--text-danger)' },
    ],
  },
  {
    id: 4, title: 'Sales Revenue',
    icon: 'chart-bar', iconColor: 'var(--text-link)',
    value: '83,400,000,000 đ',
    metrics: [
      { label: 'Recognized:', value: '69% of total',       color: 'var(--text-secondary)' },
      { label: 'Deferred:',   value: '13,400,000,000 đ',   color: 'var(--text-secondary)' },
    ],
  },
  {
    id: 5, title: 'Cash Collected',
    icon: 'cash', iconColor: 'var(--text-success)',
    value: '72,600,000,000 đ',
    metrics: [
      { label: 'Collected Rate:', value: '75% collected', color: 'var(--text-link)' },
    ],
  },
  {
    id: 6, title: 'Outstanding AR',
    icon: 'cash', iconColor: 'var(--text-warning)',
    value: '24,200,000,000 đ', valueColor: 'var(--text-warning)',
    metrics: [
      { label: 'Overdue Aging:', value: '5,100,000,000 đ', color: 'var(--text-danger)' },
      { label: 'AR Share:',      value: '21% of total',    color: 'var(--text-secondary)' },
    ],
  },
  {
    id: 7, title: 'Commissionable Revenue',
    icon: 'cash', iconColor: 'var(--text-warning)',
    value: '88,500,000,000 đ',
    metrics: [
      { label: 'Approved Payout:',    value: '65,400,000,000 đ', color: 'var(--text-link)' },
      { label: 'Pending Threshold:',  value: '12 contracts',     color: 'var(--text-secondary)' },
    ],
  },
  {
    id: 8, title: 'Alert Contracts',
    icon: 'alert-triangle', iconColor: 'var(--text-danger)',
    value: '38', valueSuffix: 'contracts',
    metrics: [
      { label: '', value: '12 Red Alerts', color: 'var(--text-danger)' },
      { label: '', value: '26 Yellow',     color: 'var(--text-warning)' },
    ],
  },
]

/* ── Process Flow ── */
const processSteps = [
  { id: 'signed',     icon: 'file-text',    color: '#2563eb', bgLight: '#dbeafe', label: 'Contract Signed', value: '120.5Bđ',  sub: 'Total value of signed contracts' },
  { id: 'onboard',    icon: 'link',         color: '#16a34a', bgLight: '#dcfce7', label: 'Onboarding',      value: '76% Done', sub: 'Average delivery completion rate' },
  { id: 'invoice',    icon: 'file-invoice', color: '#0891b2', bgLight: '#cffafe', label: 'Invoicing',       value: '96.8Bđ',   sub: 'Total invoiced value' },
  { id: 'revenue',    icon: 'chart-bar',    color: '#2563eb', bgLight: '#dbeafe', label: 'Sales Revenue',   value: '83.4Bđ',   sub: 'Total revenue recognized' },
  { id: 'cash',       icon: 'cash',         color: '#16a34a', bgLight: '#dcfce7', label: 'Cash Collection', value: '72.6Bđ',   sub: 'Total cash collected' },
  { id: 'commission', icon: 'award',        color: '#d97706', bgLight: '#fef3c7', label: 'Commission',      value: '65.4Bđ',   sub: 'Total commission calculated' },
]

/* ── Block Sections ── */
const blockSections = [
  {
    id: 1, label: 'Block 1 · Sales', labelColor: '#2563eb',
    title: 'Sales (Contract Signed)', subtitle: 'Step 1 Milestone & Revenue Pipeline',
    metrics: [
      { label: '1. Contract Value (B1):',    value: '120.5Bđ' },
      { label: '2. Contract Numbers:',       value: '1,240 orders' },
      { label: '3. Discount Allowed:',       value: '2.3Bđ' },
      { label: '4. Average Contract Value:', value: '97.18Mđ', color: 'var(--text-link)' },
    ],
  },
  {
    id: 2, label: 'Block 2 · Onboarding', labelColor: '#7c3aed',
    title: 'Onboarding & Handover', subtitle: 'Step 2 Handover Milestone & Delay Analysis',
    metrics: [
      { label: '1. Completion Rate:',       value: '76.0%' },
      { label: '2. Delayed Contracts:',     value: '18 orders', color: 'var(--text-danger)' },
      { label: '3. Average Delay:',         value: '3.5 days',  color: 'var(--text-danger)' },
      { label: '4. Value Pending Onboard:', value: '28.9Bđ',    color: 'var(--text-warning)' },
    ],
  },
  {
    id: 3, label: 'Block 3 · Accounting', labelColor: '#16a34a',
    title: 'Accounting & Revenue', subtitle: 'Steps 3-5 Invoicing, Recognition & AR',
    metrics: [
      { label: '1. Invoiced Revenue (B3):', value: '96.8Bđ' },
      { label: '2. Sales Revenue (B4):',    value: '83.4Bđ' },
      { label: '3. Cash Collected (B5):',   value: '72.6Bđ' },
      { label: '4. Outstanding AR (B5):',   value: '24.2Bđ', color: 'var(--text-warning)' },
    ],
  },
  {
    id: 4, label: 'Block 4 · HR & Sales', labelColor: '#d97706',
    title: 'Commission & Incentives', subtitle: 'Step 6 Staff Payouts & Threshold Rules',
    metrics: [
      { label: '1. Commissionable Revenue:', value: '88.5Bđ' },
      { label: '2. Approved Amount:',        value: '65.4Bđ', color: 'var(--text-link)' },
      { label: '3. Pending Contracts:',      value: '12 orders', color: 'var(--text-danger)' },
      { label: '4. Commission Rate:',        value: '5.0%' },
    ],
  },
]

/* ── Attention Table ── */
const attentionRows = [
  {
    dotColor: '#f79009',
    customer: 'Company A', contract: 'HD001', product: 'AMIS CRM',
    contractValue: '2.0Bđ', discount: '0.1Bđ', onboard: '80%',
    invoice: '1.5Bđ', salesRev: '1.2Bđ', collected: '1.0Bđ', ar: '0.5Bđ',
    status: 'Calculated', statusClass: 'chip-neutral',
    alert: 'Yellow: AR due soon', alertClass: 'chip-yellow',
    owner: 'Sales Owner',
  },
  {
    dotColor: '#f04438',
    customer: 'Company B', contract: 'HD005', product: 'Implementation Service',
    contractValue: '3.2Bđ', discount: '0.2Bđ', onboard: '45%',
    invoice: '1.0Bđ', salesRev: '0.6Bđ', collected: '0.7Bđ', ar: '0.3Bđ',
    status: 'Pending', statusClass: 'chip-warning',
    alert: 'Red: Onboarding delayed', alertClass: 'chip-danger',
    owner: 'Onboarding',
  },
]
</script>

<style scoped>
/* ════════════════════════════════════════════
   SIDEBAR — chỉ phần mở rộng, không duplicate mds-ui
   sidebar-host / sidebar / sidebar-item / sidebar-item__label / btn-collapse
   → đã có sẵn trong @mds/style.css
════════════════════════════════════════════ */

/* sidebar-nav trong mds-ui có flex:1 — override cho layout nhiều group */
.c360-nav { flex: 0 0 auto; }

/* Truncate label dài khi expanded — tooltip qua :title trên button */
.sidebar-item { overflow: hidden; }
.sidebar-item__label { overflow: hidden; text-overflow: ellipsis; }

/* Group section labels — ẩn khi collapsed, hiện khi expanded/hover */
.sb-group-label {
  font-size: 10px; font-weight: var(--fw-semibold);
  letter-spacing: 0.06em; color: var(--text-hint);
  padding: 6px 12px 2px; white-space: nowrap; display: none;
}
.sidebar.expanded .sb-group-label,
.sidebar:not(.expanded):hover .sb-group-label { display: block; }

/* Divider giữa hai group */
.sb-divider { height: 1px; background: var(--stroke-divider); margin: 8px 0; }

/* Badge "NI" — ẩn khi collapsed */
.sb-badge {
  font-size: 10px; font-weight: var(--fw-bold);
  background: var(--bg-danger); color: #fff;
  border-radius: var(--radius-pill); padding: 1px 5px; flex-shrink: 0;
  display: none;
}
.sidebar.expanded .sb-badge,
.sidebar:not(.expanded):hover .sb-badge { display: inline-flex; align-items: center; }

/* ════════════════════════════════════════════
   MAIN LAYOUT
════════════════════════════════════════════ */
.c360-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--bg-page);
}

/* ── Page Header ── */
.c360-page-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 20px;
  background: var(--bg-white);
  border-bottom: 1px solid var(--stroke-divider);
  flex-shrink: 0;
  gap: 16px;
}
.c360-title {
  font-size: 15px; font-weight: var(--fw-bold);
  color: var(--text-primary); letter-spacing: 0.02em;
}
.c360-subtitle {
  font-size: 12px; color: var(--text-secondary); margin-top: 2px;
}
.c360-ph-right {
  display: flex; align-items: center; gap: 8px; flex-shrink: 0;
}

.data-updated {
  font-size: 12px; color: var(--text-secondary); white-space: nowrap;
}
/* perspective-btn dùng btn btn--outline btn--neutral + thêm gap cho nội dung */
.perspective-btn { gap: 6px; white-space: nowrap; }
.perspective-btn strong { font-weight: var(--fw-semibold); }

/* ── Filter Bar ── */
.c360-filter-bar {
  display: flex; flex-direction: column;
  background: var(--bg-white);
  border-bottom: 1px solid var(--stroke-divider);
  flex-shrink: 0;
}
.fb-row {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  padding: 8px 16px;
}
.fb-row--advanced { border-top: 1px solid var(--stroke-divider); }
.fb-more-btn { margin-left: auto; flex-shrink: 0; }
.fb-arrow { color: var(--text-secondary); flex-shrink: 0; }
.fb-group { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.fb-label { font-size: 12px; color: var(--text-secondary); white-space: nowrap; }

/* Filter inline select — Label: Value trong một ibox, height = var(--input-height) */
.fb-isel { width: auto; flex-shrink: 0; gap: 4px; cursor: pointer; }
.fb-isel__label {
  font-size: 12px; color: var(--text-secondary);
  white-space: nowrap; flex-shrink: 0;
}

.fb-sep {
  width: 1px; height: 20px;
  background: var(--stroke-neutral); flex-shrink: 0;
}

/* ── Scrollable content ── */
.c360-scroll {
  flex: 1; overflow-y: auto; overflow-x: hidden;
}
.c360-content {
  padding: 16px 20px 32px;
  display: flex; flex-direction: column; gap: 16px;
}

/* ════════════════════════════════════════════
   KPI CARDS
════════════════════════════════════════════ */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.kpi-card {
  background: var(--bg-white);
  border-radius: var(--radius-default);
  box-shadow: var(--shadow-card);
  padding: 14px 16px;
  display: flex; flex-direction: column; gap: 6px;
  min-width: 0;
}

.kpi-card__head {
  display: flex; align-items: center; gap: 4px;
}
.kpi-num {
  font-size: 12px; color: var(--text-secondary); flex-shrink: 0;
}
.kpi-card-title {
  flex: 1; font-size: 12px; font-weight: var(--fw-medium);
  color: var(--text-secondary); overflow: hidden;
  text-overflow: ellipsis; white-space: nowrap;
}
.kpi-card-icon {
  flex-shrink: 0; display: flex; align-items: center;
  opacity: 0.7;
}

.kpi-val {
  font-size: 20px; font-weight: var(--fw-bold);
  line-height: 1.2; color: var(--text-primary);
  display: flex; align-items: baseline; gap: 6px;
}
.kpi-val-suffix {
  font-size: 11px; font-weight: var(--fw-medium);
}

.kpi-metrics { display: flex; flex-direction: column; gap: 3px; }
.kpi-metric-row {
  display: flex; align-items: center; justify-content: space-between;
  gap: 4px;
}
.kpi-ml {
  font-size: 11px; color: var(--text-secondary);
}
.kpi-mv {
  font-size: 11px; font-weight: var(--fw-medium);
  color: var(--text-secondary); text-align: right;
}
.kpi-mv.is-link { color: var(--text-link); cursor: pointer; }
.kpi-mv.is-link:hover { text-decoration: underline; }

/* ════════════════════════════════════════════
   PROCESS FLOW
════════════════════════════════════════════ */
.pf-section {
  background: var(--bg-white);
  border-radius: var(--radius-default);
  box-shadow: var(--shadow-card);
  padding: 16px 20px;
}
.pf-head { margin-bottom: 16px; }
.section-title  { font-size: 14px; font-weight: var(--fw-semibold); color: var(--text-primary); }
.section-sub    { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }

.pf-flow {
  display: flex; align-items: flex-start; justify-content: space-between;
}

.pf-step {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  background: transparent; border: none; cursor: pointer;
  flex: 1; padding: 4px 8px;
  transition: opacity 0.15s;
}
.pf-step:hover { opacity: 0.8; }

.pf-circle {
  width: 64px; height: 64px; border-radius: 50%;
  border: 2px solid var(--step-color, #2563eb);
  color: var(--step-color, #2563eb);
  display: flex; align-items: center; justify-content: center;
  transition: filter 0.15s;
}
.pf-circle .ti { font-size: 28px; }
.pf-step:hover .pf-circle { filter: brightness(0.94); }

.pf-step-label {
  font-size: 12px; font-weight: var(--fw-semibold);
  color: var(--text-primary); text-align: center;
}
.pf-step-value {
  font-size: 13px; font-weight: var(--fw-bold);
  color: var(--text-primary); text-align: center;
}
.pf-step-sub {
  font-size: 11px; color: var(--text-secondary);
  text-align: center; line-height: 1.3;
}

/* pf-step padding-top:4px + circle 64px/2 = 36px; connector height:16px/2=8 → margin-top:28px */
.pf-connector {
  flex-shrink: 0;
  margin-top: 28px;
  display: flex;
  align-items: center;
}

/* ════════════════════════════════════════════
   BLOCK SECTIONS
════════════════════════════════════════════ */
.block-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.block-card {
  background: var(--bg-white);
  border-radius: var(--radius-default);
  box-shadow: var(--shadow-card);
  padding: 14px 16px;
  display: flex; flex-direction: column; gap: 8px;
}

.block-card__head {
  display: flex; align-items: center; justify-content: space-between;
}
.block-label-tag {
  display: inline-flex; align-items: center;
  font-size: 11px; font-weight: var(--fw-bold);
  color: #fff; border-radius: 4px;
  padding: 2px 8px;
  white-space: nowrap;
}
.block-head-icon {
  color: var(--text-secondary); opacity: 0.6;
  display: flex; align-items: center;
}

.block-card__title {
  font-size: 13px; font-weight: var(--fw-semibold);
  color: var(--text-primary); line-height: 1.3;
}
.block-card__subtitle {
  font-size: 11px; color: var(--text-secondary); line-height: 1.3; margin-top: -4px;
}

.block-metrics { display: flex; flex-direction: column; gap: 5px; flex: 1; }
.block-metric-row {
  display: flex; align-items: center; justify-content: space-between; gap: 4px;
}
.block-ml { font-size: 12px; color: var(--text-secondary); }
.block-mv { font-size: 12px; font-weight: var(--fw-semibold); color: var(--text-primary); text-align: right; }

.block-breakdown-btn {
  display: flex; align-items: center; gap: 4px;
  background: transparent; border: none; cursor: pointer;
  font-size: 12px; color: var(--text-link); font-weight: var(--fw-medium);
  padding: 0; margin-top: 4px;
}
.block-breakdown-btn:hover { text-decoration: underline; }

/* ════════════════════════════════════════════
   ATTENTION TABLE
════════════════════════════════════════════ */
.attention-panel {
  background: var(--bg-white);
  border-radius: var(--radius-default);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.attention-panel__head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--stroke-divider);
  gap: 12px;
}
.ap-head-left {
  display: flex; align-items: flex-start; gap: 10px;
}
.attention-warn-icon {
  color: var(--text-warning); flex-shrink: 0; margin-top: 2px;
}
.attention-title {
  font-size: 13px; font-weight: var(--fw-semibold); color: var(--text-primary);
}
.attention-sub {
  font-size: 11px; color: var(--text-secondary); margin-top: 2px;
}
.ap-head-right {
  display: flex; align-items: center; gap: 10px; flex-shrink: 0;
}
.ap-total { font-size: 12px; color: var(--text-secondary); white-space: nowrap; }


.attention-table-wrap { overflow-x: auto; }

.attention-table {
  width: 100%; border-collapse: collapse;
  font-size: 12px;
}
.attention-table thead tr {
  background: var(--bg-neutral-light);
}
.attention-table th {
  padding: 8px 12px; text-align: left;
  font-size: 11px; font-weight: var(--fw-semibold);
  color: var(--text-secondary);
  border-bottom: 1px solid var(--stroke-divider);
  white-space: nowrap;
}
.attention-table td {
  padding: 10px 12px;
  color: var(--text-primary);
  border-bottom: 1px solid var(--stroke-divider);
  white-space: nowrap;
  vertical-align: middle;
}
.attention-table tbody tr:last-child td { border-bottom: none; }
.attention-table tbody tr:hover { background: var(--bg-neutral-hover); }

.row-dot {
  display: inline-block;
  width: 8px; height: 8px; border-radius: 50%;
  margin-right: 6px; flex-shrink: 0;
  vertical-align: middle;
}
.val-link { color: var(--text-link); font-weight: var(--fw-medium); cursor: pointer; }
.val-link:hover { text-decoration: underline; }

/* Status & Alert chips */
.status-chip, .alert-chip {
  display: inline-flex; align-items: center;
  padding: 2px 8px; border-radius: 9999px;
  font-size: 11px; font-weight: var(--fw-medium);
  white-space: nowrap;
}
.chip-neutral  { background: var(--bg-neutral-light); color: var(--text-secondary); }
.chip-warning  { background: #fffbeb; color: #d97706; }
.chip-danger   { background: #fef2f2; color: #f04438; }
.chip-yellow   { background: #fffbeb; color: #d97706; }

.attention-footer {
  padding: 10px 16px;
  font-size: 12px; color: var(--text-link);
  text-align: center; cursor: pointer;
  border-top: 1px solid var(--stroke-divider);
}
.attention-footer:hover { background: var(--bg-brand-light); }
</style>
