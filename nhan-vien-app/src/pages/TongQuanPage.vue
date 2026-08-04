<template>
  <AppShell>
    <div class="page-header">
      <div class="page-header__left">
        <h1 class="page-header__title h2">Tổng quan</h1>
      </div>
    </div>

    <div class="ov-scroll">
      <div class="ov-content">

        <!-- ── Main column ── -->
        <div class="ov-main">

          <!-- Welcome banner -->
          <div class="welcome-banner">
            <div class="welcome-graphic">
              <svg width="148" height="108" viewBox="0 0 148 108" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="74" cy="86" rx="56" ry="7" fill="rgba(109,40,217,0.06)"/>
                <rect x="12" y="77" width="124" height="5" rx="2.5" fill="rgba(109,40,217,0.16)"/>
                <rect x="48" y="72" width="52" height="5" rx="2" fill="rgba(109,40,217,0.2)"/>
                <rect x="52" y="44" width="44" height="29" rx="3" fill="rgba(109,40,217,0.22)"/>
                <rect x="55" y="47" width="38" height="23" rx="2" fill="rgba(255,255,255,0.62)"/>
                <rect x="59" y="52" width="18" height="2.5" rx="1.25" fill="rgba(109,40,217,0.45)"/>
                <rect x="59" y="57" width="13" height="2" rx="1" fill="rgba(109,40,217,0.3)"/>
                <rect x="59" y="61" width="15" height="2" rx="1" fill="rgba(109,40,217,0.3)"/>
                <rect x="79" y="58" width="5" height="10" rx="1.5" fill="rgba(109,40,217,0.34)"/>
                <rect x="86" y="54" width="5" height="14" rx="1.5" fill="rgba(109,40,217,0.22)"/>
                <circle cx="30" cy="50" r="13" fill="rgba(109,40,217,0.2)"/>
                <path d="M18 46C18 37 42 37 42 46" fill="rgba(109,40,217,0.32)"/>
                <path d="M14 77C14 65 21 59 30 58C39 58 46 65 48 75" fill="rgba(109,40,217,0.16)"/>
                <rect x="112" y="68" width="17" height="9" rx="2.5" fill="rgba(109,40,217,0.22)"/>
                <line x1="120" y1="68" x2="120" y2="50" stroke="rgba(109,40,217,0.28)" stroke-width="2.5" stroke-linecap="round"/>
                <path d="M120 61C113 55 106 58 108 65" fill="rgba(109,40,217,0.2)" stroke="rgba(109,40,217,0.18)" stroke-width="1"/>
                <path d="M120 57C127 51 134 54 132 61" fill="rgba(109,40,217,0.2)" stroke="rgba(109,40,217,0.18)" stroke-width="1"/>
                <path d="M120 51C117 45 119 41 122 45" fill="rgba(109,40,217,0.16)" stroke="rgba(109,40,217,0.16)" stroke-width="1"/>
                <ellipse cx="86" cy="77" rx="9" ry="5" fill="rgba(109,40,217,0.13)"/>
                <circle cx="92" cy="72" r="6" fill="rgba(109,40,217,0.18)"/>
                <ellipse cx="95" cy="67" rx="3.5" ry="4.5" fill="rgba(109,40,217,0.24)" transform="rotate(15 95 67)"/>
                <path d="M77 76Q71 69 75 64" stroke="rgba(109,40,217,0.22)" stroke-width="3.5" stroke-linecap="round" fill="none"/>
                <circle cx="7" cy="26" r="3.5" fill="rgba(109,40,217,0.18)"/>
                <circle cx="138" cy="30" r="2.5" fill="rgba(109,40,217,0.14)"/>
                <circle cx="126" cy="13" r="4.5" fill="rgba(109,40,217,0.1)"/>
                <circle cx="19" cy="17" r="2.5" fill="rgba(109,40,217,0.14)"/>
                <circle cx="7" cy="59" r="5.5" fill="rgba(109,40,217,0.13)"/>
                <path d="M4.5 59L6.5 61.5L10.5 56.5" stroke="rgba(109,40,217,0.5)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                <path d="M140 50L141.5 47L143 50L140 50Z" fill="rgba(109,40,217,0.24)"/>
                <path d="M7 40L8.5 37L10 40L7 40Z" fill="rgba(109,40,217,0.22)"/>
              </svg>
            </div>
            <div class="welcome-body">
              <p class="welcome-name">Xin chào, <strong>Vũ Ngọc Mai</strong></p>
              <p class="welcome-sub">Chúc bạn một ngày làm việc hiệu quả và tràn đầy năng lượng</p>
            </div>
          </div>

          <!-- Task grid -->
          <div class="task-grid">

            <!-- Cần thực hiện -->
            <div class="task-panel">
              <div class="task-panel__hd">
                <span class="task-panel__title">Cần thực hiện</span>
                <span class="task-badge task-badge--danger">{{ canThucHien.length }}</span>
              </div>
              <div class="task-list">
                <div
                  v-for="t in canThucHien"
                  :key="t.id"
                  class="task-item"
                  :class="`task-item--${t.color}`"
                >
                  <div class="task-item__body">
                    <span class="task-item__title">{{ t.title }}</span>
                    <span v-if="t.sub" class="task-item__sub">{{ t.sub }}</span>
                    <div v-if="t.assignee" class="task-item__assignee">
                      <div class="avatar-xs" :style="{ background: t.assignee.bg }">{{ t.assignee.initials }}</div>
                      <span>{{ t.assignee.name }}</span>
                    </div>
                  </div>
                  <span
                    v-if="t.deadline"
                    class="task-item__date"
                    :class="{ 'task-date--overdue': t.overdue }"
                  >{{ t.deadline }}</span>
                </div>
              </div>
            </div>

            <!-- Chờ người khác duyệt -->
            <div class="task-panel">
              <div class="task-panel__hd">
                <span class="task-panel__title">Chờ người khác duyệt</span>
                <span class="task-badge task-badge--warning">{{ choNguoiKhac.length }}</span>
              </div>
              <div class="task-list">
                <div
                  v-for="t in choNguoiKhac"
                  :key="t.id"
                  class="task-item task-item--orange"
                >
                  <div class="task-item__body">
                    <span class="task-item__title">{{ t.title }}</span>
                    <span v-if="t.sub" class="task-item__sub">{{ t.sub }}</span>
                  </div>
                </div>
              </div>
            </div>

          </div><!-- /task-grid -->
        </div><!-- /ov-main -->

        <!-- ── Right column ── -->
        <div class="ov-right">

          <!-- Chấm công -->
          <div class="cc-card">
            <div class="cc-card__icon-wrap">
              <TIcon name="clock-hour-4" />
            </div>
            <p class="cc-card__label">Bạn chưa chấm công hôm nay</p>
            <AppButton label="Chấm công ngay" icon-left="clock-hour-4" style="width:100%;margin-top:4px" />
          </div>

          <!-- Stats panel -->
          <div class="stats-panel">
            <div class="stat-row" v-for="s in stats" :key="s.label">
              <div class="stat-row__icon" :class="`stat-icon--${s.iconColor}`">
                <TIcon name="calendar" />
              </div>
              <span class="stat-row__label">{{ s.label }}</span>
              <span class="stat-row__value">{{ s.value }}</span>
            </div>
          </div>

          <!-- Tiện ích -->
          <div class="utility-panel">
            <h3 class="utility-panel__title">Tiện ích</h3>
            <div class="utility-list">
              <button v-for="u in utilities" :key="u.label" class="utility-item">
                <div class="utility-icon" :class="`utility-icon--${u.color}`">
                  <TIcon :name="u.icon" />
                </div>
                <span class="utility-item__label">{{ u.label }}</span>
              </button>
            </div>
          </div>

        </div><!-- /ov-right -->
      </div><!-- /ov-content -->
    </div><!-- /ov-scroll -->

  </AppShell>
</template>

<script setup>
import AppShell  from '../components/AppShell.vue'
import TIcon     from '@mds/components/TIcon.vue'
import AppButton from '@mds/components/AppButton.vue'

const canThucHien = [
  { id:1, title:'Đăng ký đồng phục',     sub:'Đợt cấp phát KSX_2025',           deadline:'12/04/2025 12:00', overdue:true,  color:'brand',   assignee:null },
  { id:2, title:'Xác nhận công',           sub:'Bảng chấm công Tháng 3/2026',      deadline:'12/04/2025 12:00', overdue:true,  color:'info',    assignee:null },
  { id:3, title:'Xác nhận lương',          sub:'Bảng lương Tháng 3/2026',          deadline:'12/04/2025 12:00', overdue:true,  color:'success', assignee:null },
  { id:4, title:'Thực hiện đánh giá',     sub:'Kỳ đánh giá tháng 3/2026 _KSX',   deadline:'12/04/2025 12:00', overdue:true,  color:'warning', assignee:null },
  { id:5, title:'Duyệt đơn xin nghỉ',     sub:'',                                  deadline:null,               overdue:false, color:'teal',    assignee:{ name:'Trần Ngọc Minh Anh', initials:'MA', bg:'#ede9fe' } },
  { id:6, title:'Nộp giấy tờ còn thiếu', sub:'',                                  deadline:null,               overdue:false, color:'neutral', assignee:null },
]

const choNguoiKhac = [
  { id:1, title:'Đăng ký ca',                  sub:'Yêu cầu đăng ký ca 03/2026' },
  { id:2, title:'Kết quả đánh giá',            sub:'Kỳ đánh giá tháng 3/2026 _KSX' },
  { id:3, title:'Đơn xin nghỉ - Nghỉ phép',   sub:'01/05/2026 08:20 - 02/05/2026 17:30' },
]

const stats = [
  { label:'Tổng ngày công',                   value:10, iconColor:'orange' },
  { label:'Ngày phép còn lại cả năm',         value:12, iconColor:'blue'   },
  { label:'Ngày phép còn lại đến hiện tại',   value:5,  iconColor:'blue'   },
]

const utilities = [
  { label:'Tạo đơn',           icon:'file-plus',    color:'orange' },
  { label:'Kiểm tra công',     icon:'clock-hour-4', color:'blue'   },
  { label:'Xem lịch làm việc', icon:'calendar',     color:'purple' },
]
</script>

<style scoped>
/* ── Page header ── */
.page-header {
  display: flex; align-items: center;
  height: var(--layout-page-header-h); padding: 0 20px;
  background: var(--bg-white); border-bottom: 1px solid var(--stroke-divider);
  flex-shrink: 0;
}
.page-header__left { display: flex; align-items: center; }
.page-header__title { margin: 0; }

/* ── Scroll + full-height layout ── */
.ov-scroll {
  flex: 1; overflow-y: auto; min-height: 0;
  background: var(--bg-page);
  display: flex; flex-direction: column;
}
.ov-content {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 284px;
  gap: 16px; padding: 16px;
  align-items: stretch;
  box-sizing: border-box;
}
.ov-main  { display: flex; flex-direction: column; gap: 16px; }
.ov-right { display: flex; flex-direction: column; gap: 12px; }

/* ── Welcome banner ── */
.welcome-banner {
  background: linear-gradient(135deg, var(--bg-brand-light) 0%, #ede9fe 60%, #ddd6fe 100%);
  border-radius: 12px;
  padding: 20px 24px;
  display: flex; align-items: center;
  gap: 8px; position: relative; overflow: hidden;
  box-shadow: var(--shadow-card);
  flex-shrink: 0;
}
.welcome-banner::before {
  content: '';
  position: absolute;
  width: 240px; height: 240px;
  right: -60px; top: -80px;
  border-radius: 50%;
  background: rgba(109,40,217,0.06);
  pointer-events: none;
}
.welcome-graphic { flex-shrink: 0; position: relative; z-index: 1; }
.welcome-body {
  display: flex; flex-direction: column; gap: 4px;
  z-index: 1; flex: 1;
}
.welcome-name {
  font-size: 17px; color: var(--text-primary); margin: 0; line-height: 26px;
}
.welcome-name strong { font-weight: var(--fw-bold); }
.welcome-sub { font-size: 13px; color: var(--text-secondary); margin: 0; line-height: 20px; }

/* ── Task grid — fills remaining main-column height ── */
.task-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: stretch;
}
.task-panel {
  background: var(--bg-white);
  border-radius: var(--radius-default);
  box-shadow: var(--shadow-card);
  padding: 20px;
  display: flex; flex-direction: column; gap: 14px;
}
.task-panel__hd {
  display: flex; align-items: center; gap: 8px;
  flex-shrink: 0;
}
.task-panel__title {
  font-size: 13px; font-weight: var(--fw-semibold);
  color: var(--text-primary); flex: 1;
}
.task-badge {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 20px; height: 20px; padding: 0 6px;
  border-radius: var(--radius-pill);
  font-size: 11px; font-weight: var(--fw-semibold); line-height: 1;
}
.task-badge--danger  { background: var(--bg-danger-light);  color: var(--text-danger);  }
.task-badge--warning { background: var(--bg-warning-light); color: var(--text-warning); }

/* Task list — flat style with accent, gap-separated */
.task-list { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.task-item {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 12px; padding: 9px 12px 9px 10px;
  border-left: 3px solid var(--stroke-neutral);
  border-radius: 0 6px 6px 0;
  cursor: pointer; transition: background 0.13s;
}
.task-item:hover { background: var(--bg-neutral-light); }

/* Left accent colors */
.task-item--brand   { border-left-color: var(--bg-brand); }
.task-item--info    { border-left-color: #3b82f6; }
.task-item--success { border-left-color: #16a34a; }
.task-item--warning { border-left-color: #d97706; }
.task-item--teal    { border-left-color: #0891b2; }
.task-item--neutral { border-left-color: var(--stroke-neutral); }
.task-item--orange  { border-left-color: #ea580c; }

.task-item__body { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }

.task-item__title {
  font-size: 13px; font-weight: var(--fw-semibold);
  color: var(--text-primary);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.task-item__sub {
  font-size: 12px; color: var(--text-secondary); line-height: 18px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.task-item__assignee { display: flex; align-items: center; gap: 6px; margin-top: 4px; }
.avatar-xs {
  width: 20px; height: 20px; border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: var(--fw-semibold);
  color: var(--text-brand); flex-shrink: 0;
}
.task-item__assignee span { font-size: 12px; color: var(--text-secondary); }

.task-item__date {
  font-size: 11px; font-weight: var(--fw-medium); white-space: nowrap; flex-shrink: 0;
  padding: 2px 8px; border-radius: 100px;
  background: var(--bg-neutral-light); color: var(--text-secondary);
  align-self: flex-start; margin-top: 2px;
}
.task-date--overdue { background: var(--bg-danger-light); color: var(--text-danger); }

/* ── Right column ── */

/* Chấm công card */
.cc-card {
  background: var(--bg-brand-light);
  border-radius: var(--radius-default);
  box-shadow: var(--shadow-card);
  padding: 20px;
  display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: 8px;
  flex-shrink: 0;
}
.cc-card__icon-wrap {
  width: 44px; height: 44px; border-radius: 50%;
  background: var(--bg-brand); color: #fff;
  display: flex; align-items: center; justify-content: center;
}
.cc-card__icon-wrap .ti { font-size: 22px; }
.cc-card__label { font-size: 13px; color: var(--text-secondary); line-height: 20px; margin: 0; }

/* Stats panel */
.stats-panel {
  background: var(--bg-white);
  border-radius: var(--radius-default);
  box-shadow: var(--shadow-card);
  padding: 20px;
  display: flex; flex-direction: column; gap: 12px;
  flex-shrink: 0;
}
.stat-row {
  display: flex; align-items: center; gap: 10px;
}
.stat-row__icon {
  width: 32px; height: 32px; border-radius: 8px;
  display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.stat-row__icon .ti { font-size: 16px; }
.stat-icon--orange { background: #fff7ed; color: #ea580c; }
.stat-icon--blue   { background: #eff6ff; color: #3b82f6; }
.stat-row__label { flex: 1; font-size: 12px; color: var(--text-secondary); line-height: 16px; }
.stat-row__value {
  font-size: 20px; font-weight: 700; color: var(--text-primary);
  line-height: 28px; flex-shrink: 0;
  font-feature-settings: 'lnum' 1, 'tnum' 1;
}

/* Utility panel — flex: 1 to fill remaining right-column height */
.utility-panel {
  background: var(--bg-white);
  border-radius: var(--radius-default);
  box-shadow: var(--shadow-card);
  padding: 20px;
  display: flex; flex-direction: column; gap: 8px;
  flex: 1;
}
.utility-panel__title {
  font-size: 12px; font-weight: var(--fw-semibold);
  color: var(--text-secondary); margin: 0;
  text-transform: uppercase; letter-spacing: 0.04em;
  flex-shrink: 0;
}
.utility-list { display: flex; flex-direction: column; gap: 2px; }
.utility-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 8px;
  border: none; background: transparent;
  border-radius: var(--radius-default); cursor: pointer;
  text-align: left; width: 100%;
  transition: background 0.12s;
}
.utility-item:hover { background: var(--bg-neutral-light); }
.utility-item__label { font-size: 13px; color: var(--text-primary); font-weight: var(--fw-medium); }
.utility-icon {
  width: 28px; height: 28px; border-radius: 8px;
  display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.utility-icon .ti { font-size: 16px; }
.utility-icon--orange { background: #fff7ed; color: #ea580c; }
.utility-icon--blue   { background: #eff6ff; color: #3b82f6; }
.utility-icon--purple { background: var(--bg-brand-light); color: var(--text-brand); }
</style>
