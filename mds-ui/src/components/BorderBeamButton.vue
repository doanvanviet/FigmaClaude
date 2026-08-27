<!--
  Border Beam — control dùng chung cho mọi chức năng "AI có điểm nhấn" (kỹ thuật gốc
  magicui.design/docs/components/border-beam): giữ nguyên viền xám mặc định của nút
  (do class .btn-icon--outline/.btn--outline quy định), bên trong có 1 đốm gradient
  chạy dọc viền đó (offset-path), tốc độ chậm-nhanh-chậm (ease-in-out, không đều),
  icon bên trong phập phồng nhẹ theo cùng nhịp. Dùng đúng 2 mã AI Gradient
  (#1482ff → #cf11ff) đã định nghĩa ở .btn--ai-outline — không dùng preset màu xấp xỉ
  của thư viện ngoài (đã thử @stevebauman/vue-border-beam nhưng không tuỳ biến được màu/tốc độ).

  Cách dùng (kéo ra là chạy, không cần setup gì thêm):
    <BorderBeamButton class="btn-icon btn-icon--outline" title="..." @click="...">
      <TIcon name="sparkles" />
    </BorderBeamButton>
-->
<template>
  <button class="btn--border-beam" v-bind="$attrs">
    <slot />
    <span class="border-beam-mask"><span class="border-beam"></span></span>
  </button>
</template>

<script setup>
import { onMounted } from 'vue'

defineOptions({ inheritAttrs: false })

// Tự inject 1 lần definition <linearGradient id="ai-icon-gradient"> vào document —
// app dùng component này không cần khai báo gì thêm ở App.vue.
onMounted(() => {
  if (document.getElementById('ai-icon-gradient')) return
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '0')
  svg.setAttribute('height', '0')
  svg.setAttribute('style', 'position:absolute')
  svg.setAttribute('aria-hidden', 'true')
  svg.innerHTML = `
    <defs>
      <linearGradient id="ai-icon-gradient" x1="0%" y1="0%" x2="100%" y2="35%">
        <stop offset="8.87%" stop-color="#1482ff" />
        <stop offset="100%" stop-color="#cf11ff" />
      </linearGradient>
    </defs>
  `
  document.body.appendChild(svg)
})
</script>
