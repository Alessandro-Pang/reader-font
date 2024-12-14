<!--
 * @Author: zi.yang
 * @Date: 2024-12-05 09:23:18
 * @LastEditors: zi.yang
 * @LastEditTime: 2024-12-13 10:31:44
 * @Description: 
 * @FilePath: /reader-font/src/App.vue
-->
<script setup lang="ts">
import { ref, Ref } from 'vue';

import {
  NIcon,
  NMessageProvider,
  NP,
  NText,
  NUpload,
  NUploadDragger,
  UploadFileInfo,
} from 'naive-ui';
import opentype, { Font } from 'opentype.js';

import { ArchiveOutline as ArchiveIcon, LogoGithub } from '@vicons/ionicons5';

import iconList from './components/icon-list.vue';

const fontContent: Ref<Font | null> = ref(null);
const fileList = ref<UploadFileInfo[]>([]);
function handleUploadChange(evt: any) {
  const lastFile = evt.at(-1);
  if (!lastFile) return;
  fileList.value = [lastFile];
  lastFile.file.arrayBuffer().then(async (buffer: ArrayBuffer) => {
    fontContent.value = opentype.parse(await buffer);
  });
}

</script>

<template>
  <n-message-provider>
    <header class="header">
      <div class="header--title">Reader Font</div>
      <div>
        <a href="https://github.com/Alessandro-Pang/reader-font" target="_blank" class="header--icon">
          <LogoGithub />
        </a>
      </div>
    </header>
    <div style="width: 80%; margin: 30px auto">
      <n-upload v-model:file-list="fileList" directory-dnd @update:file-list="handleUploadChange"
        accept=".ttf,.woff">
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
    <icon-list v-if="fontContent" :font="fontContent" />
  </n-message-provider>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  height: 50px;
  padding: 0 20px;
  line-height: 50px;
  border-bottom: 1px solid #e2e2e2;

  &--title {
    font-size: 24px;
    font-weight: 600;
  }

  &--icon {
    width: 26px;
    display: inline-block;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    cursor: pointer;
  }
}
</style>
