# REALM OF NOVA — RPG 最終版

這個版本的設計核心不是「學習 RPG」，而是「一款 RPG，其中學院/學習是其中一個支線系統」。

## 目前內容
- Lv.0 起始角色與完整 XP 升級
- 世界地圖：森林、遺跡、城鎮、競技場
- 探索、隨機事件、戰鬥、Boss
- 主線、每日、自訂任務
- 裝備欄位：武器/防具/頭部/飾品/鞋子/特殊
- 背包、消耗品、商店
- 寵物、親密度、寵物等級
- 成就
- 學院：10 題挑戰（只是 RPG 的其中一個系統）
- 手機/電腦響應式介面
- Supabase 帳號與雲端存檔

## GitHub Pages
把 index.html、style.css、app.js、config.js、schema.sql、README.md 上傳到 GitHub。
Settings → Pages → Deploy from a branch → main → /(root)。

## 雲端同步
1. 到 Supabase 建立專案。
2. SQL Editor 執行 schema.sql。
3. Project Settings → API 取得 Project URL 和 anon public key。
4. 填入 config.js：
window.RPG_CONFIG={
  supabaseUrl:"你的 Project URL",
  supabaseAnonKey:"你的 anon public key"
};
5. 將 config.js 重新上傳 GitHub。
6. 手機和電腦打開同一個 GitHub Pages 網址。
7. 使用同一個 Email/密碼登入。

不要把 service_role key 放進前端網站。

如果沒有設定 Supabase，遊戲仍可玩，但存檔只存在目前裝置。
