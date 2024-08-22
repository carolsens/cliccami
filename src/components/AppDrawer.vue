<template>
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      color="primary"
    >
      <div>

        <v-img v-if="!rail" src="../assets/cliccami_gray.svg" style="max-width: 200px; max-height: 50px"  class="mx-auto mt-5 mb-2"/>
        <v-img v-else src="../assets/cliccami_mini.svg"  style="max-width: 30px;" class="mx-2 mt-2 mx-auto" />
      </div>
      <v-btn
        v-if="!rail"
        flat
        size="x-small"
        color="white"
        class="pa-0"
        @click.stop="rail = !rail"
        style="position: absolute; top: 20px; left: 245px; z-index: 999; min-width: 20px;"
      >
        <v-icon  size="large" color="primary" icon="mdi-chevron-double-left"/>
      </v-btn>
      <v-btn
        v-else
        flat
        class="pa-0"
        size="x-small"
        color="white"
        @click.stop="rail = !rail"
        style="position: absolute; top: 20px; left: 50px; z-index: 999; min-width: 20px;"
      >
        <v-icon  size="large" color="primary" icon="mdi-chevron-double-right"/>
      </v-btn>


      <v-list density="compact" nav :lines="false">

        <div class="pt-5"/>
        <v-list-item prepend-icon="mdi-home-city" title="Home" value="home" @click="goToRoute('homePage')" color="white">
          <v-tooltip  v-if="rail"
                      activator="parent"
                      location="right"
          >
            <span>Home</span>
          </v-tooltip>
        </v-list-item>

        <v-list-item prepend-icon="mdi-view-list-outline" title="Páginas" value="page" @click="goToRoute('pagePage')">
          <v-tooltip  v-if="rail"
                      activator="parent"
                      location="right"
                      color="red"
          >
            <span>Páginas</span>
          </v-tooltip>
        </v-list-item>

        <v-list-item prepend-icon="mdi-video" title="Galeria de vídeos" value="video" @click="goToRoute('mideaPage')">
          <v-tooltip  v-if="rail"
                      activator="parent"
                      location="right"
                      color="red"
          >
            <span>Galeria de vídeos</span>
          </v-tooltip>
        </v-list-item>

        <v-list-item v-if="email === 'carolsens@gmail.com'" prepend-icon="mdi-account-group" title="Usuários" value="search" @click="goToRoute('userPage')">
          <v-tooltip  v-if="rail"
                      activator="parent"
                      location="right"
                      color="red"
          >
            <span>Usuários</span>
          </v-tooltip>
        </v-list-item>



      </v-list>


    </v-navigation-drawer>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
export default {
  setup() {
    const router = useRouter();
    const drawer = ref(true);
    const rail = ref(true);
    const email = ref(localStorage.getItem('email'))

    const goToRoute = (routeName: string) => {
      router.push({ name: routeName });
    };
    return {
      drawer,
      rail,
      goToRoute,
      email
    };
  },
};
</script>
