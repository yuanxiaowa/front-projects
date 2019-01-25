var mappings = {
  EXPERIENCE: {
    name: '体验店',
    id: 1
  },
  DIRECT: {
    name: '直营店',
    id: 2
  },
  EXCLUSIVE: {
    name: '专卖店',
    id: 3
  }
};
export default function(key) {
  return `<span class="label-rating lv-${mappings[key]}">${mappings[key].name}</span>`
}