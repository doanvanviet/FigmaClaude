<template>
  <div class="app-shell">
    <ControlHeader app-name="Kế toán">
      <template #header-meta>
        <button class="header-company">
          Công ty cổ phần Đại Việt <TIcon name="chevron-down" />
        </button>
        <span class="header-year-badge">
          <span style="width:6px;height:6px;border-radius:50%;background:#12b76a;flex-shrink:0;box-shadow:0 0 0 1.5px white"></span>
          Dữ liệu năm 2023
        </span>
      </template>
      <template #header-search>
        <HeaderSearchBox />
      </template>
    </ControlHeader>

    <div class="body-row">
      <AppSidebar :items="sidebarItems" :active-id="activeSidebarId" :default-expanded="true" @nav="onNav" />

      <main class="main-content">
        <!-- Sub-nav -->
        <div class="sub-nav">
          <div class="sub-nav-left">
            <button v-for="tab in subTabs" :key="tab.id"
              class="sub-nav-tab" :class="{ active: activeSubTab === tab.id }"
              @click="activeSubTab = tab.id"
            >
              <TIcon v-if="tab.icon" :name="tab.icon" />
              {{ tab.label }}
              <span v-if="tab.badge" class="tab-badge">{{ tab.badge }}</span>
            </button>
          </div>
          <div class="sub-nav-right">
            <button class="btn btn--ghost btn--sm" style="gap:6px;color:var(--text-success)">
              <TIcon name="player-play" style="font-size:11px" />
              Bắt đầu sử dụng
            </button>
          </div>
        </div>

        <!-- ── Tab: Tính năng mới ── -->
        <div v-if="activeSubTab === 'tinhnangmoi'" class="tnm-wrapper">
          <div class="tnm-inner">

            <!-- Nổi bật: 3-col large cards -->
            <div class="tnm-section-label">Nổi bật</div>
            <div class="tnm-grid tnm-grid--featured">
              <div v-for="f in featuredFeatures" :key="f.id" class="tnm-card tnm-card--lg">
                <div class="tnm-thumb tnm-thumb--lg">
                  <div class="tnm-mock"
                       :style="{ '--mc': colorMap[f.color], '--mb': colorBgMap[f.color] }">
                    <div class="tnm-mock__head">
                      <span class="tnm-mock__ico"><TIcon :name="f.icon" /></span>
                      <div class="tnm-mock__lines">
                        <div class="tnm-mock__ln" style="width:72px;background:#9ca3af" />
                        <div class="tnm-mock__ln" style="width:48px;margin-top:4px" />
                      </div>
                      <div class="tnm-mock__close"><span/><span/><span/></div>
                    </div>
                    <div class="tnm-mock__sep" />
                    <div class="tnm-mock__row tnm-mock__row--active">
                      <div class="tnm-mock__ln tnm-mock__ln--accent" style="width:90px" />
                    </div>
                    <div class="tnm-mock__row">
                      <div class="tnm-mock__ln" style="width:120px" />
                    </div>
                    <div class="tnm-mock__row">
                      <div class="tnm-mock__ln" style="width:100px" />
                    </div>
                    <div class="tnm-mock__row">
                      <div class="tnm-mock__ln" style="width:140px" />
                    </div>
                  </div>
                </div>
                <div class="tnm-body">
                  <div class="tnm-date">{{ f.date }}</div>
                  <div class="tnm-title">{{ f.title }}</div>
                  <div class="tnm-desc">{{ f.desc }}</div>
                  <a class="tnm-link" :style="{ color: colorMap[f.color] }">Tìm hiểu thêm →</a>
                </div>
              </div>
            </div>

            <!-- Cập nhật khác: 3-col grid -->
            <div class="tnm-section-label" style="margin-top:4px">Cập nhật khác</div>
            <div class="tnm-grid">
              <div v-for="f in otherFeatures" :key="f.id" class="tnm-card">
                <div class="tnm-thumb">
                  <div class="tnm-mock"
                       :style="{ '--mc': colorMap[f.color], '--mb': colorBgMap[f.color] }">
                    <div class="tnm-mock__head">
                      <span class="tnm-mock__ico"><TIcon :name="f.icon" /></span>
                      <div class="tnm-mock__lines">
                        <div class="tnm-mock__ln" style="width:60px;background:#9ca3af" />
                        <div class="tnm-mock__ln" style="width:40px;margin-top:3px" />
                      </div>
                    </div>
                    <div class="tnm-mock__sep" />
                    <div class="tnm-mock__row tnm-mock__row--active">
                      <div class="tnm-mock__ln tnm-mock__ln--accent" style="width:80px" />
                    </div>
                    <div class="tnm-mock__row">
                      <div class="tnm-mock__ln" style="width:110px" />
                    </div>
                    <div class="tnm-mock__row">
                      <div class="tnm-mock__ln" style="width:90px" />
                    </div>
                  </div>
                </div>
                <div class="tnm-body">
                  <div class="tnm-date">{{ f.date }}</div>
                  <div class="tnm-title tnm-title--sm">{{ f.title }}</div>
                  <div class="tnm-desc tnm-desc--sm">{{ f.desc }}</div>
                  <a class="tnm-link" :style="{ color: colorMap[f.color] }">Tìm hiểu thêm →</a>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div v-else class="content-wrapper">

          <!-- Chi nhánh filter -->
          <div class="branch-bar">
            <div class="branch-bar__left">
              <span class="branch-bar__label">Chi nhánh</span>
              <button class="branch-bar__btn">
                Công ty TNHH Dịch vụ ăn uống và nhà hàng
                <TIcon name="chevron-down" style="font-size:14px" />
              </button>
            </div>
            <button class="btn btn--ai-outline">
              <IconMisaAI />Phân tích với AVA
            </button>
          </div>

          <!-- ── Row 1: Tình hình tài chính + 2 nợ cards ── -->
          <div class="card-row" style="grid-template-columns:minmax(0,1.7fr) minmax(0,1fr) minmax(0,1fr)">

            <!-- Tình hình tài chính -->
            <div class="card">
              <div class="card__title">
                Tình hình tài chính
                <div class="head-right">
                  <button class="btn-icon btn-icon--sm"><TIcon name="refresh" /></button>
                  <select v-model="periodTch" class="period-sel">
                    <option>Tháng này</option><option>Quý này</option><option>Năm nay</option>
                  </select>
                </div>
              </div>
              <div class="unit-line">Đvt: Triệu đồng</div>
              <div class="tch-body">
                <div class="tch-col">
                  <div class="tch-row tch-row--head">
                    <span>TỔNG TIỀN</span>
                    <span class="tch-val--bold">196.024</span>
                  </div>
                  <div v-for="r in tchLeft" :key="r.l" class="tch-row tch-row--sub">
                    <span>{{ r.l }}</span>
                    <span class="tch-val--link">{{ r.v }}</span>
                  </div>
                </div>
                <div class="tch-sep"></div>
                <div class="tch-col">
                  <div v-for="r in tchRight" :key="r.l" class="tch-row">
                    <span>{{ r.l }}</span>
                    <span class="tch-val--link">{{ r.v }}</span>
                  </div>
                </div>
              </div>
              <div class="card-foot">Số liệu tính đến: 15h47 <button class="foot-link">Tải lại</button></div>
            </div>

            <!-- Nợ phải thu -->
            <div class="card">
              <div class="card__title">
                Nợ phải thu theo hạn nợ
                <button class="btn-icon btn-icon--sm"><TIcon name="refresh" /></button>
              </div>
              <div class="kpi-value" style="margin-top:8px">
                <span class="kpi-value__num">34.446</span>
                <span class="kpi-value__unit">Triệu đồng</span>
              </div>
              <div class="debt-lbl">TỔNG</div>
              <div class="debt-row">
                <div>
                  <div class="debt-sub-num debt-sub-num--over">232 <span class="debt-sub-unit">Triệu đồng</span></div>
                  <div class="debt-sub-lbl debt-sub-lbl--over">QUÁ HẠN</div>
                </div>
                <div style="text-align:right">
                  <div class="debt-sub-num">34.214 <span class="debt-sub-unit">Triệu đồng</span></div>
                  <div class="debt-sub-lbl">TRONG HẠN</div>
                </div>
              </div>
              <div class="debt-bar"><div class="debt-bar__fill" style="width:0.67%"></div></div>
              <div class="card-foot">Số liệu tính đến: 14h58 ngày 02/10/2026 <button class="foot-link">Tải lại</button></div>
            </div>

            <!-- Nợ phải trả -->
            <div class="card">
              <div class="card__title">
                Nợ phải trả theo hạn nợ
                <button class="btn-icon btn-icon--sm"><TIcon name="refresh" /></button>
              </div>
              <div class="kpi-value" style="margin-top:8px">
                <span class="kpi-value__num">0</span>
                <span class="kpi-value__unit">Triệu đồng</span>
              </div>
              <div class="debt-lbl">TỔNG</div>
              <div class="debt-row">
                <div>
                  <div class="debt-sub-num debt-sub-num--over">0 <span class="debt-sub-unit">Triệu đồng</span></div>
                  <div class="debt-sub-lbl debt-sub-lbl--over">QUÁ HẠN</div>
                </div>
                <div style="text-align:right">
                  <div class="debt-sub-num">0 <span class="debt-sub-unit">Triệu đồng</span></div>
                  <div class="debt-sub-lbl">TRONG HẠN</div>
                </div>
              </div>
              <div class="debt-bar debt-bar--empty"><div class="debt-bar__fill" style="width:100%"></div></div>
              <div class="card-foot">Số liệu tính đến: 14h58 ngày 02/10/2026 <button class="foot-link">Tải lại</button></div>
            </div>
          </div>

          <!-- ── Row 2: Bar chart + Hàng tồn kho ── -->
          <div class="card-row" style="grid-template-columns:minmax(0,1.3fr) minmax(0,1fr)">

            <!-- Doanh thu, chi phí, lợi nhuận -->
            <div class="card">
              <div class="card__title">
                Doanh thu, chi phí, lợi nhuận
                <div class="head-right">
                  <button class="btn-icon btn-icon--sm"><TIcon name="refresh" /></button>
                  <select v-model="periodBar" class="period-sel">
                    <option>Năm nay</option><option>Tháng này</option><option>Quý này</option>
                  </select>
                </div>
              </div>
              <div class="unit-line">Đvt: Triệu đồng</div>
              <div class="chart-metrics">
                <div class="chart-metric">
                  <div class="chart-metric__num">399.568</div>
                  <div class="chart-metric__lbl">DOANH THU</div>
                </div>
                <div class="chart-metric">
                  <div class="chart-metric__num">221.349</div>
                  <div class="chart-metric__lbl">CHI PHÍ</div>
                </div>
                <div class="chart-metric">
                  <div class="chart-metric__num">178.219</div>
                  <div class="chart-metric__lbl">LỢI NHUẬN</div>
                </div>
              </div>
              <div ref="barChartRef" class="chart-area"></div>
              <div class="chart-legend">
                <div v-for="l in barLegends" :key="l.label" class="chart-legend__item">
                  <span class="chart-legend__dot" :style="{background:l.color, borderRadius: l.line ? '0' : '50%'}"></span>
                  {{ l.label }}
                </div>
              </div>
              <div class="card-foot">Số liệu tính đến: 15h47 <button class="foot-link">Tải lại</button></div>
            </div>

            <!-- Hàng hóa tồn kho -->
            <div class="card">
              <div class="card__title">
                Hàng hóa tồn kho
                <div class="head-right">
                  <button class="btn-icon btn-icon--sm"><TIcon name="refresh" /></button>
                  <button class="btn-icon btn-icon--sm"><TIcon name="settings" /></button>
                </div>
              </div>
              <div class="unit-line">Đvt: Triệu đồng</div>
              <div class="kpi-value" style="margin-bottom:2px">
                <span class="kpi-value__num" style="font-size:22px">217.872</span>
                <span class="kpi-value__unit">Triệu đồng</span>
              </div>
              <div class="card__sub" style="margin-bottom:8px">TỔNG GIÁ TRỊ</div>
              <table class="dash-tbl">
                <thead><tr>
                  <th>Tên</th>
                  <th class="col-r">Số lượng</th>
                  <th class="col-r">Giá trị</th>
                </tr></thead>
                <tbody>
                  <tr v-for="r in hangTonKhoRows" :key="r.ten">
                    <td><span class="dot-c" :style="{background:r.color}"></span>{{ r.ten }}</td>
                    <td class="col-r">{{ r.sl }}</td>
                    <td class="col-r col-amt">{{ r.gt }}</td>
                  </tr>
                </tbody>
              </table>
              <div style="padding:6px 0"><button class="foot-link">Xem thêm</button></div>
              <div class="card-foot">Số liệu tính đến: 14h58 ngày 02/10/2026 <button class="foot-link">Tải lại</button></div>
            </div>
          </div>

          <!-- ── Row 3: Doanh thu (line) + Mặt hàng bán chạy ── -->
          <div class="card-row" style="grid-template-columns:minmax(0,1.3fr) minmax(0,1fr)">

            <!-- Doanh thu line chart -->
            <div class="card">
              <div class="card__title">
                Doanh thu
                <div class="head-right">
                  <button class="btn-icon btn-icon--sm"><TIcon name="refresh" /></button>
                  <select v-model="periodRev" class="period-sel">
                    <option>Năm nay</option><option>Tháng này</option><option>Quý này</option>
                  </select>
                </div>
              </div>
              <div class="unit-line">Đvt: Triệu đồng</div>
              <div class="kpi-value" style="margin-bottom:2px">
                <span class="kpi-value__num" style="font-size:22px">399.568</span>
                <span class="kpi-value__unit">Triệu đồng</span>
              </div>
              <div class="card__sub" style="margin-bottom:4px">TỔNG DOANH THU</div>
              <div ref="revChartRef" class="chart-area"></div>
              <div class="card-foot">Số liệu tính đến: 15h47 <button class="foot-link">Tải lại</button></div>
            </div>

            <!-- Mặt hàng bán chạy -->
            <div class="card">
              <div class="card__title">
                Mặt hàng bán chạy
                <div class="head-right">
                  <button class="btn-icon btn-icon--sm"><TIcon name="refresh" /></button>
                  <button class="btn-icon btn-icon--sm"><TIcon name="settings" /></button>
                  <select v-model="periodSell" class="period-sel">
                    <option>Năm nay</option><option>Tháng này</option><option>Quý này</option>
                  </select>
                </div>
              </div>
              <div class="unit-line">Đvt: Triệu đồng</div>
              <div class="kpi-value" style="margin-bottom:2px">
                <span class="kpi-value__num" style="font-size:22px">399.568</span>
                <span class="kpi-value__unit">Triệu đồng</span>
              </div>
              <div class="card__sub" style="margin-bottom:8px">TỔNG DOANH THU</div>
              <table class="dash-tbl">
                <thead><tr>
                  <th>Tên</th>
                  <th class="col-r">Số lượng</th>
                  <th class="col-r">Doanh thu</th>
                </tr></thead>
                <tbody>
                  <tr v-for="r in banChayRows" :key="r.ten">
                    <td><span class="dot-c" :style="{background:r.color}"></span>{{ r.ten }}</td>
                    <td class="col-r">{{ r.sl }}</td>
                    <td class="col-r col-amt">{{ r.dt }}</td>
                  </tr>
                </tbody>
              </table>
              <div style="padding:6px 0"><button class="foot-link">Xem thêm</button></div>
              <div class="card-foot">Số liệu tính đến: 15h47 <button class="foot-link">Tải lại</button></div>
            </div>
          </div>

          <!-- ── Row 4: Dòng tiền + Chi phí ── -->
          <div class="card-row" style="grid-template-columns:minmax(0,1.3fr) minmax(0,1fr)">

            <!-- Dòng tiền multi-line -->
            <div class="card">
              <div class="card__title">
                Dòng tiền
                <div class="head-right">
                  <button class="btn-icon btn-icon--sm"><TIcon name="refresh" /></button>
                  <select v-model="periodCash" class="period-sel">
                    <option>Năm nay</option><option>Tháng này</option><option>Quý này</option>
                  </select>
                </div>
              </div>
              <div class="unit-line">Đvt: Triệu đồng</div>
              <div class="chart-metrics">
                <div class="chart-metric">
                  <div class="chart-metric__num">473.169</div>
                  <div class="chart-metric__lbl">TỔNG THU</div>
                </div>
                <div class="chart-metric">
                  <div class="chart-metric__num">118.267</div>
                  <div class="chart-metric__lbl">TỔNG CHI</div>
                </div>
                <div class="chart-metric">
                  <div class="chart-metric__num">409.484</div>
                  <div class="chart-metric__lbl">TỒN</div>
                </div>
              </div>
              <div ref="cashChartRef" class="chart-area"></div>
              <div class="chart-legend">
                <div v-for="l in cashLegends" :key="l.label" class="chart-legend__item">
                  <span class="chart-legend__dot" :style="{background:l.color,borderRadius:'50%'}"></span>
                  {{ l.label }}
                </div>
              </div>
              <div class="card-foot">Số liệu tính đến: 16h15 <button class="foot-link">Tải lại</button></div>
            </div>

            <!-- Chi phí donut -->
            <div class="card">
              <div class="card__title">
                Chi phí
                <div class="head-right">
                  <button class="btn-icon btn-icon--sm"><TIcon name="refresh" /></button>
                  <button class="btn-icon btn-icon--sm"><TIcon name="settings" /></button>
                  <select v-model="periodCost" class="period-sel">
                    <option>Năm nay</option><option>Tháng này</option><option>Quý này</option>
                  </select>
                </div>
              </div>
              <div class="unit-line">Đvt: Triệu đồng</div>
              <div class="kpi-value" style="margin-bottom:2px">
                <span class="kpi-value__num" style="font-size:22px">1.173</span>
                <span class="kpi-value__unit">Triệu đồng</span>
              </div>
              <div class="card__sub" style="margin-bottom:4px">TỔNG</div>
              <div class="cost-area">
                <div ref="costChartRef" style="width:160px;height:160px;flex-shrink:0"></div>
                <div class="cost-legend">
                  <div v-for="item in costData" :key="item.name" class="cost-legend__item">
                    <span class="chart-legend__dot" :style="{background:item.color,borderRadius:'50%'}"></span>
                    <span>{{ item.name }}</span>
                  </div>
                </div>
              </div>
              <div class="card-foot">Số liệu tính đến: 15h47 <button class="foot-link">Tải lại</button></div>
            </div>
          </div>

        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import ControlHeader    from '@mds/components/ControlHeader.vue'
import AppSidebar       from '@mds/components/AppSidebar.vue'
import TIcon            from '@mds/components/TIcon.vue'
import { currentTheme, COLORS } from '@mds/theme.js'
import IconMisaAI       from '@mds/components/IconMisaAI.vue'
import HeaderSearchBox  from '../components/HeaderSearchBox.vue'

const router = useRouter()

/* ── Navigation ── */
const activeSubTab    = ref('tongquan')
const activeSidebarId = ref('banlam')

const NAV_ROUTES = { tienmat: '/tien-mat', tiengui: '/tien-gui', banhang: '/ban-hang', 'mau-email': '/thiet-lap-mau-email' }
function onNav(id) {
  activeSidebarId.value = id
  if (NAV_ROUTES[id]) router.push(NAV_ROUTES[id])
}

/* ── Tính năng mới ── */
const featuredFeatures = [
  { id: 1, icon: 'wand',          color: 'brand',   date: '29/05/2026', title: 'Tự động hạch toán giao dịch ngân hàng với AVA Kế toán',       desc: 'AVA Kế toán tự động lập chứng từ hạch toán các giao dịch ngân hàng dựa trên lịch sử giao dịch tương đồng trước đó.' },
  { id: 2, icon: 'file-invoice',  color: 'brand',   date: '26/05/2026', title: 'Tự động hạch toán hóa đơn dịch vụ đầu vào với AVA Kế toán',    desc: 'Hỗ trợ tự động nhận diện nhà cung cấp và xác định loại dịch vụ trên hóa đơn khi đồng bộ hóa đơn đầu vào.' },
  { id: 3, icon: 'brain',         color: 'accent',  date: '11/07/2025', title: 'Tích hợp chuyên gia kế toán AI trên AMIS Kế toán',             desc: 'Chuyên gia kế toán AI tích hợp trực tiếp trên phần mềm để hỗ trợ công tác kế toán tại đơn vị 24/7.' },
]
const otherFeatures = [
  { id: 4,  icon: 'file-check',    color: 'warning',  date: '20/06/2025', title: 'Đáp ứng Nghị định 70/2025/NĐ-CP về hóa đơn điện tử',            desc: 'AMIS Kế toán đáp ứng các thay đổi quản lý và phát hành hóa đơn theo Nghị định mới về hóa đơn điện tử.' },
  { id: 5,  icon: 'scale',         color: 'warning',  date: '12/12/2025', title: 'Đáp ứng Thông tư 99/2025/TT-BTC',                               desc: 'Phần mềm đáp ứng Thông tư 99/2025 quy định về chế độ kế toán doanh nghiệp, hiệu lực từ 01/01/2026.' },
  { id: 6,  icon: 'chart-bar',     color: 'accent',   date: '21/08/2025', title: 'Phân tích tài chính nâng cao với Trợ lý số MISA AVA',            desc: 'Trợ lý MISA AVA hỗ trợ phân tích tài chính chuyên sâu dựa trên số liệu cập nhật tức thời.' },
  { id: 7,  icon: 'file-search',   color: 'brand',    date: '12/03/2025', title: 'Gợi ý bộ hồ sơ hợp lệ đi kèm chứng từ với AI-AVA',             desc: 'Tích hợp với Trợ lý MISA AVA để hướng dẫn kiểm tra, đối chiếu hồ sơ chứng từ theo nghiệp vụ.' },
  { id: 8,  icon: 'arrows-exchange', color: 'success', date: '12/03/2025', title: 'Tự động đối chiếu công nợ nhà cung cấp với MISA AVA',           desc: 'AMIS Kế toán tích hợp AVA để tự động đọc và đối chiếu dữ liệu báo cáo công nợ nhà cung cấp.' },
  { id: 9,  icon: 'pen',           color: 'success',  date: '12/03/2025', title: 'Kết nối AMIS WeSign để tự động ký chứng từ',                    desc: 'Kết nối với AMIS WeSign để thực hiện ký số trên các chứng từ kế toán ở bất kỳ đâu.' },
  { id: 10, icon: 'shopping-bag',  color: 'info',     date: '23/12/2024', title: 'Kết nối với sàn thương mại điện tử TikTok',                     desc: 'Kết nối TikTok để đồng bộ đơn hàng và tự động sinh chứng từ hạch toán.' },
  { id: 11, icon: 'qrcode',        color: 'info',     date: '05/12/2024', title: 'Hiển thị mã QR thanh toán trên chứng từ gửi khách hàng',        desc: 'Hiển thị mã QR thanh toán trên chứng từ để khách hàng thực hiện thanh toán nhanh chóng.' },
  { id: 12, icon: 'building-bank', color: 'success',  date: '28/11/2024', title: 'Tự động đối chiếu sao kê ngân hàng với MISA AVA',               desc: 'Hỗ trợ tự động đối chiếu sao kê ngân hàng khi kết nối với hệ thống ngân hàng điện tử.' },
]

/* ── Color maps for feature cards ── */
const colorMap   = { brand:'#245fdf', accent:'#7a5af8', warning:'#f79009', success:'#12b76a', info:'#0ba5ec' }
const colorBgMap = { brand:'#eff6ff', accent:'#f5f3ff', warning:'#fffbeb', success:'#f0fdf4', info:'#f0f9ff' }

/* ── Sub-nav tabs ── */
const subTabs = [
  { id: 'tongquan',    label: 'Tổng quan',    icon: 'home' },
  { id: 'tinhnangmoi', label: 'Tính năng mới', badge: 'mới' },
]

/* ── Sidebar ── */
const sidebarItems = [
  { id: 'banlam',     icon: 'ti-home',                 label: 'Tổng quan' },
  { id: 'tienmat',    icon: 'ti-cash',                 label: 'Tiền mặt' },
  { id: 'tiengui',    icon: 'ti-building-bank',        label: 'Tiền gửi' },
  { id: 'muahang',    icon: 'ti-package',              label: 'Mua hàng' },
  { id: 'banhang',    icon: 'ti-shopping-cart',        label: 'Bán hàng' },
  { id: 'ketnoihd',   icon: 'ti-file-check',           label: 'Kết nối HĐ điện tử' },
  { id: 'kho',        icon: 'ti-building-warehouse',   label: 'Kho' },
  { id: 'congcu',     icon: 'ti-tool',                 label: 'Công cụ dụng cụ' },
  { id: 'tienluong',  icon: 'ti-users',                label: 'Tiền lương' },
  { id: 'thue',       icon: 'ti-file-invoice',         label: 'Thuế' },
  { id: 'baocao',     icon: 'ti-chart-bar',            label: 'Báo cáo' },
  { id: 'ketoadv',    icon: 'ti-book',                 label: 'Kế toán dịch vụ' },
  { id: 'danhmuc',    icon: 'ti-list',                 label: 'Danh mục' },
  { id: 'sodubandau', icon: 'ti-coin',                 label: 'Số dư ban đầu' },
  { id: 'mau-email',  icon: 'ti-mail',                 label: 'Thiết lập mẫu email' },
]

/* ── Period state ── */
const periodTch  = ref('Tháng này')
const periodBar  = ref('Năm nay')
const periodRev  = ref('Năm nay')
const periodSell = ref('Năm nay')
const periodCash = ref('Năm nay')
const periodCost = ref('Năm nay')

/* ── Theme ── */
const brandColor = computed(() => {
  const c = COLORS.find(c => c.id === currentTheme.value)
  return c ? c.main : '#0e9a62'
})

/* ── Tình hình tài chính data ── */
const tchLeft = [
  { l: 'Tiền mặt',  v: '280' },
  { l: 'Tiền gửi',  v: '195.744' },
  { l: 'Phải thu',  v: '26.197' },
  { l: 'Phải trả',  v: '383.873' },
]
const tchRight = [
  { l: 'Doanh thu',     v: '30.064' },
  { l: 'Chi phí',       v: '16.869' },
  { l: 'Lợi nhuận',     v: '13.195' },
  { l: 'Hàng tồn kho',  v: '296.934' },
]

/* ── Hàng hóa tồn kho ── */
const hangTonKhoRows = [
  { ten: 'Trà xanh Nhật Bản',      sl: '302,080.00', gt: '2,577.21', color: '#f59e0b' },
  { ten: 'Rau rocket (arugula)',    sl: '284,415.30', gt: '1,844.62', color: '#3b82f6' },
  { ten: 'Rượu vang đỏ Bordeaux',  sl: '210,899.00', gt: '1,000.52', color: '#8b5cf6' },
  { ten: 'Salad Caesar',           sl: '172,458.00', gt: '3,778.34', color: '#6b7280' },
  { ten: 'Pizza Margherita',       sl: '161,876.00', gt: '2,335.96', color: '#ef4444' },
]

/* ── Mặt hàng bán chạy ── */
const banChayRows = [
  { ten: 'Rau rocket (arugula)',   sl: '193,000', dt: '2.702', color: '#3b82f6' },
  { ten: 'Trà xanh Nhật Bản',     sl: '183,000', dt: '2.745', color: '#8b5cf6' },
  { ten: 'Pizza Margherita',       sl: '137,000', dt: '2.740', color: '#f59e0b' },
  { ten: 'Salad Caesar',           sl: '122,000', dt: '3.660', color: '#6b7280' },
  { ten: 'Súp hành kiểu Pháp',    sl: '111.049', dt: '37.841', color: '#f97316' },
]

/* ── Chi phí donut ── */
const costData = [
  { name: 'Chi phí quảng cáo',           color: '#f43f5e', value: 50 },
  { name: 'Chi phí sửa chữa, bảo dưỡng', color: '#3b82f6', value: 20 },
  { name: 'Chi phí tiếp khách',           color: '#a78bfa', value: 15 },
  { name: 'Chi phí khác',                 color: '#1e293b', value: 15 },
]

/* ── Chart legends ── */
const barLegends = computed(() => [
  { label: 'DOANH THU', color: brandColor.value },
  { label: 'CHI PHÍ',   color: '#98a2b3' },
  { label: 'LỢI NHUẬN', color: '#f79009', line: true },
])
const cashLegends = [
  { label: 'THU', color: '#12b76a' },
  { label: 'CHI', color: '#f79009' },
  { label: 'TỒN', color: '#0ba5ec' },
]

/* ── Chart refs ── */
const barChartRef  = ref(null)
const revChartRef  = ref(null)
const cashChartRef = ref(null)
const costChartRef = ref(null)
let barChart, revChart, cashChart, costChart

const MONTHS = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12']

function getLabelRotate(el) {
  return el && el.clientWidth < 640 ? 30 : 0
}

function updateXAxisRotate() {
  if (barChart  && barChartRef.value)  barChart.setOption({ xAxis: { axisLabel: { rotate: getLabelRotate(barChartRef.value) } } })
  if (revChart  && revChartRef.value)  revChart.setOption({ xAxis: { axisLabel: { rotate: getLabelRotate(revChartRef.value) } } })
  if (cashChart && cashChartRef.value) cashChart.setOption({ xAxis: { axisLabel: { rotate: getLabelRotate(cashChartRef.value) } } })
}

function initCharts() {
  if (!window.echarts) return
  const brand = brandColor.value

  const axisStyle = { axisLine: { lineStyle: { color: '#e9eaeb' } }, axisLabel: { color: '#717680', fontSize: 11 } }
  const splitLine = { splitLine: { lineStyle: { color: '#f0f2f4' } } }
  const grid24    = { top: 8, right: 8, bottom: 48, left: 52 }

  /* ── Bar chart: Doanh thu, Chi phí, Lợi nhuận ── */
  const dtData = [33644,8028,12628,14711,33195,3000,9942,36767,35294,18419,25048,27644]
  const cpData = [18000,5000,8500,9000,20000,1500,6500,22000,20000,11000,15000,15500]
  const lnData = dtData.map((v,i) => v - cpData[i])

  barChart?.dispose()
  barChart = echarts.init(barChartRef.value)
  barChart.setOption({
    grid: grid24,
    tooltip: { trigger: 'axis', textStyle: { fontSize: 12 } },
    xAxis: { type: 'category', data: MONTHS, ...axisStyle, axisLabel: { ...axisStyle.axisLabel, rotate: getLabelRotate(barChartRef.value) } },
    yAxis: { type: 'value', axisLabel: { formatter: v => (v/1000).toFixed(0)+'k', fontSize: 11, color: '#717680' }, ...splitLine },
    series: [
      { name: 'DOANH THU', type: 'bar', data: dtData, barMaxWidth: 12, itemStyle: { color: brand, borderRadius: [4,4,0,0] } },
      { name: 'CHI PHÍ',   type: 'bar', data: cpData, barMaxWidth: 12, itemStyle: { color: '#98a2b3', borderRadius: [4,4,0,0] } },
      { name: 'LỢI NHUẬN', type: 'line', data: lnData, smooth: true,
        symbol: 'circle', symbolSize: 4,
        lineStyle: { color: '#f79009', width: 2 },
        itemStyle: { color: '#f79009' } },
    ]
  })

  /* ── Revenue area chart ── */
  const revData = [28439,22516,31138,33147,30064,10050,26566,37402,33050,41156,60423,55617]

  revChart?.dispose()
  revChart = echarts.init(revChartRef.value)
  revChart.setOption({
    grid: grid24,
    tooltip: { trigger: 'axis', textStyle: { fontSize: 12 } },
    xAxis: { type: 'category', data: MONTHS, ...axisStyle, axisLabel: { ...axisStyle.axisLabel, rotate: getLabelRotate(revChartRef.value) } },
    yAxis: { type: 'value', axisLabel: { formatter: v => (v/1000).toFixed(0)+'k', fontSize: 11, color: '#717680' }, ...splitLine },
    series: [{
      type: 'line', data: revData, smooth: true,
      symbol: 'circle', symbolSize: 4,
      lineStyle: { color: brand, width: 2 },
      itemStyle: { color: brand },
      areaStyle: { color: { type:'linear',x:0,y:0,x2:0,y2:1, colorStops:[{offset:0,color:brand+'44'},{offset:1,color:brand+'00'}] } }
    }]
  })

  /* ── Cashflow multi-line ── */
  const tonData = [92632,103133,134136,176798,196024,194727,227053,245787,272367,315644,375461,409484]
  const thuData = tonData.map(v => Math.round(v * 1.18))
  const chiData = [20000,28000,38000,50000,58000,55000,65000,75000,88000,102000,115000,118267]

  cashChart?.dispose()
  cashChart = echarts.init(cashChartRef.value)
  cashChart.setOption({
    grid: grid24,
    tooltip: { trigger: 'axis', textStyle: { fontSize: 12 } },
    xAxis: { type: 'category', data: MONTHS, ...axisStyle, axisLabel: { ...axisStyle.axisLabel, rotate: getLabelRotate(cashChartRef.value) } },
    yAxis: { type: 'value', axisLabel: { formatter: v => (v/1000).toFixed(0)+'k', fontSize: 11, color: '#717680' }, ...splitLine },
    series: [
      { name:'THU', type:'line', data:thuData, smooth:true, symbol:'circle', symbolSize:4, lineStyle:{color:'#12b76a',width:2}, itemStyle:{color:'#12b76a'} },
      { name:'CHI', type:'line', data:chiData, smooth:true, symbol:'circle', symbolSize:4, lineStyle:{color:'#f79009',width:2}, itemStyle:{color:'#f79009'} },
      { name:'TỒN', type:'line', data:tonData, smooth:true, symbol:'circle', symbolSize:4, lineStyle:{color:'#0ba5ec',width:2}, itemStyle:{color:'#0ba5ec'} },
    ]
  })

  /* ── Cost donut ── */
  costChart?.dispose()
  costChart = echarts.init(costChartRef.value)
  costChart.setOption({
    tooltip: { trigger: 'item', textStyle: { fontSize: 12 } },
    series: [{
      type: 'pie', radius: ['50%','80%'], center: ['50%','50%'],
      padAngle: 2, borderRadius: 4,
      label: { show: false },
      data: costData.map(d => ({ name: d.name, value: d.value, itemStyle: { color: d.color } }))
    }]
  })
}

onMounted(() => {
  if (window.echarts) { initCharts(); updateXAxisRotate() }
  else {
    const t = setInterval(() => { if (window.echarts) { initCharts(); updateXAxisRotate(); clearInterval(t) } }, 100)
  }
  window.addEventListener('resize', () => {
    barChart?.resize(); revChart?.resize(); cashChart?.resize(); costChart?.resize()
    updateXAxisRotate()
  })
})

watch(currentTheme, () => initCharts())
</script>

<style scoped>
/* min-width đảm bảo dashboard không co < 600px khi panel mở rộng.
   Kết hợp với --ava-panel-width trên :root và body min-width trong style.css
   → viewport scroll ngang khi sidebar + panel + content > cửa sổ trình duyệt. */
/* Override width: 100vw của mds-ui */
.app-shell { width: 100%; }

/* ── Branch filter ── */
.branch-bar {
  display: flex; align-items: center; justify-content: space-between;
  font-size: 13px; color: var(--text-secondary);
  margin-bottom: -4px;
}
.branch-bar__left { display: flex; align-items: center; gap: 8px; }
.branch-bar__label { flex-shrink: 0; }
.branch-bar__btn {
  display: flex; align-items: center; gap: 4px;
  background: none; border: none; cursor: pointer;
  font-size: 13px; color: var(--text-primary); padding: 0;
  white-space: nowrap; flex-shrink: 0;
}
.branch-bar__btn:hover { color: var(--text-brand); }

/* ── Tab badge ── */
.tab-badge {
  font-size: 10px; font-weight: 700; color: white;
  background: var(--text-warning, #f79009);
  padding: 1px 5px; border-radius: 10px; margin-left: 4px;
  vertical-align: middle;
}

/* ── Card head helpers ── */
.head-right { display: flex; align-items: center; gap: 6px; }
.unit-line  { font-size: 11px; color: var(--text-secondary); text-align: right; margin: -2px 0 8px; }

/* Icon buttons (reload, settings) ẩn mặc định, hiện khi hover vào card */
.card .head-right .btn-icon { opacity: 0; transition: opacity 0.15s; }
.card:hover .head-right .btn-icon { opacity: 1; }

/* ── Period select ── */
.period-sel {
  border: none; outline: none; font-size: 12px; color: var(--text-secondary);
  cursor: pointer; padding: 2px 4px; border-radius: 4px;
  background: transparent;
}
.period-sel:hover { background: var(--bg-neutral-hover); }

/* ── Card footer ── */
.card-foot {
  font-size: 11px; color: var(--text-secondary);
  margin-top: 10px; padding-top: 8px;
  border-top: 1px solid var(--stroke-neutral-light);
}
.foot-link {
  background: none; border: none; padding: 0; cursor: pointer;
  font-size: 11px; color: var(--text-brand);
}
.foot-link:hover { text-decoration: underline; }

/* ── Tình hình tài chính body ── */
.tch-body { display: flex; gap: 0; margin: 4px 0 10px; }
.tch-col  { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0; }
.tch-sep  { width: 1px; background: var(--stroke-neutral-light); margin: 0 16px; flex-shrink: 0; }
.tch-row  { display: flex; justify-content: space-between; align-items: center; padding: 5px 0;
            font-size: 13px; color: var(--text-secondary);
            border-bottom: 1px solid var(--stroke-neutral-light); }
.tch-row:last-child { border-bottom: none; }
.tch-row--head { font-size: 12px; font-weight: var(--fw-semibold); color: var(--text-secondary); text-transform: uppercase; }
.tch-row--sub  { padding-left: 8px; }
.tch-val--bold { font-weight: var(--fw-semibold); color: var(--text-primary); font-size: 13px; }
.tch-val--link { color: var(--text-brand); font-weight: var(--fw-semibold); font-size: 13px; }

/* ── Debt card ── */
.debt-lbl     { font-size: 11px; color: var(--text-secondary); text-transform: uppercase; margin: 0 0 10px; }
.debt-row     { display: flex; justify-content: space-between; margin-bottom: 10px; }
.debt-sub-num { font-size: 14px; font-weight: var(--fw-semibold); color: var(--text-primary); }
.debt-sub-num--over { color: var(--text-warning, #f79009); }
.debt-sub-unit { font-size: 11px; font-weight: 400; color: var(--text-secondary); }
.debt-sub-lbl  { font-size: 11px; color: var(--text-secondary); text-transform: uppercase; margin-top: 2px; }
.debt-sub-lbl--over { color: var(--text-warning, #f79009); }
.debt-bar      { height: 6px; border-radius: 3px; background: var(--stroke-neutral-light); overflow: hidden; }
.debt-bar__fill { height: 100%; background: var(--text-warning, #f79009); border-radius: 3px; }
.debt-bar--empty .debt-bar__fill { background: var(--text-warning, #f79009); opacity: 0.4; }

/* ── Chart metrics row (big 3 numbers above chart) ── */
.chart-metrics { display: flex; gap: 24px; margin: 4px 0 8px; }
.chart-metric__num { font-size: 18px; font-weight: var(--fw-bold); color: var(--text-primary); }
.chart-metric__lbl { font-size: 11px; color: var(--text-secondary); text-transform: uppercase; margin-top: 1px; }

/* ── Chart area ── */
.chart-area { width: 100%; height: 200px; }

/* ── Chart legend ── */
.chart-legend { display: flex; gap: 16px; justify-content: center; padding: 6px 0 2px; }
.chart-legend__item { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text-secondary); text-transform: uppercase; }
.chart-legend__dot  { display: inline-block; width: 8px; height: 8px; flex-shrink: 0; }

/* ── Dashboard tables ── */
.dash-tbl { width: 100%; border-collapse: collapse; }
.dash-tbl th {
  height: 32px; padding: 0 8px;
  font-size: 12px; font-weight: var(--fw-semibold); color: var(--text-secondary);
  text-align: left; border-bottom: 1px solid var(--stroke-neutral-light);
}
.dash-tbl td {
  height: 32px; padding: 0 8px;
  font-size: 12px; color: var(--text-primary);
  border-bottom: 1px solid var(--stroke-neutral-light);
}
.dash-tbl tbody tr:last-child td { border-bottom: none; }
.dash-tbl tbody tr:hover td { background: var(--bg-neutral-hover); }
.col-r   { text-align: right; }
.col-amt { font-weight: var(--fw-semibold); }
.dot-c   { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px; flex-shrink: 0; vertical-align: middle; }

/* ── Chi phí donut layout ── */
.cost-area { display: flex; align-items: center; gap: 12px; margin: 4px 0; }
.cost-legend { display: flex; flex-direction: column; gap: 8px; }
.cost-legend__item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-secondary); }

/* ══════════════════════════════════════════════
   Tính năng mới  — clean card style
══════════════════════════════════════════════ */
.tnm-wrapper {
  flex: 1; overflow-y: auto;
  padding: 24px 24px 48px;
  display: flex; justify-content: center;
}
.tnm-inner {
  width: 100%; max-width: 1100px;
  display: flex; flex-direction: column; gap: 24px;
}
.tnm-section-label {
  font-size: var(--text-h3); font-weight: var(--fw-semibold);
  line-height: var(--text-h3-lh); color: var(--text-primary);
}

/* ── Grids ── */
.tnm-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
}
.tnm-grid--featured { gap: 20px; }

/* ── Card ── */
.tnm-card {
  display: flex; flex-direction: column;
  background: var(--bg-white);
  border-radius: var(--radius-dialog);
  border: 1px solid var(--stroke-neutral-light);
  box-shadow: var(--shadow-sm);
  overflow: hidden; cursor: pointer;
  transition: box-shadow 0.15s, transform 0.15s;
}
.tnm-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }

/* ── Thumbnail area ── */
.tnm-thumb {
  background: #f3f5f8;
  height: 160px;
  display: flex; align-items: center; justify-content: center;
  padding: 20px; flex-shrink: 0;
}
.tnm-thumb--lg { height: 196px; }

/* ── CSS UI Mockup ── */
.tnm-mock {
  background: var(--bg-white);
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(16,24,40,0.10), 0 1px 4px rgba(16,24,40,0.06);
  width: 200px;
  overflow: hidden;
  flex-shrink: 0;
}

.tnm-mock__head {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 12px;
}
.tnm-mock__ico {
  width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px;
  background: var(--mb); color: var(--mc);
}
.tnm-mock__lines { flex: 1; display: flex; flex-direction: column; }
.tnm-mock__close { display: flex; gap: 4px; margin-left: auto; }
.tnm-mock__close span { width: 8px; height: 8px; border-radius: 50%; background: #e5e7eb; }

.tnm-mock__sep { height: 1px; background: #f0f2f4; }

.tnm-mock__row {
  padding: 7px 12px;
  border-left: 2px solid transparent;
}
.tnm-mock__row--active {
  border-left-color: var(--mc);
  background: var(--mb);
}

.tnm-mock__ln {
  height: 6px; border-radius: 3px;
  background: #e5e7eb;
}
.tnm-mock__ln--accent { background: var(--mc); opacity: 0.55; }

/* ── Card body ── */
.tnm-body {
  flex: 1; padding: 14px 16px 18px;
  display: flex; flex-direction: column; gap: 6px;
}

.tnm-date { font-size: var(--text-sm); color: var(--text-hint); }

.tnm-title {
  font-size: var(--text-body-md); font-weight: var(--fw-semibold);
  line-height: 22px; color: var(--text-primary);
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.tnm-title--sm {
  font-size: var(--text-body); line-height: var(--text-body-lh);
}

.tnm-desc {
  font-size: var(--text-body); color: var(--text-secondary);
  line-height: var(--text-body-lh); flex: 1;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.tnm-desc--sm { font-size: var(--text-sm); line-height: var(--text-sm-lh); }

.tnm-link {
  font-size: var(--text-sm); font-weight: var(--fw-medium);
  text-decoration: none; cursor: pointer; margin-top: 2px;
  display: inline-flex; align-items: center; gap: 3px;
}
.tnm-link:hover { text-decoration: underline; }
</style>
