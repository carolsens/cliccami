/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import LoginPage from "../pages/login.vue";
import Index from "../pages/index.vue";
import pagePage from "@/pages/pagePage.vue";
import mideaPage from "@/pages/mideaPage.vue";
import userPage from "@/pages/userPage.vue";

const routes = [
  {
    path: '/',
    name: 'homePage',
    component: Index,
    meta: { layout: 'default' }
  },
  {
    path: '/video',
    name: 'mideaPage',
    component: mideaPage,
    meta: { layout: 'default' }
  },
  {
    path: '/page',
    name: 'pagePage',
    component: pagePage,
    meta: { layout: 'default' }
  },
  {
    path: '/login',
    name: 'loginPage',
    component: LoginPage,
    meta: { layout: 'login' }
  },
  {
    path: '/user',
    name: 'userPage',
    component: userPage,
    meta: { layout: 'default' }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes)
})

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token');

  if (!token && to.name !== 'loginPage') {
    return next({ name: 'loginPage' });
  }

  else if (token && to.name === 'loginPage') {
    return next({ name: 'homePage' });
  }

  else {
    next(); // Permite a navegação para outras rotas
  }
});
export default router
