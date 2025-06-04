<template>
  <div>
    <header>
      <h1>Refugio de Gatos</h1>
      <nav>
        <RouterLink to="/">Inicio</RouterLink>
        <RouterLink to="/gatos">Gatos</RouterLink>
      </nav>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>
