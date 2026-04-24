<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getExcerptList, addExcerpt, deleteExcerpt } from '@/api/bookExcerptApi'
import type { BookExcerpt } from '@/api/bookExcerptApi'

const bookName = ref('')
const content = ref('')
const comment = ref('')
const list = ref<BookExcerpt[]>([])
const loading = ref(false)
const searchQuery = ref('')

const load = async () => {
  loading.value = true
  try {
    const data = await getExcerptList()
    list.value = data
  } catch (error) {
    console.error('加载失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  load()
})

const filteredList = computed(() => {
  if (!searchQuery.value.trim()) return list.value
  const query = searchQuery.value.toLowerCase()
  return list.value.filter(item => 
    item.bookName.toLowerCase().includes(query) || 
    item.content.toLowerCase().includes(query) || 
    (item.comment && item.comment.toLowerCase().includes(query))
  )
})

const add = async () => {
  if (!bookName.value.trim() || !content.value.trim()) {
    alert('书名和书摘内容不能为空')
    return
  }

  try {
    await addExcerpt({
      bookName: bookName.value,
      content: content.value,
      comment: comment.value
    })
    
    bookName.value = ''
    content.value = ''
    comment.value = ''
    await load()
  } catch (error) {
    console.error('添加失败:', error)
  }
}

const del = async (id: number) => {
  if (!confirm('确定要删除这条书摘吗？')) return
  try {
    await deleteExcerpt({ id })
    await load()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-2xl mx-auto">
      <!-- 返回按钮 -->
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-800">每日书摘</h1>
          <p class="text-sm text-gray-400 mt-1">记录那些触动内心的文字</p>
        </div>
        <router-link to="/" class="text-sm text-gray-500 hover:text-black">返回首页</router-link>
      </div>

      <!-- 搜索框 -->
      <div class="mb-6 relative flex items-center">
        <input 
          v-model="searchQuery" 
          placeholder="搜索书名、内容或评论..." 
          class="w-full pl-10 pr-4 py-2 bg-white border rounded-xl outline-none focus:border-black transition-colors text-sm shadow-sm"
        />
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <!-- 输入框 -->
      <div class="bg-white rounded-xl p-5 shadow-sm mb-6 space-y-4">
        <div>
          <label class="block text-xs font-medium text-gray-400 mb-1">书名</label>
          <input
            v-model="bookName"
            placeholder="书的名字"
            class="w-full text-sm border-b pb-2 outline-none focus:border-black transition-colors"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-400 mb-1">书摘内容</label>
          <textarea
            v-model="content"
            placeholder="记录下那段文字..."
            rows="3"
            class="w-full text-sm border-b pb-2 outline-none focus:border-black transition-colors resize-none"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-400 mb-1">评论/心得</label>
          <textarea
            v-model="comment"
            placeholder="写下你的感受（可选）"
            rows="2"
            class="w-full text-sm border-b pb-2 outline-none focus:border-black transition-colors resize-none"
          />
        </div>
        <div class="flex justify-end">
          <button 
            @click="add" 
            class="text-sm bg-black text-white px-6 py-2 rounded-lg hover:opacity-80 transition-opacity active:scale-95 transform"
          >
            保存记录
          </button>
        </div>
      </div>

      <!-- 列表 -->
      <div class="space-y-4">
        <div v-if="loading" class="text-center py-10 text-gray-400 text-sm">加载中...</div>
        <div v-else-if="filteredList.length === 0" class="text-center py-10 text-gray-400 text-sm">
          {{ searchQuery ? '未找到匹配结果' : '还没有记录，开始记录第一条吧' }}
        </div>
        
        <div v-for="item in filteredList" :key="item.id" class="bg-white rounded-xl p-5 shadow-sm group">
          <div class="flex justify-between items-start mb-3">
            <div class="text-sm font-semibold text-gray-800">《{{ item.bookName }}》</div>
            <div class="flex items-center gap-3">
              <span class="text-xs text-gray-400">{{ formatDate(item.createdAt) }}</span>
              <button @click="del(item.id)" class="text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:underline">删除</button>
            </div>
          </div>
          <div class="text-sm text-gray-600 leading-relaxed mb-4 italic border-l-4 border-gray-100 pl-4">
            “{{ item.content }}”
          </div>
          <div v-if="item.comment" class="bg-gray-50 rounded-lg p-3 text-sm text-gray-500">
            <span class="font-medium text-gray-700 mr-1">评论:</span> {{ item.comment }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 可以在这里添加一些特定的样式 */
</style>
