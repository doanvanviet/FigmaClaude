<template>
  <div class="ava-panel" :style="{ width: panelWidth + 'px' }">
    <!-- Resize handle -->
    <div class="ava-resize-handle" @mousedown.prevent="startResize"></div>

    <!-- Header -->
    <div class="ava-header">
      <button class="ava-icon-btn" @click="$emit('close')">
        <TIcon name="chevron-left" />
      </button>
      <div class="ava-avatar-wrap">
        <img src="/logos/misa-amis.svg" width="32" height="32" alt="AVA" />
      </div>
      <div class="ava-title-block">
        <span class="ava-name">AVA Kế toán</span>
        <span class="ava-beta">Beta</span>
      </div>
      <div class="ava-header-right">
        <button class="ava-icon-btn"><TIcon name="dots" /></button>
        <button class="ava-icon-btn" @click="$emit('close')"><TIcon name="x" /></button>
      </div>
    </div>

    <!-- Chat body -->
    <div class="ava-body">
      <div class="ava-welcome">
        <!-- AI character -->
        <div class="ava-char">
          <div class="ava-char-glow"></div>
          <div class="ava-char-avatar">
            <TIcon name="sparkles" class="ava-char-icon" />
          </div>
        </div>

        <p class="ava-greet">Xin chào anh Chung!</p>
        <p class="ava-question">Em có thể giúp gì cho anh?</p>
      </div>

      <!-- Chat messages (placeholder) -->
      <div class="ava-messages" ref="messagesRef">
        <template v-for="msg in messages" :key="msg.id">
          <!-- User message -->
          <div v-if="msg.role === 'user'" class="ava-msg ava-msg--user">
            <div class="ava-bubble ava-bubble--user">{{ msg.text }}</div>
          </div>
          <!-- AI message -->
          <div v-else class="ava-msg ava-msg--ai">
            <div class="ava-msg-avatar">
              <img src="/logos/misa-amis.svg" width="24" height="24" alt="" />
            </div>
            <div class="ava-bubble ava-bubble--ai">{{ msg.text }}</div>
          </div>
        </template>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="ava-quick">
      <button class="ava-quick-btn" @click="sendQuick('Hướng dẫn sử dụng')">Hướng dẫn sử dụng</button>
      <div class="ava-quick-sep"></div>
      <button class="ava-quick-btn" @click="sendQuick('Thực hiện chức năng')">Thực hiện chức năng</button>
    </div>

    <!-- Input bar -->
    <div class="ava-input-bar">
      <input
        v-model="inputText"
        class="ava-input"
        placeholder="Nhập câu hỏi cho AVA..."
        @keydown.enter="send"
      />
      <button class="ava-mic-btn"><TIcon name="microphone" /></button>
      <button class="ava-send-btn" :class="{ 'ava-send-btn--active': inputText }" @click="send">
        <TIcon name="send" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onUnmounted } from 'vue'
import TIcon from '@mds/components/TIcon.vue'

const emit = defineEmits(['close', 'resize'])

/* ── Resize ── */
const MIN_W = 350
const MAX_W = 720
const panelWidth = ref(420)

watch(panelWidth, w => emit('resize', w))

function startResize(e) {
  const startX = e.clientX
  const startW = panelWidth.value

  function onMove(e) {
    const delta = startX - e.clientX
    panelWidth.value = Math.min(MAX_W, Math.max(MIN_W, startW + delta))
  }
  function onUp() {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  document.body.style.cursor = 'ew-resize'
  document.body.style.userSelect = 'none'
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

onUnmounted(() => {
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
})

const inputText   = ref('')
const messagesRef = ref(null)
const messages    = ref([])

let _id = 0
function send() {
  const text = inputText.value.trim()
  if (!text) return
  messages.value.push({ id: ++_id, role: 'user', text })
  inputText.value = ''
  scrollBottom()
  setTimeout(() => {
    messages.value.push({ id: ++_id, role: 'ai', text: 'Em đang xử lý yêu cầu của anh, vui lòng chờ trong giây lát...' })
    scrollBottom()
  }, 600)
}
function sendQuick(text) {
  inputText.value = text
  send()
}
async function scrollBottom() {
  await nextTick()
  if (messagesRef.value) messagesRef.value.scrollTop = messagesRef.value.scrollHeight
}
</script>

<style scoped>
.ava-panel {
  position: relative;   /* anchor for resize handle */
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-left: 1px solid var(--stroke-neutral-light);
  overflow: hidden;
}

/* ── Resize handle ── */
.ava-resize-handle {
  position: absolute; left: 0; top: 0; bottom: 0;
  width: 4px; cursor: ew-resize; z-index: 10;
  transition: background 0.15s;
}
.ava-resize-handle:hover,
.ava-resize-handle:active {
  background: rgba(109, 40, 217, 0.25);
}

/* ── Header ── */
.ava-header {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 52px;
  padding: 0 12px;
  border-bottom: 1px solid var(--stroke-neutral-light);
  flex-shrink: 0;
}
.ava-icon-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border: none; background: transparent;
  border-radius: 8px; cursor: pointer; color: var(--text-secondary);
  transition: background 0.14s; flex-shrink: 0;
  font-size: 18px;
}
.ava-icon-btn:hover { background: var(--bg-neutral-hover); }
.ava-icon-btn .ti   { font-size: 18px; }
.ava-avatar-wrap {
  width: 36px; height: 36px; border-radius: 10px;
  overflow: hidden; flex-shrink: 0;
  border: 1px solid var(--stroke-neutral-light);
  display: flex; align-items: center; justify-content: center;
}
.ava-title-block { display: flex; align-items: center; gap: 6px; flex: 1; min-width: 0; }
.ava-name { font-size: 14px; font-weight: 600; color: var(--text-primary); }
.ava-beta {
  font-size: 10px; font-weight: 700;
  background: #ecfdf3; color: #12b76a;
  border: 1px solid #a6f4c5;
  padding: 1px 6px; border-radius: 9999px;
  letter-spacing: 0.02em;
}
.ava-header-right { display: flex; align-items: center; gap: 2px; }

/* ── Body ── */
.ava-body {
  flex: 1; overflow-y: auto;
  display: flex; flex-direction: column;
}
.ava-welcome {
  display: flex; flex-direction: column; align-items: center;
  padding: 40px 24px 24px; text-align: center;
}
.ava-char { position: relative; margin-bottom: 20px; }
.ava-char-glow {
  position: absolute; inset: -20px;
  background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%);
  border-radius: 50%;
}
.ava-char-avatar {
  width: 96px; height: 96px; border-radius: 50%;
  background: linear-gradient(135deg, #f5f3ff 0%, #eff6ff 50%, #f0fdf4 100%);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8px 32px rgba(124,58,237,0.18), 0 0 0 1px rgba(124,58,237,0.10);
  position: relative;
}
.ava-char-icon { font-size: 40px; color: #7c3aed; }
.ava-greet {
  font-size: 16px; font-weight: 600; color: var(--text-primary);
  margin: 0 0 8px;
}
.ava-question {
  font-size: 18px; font-weight: 700; margin: 0;
  background: linear-gradient(90deg, #6d28d9, #2563eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 26px;
}

/* Messages */
.ava-messages {
  flex: 1; padding: 0 16px 16px;
  display: flex; flex-direction: column; gap: 12px;
}
.ava-msg { display: flex; align-items: flex-end; gap: 8px; }
.ava-msg--user { justify-content: flex-end; }
.ava-msg-avatar {
  width: 28px; height: 28px; border-radius: 8px;
  overflow: hidden; flex-shrink: 0;
  border: 1px solid var(--stroke-neutral-light);
}
.ava-bubble {
  max-width: 80%; padding: 10px 14px;
  font-size: 13px; line-height: 20px; border-radius: 12px;
}
.ava-bubble--user {
  background: linear-gradient(135deg, #6d28d9, #2563eb);
  color: #ffffff; border-bottom-right-radius: 4px;
}
.ava-bubble--ai {
  background: var(--bg-neutral-light);
  color: var(--text-primary); border-bottom-left-radius: 4px;
}

/* ── Quick actions ── */
.ava-quick {
  display: flex; align-items: center;
  padding: 10px 16px;
  border-top: 1px solid var(--stroke-neutral-light);
  gap: 0; flex-shrink: 0;
}
.ava-quick-btn {
  flex: 1; height: 34px; padding: 0 12px;
  border: 1px solid var(--stroke-neutral);
  background: var(--bg-white); border-radius: 9999px;
  font-size: 12px; font-weight: 500; color: var(--text-primary);
  cursor: pointer; transition: background 0.14s;
  font-family: var(--font-family); white-space: nowrap;
}
.ava-quick-btn:hover { background: var(--bg-neutral-light); }
.ava-quick-sep { width: 8px; flex-shrink: 0; }

/* ── Input bar ── */
.ava-input-bar {
  display: flex; align-items: center; gap: 6px;
  padding: 10px 12px 14px;
  border-top: 1px solid var(--stroke-neutral-light);
  flex-shrink: 0;
}
.ava-input {
  flex: 1; height: 38px; padding: 0 12px;
  border: 1.5px solid var(--stroke-neutral);
  border-radius: 9999px; outline: none;
  font-size: 13px; color: var(--text-primary);
  font-family: var(--font-family);
  background: var(--bg-white);
  transition: border-color 0.15s;
}
.ava-input:focus { border-color: #7c3aed; }
.ava-input::placeholder { color: var(--text-hint); }
.ava-mic-btn {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  border: none; background: transparent; border-radius: 50%;
  cursor: pointer; color: #3b82f6; font-size: 18px;
  transition: background 0.14s; flex-shrink: 0;
}
.ava-mic-btn:hover { background: #eff6ff; }
.ava-mic-btn .ti { font-size: 18px; }
.ava-send-btn {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  border: none; border-radius: 50%; cursor: pointer;
  background: var(--bg-neutral-light); color: var(--text-hint);
  transition: all 0.18s; flex-shrink: 0;
}
.ava-send-btn--active {
  background: linear-gradient(135deg, #6d28d9, #2563eb);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(109, 40, 217, 0.35);
}
.ava-send-btn .ti { font-size: 16px; }
</style>
