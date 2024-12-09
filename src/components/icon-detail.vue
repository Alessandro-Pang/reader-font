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

const showModal = ref(false);
const iconContent: Ref<IconProps | null> = ref(null);
const message = useMessage();
const iconRotate = ref(0);

function open(icon: IconProps) {
  showModal.value = true;
  iconContent.value = icon;
  iconRotate.value = 0;
}

defineExpose({ open });

const svgIcon = useTemplateRef('svgIcon');
function handleChangeColor(color: string) {
  if (!svgIcon) return;
  svgIcon.value!.style.fill = color;
}

function getSvgContent() {
  if (!svgIcon.value) return;
  const svgElement = svgIcon.value!.cloneNode(true) as SVGSVGElement;
  Array.from(svgElement.attributes).forEach((attr) => {
    if (attr.name.startsWith('data-v-')) {
      svgElement.removeAttribute(attr.name);
    }
  });
  return svgElement.outerHTML;
}

/**
 * 复制 SVG 图标到剪切板
 */
function handleCopySVG() {
  const svg = getSvgContent();
  if (!svg || svg.trim() === '') return;
  navigator.clipboard.writeText(svg);
  message.success('复制成功');
}

/**
 * 下载文件
 * @param base64Url
 * @param ext
 */
function downloadFile(base64Url: string, ext: string = 'svg') {
  const aLink = document.createElement('a');
  aLink.download = `${iconContent.value?.iconName || 'icon'}.${ext}`;
  aLink.style.display = 'none';
  aLink.referrerPolicy = 'no-referrer';
  aLink.href = base64Url;
  aLink.click();
  aLink.remove();
  URL.revokeObjectURL(aLink.href);
}

/**
 * 下载 SVG 图标
 */
function handleDownloadSVG() {
  const svg = getSvgContent();
  if (!svg || svg.trim() === '') return;
  const base64Url = `data:image/svg+xml;base64,${btoa(svg)}`;
  downloadFile(base64Url, 'svg');
}

/**
 * 下载 PNG 图标
 */
function handleDownloadPNG() {
  const svg = getSvgContent();
  if (!svg || svg.trim() === '') return;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return;
  const svgElement = svgIcon.value;
  const width = svgElement!.clientWidth;
  canvas.width = width;
  canvas.height = width;
  context.fillStyle = 'transparent';
  context.fillRect(0, 0, canvas.width, canvas.height);
  const image = new Image();
  image.src = `data:image/svg+xml;base64,${btoa(svg)}`;
  image.onload = () => {
    context.drawImage(image, 0, 0);
    downloadFile(canvas.toDataURL('image/png'), 'png');
    canvas.remove();
    image.remove();
  };
}

/**
 * 旋转图标
 * @param deg
 */
function handleRotateIcon(deg: number | null) {
  if (!svgIcon.value) return;
  const svgElement = svgIcon.value!;
  iconRotate.value += deg || 0;
  svgElement.style.transform = `rotate(${iconRotate.value}deg)`;
}

/**
 * 修改图标旋转角度
 * @param deg
 */
function handleChangeRotate(deg: number | null) {
  if (!svgIcon.value) return;
  const svgElement = svgIcon.value!;
  iconRotate.value = deg || 0;
  svgElement.style.transform = `rotate(${iconRotate.value}deg)`;
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
        <div class="action--label">颜色：</div>
        <n-color-picker :modes="['hex']" @update:value="handleChangeColor" />
        <div class="action--label">旋转：</div>
        <div class="icon-rotate">
          <ReloadCircleOutline @click="handleRotateIcon(45)" />
          <ReloadCircleOutline
            style="transform: rotateY(-180deg)"
            @click="handleRotateIcon(-45)"
          />
          <div style="padding-top: 3px">
            <n-input-number
              size="medium"
              style="width: 200px"
              v-model:value="iconRotate"
              @change="handleChangeRotate"
               placeholder="请输入角度"
            ></n-input-number>
          </div>
        </div>
      </div>
    </div>
    <div style="margin-top: 20px">
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
  user-select: none;

  .icon-view {
    width: 200px;
    height: 200px;
    border: 2px solid #e2e2e2;
    border-radius: 10px;
    padding: 30px;
    overflow: hidden;
  }

  .action--label {
    font-size: 16px;
    margin-bottom: 6px;
    color: #696969;
  }

  .icon-rotate {
    display: flex;

    & > svg {
      width: 40px;
      height: 40px;
      margin-right: 10px;
      cursor: pointer;
      transition: color 0.2s linear;

      &:hover {
        color: orange;
      }
    }
  }
}
</style>
