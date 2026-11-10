# 疼痛：受苦的科学

Patrick D. Wall, *Pain: The Science of Suffering*（Columbia University Press, 2000）的中文译本阅读站。

- 正文按章对应原文段落，每段可在页面右上角切换显示英文原文。
- 正文字体用系统黑体。右上角"设置"打开底部设置面板：字号三档（中／大／特大）与"显示英文原文"开关，都记在 localStorage（键 `pain-zh:font-size`、`pain-zh:show-en`）。
- 阅读进度存在浏览器的 localStorage（键 `pain-zh:progress:v1`）：章节顶部显示"上次读到 22% · 昨天"的继续条，目录页顶部显示"继续阅读"卡片，目录每一行显示已读百分比。
- 站点用 Astro 生成，发布在 GitHub Pages。

链接结构：`/pain-zh/<slug>/`，slug 为 `preface`、`ch01`–`ch11`、`epilogue`。

## 本地

```bash
npm ci
npm run check   # 校验中文与原文段落是否对齐
npm run build
npx astro preview
```

原文版权归 Patrick D. Wall 与 Columbia University Press 所有；本站译文仅供学习参考。
