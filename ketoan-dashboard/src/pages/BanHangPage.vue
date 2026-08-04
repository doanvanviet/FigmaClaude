<template>
  <div class="app-shell">
    <ControlHeader app-name="Kế toán" app-tag="HKĐ">
      <template #header-meta>
        <button class="header-company">
          Công ty cổ phần Đại Việt <TIcon name="chevron-down" />
        </button>
        <span class="header-year-badge">
          <span style="width:6px;height:6px;border-radius:50%;background:#12b76a;flex-shrink:0;box-shadow:0 0 0 1.5px white"></span>
          Dữ liệu năm 2026
        </span>
      </template>
    </ControlHeader>

    <div class="body-row">
      <AppSidebar :items="navItems" active-id="ban-hang" @nav="onNav" />

      <div class="main-content">
        <!-- Sub-nav tabs -->
        <div class="sub-nav">
          <div class="sub-nav__scroll">
            <button v-for="tab in tabs" :key="tab.id"
              class="sub-nav-tab"
              :class="{ active: activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
              <span v-if="tab.badge" class="tab-badge">{{ tab.badge }}</span>
            </button>
          </div>
        </div>

        <div class="content-wrapper">
          <div class="table-panel">

            <div class="data-panel data-panel--master">
              <TableHeader
                v-model="searchQuery"
                search-placeholder="Tìm kiếm"
                :search-width="220"
                :main-function-button="true"
                :bulk-action="selected.length > 0"
                :selected-count="selected.length"
                @deselect-all="selected = []"
              >
                <template #bulk-buttons>
                  <button class="btn btn--outline btn--neutral">Lập hóa đơn</button>
                  <button class="btn btn--outline btn--neutral">Ghi sổ</button>
                  <button class="btn btn--outline btn--neutral">Xóa</button>
                  <DropdownMenu :items="bulkMoreItems" placement="bottom-end" :min-width="160">
                    <template #trigger="{ toggle }">
                      <button class="btn-icon btn-icon--outline" @click.stop="toggle"><TIcon name="dots" /></button>
                    </template>
                  </DropdownMenu>
                </template>
                <template #main-buttons>
                  <button class="btn btn--primary" @click="showAddForm = true"><TIcon name="plus" />Thêm</button>
                  <button class="btn btn--ai-outline"><TIcon name="wand" />Thêm bằng AI</button>
                  <DropdownMenu :items="moreItems" placement="bottom-end" :min-width="200">
                    <template #trigger="{ toggle }">
                      <button class="btn-icon btn-icon--outline" @click.stop="toggle"><TIcon name="dots" /></button>
                    </template>
                  </DropdownMenu>
                </template>
              </TableHeader>

              <!-- Main datatable -->
              <div class="datatable" ref="datatableRef">
                <div v-if="hoveredColKey" class="col-hover-line" :style="{ left: colHoverLineLeft + 'px' }" />

                <!-- Header row -->
                <div class="dt-row dt-row--header" :style="{ minWidth: totalRowMinWidth + 'px' }">
                  <div class="dt-cell dt-cell--header" style="width:44px;flex-shrink:0">
                    <div class="dt-cell-inner" style="justify-content:center;padding:0">
                      <AppCheckbox v-model="selectAll" />
                    </div>
                  </div>
                  <div v-for="col in columns" :key="col.key"
                    class="dt-cell dt-cell--header"
                    :style="cellStyle(col)"
                  >
                    <div class="dt-cell-inner" :class="col.align === 'right' ? 'dt-cell-inner--right' : ''">
                      <span class="dt-header-text">{{ col.label }}</span>
                    </div>
                    <div class="dt-col-divider"
                      @mousedown.prevent="startResize($event, col)"
                      @mouseenter="onDividerEnter($event)"
                      @mouseleave="onDividerLeave"
                    ></div>
                  </div>
                </div>

                <!-- Body rows -->
                <div v-for="(row, i) in filteredRows" :key="i"
                  class="dt-row dt-row--body"
                  :class="{ 'dt-row--selected': selected.includes(i), 'dt-row--active': activeRow === i, 'dt-row--unghi': !row.ghiSo, 'dt-row--warning': row.ttXH === 'Đã xuất 1 phần' }"
                  :style="{ minWidth: totalRowMinWidth + 'px' }"
                  @click="selectRow(i)"
                >
                  <div class="dt-cell" style="width:44px;flex-shrink:0" @click.stop>
                    <div class="dt-cell-inner" style="justify-content:center;padding:0">
                      <AppCheckbox v-model="selected" :value="i" />
                    </div>
                  </div>
                  <!-- Ngày hạch toán -->
                  <div class="dt-cell" :style="cellStyle(columns[0])">
                    <div class="dt-cell-inner"><span class="dt-text">{{ row.ngayHT }}</span></div>
                  </div>
                  <!-- Số chứng từ -->
                  <div class="dt-cell" :style="cellStyle(columns[1])">
                    <div class="dt-cell-inner">
                      <button class="dt-action-link">{{ row.soCT }}</button>
                    </div>
                  </div>
                  <!-- Số hóa đơn -->
                  <div class="dt-cell" :style="cellStyle(columns[2])">
                    <div class="dt-cell-inner"><span class="dt-text">{{ row.soHD }}</span></div>
                  </div>
                  <!-- Khách hàng -->
                  <div class="dt-cell" :style="cellStyle(columns[3])">
                    <div class="dt-cell-inner"><span class="dt-text">{{ row.kh }}</span></div>
                  </div>
                  <!-- Tổng tiền thanh toán -->
                  <div class="dt-cell" :style="cellStyle(columns[4])">
                    <div class="dt-cell-inner dt-cell-inner--right">
                      <span class="dt-text dt-text--right" style="font-weight:var(--fw-semibold)">{{ row.tongTien }}</span>
                    </div>
                  </div>
                  <!-- TT lập hóa đơn -->
                  <div class="dt-cell" :style="cellStyle(columns[5])">
                    <div class="dt-cell-inner">
                      <span class="dt-text dt-text--status" :class="row.ttLapHD === 'Đã lập' ? 'text-success' : 'text-secondary'">{{ row.ttLapHD }}</span>
                    </div>
                  </div>
                  <!-- TT thanh toán -->
                  <div class="dt-cell" :style="cellStyle(columns[6])">
                    <div class="dt-cell-inner">
                      <span class="dt-text dt-text--status" :class="row.ttTT === 'Đã thanh toán' ? 'text-success' : 'text-secondary'">{{ row.ttTT }}</span>
                    </div>
                  </div>
                  <!-- TT xuất hàng -->
                  <div class="dt-cell" :style="cellStyle(columns[7])">
                    <div class="dt-cell-inner">
                      <span class="dt-text dt-text--status" :class="row.ttXH === 'Đã xuất đủ' ? 'text-success' : row.ttXH === 'Chưa xuất' ? 'text-secondary' : ''">{{ row.ttXH }}</span>
                    </div>
                  </div>
                  <!-- Số chứng từ CUKCUK -->
                  <div class="dt-cell" :style="cellStyle(columns[8])">
                    <div class="dt-cell-inner"><span class="dt-text">{{ row.cukcuk }}</span></div>
                  </div>
                  <!-- Số chứng từ eShop -->
                  <div class="dt-cell" :style="cellStyle(columns[9])">
                    <div class="dt-cell-inner"><span class="dt-text">{{ row.eshop }}</span></div>
                  </div>
                  <!-- Row actions -->
                  <div class="dt-cell dt-cell--actions">
                    <div class="row-actions">
                      <button class="btn-icon btn-icon--sm btn-icon--outline" title="Xem"><TIcon name="eye" /></button>
                      <button class="btn-icon btn-icon--sm btn-icon--outline" title="Sửa"><TIcon name="pencil" /></button>
                      <button class="btn-icon btn-icon--sm btn-icon--outline btn-icon--danger" title="Xóa"><TIcon name="trash" /></button>
                      <DropdownMenu :items="rowMoreItems" placement="bottom-end" :min-width="160">
                        <template #trigger="{ toggle }">
                          <button class="btn-icon btn-icon--sm btn-icon--outline" title="Thêm thao tác" @click.stop="toggle"><TIcon name="dots" /></button>
                        </template>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div><!-- /datatable -->

              <!-- Footer row -->
              <div class="dt-row dt-row--footer" :style="{ minWidth: totalRowMinWidth + 'px' }">
                <div class="dt-cell dt-cell--footer" style="width:44px;flex-shrink:0"></div>
                <div class="dt-cell dt-cell--footer" :style="cellStyle(columns[0])">
                  <div class="dt-cell-inner"><span class="dt-footer-text">Tổng</span></div>
                </div>
                <div class="dt-cell dt-cell--footer" :style="cellStyle(columns[1])"></div>
                <div class="dt-cell dt-cell--footer" :style="cellStyle(columns[2])"></div>
                <div class="dt-cell dt-cell--footer" :style="cellStyle(columns[3])"></div>
                <div class="dt-cell dt-cell--footer" :style="cellStyle(columns[4])">
                  <div class="dt-cell-inner dt-cell-inner--right">
                    <span class="dt-footer-text">147.928.929.662</span>
                  </div>
                </div>
                <template v-for="col in columns.slice(5)" :key="col.key">
                  <div class="dt-cell dt-cell--footer" :style="cellStyle(col)"></div>
                </template>
              </div>

              <TablePaging :total="filteredRows.length" v-model:page="currentPage" v-model:page-size="pageSize" />

            </div><!-- /data-panel--master -->

            <!-- Expand trigger -->
            <div v-if="activeRow !== null && !detailOpen" class="master-bottom-cep">
              <CollapseExpandPanel type="Collapse" position="Bottom" bg-color="White" @click="detailOpen = true" />
            </div>

            <!-- Panel resizer -->
            <div v-if="activeRow !== null && detailOpen" class="panel-resizer" @mousedown="startPanelResize" />

            <!-- Detail panel -->
            <div v-if="activeRow !== null && detailOpen"
              class="data-panel data-panel--detail"
              :style="{ height: detailHeight + 'px' }">
              <div class="detail-cep">
                <CollapseExpandPanel type="Collapse" position="Top" @click="detailOpen = false" />
              </div>
              <div class="detail-panel__tabs">
                <button class="sub-nav-tab active">Chi tiết</button>
              </div>

              <div class="datatable datatable--detail" ref="detailTableRef">
                <div v-if="detailHoveredColKey" class="col-hover-line" :style="{ left: detailHoverLineLeft + 'px' }" />

                <!-- Detail header -->
                <div class="dt-row dt-row--header" :style="{ minWidth: totalDetailMinWidth + 'px' }">
                  <div v-for="col in detailCols" :key="col.key"
                    class="dt-cell dt-cell--header" :style="detailCellStyle(col)">
                    <div class="dt-cell-inner" :class="col.align === 'right' ? 'dt-cell-inner--right' : col.align === 'center' ? 'dt-cell-inner--center' : ''">
                      <span class="dt-header-text">{{ col.label }}</span>
                    </div>
                    <div class="dt-col-divider"
                      @mousedown.prevent="startDetailResize($event, col)"
                      @mouseenter="onDetailDividerEnter($event)"
                      @mouseleave="onDetailDividerLeave"
                    ></div>
                  </div>
                </div>

                <!-- Detail body rows -->
                <div v-for="(row, i) in detailRows" :key="i"
                  class="dt-row dt-row--body"
                  :style="{ minWidth: totalDetailMinWidth + 'px' }">
                  <!-- # -->
                  <div class="dt-cell" :style="detailCellStyle(detailCols[0])">
                    <div class="dt-cell-inner dt-cell-inner--center"><span class="dt-text">{{ row.stt }}</span></div>
                  </div>
                  <!-- Mã hàng -->
                  <div class="dt-cell" :style="detailCellStyle(detailCols[1])">
                    <div class="dt-cell-inner"><span class="dt-text">{{ row.maHang }}</span></div>
                  </div>
                  <!-- Tên hàng -->
                  <div class="dt-cell" :style="detailCellStyle(detailCols[2])">
                    <div class="dt-cell-inner"><span class="dt-text">{{ row.tenHang }}</span></div>
                  </div>
                  <!-- Hàng khuyến mại (checkbox) -->
                  <div class="dt-cell" :style="detailCellStyle(detailCols[3])">
                    <div class="dt-cell-inner dt-cell-inner--center" @click.stop>
                      <AppCheckbox :model-value="row.hangKM" disabled />
                    </div>
                  </div>
                  <!-- Chiết khấu TM (checkbox) -->
                  <div class="dt-cell" :style="detailCellStyle(detailCols[4])">
                    <div class="dt-cell-inner dt-cell-inner--center" @click.stop>
                      <AppCheckbox :model-value="row.ckTM" disabled />
                    </div>
                  </div>
                  <!-- TK công nợ -->
                  <div class="dt-cell" :style="detailCellStyle(detailCols[5])">
                    <div class="dt-cell-inner"><span class="dt-text">{{ row.tkCN }}</span></div>
                  </div>
                  <!-- TK doanh thu -->
                  <div class="dt-cell" :style="detailCellStyle(detailCols[6])">
                    <div class="dt-cell-inner"><span class="dt-text">{{ row.tkDT }}</span></div>
                  </div>
                  <!-- DVT -->
                  <div class="dt-cell" :style="detailCellStyle(detailCols[7])">
                    <div class="dt-cell-inner"><span class="dt-text">{{ row.dvt }}</span></div>
                  </div>
                  <!-- Số lượng -->
                  <div class="dt-cell" :style="detailCellStyle(detailCols[8])">
                    <div class="dt-cell-inner dt-cell-inner--right"><span class="dt-text">{{ row.soLuong }}</span></div>
                  </div>
                  <!-- Đơn giá -->
                  <div class="dt-cell" :style="detailCellStyle(detailCols[9])">
                    <div class="dt-cell-inner dt-cell-inner--right"><span class="dt-text">{{ row.donGia }}</span></div>
                  </div>
                  <!-- Thành tiền -->
                  <div class="dt-cell" :style="detailCellStyle(detailCols[10])">
                    <div class="dt-cell-inner dt-cell-inner--right">
                      <span class="dt-text" style="font-weight:var(--fw-semibold)">{{ row.thanhTien }}</span>
                    </div>
                  </div>
                  <!-- Đối tượng -->
                  <div class="dt-cell" :style="detailCellStyle(detailCols[11])">
                    <div class="dt-cell-inner"><span class="dt-text">{{ row.dtg }}</span></div>
                  </div>
                  <!-- Tên đối tượng -->
                  <div class="dt-cell" :style="detailCellStyle(detailCols[12])">
                    <div class="dt-cell-inner"><span class="dt-text">{{ row.tenDtg }}</span></div>
                  </div>
                  <!-- Tỷ lệ CK -->
                  <div class="dt-cell" :style="detailCellStyle(detailCols[13])">
                    <div class="dt-cell-inner dt-cell-inner--right"><span class="dt-text">{{ row.tyLeCK }}</span></div>
                  </div>
                  <!-- Tiền chiết khấu -->
                  <div class="dt-cell" :style="detailCellStyle(detailCols[14])">
                    <div class="dt-cell-inner dt-cell-inner--right"><span class="dt-text">{{ row.tienCK }}</span></div>
                  </div>
                </div>
              </div><!-- /datatable--detail -->

              <!-- Detail footer -->
              <div class="dt-row dt-row--footer" :style="{ minWidth: totalDetailMinWidth + 'px' }">
                <div class="dt-cell dt-cell--footer" :style="detailCellStyle(detailCols[0])">
                  <div class="dt-cell-inner"><span class="dt-footer-text">Tổng</span></div>
                </div>
                <template v-for="col in detailCols.slice(1, 8)" :key="col.key">
                  <div class="dt-cell dt-cell--footer" :style="detailCellStyle(col)"></div>
                </template>
                <!-- Số lượng total -->
                <div class="dt-cell dt-cell--footer" :style="detailCellStyle(detailCols[8])">
                  <div class="dt-cell-inner dt-cell-inner--right"><span class="dt-footer-text">280,00</span></div>
                </div>
                <!-- Đơn giá empty -->
                <div class="dt-cell dt-cell--footer" :style="detailCellStyle(detailCols[9])"></div>
                <!-- Thành tiền total -->
                <div class="dt-cell dt-cell--footer" :style="detailCellStyle(detailCols[10])">
                  <div class="dt-cell-inner dt-cell-inner--right"><span class="dt-footer-text">81.550.000</span></div>
                </div>
                <!-- Đối tượng, Tên đối tượng empty -->
                <div class="dt-cell dt-cell--footer" :style="detailCellStyle(detailCols[11])"></div>
                <div class="dt-cell dt-cell--footer" :style="detailCellStyle(detailCols[12])"></div>
                <!-- Tỷ lệ CK total -->
                <div class="dt-cell dt-cell--footer" :style="detailCellStyle(detailCols[13])">
                  <div class="dt-cell-inner dt-cell-inner--right"><span class="dt-footer-text">0,00</span></div>
                </div>
                <!-- Tiền CK empty -->
                <div class="dt-cell dt-cell--footer" :style="detailCellStyle(detailCols[14])"></div>
              </div>

              <TablePaging :total="detailRows.length" v-model:page="detailPage" :page-size-options="[20]" />
            </div><!-- /data-panel--detail -->

          </div><!-- /table-panel -->
        </div><!-- /content-wrapper -->
      </div><!-- /main-content -->
    </div><!-- /body-row -->
  </div><!-- /app-shell -->
  <!-- ═══════════════════════════════════════════
       Chứng từ bán hàng — Full-screen form
  ════════════════════════════════════════════ -->
  <Teleport to="body">
    <div v-if="showAddForm" class="form-overlay">

      <!-- Form Header -->
      <div class="form-hd">
        <div class="form-hd__left">
          <span class="form-hd__icon"><TIcon name="file-invoice" /></span>
          <span class="form-hd__title">Chứng từ bán hàng</span>
          <span class="form-hd__no">PT00106</span>
        </div>
        <div class="form-hd__right">
          <button class="btn btn--outline btn--neutral" style="gap:6px"><TIcon name="help" />Hướng dẫn sử dụng</button>
          <button class="btn-icon btn-icon--outline" title="Phím tắt"><TIcon name="keyboard" /></button>
          <button class="btn-icon btn-icon--outline" title="Cài đặt"><TIcon name="settings" /></button>
          <div class="form-hd__sep"></div>
          <button class="btn-icon btn-icon--outline" title="Đóng" @click="showAddForm = false"><TIcon name="x" /></button>
        </div>
      </div>

      <!-- Options Strip -->
      <div class="form-opts">
        <div class="form-opts__group">
          <span class="fopt-label">Loại chứng từ</span>
          <select class="fopt-select" v-model="formData.loaiCT">
            <option>Bán hàng</option>
            <option>Bán hàng dịch vụ</option>
          </select>
        </div>
        <div class="form-opts__div"></div>
        <div class="form-opts__group">
          <span class="fopt-label">Lập từ chứng từ khác</span>
          <select class="fopt-select" v-model="formData.lapTuCT">
            <option value="">-- Chọn --</option>
            <option>Đơn đặt hàng</option>
            <option>Hợp đồng bán hàng</option>
          </select>
        </div>
        <div class="form-opts__div"></div>
        <div class="form-opts__radios">
          <label class="fopt-radio"><input type="radio" v-model="formData.thuTien" value="chua" /><span>Chưa thu tiền</span></label>
          <label class="fopt-radio"><input type="radio" v-model="formData.thuTien" value="ngay" /><span>Thu tiền ngay</span></label>
          <select v-if="formData.thuTien === 'ngay'" class="fopt-select" v-model="formData.taiKhoan">
            <option>Tiền mặt</option>
            <option>Tiền gửi ngân hàng</option>
          </select>
        </div>
        <div class="form-opts__div"></div>
        <div class="form-opts__checks" @click.stop>
          <label class="fopt-check"><AppCheckbox v-model="formData.kiemPhieuXuat" /><span>Kiểm phiếu xuất kho</span></label>
          <label class="fopt-check"><AppCheckbox v-model="formData.lapKemHoaDon" /><span>Lập kèm hóa đơn</span></label>
        </div>
      </div>

      <!-- Body -->
      <div class="form-body">

        <!-- Main content -->
        <div class="form-main">
          <!-- Tabs -->
          <div class="form-body-tabs">
            <button v-for="t in formTabs" :key="t.id"
              class="sub-nav-tab"
              :class="{ active: formTab === t.id }"
              @click="formTab = t.id"
            >{{ t.label }}</button>
          </div>

          <!-- Thu chi tiền tab -->
          <div class="form-content" v-if="formTab === 'thu-chi-tien'">

            <!-- Form fields -->
            <div class="fgrid">
              <div class="ff">
                <label class="ff-lbl">Mã khách hàng</label>
                <input class="ff-input" type="text" v-model="formData.maKH" placeholder="Nhập mã KH..." />
              </div>
              <div class="ff">
                <label class="ff-lbl">Tên khách hàng</label>
                <input class="ff-input" type="text" v-model="formData.tenKH" placeholder="Tên khách hàng..." />
              </div>
              <div class="ff">
                <label class="ff-lbl">Ngày hạch toán</label>
                <input class="ff-input" type="text" v-model="formData.ngayHT" placeholder="dd/mm/yyyy" />
              </div>
              <div class="ff">
                <label class="ff-lbl">Người nộp</label>
                <input class="ff-input" type="text" v-model="formData.nguoiNop" placeholder="Họ và tên..." />
              </div>
              <div class="ff ff--span2">
                <label class="ff-lbl">Địa chỉ</label>
                <input class="ff-input" type="text" v-model="formData.diaChi" />
              </div>
              <div class="ff">
                <label class="ff-lbl">Ngày chứng từ</label>
                <input class="ff-input" type="text" v-model="formData.ngayCT" placeholder="dd/mm/yyyy" />
              </div>
              <div class="ff">
                <label class="ff-lbl">Nhân viên bán hàng</label>
                <input class="ff-input" type="text" v-model="formData.nvBanHang" placeholder="Nhập hoặc chọn..." />
              </div>
              <div class="ff">
                <label class="ff-lbl">Lý do nộp</label>
                <input class="ff-input" type="text" v-model="formData.lyDoNop" placeholder="Nộp tiền bán hàng..." />
              </div>
              <div class="ff">
                <label class="ff-lbl">Kèm theo</label>
                <input class="ff-input" type="text" v-model="formData.kemTheo" placeholder="0 chứng từ gốc" />
              </div>
              <div class="ff">
                <label class="ff-lbl">Số phiếu thu</label>
                <input class="ff-input" type="text" v-model="formData.soPhieuThu" placeholder="Tự động" />
              </div>
              <div class="ff ff--span2">
                <label class="ff-lbl">Tham chiếu</label>
                <div class="ff-refs">
                  <button class="dt-action-link" type="button">BH00420</button>
                  <button class="dt-action-link" type="button">BH00412</button>
                </div>
              </div>
            </div>

            <!-- Detail table -->
            <div class="fdt">
              <div class="fdt-bar">
                <div class="fdt-tabs">
                  <button class="sub-nav-tab active" style="height:32px;padding:0 12px">Hàng tiền</button>
                  <button class="sub-nav-tab" style="height:32px;padding:0 12px">Giá vốn</button>
                </div>
              </div>

              <div class="datatable datatable--fdt" ref="fdtRef">
                <div v-if="fdtHoveredColKey" class="col-hover-line" :style="{ left: fdtHoverLineLeft + 'px' }" />

                <!-- Header row -->
                <div class="dt-row dt-row--header" :style="{ minWidth: totalFdtMinWidth + 'px' }">
                  <div v-for="col in fdtCols" :key="col.key"
                    class="dt-cell dt-cell--header"
                    :style="fdtCellStyle(col)"
                  >
                    <div class="dt-cell-inner" :class="col.align === 'right' ? 'dt-cell-inner--right' : col.align === 'center' ? 'dt-cell-inner--center' : ''">
                      <span class="dt-header-text">{{ col.label }}</span>
                    </div>
                    <div v-if="col.key !== 'stt'" class="dt-col-divider"
                      @mousedown.prevent="startFdtResize($event, col)"
                      @mouseenter="onFdtDividerEnter($event)"
                      @mouseleave="onFdtDividerLeave"
                    ></div>
                  </div>
                  <div class="dt-cell dt-cell--header" style="width:48px;flex-shrink:0"></div>
                </div>

                <!-- Body rows -->
                <div v-for="(row, ri) in formDetailRows" :key="ri" class="dt-row dt-row--body" :style="{ minWidth: totalFdtMinWidth + 'px' }">
                  <div class="dt-cell" :style="fdtCellStyle(fdtCols[0])">
                    <div class="dt-cell-inner dt-cell-inner--center"><span class="dt-text">{{ ri + 1 }}</span></div>
                  </div>
                  <div class="dt-cell" :style="fdtCellStyle(fdtCols[1])">
                    <div class="dt-cell-inner"><input class="dt-inline-input" v-model="row.maHang" placeholder="Mã hàng..." /></div>
                  </div>
                  <div class="dt-cell" :style="fdtCellStyle(fdtCols[2])">
                    <div class="dt-cell-inner"><input class="dt-inline-input" v-model="row.tenHang" placeholder="Tên hàng..." /></div>
                  </div>
                  <div class="dt-cell" :style="fdtCellStyle(fdtCols[3])">
                    <div class="dt-cell-inner">
                      <select class="dt-inline-select" v-model="row.kho">
                        <option value="">--</option>
                        <option>Kho 1</option><option>Kho 2</option><option>Kho 3</option>
                      </select>
                    </div>
                  </div>
                  <div class="dt-cell" :style="fdtCellStyle(fdtCols[4])">
                    <div class="dt-cell-inner"><input class="dt-inline-input" v-model="row.tkTien" /></div>
                  </div>
                  <div class="dt-cell" :style="fdtCellStyle(fdtCols[5])">
                    <div class="dt-cell-inner"><input class="dt-inline-input" v-model="row.tkDT" /></div>
                  </div>
                  <div class="dt-cell" :style="fdtCellStyle(fdtCols[6])">
                    <div class="dt-cell-inner">
                      <select class="dt-inline-select" v-model="row.dvt">
                        <option value="">--</option>
                        <option>Hộp</option><option>Lọ</option><option>Kg</option><option>Cái</option><option>Bộ</option>
                      </select>
                    </div>
                  </div>
                  <div class="dt-cell" :style="fdtCellStyle(fdtCols[7])">
                    <div class="dt-cell-inner dt-cell-inner--right"><input class="dt-inline-input dt-inline-input--right" v-model="row.soLuong" placeholder="0" /></div>
                  </div>
                  <div class="dt-cell" :style="fdtCellStyle(fdtCols[8])">
                    <div class="dt-cell-inner dt-cell-inner--right"><input class="dt-inline-input dt-inline-input--right" v-model="row.donGia" placeholder="0" /></div>
                  </div>
                  <div class="dt-cell" :style="fdtCellStyle(fdtCols[9])">
                    <div class="dt-cell-inner dt-cell-inner--right">
                      <span class="dt-text" style="font-weight:var(--fw-semibold)">0</span>
                    </div>
                  </div>
                  <div class="dt-cell" :style="fdtCellStyle(fdtCols[10])">
                    <div class="dt-cell-inner dt-cell-inner--right"><input class="dt-inline-input dt-inline-input--right" v-model="row.pctThue" placeholder="0" /></div>
                  </div>
                  <div class="dt-cell" :style="fdtCellStyle(fdtCols[11])">
                    <div class="dt-cell-inner dt-cell-inner--right"><input class="dt-inline-input dt-inline-input--right" v-model="row.tienThue" placeholder="0" /></div>
                  </div>
                  <div class="dt-cell" :style="fdtCellStyle(fdtCols[12])">
                    <div class="dt-cell-inner"><input class="dt-inline-input" v-model="row.tkThue" /></div>
                  </div>
                  <div class="dt-cell" :style="fdtCellStyle(fdtCols[13])">
                    <div class="dt-cell-inner"><input class="dt-inline-input" v-model="row.nhomHHDV" /></div>
                  </div>
                  <div class="dt-cell" :style="fdtCellStyle(fdtCols[14])">
                    <div class="dt-cell-inner dt-cell-inner--right"><input class="dt-inline-input dt-inline-input--right" v-model="row.chiPhi" placeholder="0" /></div>
                  </div>
                  <div class="dt-cell" :style="fdtCellStyle(fdtCols[15])">
                    <div class="dt-cell-inner dt-cell-inner--right"><input class="dt-inline-input dt-inline-input--right" v-model="row.giaTriNK" placeholder="0" /></div>
                  </div>
                  <div class="dt-cell" :style="fdtCellStyle(fdtCols[16])">
                    <div class="dt-cell-inner"><input class="dt-inline-input" v-model="row.soLo" /></div>
                  </div>
                  <div class="dt-cell" :style="fdtCellStyle(fdtCols[17])">
                    <div class="dt-cell-inner"><input class="dt-inline-input" v-model="row.hanSD" placeholder="dd/mm/yyyy" /></div>
                  </div>
                  <div class="dt-cell" :style="fdtCellStyle(fdtCols[18])">
                    <div class="dt-cell-inner">
                      <select class="dt-inline-select" v-model="row.congTrinh">
                        <option value="">--</option>
                        <option>CT001 - Dự án A</option>
                        <option>CT002 - Dự án B</option>
                        <option>CT003 - Nhà máy Bắc</option>
                        <option>CT004 - Văn phòng HN</option>
                      </select>
                    </div>
                  </div>
                  <div class="dt-cell dt-cell--actions" style="width:48px;flex-shrink:0">
                    <div class="row-actions">
                      <button class="btn-icon btn-icon--sm btn-icon--outline btn-icon--danger" title="Xóa dòng" @click="formDetailRows.splice(ri,1)"><TIcon name="trash" /></button>
                    </div>
                  </div>
                </div>
              </div><!-- /datatable--fdt -->

              <!-- Toolbar below table -->
              <div class="fdt-tools">
                <button class="btn btn--outline btn--neutral" @click="formDetailRows.push({maHang:'',tenHang:'',kho:'',tkTien:'',tkDT:'',dvt:'',soLuong:'',donGia:''})">
                  <TIcon name="plus" />Thêm dòng
                </button>
                <button class="btn-icon btn-icon--outline btn-icon--danger" title="Xóa dòng"><TIcon name="trash" /></button>
                <DropdownMenu :items="fdtMoreItems" placement="bottom-start" :min-width="160">
                  <template #trigger="{ toggle }">
                    <button class="btn-icon btn-icon--outline" @click.stop="toggle"><TIcon name="dots" /></button>
                  </template>
                </DropdownMenu>
              </div>

              <!-- Table summary -->
              <div class="fdt-summary">
                <div class="fdt-sum-row">
                  <span class="fdt-sum-lbl">Tổng tiền hàng</span>
                  <span class="fdt-sum-val">0</span>
                </div>
                <div class="fdt-sum-row">
                  <span class="fdt-sum-lbl">Thuế GTGT</span>
                  <span class="fdt-sum-val">0</span>
                </div>
                <div class="fdt-sum-row fdt-sum-row--total">
                  <span class="fdt-sum-lbl">Tổng tiền thanh toán</span>
                  <span class="fdt-sum-val">0</span>
                </div>
              </div>
            </div><!-- /fdt -->

            <!-- Below table -->
            <div class="fbtm">
              <div class="fbtm-check" @click.stop>
                <AppCheckbox v-model="formData.laHoaDonThayThe" />
                <span class="fbtm-lbl">Là hóa đơn thay thế</span>
              </div>
              <div class="fbtm-attach">
                <label class="ff-lbl">Đính kèm</label>
                <div class="fbtm-dropzone">
                  <TIcon name="paperclip" />
                  <span>Chọn file hoặc kéo thả vào đây</span>
                </div>
              </div>
            </div>

          </div><!-- /form-content thu-chi-tien -->

          <div class="form-content form-content--empty" v-else>
            <span class="text-hint">Nội dung tab đang phát triển</span>
          </div>
        </div><!-- /form-main -->

        <!-- Right sidebar -->
        <div class="form-aside">
          <div class="faside-card">
            <div class="faside-card__head">
              <span class="faside-card__title">Đã cấp mã</span>
              <span class="faside-badge faside-badge--success">Đã cấp</span>
            </div>
            <div class="faside-row">
              <span class="faside-key">Mã CQT</span>
              <span class="faside-val" style="color:var(--text-link)">01GTGT/001</span>
            </div>
            <div class="faside-row">
              <span class="faside-key">Ký hiệu</span>
              <span class="faside-val">C26TAA</span>
            </div>
            <div class="faside-row">
              <span class="faside-key">Số hóa đơn</span>
              <span class="faside-val">0000121</span>
            </div>
          </div>

          <div class="faside-total">
            <div class="faside-tot-row">
              <span class="faside-tot-lbl">Tổng tiền hàng</span>
              <span class="faside-tot-val">0</span>
            </div>
            <div class="faside-tot-row">
              <span class="faside-tot-lbl">Thuế GTGT</span>
              <span class="faside-tot-val">0</span>
            </div>
            <div class="divider-h" style="margin: 6px 0"></div>
            <div class="faside-tot-row faside-tot-row--main">
              <span class="faside-tot-lbl">Tổng tiền thanh toán</span>
              <span class="faside-tot-main">0</span>
            </div>
          </div>
        </div>
      </div><!-- /form-body -->

      <!-- Form Footer -->
      <div class="form-ft">
        <div class="form-ft__left">
          <button class="btn btn--outline btn--neutral">Hiển thị tài khoản <TIcon name="chevron-down" /></button>
        </div>
        <div class="form-ft__right">
          <button class="btn btn--outline btn--neutral" @click="showAddForm = false">Hủy</button>
          <button class="btn btn--outline btn--neutral">Lưu</button>
          <div class="btn-split">
            <button class="btn btn--primary">Lưu &amp; In</button>
            <button class="btn btn--primary btn-split__arrow"><TIcon name="chevron-down" /></button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import ControlHeader       from '@mds/components/ControlHeader.vue'
import AppSidebar          from '@mds/components/AppSidebar.vue'
import TIcon               from '@mds/components/TIcon.vue'
import TableHeader         from '@mds/components/TableHeader.vue'
import DropdownMenu        from '@mds/components/DropdownMenu.vue'
import AppCheckbox         from '@mds/components/AppCheckbox.vue'
import CollapseExpandPanel from '@mds/components/CollapseExpandPanel.vue'
import TablePaging         from '@mds/components/TablePaging.vue'

const router = useRouter()

/* ── Nav ── */
const navItems = [
  { id: 'ban-lam-viec',  icon: 'home',               label: 'Tổng quan' },
  { id: 'tien-mat',      icon: 'cash',               label: 'Tiền mặt' },
  { id: 'tien-gui',      icon: 'building-bank',      label: 'Tiền gửi' },
  { id: 'mua-hang',      icon: 'package',            label: 'Mua hàng' },
  { id: 'ban-hang',      icon: 'shopping-cart',      label: 'Bán hàng' },
  { id: 'hd-dien-tu',    icon: 'file-check',         label: 'Kết nối HĐ điện tử' },
  { id: 'kho',           icon: 'building-warehouse', label: 'Kho' },
  { id: 'cong-cu',       icon: 'tool',               label: 'Công cụ dụng cụ' },
  { id: 'tien-luong',    icon: 'users',              label: 'Tiền lương' },
  { id: 'thue',          icon: 'file-invoice',       label: 'Thuế' },
  { id: 'bao-cao',       icon: 'chart-bar',          label: 'Báo cáo' },
  { id: 'kt-dich-vu',    icon: 'book',               label: 'Kế toán dịch vụ' },
  { id: 'danh-muc',      icon: 'file-text',          label: 'Danh mục' },
  { id: 'so-du-ban-dau', icon: 'coin',               label: 'Số dư ban đầu' },
]

function onNav(id) {
  if (id === 'ban-lam-viec') router.push('/ketoan-dashboard')
  if (id === 'tien-mat')     router.push('/tien-mat')
  if (id === 'tien-gui')     router.push('/tien-gui')
}

/* ── Tabs ── */
const tabs = [
  { id: 'quy-trinh',    label: 'Quy trình' },
  { id: 'bieu-do',      label: 'Biểu đồ' },
  { id: 'bao-gia',      label: 'Báo giá' },
  { id: 'don-dat-hang', label: 'Đơn đặt hàng' },
  { id: 'hop-dong',     label: 'Hợp đồng bán hàng' },
  { id: 'ban-hang',     label: 'Bán hàng' },
  { id: 'hoa-don',      label: 'Hóa đơn' },
  { id: 'tu-dong-ht',   label: 'Tự động hạch toán HĐ', badge: 'MS' },
  { id: 'tra-lai',      label: 'Trả lại hàng bán' },
  { id: 'giam-gia',     label: 'Giảm giá hàng bán' },
  { id: 'de-nghi-xhd',  label: 'Đề nghị xuất hóa đơn' },
  { id: 'bao-cao',      label: 'Báo cáo' },
  { id: 'de-nghi-tl',   label: 'Đề nghị trả lại hàng bán' },
  { id: 'cong-no',      label: 'Công nợ' },
  { id: 'thu-no',       label: 'Thu nợ' },
  { id: 'khach-hang',   label: 'Khách hàng' },
  { id: 'hang-hoa',     label: 'Hàng hóa, dịch vụ' },
]
const activeTab  = ref('ban-hang')
const detailOpen = ref(false)

/* ── Table state ── */
const searchQuery = ref('')
const pageSize    = ref(20)
const currentPage = ref(1)
const detailPage  = ref(1)
const selected    = ref([])
const selectAll   = computed({
  get: () => filteredRows.value.length > 0 && selected.value.length === filteredRows.value.length,
  set: (val) => { selected.value = val ? filteredRows.value.map((_, i) => i) : [] }
})
const activeRow    = ref(null)
const detailHeight = ref(300)

/* ── Main columns ── */
const columns = [
  { key: 'ngayHT',   label: 'Ngày hạch toán',        width: 112 },
  { key: 'soCT',     label: 'Số chứng từ',            width: 112 },
  { key: 'soHD',     label: 'Số hóa đơn',             width: 100 },
  { key: 'kh',       label: 'Khách hàng',             flex: true, minWidth: 220 },
  { key: 'tongTien', label: 'Tổng tiền thanh toán',   width: 160, align: 'right' },
  { key: 'ttLapHD',  label: 'TT lập hóa đơn',        width: 120 },
  { key: 'ttTT',     label: 'TT thanh toán',          width: 135 },
  { key: 'ttXH',     label: 'TT xuất hàng',           width: 110 },
  { key: 'cukcuk',   label: 'Số chứng từ CUKCUK',     width: 148 },
  { key: 'eshop',    label: 'Số chứng từ eShop',      width: 140 },
]

const ACTION_WIDTH    = 140
const lastColKey      = columns[columns.length - 1].key
const colWidths       = ref(Object.fromEntries(columns.map(c => [c.key, c.width ?? c.minWidth ?? 100])))
const resizedFlexCols = ref({})

const totalRowMinWidth = computed(() =>
  44 + columns.reduce((sum, col) => {
    const extra = col.key === lastColKey ? ACTION_WIDTH : 0
    return sum + (colWidths.value[col.key] ?? 0) + extra
  }, 0)
)

function cellStyle(col) {
  const extra = col.key === lastColKey ? ACTION_WIDTH : 0
  if (col.flex && !resizedFlexCols.value[col.key]) {
    const s = { flex: 1, minWidth: colWidths.value[col.key] + 'px', overflow: 'hidden' }
    if (extra) s.paddingRight = extra + 'px'
    return s
  }
  return { width: colWidths.value[col.key] + extra + 'px', flexShrink: 0 }
}

function selectRow(i) { activeRow.value = i; detailOpen.value = true }

function startPanelResize(e) {
  e.preventDefault()
  const startY = e.clientY; const startH = detailHeight.value
  function onMove(ev) { detailHeight.value = Math.max(80, startH - (ev.clientY - startY)) }
  function onUp()     { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
  document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp)
}

/* ── Column resize (main) ── */
const datatableRef     = ref(null)
const hoveredColKey    = ref(null)
const colHoverLineLeft = ref(0)

function startResize(e, col) {
  e.preventDefault()
  hoveredColKey.value = null
  const startX = e.clientX; const extra = col.key === lastColKey ? ACTION_WIDTH : 0
  let startW
  if (col.flex && !resizedFlexCols.value[col.key]) {
    startW = e.currentTarget.parentElement.getBoundingClientRect().width - extra
    colWidths.value[col.key] = Math.round(startW); resizedFlexCols.value[col.key] = true
  } else { startW = colWidths.value[col.key] }
  function onMove(ev) { colWidths.value[col.key] = Math.max(60, startW + ev.clientX - startX) }
  function onUp()     { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
  document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp)
}
function onDividerEnter(e) {
  const divRect = e.currentTarget.getBoundingClientRect()
  const tblRect = datatableRef.value.getBoundingClientRect()
  colHoverLineLeft.value = divRect.left + 4 - tblRect.left; hoveredColKey.value = true
}
function onDividerLeave() { hoveredColKey.value = null }

onMounted(() => {
  nextTick(() => {
    if (!datatableRef.value) return
    const fixedSum = 44 + ACTION_WIDTH + columns.reduce((s, c) => c.flex ? s : s + (colWidths.value[c.key] ?? 0), 0)
    const available = datatableRef.value.clientWidth - fixedSum
    columns.filter(c => c.flex).forEach(c => {
      colWidths.value[c.key] = Math.max(c.minWidth ?? 100, available)
      resizedFlexCols.value[c.key] = true
    })
  })
})

/* ── Detail columns ── */
const detailCols = [
  { key: 'stt',     label: '#',                       width: 44,  align: 'center' },
  { key: 'maHang',  label: 'Mã hàng',                 width: 100 },
  { key: 'tenHang', label: 'Tên hàng',                flex: true, minWidth: 160 },
  { key: 'hangKM',  label: 'Hàng khuyến mại',         width: 120, align: 'center' },
  { key: 'ckTM',    label: 'Chiết khấu TM',           width: 120, align: 'center' },
  { key: 'tkCN',    label: 'TK công nợ',              width: 90 },
  { key: 'tkDT',    label: 'TK doanh thu',            width: 100 },
  { key: 'dvt',     label: 'DVT',                     width: 60 },
  { key: 'soLuong', label: 'Số lượng',                width: 90,  align: 'right' },
  { key: 'donGia',  label: 'Đơn giá',                 width: 120, align: 'right' },
  { key: 'thanhTien', label: 'Thành tiền',            width: 120, align: 'right' },
  { key: 'dtg',     label: 'Đối tượng',               width: 90 },
  { key: 'tenDtg',  label: 'Tên đối tượng',           width: 150 },
  { key: 'tyLeCK',  label: 'Tỷ lệ CK (%)',            width: 90,  align: 'right' },
  { key: 'tienCK',  label: 'Tiền chiết khấu',         width: 120, align: 'right' },
]

const detailColWidths       = ref(Object.fromEntries(detailCols.map(c => [c.key, c.width ?? c.minWidth ?? 80])))
const detailResizedFlexCols = ref({})

const totalDetailMinWidth = computed(() =>
  detailCols.reduce((sum, col) => sum + (detailColWidths.value[col.key] ?? 0), 0)
)
function detailCellStyle(col) {
  if (col.flex && !detailResizedFlexCols.value[col.key])
    return { flex: 1, minWidth: detailColWidths.value[col.key] + 'px', overflow: 'hidden' }
  return { width: detailColWidths.value[col.key] + 'px', flexShrink: 0 }
}

/* ── Column resize (detail) ── */
const detailTableRef      = ref(null)
const detailHoveredColKey = ref(null)
const detailHoverLineLeft = ref(0)

function startDetailResize(e, col) {
  e.preventDefault(); detailHoveredColKey.value = null
  const startX = e.clientX
  let startW
  if (col.flex && !detailResizedFlexCols.value[col.key]) {
    startW = e.currentTarget.parentElement.getBoundingClientRect().width
    detailColWidths.value[col.key] = Math.round(startW); detailResizedFlexCols.value[col.key] = true
  } else { startW = detailColWidths.value[col.key] }
  function onMove(ev) { detailColWidths.value[col.key] = Math.max(40, startW + ev.clientX - startX) }
  function onUp()     { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
  document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp)
}
function onDetailDividerEnter(e) {
  const divRect = e.currentTarget.getBoundingClientRect()
  const tblRect = detailTableRef.value.getBoundingClientRect()
  detailHoverLineLeft.value = divRect.left + 4 - tblRect.left; detailHoveredColKey.value = true
}
function onDetailDividerLeave() { detailHoveredColKey.value = null }

/* ── Dropdown items ── */
const bulkMoreItems = [
  { id: 'ghi-so',   icon: 'file-check',  label: 'Ghi sổ hàng loạt' },
  { id: 'in-ct',    icon: 'file-export', label: 'In chứng từ' },
  { separator: true },
  { id: 'xoa',      icon: 'trash',       label: 'Xóa' },
]
const moreItems = [
  { id: 'import', icon: 'file-import', label: 'Nhập khẩu từ Excel' },
  { separator: true },
  { id: 'print',  icon: 'printer',     label: 'In danh sách' },
]
const rowMoreItems = [
  { id: 'copy',     icon: 'copy',         label: 'Sao chép' },
  { id: 'lap-hd',   icon: 'file-invoice', label: 'Lập hóa đơn' },
  { separator: true },
  { id: 'print',    icon: 'file-export',  label: 'In chứng từ' },
]

/* ── Main data ── */
const rows = [
  { ghiSo: true,  ngayHT: '04/06/2026', soCT: 'BH00420',   soHD: '',    kh: 'Công ty TNHH Xây dựng Phúc Khang (Demo)',                   tongTien: '88.074.000',           ttLapHD: 'Chưa lập', ttTT: 'Chưa thanh toán', ttXH: 'Chưa xuất',  cukcuk: '', eshop: '' },
  { ghiSo: true,  ngayHT: '04/06/2026', soCT: 'BH00405',   soHD: '',    kh: 'Công ty TNHH May mặc Phúc Hưng (Demo)',                     tongTien: '129.816.000',          ttLapHD: 'Chưa lập', ttTT: 'Chưa thanh toán', ttXH: 'Đã xuất đủ', cukcuk: '', eshop: '' },
  { ghiSo: false, ngayHT: '03/06/2026', soCT: 'BH00418',   soHD: '',    kh: 'Phan Thị Thu Hà (Demo)',                                     tongTien: '5.184.000',            ttLapHD: 'Chưa lập', ttTT: 'Chưa thanh toán', ttXH: 'Đã xuất 1 phần', cukcuk: '', eshop: '' },
  { ghiSo: true,  ngayHT: '03/06/2026', soCT: 'BH00412',   soHD: '',    kh: 'Công ty TNHH Sản xuất Cơ khí Hoàng Long (Demo)',            tongTien: '45.003.600',           ttLapHD: 'Chưa lập', ttTT: 'Chưa thanh toán', ttXH: 'Chưa xuất',  cukcuk: '', eshop: '' },
  { ghiSo: false, ngayHT: '01/06/2026', soCT: 'BH00423',   soHD: '',    kh: 'Công ty TNHH Vận tải và Thương mại Bình Minh (Demo)',       tongTien: '77.760.000',           ttLapHD: 'Chưa lập', ttTT: 'Chưa thanh toán', ttXH: 'Đã xuất 1 phần', cukcuk: '', eshop: '' },
  { ghiSo: true,  ngayHT: '01/06/2026', soCT: 'BH00029',   soHD: '',    kh: 'Lê Quỳnh Hoa (Demo)',                                        tongTien: '1.192.400',            ttLapHD: 'Đã lập',   ttTT: 'Chưa thanh toán', ttXH: 'Chưa xuất',  cukcuk: '', eshop: '' },
  { ghiSo: true,  ngayHT: '01/06/2026', soCT: 'BH00018',   soHD: '',    kh: 'Công ty TNHH Sản xuất Cơ khí Nam Thành (Demo)',             tongTien: '16.478.000',           ttLapHD: 'Đã lập',   ttTT: 'Chưa thanh toán', ttXH: 'Đã xuất đủ', cukcuk: '', eshop: '' },
  { ghiSo: true,  ngayHT: '31/05/2026', soCT: 'NTTK00100', soHD: '',    kh: 'Công ty TNHH Đầu tư và Thương mại Hòa Bình (Demo)',         tongTien: '26.003.760.000',       ttLapHD: 'Chưa lập', ttTT: 'Đã thanh toán',   ttXH: 'Đã xuất đủ', cukcuk: '', eshop: '' },
  { ghiSo: true,  ngayHT: '31/05/2026', soCT: 'BH00079',   soHD: '121', kh: 'Công ty Cổ phần Sản xuất và Thương mại Việt Long (Demo)',   tongTien: '951.500.000',          ttLapHD: 'Đã lập',   ttTT: 'Đã thanh toán',   ttXH: 'Chưa xuất',  cukcuk: '', eshop: '' },
  { ghiSo: true,  ngayHT: '31/05/2026', soCT: 'BH00017',   soHD: '',    kh: 'Công ty TNHH Thương mại và Dịch vụ Thiên Thanh (Demo)',     tongTien: '8.239.000',            ttLapHD: 'Đã lập',   ttTT: 'Chưa thanh toán', ttXH: 'Đã xuất đủ', cukcuk: '', eshop: '' },
  { ghiSo: false, ngayHT: '29/05/2026', soCT: 'BH00383',   soHD: '',    kh: 'Công ty TNHH Điện tử Minh Quân (Demo)',                     tongTien: '57.078.000',           ttLapHD: 'Chưa lập', ttTT: 'Chưa thanh toán', ttXH: 'Đã xuất 1 phần', cukcuk: '', eshop: '' },
  { ghiSo: true,  ngayHT: '29/05/2026', soCT: 'BH00377',   soHD: '',    kh: 'Công ty TNHH Đầu tư và Phát triển Hòa Phát (Demo)',        tongTien: '56.700.000',           ttLapHD: 'Chưa lập', ttTT: 'Chưa thanh toán', ttXH: 'Chưa xuất',  cukcuk: '', eshop: '' },
  { ghiSo: true,  ngayHT: '28/05/2026', soCT: 'BH00389',   soHD: '',    kh: 'Công ty TNHH Xây dựng và Thương mại Phước An (Demo)',      tongTien: '10.935.000',           ttLapHD: 'Chưa lập', ttTT: 'Chưa thanh toán', ttXH: 'Đã xuất đủ', cukcuk: '', eshop: '' },
  { ghiSo: true,  ngayHT: '28/05/2026', soCT: 'BH00380',   soHD: '',    kh: 'Công ty TNHH Dịch vụ Vận tải Đông Dương (Demo)',           tongTien: '37.800.000',           ttLapHD: 'Chưa lập', ttTT: 'Chưa thanh toán', ttXH: 'Đã xuất đủ', cukcuk: '', eshop: '' },
  { ghiSo: true,  ngayHT: '28/05/2026', soCT: 'BH00351',   soHD: '',    kh: 'Công ty TNHH Công nghệ Nam Hải (Demo)',                     tongTien: '2.980.800',            ttLapHD: 'Chưa lập', ttTT: 'Chưa thanh toán', ttXH: 'Chưa xuất',  cukcuk: '', eshop: '' },
  { ghiSo: true,  ngayHT: '27/05/2026', soCT: 'BH00392',   soHD: '',    kh: 'Công ty TNHH Dịch vụ và Đầu tư Ánh Dương (Demo)',         tongTien: '116.640.000',          ttLapHD: 'Chưa lập', ttTT: 'Chưa thanh toán', ttXH: 'Đã xuất đủ', cukcuk: '', eshop: '' },
  { ghiSo: true,  ngayHT: '27/05/2026', soCT: 'BH00374',   soHD: '',    kh: 'Công ty TNHH Sản xuất và Thương mại Phương Nam (Demo)',    tongTien: '3.477.600',            ttLapHD: 'Chưa lập', ttTT: 'Chưa thanh toán', ttXH: 'Đã xuất đủ', cukcuk: '', eshop: '' },
  { ghiSo: true,  ngayHT: '27/05/2026', soCT: 'BH00005',   soHD: '',    kh: 'Công ty TNHH Công nghệ Xanh Việt (Demo)',                   tongTien: '16.915.800',           ttLapHD: 'Đã lập',   ttTT: 'Chưa thanh toán', ttXH: 'Chưa xuất',  cukcuk: '', eshop: '' },
  { ghiSo: true,  ngayHT: '25/05/2026', soCT: 'BH00397',   soHD: '',    kh: 'Vũ Đức Thịnh (Demo)',                                        tongTien: '7.182.000',            ttLapHD: 'Chưa lập', ttTT: 'Chưa thanh toán', ttXH: 'Đã xuất đủ', cukcuk: '', eshop: '' },
]

const filteredRows = computed(() => {
  if (!searchQuery.value) return rows
  const q = searchQuery.value.toLowerCase()
  return rows.filter(r => r.soCT.toLowerCase().includes(q) || r.kh.toLowerCase().includes(q))
})

/* ── Add form state ── */
const showAddForm = ref(false)
const formTab     = ref('thu-chi-tien')
const formTabs    = [
  { id: 'quy-trinh',        label: 'Quy trình' },
  { id: 'thu-chi-tien',     label: 'Thu chi tiền' },
  { id: 'kiem-ke',          label: 'Kiểm kê' },
  { id: 'du-bao-dong-tien', label: 'Dự báo dòng tiền' },
]
const formData = ref({
  loaiCT: 'Bán hàng',
  lapTuCT: '',
  thuTien: 'chua',
  taiKhoan: 'Tiền mặt',
  kiemPhieuXuat: false,
  lapKemHoaDon: false,
  maKH: '',
  tenKH: '',
  ngayHT: '17/06/2026',
  nguoiNop: '',
  diaChi: '',
  ngayCT: '17/06/2026',
  nvBanHang: '',
  lyDoNop: '',
  kemTheo: '',
  soPhieuThu: '',
  laHoaDonThayThe: false,
})
const formDetailRows = ref([
  { maHang: 'HH001', tenHang: 'Thịt bò Úc nhập khẩu', kho: 'Kho 1', tkTien: '131', tkDT: '5111', dvt: 'Hộp', soLuong: '60', donGia: '110.000', pctThue: '10', tienThue: '', tkThue: '33311', nhomHHDV: '', chiPhi: '', giaTriNK: '', soLo: 'L001', hanSD: '31/12/2026', congTrinh: '' },
  { maHang: 'HH002', tenHang: 'Cá hồi Nauy tươi',      kho: 'Kho 1', tkTien: '131', tkDT: '5111', dvt: 'Lọ',  soLuong: '60', donGia: '442.000', pctThue: '10', tienThue: '', tkThue: '33311', nhomHHDV: '', chiPhi: '', giaTriNK: '', soLo: 'L002', hanSD: '30/06/2026', congTrinh: '' },
  { maHang: 'HH003', tenHang: 'Rau cải xoăn Kale',     kho: 'Kho 2', tkTien: '131', tkDT: '5111', dvt: 'Kg',  soLuong: '70', donGia: '589.000', pctThue: '8',  tienThue: '', tkThue: '33311', nhomHHDV: '', chiPhi: '', giaTriNK: '', soLo: '',     hanSD: '',           congTrinh: '' },
])
const fdtMoreItems = [
  { id: 'copy-row',      icon: 'copy',         label: 'Sao chép dòng' },
  { id: 'insert-above',  icon: 'arrow-up',     label: 'Chèn dòng phía trên' },
  { separator: true },
  { id: 'import-excel',  icon: 'file-import',  label: 'Nhập từ Excel' },
]

/* ── Form detail table columns + resize ── */
const fdtCols = [
  { key: 'stt',         label: '#',                  width: 40,  min: 40,  align: 'center' },
  { key: 'maHang',      label: 'Mã hàng',            width: 108, min: 60  },
  { key: 'tenHang',     label: 'Tên hàng',           flex: true, minWidth: 120, min: 80 },
  { key: 'kho',         label: 'Kho',                width: 80,  min: 48  },
  { key: 'tkTien',      label: 'TK Tiền',            width: 72,  min: 60  },
  { key: 'tkDT',        label: 'TK doanh thu',       width: 100, min: 72  },
  { key: 'dvt',         label: 'ĐVT',                width: 56,  min: 48  },
  { key: 'soLuong',     label: 'Số lượng',           width: 84,  min: 64,  align: 'right' },
  { key: 'donGia',      label: 'Đơn giá',            width: 100, min: 64,  align: 'right' },
  { key: 'thanhTien',   label: 'Thành tiền',         width: 104, min: 72,  align: 'right' },
  { key: 'pctThue',     label: '% Thuế GTGT',        width: 84,  min: 72,  align: 'right' },
  { key: 'tienThue',    label: 'Tiền thuế GTGT',     width: 110, min: 80,  align: 'right' },
  { key: 'tkThue',      label: 'TK thuế GTGT',       width: 100, min: 72  },
  { key: 'nhomHHDV',    label: 'Nhóm HHDV mua vào',  width: 140, min: 80  },
  { key: 'chiPhi',      label: 'Chi phí mua hàng',   width: 120, min: 80,  align: 'right' },
  { key: 'giaTriNK',    label: 'Giá trị nhập kho',   width: 110, min: 80,  align: 'right' },
  { key: 'soLo',        label: 'Số lô',              width: 80,  min: 48  },
  { key: 'hanSD',       label: 'Hạn sử dụng',        width: 100, min: 72  },
  { key: 'congTrinh',   label: 'Công trình',          width: 120, min: 72  },
]
const FDT_ACTION_W      = 36
const fdtLastKey        = 'congTrinh'
const fdtColWidths      = ref(Object.fromEntries(fdtCols.map(c => [c.key, c.width ?? c.minWidth ?? 80])))
const fdtResizedFlex    = ref({})

const totalFdtMinWidth = computed(() =>
  fdtCols.reduce((sum, col) => {
    const extra = col.key === fdtLastKey ? FDT_ACTION_W : 0
    return sum + (fdtColWidths.value[col.key] ?? 0) + extra
  }, 0)
)

function fdtCellStyle(col) {
  const extra = col.key === fdtLastKey ? FDT_ACTION_W : 0
  if (col.flex && !fdtResizedFlex.value[col.key]) {
    const s = { flex: 1, minWidth: fdtColWidths.value[col.key] + 'px', overflow: 'hidden' }
    if (extra) s.paddingRight = extra + 'px'
    return s
  }
  return { width: fdtColWidths.value[col.key] + extra + 'px', flexShrink: 0 }
}

const fdtRef            = ref(null)
const fdtHoveredColKey  = ref(null)
const fdtHoverLineLeft  = ref(0)

function startFdtResize(e, col) {
  e.preventDefault(); fdtHoveredColKey.value = null
  const startX = e.clientX; const extra = col.key === fdtLastKey ? FDT_ACTION_W : 0
  let startW
  if (col.flex && !fdtResizedFlex.value[col.key]) {
    startW = e.currentTarget.parentElement.getBoundingClientRect().width - extra
    fdtColWidths.value[col.key] = Math.round(startW); fdtResizedFlex.value[col.key] = true
  } else { startW = fdtColWidths.value[col.key] }
  const onMove = ev => { fdtColWidths.value[col.key] = Math.max(col.min ?? 40, startW + ev.clientX - startX) }
  const onUp   = ()  => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
  document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp)
}
function onFdtDividerEnter(e) {
  const divRect = e.currentTarget.getBoundingClientRect()
  const tblRect = fdtRef.value.getBoundingClientRect()
  fdtHoverLineLeft.value = divRect.left + 4 - tblRect.left; fdtHoveredColKey.value = true
}
function onFdtDividerLeave() { fdtHoveredColKey.value = null }

/* ── Detail data (for row 0 — BH00420) ── */
const detailRows = [
  { stt: 1, maHang: 'HH001', tenHang: 'Thịt bò Úc',          hangKM: false, ckTM: false, tkCN: '131', tkDT: '5111', dvt: 'Hộp', soLuong: '60,00',  donGia: '110.000,00', thanhTien: '6.600.000',  dtg: 'KH0174', tenDtg: 'Công ty TNHH Xây...', tyLeCK: '0,00', tienCK: '0' },
  { stt: 2, maHang: 'HH002', tenHang: 'Cá hồi Nauy',          hangKM: false, ckTM: false, tkCN: '131', tkDT: '5111', dvt: 'Lọ',  soLuong: '60,00',  donGia: '442.000,00', thanhTien: '26.520.000', dtg: 'KH0174', tenDtg: 'Công ty TNHH Xây...', tyLeCK: '0,00', tienCK: '0' },
  { stt: 3, maHang: 'HH003', tenHang: 'Rau cải xoăn (Kale)',  hangKM: false, ckTM: false, tkCN: '131', tkDT: '5111', dvt: 'Lọ',  soLuong: '70,00',  donGia: '589.000,00', thanhTien: '41.230.000', dtg: 'KH0174', tenDtg: 'Công ty TNHH Xây...', tyLeCK: '0,00', tienCK: '0' },
  { stt: 4, maHang: 'HH004', tenHang: 'Phở bò tái',            hangKM: false, ckTM: false, tkCN: '131', tkDT: '5111', dvt: 'Lọ',  soLuong: '90,00',  donGia: '80.000,00',  thanhTien: '7.200.000',  dtg: 'KH0174', tenDtg: 'Công ty TNHH Xây...', tyLeCK: '0,00', tienCK: '0' },
]
</script>

<style scoped>
.sub-nav { border-bottom: 1px solid var(--stroke-neutral-light); background: var(--bg-white); flex-shrink: 0; }
.sub-nav__scroll { display: flex; align-items: flex-end; height: 100%; overflow-x: auto; scrollbar-width: none; }
.sub-nav__scroll::-webkit-scrollbar { display: none; }

/* Chưa ghi sổ — orange stripe + orange text, trừ status và link */
.dt-row--unghi { box-shadow: inset 3px 0 0 var(--bg-warning); }
.dt-row--unghi .dt-text { color: var(--text-warning); }
.dt-row--unghi .dt-text.dt-text--status { color: var(--text-primary); }
.dt-row--unghi .dt-text.dt-text--status.text-success  { color: var(--text-success); }
.dt-row--unghi .dt-text.dt-text--status.text-warning  { color: var(--text-warning); }
.dt-row--unghi .dt-text.dt-text--status.text-secondary { color: var(--text-secondary); }
.dt-row--unghi .dt-action-link { color: var(--text-link); }

/* Tab badge (e.g. MS) */
.tab-badge {
  display: inline-flex; align-items: center; justify-content: center;
  height: 16px; padding: 0 5px;
  font-size: 10px; font-weight: var(--fw-semibold);
  color: var(--text-white);
  background: var(--bg-success);
  border-radius: var(--radius-sm);
  margin-left: 4px;
  line-height: 1;
}

/* Filter period label */
.filter-period-label {
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
}

.content-wrapper { flex: 1; min-height: 0; display: flex; flex-direction: column; padding: 16px; position: relative; }
.table-panel     { flex: 1; min-height: 0; display: flex; flex-direction: column; }

.data-panel--master {
  flex: 1; min-height: 0; display: flex; flex-direction: column;
  background: var(--bg-white); border-radius: 8px; overflow: hidden;
}
.data-panel--detail {
  flex-shrink: 0; display: flex; flex-direction: column;
  background: var(--bg-white); border-radius: 8px; overflow: hidden;
}

.datatable         { flex: 1; min-height: 0; overflow-y: auto; }
.datatable--detail { flex: 1; min-height: 0; overflow-y: auto; height: 210px; }

/* Panel resizer */
.panel-resizer { height: 8px; flex-shrink: 0; cursor: ns-resize; display: flex; align-items: center; justify-content: center; }
.panel-resizer::after { content: ''; width: 32px; height: 3px; background: var(--stroke-neutral); border-radius: 2px; opacity: 0; transition: opacity 0.15s; }
.panel-resizer:hover::after { opacity: 1; }

.master-bottom-cep { position: absolute; bottom: 0; left: 0; right: 0; display: flex; justify-content: center; }

.detail-cep         { display: flex; justify-content: center; flex-shrink: 0; }
.detail-panel__tabs { display: flex; align-items: flex-end; flex-shrink: 0; padding: 0 4px; }
.detail-panel__tabs .sub-nav-tab { height: 36px; }

/* text- utilities (local override for status colors) */
.text-brand    { color: var(--text-brand); }
.text-secondary { color: var(--text-secondary); }
.text-success  { color: var(--text-success); }

/* ══════════════════════════════════════════════
   Full-Screen Chứng từ bán hàng Form
══════════════════════════════════════════════ */
.form-overlay {
  position: fixed; inset: 0; z-index: 1000;
  display: flex; flex-direction: column;
  background: var(--bg-page);
  overflow: hidden;
}

/* ── Form Header ── */
.form-hd {
  display: flex; align-items: center; justify-content: space-between;
  height: 56px; padding: 0 16px; flex-shrink: 0;
  background: var(--bg-white);
  border-bottom: 1px solid var(--stroke-neutral-light);
  gap: 12px;
}
.form-hd__left { display: flex; align-items: center; gap: 8px; }
.form-hd__icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: var(--radius-default);
  background: var(--bg-brand-light); color: var(--icon-brand); flex-shrink: 0;
}
.form-hd__icon .ti { font-size: 18px; }
.form-hd__title { font-size: var(--text-h3); font-weight: var(--fw-semibold); color: var(--text-primary); }
.form-hd__no {
  font-size: var(--text-body); color: var(--text-secondary);
  padding: 2px 8px; background: var(--bg-neutral-light); border-radius: var(--radius-sm);
}
.form-hd__right { display: flex; align-items: center; gap: 8px; }
.form-hd__sep   { width: 1px; height: 20px; background: var(--stroke-neutral-light); margin: 0 4px; flex-shrink: 0; }

/* ── Options Strip ── */
.form-opts {
  display: flex; align-items: center; flex-wrap: wrap; gap: 8px 12px;
  padding: 8px 16px; flex-shrink: 0;
  border-bottom: 1px solid var(--stroke-neutral-light);
}
.form-opts__group    { display: flex; align-items: center; gap: 6px; }
.fopt-label          { font-size: var(--text-body); color: var(--text-secondary); white-space: nowrap; }
.fopt-select {
  height: 28px; padding: 0 8px;
  border: 1px solid var(--stroke-neutral); border-radius: var(--radius-inner);
  font-size: var(--text-body); font-family: var(--font-family); color: var(--text-primary);
  background: var(--bg-white); outline: none; cursor: pointer; min-width: 120px;
}
.fopt-select:focus   { border-color: var(--stroke-brand); }
.form-opts__div      { width: 1px; height: 20px; background: var(--stroke-neutral-light); flex-shrink: 0; }
.form-opts__radios   { display: flex; align-items: center; gap: 12px; }
.fopt-radio          { display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: var(--text-body); }
.fopt-radio input    { width: 14px; height: 14px; accent-color: var(--bg-brand); cursor: pointer; }
.form-opts__checks   { display: flex; align-items: center; gap: 12px; }
.fopt-check          { display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: var(--text-body); }

/* ── Body layout ── */
.form-body { display: flex; flex: 1; min-height: 0; overflow: hidden; }

/* ── Main content ── */
.form-main         { display: flex; flex-direction: column; flex: 1; min-width: 0; overflow: hidden; }
.form-body-tabs    { display: flex; align-items: flex-end; flex-shrink: 0; padding: 0 16px; border-bottom: 1px solid var(--stroke-neutral-light); }
.form-content      { flex: 1; min-height: 0; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
.form-content--empty { align-items: flex-start; padding-top: 24px; color: var(--text-hint); }

/* ── Form fields grid ── */
.fgrid        { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; }
.ff           { display: flex; flex-direction: column; gap: 4px; }
.ff--span2    { grid-column: span 2; }
.ff-lbl       { font-size: var(--text-body); font-weight: var(--fw-medium); color: var(--text-secondary); }
.ff-input {
  height: var(--input-height); padding: 0 var(--input-px);
  overflow-clip-margin: 6px !important;
  border: 1px solid var(--stroke-neutral); border-radius: var(--radius-default);
  font-size: var(--text-body); font-family: var(--font-family); color: var(--text-primary);
  background: var(--bg-white); outline: none; width: 100%;
  transition: border-color 0.15s;
}
.ff-input:focus      { border-color: var(--stroke-brand); box-shadow: 0 0 0 3px var(--bg-brand-light); }
.ff-input::placeholder { color: var(--text-hint); }
.ff-refs { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; min-height: var(--input-height); }

/* ── Detail table in form ── */
.fdt {
  display: flex; flex-direction: column;
  border: 1px solid var(--stroke-neutral-light); border-radius: var(--radius-default);
  overflow: hidden; flex-shrink: 0;
}
.fdt-bar {
  display: flex; align-items: center;
  padding: 0 8px; border-bottom: 1px solid var(--stroke-neutral-light);
  background: var(--bg-white);
}
.fdt-tabs  { display: flex; align-items: flex-end; }
.fdt-tools { display: flex; align-items: center; gap: 6px; padding: 6px 8px; border-top: 1px solid var(--stroke-neutral-light); background: var(--bg-white); }

.datatable--fdt { overflow-x: auto; flex-shrink: 0; }
.datatable--fdt .dt-cell--actions .row-actions { width: 36px; }

/* Inline editable controls — text at rest, MDS input on focus */
.dt-inline-input,
.dt-inline-select {
  width: 100%; height: 28px;
  border: 1px solid transparent; border-radius: var(--radius-inner);
  outline: none; background: transparent;
  padding: 0 6px;
  font-size: var(--text-body); font-family: var(--font-family);
  color: var(--text-primary);
  transition: border-color 0.12s, background 0.12s, box-shadow 0.12s;
}
.dt-inline-input::placeholder { color: var(--text-hint); }
.dt-inline-input--right  { text-align: right; }
.dt-inline-select        { cursor: pointer; }
/* Focus: looks like MDS input / combobox */
.dt-inline-input:focus,
.dt-inline-select:focus {
  border-color: var(--stroke-brand);
  background: var(--bg-white);
  box-shadow: 0 0 0 3px var(--bg-brand-light);
}
/* Whole row highlight when any cell is being edited */
.dt-row--body:focus-within { background: #f5f8ff; }

/* Table summary */
.fdt-summary { border-top: 1px solid var(--stroke-neutral-light); }
.fdt-sum-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 6px 12px; font-size: var(--text-body);
}
.fdt-sum-row + .fdt-sum-row { border-top: 1px solid var(--stroke-neutral-light); }
.fdt-sum-row--total { font-weight: var(--fw-semibold); }
.fdt-sum-lbl { color: var(--text-secondary); }
.fdt-sum-val { color: var(--text-primary); font-feature-settings: 'tnum' 1, 'lnum' 1; }

/* ── Below-table section ── */
.fbtm          { display: flex; flex-direction: column; gap: 12px; }
.fbtm-check    { display: flex; align-items: center; gap: 8px; }
.fbtm-lbl      { font-size: var(--text-body); }
.fbtm-attach   { display: flex; flex-direction: column; gap: 6px; }
.fbtm-dropzone {
  display: flex; align-items: center; gap: 10px;
  min-height: 52px; padding: 10px 16px;
  border: 1.5px dashed var(--stroke-neutral); border-radius: var(--radius-default);
  font-size: var(--text-body); color: var(--text-secondary); cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.fbtm-dropzone:hover { border-color: var(--stroke-brand); background: var(--bg-brand-light); }
.fbtm-dropzone .ti   { font-size: 20px; color: var(--icon-neutral); flex-shrink: 0; }

/* ── Right Aside ── */
.form-aside {
  width: 300px; flex-shrink: 0;
  display: flex; flex-direction: column; gap: 12px;
  padding: 16px; overflow-y: auto;
  border-left: 1px solid var(--stroke-neutral-light);
}
.faside-card {
  border: 1px solid var(--stroke-neutral-light); border-radius: var(--radius-default);
  padding: 12px; display: flex; flex-direction: column; gap: 8px;
}
.faside-card__head   { display: flex; align-items: center; justify-content: space-between; }
.faside-card__title  { font-size: var(--text-body); font-weight: var(--fw-semibold); color: var(--text-primary); }
.faside-badge        { font-size: var(--text-sm); font-weight: var(--fw-medium); padding: 2px 8px; border-radius: var(--radius-sm); }
.faside-badge--success { background: var(--bg-success-light); color: var(--text-success); }
.faside-row          { display: flex; align-items: center; justify-content: space-between; font-size: var(--text-body); gap: 8px; }
.faside-key          { color: var(--text-secondary); flex-shrink: 0; }
.faside-val          { color: var(--text-primary); font-weight: var(--fw-medium); }
.faside-total {
  border: 1px solid var(--stroke-neutral-light); border-radius: var(--radius-default);
  padding: 12px; display: flex; flex-direction: column; gap: 6px;
}
.faside-tot-row      { display: flex; align-items: center; justify-content: space-between; font-size: var(--text-body); gap: 8px; }
.faside-tot-lbl      { color: var(--text-secondary); }
.faside-tot-val      { color: var(--text-primary); font-feature-settings: 'tnum' 1, 'lnum' 1; }
.faside-tot-row--main .faside-tot-lbl { color: var(--text-primary); font-weight: var(--fw-semibold); }
.faside-tot-main     { font-size: 18px; font-weight: var(--fw-bold); color: var(--text-primary); font-feature-settings: 'tnum' 1, 'lnum' 1; }

/* ── Form Footer ── */
.form-ft {
  display: flex; align-items: center; justify-content: space-between;
  height: 56px; padding: 0 16px; flex-shrink: 0;
  background: var(--bg-white);
  border-top: 1px solid var(--stroke-neutral-light);
}
.form-ft__left  { display: flex; align-items: center; gap: 8px; }
.form-ft__right { display: flex; align-items: center; gap: 8px; }
</style>
