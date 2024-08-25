<template>
  <div class="h-screen flex flex-col md:flex-row">
    <div class="flex-1 min-h-0 flex flex-col">
      <header class="flex justify-between items-center px-4 py-3">
        <h1 class="text-xl font-bold">生肖諧音字產生器</h1>

        <button
          type="button"
          class="bg-black text-white px-3 py-1.5 text-sm font-bold md:hidden"
          @click="downloadImage"
        >
          下載圖片
        </button>
      </header>

      <main class="flex-1 min-h-0 flex justify-center md:items-center">
        <div class="flex justify-center py-8">
          <div class="w-[70vw] h-[70vw] max-w-[350px] max-h-[350px] md:w-[400px] md:h-[400px] md:max-w-none md:max-h-none lg:w-[450px] lg:h-[450px] border-2 border-black">
            <!-- canvas -->
          </div>
        </div>
      </main>
    </div>

    <div class="relative md:w-[260px] lg:w-[320px] flex flex-col bg-white border-t-2 md:border-t-0 md:border-l-2 border-black">
      <div class="grow min-h-0 overflow-y-auto">
        <div
          class="px-5 py-4 md:block md:py-5 md:border-b-2 md:border-black"
          :class="{ hidden: currentTab !== 'content' }"
        >
          <h4 class="text-xl font-bold">文字內容</h4>
          <div class="mt-3">
            <textarea v-model="form.content" class="w-full border-2 resize-none focus:border-black focus:ring-black" />
          </div>
        </div>

        <div
          class="px-5 py-4 md:block md:py-5 md:border-b-2 md:border-black"
          :class="{ hidden: currentTab !== 'template' }"
        >
          <h4 class="text-xl font-bold">範本</h4>
          <div class="mt-3 flex gap-3">
            <button
              v-for="template in templates"
              :key="`template-c${template.fontColor}-bg${template.bgColor}`"
              type="button"
              class="w-9 h-9 flex justify-center items-center text-lg bg-white font-bold border-2 border-black"
              :style="{
                color: template.fontColor,
                backgroundColor: template.bgColor,
                borderColor: template.borderColor ?? template.bgColor,
              }"
              @click="applyTemplate(template)"
            >
              文
            </button>
          </div>
        </div>

        <div
          class="px-5 py-4 md:block md:py-5 md:border-b-2 md:border-black"
          :class="{ hidden: currentTab !== 'font' }"
        >
          <h4 class="text-xl font-bold">文字</h4>
          <div class="mt-3 flex justify-between items-center">
            <label>文字大小</label>
            <input v-model="form.fontSize" type="number" class="w-[80px] px-1 py-0 font-sans border-2 focus:border-black focus:ring-black">
          </div>
          <div class="mt-3 flex justify-between items-center">
            <label>文字顏色</label>
            <input v-model="form.fontColor" type="color" class="w-[80px] p-0">
          </div>
          <div class="mt-3 flex justify-between items-center">
            <label>生肖文字顏色</label>
            <input v-model="form.zodiacFontColor" type="color" class="w-[80px] p-0">
          </div>
          <div class="mt-3 flex justify-between items-center">
            <label>文字對齊</label>
            <RadioGroupRoot
              v-model="form.textAlign"
              class="mt-3 flex gap-2"
              aria-label="Text align"
            >
              <RadioGroupItem
                id="textAlignLeft"
                class="w-7 h-7 flex justify-center items-center bg-white data-[state=checked]:bg-black data-[state=checked]:text-white font-bold border-2 border-black focus:ring-1 focus:ring-black focus:outline-none"
                value="left"
              >
                左
              </RadioGroupItem>
              <RadioGroupItem
                id="textAlignRight"
                class="w-7 h-7 flex justify-center items-center bg-white data-[state=checked]:bg-black data-[state=checked]:text-white font-bold border-2 border-black focus:ring-1 focus:ring-black focus:outline-none"
                value="right"
              >
                中
              </RadioGroupItem>
              <RadioGroupItem
                id="textAlignCenter"
                class="w-7 h-7 flex justify-center items-center bg-white data-[state=checked]:bg-black data-[state=checked]:text-white font-bold border-2 border-black focus:ring-1 focus:ring-black focus:outline-none"
                value="center"
              >
                右
              </RadioGroupItem>
              <RadioGroupItem
                id="textAlignFull"
                class="w-7 h-7 flex justify-center items-center bg-white data-[state=checked]:bg-black data-[state=checked]:text-white font-bold border-2 border-black focus:ring-1 focus:ring-black focus:outline-none"
                value="full"
              >
                滿
              </RadioGroupItem>
            </RadioGroupRoot>
          </div>
          <div class="mt-3 flex justify-between items-center">
            <label>文字垂直對齊</label>
            <RadioGroupRoot
              v-model="form.textVerticalAlign"
              class="mt-3 flex gap-2"
              aria-label="Text vertical align"
            >
              <RadioGroupItem
                id="textVerticalAlignTop"
                class="w-7 h-7 flex justify-center items-center bg-white data-[state=checked]:bg-black data-[state=checked]:text-white font-bold border-2 border-black focus:ring-1 focus:ring-black focus:outline-none"
                value="top"
              >
                上
              </RadioGroupItem>
              <RadioGroupItem
                id="textVerticalAlignMiddle"
                class="w-7 h-7 flex justify-center items-center bg-white data-[state=checked]:bg-black data-[state=checked]:text-white font-bold border-2 border-black focus:ring-1 focus:ring-black focus:outline-none"
                value="middle"
              >
                中
              </RadioGroupItem>
              <RadioGroupItem
                id="textVerticalAlignBottom"
                class="w-7 h-7 flex justify-center items-center bg-white data-[state=checked]:bg-black data-[state=checked]:text-white font-bold border-2 border-black focus:ring-1 focus:ring-black focus:outline-none"
                value="bottom"
              >
                下
              </RadioGroupItem>
            </RadioGroupRoot>
          </div>
          <div class="mt-3 flex justify-between items-center">
            <label>諧靈附體字型</label>
            <SwitchRoot
              id="airplane-mode"
              v-model:checked="form.enableAllPunType"
              class="relative w-[48px] h-[20px] flex bg-black/50 data-[state=checked]:bg-black shadow-sm cursor-default focus-within:outline focus-within:outline-black"
            >
              <SwitchThumb
                class="block w-[14px] h-[14px] my-auto bg-white transition-transform duration-100 translate-x-[3px] will-change-transform data-[state=checked]:translate-x-[31px] shadow-sm"
              />
            </SwitchRoot>
          </div>
        </div>

        <div
          class="px-5 py-4 md:block md:py-5 md:border-b-2 md:border-black"
          :class="{ hidden: currentTab !== 'bg' }"
        >
          <h4 class="text-xl font-bold">背景</h4>
          <div class="mt-3 flex justify-between items-center">
            <label>背景顏色</label>
            <input v-model="form.bgColor" type="color" class="w-[80px] p-0">
          </div>
        </div>
      </div>

      <div class="hidden md:block p-3 -mt-[2px] border-t-2 border-black">
        <button
          type="button"
          class="block w-full bg-black text-white py-3 text-lg font-bold"
          @click="downloadImage"
        >
          下載圖片
        </button>
      </div>

      <nav
        class="px-5 pb-3 md:hidden"
        :class="{ 'pt-3': currentTab === null }"
      >
        <ul class="flex gap-5">
          <li>
            <button
              type="button"
              class="text-lg text-gray-400 data-[state=active]:text-black font-bold"
              :data-state="currentTab === 'content' ? 'active' : 'inactive'"
              @click="currentTab = 'content'"
            >
              內容
            </button>
          </li>
          <li>
            <button
              type="button"
              class="text-lg text-gray-400 data-[state=active]:text-black font-bold"
              :data-state="currentTab === 'template' ? 'active' : 'inactive'"
              @click="currentTab = 'template'"
            >
              範本
            </button>
          </li>
          <li>
            <button
              type="button"
              class="text-lg text-gray-400 data-[state=active]:text-black font-bold"
              :data-state="currentTab === 'font' ? 'active' : 'inactive'"
              @click="currentTab = 'font'"
            >
              文字
            </button>
          </li>
          <li>
            <button
              type="button"
              class="text-lg text-gray-400 data-[state=active]:text-black font-bold"
              :data-state="currentTab === 'bg' ? 'active' : 'inactive'"
              @click="currentTab = 'bg'"
            >
              背景
            </button>
          </li>
        </ul>
      </nav>

      <button
        v-if="currentTab"
        type="button"
        class="absolute top-3 right-4 text-lg text-black font-bold md:hidden"
        @click="currentTab = null"
      >
        X
      </button>
    </div>

    <footer class="absolute left-4 bottom-16 md:bottom-3 z-[-1] md:z-auto text-xs text-gray-400">
      網站由 <a href="https://star-note-lucas.vercel.app/" target="_blank" rel="noopener noreferrer" class="text-gray-600">Lucas Yang</a> 建立，<a href="https://github.com/justfont/AllPunType" target="_blank" rel="noopener noreferrer" class="text-gray-600">諧靈附體</a> 字型來自 <a href="https://justfont.com/" target="_blank" rel="noopener noreferrer" class="text-gray-600">justfont</a>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RadioGroupItem, RadioGroupRoot, SwitchRoot, SwitchThumb } from 'radix-vue'
import { templates } from './templates'

const currentTab = ref<string | null>('content')

const form = reactive({
  content: '雖然我不鼠於這方面的專家，但還鼠笑鼠我了，我真的不想牛曲原意。',
  fontSize: 21,
  fontColor: '#000000',
  zodiacFontColor: '#ff0000',
  textAlign: 'center',
  textVerticalAlign: 'middle',
  enableAllPunType: true,
  bgColor: '#ffffff',
})

function applyTemplate(template: typeof templates[number]) {
  form.fontColor = template.fontColor
  form.zodiacFontColor = template.zodiacFontColor
  form.bgColor = template.bgColor
}

function downloadImage() {
  //
}
</script>
