<template>
  <Teleport to="body">
    <div class="bh-overlay">

      <!-- ── Bar (header) ── -->
      <div class="bh-bar">
        <div class="bh-bar__left">
          <button class="btn-icon btn-icon--ghost" type="button" title="Quay lại" @click="$emit('close')">
            <TIcon name="arrow-left" />
          </button>
          <button class="btn-icon btn-icon--ghost bh-bar__icon" type="button" title="Lịch sử chỉnh sửa">
            <TIcon name="history" />
          </button>
          <span class="bh-bar__title">Chứng từ bán hàng</span>
          <span class="bh-bar__no">CT00001</span>
          <span class="bh-bar__sep"></span>
          <AppCombobox v-model="form.loaiPhieu" :options="loaiPhieuOptions" style="width:180px" />
          <div class="bh-bar__search">
            <TIcon name="search" class="bh-bar__search-icon" />
            <input class="bh-bar__search-input" type="text" placeholder="Tìm kiếm..." />
          </div>
        </div>
        <div class="bh-bar__right">
          <button class="btn btn--ghost" type="button" style="gap:6px;font-size: 13px">
            <TIcon name="help-circle" style="color:var(--text-success)" />
            Hướng dẫn sử dụng
          </button>
          <button class="btn-icon btn-icon--ghost" type="button" title="Cài đặt">
            <TIcon name="settings" />
          </button>
          <button class="btn-icon btn-icon--ghost" type="button" title="Đóng" @click="$emit('close')">
            <TIcon name="x" />
          </button>
        </div>
      </div>

      <!-- ── Toolbar ── -->
      <div class="bh-toolbar">
        <div class="bh-toolbar__left">
          <label class="bh-radio">
            <input type="radio" v-model="form.thuTienNgay" :value="false" />
            <span>Chưa thu tiền</span>
          </label>
          <label class="bh-radio">
            <input type="radio" v-model="form.thuTienNgay" :value="true" />
            <span>Thu tiền ngay</span>
          </label>
          <span class="bh-sep"></span>
          <AppCombobox v-if="form.thuTienNgay" v-model="form.phuongThucThu" :options="['Tiền mặt','Tiền gửi ngân hàng']" style="width:160px" />
          <span v-if="form.thuTienNgay" class="bh-sep"></span>
          <label class="bh-check">
            <AppCheckbox v-model="form.kiemPhieuXuat" />
            <span>Kiểm phiếu xuất</span>
          </label>
          <label class="bh-check">
            <AppCheckbox v-model="form.lapKemHoaDon" />
            <span>Lập kèm hóa đơn</span>
          </label>
          <label class="bh-check">
            <AppCheckbox v-model="form.laHoaDonMTT" />
            <span>Là hóa đơn từ máy tính tiền</span>
          </label>
        </div>
        <div class="bh-toolbar__right">
          <button class="btn btn--outline btn--neutral" type="button" style="font-size: 13px">Đã lập hóa đơn</button>
          <span class="bh-sep"></span>
          <span class="bh-toolbar__total-label">Tổng tiền thanh toán:</span>
          <span class="bh-toolbar__total-value">{{ tongTienDisplay }}</span>
        </div>
      </div>

      <!-- ── Sub-nav tabs ── -->
      <div class="bh-subnav">
        <button class="bh-snav-tab" :class="{ active: activeSubTab === 'ghino' }" @click="activeSubTab = 'ghino'">Chứng từ ghi nợ</button>
        <button class="bh-snav-tab" :class="{ active: activeSubTab === 'xuathang' }" @click="activeSubTab = 'xuathang'">Phiếu xuất</button>
        <button class="bh-snav-tab" :class="{ active: activeSubTab === 'hoadon' }" @click="activeSubTab = 'hoadon'">Hóa đơn</button>
      </div>

      <!-- ── Body ── -->
      <div class="bh-body">

        <!-- Form fields -->
        <div class="bh-fields">

          <!-- Row 1 -->
          <div class="bh-row">
            <div class="field bh-col--200">
              <label class="field__label">Mã khách hàng</label>
              <div class="compound">
                <AppTextbox v-model="form.maKH" style="flex:1;min-width:0" />
                <button class="btn-icon btn-icon--outline" type="button"><TIcon name="plus" /></button>
                <button class="btn-icon btn-icon--outline" type="button"><TIcon name="chevron-down" /></button>
              </div>
            </div>
            <div class="field bh-col--flex">
              <label class="field__label">Tên khách hàng</label>
              <AppTextbox v-model="form.tenKH" />
            </div>
            <div class="field bh-col--180">
              <label class="field__label">Mã số thuế / CCCD chủ hộ</label>
              <AppTextbox v-model="form.masoThue" icon-right="world" />
            </div>
            <div class="field bh-col--220">
              <label class="field__label">Ngày hạch toán</label>
              <AppDatebox v-model="form.ngayHachToan" type="datetime-local" />
            </div>
          </div>

          <!-- Row 2 -->
          <div class="bh-row">
            <div class="field bh-col--200">
              <label class="field__label">Người liên hệ</label>
              <AppTextbox v-model="form.nguoiLienHe" />
            </div>
            <div class="field bh-col--flex">
              <label class="field__label">Địa chỉ</label>
              <AppTextbox v-model="form.diaChi" />
            </div>
            <div class="bh-col--180" style="flex-shrink:0"></div>
            <div class="field bh-col--220">
              <label class="field__label">Ngày chứng từ</label>
              <AppDatebox v-model="form.ngayChungTu" />
            </div>
          </div>

          <!-- Row 3 -->
          <div class="bh-row">
            <div class="field bh-col--200">
              <label class="field__label">Nhân viên bán hàng</label>
              <div class="compound">
                <AppCombobox v-model="form.nhanVien" :options="[]" style="flex:1;min-width:0" />
                <button class="btn-icon btn-icon--outline" type="button"><TIcon name="plus" /></button>
              </div>
            </div>
            <div class="field bh-col--flex">
              <label class="field__label">Diễn giải</label>
              <AppTextbox v-model="form.dienGiai" icon-right="clipboard-list" />
            </div>
            <div class="bh-col--180" style="flex-shrink:0"></div>
            <div class="field bh-col--220">
              <label class="field__label">Số chứng từ</label>
              <AppTextbox v-model="form.soChungTu" />
            </div>
          </div>

          <!-- Row 4: Tham chiếu -->
          <div class="bh-row">
            <div class="field" style="display:flex;align-items:center;gap:8px">
              <label class="field__label" style="margin-bottom:0;white-space:nowrap">Tham chiếu</label>
              <button class="btn btn--ghost btn--sm" type="button">...</button>
            </div>
          </div>

        </div><!-- /bh-fields -->

        <!-- Điều khoản thanh toán -->
        <div class="bh-dieu-khoan">
          <button class="bh-dk-toggle" type="button" @click="dieuKhoanOpen = !dieuKhoanOpen">
            <TIcon :name="dieuKhoanOpen ? 'chevron-down' : 'chevron-right'" style="font-size:14px" />
            <span>Điều khoản thanh toán</span>
          </button>
          <div v-show="dieuKhoanOpen" class="bh-dk-content">
            <div class="bh-row" style="align-items:flex-end;gap:12px">
              <div class="ibox" style="width:60px">
                <button class="btn-icon" type="button"><TIcon name="plus" /></button>
                <AppCombobox v-model="form.dieuKhoan" :options="[]" placeholder="Chọn..." style="flex:1;min-width:0" />
              </div>
              <div class="field" style="width:120px;flex-shrink:0">
                <label class="field__label">Số ngày được nợ</label>
                <AppTextbox v-model="form.soNgayNo" type="number" />
              </div>
              <div class="field" style="width:180px;flex-shrink:0">
                <label class="field__label">Hạn thanh toán</label>
                <AppDatebox v-model="form.hanThanhToan" />
              </div>
            </div>
          </div>
        </div>

        <!-- Section divider -->
        <div class="bh-divider"></div>

        <!-- Hàng tiền section -->
        <div class="bh-hang">

          <!-- Hang bar: tabs + toolbar -->
          <div class="bh-hang-bar">
            <div class="bh-hang-tabs">
              <button class="bh-hang-tab" :class="{ active: activeHangTab === 'hangtien' }" @click="activeHangTab = 'hangtien'">Hàng tiền</button>
              <button class="bh-hang-tab" :class="{ active: activeHangTab === 'giavon' }" @click="activeHangTab = 'giavon'">Giá vốn</button>
            </div>
            <div class="bh-hang-toolbar">
              <button class="btn btn--ai" type="button" style="gap:6px;font-size: 13px">
                <IconMisaAI style="width:16px;height:16px" />
                Gợi ý hồ sơ
              </button>
              <div class="ibox" style="width:130px">
                <span class="ibox-label" style="padding-left:6px;flex-shrink:0;font-size: 13px">Loại tiền</span>
                <select class="ibox__native ibox__native--select" v-model="form.loaiTien">
                  <option>VND</option><option>USD</option><option>EUR</option>
                </select>
                <TIcon name="chevron-down" class="ibox__icon" style="font-size:12px;pointer-events:none;flex-shrink:0" />
              </div>
              <div class="ibox" style="width:200px">
                <span class="ibox-label" style="padding-left:6px;flex-shrink:0;font-size: 13px">Chiết khấu</span>
                <select class="ibox__native ibox__native--select" v-model="form.chietKhau">
                  <option>Không chiết khấu</option><option>Chiết khấu theo dòng</option><option>Chiết khấu tổng</option>
                </select>
                <TIcon name="chevron-down" class="ibox__icon" style="font-size:12px;pointer-events:none;flex-shrink:0" />
              </div>
            </div>
          </div>

          <!-- Inline table -->
          <div class="ht-table" style="margin-top:8px">
            <!-- Header row -->
            <div class="ht-row ht-row--header">
              <div class="ht-cell" style="width:40px;justify-content:center;flex-shrink:0">#</div>
              <div class="ht-cell" style="width:40px;justify-content:center;flex-shrink:0">
                <AppCheckbox v-model="selectAllRows" />
              </div>
              <div class="ht-cell" style="width:120px;flex-shrink:0">Mã hàng</div>
              <div class="ht-cell" style="flex:1;min-width:120px">Tên hàng</div>
              <div class="ht-cell" style="width:60px;flex-shrink:0">ĐVT</div>
              <div class="ht-cell ht-cell--right" style="width:90px;flex-shrink:0">Số lượng</div>
              <div class="ht-cell" style="width:90px;flex-shrink:0">Số lô</div>
              <div class="ht-cell" style="width:110px;flex-shrink:0">Hạn sử dụng</div>
              <div class="ht-cell ht-cell--right" style="width:100px;flex-shrink:0">CK thương mại</div>
              <div class="ht-cell" style="width:90px;flex-shrink:0">TK công nợ</div>
              <div class="ht-cell" style="width:90px;flex-shrink:0">TK doanh thu</div>
              <div class="ht-cell ht-cell--right" style="width:100px;flex-shrink:0">SL đã xuất HĐ</div>
              <div class="ht-cell" style="width:80px;flex-shrink:0">Quy cách</div>
              <div class="ht-cell" style="width:40px;flex-shrink:0"></div>
            </div>
            <!-- Body rows -->
            <div v-for="(row, i) in rows" :key="i" class="ht-row ht-row--body">
              <div class="ht-cell" style="width:40px;justify-content:center;flex-shrink:0;color:var(--text-secondary);font-size:12px">{{ i + 1 }}</div>
              <div class="ht-cell" style="width:40px;justify-content:center;flex-shrink:0">
                <AppCheckbox v-model="row.selected" />
              </div>
              <div class="ht-cell" style="width:120px;flex-shrink:0"><input class="ht-input" type="text" v-model="row.maHang" /></div>
              <div class="ht-cell" style="flex:1;min-width:120px"><input class="ht-input" type="text" v-model="row.tenHang" /></div>
              <div class="ht-cell" style="width:60px;flex-shrink:0"><input class="ht-input" type="text" v-model="row.dvt" /></div>
              <div class="ht-cell" style="width:90px;flex-shrink:0"><input class="ht-input ht-input--right" type="number" v-model="row.soLuong" /></div>
              <div class="ht-cell" style="width:90px;flex-shrink:0"><input class="ht-input" type="text" v-model="row.soLo" /></div>
              <div class="ht-cell" style="width:110px;flex-shrink:0"><input class="ht-input" type="date" v-model="row.hanSuDung" /></div>
              <div class="ht-cell" style="width:100px;flex-shrink:0"><input class="ht-input ht-input--right" type="number" v-model="row.ckThuongMai" /></div>
              <div class="ht-cell" style="width:90px;flex-shrink:0"><input class="ht-input" type="text" v-model="row.tkCongNo" /></div>
              <div class="ht-cell" style="width:90px;flex-shrink:0"><input class="ht-input" type="text" v-model="row.tkDoanhThu" /></div>
              <div class="ht-cell" style="width:100px;flex-shrink:0"><input class="ht-input ht-input--right" type="number" v-model="row.slDaXuatHD" /></div>
              <div class="ht-cell" style="width:80px;flex-shrink:0"><input class="ht-input" type="text" v-model="row.quyCach" /></div>
              <div class="ht-cell" style="width:40px;flex-shrink:0;justify-content:center">
                <button class="btn-icon btn-icon--danger" type="button" @click="rows.splice(i,1)">
                  <TIcon name="trash" />
                </button>
              </div>
            </div>
            <!-- Footer row -->
            <div class="ht-row ht-row--footer">
              <div class="ht-cell" style="width:40px;flex-shrink:0"></div>
              <div class="ht-cell" style="width:40px;flex-shrink:0"></div>
              <div class="ht-cell" style="width:120px;flex-shrink:0"></div>
              <div class="ht-cell" style="flex:1;min-width:120px"></div>
              <div class="ht-cell" style="width:60px;flex-shrink:0"></div>
              <div class="ht-cell ht-cell--total ht-cell--right" style="width:90px;flex-shrink:0">{{ tongSoLuong }}</div>
              <div class="ht-cell" style="width:90px;flex-shrink:0"></div>
              <div class="ht-cell" style="width:110px;flex-shrink:0"></div>
              <div class="ht-cell" style="width:100px;flex-shrink:0"></div>
              <div class="ht-cell" style="width:90px;flex-shrink:0"></div>
              <div class="ht-cell" style="width:90px;flex-shrink:0"></div>
              <div class="ht-cell" style="width:100px;flex-shrink:0"></div>
              <div class="ht-cell" style="width:80px;flex-shrink:0"></div>
              <div class="ht-cell" style="width:40px;flex-shrink:0"></div>
            </div>
          </div><!-- /ht-table -->

          <!-- Table controls -->
          <div class="ht-controls">
            <div class="ht-controls__left">
              <span class="ht-count">Tổng số: {{ rows.length }}</span>
              <TablePaging v-model:page="page" v-model:page-size="pageSize" :total="rows.length" />
            </div>
            <div class="ht-controls__right">
              <button class="btn btn--outline btn--neutral" type="button"
                @click="rows.push({ selected:false, maHang:'', tenHang:'', dvt:'', soLuong:1, soLo:'', hanSuDung:'', ckThuongMai:0, tkCongNo:'131', tkDoanhThu:'511', slDaXuatHD:0, quyCach:'' })">
                Thêm dòng
              </button>
              <button class="btn-icon btn-icon--outline btn-icon--danger" type="button" title="Xóa hết dòng" @click="rows = []">
                <TIcon name="trash" />
              </button>
              <button class="btn btn--outline btn--neutral" type="button">Thêm ghi chú</button>
            </div>
          </div>

        </div><!-- /bh-hang -->

        <!-- Summary -->
        <div class="bh-summary">
          <span class="bh-summary__item">Tổng tiền hàng: <strong>0</strong></span>
          <span class="bh-summary__item">Thuế GTGT: <strong>0</strong></span>
          <span class="bh-summary__item bh-summary__item--total">Tổng tiền thanh toán: <strong>{{ tongTienDisplay }}</strong></span>
        </div>

        <!-- Divider -->
        <div class="bh-divider" style="margin-top:12px"></div>

        <!-- Extra info -->
        <div class="bh-extra">

          <div class="bh-row">
            <div class="field bh-col--flex">
              <label class="field__label">Số đơn hàng từ hệ thống khác</label>
              <AppTextbox v-model="form.soDonHang" />
            </div>
            <div class="field bh-col--180">
              <label class="field__label">Sàn thương mại điện tử</label>
              <AppCombobox v-model="form.sanTMDT" :options="['Shopee','Lazada','Tiki','TikTok Shop']" />
            </div>
            <div class="field" style="width:150px;flex-shrink:0">
              <label class="field__label">Tên shop</label>
              <AppTextbox v-model="form.tenShop" />
            </div>
          </div>

          <div class="bh-row">
            <div class="field" style="width:220px;flex-shrink:0">
              <label class="field__label">Ngày giao hàng thành công</label>
              <AppDatebox v-model="form.ngayGiaoHang" />
            </div>
          </div>

          <div class="bh-row">
            <div class="field" style="width:160px;flex-shrink:0">
              <label class="field__label">Mã cửa hàng</label>
              <AppTextbox v-model="form.maCuaHang" />
            </div>
            <div class="field bh-col--flex">
              <label class="field__label">Tên cửa hàng</label>
              <AppTextbox v-model="form.tenCuaHang" />
            </div>
          </div>

          <div class="bh-row">
            <div class="field bh-col--flex">
              <label class="field__label">Địa điểm giao hàng</label>
              <AppCombobox v-model="form.diaDiemGiao" :options="[]" />
            </div>
          </div>

          <div class="bh-row">
            <div class="field bh-col--flex">
              <label class="field__label">Điều khoản khác</label>
              <AppTextarea v-model="form.dieuKhoanKhac" :rows="3" />
            </div>
          </div>

          <div class="bh-row">
            <div class="field bh-col--flex">
              <label class="field__label">Mã tra cứu HĐDT</label>
              <AppTextbox v-model="form.maTraCuu" />
            </div>
            <div class="field bh-col--flex">
              <label class="field__label">Đường dẫn tra cứu HĐDT</label>
              <AppTextbox v-model="form.duongDanTraCuu" />
            </div>
          </div>

          <!-- Đính kèm -->
          <div class="dinh-kem">
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
        <div class="bh-footer__right">
          <!-- Tooltip above Cắt -->
          <div class="bh-tooltip-wrap">
            <div class="bh-tooltip">
              <strong>Nhấn Cắt</strong><br />
              Thực hiện Cắt để lưu chứng từ
              <div class="bh-tooltip__arrow"></div>
            </div>
            <button class="btn bh-ft-ghost" type="button">Cắt</button>
          </div>
          <div class="btn-split">
            <button class="btn btn--primary" type="button">Cắt và In</button>
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
import TablePaging  from '@mds/components/TablePaging.vue'
import IconMisaAI   from '@mds/components/IconMisaAI.vue'

defineEmits(['close'])

const loaiPhieuOptions = ['Bán hàng', 'Bán hàng dịch vụ', 'Bán lẻ']

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
})

const activeSubTab  = ref('ghino')
const activeHangTab = ref('hangtien')
const dieuKhoanOpen = ref(true)
const showTK        = ref(true)
const page          = ref(1)
const pageSize      = ref(20)

const rows = ref([
  { selected: false, maHang: '', tenHang: '', dvt: '', soLuong: 1, soLo: '', hanSuDung: '', ckThuongMai: 0, tkCongNo: '131', tkDoanhThu: '511', slDaXuatHD: 0, quyCach: '' }
])

const selectAllRows = computed({
  get: () => rows.value.length > 0 && rows.value.every(r => r.selected),
  set: (val) => rows.value.forEach(r => { r.selected = val })
})

const tongSoLuong = computed(() =>
  rows.value.reduce((s, r) => s + (Number(r.soLuong) || 0), 0).toLocaleString('vi-VN')
)

const tongTienDisplay = computed(() => '0')
</script>

<style scoped>
/* ── Overlay (full-screen) ── */
.bh-overlay {
  position: fixed;
  inset: 0;
  z-index: 1300;
  display: flex;
  flex-direction: column;
  background: var(--bg-white);
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

.bh-bar__icon {
  width: 30px; height: 30px;
  border-radius: var(--radius-default);
  background: var(--bg-brand-light);
  color: var(--icon-brand);
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 17px; flex-shrink: 0;
  transition: background 0.15s;
}
.bh-bar__icon:hover { background: var(--bg-brand-hover); }
.bh-bar__title {
  font-size: 15px; font-weight: var(--fw-semibold);
  color: var(--text-primary); white-space: nowrap; flex-shrink: 0;
}
.bh-bar__no {
  font-size: 13px; color: var(--text-secondary);
  background: var(--bg-neutral-light); border-radius: var(--radius-sm);
  padding: 2px 8px; white-space: nowrap; flex-shrink: 0;
}
.bh-bar__sep {
  width: 1px; height: 20px; background: var(--stroke-neutral-light); flex-shrink: 0;
}
.bh-bar__search {
  display: flex; align-items: center; gap: 6px;
  border: 1px solid var(--stroke-neutral);
  border-radius: var(--radius-default);
  padding: 0 8px; height: 32px; min-width: 180px;
  background: var(--bg-white);
}
.bh-bar__search-icon { font-size: 15px; color: var(--text-hint); flex-shrink: 0; }
.bh-bar__search-input {
  border: none; outline: none; background: transparent;
  font-family: var(--font-family); font-size: 13px;
  color: var(--text-primary); width: 100%;
}
.bh-bar__search-input::placeholder { color: var(--text-hint); }

/* ── Toolbar (44px) ── */
.bh-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  height: 44px; padding: 0 16px;
  background: var(--bg-white);
  border-bottom: 1px solid var(--stroke-neutral-light);
  flex-shrink: 0; gap: 12px;
}
.bh-toolbar__left  { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
.bh-toolbar__right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

.bh-radio {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; color: var(--text-primary);
  cursor: pointer; white-space: nowrap;
}
.bh-radio input[type="radio"] { accent-color: var(--bg-brand); }

.bh-check {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; color: var(--text-primary);
  cursor: pointer; white-space: nowrap;
}

.bh-sep {
  width: 1px; height: 20px; background: var(--stroke-neutral-light); flex-shrink: 0;
}

.bh-toolbar__total-label {
  font-size: 13px; color: var(--text-secondary); white-space: nowrap;
}
.bh-toolbar__total-value {
  font-size: 15px; font-weight: var(--fw-bold);
  color: var(--text-primary); white-space: nowrap;
  font-feature-settings: 'lnum' 1, 'tnum' 1;
}

/* ── Sub-nav (40px) ── */
.bh-subnav {
  display: flex; align-items: flex-end;
  height: 40px; padding: 0 16px;
  border-bottom: 1px solid var(--stroke-divider);
  background: var(--bg-white);
  flex-shrink: 0;
}
.bh-snav-tab {
  height: 40px; padding: 0 16px;
  font-size: 13px; font-weight: var(--fw-medium);
  font-family: var(--font-family);
  color: var(--text-secondary);
  background: transparent; border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  white-space: nowrap;
}
.bh-snav-tab:hover  { color: var(--text-primary); }
.bh-snav-tab.active { color: var(--text-brand); border-bottom-color: var(--stroke-brand); font-weight: var(--fw-semibold); }

/* ── Body ── */
.bh-body {
  flex: 1; overflow-y: auto; overflow-x: auto;
  padding: 16px 24px;
  display: flex; flex-direction: column; gap: 0;
}

/* ── Field label ── */
.field__label {
  display: block;
  font-size: 13px;
  font-weight: var(--fw-medium);
  color: var(--text-primary);
  margin-bottom: 4px;
  white-space: nowrap;
}

/* ── Layout helpers ── */
.bh-fields { display: flex; flex-direction: column; gap: 12px; }

.bh-row {
  display: flex; align-items: flex-start; gap: 12px;
  min-width: 0;
}

.bh-col--200  { width: 200px; flex-shrink: 0; }
.bh-col--180  { width: 180px; flex-shrink: 0; }
.bh-col--220  { width: 220px; flex-shrink: 0; }
.bh-col--flex { flex: 1; min-width: 100px; }

/* ── Compound input (textbox + icon buttons) ── */
.compound {
  display: flex; align-items: center; gap: 8px;
}

/* ── Điều khoản ── */
.bh-dieu-khoan {
  margin-top: 8px;
  display: flex; flex-direction: column; gap: 8px;
}
.bh-dk-toggle {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: var(--fw-medium);
  color: var(--text-primary);
  background: transparent; border: none;
  cursor: pointer; padding: 0;
  font-family: var(--font-family);
}
.bh-dk-content { padding-left: 20px; }

/* ── Divider ── */
.bh-divider {
  height: 1px;
  background: var(--stroke-divider);
  margin: 12px -24px;
  flex-shrink: 0;
}

/* ── Hàng tiền section ── */
.bh-hang { display: flex; flex-direction: column; }

.bh-hang-bar {
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 1px solid var(--stroke-divider);
  gap: 12px;
}
.bh-hang-tabs { display: flex; }
.bh-hang-tab {
  height: 38px; padding: 0 14px;
  font-size: 13px; font-weight: var(--fw-medium);
  font-family: var(--font-family);
  color: var(--text-secondary);
  background: transparent; border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  white-space: nowrap;
}
.bh-hang-tab:hover  { color: var(--text-primary); }
.bh-hang-tab.active { color: var(--text-brand); border-bottom-color: var(--stroke-brand); font-weight: var(--fw-semibold); }

.bh-hang-toolbar {
  display: flex; align-items: center; gap: 8px; padding-bottom: 6px;
}

/* ── Inline table (shared with PTM pattern) ── */
.ht-table {
  border: 1px solid var(--stroke-neutral-light);
  border-radius: var(--radius-default);
  overflow: auto;
  font-size: 13px;
  min-width: 0;
}
.ht-row {
  display: flex; align-items: stretch;
  border-bottom: 1px solid var(--stroke-neutral-light);
}
.ht-row:last-child { border-bottom: none; }
.ht-row--header { background: var(--bg-neutral-light); }
.ht-row--footer { background: var(--bg-neutral-light); }
.ht-row--body:hover { background: var(--bg-brand-light); }

.ht-cell {
  display: flex; align-items: center; padding: 0 8px;
  height: var(--input-height); border-right: 1px solid var(--stroke-neutral-light);
  overflow: hidden;
}
.ht-cell:last-child { border-right: none; }
.ht-cell--right { justify-content: flex-end; }
.ht-cell--total { font-weight: var(--fw-semibold); color: var(--text-primary); font-feature-settings: 'lnum' 1, 'tnum' 1; }

.ht-row--header .ht-cell {
  font-size: 12px; font-weight: var(--fw-medium); color: var(--text-secondary);
}

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
.ht-input[type="number"]::-webkit-inner-spin-button,
.ht-input[type="number"]::-webkit-outer-spin-button { appearance: none; }
.ht-input[type="number"] { -moz-appearance: textfield; }

/* ── Table controls ── */
.ht-controls {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 0; gap: 12px;
}
.ht-controls__left  { display: flex; align-items: center; gap: 8px; }
.ht-controls__right { display: flex; align-items: center; gap: 8px; }
.ht-count { font-size: 12px; color: var(--text-secondary); white-space: nowrap; }

/* ── ibox (inline field box) ── */
.ibox {
  display: flex; align-items: center;
  border: 1px solid var(--stroke-neutral);
  border-radius: var(--radius-default);
  height: var(--input-height); background: var(--bg-white);
  overflow: hidden;
}
.ibox-label { font-size: 13px; color: var(--text-primary); white-space: nowrap; flex-shrink: 0; cursor: default; }
.ibox__native {
  flex: 1; min-width: 0; height: 100%; border: none; outline: none;
  font-family: var(--font-family); font-size: 13px; color: var(--text-primary);
  background: transparent; padding: 0 4px;
}
.ibox__native--select { cursor: pointer; }
.ibox__icon { flex-shrink: 0; margin-right: 4px; }

/* ── Summary ── */
.bh-summary {
  display: flex; flex-direction: column; align-items: flex-end; gap: 4px;
  padding: 12px 0 4px;
}
.bh-summary__item {
  font-size: 13px; color: var(--text-secondary);
}
.bh-summary__item strong { color: var(--text-primary); font-feature-settings: 'lnum' 1, 'tnum' 1; }
.bh-summary__item--total {
  font-size: 14px; font-weight: var(--fw-semibold); color: var(--text-primary);
}
.bh-summary__item--total strong { font-size: 15px; }

/* ── Extra section ── */
.bh-extra { display: flex; flex-direction: column; gap: 12px; padding-top: 4px; }

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
  background: var(--neutral-800);
  border-top: 1px solid rgba(255,255,255,0.08);
  gap: 16px;
}
.bh-footer__left   { flex: 1; display: flex; align-items: center; }
.bh-footer__center { flex-shrink: 0; display: flex; align-items: center; }
.bh-footer__right  { flex-shrink: 0; display: flex; align-items: center; gap: 8px; }

/* Ghost button on dark */
.bh-ft-ghost {
  height: var(--btn-height); min-width: 72px; padding: 0 12px;
  border: 1px solid rgba(255,255,255,0.25);
  background: transparent; color: #fff;
  border-radius: var(--radius-default);
  font-family: var(--font-family); font-size: 13px; font-weight: var(--fw-medium);
  cursor: pointer; transition: background 0.15s;
  white-space: nowrap;
}
.bh-ft-ghost:hover { background: rgba(255,255,255,0.10); }

/* Toggle switch */
.bh-ft-toggle {
  display: flex; align-items: center; gap: 8px;
  cursor: pointer; user-select: none;
  color: #fff; font-size: 13px;
  font-family: var(--font-family);
}
.toggle-sw {
  width: 36px; height: 20px;
  border-radius: 10px;
  background: rgba(255,255,255,0.20);
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

/* Tooltip above Cắt button */
.bh-tooltip-wrap { position: relative; display: flex; align-items: center; }
.bh-tooltip {
  position: absolute;
  bottom: calc(100% + 10px);
  right: 0;
  background: #7a5af8;
  color: #fff;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px; line-height: 1.5;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10;
}
.bh-tooltip__arrow {
  position: absolute;
  bottom: -6px; right: 16px;
  width: 12px; height: 6px;
  background: #7a5af8;
  clip-path: polygon(0 0, 100% 0, 50% 100%);
}

/* ── Animation ── */
.bh-overlay { animation: bh-in 0.2s ease; }
@keyframes bh-in { from { opacity: 0 } to { opacity: 1 } }
</style>
