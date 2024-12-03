<template>
  <div class="h-dvh flex flex-col md:flex-row">
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

      <main class="flex-1 min-h-0 py-8 flex justify-center overflow-y-auto">
        <div
          class="
            min-w-0
            min-h-0
            flex justify-center items-center
            my-auto
            w-[350px] h-[350px]
            md:w-[400px] md:h-[400px]
            lg:w-[450px] lg:h-[450px]
            max-w-[70vw] max-h-[70vw]
          "
        >
          <Canvas v-bind="form" ref="canvasRef" class="min-w-0 min-h-0 z-2" />
        </div>
      </main>
    </div>

    <div class="relative z-3 md:w-[260px] lg:w-[320px] flex flex-col bg-white border-t-2 md:border-t-0 md:border-l-2 border-black">
      <div class="relative grow min-h-0 max-h-[300px] md:max-h-none overflow-y-auto">
        <div
          class="px-5 py-4 md:block md:py-5 md:border-b-2 md:border-black"
          :class="{ hidden: currentTab !== 'content' }"
        >
          <h4 class="text-xl font-bold">文字內容</h4>
          <div class="mt-3">
            <textarea v-model="form.content" class="w-full border-2 resize-none focus:border-black focus:ring-black" rows="3" />
          </div>
        </div>

        <div
          class="px-5 py-4 md:block md:py-5 md:border-b-2 md:border-black"
          :class="{ hidden: currentTab !== 'template' }"
        >
          <h4 class="text-xl font-bold">範本</h4>
          <div class="mt-3 flex flex-wrap gap-3">
            <div
              v-for="template in templates"
              :key="`template-c${template.fontColor}-bg${template.bgColor}`"
              class="shrink-0"
            >
              <button
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

          <h4 class="mt-5 text-lg font-bold">自訂範本 <span class="text-xs text-gray-400">點擊+號保存當前設定到瀏覽器 (localStorage) 中</span></h4>
          <div class="mt-3 flex flex-wrap gap-3">
            <div
              v-for="(template, index) in customTemplates"
              :key="`template-c${template.fontColor}-bg${template.bgColor}`"
              class="relative shrink-0"
            >
              <button
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
              <button
                type="button"
                class="absolute top-0 right-0 w-4 h-4 flex justify-center items-center bg-white hover:bg-gray-200 font-bold border border-black translate-x-1/3 -translate-y-1/3 before:absolute before:block before:w-full before:h-full before:scale-2"
                title="刪除此自訂範本"
                @click="removeCustomTemplate(index)"
              >
                <HeroiconsMinusSmall20Solid class="size-4" />
              </button>
            </div>
            <button
              type="button"
              class="w-9 h-9 flex justify-center items-center bg-gray-100 font-bold border-dashed border-2 border-black"
              title="保存當前設定到瀏覽器 (localStorage) 中"
              @click="saveCustomTemplate"
            >
              <HeroiconsPlusSmall20Solid class="size-6" />
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
            <input v-model.number="form.fontSize" type="number" class="w-[80px] px-1 py-0 font-sans border-2 focus:border-black focus:ring-black">
          </div>
          <div class="mt-3 flex justify-between items-center">
            <label>字重</label>
            <select v-model.number="form.fontWeight" class="w-[80px] px-1 py-0 font-sans border-2 focus:border-black focus:ring-black">
              <option value="200">ExtraLight</option>
              <option value="300">Light</option>
              <option value="400">Regular</option>
              <option value="500">Medium</option>
              <option value="600">SemiBold</option>
              <option value="700">Bold</option>
              <option value="900">Heavy</option>
            </select>
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
              class="flex gap-2"
              aria-label="Text align"
            >
              <RadioGroupItem
                id="textAlignLeft"
                class="w-7 h-7 flex justify-center items-center bg-white data-[state=checked]:bg-black data-[state=checked]:text-white font-bold border-2 border-black focus:ring-1 focus:ring-black focus:outline-hidden"
                value="left"
              >
                左
              </RadioGroupItem>
              <RadioGroupItem
                id="textAlignRight"
                class="w-7 h-7 flex justify-center items-center bg-white data-[state=checked]:bg-black data-[state=checked]:text-white font-bold border-2 border-black focus:ring-1 focus:ring-black focus:outline-hidden"
                value="center"
              >
                中
              </RadioGroupItem>
              <RadioGroupItem
                id="textAlignCenter"
                class="w-7 h-7 flex justify-center items-center bg-white data-[state=checked]:bg-black data-[state=checked]:text-white font-bold border-2 border-black focus:ring-1 focus:ring-black focus:outline-hidden"
                value="right"
              >
                右
              </RadioGroupItem>
            </RadioGroupRoot>
          </div>
          <div class="mt-3 flex justify-between items-center">
            <label>文字垂直對齊</label>
            <RadioGroupRoot
              v-model="form.textVerticalAlign"
              class="flex gap-2"
              aria-label="Text vertical align"
            >
              <RadioGroupItem
                id="textVerticalAlignTop"
                class="w-7 h-7 flex justify-center items-center bg-white data-[state=checked]:bg-black data-[state=checked]:text-white font-bold border-2 border-black focus:ring-1 focus:ring-black focus:outline-hidden"
                value="top"
              >
                上
              </RadioGroupItem>
              <RadioGroupItem
                id="textVerticalAlignMiddle"
                class="w-7 h-7 flex justify-center items-center bg-white data-[state=checked]:bg-black data-[state=checked]:text-white font-bold border-2 border-black focus:ring-1 focus:ring-black focus:outline-hidden"
                value="middle"
              >
                中
              </RadioGroupItem>
              <RadioGroupItem
                id="textVerticalAlignBottom"
                class="w-7 h-7 flex justify-center items-center bg-white data-[state=checked]:bg-black data-[state=checked]:text-white font-bold border-2 border-black focus:ring-1 focus:ring-black focus:outline-hidden"
                value="bottom"
              >
                下
              </RadioGroupItem>
            </RadioGroupRoot>
          </div>
          <div class="mt-3 flex justify-between items-center">
            <label>行距</label>
            <input v-model.number="form.lineSpacing" type="number" class="w-[80px] px-1 py-0 font-sans border-2 focus:border-black focus:ring-black">
          </div>
          <div class="mt-3 flex justify-between items-center">
            <label>諧靈附體字型</label>
            <SwitchRoot
              id="airplane-mode"
              v-model:checked="form.enableAllPunType"
              class="relative w-[48px] h-[20px] flex bg-black/50 data-[state=checked]:bg-black shadow-xs focus:outline-hidden focus-within:ring-2 focus-within:ring-black"
            >
              <SwitchThumb
                class="block w-[14px] h-[14px] my-auto bg-white transition-transform duration-100 translate-x-[3px] will-change-transform data-[state=checked]:translate-x-[31px] shadow-xs"
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

        <button
          v-if="currentTab"
          type="button"
          class="absolute top-3 right-4 text-lg text-black font-bold md:hidden"
          @click="currentTab = null"
        >
          X
        </button>
      </div>

      <div class="hidden md:block relative z-1 p-3 -mt-[2px] bg-white border-t-2 border-black">
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
    </div>

    <footer class="absolute left-4 bottom-16 md:bottom-3 z-1 md:z-auto text-xs text-gray-400">
      網站由 <a href="https://star-note-lucas.vercel.app/" target="_blank" rel="noopener noreferrer" class="text-gray-600">Lucas Yang</a> 製作，<a href="https://github.com/justfont/AllPunType" target="_blank" rel="noopener noreferrer" class="text-gray-600">諧靈附體</a> 字型來自 <a href="https://justfont.com/" target="_blank" rel="noopener noreferrer" class="text-gray-600">justfont</a>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RadioGroupItem, RadioGroupRoot, SwitchRoot, SwitchThumb } from 'radix-vue'
import Canvas from './components/Canvas.vue'
import { templates } from './templates'
import type { ZodiacHomophoneForm, ZodiacHomophoneTemplate } from './types'

const canvasRef = ref() as Ref<InstanceType<typeof Canvas>>

const currentTab = ref<string | null>('content')
const customTemplates = useLocalStorage<ZodiacHomophoneTemplate[]>('zodiac-homophone-generator:custom-tempaltes', [])

const form: ZodiacHomophoneForm = reactive({
  content: '國際金融\n政治經濟\n社會時事\n時尚潮流',
  fontSize: 60,
  fontWeight: 700,
  fontColor: '#000000',
  zodiacFontColor: '#ff0000',
  textAlign: 'center',
  textVerticalAlign: 'middle',
  lineSpacing: 0,
  enableAllPunType: true,
  bgColor: '#ffffff',
} satisfies ZodiacHomophoneForm)

function applyTemplate(template: ZodiacHomophoneTemplate) {
  form.fontColor = template.fontColor
  form.zodiacFontColor = template.zodiacFontColor
  form.bgColor = template.bgColor

  if (template.fontSize) form.fontSize = template.fontSize
  if (template.fontWeight) form.fontWeight = template.fontWeight
  if (template.textAlign) form.textAlign = template.textAlign
  if (template.textVerticalAlign) form.textVerticalAlign = template.textVerticalAlign
  if (template.lineSpacing) form.lineSpacing = template.lineSpacing
}

function saveCustomTemplate() {
  customTemplates.value.push({
    fontColor: form.fontColor,
    zodiacFontColor: form.zodiacFontColor,
    bgColor: form.bgColor,
    fontSize: form.fontSize,
    fontWeight: form.fontWeight,
    textAlign: form.textAlign,
    textVerticalAlign: form.textVerticalAlign,
    lineSpacing: form.lineSpacing,
    borderColor: form.bgColor === '#ffffff' ? '#000000' : undefined,
  })
}

function removeCustomTemplate(index: number) {
  if (confirm('確定要刪除此自訂範本？')) {
    customTemplates.value.splice(index, 1)
  }
}

function downloadImage() {
  canvasRef.value.downloadImage()
}
</script>
