<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Goal {
  id: number
  title: string
  note: string
  minutes: number
  done: boolean
  createdAt: number
}

const STORAGE_KEY = 'goals_v2'

// 表单
const title = ref('')
const note = ref('')
const minutes = ref(30)

// 数据
const list = ref<Goal[]>([])

const load = () => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) list.value = JSON.parse(raw)
}
load()

watch(list, () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.value))
}, { deep: true })

const add = () => {
  if (!title.value.trim()) return

  list.value.unshift({
    id: Date.now(),
    title: title.value,
    note: note.value,
    minutes: minutes.value,
    done: false,
    createdAt: Date.now()
  })

  title.value = ''
  note.value = ''
  minutes.value = 30
}

const toggle = (g: Goal) => g.done = !g.done
const del = (id: number) => list.value = list.value.filter(i => i.id !== id)

// 筛选
const tab = ref<'all' | 'todo' | 'done'>('all')

const data = computed(() => {
  if (tab.value === 'todo') return list.value.filter(i => !i.done)
  if (tab.value === 'done') return list.value.filter(i => i.done)
  return list.value
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-2xl mx-auto">

      <!-- 标题（弱一点，不那么“模板化”） -->
      <div class="mb-6">
        <h1 class="text-2xl font-semibold text-gray-800">今天想做点什么？</h1>
        <p class="text-sm text-gray-400 mt-1">写下来，做一点就好</p>
      </div>

      <!-- 输入区 -->
      <div class="bg-white rounded-xl p-4 shadow-sm mb-5 space-y-3">

        <input
          v-model="title"
          placeholder="比如：读 10 页书 / 跑步 / 写代码..."
          class="w-full text-sm border-b pb-2 outline-none"
        />

        <textarea
          v-model="note"
          placeholder="简单记一下（可不写）"
          class="w-full text-sm border-b pb-2 outline-none resize-none"
        />

        <!-- 时间改为分钟 -->
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-500">大概花</span>

          <select
            v-model="minutes"
            class="border rounded px-2 py-1 text-sm"
          >
            <option v-for="m in [10,15,20,30,45,60,90,120]" :key="m" :value="m">
              {{ m }} 分钟
            </option>
          </select>

          <button
            @click="add"
            class="ml-auto text-sm bg-black text-white px-4 py-1.5 rounded hover:opacity-80"
          >
            加一个
          </button>
        </div>
      </div>

      <!-- 筛选（更像真实产品） -->
      <div class="flex gap-4 text-sm mb-4 text-gray-500">
        <span @click="tab='all'" :class="{ 'text-black font-medium': tab==='all' }">全部</span>
        <span @click="tab='todo'" :class="{ 'text-black font-medium': tab==='todo' }">在做</span>
        <span @click="tab='done'" :class="{ 'text-black font-medium': tab==='done' }">做完了</span>
      </div>

      <!-- 列表 -->
      <div class="space-y-3">
        <div
          v-for="g in data"
          :key="g.id"
          class="bg-white rounded-lg px-4 py-3 shadow-sm flex justify-between items-center"
        >
          <div>
            <div class="text-sm font-medium text-gray-800 flex items-center gap-2">
              {{ g.title }}

              <span
                class="text-xs"
                :class="g.done ? 'text-green-500' : 'text-gray-400'"
              >
                {{ g.done ? '✔ 已完成' : '' }}
              </span>
            </div>

            <div class="text-xs text-gray-400 mt-1">
              {{ g.minutes }} 分钟
              <span v-if="g.note"> · {{ g.note }}</span>
            </div>
          </div>

          <div class="flex gap-2">
            <button
              @click="toggle(g)"
              class="text-xs px-2 py-1 border rounded hover:bg-gray-100"
            >
              完成
            </button>

            <button
              @click="del(g.id)"
              class="text-xs px-2 py-1 border rounded hover:bg-gray-100"
            >
              删
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>