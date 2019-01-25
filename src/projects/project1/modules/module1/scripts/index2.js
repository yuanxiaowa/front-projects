function getTemplate(data) {
  return
}
console.log('this is index2.js;', __template(
`<div v-if="aam" :id="id">
  <img src="../images/i6.svg"/>
  <c:menu v-if="list" .items="[1, 22, 32]">
    <li slot-scope="prop">{%prop.cls%}{%prop.item%}</li>
  </c:menu>
</div>`, window.d))