<script setup lang="ts">
import { ref, Ref, useTemplateRef } from 'vue';

import { NButton, NColorPicker, NModal, NSpace, useMessage } from 'naive-ui';

type IconProps = {
  unicode: number;
  iconName: string;
  viewBox: string;
  svgPath: string;
};

const showModal = ref(false);
const iconContent: Ref<IconProps | null> = ref(null);
const message = useMessage()

function open(icon: IconProps) {
  showModal.value = true;
  iconContent.value = icon;
}

defineExpose({ open });

const svgIcon = useTemplateRef('svgIcon');
function handleChangeColor(color: string) {
  if(!svgIcon) return
  svgIcon.value!.style.fill = color
}

function getSvgContent() {
  if(!svgIcon.value) return
  const svgElement = svgIcon.value!.cloneNode(true) as SVGSVGElement
  Array.from(svgElement.attributes).forEach((attr) => {
    if (attr.name.startsWith("data-v-")) {
      svgElement.removeAttribute(attr.name);
    }
  });
  return svgElement.outerHTML
}

function handleCopySVG() {
  const svg = getSvgContent()
  if(!svg || svg.trim() === '') return
  navigator.clipboard.writeText(svg)
  message.success('复制成功')
  
}

function handleDownloadSVG() {
  const svg = getSvgContent()
  if(!svg || svg.trim() === '') return
  const aLink = document.createElement('a')
  aLink.download = `${iconContent.value?.iconName || 'icon'}.svg`
  aLink.style.display = 'none'
  aLink.referrerPolicy = 'no-referrer'
  aLink.href = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }))
  aLink.click();
  aLink.remove();
  URL.revokeObjectURL(aLink.href)
}

function handleDownloadPNG() {
  const svg = getSvgContent()
  if(!svg || svg.trim() === '') return
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if(!context) return
  const svgElement = svgIcon.value
  const width = svgElement!.clientWidth
  canvas.width = width
  canvas.height = width
  context.fillStyle = 'transparent'
  context.fillRect(0, 0, canvas.width, canvas.height)
  const image = new Image()
  image.src = `data:image/svg+xml;base64,${btoa(svg)}`
  image.onload = () => {
    context.drawImage(image, 0, 0)
    const aLink = document.createElement('a')
    aLink.download = `${iconContent.value?.iconName || 'icon'}.png`
    aLink.style.display = 'none'
    aLink.referrerPolicy = 'no-referrer'
    aLink.href = canvas.toDataURL('image/png')
    aLink.click();
    aLink.remove();
    URL.revokeObjectURL(aLink.href)
    canvas.remove()
    image.remove()
  }    
}
</script>

<template>
  <n-modal
    v-model:show="showModal"
    preset="card"
    :style="{ width: '700px' }"
    title="Icon 详情"
    size="huge"
    :bordered="false"
  >
    <div class="detail--wrapper">
      <div class="icon-view">
        <svg
          v-if="iconContent"
          xmlns="http://www.w3.org/2000/svg"
          :viewBox="iconContent.viewBox"
          width="100%"
          height="100%"
          v-html="iconContent.svgPath"
          ref="svgIcon"
        ></svg>
      </div>
      <div style="width: 300px; margin-left: 20px">
        <n-color-picker :modes="['hex']" @update:value="handleChangeColor"/>
      </div>
    </div>
    <div style="margin-top: 20px;">
      <n-space justify="center" size="large">
      <n-button type="primary" @click="handleDownloadSVG">下载 SVG</n-button>
      <n-button type="primary" @click="handleDownloadPNG">下载 PNG</n-button>
      <n-button type="primary" @click="handleCopySVG">复制 SVG</n-button>
      </n-space>  
    </div>
  </n-modal>
</template>

<style lang="scss" scoped>
.detail--wrapper {
  display: flex;

  .icon-view {
    width: 200px; 
    height: 200px; 
    border: 2px solid #e2e2e2; 
    border-radius: 10px; 
    padding: 30px;
  }
}
</style>
