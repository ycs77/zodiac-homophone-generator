<template>
  <div class="border-2" style="border-color: #000;">
    <div ref="el" />
  </div>
</template>

<script setup lang="ts">
import Phaser from 'phaser'
import dayjs from 'dayjs'

const props = withDefaults(defineProps<{
  content: string
  fontSize?: number
  fontWeight?: number
  fontColor?: string
  // zodiacFontColor?: string
  textAlign?: string
  textVerticalAlign?: string
  lineSpacing?: number
  letterSpacing?: number
  enableAllPunType?: boolean
  bgColor?: string
}>(), {
  fontSize: 32,
  fontWeight: 400,
  fontColor: '#000000',
  // zodiacFontColor: '#ff0000',
  textAlign: 'center',
  textVerticalAlign: 'middle',
  lineSpacing: 0,
  letterSpacing: 0,
  enableAllPunType: true,
  bgColor: '#ffffff',
})

const el = ref() as Ref<HTMLDivElement>

const scale = 2
const width = 500 * scale
const height = 500 * scale

let game: Phaser.Game
let camera: Phaser.Cameras.Scene2D.Camera
let contentText: Phaser.GameObjects.Text
let sourceTipText: Phaser.GameObjects.Text

watch(() => props.content, () => contentText.setText(props.content))
watch(() => props.fontSize, () => contentText.setFontSize(getFontSize(props.fontSize)))
watch(() => props.fontWeight, () => contentText.setFontStyle(`${props.fontWeight}`))
watch(() => props.fontColor, () => {
  contentText.setColor(props.fontColor)
  sourceTipText.setColor(props.fontColor)
})
// watch(() => props.zodiacFontColor, () => content.setText(props.zodiacFontColor))
watch(() => props.textAlign, () => contentText.setAlign(props.textAlign))
watch(() => props.textVerticalAlign, () => {
  const position = getPosition(props.textVerticalAlign)
  const origin = getOrigin(props.textVerticalAlign)
  contentText
    .setX(position.x)
    .setY(position.y)
    .setOrigin(origin.x, origin.y)
})
watch(() => props.lineSpacing, () => contentText.setLineSpacing(props.lineSpacing))
watch(() => props.letterSpacing, () => contentText.setLetterSpacing(props.letterSpacing))
watch(() => props.enableAllPunType, () => contentText.setFontFamily(getFontFamily(props.enableAllPunType)))
watch(() => props.bgColor, () => camera.setBackgroundColor(props.bgColor))

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

onMounted(() => {
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
      preload() {
        // this.load.image('logo', 'assets/logo.png')
      },
      create() {
        // this.add.image(400, 300, 'logo')

        camera = this.cameras.main
        camera.setBackgroundColor('#ffffff')

        const position = getPosition(props.textVerticalAlign)
        const origin = getOrigin(props.textVerticalAlign)

        contentText = this.add.text(position.x, position.y, props.content, {
          fontFamily: getFontFamily(props.enableAllPunType),
          fontStyle: `${props.fontWeight}`,
          fontSize: getFontSize(props.fontSize),
          color: props.fontColor,
          align: props.textAlign,
          lineSpacing: props.lineSpacing,
          wordWrap: {
            width: Math.floor(width * 0.8),
            useAdvancedWrap: true,
          },
        })
          .setOrigin(origin.x, origin.y)
          .setLetterSpacing(props.letterSpacing)

        sourceTipText = this.add.text(width - 20, height - 20, '本圖片由「生肖諧音字產生器」產生', {
          fontFamily: 'system-ui',
          fontSize: '24px',
          color: props.fontColor,
        }).setOrigin(1, 1)
      },
    },
  })
})

onBeforeUnmount(() => {
  game.destroy(true)
})

defineExpose({ downloadImage })
</script>
