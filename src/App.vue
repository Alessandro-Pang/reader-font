<!--
 * @Author: zi.yang
 * @Date: 2024-12-05 09:23:18
 * @LastEditors: zi.yang
 * @LastEditTime: 2024-12-08 13:53:35
 * @Description: 
 * @FilePath: /reader-font/src/App.vue
-->
<script setup lang="ts">
import { ref, Ref, useTemplateRef } from 'vue';

import {
  NIcon,
  NMessageProvider,
  NP,
  NText,
  NUpload,
  NUploadDragger,
  UploadFileInfo,
} from 'naive-ui';
import opentype, {
  Font,
  GlyphSet,
} from 'opentype.js';

import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5';

import iconDetail from './components/icon-detail.vue';

type IconProps = {
  unicode: number;
  iconName: string;
  viewBox: string;
  svgPath: string;
};

/**
 * 生成图标列表函数
 *
 * @param font Font对象，包含字体信息
 * @returns 返回包含图标属性的数组
 */
function generatorIconList(font: Font) {
  const genIconList: IconProps[] = [];
  if (!font?.glyphs) return genIconList;
  const glyphs: GlyphSet = font.glyphs;
  for (let i = 0; i < glyphs.length; i++) {
    const glyph = glyphs.get(i);
    if (!glyph.unicode) continue;
    const path = glyph.getPath();
    const { x1, y1, x2, y2 } = path.getBoundingBox();
    genIconList.push({
      unicode: glyph.unicode,
      iconName: glyph.name || '',
      viewBox: `${x1} ${y1} ${x2 - x1} ${y2 - y1}`,
      svgPath: path.toSVG(2),
    });
  }
  return genIconList;
}

const iconList: Ref<IconProps[]> = ref([]);
const fileList = ref<UploadFileInfo[]>([]);
function handleUploadChange(evt: any) {
  const lastFile = evt.at(-1)
  if(!lastFile) return
  fileList.value = [lastFile]
  lastFile.file.arrayBuffer().then(async (buffer: ArrayBuffer) => {
    const font = opentype.parse(await buffer);
    iconList.value = generatorIconList(font);
  });
}

const iconDetailRef = useTemplateRef('iconDetailRef');
function handleOpenEdit(icon: IconProps) {
  iconDetailRef.value?.open(icon);
}
</script>

<template>
  <n-message-provider>
    <header class="header">
      Reader Font
    </header>
    <div style="width: 80%; margin: 30px auto;">
      <n-upload v-model:file-list="fileList" directory-dnd @update:file-list="handleUploadChange" accept=".ttf,.woff">
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <n-icon size="48" :depth="3">
              <ArchiveIcon />
            </n-icon>
          </div>
          <n-text style="font-size: 16px">
            点击或者拖动文件到该区域来上传
          </n-text>
          <n-p depth="3" style="margin: 8px 0 0 0">
            请上传字体文件, 目前仅支持 ttf, woff 格式字体文件
          </n-p>
        </n-upload-dragger>
      </n-upload>
    </div>

    <ul class="icon-list--wrapper">
      <li  v-for="svg of iconList" :key="svg.unicode" class="icon--item">
        <div class="icon--item-box" @click="handleOpenEdit(svg)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            :viewBox="svg.viewBox"
            style="width: 100%; height: 100%"
            v-html="svg.svgPath"
          ></svg>
        </div>
        <div>{{ svg.iconName }}</div>
      </li>
    </ul>

    <icon-detail ref="iconDetailRef"></icon-detail>
  </n-message-provider>
</template>

<style lang=scss scoped>
.header {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 28px;
  font-weight: 600;
}
.icon-list--wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0;
  padding: 0;
}

.icon--item {
  list-style: none;
  margin: 16px 0;
  width: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  &-box {
    width: 30px; 
    height: 30px; 
    margin-bottom: 16px; 
    cursor: pointer;

    &:hover > svg{
      fill: orange
    }
  }
}

svg {
  fill: #fff;
  transition: fill 0.3s ease;
}

@media (prefers-color-scheme: light) {
  svg {
    fill: #000;
  }
}
</style>
