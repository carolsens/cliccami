<template>
  <v-container fluid>

    <v-card flat class="py-4 mx-5">
      <v-toolbar class="pl-0 mb-4"
                 color="white">
        <v-toolbar-title class="">Galeria de vídeos</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-movie-plus" @click="dialogMideaView = true">
          <v-icon>
            mdi-movie-plus
          </v-icon>
        </v-btn>
      </v-toolbar>

      <v-row>
        <v-col
          v-for="(midea, index) in mideaList"
          :key="index"
          cols="2"
        >
          <v-card style="height: 310px;">
            <v-img
              :src="midea.imageContent"
              class="bg-grey-lighten-2"
              style="width: 100%; height: 200px;"
            ></v-img>
            <v-card-item class="pb-0">
              <p class="text-subtitle-1 font-weight-black">{{ midea.name }}</p>

                 <span class="text-caption">Páginas vinculadas: {{ midea.mideaPages.length }}

              </span>



            </v-card-item>


            <v-card-actions class="py-2 justify-center">
              <v-btn flat size="xs" @click="openPageView(midea)" class="mt-0">
                <v-icon color="secondary">mdi-open-in-new</v-icon>
                <v-tooltip activator="parent" location="bottom">Ver páginas vinculadas</v-tooltip>
              </v-btn>
              <v-btn flat size="xs" @click="currentMidea = midea.id; removeView = true" class="mt-0">
                <v-icon color="secondary">mdi-delete</v-icon>
                <v-tooltip activator="parent" location="bottom">Excluir</v-tooltip>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      </v-card>
    <v-dialog v-model="removeView" max-width="500px">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="text-h5 text-medium-emphasis">
            Remover vídeo
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="removeView = false"
          ></v-btn>
        </v-card-title>

        <v-card-text class="pb-5">
          Você tem certeza que deseja remover este vídeo?
        </v-card-text>

        <v-card-actions class="d-flex justify-end">
          <v-btn
            @click="removeView = false"
            class="mr-3"
          >
            Não
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            @click="removeMidea(); removeView = false"
          >
            Sim
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="pageView" max-width="500px">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="text-h5 text-medium-emphasis">
            Páginas vinculadas
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="pageView = false"
          ></v-btn>
        </v-card-title>

        <v-card-text class="pb-5 pl-0">
          <v-list class="pl-0">
            <v-list-item class="pl-0"
              v-for="(item, index) in selectedMideaPages"
              :key="index"
            >
              <v-list-item><v-icon>mdi-circle-small</v-icon>{{ item.page.site.name }}</v-list-item>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import {ref, defineComponent} from 'vue';
import DialogMidea from "@/components/DialogMidea.vue";
import MideaService from "@/services/MideaService";

export default defineComponent({
  props: {
    modelValue: Boolean
  },
  components: { DialogMidea },
  setup(props, {emit}) {
    const dialogMideaView = ref(false);
    const snackbar = ref(false);
    const textSnackbar = ref('');
    const timeoutSnackbar = ref(3000);
    const colorSnackbar = ref('');
    const loadingView = ref(false);
    const removeView = ref(false);
    const pageView = ref(false);
    const mideaList = ref<any[]>([]);
    const totalItems = ref(0);
    const currentMidea = ref('');


    const findData = async () => {
      try {
        loadingView.value = true
        const response = await MideaService.list();
        mideaList.value = response;

        totalItems.value = mideaList.value.length;

        loadingView.value = false
      } catch (error) {
        console.error("Erro ao obter dados das pesquisas:", error);
      }
    };



    onMounted(() => {
      findData()
    })


    const removeMidea = async () => {
      try {



        await MideaService.delete(currentMidea.value)
          await findData();
      } catch (error) {
        console.error('Erro ao remover midea:', error);
      }
    };
    const selectedMideaPages = ref<any[]>([]);
    const openPageView = (midea:any) => {
      selectedMideaPages.value = midea.mideaPages;
      pageView.value = true;
    };

    return {
      selectedMideaPages,
      openPageView,
      removeMidea,
      loadingView,
      snackbar,
      textSnackbar,
      timeoutSnackbar,
      colorSnackbar,
      dialogMideaView,
      mideaList,
      totalItems,
      removeView,
      currentMidea,
      pageView
    }
  }
});
</script>
