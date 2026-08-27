<template>
  <Teleport to="body">
    <div class="bh-overlay">

      <!-- ── Bar (header) ── -->
      <div class="bh-bar">
        <div class="bh-bar__left">
          <button class="btn-icon btn-icon--ghost" type="button" title="Lịch sử chỉnh sửa">
            <TIcon name="history" style="font-size:20px" />
          </button>
          <span class="bh-bar__title">Chứng từ bán hàng {{ form.soChungTu || 'BH00001' }}</span>
          <span class="bh-bar__sep"></span>
          <AppCombobox v-model="form.loaiPhieu" :options="loaiPhieuOptions" :state="fieldState" style="width:220px" />
          <div class="bh-bar__search">
            <button class="bh-bar__search-cfg" type="button" title="Thiết lập tìm kiếm"><TIcon name="settings" /></button>
            <input class="bh-bar__search-input" type="text" placeholder="Nhập số phiếu xuất" />
            <TIcon name="search" class="bh-bar__search-icon" />
            <button class="bh-bar__search-arrow" type="button"><TIcon name="chevron-down" /></button>
          </div>
        </div>
        <div class="bh-bar__right">
          <button class="btn btn--ghost" type="button" style="gap:6px;font-size: 13px">
            <TIcon name="help-circle" style="color:var(--text-success)" />
            Hướng dẫn sử dụng
          </button>
          <button class="btn-icon btn-icon--ghost" type="button" title="Trao đổi">
            <TIcon name="message-circle" />
          </button>
          <button class="btn-icon btn-icon--ghost" type="button" title="Cài đặt">
            <TIcon name="settings" />
          </button>
          <button class="btn-icon btn-icon--ghost" type="button" title="Đóng" @click="$emit('close')">
            <TIcon name="x" />
          </button>
        </div>
      </div>

      <!-- ── Body (cuộn hết — toolbar + sub-nav nằm trong này để cuộn theo, chỉ .bh-bar và footer đứng yên) ── -->
      <div class="bh-body">

        <!-- ── Toolbar ── -->
        <div class="bh-toolbar">
          <div class="bh-toolbar__left">
            <label class="bh-radio">
              <input type="radio" v-model="form.thuTienNgay" :value="false" :disabled="readonly" />
              <span>Chưa thu tiền</span>
            </label>
            <label class="bh-radio">
              <input type="radio" v-model="form.thuTienNgay" :value="true" :disabled="readonly" />
              <span>Thu tiền ngay</span>
            </label>
            <span class="bh-sep"></span>
            <AppCombobox v-if="form.thuTienNgay" v-model="form.phuongThucThu" :options="['Tiền mặt','Tiền gửi ngân hàng']" :state="fieldState" style="width:160px" />
            <span v-if="form.thuTienNgay" class="bh-sep"></span>
            <label class="bh-check">
              <AppCheckbox v-model="form.kiemPhieuXuat" :disabled="readonly" />
              <span>Kiểm phiếu xuất</span>
            </label>
            <label class="bh-check">
              <AppCheckbox v-model="form.lapKemHoaDon" :disabled="readonly" />
              <span>Lập kèm hóa đơn</span>
            </label>
            <label class="bh-check">
              <AppCheckbox v-model="form.laHoaDonMTT" :disabled="readonly" />
              <span>Là hóa đơn từ máy tính tiền</span>
            </label>
          </div>
        </div>

        <!-- ── Sub-nav tabs ── -->
        <div class="bh-subnav">
          <button class="bh-snav-tab" :class="{ active: activeSubTab === 'ghino' }" @click="activeSubTab = 'ghino'">Chứng từ ghi nợ</button>
          <button class="bh-snav-tab" :class="{ active: activeSubTab === 'xuathang' }" @click="activeSubTab = 'xuathang'">Phiếu xuất</button>
          <button class="bh-snav-tab" :class="{ active: activeSubTab === 'hoadon' }" @click="activeSubTab = 'hoadon'">Hóa đơn</button>
        </div>

        <div class="bh-fields-row">
        <!-- Form fields -->
        <div class="bh-fields">

          <!-- Row 1 -->
          <div class="bh-row">
            <div class="field bh-col--200">
              <label class="field__label">Mã khách hàng</label>
              <AppTextbox v-model="form.maKH" icon-right="plus" :state="fieldState" />
            </div>
            <div class="field bh-col--flex">
              <label class="field__label">Tên khách hàng</label>
              <AppTextbox v-model="form.tenKH" :state="fieldState" />
            </div>
            <div class="field bh-col--180">
              <label class="field__label">Mã số thuế / CCCD chủ hộ</label>
              <AppTextbox v-model="form.masoThue" :state="fieldState" />
            </div>
            <div class="field bh-col--220">
              <label class="field__label">Ngày hạch toán</label>
              <AppDatebox v-model="form.ngayHachToan" type="datetime-local" :state="fieldState" />
            </div>
          </div>

          <!-- Row 2 -->
          <div class="bh-row">
            <div class="field bh-col--200">
              <label class="field__label">Người liên hệ</label>
              <AppTextbox v-model="form.nguoiLienHe" :state="fieldState" />
            </div>
            <div class="field bh-col--flex">
              <label class="field__label">Địa chỉ</label>
              <AppTextbox v-model="form.diaChi" :state="fieldState" />
            </div>
            <div class="field bh-col--220">
              <label class="field__label">Ngày chứng từ</label>
              <AppDatebox v-model="form.ngayChungTu" :state="fieldState" />
            </div>
          </div>

          <!-- Row 3 -->
          <div class="bh-row">
            <div class="field bh-col--200">
              <label class="field__label">Nhân viên bán hàng</label>
              <AppCombobox v-model="form.nhanVien" :options="[]" icon-right="plus" :state="fieldState" />
            </div>
            <div class="field bh-col--flex">
              <label class="field__label">Diễn giải</label>
              <AppTextbox v-model="form.dienGiai" :state="fieldState" />
            </div>
            <div class="field bh-col--220">
              <label class="field__label">Số chứng từ</label>
              <AppTextbox v-model="form.soChungTu" :state="fieldState" />
            </div>
          </div>

          <!-- Row 4: Tham chiếu -->
          <div class="bh-row">
            <div class="field" style="display:flex;align-items:center;gap:8px">
              <label class="field__label" style="margin-bottom:0;white-space:nowrap">Tham chiếu</label>
              <button class="btn-icon btn-icon--ghost" type="button" :disabled="readonly"><TIcon name="dots" /></button>
            </div>
          </div>

        </div><!-- /bh-fields -->

        <div class="bh-total-box">
          <button class="btn btn--outline-success bh-stamp" type="button" style="font-size: 13px; font-weight: var(--fw-bold); text-transform: uppercase;">Đã lập hóa đơn</button>
          <span class="bh-total-box__label">Tổng tiền thanh toán</span>
          <span class="bh-total-box__value">{{ tongTienDisplay }}</span>
        </div>
        </div><!-- /bh-fields-row -->

        <!-- Điều khoản thanh toán -->
        <div class="bh-dieu-khoan">
          <div class="bh-row" style="align-items:flex-end;gap:12px">
            <div class="field" style="width:180px;flex-shrink:0">
              <button class="field__label bh-dk-toggle" type="button" @click="dieuKhoanOpen = !dieuKhoanOpen">
                <TIcon :name="dieuKhoanOpen ? 'chevron-down' : 'chevron-right'" style="font-size:14px" />
                Điều khoản thanh toán
              </button>
              <AppCombobox v-show="dieuKhoanOpen" v-model="form.dieuKhoan" :options="[]" placeholder="Chọn..." icon-right="plus" :state="fieldState" />
            </div>
            <template v-if="dieuKhoanOpen">
              <div class="field" style="width:120px;flex-shrink:0">
                <label class="field__label">Số ngày được nợ</label>
                <AppTextbox v-model="form.soNgayNo" type="number" :state="fieldState" />
              </div>
              <div class="field" style="width:180px;flex-shrink:0">
                <label class="field__label">Hạn thanh toán</label>
                <AppDatebox v-model="form.hanThanhToan" :state="fieldState" />
              </div>
            </template>
          </div>
        </div>

        <!-- Hàng tiền + Extra info — nền trắng chung, phân cấp với các field phía trên -->
        <div class="bh-lower-section">

        <!-- Hang bar: tabs + toolbar — dính lề trái/phải/trên, không padding -->
        <div class="bh-hang-bar">
            <div class="bh-hang-tabs">
              <button class="bh-hang-tab" :class="{ active: activeHangTab === 'hangtien' }" @click="activeHangTab = 'hangtien'">Hàng tiền</button>
              <button class="bh-hang-tab" :class="{ active: activeHangTab === 'giavon' }" @click="activeHangTab = 'giavon'">Giá vốn</button>
              <button class="bh-hang-tab" :class="{ active: activeHangTab === 'phanbo' }" @click="activeHangTab = 'phanbo'">Thiết lập phân bổ doanh thu</button>
            </div>
            <div class="bh-hang-toolbar">
              <button class="btn btn--ai" type="button" style="gap:6px;font-size: 13px" :disabled="readonly">
                <IconMisaAI style="width:16px;height:16px" />
                Gợi ý hồ sơ
              </button>
              <div style="display:flex;align-items:center;gap:6px">
                <span style="font-size:13px;color:var(--text-primary);white-space:nowrap">Loại tiền</span>
                <div class="ibox" :class="{ 'ibox--readonly': readonly }" style="width:90px">
                  <select class="ibox__native ibox__native--select" v-model="form.loaiTien" :disabled="readonly">
                    <option>VND</option><option>USD</option><option>EUR</option>
                  </select>
                  <TIcon name="chevron-down" class="ibox__icon" style="font-size:12px;pointer-events:none;flex-shrink:0" />
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:6px">
                <span style="font-size:13px;color:var(--text-primary);white-space:nowrap">Chiết khấu</span>
                <div class="ibox" :class="{ 'ibox--readonly': readonly }" style="width:190px">
                  <select class="ibox__native ibox__native--select" v-model="form.chietKhau" :disabled="readonly">
                    <option>Không chiết khấu</option><option>Chiết khấu theo dòng</option><option>Chiết khấu tổng</option>
                  </select>
                  <TIcon name="chevron-down" class="ibox__icon" style="font-size:12px;pointer-events:none;flex-shrink:0" />
                </div>
              </div>
            </div>
          </div>

        <!-- Từ bảng trở xuống — có padding trái/phải/trên/dưới -->
        <div class="bh-lower-content">

          <!-- Inline table — dùng đúng control DataTable của mds-ui, chế độ editable để nhét input vào từng dòng.
               Paging dùng luôn built-in của DataTable (nằm trong .datatable, dính liền + full-width theo đúng bảng). -->
          <DataTable
            :columns="htDtCols"
            :rows="rows"
            :editable="!readonly"
            :hide-blank-rows="false"
            show-footer
            :selected="selectedHtRows"
            @update:selected="selectedHtRows = $event"
            :row-actions="readonly ? [] : [{ icon: 'trash', title: 'Xóa dòng', emit: 'delete-row' }]"
            @delete-row="onHtDeleteRow"
            @cell-update="onHtCellUpdate"
            pagination
            :total="rows.length"
            :page-size="pageSize"
            :current-page="page"
            @update:current-page="page = $event"
            @update:page-size="pageSize = $event"
          />

          <!-- Table controls -->
          <div class="ht-controls">
            <div class="ht-controls__left-col">
              <div v-if="!readonly" class="ht-controls__right">
                <button class="btn btn--outline btn--neutral" type="button"
                  @click="rows.push({ maHang:'', tenHang:'', kho:'', dvt:'', soLuong:1, donGiaVon:0, tienVon:0, soLo:'', hanSuDung:'', hangKhuyenMai:false })">
                  <TIcon name="plus" />Thêm dòng
                </button>
                <button class="btn btn--outline btn--neutral" type="button" style="color:var(--text-danger)" @click="rows = []">
                  <TIcon name="trash" />Xóa cả dòng
                </button>
                <button class="btn btn--outline btn--neutral" type="button"><TIcon name="clipboard-list" />Thêm ghi chú</button>
              </div>

              <!-- Extra info -->
              <div class="bh-extra">

              <div class="bh-row">
                <div class="field bh-col--flex">
                  <label class="field__label">Số đơn hàng từ hệ thống khác</label>
                  <AppTextbox v-model="form.soDonHang" :state="fieldState" />
                </div>
                <div class="field bh-col--180">
                  <label class="field__label">Sàn thương mại điện tử</label>
                  <AppCombobox v-model="form.sanTMDT" :options="['Shopee','Lazada','Tiki','TikTok Shop']" :state="fieldState" />
                </div>
                <div class="field" style="width:150px;flex-shrink:0">
                  <label class="field__label">Tên shop</label>
                  <AppTextbox v-model="form.tenShop" :state="fieldState" />
                </div>
              </div>

              <div class="bh-row">
                <div class="field" style="width:220px;flex-shrink:0">
                  <label class="field__label">Ngày giao hàng thành công</label>
                  <AppDatebox v-model="form.ngayGiaoHang" :state="fieldState" />
                </div>
              </div>

              <div class="bh-row">
                <div class="field" style="width:160px;flex-shrink:0">
                  <label class="field__label">Mã cửa hàng</label>
                  <AppTextbox v-model="form.maCuaHang" :state="fieldState" />
                </div>
                <div class="field bh-col--flex">
                  <label class="field__label">Tên cửa hàng</label>
                  <AppTextbox v-model="form.tenCuaHang" :state="fieldState" />
                </div>
              </div>

              <div class="bh-row">
                <div class="field bh-col--flex">
                  <label class="field__label">Địa điểm giao hàng</label>
                  <AppCombobox v-model="form.diaDiemGiao" :options="[]" :state="fieldState" />
                </div>
              </div>

              <div class="bh-row">
                <div class="field bh-col--flex">
                  <label class="field__label">Điều khoản khác</label>
                  <AppTextarea v-model="form.dieuKhoanKhac" :rows="3" :state="fieldState" />
                </div>
              </div>

              <div class="bh-row">
                <div class="field bh-col--flex">
                  <label class="field__label">Mã tra cứu HĐDT</label>
                  <AppTextbox v-model="form.maTraCuu" :state="fieldState" />
                </div>
                <div class="field bh-col--flex">
                  <label class="field__label">Đường dẫn tra cứu HĐDT</label>
                  <AppTextbox v-model="form.duongDanTraCuu" :state="fieldState" />
                </div>
              </div>

              <!-- Đính kèm -->
              <div v-if="!readonly" class="dinh-kem">
                <div class="dinh-kem__header">
                  <TIcon name="paperclip" style="font-size:15px;color:var(--text-secondary)" />
                  <span class="dinh-kem__title">Đính kèm</span>
                  <span class="dinh-kem__hint">Dung lượng tối đa 5MB</span>
                </div>
                <div class="dinh-kem__drop">
                  <TIcon name="upload" style="font-size:24px;color:var(--text-hint)" />
                  <div class="dinh-kem__drop-text">
                    <span class="dinh-kem__link">Chọn tệp</span> hoặc kéo thả tệp vào đây
                  </div>
                </div>
              </div>

              </div><!-- /bh-extra -->
            </div><!-- /ht-controls__left-col -->
            <div class="bh-summary">
              <span class="bh-summary__item">Tổng tiền hàng: <strong>0</strong></span>
              <span class="bh-summary__item">Thuế GTGT: <strong>0</strong></span>
              <span class="bh-summary__item bh-summary__item--total">Tổng tiền thanh toán: <strong>{{ tongTienDisplay }}</strong></span>
            </div>
          </div>


        </div><!-- /bh-lower-content -->

        </div><!-- /bh-lower-section -->

      </div><!-- /bh-body -->

      <!-- ── Footer (dark) ── -->
      <div class="bh-footer">
        <div class="bh-footer__left">
          <label class="bh-ft-toggle" @click="showTK = !showTK">
            <div class="toggle-sw" :class="{ 'toggle-sw--on': showTK }"></div>
            <span>Hiển thị tài khoản</span>
          </label>
        </div>
        <div class="bh-footer__center">
          <button class="btn bh-ft-ghost" type="button" @click="$emit('close')">Hủy</button>
        </div>
        <div v-if="!readonly" class="bh-footer__right">
          <button class="btn bh-ft-ghost" type="button">Cất</button>
          <div class="btn-split">
            <button class="btn btn--primary" type="button">Cất và In</button>
            <button class="btn btn--primary btn-split__arrow" type="button">
              <TIcon name="chevron-down" />
            </button>
          </div>
        </div>
      </div>

    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import TIcon        from '@mds/components/TIcon.vue'
import AppTextbox   from '@mds/components/AppTextbox.vue'
import AppCombobox  from '@mds/components/AppCombobox.vue'
import AppDatebox   from '@mds/components/AppDatebox.vue'
import AppTextarea  from '@mds/components/AppTextarea.vue'
import AppCheckbox  from '@mds/components/AppCheckbox.vue'
import DataTable    from '@mds/components/DataTable.vue'
import IconMisaAI   from '@mds/components/IconMisaAI.vue'

const props = defineProps({
  // Dữ liệu chứng từ có sẵn để xem lại (mở từ danh sách) — không truyền = form thêm mới trống
  initialData: { type: Object, default: null },
  // Chỉ xem, khoá toàn bộ control không cho nhập liệu
  readonly:    { type: Boolean, default: false },
})
defineEmits(['close'])

const loaiPhieuOptions = ['Bán hàng', 'Bán hàng dịch vụ', 'Bán lẻ']

// state cho các control có prop `state` (AppTextbox/AppCombobox/AppDatebox/AppTextarea) — readonly thay vì disabled để vẫn đọc/copy được giá trị
const fieldState = computed(() => props.readonly ? 'readonly' : 'default')

const form = ref({
  maKH: '', tenKH: '', masoThue: '',
  ngayHachToan: '', nguoiLienHe: '', diaChi: '', ngayChungTu: '',
  nhanVien: '', dienGiai: '', soChungTu: '', thamChieu: '',
  loaiTien: 'VND', chietKhau: 'Không chiết khấu',
  thuTienNgay: false, phuongThucThu: 'Tiền mặt',
  kiemPhieuXuat: false, lapKemHoaDon: false, laHoaDonMTT: false,
  loaiPhieu: 'Bán hàng',
  dieuKhoan: '', soNgayNo: '', hanThanhToan: '',
  soDonHang: '', sanTMDT: '', tenShop: '',
  ngayGiaoHang: '', maCuaHang: '', tenCuaHang: '',
  diaDiemGiao: '', dieuKhoanKhac: '',
  maTraCuu: '', duongDanTraCuu: '',
  ...(props.initialData?.form ?? {}),
})

const activeSubTab  = ref('ghino')
const activeHangTab = ref('hangtien')
const dieuKhoanOpen = ref(true)
const showTK        = ref(true)
const page          = ref(1)
const pageSize      = ref(20)

const rows = ref(props.initialData?.rows ?? [
  { maHang: '1049-Jean-39', tenHang: 'Quần Jean nam size 39', kho: 'Kho Hà Nội', dvt: 'Cái', soLuong: 20, donGiaVon: 185000, tienVon: 3700000, soLo: 'LO0324', hanSuDung: '', hangKhuyenMai: false },
  { maHang: 'AT-Trang-M', tenHang: 'Áo thun trắng size M', kho: 'Kho Hà Nội', dvt: 'Cái', soLuong: 15, donGiaVon: 95000, tienVon: 1425000, soLo: 'LO0198', hanSuDung: '', hangKhuyenMai: true },
  { maHang: 'GD-Da-42', tenHang: 'Giày da nam size 42', kho: 'Kho HCM', dvt: 'Đôi', soLuong: 5, donGiaVon: 650000, tienVon: 3250000, soLo: 'LO0087', hanSuDung: '', hangKhuyenMai: false },
])

const selectedHtRows = ref([])

const tongSoLuong = computed(() =>
  rows.value.reduce((s, r) => s + (Number(r.soLuong) || 0), 0).toLocaleString('vi-VN')
)

const tongTienVon = computed(() =>
  rows.value.reduce((s, r) => s + (Number(r.tienVon) || 0), 0).toLocaleString('vi-VN')
)

/* ── Cấu hình cột cho DataTable (mds-ui) — editable, footerText tính lại theo rows nên để dạng computed ── */
const htDtCols = computed(() => [
  { key: 'maHang',       label: 'Mã hàng',       type: 'textbox',   width: 120, noFilter: true },
  { key: 'tenHang',      label: 'Tên hàng',      type: 'textbox',   noFilter: true },
  { key: 'kho',          label: 'Kho',           type: 'textbox',   width: 100, noFilter: true },
  { key: 'dvt',          label: 'ĐVT',           type: 'textbox',   width: 70,  noFilter: true },
  { key: 'soLuong',      label: 'Số lượng',      type: 'numberbox', width: 100, align: 'right', noFilter: true, footerText: tongSoLuong.value },
  { key: 'donGiaVon',    label: 'Đơn giá vốn',   type: 'numberbox', width: 130, align: 'right', noFilter: true },
  { key: 'tienVon',      label: 'Tiền vốn',      type: 'text',      width: 120, align: 'right', noFilter: true, footerText: tongTienVon.value },
  { key: 'soLo',         label: 'Số lô',         type: 'textbox',   width: 90,  noFilter: true },
  { key: 'hanSuDung',    label: 'Hạn sử dụng',   type: 'textbox',   width: 130, noFilter: true },
  { key: 'hangKhuyenMai',label: 'Hàng khuyến mại', type: 'toggle',  width: 120, noFilter: true },
])

function onHtCellUpdate({ row, col, value }) {
  row[col.key] = value
  if (col.key === 'soLuong' || col.key === 'donGiaVon') {
    row.tienVon = (Number(row.soLuong) || 0) * (Number(row.donGiaVon) || 0)
  }
}

function onHtDeleteRow(row) {
  const idx = rows.value.indexOf(row)
  if (idx > -1) rows.value.splice(idx, 1)
}

const tongTienDisplay = computed(() => '0')
</script>

<style scoped>
/* Bo 4 góc + viền bảng hàng tiền, kéo xuống tận pagination-bar (AppPagination nằm trong cùng .datatable) — riêng app Kế toán */
:deep(.datatable) {
  border: 1px solid var(--stroke-neutral);
  border-radius: var(--radius-default);
}
/* Header row tự có border-top riêng — bỏ đi để không bị double border với viền ngoài của .datatable */
:deep(.dt-row--header) { border-top: none; }
/* Footer row tự có border-top riêng — trùng với border-bottom của dòng body cuối, gây double border */
:deep(.dt-row--footer) { border-top: none; }
/* Cột cuối cùng trước cột actions-ph (width 0) vẫn tính border-right riêng — trùng với viền phải ngoài của .datatable */
:deep(.dt-cell:has(+ .dt-cell--actions-ph)),
:deep(.dt-cell:has(+ .dt-cell--actions)) { border-right: none !important; }

/* ── Overlay (full-screen) ── */
.bh-overlay {
  position: fixed;
  inset: 0;
  z-index: 1300;
  display: flex;
  flex-direction: column;
  background: var(--bg-page);
  font-family: var(--font-family);
  overflow: hidden;
}

/* ── Bar (header 48px) ── */
.bh-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 12px 0 8px;
  background: var(--bg-white);
  border-bottom: 1px solid var(--stroke-neutral-light);
  flex-shrink: 0;
  gap: 8px;
}
.bh-bar__left  { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; }
.bh-bar__right { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }

.bh-bar__title {
  font-size: 15px; font-weight: var(--fw-semibold);
  color: var(--text-primary); white-space: nowrap; flex-shrink: 0;
}
.bh-bar__sep {
  width: 1px; height: 20px; background: var(--stroke-neutral-light); flex-shrink: 0;
}
.bh-bar__search {
  display: flex; align-items: center; gap: 6px;
  border: 1px solid var(--stroke-neutral);
  border-radius: var(--radius-default);
  padding: 0 4px 0 8px; height: var(--input-height); min-width: 220px;
  background: var(--bg-white);
}
.bh-bar__search-cfg {
  display: flex; align-items: center; justify-content: center;
  width: 20px; height: 20px; flex-shrink: 0;
  border: none; background: transparent; padding: 0; cursor: pointer;
  color: var(--icon-neutral); font-size: 15px;
}
.bh-bar__search-icon { font-size: 15px; color: var(--text-hint); flex-shrink: 0; }
.bh-bar__search-input {
  border: none; outline: none; background: transparent;
  font-family: var(--font-family); font-size: 13px;
  color: var(--text-primary); width: 100%;
}
.bh-bar__search-input::placeholder { color: var(--text-hint); }
.bh-bar__search-arrow {
  display: flex; align-items: center; justify-content: center;
  width: 24px; height: 24px; flex-shrink: 0;
  border: none; border-left: 1px solid var(--stroke-neutral-light);
  background: transparent; padding: 0 0 0 4px; cursor: pointer;
  color: var(--icon-neutral); font-size: 13px;
}

/* ── Toolbar (40px) ── */
.bh-toolbar {
  position: relative;
  display: flex; align-items: center;
  height: 36px; padding: 0 16px;
  margin: -16px -16px 0; /* bù padding của .bh-body vì giờ toolbar nằm trong .bh-body để cuộn theo */
  background: var(--bg-page);
  flex-shrink: 0; gap: 12px;
}
.bh-toolbar__left  { display: flex; align-items: center; gap: 10px; min-width: 0; }
.bh-toolbar__right {
  position: absolute; top: 0; bottom: 0; right: 16px;
  display: flex; align-items: center; gap: 10px;
  transform: translateY(4px);
}

.bh-radio {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; color: var(--text-primary);
  cursor: pointer; white-space: nowrap;
}
.bh-radio input[type="radio"] { accent-color: var(--bg-brand); }

.bh-check {
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; color: var(--text-primary);
  cursor: pointer; white-space: nowrap;
}

.bh-sep {
  width: 1px; height: 20px; background: var(--stroke-neutral-light); flex-shrink: 0;
}

/* ── Sub-nav (40px) ── */
.bh-subnav {
  display: flex; align-items: flex-end;
  height: 36px; padding: 0 16px;
  margin: 0 -16px; /* bù padding của .bh-body vì giờ subnav nằm trong .bh-body để cuộn theo */
  border-bottom: 1px solid var(--stroke-neutral);
  background: var(--bg-page);
  flex-shrink: 0;
}
.bh-snav-tab {
  height: 32px; padding: 0 16px;
  font-size: 13px; font-weight: var(--fw-regular);
  font-family: var(--font-family);
  color: var(--text-primary);
  background: transparent; border: none; outline: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  white-space: nowrap;
}
.bh-snav-tab:hover  { color: var(--text-primary); }
.bh-snav-tab.active { color: var(--text-brand); border-bottom-color: var(--stroke-brand); font-weight: var(--fw-semibold); background: var(--bg-white); border-radius: 6px 6px 0 0; }

/* ── Body ── */
.bh-body {
  flex: 1; overflow-y: auto; overflow-x: auto;
  padding: 16px 16px;
  display: flex; flex-direction: column; gap: 0;
}

/* ── Field label ── */
.field__label {
  display: block;
  font-size: 13px;
  font-weight: var(--fw-semibold);
  color: var(--text-primary);
  margin-bottom: 4px;
  white-space: nowrap;
}

/* ── Layout helpers ── */
.bh-fields-row { display: flex; gap: 8px; align-items: flex-start; padding-top: 12px; }
.bh-fields { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8px; }
.bh-total-box { flex-shrink: 0; width: 280px; text-align: right; padding-top: 4px; }
.bh-total-box .btn { margin-bottom: 8px; }
/* Hiệu ứng con dấu "đã hoàn tất" — viền đôi, không xoay */
.bh-stamp { background: transparent; outline: 1.5px solid var(--stroke-success); outline-offset: 2px; height: 24px; padding: 0 6px; min-width: 0; }
.bh-total-box__label { display: block; font-size: 13px; color: var(--text-primary); margin-bottom: 4px; }
.bh-total-box__value { display: block; font-size: 24px; font-weight: var(--fw-bold); color: var(--text-primary); font-feature-settings: 'lnum' 1, 'tnum' 1; }

.bh-row {
  display: flex; align-items: flex-start; gap: 12px;
  min-width: 0;
}

.bh-col--200  { width: 200px; flex-shrink: 0; }
.bh-col--180  { width: 180px; flex-shrink: 0; }
.bh-col--220  { width: 220px; flex-shrink: 0; }
.bh-col--flex { flex: 1; min-width: 100px; }

/* ── Điều khoản ── */
.bh-dieu-khoan { margin: 0 0 8px; }
.bh-dk-toggle {
  display: flex; align-items: center; gap: 6px;
  background: transparent; border: none;
  cursor: pointer; padding: 0;
  font-family: var(--font-family);
  color: #245fdf;
}

/* ── Divider ── */
.bh-divider {
  height: 1px;
  background: var(--stroke-divider);
  margin: 12px -16px;
  flex-shrink: 0;
}

/* ── Hàng tiền + Extra info — nền trắng chung ── */
.bh-lower-section {
  background: var(--bg-white);
  border-radius: var(--radius-default);
}

/* Từ bảng trở xuống (table, controls, divider, extra info) — có padding, bh-hang-bar phía trên không có */
.bh-lower-content {
  display: flex; flex-direction: column;
  padding: 12px 16px;
}

.bh-hang-bar {
  height: 44px;
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 1px solid var(--stroke-neutral-light);
  padding-right: 12px;
  gap: 12px;
}
.bh-hang-tabs { display: flex; align-items: center; height: 100%; }
.bh-hang-tab {
  height: 40px; padding: 0 16px;
  font-size: 13px; font-weight: var(--fw-regular);
  font-family: var(--font-family);
  color: var(--text-primary);
  background: transparent; border: none; outline: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -4px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  white-space: nowrap;
}
.bh-hang-tab:hover  { color: var(--text-primary); }
.bh-hang-tab.active { color: var(--text-brand); border-bottom-color: var(--stroke-brand); font-weight: var(--fw-semibold); background: var(--bg-white); }

.bh-hang-toolbar {
  display: flex; align-items: center; gap: 8px;
}

/* ── Inline table ── giờ dùng thẳng component <DataTable> của mds-ui (xem htDtCols trong script),
   không còn CSS riêng nào cần thiết ở đây nữa. */

/* ── Table controls ── */
.ht-controls {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: 12px 0 0; gap: 12px;
}
.ht-controls__left-col { display: flex; flex-direction: column; gap: 12px; flex: 1; min-width: 0; }
.ht-controls__right { display: flex; align-items: center; gap: 8px; }
.ht-count { font-size: 12px; color: var(--text-secondary); white-space: nowrap; }

/* ── Summary ── */
.bh-summary {
  display: flex; flex-direction: column; align-items: flex-end; gap: 4px;
  flex-shrink: 0;
}
.bh-summary__item {
  font-size: 13px; color: var(--text-primary);
}
.bh-summary__item strong { color: var(--text-primary); font-feature-settings: 'lnum' 1, 'tnum' 1; }
.bh-summary__item--total {
  font-size: 14px; font-weight: var(--fw-semibold); color: var(--text-primary);
}
.bh-summary__item--total strong { font-size: 15px; }

/* ── Extra section ── */
.bh-extra { display: flex; flex-direction: column; gap: 12px; width: 50%; }

/* ── Đính kèm ── */
.dinh-kem { display: flex; flex-direction: column; gap: 8px; }
.dinh-kem__header {
  display: flex; align-items: center; gap: 6px;
}
.dinh-kem__title { font-size: 13px; font-weight: var(--fw-medium); color: var(--text-primary); }
.dinh-kem__hint  { font-size: 12px; color: var(--text-hint); }

.dinh-kem__drop {
  width: 280px;
  border: 1.5px dashed var(--stroke-neutral);
  border-radius: var(--radius-default);
  padding: 20px 16px;
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.dinh-kem__drop:hover { border-color: var(--stroke-brand); background: var(--bg-brand-light); }
.dinh-kem__drop-text { font-size: 13px; color: var(--text-secondary); text-align: center; }
.dinh-kem__link { color: var(--text-brand); cursor: pointer; }
.dinh-kem__link:hover { text-decoration: underline; }

/* ── Footer (dark) ── */
.bh-footer {
  display: flex; align-items: center;
  height: 52px; padding: 0 16px; flex-shrink: 0;
  background: var(--neutral-100);
  border-top: 1px solid var(--stroke-neutral-light);
  gap: 8px;
}
.bh-footer__left   { flex: 1; display: flex; align-items: center; }
.bh-footer__center { flex-shrink: 0; display: flex; align-items: center; }
.bh-footer__right  { flex-shrink: 0; display: flex; align-items: center; gap: 8px; }

/* Ghost button */
.bh-ft-ghost {
  height: var(--btn-height); min-width: 72px; padding: 0 12px;
  border: 1px solid var(--stroke-neutral);
  background: var(--bg-white); color: var(--text-primary);
  border-radius: var(--radius-default);
  font-family: var(--font-family); font-size: 13px; font-weight: var(--fw-medium);
  cursor: pointer; transition: background 0.15s;
  white-space: nowrap;
}
.bh-ft-ghost:hover { background: var(--bg-neutral-hover); }

/* Toggle switch */
.bh-ft-toggle {
  display: flex; align-items: center; gap: 8px;
  cursor: pointer; user-select: none;
  color: var(--text-primary); font-size: 13px;
  font-family: var(--font-family);
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
  background: #fff;
  transition: left 0.2s;
}
.toggle-sw--on { background: var(--bg-success); }
.toggle-sw--on::after { left: 18px; }

/* ── Animation ── */
.bh-overlay { animation: bh-in 0.2s ease; }
@keyframes bh-in { from { opacity: 0 } to { opacity: 1 } }
</style>
