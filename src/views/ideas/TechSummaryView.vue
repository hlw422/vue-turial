<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getTechSummaryList, addTechSummary, deleteTechSummary } from '@/api/techSummaryApi'
import type { TechSummary } from '@/api/techSummaryApi'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const title = ref('')
const content = ref('')
const tagInput = ref('')
const tags = ref<string[]>([])
const list = ref<TechSummary[]>([])
const loading = ref(false)
const isPreview = ref(false)
const searchQuery = ref('')

const load = async () => {
  loading.value = true
  try {
    const data = await getTechSummaryList()
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
    item.title.toLowerCase().includes(query) || 
    item.content.toLowerCase().includes(query) || 
    item.tags.some(tag => tag.toLowerCase().includes(query))
  )
})

const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !tags.value.includes(tag)) {
    tags.value.push(tag)
    tagInput.value = ''
  }
}

const removeTag = (index: number) => {
  tags.value.splice(index, 1)
}

const add = async () => {
  if (!title.value.trim() || !content.value.trim()) {
    alert('标题和内容不能为空')
    return
  }

  try {
    await addTechSummary({
      title: title.value,
      content: content.value,
      tags: [...tags.value]
    })
    
    title.value = ''
    content.value = ''
    tags.value = []
    await load()
  } catch (error) {
    console.error('添加失败:', error)
  }
}

const del = async (id: number) => {
  if (!confirm('确定要删除这条技术摘要吗？')) return
  try {
    await deleteTechSummary({ id })
    await load()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

const renderMarkdown = (text: string) => {
  const html = marked.parse(text) as string
  return DOMPurify.sanitize(html)
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">
      <!-- 头部 -->
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-800">技术摘要</h1>
          <p class="text-sm text-gray-400 mt-1">沉淀技术，记录成长</p>
        </div>
        <div class="flex items-center gap-6">
          <div class="relative flex items-center">
            <input 
              v-model="searchQuery" 
              placeholder="搜索标题、内容或标签..." 
              class="pl-9 pr-4 py-1.5 text-sm bg-white border rounded-full outline-none focus:border-blue-500 transition-colors w-64 shadow-sm"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <router-link to="/" class="text-sm text-gray-500 hover:text-black">返回首页</router-link>
        </div>
      </div>

      <!-- 输入区 -->
      <div class="bg-white rounded-xl p-6 shadow-sm mb-8">
        <div class="grid grid-cols-1 gap-4">
          <input
            v-model="title"
            placeholder="输入技术主题标题..."
            class="w-full text-lg font-medium border-b pb-2 outline-none focus:border-blue-500 transition-colors"
          />
          
          <div class="flex flex-wrap gap-2 items-center min-h-[32px]">
            <span v-for="(tag, index) in tags" :key="index" class="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              {{ tag }}
              <button @click="removeTag(index)" class="hover:text-red-500">×</button>
            </span>
            <input
              v-model="tagInput"
              @keyup.enter="addTag"
              placeholder="添加标签 (Enter)"
              class="text-xs outline-none bg-transparent"
            />
          </div>

          <div class="border rounded-lg overflow-hidden">
            <div class="bg-gray-50 px-4 py-2 border-b flex gap-4 text-xs font-medium text-gray-500">
              <button @click="isPreview = false" :class="{ 'text-blue-600': !isPreview }">编辑模式</button>
              <button @click="isPreview = true" :class="{ 'text-blue-600': isPreview }">预览模式</button>
            </div>
            
            <textarea
              v-if="!isPreview"
              v-model="content"
              placeholder="使用 Markdown 记录你的技术发现..."
              rows="10"
              class="w-full p-4 text-sm outline-none resize-none font-mono"
            />
            <div
              v-else
              class="w-full p-4 min-h-[224px] prose prose-sm max-w-none"
              v-html="renderMarkdown(content || '*暂无内容预览*')"
            />
          </div>

          <div class="flex justify-end">
            <button 
              @click="add" 
              class="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 transition-colors active:scale-95 transform text-sm"
            >
              发布摘要
            </button>
          </div>
        </div>
      </div>

      <!-- 列表区 -->
      <div class="space-y-6">
        <div v-if="loading" class="text-center py-10 text-gray-400 text-sm">加载中...</div>
        <div v-else-if="filteredList.length === 0" class="text-center py-10 text-gray-400 text-sm">
          {{ searchQuery ? '未找到匹配的技术摘要' : '暂无技术摘要' }}
        </div>
        
        <div v-for="item in filteredList" :key="item.id" class="bg-white rounded-xl shadow-sm overflow-hidden border border-transparent hover:border-blue-100 transition-all">
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ item.title }}</h2>
                <div class="flex flex-wrap gap-2">
                  <span v-for="tag in item.tags" :key="tag" class="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                    #{{ tag }}
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-xs text-gray-400">{{ formatDate(item.createdAt) }}</span>
                <button @click="del(item.id)" class="text-xs text-red-400 hover:text-red-600 transition-colors">删除</button>
              </div>
            </div>
            
            <div class="prose prose-sm max-w-none text-gray-600" v-html="renderMarkdown(item.content)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 针对 Markdown 渲染的一些基础样式微调 */
:deep(.prose) {
  color: #374151;
}
:deep(.prose h1) { font-size: 1.5rem; margin-top: 1.5rem; margin-bottom: 0.75rem; font-weight: 700; }
:deep(.prose h2) { font-size: 1.25rem; margin-top: 1.25rem; margin-bottom: 0.5rem; font-weight: 600; }
:deep(.prose p) { margin-bottom: 1rem; line-height: 1.6; }
:deep(.prose code) { 
  background-color: #f3f4f6; 
  color: #eb5757;
  padding: 0.2rem 0.4rem; 
  border-radius: 0.25rem; 
  font-size: 0.875em; 
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
:deep(.prose pre) { 
  background-color: #f8f9fa; 
  border: 1px solid #e5e7eb;
  color: #374151; 
  padding: 1.25rem; 
  border-radius: 0.75rem; 
  overflow-x: auto; 
  margin: 1.25rem 0; 
  line-height: 1.6;
}
:deep(.prose pre code) { 
  background-color: transparent; 
  color: inherit; 
  padding: 0; 
  border-radius: 0; 
  font-size: 0.9em; 
}
:deep(.prose ul) { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
:deep(.prose ol) { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
:deep(.prose blockquote) { border-left: 4px solid #e5e7eb; padding-left: 1rem; font-style: italic; color: #6b7280; margin: 1rem 0; }
</style>
