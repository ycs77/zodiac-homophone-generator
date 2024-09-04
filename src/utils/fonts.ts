export function loadFont(name: string, url: string, options?: FontFaceDescriptors) {
  const newFont = new FontFace(name, `url(${url})`, options)

  return new Promise<void>((resolve, reject) => {
    newFont.load()
      .then(loaded => {
        document.fonts.add(loaded)
        resolve()
      })
      .catch(error => {
        reject(error)
      })
  })
}
