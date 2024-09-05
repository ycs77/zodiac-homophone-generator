export interface ZodiacHomophoneForm {
  content: string
  fontSize: number
  fontWeight: number
  fontColor: string
  zodiacFontColor: string
  textAlign: 'left' | 'center' | 'right'
  textVerticalAlign: 'top' | 'middle' | 'bottom'
  lineSpacing: number
  enableAllPunType: boolean
  bgColor: string
}

export interface ZodiacHomophoneTemplate {
  fontColor: string
  zodiacFontColor: string
  bgColor: string

  fontSize?: number
  fontWeight?: number
  textAlign?: 'left' | 'center' | 'right'
  textVerticalAlign?: 'top' | 'middle' | 'bottom'
  lineSpacing?: number

  // borderColor 只用於設定按鈕的邊框顏色
  borderColor?: string
}
