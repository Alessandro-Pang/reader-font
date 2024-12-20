# Reader Font

Reader Font 是一个强大的字体文件读取工具，专为读取和展示字体文件中的内容而设计。它支持字体图标的单个导出、下载等操作，帮助用户轻松管理和使用字体图标。

在线演示地址：[https://alexpang.cn/reader-font/](https://alexpang.cn/reader-font/)

## 功能特性

- **字体上传**：支持上传 `.ttf` 和 `.woff` 格式的字体文件。
- **图标浏览**：展示字体文件中的所有图标，支持按名称搜索。
- **图标详情**：查看图标的详细信息，包括 Unicode、名称、SVG 路径等。
- **图标操作**：
  - 更改颜色
  - 旋转、缩放、位移
  - 显示/隐藏网格
  - 下载 SVG 和 PNG 格式
  - 复制 SVG 代码

## 安装与运行

### 环境要求

- Node.js 版本 >= 14
- npm 版本 >= 6

### 安装步骤

1. 克隆项目到本地：

   ```bash
   git clone https://github.com/Alessandro-Pang/reader-font.git
   ```

2. 进入项目目录：

   ```bash
   cd reader-font
   ```

3. 安装依赖：

   ```bash
   npm install
   ```

4. 启动项目：

   ```bash
   npm run dev
   ```

5. 在浏览器中打开 `http://localhost:3000` 查看项目。

## 使用说明

1. **上传字体**：点击或拖动字体文件到上传区域。
2. **浏览图标**：上传成功后，界面将展示字体中的所有图标。
3. **查看详情**：点击图标查看详细信息和操作选项。
4. **操作图标**：在详情弹窗中，您可以更改图标颜色、旋转、缩放、位移等。
5. **下载与复制**：支持下载图标为 SVG 或 PNG 格式，或复制 SVG 代码。

## 截图

![浏览](readme/image.png)

![编辑](readme/image-2.png)

## 贡献指南

欢迎对本项目进行贡献！请遵循以下步骤：

1. Fork 本仓库。
2. 创建您的功能分支 (`git checkout -b feature/YourFeature`)。
3. 提交您的更改 (`git commit -m 'Add some feature'`)。
4. 推送到分支 (`git push origin feature/YourFeature`)。
5. 提交 Pull Request。

## 许可证

本项目基于 MIT 许可证开源，详情请参阅 [LICENSE](LICENSE) 文件。


