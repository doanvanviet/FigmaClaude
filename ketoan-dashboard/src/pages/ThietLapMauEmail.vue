<template>
  <div class="app-shell">
    <ControlHeader app-name="Kế toán">
      <template #ai-icon><IconAvaKeToan /></template>
      <template #header-meta>
        <button class="header-company">
          Công ty cổ phần Đại Việt <TIcon name="chevron-down" />
        </button>
        <span class="header-year-badge">
          <span style="width:6px;height:6px;border-radius:50%;background:#12b76a;flex-shrink:0;box-shadow:0 0 0 1.5px white"></span>
          Dữ liệu năm 2023
        </span>
      </template>
    </ControlHeader>

    <div class="body-row">
      <AppSidebar :items="sidebarItems" active-id="mau-email" :default-expanded="true" @nav="onNav" />

      <main class="main-content">
        <div class="page-header">
          <div class="page-header__left">
            <h1 class="page-header__title h2">Thiết lập mẫu email</h1>
          </div>
        </div>

        <div class="email-studio">
          <!-- Left: Template picker -->
          <div class="tmpl-list">
            <div v-for="(t, i) in templates" :key="i"
                 class="tmpl-card"
                 :class="{ 'tmpl-card--active': selected === i }"
                 @click="selected = i; viewTab = 'preview'">
              <div class="tmpl-card__num">Mẫu {{ i + 1 }}</div>
              <div class="tmpl-card__name">{{ t.name }}</div>
              <p class="tmpl-card__desc">{{ t.description }}</p>
              <div class="tmpl-card__tags">
                <span v-for="tag in t.tags" :key="tag" class="tmpl-tag">{{ tag }}</span>
              </div>
            </div>
          </div>

          <!-- Right: Preview / Code -->
          <div class="tmpl-viewer">
            <!-- Tab bar -->
            <div class="viewer-tabs">
              <button class="sub-nav-tab" :class="{ active: viewTab === 'preview' }" @click="viewTab = 'preview'">
                Xem trước
              </button>
              <button class="sub-nav-tab" :class="{ active: viewTab === 'code' }" @click="viewTab = 'code'">
                HTML Code
              </button>
              <div style="flex:1" />
              <button class="btn btn--outline btn--neutral" style="gap:6px" @click="copyCode">
                <TIcon name="copy" />
                {{ copyOk ? 'Đã copy!' : 'Copy HTML' }}
              </button>
            </div>

            <!-- Preview -->
            <div v-show="viewTab === 'preview'" class="viewer-preview">
              <iframe :srcdoc="templates[selected].html" style="width:100%;height:100%;border:none;" />
            </div>

            <!-- Code -->
            <div v-show="viewTab === 'code'" class="viewer-code">
              <pre class="code-pre"><code>{{ templates[selected].html }}</code></pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppSidebar    from '@mds/components/AppSidebar.vue'
import ControlHeader from '@mds/components/ControlHeader.vue'
import IconAvaKeToan from '../components/IconAvaKeToan.vue'
import TIcon         from '@mds/components/TIcon.vue'

const router   = useRouter()
const selected = ref(0)
const viewTab  = ref('preview')
const copyOk   = ref(false)

const origin = window.location.origin
const LOGO_MISA     = `${origin}/logos/misa-logo.svg`
const LOGO_AMIS     = `${origin}/logos/misa-amis.svg`
const LOGO_QUYtrinh = `${origin}/logos/quy-trinh.svg`

/* ── Sidebar ── */
const sidebarItems = [
  { id: 'banlam',     icon: 'ti-home',              label: 'Tổng quan' },
  { id: 'tienmat',    icon: 'ti-cash',              label: 'Tiền mặt' },
  { id: 'tiengui',    icon: 'ti-building-bank',     label: 'Tiền gửi' },
  { id: 'muahang',    icon: 'ti-package',           label: 'Mua hàng' },
  { id: 'banhang',    icon: 'ti-shopping-cart',     label: 'Bán hàng' },
  { id: 'ketnoihd',   icon: 'ti-file-check',        label: 'Kết nối HĐ điện tử' },
  { id: 'kho',        icon: 'ti-building-warehouse', label: 'Kho' },
  { id: 'congcu',     icon: 'ti-tool',              label: 'Công cụ dụng cụ' },
  { id: 'tienluong',  icon: 'ti-users',             label: 'Tiền lương' },
  { id: 'thue',       icon: 'ti-file-invoice',      label: 'Thuế' },
  { id: 'baocao',     icon: 'ti-chart-bar',         label: 'Báo cáo' },
  { id: 'ketoadv',    icon: 'ti-book',              label: 'Kế toán dịch vụ' },
  { id: 'danhmuc',    icon: 'ti-list',              label: 'Danh mục' },
  { id: 'sodubandau', icon: 'ti-coin',              label: 'Số dư ban đầu' },
  { id: 'mau-email',  icon: 'ti-mail',              label: 'Thiết lập mẫu email' },
]

const NAV_ROUTES = {
  banlam: '/ketoan-dashboard',
  tienmat: '/tien-mat',
  tiengui: '/tien-gui',
  banhang: '/ban-hang',
}
function onNav(id) {
  if (NAV_ROUTES[id]) router.push(NAV_ROUTES[id])
}

async function copyCode() {
  await navigator.clipboard.writeText(templates[selected.value].html)
  copyOk.value = true
  setTimeout(() => { copyOk.value = false }, 2000)
}

/* ════════════════════════════════════════════════════════════════
   LỚP 1 — KHUNG CỐ ĐỊNH (không cần chỉnh)
   Gồm: DOCTYPE/CSS, wrapper ngoài, card, footer, disclaimer
   ════════════════════════════════════════════════════════════════ */

function _head(subject) {
  return `<!DOCTYPE html>
<html lang="vi" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${subject}</title>
  <style>
    body { margin:0; padding:0; background-color:#ecedef; -webkit-text-size-adjust:100%; }
    table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }
    img { border:0; -ms-interpolation-mode:bicubic; }
    a { color:#1570ef; }
    @media (max-width:620px) {
      .email-wrap { width:100% !important; }
      .email-card { border-radius:0 !important; }
      .email-body { padding-left:20px !important; padding-right:20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#ecedef;font-family:Inter,Arial,sans-serif;">`
}

/* Mở outer wrapper → 600px table → card td */
const _cardOpen = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td align="center" style="padding:60px 10px 0;">
  <table class="email-wrap" role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
         style="width:600px;max-width:600px;"><tr>
  <td class="email-card" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 0 2px rgba(0,0,0,0.10);">`

const _disclaimer = `
<tr><td style="padding:16px 40px 24px;">
  <p style="margin:0;font-size: 13px;font-style:italic;line-height:20px;color:#6b707a;">
    * Đây là email tự động từ hệ thống, Quý khách vui lòng không phản hồi.
  </p>
</td></tr>`

const _footer = `
<tr><td align="center" style="padding:12px 10px 32px;">
  <p style="margin:0 0 4px;font-size:12px;line-height:16px;color:#6b707a;text-align:center;">
    &copy; 1994&ndash;<span id="copy-year"></span> MISA JSC. All rights reserved.
    <script>document.getElementById('copy-year').textContent=new Date().getFullYear();<\/script>
  </p>
  <p style="margin:0 0 4px;font-size:12px;line-height:16px;color:#6b707a;text-align:center;">
    Tầng 9-11, tòa nhà Technosoft, Duy Tân, Cầu Giấy, Hà Nội
  </p>
  <p style="margin:0;font-size:12px;line-height:16px;color:#6b707a;text-align:center;">
    Website:&nbsp;<a href="https://misa.vn" style="color:#1570ef;text-decoration:none;">misa.vn</a>
    &nbsp;|&nbsp; Email:&nbsp;<a href="mailto:support@misa.com.vn" style="color:#1570ef;text-decoration:none;">support@misa.com.vn</a>
  </p>
</td></tr>`

/* Ghép toàn bộ email từ 3 phần: head + header + content */
function buildEmail(subject, header, content) {
  return `${_head(subject)}
${_cardOpen}
${header}
<table class="email-body" role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:24px 40px 0;">

<!-- ╔══════════════════════════════════════════════════════════════╗
     ║  ✏️  NỘI DUNG EMAIL — CHỈNH SỬA PHẦN NÀY KHI DÙNG MẪU   ║
     ╚══════════════════════════════════════════════════════════════╝ -->

${content}

<!-- ══════════════════════════════════════════════════════════════ -->

</td></tr>
${_disclaimer}
</table>
</td></tr>
${_footer}
</table>
</td></tr></table>
</body></html>`
}


/* ════════════════════════════════════════════════════════════════
   LỚP 2 — HEADER CỐ ĐỊNH (riêng từng loại mẫu, không đổi)
   Gồm: logo đặc trưng + banner nếu có
   Thay đổi khi muốn dùng logo / màu sắc khác cho loại email đó
   ════════════════════════════════════════════════════════════════ */

/* Mẫu 1 — Logo MISA dọc */
const HEADER_1 = `
<!-- HEADER: Logo MISA -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
  <td align="center" style="padding:24px 40px 0;">
    <img src="${LOGO_MISA}" alt="MISA" width="98" height="40"
         style="display:block;width:98px;height:40px;border:0;max-width:100%;">
  </td>
</tr></table>`

/* Mẫu 2 — Icon + chữ MISA AMIS */
const HEADER_2 = `
<!-- HEADER: MISA AMIS -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
  <td align="center" style="padding:24px 40px 0;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="vertical-align:middle;padding-right:10px;">
        <img src="${LOGO_AMIS}" width="32" height="32" alt="MISA AMIS" style="display:block;border:0;">
      </td>
      <td style="vertical-align:middle;">
        <span style="font-family:Inter,Arial,sans-serif;font-size:24px;font-weight:700;color:#10141b;white-space:nowrap;">MISA AMIS</span>
      </td>
    </tr></table>
  </td>
</tr></table>`

/* Mẫu 3 — MISA AMIS + Quy trình + banner teal */
const HEADER_3 = `
<!-- HEADER: MISA AMIS + Quy trình -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
  <td align="center" style="padding:24px 40px 0;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="vertical-align:middle;padding-right:10px;">
        <img src="${LOGO_AMIS}" width="32" height="32" alt="MISA AMIS" style="display:block;border:0;">
      </td>
      <td style="vertical-align:middle;padding-right:12px;">
        <span style="font-family:Inter,Arial,sans-serif;font-size:24px;font-weight:700;color:#10141b;white-space:nowrap;">MISA AMIS</span>
      </td>
      <td style="vertical-align:middle;padding:0 12px;">
        <div style="width:1px;height:24px;background:#ced1d6;display:inline-block;"></div>
      </td>
      <td style="vertical-align:middle;padding-left:4px;">
        <img src="${LOGO_QUYtrinh}" alt="" width="32" height="32"
             style="display:inline-block;vertical-align:middle;border:0;border-radius:8px;margin-right:8px;">
        <span style="font-family:Inter,Arial,sans-serif;font-size:20px;font-weight:600;color:#10141b;vertical-align:middle;white-space:nowrap;">Quy trình</span>
      </td>
    </tr></table>
  </td>
</tr></table>
<!-- BANNER: Teal — chỉnh tiêu đề thông báo ở đây -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;"><tr>
  <td style="background:linear-gradient(105deg,#00a2cf 21%,#3ca8c5 98%);padding:24px 40px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="vertical-align:top;width:28px;padding-right:12px;">
        <span style="font-size:20px;line-height:28px;">&#128226;</span>
      </td>
      <td style="vertical-align:middle;">
        <p style="margin:0;font-size:20px;font-weight:700;line-height:28px;color:#ffffff;">
          Phòng QHTT Thông báo đã hoàn thành việc thay đổi hệ thống/máy chủ ngày 23/04/2026 08:42
        </p>
      </td>
    </tr></table>
  </td>
</tr></table>`


/* ════════════════════════════════════════════════════════════════
   LỚP 3 — NỘI DUNG ✏️ (thay đổi theo từng lần gửi)
   Chỉ chỉnh sửa phần này khi soạn email mới
   Không cần quan tâm header / footer / khung bên ngoài
   ════════════════════════════════════════════════════════════════ */

const CONTENT_1 = `
<p style="margin:0 0 16px;font-size:14px;line-height:20px;color:#10141b;">
  Kính gửi Quý khách <strong style="font-weight:700;">Nguyễn Thị Lan Anh,</strong>
</p>
<p style="margin:0 0 16px;font-size:14px;line-height:20px;color:#10141b;">
  Đơn hàng của Quý khách đã được đặt thành công trên hệ thống MISA.
</p>
<p style="margin:0 0 4px;font-size:14px;line-height:20px;color:#10141b;">
  &bull;&nbsp; Mã đơn hàng:&nbsp;<strong style="font-weight:700;">4215348</strong>
</p>
<p style="margin:0 0 16px;font-size:14px;line-height:20px;color:#10141b;">
  &bull;&nbsp; Ngày đặt hàng:&nbsp;<strong style="font-weight:700;">02/06/2026</strong>
</p>
<p style="margin:0 0 12px;font-size:14px;line-height:20px;color:#10141b;">Chi tiết sản phẩm/dịch vụ:</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0"
       style="margin-bottom:16px;border-collapse:separate;border-spacing:0;"><tr>
  <td style="border:1px solid #99c5f7;border-radius:12px;padding:24px;">
    <p style="margin:0 0 12px;font-size: 13px;font-weight:700;line-height:20px;color:#10141b;">
      melnvoice Doanh nghiệp - Xử lý hóa đơn
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="border-bottom:1px solid #e9eaeb;"><tr>
      <td style="padding:8px 0;vertical-align:top;">
        <p style="margin:0;font-size:14px;line-height:20px;color:#10141b;">Dịch vụ phần mềm</p>
        <p style="margin:4px 0 0;font-size: 13px;line-height:20px;color:#6b707a;">1 Năm x 500.000 VND</p>
      </td>
      <td style="padding:8px 0;vertical-align:middle;text-align:right;white-space:nowrap;">
        <strong style="font-size:14px;font-weight:600;color:#10141b;">500.000 VND</strong>
      </td>
    </tr></table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="border-bottom:1px solid #e9eaeb;"><tr>
      <td style="padding:8px 0;vertical-align:top;">
        <p style="margin:0;font-size:14px;line-height:20px;color:#10141b;">MEIX-2.000</p>
        <p style="margin:4px 0 0;font-size: 13px;line-height:20px;color:#6b707a;">1 Gói x 1.190.000 VND</p>
      </td>
      <td style="padding:8px 0;vertical-align:middle;text-align:right;white-space:nowrap;">
        <strong style="font-size:14px;font-weight:600;color:#10141b;">1.190.000 VND</strong>
      </td>
    </tr></table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="padding:10px 0 0;font-size:14px;font-weight:700;color:#10141b;">Tổng tiền thanh toán</td>
      <td style="padding:10px 0 0;font-size:14px;font-weight:700;color:#10141b;text-align:right;white-space:nowrap;">
        1.690.000 VND
      </td>
    </tr></table>
  </td>
</tr></table>

<p style="margin:0 0 12px;font-size:14px;line-height:20px;color:#10141b;">
  Xem chi tiết đơn hàng và thực hiện thanh toán
</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;"><tr>
  <td>
    <a href="{{PAYMENT_URL}}"
       style="display:block;background:#245fdf;color:#ffffff;text-align:center;
              text-decoration:none;padding:10px 24px;border-radius:8px;
              font-family:Inter,Arial,sans-serif;font-size: 13px;font-weight:500;
              line-height:20px;-webkit-text-size-adjust:none;">
      &#8594;&nbsp; Thanh toán ngay
    </a>
  </td>
</tr></table>
<p style="margin:0;font-size:14px;line-height:20px;color:#10141b;">
  Cảm ơn Quý khách hàng đã tin tưởng sử dụng sản phẩm MISA.
  Kính chúc Quý khách sức khỏe và thành công!
</p>`

const CONTENT_2 = `
<p style="margin:0 0 16px;font-size:14px;line-height:20px;color:#10141b;">
  Kính gửi Quý khách: <strong style="font-weight:700;">Nguyễn Thị Lan Anh,</strong>
</p>
<p style="margin:0 0 16px;font-size:14px;line-height:20px;color:#10141b;">
  <strong style="font-weight:700;">Công ty TNHH Thủ Đô</strong>
  trân trọng mời Quý khách tham gia sử dụng
  <strong style="font-weight:700;">Nền tảng quản trị doanh nghiệp hợp nhất MISA AMIS</strong>
</p>
<p style="margin:0 0 12px;font-size:14px;line-height:20px;color:#10141b;">
  Thông tin tài khoản của Quý khách:
</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0"
       style="margin-bottom:16px;border-collapse:separate;border-spacing:0;"><tr>
  <td align="center" style="border:1px dashed #99c5f7;border-radius:12px;padding:12px 24px;">
    <p style="margin:0;font-size:14px;line-height:20px;color:#10141b;">
      Tài khoản đăng nhập:&nbsp;
      <a href="mailto:ntlanh@software.misa.com.vn"
         style="color:#1570ef;text-decoration:none;font-weight:500;">
        ntlanh@software.misa.com.vn
      </a>
    </p>
  </td>
</tr></table>

<p style="margin:0 0 12px;font-size:14px;line-height:20px;color:#10141b;">
  Mời Quý khách nhấn vào nút bên dưới để hoàn tất kích hoạt tài khoản:
</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;"><tr>
  <td>
    <a href="{{ACTIVATION_URL}}"
       style="display:block;background:#245fdf;color:#ffffff;text-align:center;
              text-decoration:none;padding:10px 24px;border-radius:8px;
              font-family:Inter,Arial,sans-serif;font-size: 13px;font-weight:500;
              line-height:20px;-webkit-text-size-adjust:none;">
      Kích hoạt ngay &nbsp;&#128072;
    </a>
  </td>
</tr></table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0"
       style="background:#eff4ff;border-radius:8px;margin-bottom:16px;"><tr>
  <td style="padding:32px;text-align:center;">
    <p style="margin:0 0 8px;font-size:20px;font-weight:700;line-height:28px;color:#10141b;text-align:center;">
      Quản lý công việc mọi lúc, mọi nơi trên di động
    </p>
    <p style="margin:0 0 20px;font-size:14px;line-height:20px;color:#10141b;text-align:center;">
      Quý khách vui lòng quét mã QR bên dưới để cài đặt
      <strong style="font-weight:700;">MISA AMIS trên điện thoại</strong>,
      giúp quản lý công việc mọi lúc, mọi nơi.
    </p>
    <img src="${origin}/logos/qr-amis-app.png" alt="QR Code tải MISA AMIS" width="155" height="155"
         style="display:block;margin:0 auto;border:0;border-radius:8px;">
  </td>
</tr></table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;"><tr>
  <td>
    <p style="margin:0 0 8px;font-size:16px;font-weight:600;line-height:22px;color:#dc6803;">Lưu ý:</p>
    <ul style="margin:0;padding-left:20px;font-size:14px;line-height:20px;color:#10141b;">
      <li style="margin-bottom:4px;">Email kích hoạt này chỉ có hiệu lực trong vòng 24 giờ.</li>
      <li>Nếu cần hỗ trợ thêm, Quý khách vui lòng liên hệ với MISA theo thông tin
        <a href="{{SUPPORT_URL}}" style="color:#1570ef;text-decoration:none;">Tại đây</a>.
      </li>
    </ul>
  </td>
</tr></table>

<p style="margin:0 0 4px;font-size:14px;line-height:20px;color:#10141b;">Trân trọng,</p>
<p style="margin:0;font-size:14px;font-weight:700;line-height:20px;color:#10141b;">Công ty Cổ phần MISA</p>`

const CONTENT_3 = `
<p style="margin:0 0 16px;font-size:14px;line-height:20px;color:#10141b;">
  Ngày hôm nay 28/04/2026 10:20, Phòng QHTT đã hoàn thành việc thay đổi hệ thống/máy chủ.
</p>
<p style="margin:0 0 12px;font-size:14px;line-height:21px;color:#10141b;">
  Setup VLAN và máy tính phục vụ phát hành sản phẩm mobile cho dự án tại TSB
</p>
<p style="margin:0 0 4px;font-size:14px;line-height:21px;color:#10141b;">
  <strong style="font-weight:700;">1. Mục đích:</strong><br>Tối ưu công tác phát hành sản phẩm MOBILE
</p><br>
<p style="margin:0 0 4px;font-size:14px;line-height:21px;color:#10141b;">
  <strong style="font-weight:700;">2. Phạm vi:</strong><br>VP/TT
</p><br>
<p style="margin:0 0 8px;font-size:14px;line-height:21px;color:#10141b;">
  <strong style="font-weight:700;">3. Báo cáo triển khai:</strong>
</p>
<ol style="margin:0 0 12px;padding-left:20px;font-size:14px;line-height:21px;color:#10141b;">
  <li style="margin-bottom:4px;">Thực hiện thay đổi hệ thống theo kế hoạch được phê duyệt.</li>
  <li style="margin-bottom:4px;">Cập nhật các tài khoản quản trị, hệ thống, người dùng phát sinh (nếu có) vào HQO-IT-FM-03.</li>
  <li style="margin-bottom:4px;">Đã cung cấp thông tin chi tiết hình thay đổi của hệ thống/mạng máy chủ cho VP/TT.</li>
  <li style="margin-bottom:4px;">Tổng hợp và ghi nhận các bài học kinh nghiệm được rút ra sau khi thực hiện (nếu có).</li>
  <li>Thực hiện rà soát, cập nhật các danh sách máy chủ, dữ liệu quan trọng vào HQO-IT-01-AP-02 và gửi lại email cho phòng QHTT.</li>
</ol>
<p style="margin:0 0 8px;font-size:14px;line-height:21px;color:#10141b;">
  <strong style="font-weight:700;">4. Báo cáo nghiệm thu hệ thống:</strong>
</p>
<ol style="margin:0 0 16px;padding-left:20px;font-size:14px;line-height:21px;color:#10141b;">
  <li style="margin-bottom:4px;">Đã nghiệm thu các hạng mục theo kế hoạch được phê duyệt.</li>
  <li>Đã đưa các hệ thống triển khai lên hệ thống giám sát để theo dõi.</li>
</ol>
<p style="margin:0 0 12px;font-size:14px;line-height:20px;color:#10141b;">
  Mọi ý kiến thắc mắc vui lòng liên hệ phòng QHTT để được giải đáp.
</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
  <td>
    <a href="{{DETAIL_URL}}"
       style="display:block;background:#00a2cf;color:#ffffff;text-align:center;
              text-decoration:none;padding:10px 24px;border-radius:8px;
              font-family:Inter,Arial,sans-serif;font-size: 13px;font-weight:500;
              line-height:20px;-webkit-text-size-adjust:none;">
      Xem chi tiết &nbsp;&#8594;
    </a>
  </td>
</tr></table>`


/* ════════════════════════════════════════════════════════════════
   LẮP RÁP — ghép 3 lớp thành HTML hoàn chỉnh
   ════════════════════════════════════════════════════════════════ */

const html1 = buildEmail('Xác nhận đặt hàng - MISA',                       HEADER_1, CONTENT_1)
const html2 = buildEmail('Kích hoạt tài khoản MISA AMIS',                   HEADER_2, CONTENT_2)
const html3 = buildEmail('Thông báo hoàn thành quy trình - MISA AMIS',      HEADER_3, CONTENT_3)

const templates = [
  {
    name: 'Đặt hàng',
    description: 'Email xác nhận đặt hàng thành công, kèm chi tiết sản phẩm và nút thanh toán.',
    tags: ['Xác nhận đơn hàng', 'Thanh toán', 'MISA Store'],
    html: html1,
  },
  {
    name: 'Kích hoạt tài khoản',
    description: 'Email mời người dùng kích hoạt tài khoản MISA AMIS, kèm QR tải app di động.',
    tags: ['Onboarding', 'Kích hoạt tài khoản', 'MISA AMIS'],
    html: html2,
  },
  {
    name: 'Thông báo quy trình',
    description: 'Email thông báo hoàn thành công việc/quy trình nội bộ, kèm báo cáo chi tiết.',
    tags: ['Thông báo nội bộ', 'Quy trình', 'Báo cáo'],
    html: html3,
  },
]
</script>

<style scoped>
/* ── Email studio layout ── */
.email-studio {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* ── Template list (left panel) ── */
.tmpl-list {
  width: 280px;
  flex-shrink: 0;
  overflow-y: auto;
  padding: 12px;
  border-right: 1px solid var(--stroke-divider);
  background: var(--bg-white);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tmpl-card {
  padding: 14px;
  border: 1px solid var(--stroke-neutral);
  border-radius: var(--radius-default);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.tmpl-card:hover {
  border-color: var(--stroke-brand);
  background: var(--bg-brand-light);
}
.tmpl-card--active {
  border-color: var(--stroke-brand);
  background: var(--bg-brand-light);
}

.tmpl-card__num {
  font-size: 11px;
  font-weight: var(--fw-semibold);
  color: var(--text-brand);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 4px;
}
.tmpl-card__name {
  font-size: 13px;
  font-weight: var(--fw-semibold);
  color: var(--text-primary);
  line-height: var(--text-body-lh);
  margin-bottom: 6px;
}
.tmpl-card__desc {
  font-size: 12px;
  line-height: 18px;
  color: var(--text-secondary);
  margin: 0 0 10px;
}
.tmpl-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.tmpl-tag {
  font-size: 11px;
  font-weight: var(--fw-medium);
  color: var(--text-brand);
  background: var(--bg-brand-light);
  border: 1px solid var(--stroke-brand-light);
  border-radius: var(--radius-sm);
  padding: 1px 6px;
}

/* ── Viewer (right panel) ── */
.tmpl-viewer {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.viewer-tabs {
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 16px;
  border-bottom: 1px solid var(--stroke-neutral-light);
  background: var(--bg-white);
  flex-shrink: 0;
  gap: 0;
}

.viewer-preview {
  flex: 1;
  overflow: hidden;
  background: #ecedef;
}

.viewer-code {
  flex: 1;
  overflow: auto;
  background: #1e1e1e;
}

.code-pre {
  margin: 0;
  padding: 20px 24px;
  font-family: 'Cascadia Code', 'Fira Code', 'Consolas', 'Courier New', monospace;
  font-size: 12px;
  line-height: 19px;
  color: #d4d4d4;
  white-space: pre;
  tab-size: 2;
}

/* ── page-header override for this page ── */
.page-header {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 16px;
  background: var(--bg-white);
  border-bottom: 1px solid var(--stroke-neutral-light);
  flex-shrink: 0;
}
.page-header__left { display: flex; align-items: center; gap: 8px; }
.page-header__title {
  font-size: var(--text-h2);
  font-weight: var(--fw-semibold);
  line-height: var(--text-h2-lh);
  color: var(--text-primary);
}
</style>
