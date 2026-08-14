<template>
  <div class="mds-rt" :class="rootClass">

    <!-- ── Basic mode: textarea → TinyMCE replaces with iframe editor ── -->
    <textarea v-if="mode === 'basic'" :id="editorId" />

    <!-- ── Inline mode: contenteditable div; floating toolbar on selection ── -->
    <div
      v-else
      :id="editorId"
      class="mds-rt__inline"
      :data-placeholder="placeholder"
      :contenteditable="!disabled && state !== 'disabled' && !readonly && state !== 'readonly' ? 'true' : 'false'"
    ></div>

  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue:  { type: String,  default: '' },
  mode:        { type: String,  default: 'basic' }, // 'basic' | 'inline'
  height:      { type: Number,  default: 300 },
  minHeight:   { type: Number,  default: 120 },
  placeholder: { type: String,  default: 'Nhập nội dung...' },
  disabled:    { type: Boolean, default: false },
  readonly:    { type: Boolean, default: false },
  state:       { type: String,  default: 'default' }, // default | error | warning | success | disabled | readonly
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])

const editorId = `mds-rt-${Math.random().toString(36).slice(2, 9)}`
let editorInst = null
let booting    = false

const rootClass = computed(() => ({
  'mds-rt--inline':   props.mode === 'inline',
  'mds-rt--error':    props.state === 'error',
  'mds-rt--warning':  props.state === 'warning',
  'mds-rt--success':  props.state === 'success',
  'mds-rt--disabled': props.disabled  || props.state === 'disabled',
  'mds-rt--readonly': props.readonly  || props.state === 'readonly',
}))

/* ── TinyMCE CDN (GPL license, no API key needed) ── */
const MCE_SRC  = 'https://cdn.jsdelivr.net/npm/tinymce@7/tinymce.min.js'
const MCE_BASE = 'https://cdn.jsdelivr.net/npm/tinymce@7'

function loadMCE() {
  return new Promise((resolve, reject) => {
    if (window.tinymce) { resolve(); return }
    if (document.querySelector(`script[src="${MCE_SRC}"]`)) {
      const t = setInterval(() => { if (window.tinymce) { clearInterval(t); resolve() } }, 40)
      return
    }
    const s = Object.assign(document.createElement('script'), {
      src: MCE_SRC,
      referrerPolicy: 'origin',
      onload:  resolve,
      onerror: reject,
    })
    document.head.appendChild(s)
  })
}

const TOOLBAR =
  'bold italic underline strikethrough | forecolor backcolor | ' +
  'alignleft aligncenter alignright alignjustify | ' +
  'bullist numlist | outdent indent | link | removeformat'

const CONTENT_STYLE = `
  body {
    font-family: -apple-system, "Segoe UI", sans-serif;
    font-size: 13px;
    line-height: 20px;
    color: #101828;
    margin: 10px 12px;
  }
  p { margin: 0 0 8px; }
  p:last-child { margin-bottom: 0; }
  a { color: #245fdf; }
`

async function boot() {
  if (booting || editorInst) return
  booting = true

  await loadMCE()

  const isReadonly = props.readonly || props.state === 'readonly'

  const cfg = {
    selector:      `#${editorId}`,
    base_url:      MCE_BASE,
    suffix:        '.min',
    license_key:   'gpl',
    menubar:       false,
    statusbar:     false,
    promotion:     false,
    branding:      false,
    toolbar:       TOOLBAR,
    plugins:       'lists link autolink',
    content_style: CONTENT_STYLE,
    placeholder:   props.placeholder,
    readonly:      isReadonly ? 1 : 0,
    setup(ed) {
      editorInst = ed
      ed.on('init', () => {
        if (props.modelValue) ed.setContent(props.modelValue)
        booting = false
      })
      ed.on('change input keyup paste', () => {
        emit('update:modelValue', ed.getContent())
      })
      ed.on('focus', () => emit('focus'))
      ed.on('blur',  () => emit('blur'))
    },
  }

  if (props.mode === 'basic') {
    window.tinymce.init({ ...cfg, height: props.height, min_height: props.minHeight, resize: false })
  } else {
    window.tinymce.init({ ...cfg, inline: true })
  }
}

function destroy() {
  if (editorInst) { editorInst.destroy(); editorInst = null }
}

onMounted(() => nextTick(boot))
onBeforeUnmount(destroy)

watch(() => props.modelValue, (val) => {
  if (editorInst && !editorInst.hasFocus() && editorInst.getContent() !== val) {
    editorInst.setContent(val || '')
  }
})
</script>

<style scoped>
/* ── Root wrapper ── */
.mds-rt { position: relative; width: 100%; }

/* ── BASIC MODE — override TinyMCE container ── */
.mds-rt :deep(.tox-tinymce) {
  border: 1px solid var(--stroke-neutral) !important;
  border-radius: var(--radius-default) !important;
  box-shadow: none !important;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.mds-rt:focus-within :deep(.tox-tinymce) {
  border-color: var(--stroke-brand) !important;
  box-shadow: 0 0 0 3px rgba(36, 95, 223, 0.12) !important;
}
.mds-rt--error :deep(.tox-tinymce)   { border-color: var(--stroke-danger)  !important; }
.mds-rt--warning :deep(.tox-tinymce) { border-color: var(--stroke-warning) !important; }
.mds-rt--success :deep(.tox-tinymce) { border-color: var(--stroke-success) !important; }
.mds-rt--error:focus-within :deep(.tox-tinymce) {
  box-shadow: 0 0 0 3px rgba(240, 68, 56, 0.12) !important;
}
.mds-rt--disabled :deep(.tox-tinymce) {
  opacity: 0.65;
  pointer-events: none;
  background: var(--bg-neutral-light) !important;
}
.mds-rt--readonly :deep(.tox-tinymce) {
  background: var(--bg-neutral-light) !important;
}

/* Toolbar top-radius */
.mds-rt :deep(.tox .tox-toolbar__primary),
.mds-rt :deep(.tox .tox-toolbar-overlord) {
  border-radius: calc(var(--radius-default) - 1px) calc(var(--radius-default) - 1px) 0 0;
  background: var(--bg-neutral-light) !important;
}

/* ── INLINE MODE — editable div ── */
.mds-rt__inline {
  min-height: 80px;
  padding: 8px 12px;
  border: 1px solid var(--stroke-neutral);
  border-radius: var(--radius-default);
  font-size: 13px;
  line-height: var(--text-body-lh);
  color: var(--text-primary);
  background: var(--bg-white);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  cursor: text;
}
.mds-rt__inline:focus,
.mds-rt--inline:focus-within .mds-rt__inline {
  border-color: var(--stroke-brand);
  box-shadow: 0 0 0 3px rgba(36, 95, 223, 0.12);
}
/* Placeholder via ::before */
.mds-rt__inline:empty::before {
  content: attr(data-placeholder);
  color: var(--text-hint);
  pointer-events: none;
}
/* State variants for inline */
.mds-rt--error    .mds-rt__inline { border-color: var(--stroke-danger); }
.mds-rt--error:focus-within .mds-rt__inline { box-shadow: 0 0 0 3px rgba(240, 68, 56, 0.12); }
.mds-rt--warning  .mds-rt__inline { border-color: var(--stroke-warning); }
.mds-rt--success  .mds-rt__inline { border-color: var(--stroke-success); }
.mds-rt--disabled .mds-rt__inline { opacity: 0.65; pointer-events: none; background: var(--bg-neutral-light); }
.mds-rt--readonly .mds-rt__inline { pointer-events: none; background: var(--bg-neutral-light); }
</style>
