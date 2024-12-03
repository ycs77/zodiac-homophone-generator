<template>
  <div class="relative w-full h-full border-2 border-black">
    <div ref="el" />

    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white">
      <svg class="animate-spin h-10 w-10 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import Phaser from 'phaser'
import BBCodeTextPlugin from 'phaser3-rex-plugins/plugins/bbcodetext-plugin.js'
import type BBCodeText from 'phaser3-rex-plugins/plugins/gameobjects/tagtext/bbcodetext/BBCodeText'
import dayjs from 'dayjs'

const props = withDefaults(defineProps<{
  content: string
  fontSize?: number
  fontWeight?: number
  fontColor?: string
  zodiacFontColor?: string
  textAlign?: 'left' | 'center' | 'right'
  textVerticalAlign?: string
  lineSpacing?: number
  enableAllPunType?: boolean
  bgColor?: string
}>(), {
  fontSize: 32,
  fontWeight: 400,
  fontColor: '#000000',
  zodiacFontColor: '#ff0000',
  textAlign: 'center',
  textVerticalAlign: 'middle',
  lineSpacing: 0,
  enableAllPunType: true,
  bgColor: '#ffffff',
})

const el = ref() as Ref<HTMLDivElement>
const loading = ref(true)

const scale = 2
const width = 500 * scale
const height = 500 * scale

let game: Phaser.Game
let camera: Phaser.Cameras.Scene2D.Camera
let contentText: BBCodeText
let sourceTipText: Phaser.GameObjects.Text

watch([
  () => props.content,
  () => props.fontWeight,
  () => props.zodiacFontColor,
], () => contentText.setText(getContent(props.content)))
watch(() => props.fontSize, () => contentText.setFontSize(getFontSize(props.fontSize)))
watch(() => props.fontColor, () => {
  contentText.setColor(props.fontColor)
  sourceTipText.setColor(props.fontColor)
})
watch(() => props.textAlign, () => contentText.setHAlign(props.textAlign))
watch(() => props.textVerticalAlign, () => {
  const position = getPosition(props.textVerticalAlign)
  const origin = getOrigin(props.textVerticalAlign)
  contentText
    .setX(position.x)
    .setY(position.y)
    .setOrigin(origin.x, origin.y)
})
watch(() => props.lineSpacing, () => contentText.setLineSpacing(props.lineSpacing))
watch(() => props.enableAllPunType, () => contentText.setFontFamily(getFontFamily(props.enableAllPunType)))
watch(() => props.bgColor, () => camera.setBackgroundColor(props.bgColor))

function getContent(content: string) {
  content = content.replace('[', '').replace(']', '')
  content = `[weight=${props.fontWeight}]${content}[/weight]`

  return content.split('')
    .map(char =>
      isAllpuntypeChar(char)
        ? `[color=${props.zodiacFontColor}]${char}[/color]`
        : char
    )
    .join('')
}

function getFontSize(fontSize: number) {
  return `${fontSize * scale}px`
}

function getFontFamily(enableAllPunType: boolean) {
  if (enableAllPunType) return '諧靈附體'
  return 'system-ui'
}

function getPosition(textVerticalAlign: string) {
  if (textVerticalAlign === 'top') return { x: width / 2, y: Math.floor(height * 0.1) }
  if (textVerticalAlign === 'bottom') return { x: width / 2, y: height - Math.floor(height * 0.1) }
  return { x: width / 2, y: height / 2 }
}

function getOrigin(textVerticalAlign: string) {
  if (textVerticalAlign === 'top') return { x: 0.5, y: 0 }
  if (textVerticalAlign === 'bottom') return { x: 0.5, y: 1 }
  return { x: 0.5, y: 0.5 }
}

function downloadImage() {
  const canvas = el.value.querySelector('canvas')!
  const dataURL = canvas.toDataURL('image/png')
  const filename = `生肖諧音字產生器-${dayjs().format('YYYYMMDDHHmmss')}.png`

  const link = document.createElement('a')
  link.setAttribute('download', filename)
  link.setAttribute('href', dataURL)
  link.click()
}

onMounted(async () => {
  await loadFont('諧靈附體', '/fonts/AllPunType-Bold.otf', {
    weight: '700',
    style: 'normal',
  })

  game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: el.value,
    width,
    height,
    scale: {
      mode: Phaser.Scale.FIT,
    },
    backgroundColor: '#ffffff',
    disableContextMenu: true,
    preserveDrawingBuffer: true,
    scene: {
      create() {
        camera = this.cameras.main
        camera.setBackgroundColor('#ffffff')

        const position = getPosition(props.textVerticalAlign)
        const origin = getOrigin(props.textVerticalAlign)

        contentText = this.add.rexBBCodeText(position.x, position.y, getContent(props.content), {
          fontFamily: getFontFamily(props.enableAllPunType),
          fontStyle: '100',
          fontSize: getFontSize(props.fontSize),
          color: props.fontColor,
          halign: props.textAlign,
          lineSpacing: props.lineSpacing,
          wrap: {
            mode: 'mix',
            width: Math.floor(width * 0.8),
          },
        }).setOrigin(origin.x, origin.y)

        sourceTipText = this.add.text(width - 20, height - 20, '本圖片由「生肖諧音字產生器」產生', {
          fontFamily: 'system-ui',
          fontSize: '24px',
          color: props.fontColor,
        }).setOrigin(1, 1)

        loading.value = false
      },
    },
    plugins: {
      global: [
        { key: 'rexBBCodeTextPlugin', plugin: BBCodeTextPlugin, start: true },
      ],
    },
  })

  loadFont('諧靈附體', '/fonts/AllPunType-ExtraLight.otf', {
    weight: '200',
    style: 'normal',
  })
  loadFont('諧靈附體', '/fonts/AllPunType-Light.otf', {
    weight: '300',
    style: 'normal',
  })
  loadFont('諧靈附體', '/fonts/AllPunType-Regular.otf', {
    weight: '400',
    style: 'normal',
  })
  loadFont('諧靈附體', '/fonts/AllPunType-Medium.otf', {
    weight: '500',
    style: 'normal',
  })
  loadFont('諧靈附體', '/fonts/AllPunType-SemiBold.otf', {
    weight: '600',
    style: 'normal',
  })
  loadFont('諧靈附體', '/fonts/AllPunType-Heavy.otf', {
    weight: '900',
    style: 'normal',
  })
})

onBeforeUnmount(() => {
  game.destroy(true)
})

defineExpose({ downloadImage })
</script>
