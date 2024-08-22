<template>
    <v-app-bar :elevation="1" color="secondary">
      <!--      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>-->
      <v-app-bar-title></v-app-bar-title>

      <template v-slot:append>
        <v-menu location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-account" color="primary"
            >
            </v-btn>
          </template>

          <v-card
            class="mx-auto mt-1"
            v-if="user"
            :subtitle="user"
            width="400"
          >
            <template v-slot:prepend>
              <v-avatar color="primary">
                <v-icon icon="mdi-account"></v-icon>
              </v-avatar>
            </template>
            <template v-slot:append>
              <v-avatar>
                <v-btn icon="mdi-logout" flat @click="onLogout()">
                  <v-icon
                    size="small"
                    class="table-text"
                  >
                    mdi-logout
                  </v-icon>
                  <v-tooltip activator="parent" location="bottom">Logout</v-tooltip>
                </v-btn>
              </v-avatar>
            </template>


          </v-card>
        </v-menu>
      </template>
    </v-app-bar>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import {useRouter} from "vue-router";
export default defineComponent({
  setup() {

    const user = localStorage.getItem('email');

    const onLogout = async () => {
      localStorage.clear();
      return goToRoute( 'loginPage')
    }

    const router = useRouter();
    const goToRoute = (routeName: any) => {
      router.push({ name: routeName });
    };


    return {
      user,
      onLogout
    }
  }
})
</script>
