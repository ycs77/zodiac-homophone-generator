import ycs77, { GLOB_SRC, GLOB_VUE } from '@ycs77/eslint-config'

export default ycs77({
  vue: true,
  typescript: true,
  ignores: ['src/allpuntype-data'],
})
  .append({
    files: [GLOB_SRC, GLOB_VUE],
    rules: {
      'no-alert': 'off',
    },
  })
