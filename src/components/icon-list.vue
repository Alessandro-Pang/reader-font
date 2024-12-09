<!--
 * @Author: zi.yang
 * @Date: 2024-12-09 11:34:25
 * @LastEditors: zi.yang
 * @LastEditTime: 2024-12-09 19:39:32
 * @Description: 字体列表
 * @FilePath: /reader-font/src/components/icon-list.vue
-->
<script setup lang="ts">
import { ref, Ref, useTemplateRef, watchEffect } from 'vue';

import { NButton, NInput, NInputGroup } from 'naive-ui';
import type { Font, GlyphSet } from 'opentype.js';

import iconDetail from './icon-detail.vue';

type IconProps = {
  unicode: number;
  iconName: string;
  viewBox: string;
  svgPath: string;
};

const props = defineProps<{ font: Font }>();

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

const allIconList: Ref<IconProps[]> = ref([]);
const iconList: Ref<IconProps[]> = ref([]);

watchEffect(() => {
  allIconList.value = generatorIconList(props.font);
  iconList.value = allIconList.value;
});

const iconDetailRef = useTemplateRef('iconDetailRef');
function handleOpenEdit(icon: IconProps) {
  iconDetailRef.value?.open(icon);
}

function handleSearch(text: string) {
  iconList.value = allIconList.value.filter((item) =>
    item.iconName.toLowerCase().includes(text.toLowerCase())
  );
}
</script>

<template>
  <div style="margin: 16px 0">
    <n-input-group style="justify-content: center">
      <n-input @change="handleSearch" style="width: 60%" size="large" placeholder="请输入名称"></n-input>
      <n-button type="primary" ghost size="large">搜索</n-button>
    </n-input-group>
  </div>

  <ul class="icon-list--wrapper">
    <li v-for="svg of iconList" :key="svg.unicode" class="icon--item">
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
</template>

<style lang="scss" scoped>
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
  width: 16%;
  min-width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  &-box {
    width: 30px;
    height: 30px;
    margin-bottom: 16px;
    cursor: pointer;

    &:hover > svg {
      fill: orange;
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
