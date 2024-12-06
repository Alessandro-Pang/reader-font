<!--
 * @Author: zi.yang
 * @Date: 2024-12-05 09:23:18
 * @LastEditors: zi.yang
 * @LastEditTime: 2024-12-05 14:08:06
 * @Description: 
 * @FilePath: /reader-font/src/App.vue
-->
<script setup lang="ts">
import { ref, Ref } from 'vue';

import { NP, NText, NUpload, NUploadDragger } from 'naive-ui';
import opentype from 'opentype.js';

const iconList: Ref<any[]> = ref([]);

function handleUploadChange(evt) {
  evt.file.file.arrayBuffer().then(async (buffer) => {
    const font = opentype.parse(await buffer);
    iconList.value = []
    const glyphs = font.glyphs.glyphs;
    Object.keys(glyphs).forEach((key) => {
      const glyph = glyphs[key];
      if (!glyph.unicode) return;
      const path = glyph.getPath();
      const boundingBox = path.getBoundingBox();
      const viewBox = `${boundingBox.x1} ${boundingBox.y1} ${boundingBox.x2 - boundingBox.x1
        } ${boundingBox.y2 - boundingBox.y1}`;
      iconList.value.push({
        unicode: glyph.unicode,
        iconName: glyph.name,
        viewBox,
        svgPath: path.toSVG(),
      });
    });
  })
}
</script>

<template>
  <div style="width: 80%; margin: 30px auto">
    <n-upload directory-dnd @change="handleUploadChange">
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
          请上传字体文件, 支持 ttf, otf, woff 格式
        </n-p>
      </n-upload-dragger>
    </n-upload>
  </div>

  <ul>
    <li v-for="svg of iconList">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" :viewBox="svg.viewBox"
          style="width: 30px; height: 30px" v-html="svg.svgPath"></svg>
      </div>
      <div>{{ svg.iconName }}  {{ svg.unicode.toString(16) }}</div>
    </li>
  </ul>
</template>

<style scoped>
ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0;
  padding: 0;
}

li {
  list-style: none;
  margin: 10px;
  width: 10%;
}
</style>
