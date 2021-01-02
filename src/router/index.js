import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/home.vue'),
  },
  {
    path: '/create',
    name: 'Create',
    component: () => import('../views/create.vue'),
    meta: {
      requiresAuth: true
  }
  },
  {
    path: '/edit/:pk',
    name: 'Edit',
    component: () => import('../views/create.vue'),
    meta: {
      requiresAuth: true
  }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/dashboard.vue'),
    meta: {
      requiresAuth: true
  }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login.vue'),
    meta: {
      guest: true
  }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/register.vue'),
    meta: {
      guest: true
  }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/register.vue'),
    meta: {
      requiresAuth: true,
      is_admin: true
  }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/profile/profile.vue'),
    meta: {
      requiresAuth: true
  }
  },
]

const router = new VueRouter({
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  mode: 'hash',
  routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
      if (localStorage.getItem('jwt') == null) {
          next({
              path: '/login',
          })
      } else {
        let userAdmin = localStorage.getItem('isAdmin')
        if(to.matched.some(record => record.meta.is_admin)) {
          if(userAdmin){
              next()
          }
          else{
              next({ path: "/dashboard" })
          }
      }else {
          next()
      }
      }
  } else if(to.matched.some(record => record.meta.guest)) {
      if(localStorage.getItem('jwt') == null){
          next()
      }
      else{
        next({ 
            path: "/dashboard"
          })
      }
  }else {
      next()
  }
})

// To avoid Display error
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
}

export default router;
