<template>
  <v-container fluid>

      <v-card flat class="py-4 mx-5">
        <v-card-title class="pl-0 mb-4">
          Bem vindo,
        </v-card-title>

        <v-row>
          <v-col cols="6">
            <v-card
              class="py-4"
              color="surface-variant"
              href="https://vuetifyjs.com/"
              rel="noopener noreferrer"
              rounded="lg"
              target="_blank"
              variant="text"
            >
              <v-overlay
                opacity=".06"
                scrim="primary"
                contained
                model-value
                persistent
              />
              <v-row no-gutters>
                <v-col cols="3" class="d-flex justify-center align-center">
                  <div class="display-4 font-weight-bold text-lg-h2">{{ midea }}</div>
                </v-col>
                <v-col cols="9" class="d-flex align-center">
                  <div>Vídeos</div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col cols="6">
            <v-card
              class="py-4"
              color="surface-variant"
              href="https://vuetifyjs.com/"
              rel="noopener noreferrer"
              rounded="lg"
              target="_blank"
              variant="text"
            >
              <v-overlay
                opacity=".06"
                scrim="primary"
                contained
                model-value
                persistent
              />
              <v-row no-gutters>
                <v-col cols="3" class="d-flex justify-center align-center">
                  <div class="display-4 font-weight-bold text-lg-h2">{{ page }}</div>
                </v-col>
                <v-col cols="9" class="d-flex align-center">
                  <div>Páginas</div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

        </v-row>
      </v-card>

  </v-container>
</template>


<script lang="ts">
import { ref, defineComponent } from 'vue';
import DashboardService from "@/services/DashboardService";

export default defineComponent({
  name: 'homePage',
  components: {  },
  setup() {


    const snackbar = ref(false);
    const textSnackbar = ref('');
    const timeoutSnackbar = ref(3000);
    const colorSnackbar = ref('');
    const loadingView = ref(false);
    const page = ref(0);
    const midea = ref(0);
    const loadData = async () => {
      try {
        loadingView.value = true
        const response = await DashboardService.dashboard();
        midea.value = response.totalVideos
        page.value = response.totalPages
        loadingView.value = false
      } catch (error) {
        loadingView.value = false
        textSnackbar.value = 'Não foi possível atualizar seu dashboard';

        colorSnackbar.value = '#B00020'
        snackbar.value = true
      }
    };

    onMounted(() =>
      loadData()
    )



    return {
      midea,
      page,
      loadingView,
      snackbar,
      textSnackbar,
      colorSnackbar,
      timeoutSnackbar
    }

  }
});
</script>
