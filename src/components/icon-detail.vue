<!--
 * @Author: zi.yang
 * @Date: 2024-12-06 13:04:45
 * @LastEditors: zi.yang
 * @LastEditTime: 2024-12-15 20:35:00
 * @Description: 图标详情
 * @FilePath: /reader-font/src/components/icon-detail.vue
-->
<script setup lang="ts">
import { ref, Ref, useTemplateRef } from 'vue';
import {
  NButton,
  NColorPicker,
  NInputNumber,
  NModal,
  NSpace,
  useMessage,
} from 'naive-ui';
import { ReloadCircleOutline } from '@vicons/ionicons5';

type IconProps = {
  unicode: number;
  iconName: string;
  viewBox: string;
  svgPath: string;
};

const isModalVisible = ref(false);
const currentIcon: Ref<IconProps | null> = ref(null);
const message = useMessage();
const rotationAngle = ref(0);
const scaleFactor = ref(1);
const positionOffset = ref({ x: 0, y: 0 });
const isGridVisible = ref(false);
const iconDimension = ref('200px');

/**
 * 打开弹窗并初始化图标属性。
 *
 * @param icon 弹窗中要显示的图标。
 */
function openModal(icon: IconProps) {
  isModalVisible.value = true;
  currentIcon.value = icon;
  rotationAngle.value = 0;
  scaleFactor.value = 1;
  positionOffset.value = { x: 0, y: 0 };
}

defineExpose({ openModal });

const svgElementRef = useTemplateRef('svgElement');

/**
 * 更新 SVG 元素的颜色。
 *
 * @param color 要变更的颜色。
 */
function updateColor(color: string) {
  if (!svgElementRef) return;
  svgElementRef.value!.style.fill = color;
}

/**
 * 获取 SVG 标记。
 *
 * @returns SVG
 */
function getSvgMarkup() {
  if (!svgElementRef.value) return;
  const svgClone = svgElementRef.value!.cloneNode(true) as SVGSVGElement;
  Array.from(svgClone.attributes).forEach((attr) => {
    if (attr.name.startsWith('data-v-')) {
      svgClone.removeAttribute(attr.name);
    }
  });
  return svgClone.outerHTML;
}

/**
 * 复制 SVG 标记到剪贴板。
 */
function copySvgToClipboard() {
  const svgMarkup = getSvgMarkup();
  if (!svgMarkup || svgMarkup.trim() === '') return;
  navigator.clipboard.writeText(svgMarkup);
  message.success('SVG copied successfully');
}

/**
 * 下载文件。
 *
 * @param base64Url 文件的 base64 URL。
 * @param extension 文件扩展名。
 */
function downloadFile(base64Url: string, extension: string = 'svg') {
  const link = document.createElement('a');
  link.download = `${currentIcon.value?.iconName || 'icon'}.${extension}`;
  link.style.display = 'none';
  link.referrerPolicy = 'no-referrer';
  link.href = base64Url;
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

/**
 * 将 SVG 标记转换为 base64 URL。
 *
 * @param svg SVG 标记。
 * @returns base64 URL。
 */
function convertToBase64(svg: string) {
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * 下载 SVG 文件。
 */
function downloadSvg() {
  const svgMarkup = getSvgMarkup();
  if (!svgMarkup || svgMarkup.trim() === '') return;
  downloadFile(convertToBase64(svgMarkup), 'svg');
}

/**
 * 下载 PNG 文件。
 */
function downloadPng() {
  const svgMarkup = getSvgMarkup();
  if (!svgMarkup || svgMarkup.trim() === '') return;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return;
  const svgElement = svgElementRef.value;
  const width = svgElement!.clientWidth;
  canvas.width = width;
  canvas.height = width;
  context.fillStyle = 'transparent';
  context.fillRect(0, 0, canvas.width, canvas.height);
  const image = new Image();
  image.src = convertToBase64(svgMarkup);
  image.onload = () => {
    context.drawImage(image, 0, 0);
    downloadFile(canvas.toDataURL('image/png'), 'png');
    canvas.remove();
    image.remove();
  };
}

/**
 * 旋转 SVG 元素。
 *
 * @param degrees 要旋转的角度。
 */
function rotateIcon(degrees: number | null) {
  if (!svgElementRef.value) return;
  rotationAngle.value += degrees || 0;
  applyTransformations();
}

/**
 * 设置 SVG 元素的旋转角度。
 *
 * @param degrees 旋转角度。
 */
function setRotationAngle(degrees: number | null) {
  if (!svgElementRef.value) return;
  rotationAngle.value = degrees || 0;
  applyTransformations();
}

/**
 * 设置 SVG 元素的缩放因子。
 *
 * @param scale 缩放因子。
 */
function setScaleFactor(scale: number | null) {
  if (scale === null) return;
  scaleFactor.value = scale;
  applyTransformations();
}

/**
 * 移动 SVG 元素。
 *
 * @param direction 要移动的方向 ('up', 'down', 'left', 'right').
 */
function moveIcon(direction: string) {
  const step = 10;
  if (direction === 'up') positionOffset.value.y -= step;
  if (direction === 'down') positionOffset.value.y += step;
  if (direction === 'left') positionOffset.value.x -= step;
  if (direction === 'right') positionOffset.value.x += step;
  applyTransformations();
}

/**
 * 应用 svg 变换。
 */
function applyTransformations() {
  if (!svgElementRef.value) return;
  const svgElement = svgElementRef.value!;
  svgElement.style.transform = `translate(${positionOffset.value.x}px, ${positionOffset.value.y}px) rotate(${rotationAngle.value}deg) scale(${scaleFactor.value})`;
}

/**
 * 切换网格的可见性。
 */
function toggleGridVisibility() {
  isGridVisible.value = !isGridVisible.value;
}
</script>

<template>
  <n-modal
    v-model:show="isModalVisible"
    preset="card"
    :style="{ width: '700px' }"
    title="Icon Details"
    size="huge"
    :bordered="false"
  >
    <div class="detail-wrapper">
      <div class="icon-container" :style="{ width: iconDimension, height: iconDimension }">
        <div v-if="isGridVisible" class="grid-overlay"></div>
        <svg
          v-if="currentIcon"
          xmlns="http://www.w3.org/2000/svg"
          :viewBox="currentIcon.viewBox"
          width="100%"
          height="100%"
          v-html="currentIcon.svgPath"
          ref="svgElement"
        ></svg>
      </div>
      <div class="controls" style="width: 300px; margin-left: 20px">
        <div class="label">颜色:</div>
        <n-color-picker :modes="['hex']" @update:value="updateColor" />
        <div class="label">旋转:</div>
        <div class="rotate-controls">
          <ReloadCircleOutline @click="rotateIcon(45)" />
          <ReloadCircleOutline
            style="transform: rotateY(-180deg)"
            @click="rotateIcon(-45)"
          />
          <div style="padding-top: 3px">
            <n-input-number
              size="medium"
              style="width: 200px"
              v-model:value="rotationAngle"
              @change="setRotationAngle"
              placeholder="Enter angle"
            ></n-input-number>
          </div>
        </div>
        <div class="label">缩放:</div>
        <n-input-number
          size="medium"
          style="width: 200px"
          v-model:value="scaleFactor"
          @change="setScaleFactor"
          placeholder="Enter scale factor"
        ></n-input-number>
        <div class="label">移动:</div>
        <div class="move-controls">
          <n-button @click="moveIcon('up')">↑</n-button>
          <n-button @click="moveIcon('down')">↓</n-button>
          <n-button @click="moveIcon('left')">←</n-button>
          <n-button @click="moveIcon('right')">→</n-button>
        </div>
        <div class="label">网格:</div>
        <n-button @click="toggleGridVisibility">{{ isGridVisible ? '隐藏' : '显示' }}</n-button>
      </div>
    </div>
    <div style="margin-top: 20px">
      <n-space justify="center" size="large">
        <n-button type="primary" @click="downloadPng">下载 PNG</n-button>
        <n-button type="primary" @click="downloadSvg">下载 SVG</n-button>
        <n-button type="primary" @click="copySvgToClipboard">复制 SVG</n-button>
      </n-space>
    </div>
  </n-modal>
</template>

<style lang="scss" scoped>
.detail-wrapper {
  display: flex;
  user-select: none;

  .icon-container {
    position: relative;
    border: 2px solid #e2e2e2;
    border-radius: 10px;
    padding: 30px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;

    .grid-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: linear-gradient(to right, #ccc 1px, transparent 1px),
        linear-gradient(to bottom, #ccc 1px, transparent 1px);
      background-size: 20px 20px;
      pointer-events: none;
      z-index: 0; // Ensure grid is beneath the SVG
    }

    svg {
      position: relative;
      z-index: 1; // Ensure SVG is above the grid
    }
  }

  .label {
    font-size: 16px;
    margin-bottom: 6px;
    color: #696969;
    font-weight: bold;
  }

  .rotate-controls,
  .move-controls {
    display: flex;
    gap: 10px;

    & > svg,
    & > button {
      width: 40px;
      height: 40px;
      cursor: pointer;
      transition: color 0.2s linear;

      &:hover {
        color: orange;
      }
    }
  }
}
</style>
