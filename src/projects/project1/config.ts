export default {
  template: {
    getDevDataUrl(path: string) {
      return path.replace(/\\/g, '/')
    }
  }
}