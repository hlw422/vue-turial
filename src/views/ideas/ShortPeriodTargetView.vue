<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getGoalList, addGoal, toggleGoal, deleteGoal } from '@/api/goalApi'
import type { Goal } from '@/api/goalApi'

const title = ref('')
const note = ref('')
const minutes = ref(30)
const list = ref<Goal[]>([])
const tab = ref<'all' | 'todo' | 'done'>('all')
const searchQuery = ref('')

const load = async () => {
  const data = await getGoalList()
  list.value = data
}

onMounted(() => {
  load()
})

const add = async () => {
  if (!title.value.trim()) return

  await addGoal({
    title: title.value,
    note: note.value,
    minutes: minutes.value,
    done: false
  })

  await load()
  title.value = ''
  note.value = ''
  minutes.value = 30
}

const toggle = async (g: Goal) => {
  await toggleGoal({ id: g.id, done: !g.done })
  await load()
}

const del = async (id: number) => {
  await deleteGoal({ id })
  await load()
}

const data = computed(() => {
  let filtered = list.value
  
  // 搜索过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(i => 
      i.title.toLowerCase().includes(query) || 
      (i.note && i.note.toLowerCase().includes(query))
    )
  }

  // Tab 过滤
  if (tab.value === 'todo') return filtered.filter(i => !i.done)
  if (tab.value === 'done') return filtered.filter(i => i.done)
  return filtered
})
</script>

<template>
  <!-- 你的页面代码完全不变 -->
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-2xl mx-auto">
      <div class="mb-6">
        <h1 class="text-2xl font-semibold text-gray-800">今天想做点什么？</h1>
        <p class="text-sm text-gray-400 mt-1">写下来，做一点就好</p>
      </div>

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
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-500">大概花</span>
          <select v-model="minutes" class="border rounded px-2 py-1 text-sm">
            <option v-for="m in [10,15,20,30,45,60,90,120]" :key="m" :value="m">{{ m }} 分钟</option>
          </select>
          <button @click="add" class="ml-auto text-sm bg-black text-white px-4 py-1.5 rounded hover:opacity-80">
            加一个
          </button>
        </div>
      </div>

      <div class="flex items-center gap-4 text-sm mb-4">
        <div class="flex gap-4 text-gray-500">
          <span @click="tab='all'" :class="{ 'text-black font-medium': tab==='all' }" class="cursor-pointer">全部</span>
          <span @click="tab='todo'" :class="{ 'text-black font-medium': tab==='todo' }" class="cursor-pointer">在做</span>
          <span @click="tab='done'" :class="{ 'text-black font-medium': tab==='done' }" class="cursor-pointer">做完了</span>
        </div>
        
        <div class="ml-auto relative flex items-center">
          <input 
            v-model="searchQuery" 
            placeholder="搜索目标..." 
            class="pl-8 pr-3 py-1.5 text-xs bg-white border rounded-full outline-none focus:border-black transition-colors w-40"
          />
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div class="space-y-3">
        <div v-for="g in data" :key="g.id" class="bg-white rounded-lg px-4 py-3 shadow-sm flex justify-between items-center">
          <div>
            <div class="text-sm font-medium text-gray-800 flex items-center gap-2">
              {{ g.title }}
              <span class="text-xs" :class="g.done ? 'text-green-500' : 'text-gray-400'">
                {{ g.done ? '✔ 已完成' : '' }}
              </span>
            </div>
            <div class="text-xs text-gray-400 mt-1">
              {{ g.minutes }} 分钟
              <span v-if="g.note"> · {{ g.note }}</span>
            </div>
          </div>
          <div class="flex gap-2">
            <button @click="toggle(g)" class="text-xs px-2 py-1 border rounded hover:bg-gray-100">完成</button>
            <button @click="del(g.id)" class="text-xs px-2 py-1 border rounded hover:bg-gray-100">删</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>