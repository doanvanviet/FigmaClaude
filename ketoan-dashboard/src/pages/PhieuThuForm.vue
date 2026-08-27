<script setup>
import { ref, computed } from 'vue'
import TIcon        from '@mds/components/TIcon.vue'
import TablePaging  from '@mds/components/TablePaging.vue'
import IconMisaAI   from '@mds/components/IconMisaAI.vue'
import AppTextbox   from '@mds/components/AppTextbox.vue'
import AppCombobox  from '@mds/components/AppCombobox.vue'
import AppDatebox   from '@mds/components/AppDatebox.vue'

const emit = defineEmits(['close'])

const voucherType = ref('5. Thu khác')
const searchVoucher = ref('')

const form = ref({
  maDT: '',
  tenDT: '',
  ngayHachToan: '04/06/2026',
  nguoiNop: '',
  diaChi: '',
  ngayPhieuThu: '04/06/2026',
  nhanVien: '',
  lyDoNop: 'Thu tiền của',
  kemTheoSL: '',
  soPhieuThu: 'PT00020',
  thamChieu: '',
  loaiTien: 'VND',
})

const hachToanRows = ref([
  { dienGiai: 'Thu tiền của', tkNo: '1111', tkCo: '', soTien: 0, doiTuong: '', tenDoiTuong: '' }
])

function addRow() {
  hachToanRows.value.push({ dienGiai: '', tkNo: '', tkCo: '', soTien: 0, doiTuong: '', tenDoiTuong: '' })
}
function clearAllRows() { hachToanRows.value = [] }
function deleteRow(i) { hachToanRows.value.splice(i, 1) }

const totalSoTien = computed(() =>
  hachToanRows.value.reduce((s, r) => s + (Number(r.soTien) || 0), 0)
)
const totalDisplay = computed(() =>
  totalSoTien.value.toLocaleString('vi-VN')
)

const page = ref(1)
const pageSize = ref(20)
const showTK = ref(true)
</script>

<template>
  <div class="phieu-thu-form">

    <!-- ── Form bar (replaces sub-nav) ── -->
    <div class="form-bar">
      <div class="form-bar__left">
        <div class="form-bar__icon-box">
          <TIcon name="cash" />
        </div>
        <span class="form-bar__title">Phiếu thu <strong>{{ form.soPhieuThu }}</strong></span>
        <div class="form-bar__sep"></div>
        <AppCombobox v-model="voucherType"
          :options="['1. Thu nợ','2. Thu tạm ứng','3. Thu tiền bán hàng','4. Thu nội bộ','5. Thu khác']"
          class="form-bar__type" />
        <AppTextbox v-model="searchVoucher"
          icon-left="search"
          placeholder="Nhập số phiếu chi từ chi nhánh khác chuyển đến"
          class="form-bar__search" />
      </div>
      <div class="form-bar__right">
        <button class="btn btn--outline btn--neutral" type="button">
          <TIcon name="help-circle" style="font-size:15px;color:var(--text-success)" />
          Hướng dẫn sử dụng
          <TIcon name="chevron-down" style="font-size: 13px" />
        </button>
        <button class="btn-icon btn-icon--outline" type="button"><TIcon name="settings" /></button>
        <button class="btn-icon btn-icon--outline" type="button" @click="emit('close')"><TIcon name="x" /></button>
      </div>
    </div>

    <!-- ── Form body (scrollable) ── -->
    <div class="form-body">

      <!-- Field rows -->
      <div class="form-fields">

        <!-- Row 1 -->
        <div class="form-row">
          <div class="field form-col-1">
            <label class="field__label">Mã đối tượng</label>
            <AppTextbox v-model="form.maDT" icon-right="chevron-down" />
          </div>
          <div class="field form-col-2">
            <label class="field__label">Tên đối tượng</label>
            <AppTextbox v-model="form.tenDT" />
          </div>
          <div class="field form-col-3">
            <label class="field__label">Ngày hạch toán</label>
            <AppDatebox v-model="form.ngayHachToan" />
          </div>
          <div class="field form-col-4 form-col-4--total">
            <span class="form-total-label">Tổng tiền</span>
            <div class="form-total-value">{{ totalDisplay }}</div>
          </div>
        </div>

        <!-- Row 2 -->
        <div class="form-row">
          <div class="field form-col-1">
            <label class="field__label">Người nộp</label>
            <AppTextbox v-model="form.nguoiNop" />
          </div>
          <div class="field form-col-2">
            <label class="field__label">Địa chỉ</label>
            <AppTextbox v-model="form.diaChi" />
          </div>
          <div class="field form-col-3">
            <label class="field__label">Ngày phiếu thu</label>
            <AppDatebox v-model="form.ngayPhieuThu" />
          </div>
          <div class="form-col-4"></div>
        </div>

        <!-- Row 3 -->
        <div class="form-row">
          <div class="field form-col-1">
            <label class="field__label">Nhân viên</label>
            <AppCombobox v-model="form.nhanVien" :options="[]" />
          </div>
          <div class="field form-col-2">
            <label class="field__label">Lý do nộp</label>
            <AppTextbox v-model="form.lyDoNop" icon-right="table" />
          </div>
          <div class="field form-col-3">
            <label class="field__label">Kèm theo</label>
            <div class="ibox">
              <input class="ibox__native" type="number" v-model="form.kemTheoSL" placeholder="Số lượng" style="width:64px;flex-shrink:0" />
              <div class="ibox-sep"></div>
              <span class="ibox-label">chứng từ gốc</span>
            </div>
          </div>
          <div class="field form-col-4">
            <label class="field__label">Số phiếu thu</label>
            <AppTextbox v-model="form.soPhieuThu" />
          </div>
        </div>

        <!-- Row 4: Tham chiếu -->
        <div class="form-row form-row--ref">
          <span class="field__label" style="flex-shrink:0">Tham chiếu</span>
          <button class="btn btn--ghost form-ref-btn" type="button" style="min-width:0;padding:0 4px">...</button>
        </div>

      </div><!-- /form-fields -->

      <!-- Section divider -->
      <div class="form-section-divider"></div>

      <!-- ── Hạch toán ── -->
      <div class="hach-toan">

        <div class="hach-toan__header">
          <span class="section-title h3">Hạch toán</span>
          <div class="hach-toan__header-right">
            <div class="btn-split">
              <button class="btn btn--ai" type="button">
                <IconMisaAI />AVA Kế toán
              </button>
              <button class="btn btn--ai btn-split__arrow" type="button">
                <TIcon name="chevron-down" />
              </button>
            </div>
            <div class="ibox" style="width:140px">
              <span class="ibox-label" style="flex-shrink:0">Loại tiền</span>
              <select class="ibox__native ibox__native--select" v-model="form.loaiTien">
                <option>VND</option><option>USD</option><option>EUR</option>
              </select>
              <TIcon name="chevron-down" class="ibox__icon" style="font-size: 13px;pointer-events:none;flex-shrink:0" />
            </div>
          </div>
        </div>

        <!-- Inline-editable accounting table -->
        <div class="ht-table">
          <div class="ht-row ht-row--header">
            <div class="ht-cell ht-cell--stt">#</div>
            <div class="ht-cell ht-cell--dien-giai">Diễn giải</div>
            <div class="ht-cell ht-cell--tk">TK Nợ</div>
            <div class="ht-cell ht-cell--tk">TK Có</div>
            <div class="ht-cell ht-cell--so-tien">Số Tiền</div>
            <div class="ht-cell ht-cell--doi-tuong">Đối tượng</div>
            <div class="ht-cell ht-cell--ten-dt">Tên đối tượng</div>
            <div class="ht-cell ht-cell--del"></div>
          </div>

          <div v-for="(row, i) in hachToanRows" :key="i" class="ht-row ht-row--body">
            <div class="ht-cell ht-cell--stt">{{ i + 1 }}</div>
            <div class="ht-cell ht-cell--dien-giai">
              <input class="ht-input" type="text" v-model="row.dienGiai" />
            </div>
            <div class="ht-cell ht-cell--tk">
              <input class="ht-input" type="text" v-model="row.tkNo" />
            </div>
            <div class="ht-cell ht-cell--tk">
              <input class="ht-input" type="text" v-model="row.tkCo" />
            </div>
            <div class="ht-cell ht-cell--so-tien">
              <input class="ht-input ht-input--right" type="number" v-model="row.soTien" />
            </div>
            <div class="ht-cell ht-cell--doi-tuong">
              <input class="ht-input" type="text" v-model="row.doiTuong" />
            </div>
            <div class="ht-cell ht-cell--ten-dt">
              <input class="ht-input" type="text" v-model="row.tenDoiTuong" />
            </div>
            <div class="ht-cell ht-cell--del">
              <button class="btn-icon btn-icon--danger" type="button" @click="deleteRow(i)">
                <TIcon name="trash" />
              </button>
            </div>
          </div>

          <!-- Footer total row -->
          <div class="ht-row ht-row--footer">
            <div class="ht-cell ht-cell--stt"></div>
            <div class="ht-cell ht-cell--dien-giai"></div>
            <div class="ht-cell ht-cell--tk"></div>
            <div class="ht-cell ht-cell--tk"></div>
            <div class="ht-cell ht-cell--so-tien ht-cell--total">{{ totalDisplay }}</div>
            <div class="ht-cell ht-cell--doi-tuong"></div>
            <div class="ht-cell ht-cell--ten-dt"></div>
            <div class="ht-cell ht-cell--del"></div>
          </div>
        </div><!-- /ht-table -->

        <!-- Table controls -->
        <div class="ht-controls">
          <div class="ht-controls__left">
            <button class="btn btn--outline btn--neutral" type="button" @click="addRow">Thêm dòng</button>
            <button class="btn btn--outline btn--neutral" type="button" @click="clearAllRows">Xóa hết dòng</button>
          </div>
          <div class="ht-controls__right">
            <TablePaging :total="hachToanRows.length" v-model:page="page" v-model:page-size="pageSize" :page-size-options="[20, 50]" />
          </div>
        </div>

      </div><!-- /hach-toan -->

      <!-- ── Đính kèm ── -->
      <div class="dinh-kem">
        <div class="dinh-kem__header">
          <TIcon name="paperclip" style="font-size:16px;color:var(--icon-neutral)" />
          <span style="font-weight:var(--fw-medium)">Đính kèm</span>
          <span style="color:var(--text-secondary)">Dung lượng tối đa 5MB</span>
        </div>
        <div class="dinh-kem__dropzone">
          Kéo/thả tệp vào đây hoặc bấm vào đây
        </div>
      </div>

    </div><!-- /form-body -->

    <!-- ── Form footer ── -->
    <div class="form-footer">
      <span class="form-footer__hints">F3 - Tìm nhanh, F9 - Thêm nhanh</span>
      <div class="form-footer__center">
        <button class="btn form-footer__btn-huy" type="button" @click="emit('close')">Hủy</button>
      </div>
      <div class="form-footer__right">
        <label class="form-footer__toggle" @click="showTK = !showTK">
          <div class="toggle-sw" :class="{ 'toggle-sw--on': showTK }"></div>
          <span>Hiển thị tài khoản</span>
        </label>
        <button class="btn form-footer__btn-cat" type="button">Cất</button>
        <div class="btn-split">
          <button class="btn btn--primary" type="button">Cất và Thêm</button>
          <button class="btn btn--primary btn-split__arrow" type="button">
            <TIcon name="chevron-down" />
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* ── Root ── */
.phieu-thu-form {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  background: var(--bg-page);
}

/* ── Form bar ── */
.form-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 16px;
  background: var(--bg-white);
  border-bottom: 1px solid var(--stroke-neutral-light);
  flex-shrink: 0;
  gap: 12px;
}
.form-bar__left  { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
.form-bar__right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

.form-bar__icon-box {
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  background: var(--bg-brand-light);
  border-radius: var(--radius-inner);
  color: var(--text-brand);
  font-size: 16px;
  flex-shrink: 0;
}
.form-bar__title {
  font-size: 13px;
  color: var(--text-primary);
  white-space: nowrap;
  flex-shrink: 0;
}
.form-bar__sep {
  width: 1px;
  height: 20px;
  background: var(--stroke-neutral-light);
  flex-shrink: 0;
}
.form-bar__type  { width: 200px; flex-shrink: 0; }
.form-bar__search { flex: 1; min-width: 0; max-width: 360px; }

/* ── Form body ── */
.form-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px 24px 24px;
  display: flex;
  flex-direction: column;
}

/* ── Field label ── */
.field__label {
  display: block;
  font-size: 13px;
  font-weight: var(--fw-semibold);
  color: var(--text-primary);
  line-height: var(--text-body-lh);
  margin-bottom: 4px;
}

/* ── Form fields ── */
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 12px;
}
.form-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
.form-row--ref {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: var(--input-height);
}

/* Column widths — consistent across rows */
.form-col-1 { width: 200px; flex-shrink: 0; }
.form-col-2 { flex: 1; min-width: 0; }
.form-col-3 { width: 220px; flex-shrink: 0; }
.form-col-4 { width: 175px; flex-shrink: 0; }

/* Tổng tiền display (col 4 row 1) */
.form-col-4--total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}
.form-total-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: var(--text-sm-lh);
}
.form-total-value {
  font-size: 28px;
  font-weight: var(--fw-bold);
  color: var(--text-primary);
  line-height: 1;
  font-feature-settings: 'lnum' 1, 'tnum' 1;
}

/* ibox separator (Kèm theo) */
.ibox-sep {
  width: 1px; height: 16px;
  background: var(--stroke-neutral-light);
  flex-shrink: 0;
}
.ibox-label {
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
  flex-shrink: 0;
  cursor: default;
}

/* Section divider */
.form-section-divider {
  height: 1px;
  background: var(--stroke-divider);
  margin: 12px -24px;
}

/* ── Hạch toán ── */
.hach-toan { display: flex; flex-direction: column; }

.hach-toan__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0 10px;
  gap: 12px;
}
.hach-toan__header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.section-title {
  font-size: var(--text-h3);
  font-weight: var(--fw-semibold);
  line-height: var(--text-h3-lh);
  color: var(--text-primary);
}

/* ── Inline accounting table ──
   Khung dùng chung (.ht-table/.ht-row/.ht-cell) đã chuyển sang style.css global,
   ở đây chỉ còn class độ rộng cột riêng của phiếu thu. */
.ht-cell--stt      { width: 44px; justify-content: center; color: var(--text-secondary); font-size: 12px; }
.ht-cell--dien-giai{ flex: 1; min-width: 0; }
.ht-cell--tk       { width: 100px; }
.ht-cell--so-tien  { width: 130px; justify-content: flex-end; }
.ht-cell--doi-tuong{ width: 120px; }
.ht-cell--ten-dt   { width: 180px; }
.ht-cell--del      { width: 44px; justify-content: center; }

.ht-row--header .ht-cell--stt,
.ht-row--header .ht-cell--del { color: var(--text-hint); }

/* Inline inputs */
.ht-input {
  width: 100%;
  height: var(--input-height);
  padding: 0 4px;
  font-family: var(--font-family);
  font-size: 13px;
  color: var(--text-primary);
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  outline: none;
  transition: border-color 0.15s, background 0.15s;
}
.ht-input:hover  { border-color: var(--stroke-neutral); background: var(--bg-white); }
.ht-input:focus  { border-color: var(--stroke-brand); background: var(--bg-white); box-shadow: 0 0 0 2px rgba(4,153,228,0.12); }
.ht-input--right { text-align: right; font-feature-settings: 'lnum' 1, 'tnum' 1; }
/* hide number spinners */
.ht-input[type=number]::-webkit-inner-spin-button,
.ht-input[type=number]::-webkit-outer-spin-button { appearance: none; }
.ht-input[type=number] { -moz-appearance: textfield; }

/* Table controls */
.ht-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  gap: 12px;
  flex-wrap: wrap;
}
.ht-controls__left  { display: flex; align-items: center; gap: 8px; }
.ht-controls__right { display: flex; align-items: center; gap: 0; }
.ht-record-count {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
  padding-right: 12px;
}

/* ── Đính kèm ── */
.dinh-kem {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dinh-kem__header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-primary);
}
.dinh-kem__dropzone {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 280px;
  height: 60px;
  border: 1.5px dashed var(--stroke-neutral);
  border-radius: var(--radius-default);
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.dinh-kem__dropzone:hover {
  border-color: var(--stroke-brand);
  background: var(--bg-brand-light);
  color: var(--text-brand);
}

/* ── Form footer ── */
.form-footer {
  display: flex;
  align-items: center;
  height: 52px;
  padding: 0 16px;
  background: var(--neutral-100);
  border-top: 1px solid var(--stroke-neutral-light);
  flex-shrink: 0;
  gap: 16px;
}
.form-footer__hints {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
  flex: 1;
}
.form-footer__center {
  flex-shrink: 0;
}
.form-footer__right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

/* Hủy button */
.form-footer__btn-huy {
  height: var(--btn-height);
  min-width: 72px;
  padding: 0 var(--btn-px);
  font-size: 13px; font-weight: var(--fw-medium);
  border-radius: var(--radius-default);
  border: 1px solid var(--stroke-neutral);
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  transition: background 0.15s;
}
.form-footer__btn-huy:hover { background: var(--bg-neutral-hover); }

/* Cất button */
.form-footer__btn-cat {
  height: var(--btn-height);
  min-width: 72px;
  padding: 0 var(--btn-px);
  font-size: 13px; font-weight: var(--fw-medium);
  border-radius: var(--radius-default);
  border: 1px solid var(--stroke-neutral);
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  transition: background 0.15s;
}
.form-footer__btn-cat:hover { background: var(--bg-neutral-hover); }

/* Toggle switch */
.form-footer__toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-primary);
  user-select: none;
}
.toggle-sw {
  width: 36px; height: 20px;
  border-radius: 10px;
  background: var(--stroke-neutral);
  position: relative;
  flex-shrink: 0;
  transition: background 0.2s;
}
.toggle-sw::after {
  content: '';
  position: absolute;
  top: 2px; left: 2px;
  width: 16px; height: 16px;
  border-radius: 50%;
  background: var(--text-white);
  transition: transform 0.18s;
}
.toggle-sw--on { background: var(--bg-success); }
.toggle-sw--on::after { transform: translateX(16px); }
</style>
