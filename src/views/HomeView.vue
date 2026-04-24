<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <main class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-2xl mx-auto">
      <header class="mb-10 text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">我的个人空间</h1>
        <p class="text-gray-500">记录生活，记录成长</p>
      </header>

      <nav class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <router-link to="/stv" class="flex items-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
          <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 mr-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-800">短期目标</h2>
            <p class="text-sm text-gray-500">规划并完成你的今日任务</p>
          </div>
        </router-link>

        <router-link to="/book-excerpt" class="flex items-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
          <div class="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500 mr-4 group-hover:bg-purple-500 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-800">每日书摘</h2>
            <p class="text-sm text-gray-500">收藏书中的精彩瞬间</p>
          </div>
        </router-link>

        <router-link to="/tech-summary" class="flex items-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
          <div class="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-500 mr-4 group-hover:bg-green-500 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-800">技术摘要</h2>
            <p class="text-sm text-gray-500">用 Markdown 记录技术心得</p>
          </div>
        </router-link>
      </nav>
      </div>
  </main>
</template>
