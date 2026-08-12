<template>
  <div class="datatable" ref="tableRef" :class="{ 'datatable--editable': editable }">
    <div v-if="hoveredCol" class="col-hover-line" :style="{ left: hoverLineLeft + 'px' }" />

    <!-- Header row -->
    <div class="dt-row dt-row--header" :style="{ minWidth: totalRowMinWidth + 'px' }">
      <div
        v-for="col in visibleCols" :key="col.key"
        class="dt-cell dt-cell--header"
        :class="{
          'dt-cell--sorted': sortState[col.key],
          'dt-cell--filtered': colFilters[col.key]?.value || colFilters[col.key]?.condition === 'empty' || colFilters[col.key]?.condition === 'not-empty',
        }"
        :style="cellStyle(col)"
        @mouseenter="hoveredHeaderKey = col.key"
        @mouseleave="hoveredHeaderKey = null"
        @click="openHeaderMenu(col, $event)"
      >
        <!-- Checkbox column header: SelectAll checkbox, no menu, no filter -->
        <template v-if="col.type === 'checkbox'">
          <div class="dt-cell-inner" style="justify-content:center;padding:0" @click.stop>
            <AppCheckbox :model-value="isAllSelected" @update:model-value="toggleSelectAll" />
          </div>
        </template>
        <!-- Normal column header -->
        <template v-else>
          <div class="dt-cell-inner dt-cell-inner--header">
            <span class="dt-header-text">{{ col.label }}</span>
            <!-- Sort indicator -->
            <TIcon v-if="sortState[col.key] === 'asc'"  name="arrow-up"   class="dt-sort-icon" />
            <TIcon v-if="sortState[col.key] === 'desc'" name="arrow-down" class="dt-sort-icon" />
            <!-- Active filter dot -->
            <span v-if="colFilters[col.key]?.value || colFilters[col.key]?.condition === 'empty' || colFilters[col.key]?.condition === 'not-empty'" class="dt-filter-dot" />
          </div>
          <!-- Filter icon: hiện khi hover hoặc đang có filter -->
          <button
            v-if="!col.noFilter"
            class="dt-filter-btn"
            :class="{
              'dt-filter-btn--visible': hoveredHeaderKey === col.key || colFilters[col.key]?.value,
              'dt-filter-btn--active': colFilters[col.key]?.value || colFilters[col.key]?.condition === 'empty' || colFilters[col.key]?.condition === 'not-empty',
            }"
            title="Lọc cột"
            @click.stop="openFilter(col, $event)"
          >
            <TIcon name="filter" />
          </button>
        </template>
        <div class="dt-col-divider"
          @click.stop
          @mousedown.prevent="startResize($event, col)"
          @mouseenter="onDividerEnter($event)"
          @mouseleave="onDividerLeave"
        />
      </div>
      <!-- Placeholder to match dt-cell--actions in data rows so :not(:last-child) border works consistently -->
      <div v-if="rowActions.length" class="dt-cell dt-cell--header dt-cell--actions-ph" />
    </div>

    <!-- ── Column header context menu ── -->
    <Teleport to="body">
      <div v-if="headerMenu" class="dt-header-overlay" @click="closeHeaderMenu" />
      <div v-if="headerMenu" class="dt-header-menu"
        :style="{ top: headerMenu.y + 'px', left: headerMenu.x + 'px' }"
        @click.stop
      >
        <!-- Group 1: Sort -->
        <div class="dt-header-menu__group">
          <button class="dt-header-menu__item"
            :class="{ active: !sortState[headerMenu.col.key] }"
            @click="setSort(headerMenu.col, null)">
            <TIcon name="circle-off" /><span>Không sắp xếp</span>
            <TIcon v-if="!sortState[headerMenu.col.key]" name="check" class="dt-menu-check" />
          </button>
          <button class="dt-header-menu__item"
            :class="{ active: sortState[headerMenu.col.key] === 'asc' }"
            @click="setSort(headerMenu.col, 'asc')">
            <TIcon name="arrow-up" /><span>Tăng dần</span>
            <TIcon v-if="sortState[headerMenu.col.key] === 'asc'" name="check" class="dt-menu-check" />
          </button>
          <button class="dt-header-menu__item"
            :class="{ active: sortState[headerMenu.col.key] === 'desc' }"
            @click="setSort(headerMenu.col, 'desc')">
            <TIcon name="arrow-down" /><span>Giảm dần</span>
            <TIcon v-if="sortState[headerMenu.col.key] === 'desc'" name="check" class="dt-menu-check" />
          </button>
          <button class="dt-header-menu__item"
            :class="{ active: pinnedCols.has(headerMenu.col.key) }"
            @click="togglePin(headerMenu.col)">
            <TIcon :name="pinnedCols.has(headerMenu.col.key) ? 'pinned' : 'pinned'" /><span>Ghim cột</span>
            <TIcon v-if="pinnedCols.has(headerMenu.col.key)" name="check" class="dt-menu-check" />
          </button>
        </div>
        <!-- Group 2: Position -->
        <div class="dt-header-menu__group">
          <button v-if="pinnedCols.has(headerMenu.col.key)" class="dt-header-menu__item"
            @click="togglePin(headerMenu.col)">
            <TIcon name="pinned-off" /><span>Bỏ ghim cột</span>
          </button>
          <button class="dt-header-menu__item" @click="moveCol(headerMenu.col, 'first')">
            <TIcon name="table-column" /><span>Đặt làm cột đầu tiên</span>
          </button>
          <button class="dt-header-menu__item" @click="moveCol(headerMenu.col, 'last')">
            <TIcon name="column-insert-right" /><span>Đặt làm cột cuối cùng</span>
          </button>
          <button class="dt-header-menu__item" @click="insertCol(headerMenu.col, 'left')">
            <TIcon name="column-insert-left" /><span>Thêm cột bên trái</span>
          </button>
        </div>
        <!-- Group 3: Manage -->
        <div class="dt-header-menu__group">
          <button class="dt-header-menu__item" @click="insertCol(headerMenu.col, 'right')">
            <TIcon name="column-insert-right" /><span>Thêm cột bên phải</span>
          </button>
          <button class="dt-header-menu__item dt-header-menu__item--danger" @click="hideCol(headerMenu.col)">
            <TIcon name="column-remove" /><span>Ẩn cột</span>
          </button>
          <button class="dt-header-menu__item"
            :class="{ active: headerMenu.col.wrap === false }"
            @click="setWrap(headerMenu.col, false)">
            <TIcon name="text-wrap-disabled" /><span>Hiển thị 1 dòng</span>
          </button>
          <button class="dt-header-menu__item"
            :class="{ active: headerMenu.col.wrap === true }"
            @click="setWrap(headerMenu.col, true)">
            <TIcon name="text-wrap" /><span>Hiển thị nhiều dòng</span>
          </button>
        </div>
      </div>
    </Teleport>

    <!-- ── Column filter popover ── -->
    <Teleport to="body">
      <div v-if="filterPopover" class="dt-header-overlay" @click="closeFilter" />
      <div v-if="filterPopover" class="dt-filter-popover"
        :style="{ top: filterPopover.y + 'px', left: filterPopover.x + 'px' }"
        @click.stop @keydown.esc="closeFilter"
      >
        <div class="dt-filter-popover__field">
          <label class="dt-filter-label">Điều kiện lọc</label>
          <select class="dt-filter-select" v-model="filterDraft.condition">
            <option value="contains">Chứa</option>
            <option value="not-contains">Không chứa</option>
            <option value="equals">Bằng</option>
            <option value="not-equals">Không bằng</option>
            <option value="starts-with">Bắt đầu bằng</option>
            <option value="ends-with">Kết thúc bằng</option>
            <option value="empty">Rỗng</option>
            <option value="not-empty">Không rỗng</option>
          </select>
        </div>
        <div v-if="filterDraft.condition !== 'empty' && filterDraft.condition !== 'not-empty'"
          class="dt-filter-popover__field">
          <label class="dt-filter-label">Nhập hoặc chọn giá trị</label>
          <input
            ref="filterInputRef"
            class="dt-filter-input"
            type="text"
            v-model="filterDraft.value"
            placeholder="Nhập giá trị..."
            @keydown.enter.prevent="applyFilter"
          />
        </div>
        <div class="dt-filter-popover__footer">
          <button class="btn btn--outline btn--neutral" @click="closeFilter">Hủy</button>
          <button class="btn btn--primary" @click="applyFilter">Áp dụng</button>
        </div>
      </div>
    </Teleport>

    <!-- Data rows -->
    <template v-for="(row, i) in rows" :key="getRowId(row, i)">
      <div
        v-if="!isRowHidden(row)"
        class="dt-row dt-row--body"
        :class="[{ 'dt-row--selected': isSelected(row, i) }, rowLineClass]"
        :style="{ minWidth: totalRowMinWidth + 'px' }"
        @click="$emit('row-click', row)"
      >
        <div
          v-for="col in visibleCols" :key="col.key"
          class="dt-cell"
          :style="cellStyle(col)"
          :data-type="col.type"
        >
          <div class="dt-cell-inner" :class="alignClass(col)">

            <!-- Checkbox -->
            <template v-if="col.type === 'checkbox'">
              <div style="display:flex;align-items:center;justify-content:center;width:100%;padding:0" @click.stop>
                <AppCheckbox
                  :model-value="isSelected(row, i)"
                  @update:model-value="toggleSelect(row, i)"
                />
              </div>
            </template>

            <!-- Radio -->
            <template v-else-if="col.type === 'radio'">
              <input type="radio" class="dt-radio"
                :checked="isSelected(row, i)"
                @change.stop="$emit('update:selected', [getRowId(row, i)])"
                @click.stop />
            </template>

            <!-- Toggle switch -->
            <template v-else-if="col.type === 'toggle'">
              <div class="dt-toggle" :class="{ active: !!cellVal(row, col) }"
                @click.stop="$emit('cell-update', { row, col, value: !cellVal(row, col) })">
                <div class="dt-toggle-thumb" />
              </div>
            </template>

            <!-- Status badge -->
            <template v-else-if="col.type === 'status'">
              <template v-if="cellVal(row, col)">
                <span class="dt-status-badge"
                  :class="`dt-status-badge--${cellVal(row, col).color || 'neutral'}`">
                  {{ cellVal(row, col).label ?? cellVal(row, col) }}
                </span>
              </template>
              <span v-else class="dt-empty">–</span>
            </template>

            <!-- Tag / chip — renders AppTag, accepts string | {label,color} | [{label,color}] -->
            <template v-else-if="col.type === 'tag'">
              <template v-if="cellVal(row, col)">
                <div v-if="Array.isArray(cellVal(row, col))" class="dt-tag-group">
                  <AppTag
                    v-for="(t, ti) in cellVal(row, col)" :key="ti"
                    :label="t.label ?? String(t)"
                    :color="t.color || 'neutral'"
                  />
                </div>
                <AppTag v-else
                  :label="cellVal(row, col).label ?? String(cellVal(row, col))"
                  :color="cellVal(row, col).color || 'neutral'"
                />
              </template>
              <span v-else class="dt-empty">–</span>
            </template>

            <!-- Trend Up — value text + Tag Small success badge (Figma: arrow-up icon + %)
                 data: { value, pct } | fallback: plain value -->
            <template v-else-if="col.type === 'trend-up'">
              <template v-if="cellVal(row, col) != null">
                <span class="dt-text">{{ cellVal(row, col)?.value ?? cellVal(row, col) }}</span>
                <span v-if="cellVal(row, col)?.pct != null" class="dt-trend-badge dt-trend-badge--up">
                  <TIcon name="trending-up" />{{ cellVal(row, col).pct }}%
                </span>
              </template>
              <span v-else class="dt-empty">–</span>
            </template>

            <!-- Trend Down — value text + Tag Small danger badge (Figma: arrow-down icon + %)
                 data: { value, pct } | fallback: plain value -->
            <template v-else-if="col.type === 'trend-down'">
              <template v-if="cellVal(row, col) != null">
                <span class="dt-text">{{ cellVal(row, col)?.value ?? cellVal(row, col) }}</span>
                <span v-if="cellVal(row, col)?.pct != null" class="dt-trend-badge dt-trend-badge--down">
                  <TIcon name="trending-down" />{{ cellVal(row, col).pct }}%
                </span>
              </template>
              <span v-else class="dt-empty">–</span>
            </template>

            <!-- Progress bar -->
            <template v-else-if="col.type === 'progress'">
              <div class="dt-progress">
                <div class="dt-progress-bar"
                  :style="{ width: Math.min(100, Math.max(0, cellVal(row, col) || 0)) + '%' }" />
              </div>
              <span class="dt-progress-label">{{ cellVal(row, col) ?? 0 }}%</span>
            </template>

            <!-- Icon only -->
            <template v-else-if="col.type === 'icon'">
              <TIcon v-if="cellVal(row, col)" :name="cellVal(row, col)" />
              <span v-else class="dt-empty">–</span>
            </template>

            <!-- Icon + Text -->
            <template v-else-if="col.type === 'icon-text'">
              <TIcon v-if="cellVal(row, col)?.icon" :name="cellVal(row, col).icon" />
              <span class="dt-text">{{ cellVal(row, col)?.text ?? cellVal(row, col) ?? '–' }}</span>
            </template>

            <!-- Text + Subtext (two-line, 56px row) -->
            <template v-else-if="col.type === 'subtext'">
              <div class="dt-subtext-wrap">
                <span class="dt-text">{{ cellVal(row, col)?.text ?? cellVal(row, col) ?? '–' }}</span>
                <span v-if="cellVal(row, col)?.subtext" class="dt-subtext">{{ cellVal(row, col).subtext }}</span>
              </div>
            </template>

            <!-- Avatar (24px) + Text — Type=Avatar+Text (1-line, density-controlled) -->
            <!-- data: { avatar?: url, text } -->
            <template v-else-if="col.type === 'avatar-text'">
              <template v-if="cellVal(row, col)">
                <div class="dt-avatar"
                  :style="!cellVal(row, col).avatar ? { background: avatarColor(cellVal(row, col).text).bg, color: avatarColor(cellVal(row, col).text).fg } : {}">
                  <img v-if="cellVal(row, col).avatar" :src="cellVal(row, col).avatar" class="dt-avatar__img" :alt="cellVal(row, col).text" />
                  <span v-else class="dt-avatar__initials">{{ avatarInitials(cellVal(row, col).text) }}</span>
                </div>
                <span class="dt-text">{{ cellVal(row, col).text ?? '–' }}</span>
              </template>
              <span v-else class="dt-empty">–</span>
            </template>

            <!-- Avatar (40px) + Text + Subtext — Type=Avatar+Text+Subtext (2-line, 56px fixed) -->
            <!-- data: { avatar?: url, text, subtext } -->
            <template v-else-if="col.type === 'avatar-subtext'">
              <template v-if="cellVal(row, col)">
                <div class="dt-avatar dt-avatar--lg"
                  :style="!cellVal(row, col).avatar ? { background: avatarColor(cellVal(row, col).text).bg, color: avatarColor(cellVal(row, col).text).fg } : {}">
                  <img v-if="cellVal(row, col).avatar" :src="cellVal(row, col).avatar" class="dt-avatar__img" :alt="cellVal(row, col).text" />
                  <span v-else class="dt-avatar__initials">{{ avatarInitials(cellVal(row, col).text) }}</span>
                </div>
                <div class="dt-subtext-wrap">
                  <span class="dt-text">{{ cellVal(row, col).text ?? '–' }}</span>
                  <span v-if="cellVal(row, col).subtext" class="dt-subtext">{{ cellVal(row, col).subtext }}</span>
                </div>
              </template>
              <span v-else class="dt-empty">–</span>
            </template>

            <!-- Action icons -->
            <template v-else-if="col.type === 'action-icon'">
              <div class="dt-actions">
                <button v-for="action in (col.actions || [])" :key="action.emit ?? action.icon"
                  class="dt-action-btn" :title="action.title"
                  @click.stop="$emit(action.emit, row)">
                  <TIcon :name="action.icon" />
                </button>
              </div>
            </template>

            <!-- Action text link — 2 text links, gap 16px, right-aligned (Figma: Link Group)
                 data: col.actions = [{ label, emit }] -->
            <template v-else-if="col.type === 'action-text'">
              <div class="dt-link-group">
                <button v-for="act in (col.actions || [])" :key="act.emit ?? act.label"
                  class="dt-action-link"
                  @click.stop="$emit(act.emit, row)">
                  {{ act.label ?? '–' }}
                </button>
              </div>
            </template>

            <!-- Rating — 5 star icons 20px each, gap 4px (Figma: star icons filled/empty)
                 data: 0-5 (number) -->
            <template v-else-if="col.type === 'rating'">
              <div class="dt-rating">
                <TIcon v-for="n in 5" :key="n"
                  name="star"
                  :class="n <= Math.round(cellVal(row, col) || 0) ? 'dt-star--filled' : 'dt-star--empty'" />
              </div>
            </template>

            <!-- Group Avatar — overlapping 24px circles + "+N" overflow (Figma: AvatarGroupHorizontal)
                 data: [{ name, avatar? }] -->
            <template v-else-if="col.type === 'group-avatar'">
              <div v-if="cellVal(row, col)?.length" class="dt-avatar-group">
                <div v-for="(member, idx) in (cellVal(row, col) || []).slice(0, 5)" :key="idx"
                  class="dt-avatar dt-avatar--group" :title="member.name"
                  :style="!member.avatar ? { background: avatarColor(member.name).bg, color: avatarColor(member.name).fg } : {}">
                  <img v-if="member.avatar" :src="member.avatar" class="dt-avatar__img" :alt="member.name" />
                  <span v-else class="dt-avatar__initials">{{ avatarInitials(member.name) }}</span>
                </div>
                <div v-if="cellVal(row, col).length > 5" class="dt-avatar dt-avatar--overflow">
                  +{{ cellVal(row, col).length - 5 }}
                </div>
              </div>
              <span v-else class="dt-empty">–</span>
            </template>

            <!-- Product Logo — 32px logo + product name text 13px/500 (Figma: 56px 2-line row)
                 data: { logo, name } -->
            <template v-else-if="col.type === 'product-logo'">
              <template v-if="cellVal(row, col)">
                <img v-if="cellVal(row, col).logo" :src="cellVal(row, col).logo"
                  class="dt-product-logo" :alt="cellVal(row, col).name" />
                <span class="dt-text dt-text--medium">{{ cellVal(row, col).name ?? '–' }}</span>
              </template>
              <span v-else class="dt-empty">–</span>
            </template>

            <!-- Swap Component — placeholder slot (Figma: dashed blue border slot)
                 Developer dùng col.render(row) để inject custom content khi cần -->
            <template v-else-if="col.type === 'swap-component'">
              <component v-if="col.component" :is="col.component" :row="row" :col="col" />
              <span v-else class="dt-empty">–</span>
            </template>

            <!-- Textbox (editable input) -->
            <template v-else-if="col.type === 'textbox'">
              <input v-if="editable"
                class="dt-input" type="text"
                :value="cellVal(row, col)"
                @input.stop="$emit('cell-update', { row, col, value: $event.target.value })"
                @click.stop />
              <span v-else class="dt-text">{{ cellVal(row, col) ?? '–' }}</span>
            </template>

            <!-- Numberbox (editable, right-aligned) -->
            <template v-else-if="col.type === 'numberbox'">
              <input v-if="editable"
                class="dt-input dt-input--number" type="text"
                :value="cellVal(row, col)"
                @input.stop="$emit('cell-update', { row, col, value: $event.target.value })"
                @click.stop />
              <span v-else class="dt-text dt-text--right">{{ cellVal(row, col) ?? '–' }}</span>
            </template>

            <!-- Combobox (editable select) -->
            <template v-else-if="col.type === 'combobox'">
              <select v-if="editable"
                class="dt-select"
                :value="cellVal(row, col)"
                @change.stop="$emit('cell-update', { row, col, value: $event.target.value })"
                @click.stop>
                <option value="">–</option>
                <option v-for="opt in (col.options || [])" :key="opt.value ?? opt"
                  :value="opt.value ?? opt">
                  {{ opt.label ?? opt }}
                </option>
              </select>
              <span v-else class="dt-text">{{ cellVal(row, col) ?? '–' }}</span>
            </template>

            <!-- Default: text (read-only or editable textbox) -->
            <template v-else>
              <span class="dt-text" :class="{ 'dt-text--right': col.align === 'right' }">
                {{ cellVal(row, col) ?? '–' }}
              </span>
            </template>

          </div>
        </div>

        <!-- Sticky action column -->
        <div v-if="rowActions.length" class="dt-cell dt-cell--actions">
          <div class="row-actions">
            <button
              v-for="action in rowActions.slice(0, 3)" :key="action.emit ?? action.icon"
              class="btn-icon btn-icon--sm btn-icon--outline"
              :class="{ 'btn-icon--danger': action.danger }"
              :title="action.title"
              @click.stop="$emit(action.emit, row)"
            >
              <TIcon :name="action.icon" />
            </button>
            <DropdownMenu v-if="moreActions.length" :items="moreActions" placement="bottom-end" :min-width="160">
              <template #trigger="{ toggle }">
                <button class="btn-icon btn-icon--sm btn-icon--outline" title="Thêm thao tác" @click.stop="toggle">
                  <TIcon name="dots" />
                </button>
              </template>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </template>

    <!-- Footer row -->
    <div v-if="showFooter" class="dt-row dt-row--footer" :style="{ minWidth: totalRowMinWidth + 'px' }">
      <div
        v-for="col in visibleCols" :key="col.key"
        class="dt-cell dt-cell--footer"
        :style="cellStyle(col)"
      >
        <div class="dt-cell-inner" :class="alignClass(col)">
          <span class="dt-footer-text">{{ col.footerText ?? '' }}</span>
        </div>
      </div>
      <div v-if="rowActions.length" class="dt-cell dt-cell--footer dt-cell--actions-ph" />
    </div>

    <!-- Pagination -->
    <AppPagination
      v-if="pagination"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      :page-size-options="pageSizeOptions"
      :sums="sums"
      :sum-vertical="sumVertical"
      @update:current-page="$emit('update:currentPage', $event)"
      @update:page-size="$emit('update:pageSize', $event)"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import TIcon from './TIcon.vue'
import AppPagination from './AppPagination.vue'
import DropdownMenu from './DropdownMenu.vue'
import AppCheckbox from './AppCheckbox.vue'
import AppTag from './AppTag.vue'

const props = defineProps({
  columns:         { type: Array,   default: () => [] },
  rows:            { type: Array,   default: () => [] },
  editable:        { type: Boolean, default: false },
  selected:        { type: Array,   default: () => [] },
  showFooter:      { type: Boolean, default: false },
  rowIdKey:        { type: String,  default: 'id' },
  hideBlankRows:   { type: Boolean, default: true },
  pagination:      { type: Boolean, default: false },
  total:           { type: Number,  default: 0 },
  pageSize:        { type: Number,  default: 10 },
  currentPage:     { type: Number,  default: 1 },
  pageSizeOptions: { type: Array,   default: () => [10, 20, 50, 100] },
  sums:            { type: Array,   default: () => [] },
  sumVertical:     { type: Boolean, default: false },
  rowActions:      { type: Array,   default: () => [] }, // [{icon, title, emit}] max 3 shown
  moreActions:     { type: Array,   default: () => [] }, // [{id, icon, label, danger?, separator?}]
  lineCount:       { type: Number,  default: 1 },
})

const emit = defineEmits([
  'row-click', 'update:selected', 'cell-update',
  'update:currentPage', 'update:pageSize',
  'column-sort', 'column-filter', 'column-hide', 'column-move', 'column-insert', 'column-wrap',
])

const DATA_TYPES    = new Set([
  'text', 'subtext', 'avatar-text', 'avatar-subtext',
  'icon-text', 'icon', 'status', 'tag',
  'trend-up', 'trend-down', 'progress',
  'rating', 'group-avatar', 'product-logo', 'swap-component',
  'checkbox', 'radio', 'toggle',
  'action-icon', 'action-text',
  'textbox', 'numberbox', 'combobox',
])
const TWO_LINE_TYPES = new Set(['subtext', 'avatar-subtext', 'product-logo'])

const ACTION_WIDTH = 140

/* ── Pin / Hide state — declared before visibleCols computed ── */
const pinnedCols         = ref(new Set())
const internalHiddenCols = ref(new Set())

const visibleCols   = computed(() => {
  const cols = props.columns.filter(c => !c.hidden && !internalHiddenCols.value.has(c.key))
  // Pinned columns first, maintaining their relative order
  const pinned   = cols.filter(c => pinnedCols.value.has(c.key))
  const unpinned = cols.filter(c => !pinnedCols.value.has(c.key))
  return [...pinned, ...unpinned]
})
const lastColKey    = computed(() => props.rowActions.length ? visibleCols.value[visibleCols.value.length - 1]?.key : null)
/** Nếu bảng có cột subtext, avatar-subtext, hoặc product-logo → toàn bộ row dùng chiều cao 56px */
const has2LineCol   = computed(() => props.columns.some(c => TWO_LINE_TYPES.has(c.type)))
const rowLineClass  = computed(() => {
  if (props.lineCount >= 2) return 'dt-row--flex'
  if (props.lineCount === 1) return 'dt-row--1line'
  if (has2LineCol.value)    return 'dt-row--2line'
  return ''
})

const totalRowMinWidth = computed(() => {
  let total = 0
  for (const col of visibleCols.value) {
    const base  = colWidths.value[col.key] ?? col.width ?? 100
    const extra = col.key === lastColKey.value ? ACTION_WIDTH : 0
    total += base + extra
  }
  return total
})

function getRowId(row, i) {
  return row[props.rowIdKey] ?? i
}

function isSelected(row, i) {
  return props.selected.includes(getRowId(row, i))
}

function toggleSelect(row, i) {
  const id = getRowId(row, i)
  const cur = [...props.selected]
  const idx = cur.indexOf(id)
  if (idx >= 0) cur.splice(idx, 1)
  else cur.push(id)
  emit('update:selected', cur)
}

function cellVal(row, col) {
  return row[col.key]
}

function isRowHidden(row) {
  if (!props.hideBlankRows) return false
  const dataCols = visibleCols.value.filter(c => DATA_TYPES.has(c.type ?? 'text'))
  if (!dataCols.length) return false
  return dataCols.every(c => {
    const v = row[c.key]
    return v === null || v === undefined || v === ''
  })
}

/* ── Column resize ── */
const tableRef        = ref(null)
const colWidths       = ref({})
const resizedFlexCols = ref({})

watch(() => props.columns, (cols) => {
  const w = {}
  for (const col of cols) {
    w[col.key] = colWidths.value[col.key] ?? col.width ?? col.minWidth ?? 100
  }
  colWidths.value = w
}, { immediate: true })

function cellStyle(col) {
  const pinned = resizedFlexCols.value[col.key]
  const extra  = col.key === lastColKey.value ? ACTION_WIDTH : 0
  if (col.width || pinned) {
    return { width: (colWidths.value[col.key] ?? col.width ?? 100) + extra + 'px', flexShrink: 0 }
  }
  const style = { flex: '1 0 0', minWidth: (colWidths.value[col.key] ?? 0) + 'px', overflow: 'hidden' }
  if (extra) style.paddingRight = extra + 'px'
  return style
}

function startResize(e, col) {
  e.preventDefault()
  hoveredCol.value = null

  const startX = e.clientX
  let startW
  const isFlex = !col.width && !resizedFlexCols.value[col.key]
  const extra  = col.key === lastColKey.value ? ACTION_WIDTH : 0

  if (isFlex) {
    startW = e.currentTarget.parentElement.getBoundingClientRect().width - extra
    colWidths.value[col.key] = Math.round(startW)
    resizedFlexCols.value[col.key] = true
  } else {
    startW = colWidths.value[col.key] ?? col.width ?? 100
  }

  function onMove(ev) { colWidths.value[col.key] = Math.max(60, startW + ev.clientX - startX) }
  function onUp()     { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

/* ── Column hover line ── */
const hoveredCol   = ref(null)
const hoverLineLeft = ref(0)

function onDividerEnter(e) {
  const divRect   = e.currentTarget.getBoundingClientRect()
  const tableRect = tableRef.value.getBoundingClientRect()
  hoverLineLeft.value = divRect.left + 4 - tableRect.left
  hoveredCol.value = true
}

function onDividerLeave() { hoveredCol.value = null }

function alignClass(col) {
  if (col.align === 'right') return 'dt-cell-inner--right'
  if (col.align === 'center') return 'dt-cell-inner--center'
  return ''
}

/* ── Header hover ── */
const hoveredHeaderKey = ref(null)

/* ── Sort ── */
const sortState = ref({}) // { colKey: 'asc' | 'desc' | null }

function setSort(col, dir) {
  if (dir === null) {
    delete sortState.value[col.key]
  } else {
    sortState.value[col.key] = dir
  }
  closeHeaderMenu()
  emit('column-sort', col, dir)
}

/* ── Pin ── */
function togglePin(col) {
  const s = new Set(pinnedCols.value)
  if (s.has(col.key)) s.delete(col.key)
  else s.add(col.key)
  pinnedCols.value = s
  closeHeaderMenu()
}

/* ── Hide ── */
function hideCol(col) {
  const s = new Set(internalHiddenCols.value)
  s.add(col.key)
  internalHiddenCols.value = s
  closeHeaderMenu()
  emit('column-hide', col)
}

/* ── Move / Insert ── */
function moveCol(col, pos) {
  closeHeaderMenu()
  emit('column-move', col, pos)
}

function insertCol(col, side) {
  closeHeaderMenu()
  emit('column-insert', col, side)
}

/* ── Wrap ── */
function setWrap(col, wrap) {
  col.wrap = wrap
  closeHeaderMenu()
  emit('column-wrap', col, wrap)
}

/* ── Header context menu ── */
const headerMenu = ref(null)

/* ── SelectAll (for checkbox-type column header) ── */
const isAllSelected = computed(() => {
  const visibleRows = props.rows.filter(r => !isRowHidden(r))
  return visibleRows.length > 0 && visibleRows.every((r, i) => isSelected(r, i))
})
function toggleSelectAll(val) {
  if (val) {
    const ids = props.rows.filter(r => !isRowHidden(r)).map((r, i) => getRowId(r, i))
    emit('update:selected', ids)
  } else {
    emit('update:selected', [])
  }
}

function openHeaderMenu(col, e) {
  // Không mở menu cho cột checkbox/radio
  if (col.type === 'checkbox' || col.type === 'radio' || col.noMenu) return
  const rect = e.currentTarget.closest('.dt-cell--header').getBoundingClientRect()
  // position: fixed → dùng viewport coords trực tiếp (không cộng scrollX/Y)
  let x = rect.left
  const menuW = 220
  if (x + menuW > window.innerWidth - 8) x = rect.right - menuW
  if (x < 8) x = 8
  headerMenu.value = { col, x, y: rect.bottom + 2 }
}

function closeHeaderMenu() {
  headerMenu.value = null
}

/* ── Column filter ── */
const colFilters    = ref({})  // { colKey: { condition, value } }
const filterPopover = ref(null)
const filterDraft   = ref({ condition: 'contains', value: '' })
const filterInputRef = ref(null)

const FILTER_CONDITIONS = {
  'contains':     'Chứa',
  'not-contains': 'Không chứa',
  'equals':       'Bằng',
  'not-equals':   'Không bằng',
  'starts-with':  'Bắt đầu bằng',
  'ends-with':    'Kết thúc bằng',
  'empty':        'Rỗng',
  'not-empty':    'Không rỗng',
}

function openFilter(col, e) {
  // Load existing filter into draft
  const existing = colFilters.value[col.key]
  filterDraft.value = existing
    ? { condition: existing.condition, value: existing.value ?? '' }
    : { condition: 'contains', value: '' }

  // Position popover below the filter button
  // position: fixed → dùng viewport coords trực tiếp (không cộng scrollX/Y)
  const btn = e.currentTarget
  const rect = btn.getBoundingClientRect()
  let x = rect.left
  const popW = 280
  if (x + popW > window.innerWidth - 8) x = Math.max(8, window.innerWidth - popW - 8)
  filterPopover.value = { col, x, y: rect.bottom + 4 }

  nextTick(() => filterInputRef.value?.focus())
}

function closeFilter() {
  filterPopover.value = null
}

function applyFilter() {
  const col = filterPopover.value?.col
  if (!col) return
  const { condition, value } = filterDraft.value
  const isValueless = condition === 'empty' || condition === 'not-empty'
  if (!isValueless && !value.trim()) {
    // Clear filter if value is empty
    const f = { ...colFilters.value }
    delete f[col.key]
    colFilters.value = f
    emit('column-filter', col, null)
  } else {
    colFilters.value = { ...colFilters.value, [col.key]: { condition, value: value.trim() } }
    emit('column-filter', col, { condition, value: value.trim() })
  }
  closeFilter()
}

/** Lấy 2 ký tự đầu của tên để hiển thị trong avatar tròn */
function avatarInitials(name = '') {
  return (name || '').split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
}

/** Palette màu avatar — bg nhạt + fg đậm cùng tone, hash theo tên */
const AVATAR_PALETTE = [
  { bg: '#EFF8FF', fg: '#1570EF' }, // blue
  { bg: '#ECFDF5', fg: '#059669' }, // green
  { bg: '#FDF4FF', fg: '#9333EA' }, // purple
  { bg: '#FFF7ED', fg: '#EA580C' }, // orange
  { bg: '#F0FDFA', fg: '#0D9488' }, // teal
  { bg: '#FFF1F2', fg: '#E11D48' }, // rose
  { bg: '#EEF2FF', fg: '#4F46E5' }, // indigo
  { bg: '#FFFBEB', fg: '#D97706' }, // amber
]
function avatarColor(name = '') {
  const hash = [...(name || '')].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length]
}
</script>
