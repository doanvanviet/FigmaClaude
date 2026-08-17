<template>
  <Teleport to="body">
    <div class="ptm-overlay">
      <div class="ptm-overlay-inner" @mousedown.self="$emit('close')">
        <div class="ptm-dialog">

          <!-- ── Header ── -->
          <div class="ptm-hd">
            <div class="ptm-hd__left">
              <span class="ptm-hd__icon"><TIcon name="cash" /></span>
              <span class="ptm-hd__title">{{ type === 'thu' ? 'Phiếu thu' : 'Phiếu chi' }}</span>
              <span class="ptm-hd__no">{{ form.soPhieu }}</span>
            </div>
            <div class="ptm-hd__right">
              <button class="btn btn--ghost" type="button" style="gap:6px">
                <TIcon name="help-circle" style="font-size:14px;color:var(--text-success)" />
                Hướng dẫn sử dụng
                <TIcon name="chevron-down" style="font-size:12px;color:var(--text-secondary)" />
              </button>
              <button class="btn-icon btn-icon--outline" type="button" title="Phím tắt"><TIcon name="keyboard" /></button>
              <button class="btn-icon btn-icon--outline" type="button" title="Cài đặt"><TIcon name="settings" /></button>
              <button class="btn-icon btn-icon--outline" type="button" title="Đóng" @click="$emit('close')"><TIcon name="x" /></button>
            </div>
          </div>

          <!-- ── Body ── -->
          <div class="ptm-body">
            <div class="ptm-body-inner">

              <!-- Section: top form fields -->
              <div class="ptm-sec ptm-sec--top">

                <!-- Meta row: Loại phiếu + Lập từ -->
                <div class="ptm-meta-row">
                  <div class="field" style="width:220px;flex-shrink:0">
                    <label class="field__label">Loại phiếu</label>
                    <AppCombobox v-model="voucherType" :options="voucherTypeOptions" />
                  </div>
                  <div class="field" style="flex:1;min-width:0">
                    <label class="field__label">Lập từ phiếu khác</label>
                    <AppCombobox v-model="form.lapTuPhieu" :options="[]" placeholder="Chọn phiếu..." />
                  </div>
                </div>

                <!-- Form: 3 field rows + total panel -->
                <div class="ptm-form">
                  <div class="ptm-form__fields">

                    <!-- Row 1 -->
                    <div class="ptm-row">
                      <div class="field ptm-col-a">
                        <label class="field__label">Mã đối tượng</label>
                        <AppTextbox v-model="form.maDT" icon-right="chevron-down" />
                      </div>
                      <div class="field ptm-col-b">
                        <label class="field__label">Tên đối tượng</label>
                        <AppTextbox v-model="form.tenDT" />
                      </div>
                      <div class="field ptm-col-c">
                        <label class="field__label">Ngày hạch toán</label>
                        <AppDatebox v-model="form.ngayHachToan" />
                      </div>
                    </div>

                    <!-- Row 2 -->
                    <div class="ptm-row">
                      <div class="field ptm-col-a">
                        <label class="field__label">{{ type === 'thu' ? 'Người nộp' : 'Người nhận' }}</label>
                        <AppTextbox v-model="form.nguoi" />
                      </div>
                      <div class="field ptm-col-b">
                        <label class="field__label">Địa chỉ</label>
                        <AppTextbox v-model="form.diaChi" />
                      </div>
                      <div class="field ptm-col-c">
                        <label class="field__label">{{ type === 'thu' ? 'Ngày phiếu thu' : 'Ngày phiếu chi' }}</label>
                        <AppDatebox v-model="form.ngayPhieu" />
                      </div>
                    </div>

                    <!-- Row 3: 4 columns -->
                    <div class="ptm-row">
                      <div class="field ptm-col-a">
                        <label class="field__label">Nhân viên</label>
                        <AppCombobox v-model="form.nhanVien" :options="[]" />
                      </div>
                      <div class="field ptm-col-b">
                        <label class="field__label">{{ type === 'thu' ? 'Lý do nộp' : 'Lý do chi' }}</label>
                        <AppTextbox v-model="form.lyDo" icon-right="table" />
                      </div>
                      <div class="field ptm-col-kem">
                        <label class="field__label">Kèm theo</label>
                        <div class="ibox">
                          <input class="ibox__native" type="number" v-model="form.kemTheoSL" style="width:48px;flex-shrink:0" />
                          <span class="ibox-sep"></span>
                          <span class="ibox-label">chứng từ gốc</span>
                        </div>
                      </div>
                      <div class="field ptm-col-sophieu">
                        <label class="field__label">{{ type === 'thu' ? 'Số phiếu thu' : 'Số phiếu chi' }}</label>
                        <AppTextbox v-model="form.soPhieu" />
                      </div>
                    </div>

                  </div><!-- /ptm-form__fields -->

                  <!-- Total panel -->
                  <div class="ptm-form__total">
                    <span class="ptm-total-label">Tổng tiền thanh toán</span>
                    <div class="ptm-total-value">{{ totalDisplay }}</div>
                  </div>
                </div><!-- /ptm-form -->

              </div><!-- /ptm-sec--top -->

              <!-- Section: tabs + hạch toán table -->
              <div class="ptm-sec ptm-sec--table">

                <!-- Tab bar -->
                <div class="ptm-tabs-bar">
                  <div class="ptm-tabs">
                    <button class="ptm-tab" :class="{ active: activeTab === 'hachtoan' }" @click="activeTab = 'hachtoan'">Hạch toán</button>
                    <button class="ptm-tab" :class="{ active: activeTab === 'khac' }" @click="activeTab = 'khac'">Thông tin khác</button>
                  </div>
                  <div class="ptm-tabs__right">
                    <div class="ibox" style="width:132px">
                      <span class="ibox-label" style="flex-shrink:0;padding-left:4px">Loại tiền</span>
                      <select class="ibox__native ibox__native--select" v-model="form.loaiTien">
                        <option>VND</option><option>USD</option><option>EUR</option>
                      </select>
                      <TIcon name="chevron-down" class="ibox__icon" style="font-size: 13px;pointer-events:none;flex-shrink:0" />
                    </div>
                  </div>
                </div>

                <!-- Tab: Hạch toán -->
                <div v-if="activeTab === 'hachtoan'" class="ptm-hachtoan">
                  <div class="ht-table">
                    <div class="ht-row ht-row--header">
                      <div class="ht-cell ht-cell--stt">#</div>
                      <div class="ht-cell ht-cell--dg">Diễn giải</div>
                      <div class="ht-cell ht-cell--tk">TK Nợ</div>
                      <div class="ht-cell ht-cell--tk">TK Có</div>
                      <div class="ht-cell ht-cell--st">Số tiền</div>
                      <div class="ht-cell ht-cell--dt">Đối tượng</div>
                      <div class="ht-cell ht-cell--del"></div>
                    </div>
                    <div v-for="(row, i) in hachToanRows" :key="i" class="ht-row ht-row--body">
                      <div class="ht-cell ht-cell--stt">{{ i + 1 }}</div>
                      <div class="ht-cell ht-cell--dg"><input class="ht-input" type="text" v-model="row.dienGiai" /></div>
                      <div class="ht-cell ht-cell--tk"><input class="ht-input" type="text" v-model="row.tkNo" /></div>
                      <div class="ht-cell ht-cell--tk"><input class="ht-input" type="text" v-model="row.tkCo" /></div>
                      <div class="ht-cell ht-cell--st"><input class="ht-input ht-input--right" type="number" v-model="row.soTien" /></div>
                      <div class="ht-cell ht-cell--dt"><input class="ht-input" type="text" v-model="row.doiTuong" /></div>
                      <div class="ht-cell ht-cell--del">
                        <button class="btn-icon btn-icon--danger" type="button" @click="hachToanRows.splice(i, 1)">
                          <TIcon name="trash" />
                        </button>
                      </div>
                    </div>
                    <div class="ht-row ht-row--footer">
                      <div class="ht-cell ht-cell--stt"></div>
                      <div class="ht-cell ht-cell--dg"></div>
                      <div class="ht-cell ht-cell--tk"></div>
                      <div class="ht-cell ht-cell--tk"></div>
                      <div class="ht-cell ht-cell--st ht-cell--total">{{ totalDisplay }}</div>
                      <div class="ht-cell ht-cell--dt"></div>
                      <div class="ht-cell ht-cell--del"></div>
                    </div>
                  </div>

                  <div class="ht-controls">
                    <div class="ht-controls__left">
                      <button class="btn btn--outline btn--neutral" type="button"
                        @click="hachToanRows.push({ dienGiai: '', tkNo: type==='thu'?'1111':'331', tkCo: type==='thu'?'511':'1111', soTien: 0, doiTuong: '' })">
                        <TIcon name="plus" /> Thêm dòng
                      </button>
                      <button class="btn-icon btn-icon--outline btn-icon--danger" type="button" title="Xóa hết dòng" @click="hachToanRows = []">
                        <TIcon name="trash" />
                      </button>
                    </div>
                    <span class="ht-count">Tổng số: {{ hachToanRows.length }} bản ghi</span>
                  </div>
                </div>

                <!-- Tab: Thông tin khác -->
                <div v-if="activeTab === 'khac'" class="ptm-tab-empty">
                  <span class="caption text-secondary">Không có thông tin bổ sung</span>
                </div>

              </div><!-- /ptm-sec--table -->

            </div><!-- /ptm-body-inner -->
          </div><!-- /ptm-body -->

          <!-- ── Footer ── -->
          <div class="ptm-ft">
            <div class="ptm-ft__left">
              <label class="ptm-ft__toggle" @click="showTK = !showTK">
                <div class="toggle-sw" :class="{ 'toggle-sw--on': showTK }"></div>
                <span>Hiển thị tài khoản</span>
              </label>
            </div>
            <div class="ptm-ft__center">
              <button class="btn ptm-ft__btn-ghost" type="button" @click="$emit('close')">Hủy</button>
            </div>
            <div class="ptm-ft__right">
              <button class="btn ptm-ft__btn-ghost" type="button">Cất</button>
              <div class="btn-split">
                <button class="btn btn--primary" type="button">Cất và In</button>
                <button class="btn btn--primary btn-split__arrow" type="button"><TIcon name="chevron-down" /></button>
              </div>
            </div>
          </div>

        </div><!-- /ptm-dialog -->
      </div><!-- /ptm-overlay-inner -->
    </div><!-- /ptm-overlay -->
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import TIcon       from '@mds/components/TIcon.vue'
import AppTextbox  from '@mds/components/AppTextbox.vue'
import AppCombobox from '@mds/components/AppCombobox.vue'
import AppDatebox  from '@mds/components/AppDatebox.vue'

const props = defineProps({
  type: { type: String, default: 'thu' }
})
defineEmits(['close'])

const activeTab = ref('hachtoan')
const showTK    = ref(true)

const voucherTypeOptions = ['1. Thu nợ', '2. Thu tạm ứng', '3. Thu tiền bán hàng', '4. Thu nội bộ', '5. Thu khác']
const voucherType = ref(props.type === 'thu' ? '5. Thu khác' : '5. Chi khác')

const form = ref({
  maDT: '', tenDT: '',
  ngayHachToan: '',
  nguoi: '', diaChi: '',
  ngayPhieu: '',
  nhanVien: '',
  lyDo: props.type === 'thu' ? 'Thu tiền của' : 'Chi tiền cho',
  kemTheoSL: '',
  soPhieu: props.type === 'thu' ? 'PT00020' : 'PC00020',
  loaiTien: 'VND',
  lapTuPhieu: '',
})

const hachToanRows = ref([
  props.type === 'thu'
    ? { dienGiai: 'Thu tiền của', tkNo: '1111', tkCo: '511', soTien: 0, doiTuong: '' }
    : { dienGiai: 'Chi tiền cho', tkNo: '331', tkCo: '1111', soTien: 0, doiTuong: '' }
])

const totalDisplay = computed(() =>
  hachToanRows.value.reduce((s, r) => s + (Number(r.soTien) || 0), 0).toLocaleString('vi-VN')
)
</script>

<style scoped>
/* ── Overlay ── */
.ptm-overlay {
  position: fixed;
  top: 0; left: 0; bottom: 0;
  right: var(--ava-panel-width, 0px);
  z-index: 1200;
  background: rgba(16, 24, 40, 0.45);
  overflow-x: auto;
  overflow-y: auto;
}

.ptm-overlay-inner {
  width: max-content;
  min-width: 100%;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
}

/* ── Dialog ── */
.ptm-dialog {
  width: 1100px;
  min-width: 1024px;
  max-height: 90vh;
  display: flex; flex-direction: column;
  background: var(--bg-white);
  border-radius: var(--radius-dialog);
  box-shadow: var(--shadow-dialog);
  overflow: hidden;
}

/* ── Header ── */
.ptm-hd {
  display: flex; align-items: center; justify-content: space-between;
  height: var(--layout-page-header-h); padding: 0 16px; flex-shrink: 0;
  background: var(--bg-white);
  border-bottom: 1px solid var(--stroke-neutral-light);
  gap: 12px;
}
.ptm-hd__left  { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
.ptm-hd__right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.ptm-hd__icon {
  width: 32px; height: 32px; border-radius: var(--radius-default);
  background: var(--bg-brand-light); color: var(--icon-brand);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; flex-shrink: 0;
}
.ptm-hd__title { font-size: var(--text-h3); font-weight: var(--fw-semibold); color: var(--text-primary); white-space: nowrap; }
.ptm-hd__no {
  font-size: 13px; color: var(--text-secondary);
  background: var(--bg-neutral-light); border-radius: var(--radius-sm);
  padding: 2px 8px; white-space: nowrap;
}

/* ── Body ── */
.ptm-body {
  flex: 1; min-height: 0;
  overflow-y: auto; overflow-x: hidden;
  display: flex; flex-direction: column;
}
.ptm-body-inner { flex: 1; display: flex; flex-direction: column; }

/* ── Field label ── */
.field__label {
  display: block;
  font-size: 13px;
  font-weight: var(--fw-medium);
  color: var(--text-primary);
  line-height: var(--text-body-lh);
  margin-bottom: 4px;
}

/* ── Section: top form ── */
.ptm-sec--top {
  flex-shrink: 0;
  padding: 16px 20px 12px;
  display: flex; flex-direction: column; gap: 12px;
  border-bottom: 1px solid var(--stroke-divider);
}

.ptm-meta-row { display: flex; gap: 14px; align-items: flex-end; }

.ptm-form { display: flex; gap: 16px; align-items: flex-start; }
.ptm-form__fields { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 12px; }
.ptm-row { display: flex; gap: 14px; align-items: flex-start; }

.ptm-col-a       { width: 185px; flex-shrink: 0; }
.ptm-col-b       { flex: 1; min-width: 120px; }
.ptm-col-c       { width: 185px; flex-shrink: 0; }
.ptm-col-kem     { width: 155px; flex-shrink: 0; }
.ptm-col-sophieu { width: 145px; flex-shrink: 0; }

.ptm-form__total {
  width: 164px; flex-shrink: 0;
  display: flex; flex-direction: column; align-items: flex-end; gap: 4px;
  padding-top: 24px;
}
.ptm-total-label { font-size: var(--text-sm); color: var(--text-secondary); text-align: right; }
.ptm-total-value {
  font-size: 26px; font-weight: var(--fw-bold);
  color: var(--text-primary); line-height: 1.1;
  font-feature-settings: 'lnum' 1, 'tnum' 1;
  white-space: nowrap;
}

.ibox-sep   { width: 1px; height: 16px; background: var(--stroke-neutral-light); flex-shrink: 0; }
.ibox-label { font-size: 13px; color: var(--text-primary); white-space: nowrap; flex-shrink: 0; cursor: default; }

/* ── Section: tabs + table ── */
.ptm-sec--table {
  flex: 1; min-height: 0;
  display: flex; flex-direction: column;
  padding: 0 20px 16px;
}

.ptm-tabs-bar {
  display: flex; align-items: flex-end; justify-content: space-between;
  border-bottom: 1px solid var(--stroke-divider);
  flex-shrink: 0; gap: 12px;
}
.ptm-tabs { display: flex; }
.ptm-tab {
  height: 40px; padding: 0 16px;
  font-size: 13px; font-weight: var(--fw-medium); font-family: var(--font-family);
  color: var(--text-secondary);
  background: transparent; border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  cursor: pointer; transition: color 0.15s, border-color 0.15s;
  white-space: nowrap;
}
.ptm-tab:hover  { color: var(--text-primary); }
.ptm-tab.active { color: var(--text-brand); border-bottom-color: var(--stroke-brand); font-weight: var(--fw-semibold); }
.ptm-tabs__right { display: flex; align-items: center; gap: 8px; padding-bottom: 8px; }

/* ── Hạch toán ── */
.ptm-hachtoan { display: flex; flex-direction: column; }

/* Khung dùng chung (.ht-table/.ht-row/.ht-cell) đã chuyển sang style.css global,
   ở đây chỉ còn tweak riêng + class độ rộng cột của popup tiền mặt. */
.ht-table { margin-top: 12px; }
.ht-cell--stt { width: 40px; justify-content: center; color: var(--text-secondary); font-size: 12px; flex-shrink: 0; }
.ht-cell--dg  { flex: 1; min-width: 100px; }
.ht-cell--tk  { width: 90px; flex-shrink: 0; }
.ht-cell--st  { width: 130px; justify-content: flex-end; flex-shrink: 0; }
.ht-cell--dt  { width: 140px; flex-shrink: 0; }
.ht-cell--del { width: 40px; justify-content: center; flex-shrink: 0; }

.ht-input {
  width: 100%; height: var(--input-height); padding: 0 4px;
  font-family: var(--font-family); font-size: 13px; color: var(--text-primary);
  background: transparent; border: 1px solid transparent;
  border-radius: var(--radius-sm); outline: none;
  transition: border-color 0.15s, background 0.15s;
}
.ht-input:hover { border-color: var(--stroke-neutral); background: var(--bg-white); }
.ht-input:focus { border-color: var(--stroke-brand); background: var(--bg-white); box-shadow: 0 0 0 2px rgba(4,153,228,0.12); }
.ht-input--right { text-align: right; font-feature-settings: 'lnum' 1, 'tnum' 1; }
.ht-input[type=number]::-webkit-inner-spin-button,
.ht-input[type=number]::-webkit-outer-spin-button { appearance: none; }
.ht-input[type=number] { -moz-appearance: textfield; }

.ht-controls {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 0 0; gap: 12px;
}
.ht-controls__left { display: flex; align-items: center; gap: 8px; }
.ht-count { font-size: 12px; color: var(--text-secondary); white-space: nowrap; }

.ptm-tab-empty {
  flex: 1; display: flex; align-items: center; justify-content: center;
  padding: 40px; color: var(--text-hint);
}

/* ── Footer (dark) ── */
.ptm-ft {
  display: flex; align-items: center;
  height: 52px; padding: 0 16px; flex-shrink: 0;
  background: var(--neutral-800);
  border-top: 1px solid rgba(255,255,255,0.08);
  gap: 16px;
}
.ptm-ft__left   { flex: 1; display: flex; align-items: center; }
.ptm-ft__center { flex-shrink: 0; display: flex; align-items: center; }
.ptm-ft__right  { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

.ptm-ft__btn-ghost {
  height: var(--btn-height); min-width: 72px; padding: 0 12px;
  border: 1px solid rgba(255,255,255,0.25);
  background: transparent; color: #fff;
  border-radius: var(--radius-default);
  font-family: var(--font-family); font-size: 13px; font-weight: var(--fw-medium);
  cursor: pointer; transition: background 0.15s;
  white-space: nowrap;
}
.ptm-ft__btn-ghost:hover { background: rgba(255,255,255,0.10); }

/* Toggle switch */
.ptm-ft__toggle {
  display: flex; align-items: center; gap: 8px;
  cursor: pointer; user-select: none;
  color: #fff; font-size: 13px;
  font-family: var(--font-family);
}
.toggle-sw {
  width: 36px; height: 20px;
  border-radius: 10px;
  background: rgba(255,255,255,0.20);
  position: relative; flex-shrink: 0;
  transition: background 0.2s;
}
.toggle-sw::after {
  content: '';
  position: absolute;
  top: 2px; left: 2px;
  width: 16px; height: 16px;
  border-radius: 50%;
  background: #fff;
  transition: left 0.2s;
}
.toggle-sw--on { background: var(--bg-success); }
.toggle-sw--on::after { left: 18px; }

/* ── Animation ── */
.ptm-overlay { animation: ptm-ov-in 0.18s ease; }
.ptm-dialog  { animation: ptm-dlg-in 0.22s cubic-bezier(0.16,1,0.3,1); }
@keyframes ptm-ov-in  { from { opacity: 0 } to { opacity: 1 } }
@keyframes ptm-dlg-in { from { opacity: 0; transform: scale(0.97) translateY(8px) } to { opacity: 1; transform: none } }
</style>
