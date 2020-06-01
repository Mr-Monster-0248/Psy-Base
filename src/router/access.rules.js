import store from '@/store';

function requiresAdmin(to, from, next) {
  if (store.getters['auth/isAdmin']) next();
  else next(false);
}

function requiresAuth(to, from, next) {
  if (to.path !== '/login') {
    if (store.getters['auth/isLoggedIn']) next();
    else next('/login');
  } else next();
}

function isAuth() {
  return store.getters['auth/isLoggedIn'];
}

export default {
  requiresAdmin,
  requiresAuth,
  isAuth,
};
