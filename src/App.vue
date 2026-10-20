<template>
  <header class="app-header">
    <div class="header-inner">
      <router-link to="/" class="logo">
        <span class="logo-mark" aria-hidden="true"></span>
        <span class="logo-text">智能天气</span>
      </router-link>
      <nav class="nav">
        <router-link to="/">首页</router-link>
        <router-link to="/favorites">收藏</router-link>
      </nav>
    </div>
  </header>

  <main class="container">
    <router-view />
  </main>

  <footer class="app-footer">
    <p>数据来源 Open-Meteo · 区划数据 DataV.GeoAtlas </p>
  </footer>
</template>

<style scoped>
.app-header {
  background: var(--c-paper);
  border-bottom: 1px solid var(--c-line);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  max-width: 640px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  text-decoration: none;
}

/* 砖红方形标记，代替 emoji logo */
.logo-mark {
  width: 12px;
  height: 12px;
  background: var(--c-accent);
  border-radius: 2px;
}

.logo-text {
  font-size: 17px;
  font-weight: 700;
  color: var(--c-ink);
  letter-spacing: 1px;
}

.nav {
  display: flex;
  gap: 20px;
}

.nav a {
  color: var(--c-ink-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding-bottom: 2px;
  border-bottom: 1.5px solid transparent;
  transition: color 0.15s, border-color 0.15s;
}

.nav a:hover {
  color: var(--c-ink);
}

/* 激活项：文字变黑 + 砖红下划线 */
.nav a.router-link-active {
  color: var(--c-ink);
  border-bottom-color: var(--c-accent);
}

.app-footer {
  border-top: 1px solid var(--c-line);
  text-align: center;
  color: var(--c-ink-muted);
  font-size: 12px;
  padding: 18px 16px 26px;
}
</style>
