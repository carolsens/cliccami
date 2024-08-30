<template>
  <v-container fluid>

    <v-card flat class="py-4 mx-5">
      <v-toolbar class="pl-0 mb-4"
                 color="white">
        <v-toolbar-title class="">Páginas</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-movie-plus" @click="dialogMideaView = true">
          <v-icon>
            mdi-movie-plus
          </v-icon>
        </v-btn>
      </v-toolbar>
      <v-data-table
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="pageList"
        :items-length="totalItems"
        item-value="name"
        no-data-text="Não há dados disponíveis."
      >

        <template v-slot:[`item.type`]="{ item }">
          <div >
            <span class="table-text" >{{ item.type}}</span>
          </div>
        </template>

        <template v-slot:[`item.page`]="{ item }">
          <div  >
            <span class="table-text" >{{ item.site ? item.site.name : 'Não consta'}}</span>
          </div>
        </template>


        <template v-slot:[`item.url`]="{ item }">
          <div  >
            <span class="table-text" >{{ item.site ? item.site.url : 'Não consta'}}</span>
          </div>
        </template>

        <template v-slot:[`item.midea`]="{ item }">
          <v-row>
            <div style="display: flex; flex-wrap: wrap; gap: 4px; min-width: 50px">
              <v-chip
                v-for="(mideaItem, index) in item.mideaPages"
                :key="index"
                class="ma-1"
                outlined
                color="primary"
                closable
                @click:close="currentMidea = mideaItem.id; removeView = true"
              >
                {{ mideaItem.midea.name }}
              </v-chip>
              <span v-if="!item.mideaPages || item.mideaPages.length === 0">Não consta</span>
            </div>
            <v-btn flat size="xs" @click="currentMidea = item.id; addMidea()" class="mt-0 mx-3">
              <v-icon color="primary">mdi-plus</v-icon>
              <v-tooltip activator="parent" location="bottom">Vincular vídeo</v-tooltip>
            </v-btn>
          </v-row>

        </template>
        <template v-slot:bottom>
          <div class="text-center pt-2 ">
            <v-pagination
              v-model="page"
              :length="pageCount"
              size="small"
            ></v-pagination>
          </div>
        </template>
      </v-data-table>
    </v-card>
    <dialog-midea v-model="dialogMideaView"/>
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
    <v-dialog v-model="mideaView" max-width="500px">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="text-h5 text-medium-emphasis">
            Selecionar vídeo
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="mideaView = false"
          ></v-btn>
        </v-card-title>

        <v-card-text class="pb-5">
          <v-combobox
            variant="outlined"
            v-model="mideaSelected"
            :items="mideaList"
            label="Pesquise uma opção"
            multiple
            item-value="id"
            item-title="name"
          >

            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-title>
                Não há dados para apresentar
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-combobox>
        </v-card-text>
        <v-card-actions class="d-flex justify-end">
          <v-btn
            color="primary"
            variant="elevated"
            @click="handleAddMidea(); mideaView = false"
          >
            Adicionar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import {computed, ref, defineComponent} from 'vue';
import PageService from "@/services/PageService";
import DialogMidea from "@/components/DialogMidea.vue";
import MideaPageService from "@/services/MideaPageService";
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
    const mideaSelected = ref(null);
    const loadingView = ref(false);
    const mideaView = ref(false);
    const removeView = ref(false);
    const pageList = ref<any[]>([]);
    const mideaList = ref<any[]>([]);
    const totalItems = ref(0);


    const findData = async () => {
      try {
        loadingView.value = true
        const response = await PageService.list();
        pageList.value = response;

        totalItems.value = pageList.value.length;

        loadingView.value = false
      } catch (error) {
        console.error("Erro ao obter dados das pesquisas:", error);
      }
    };

    const findDataMidea = async () => {
      try {
        loadingView.value = true
        const response = await MideaService.listName();
        mideaList.value = response;


        loadingView.value = false
      } catch (error) {
        console.error("Erro ao obter dados das pesquisas:", error);
      }
    };


    const itemsPerPage = 25
    const headers: {
      title: string;
      sortable?: boolean;
      key: string;
      width?: string;
      align?: 'start' | 'center' | 'end';
    }[] = [
      {title: 'Tipo', align: 'start', sortable: false, key: 'type', width: '10%'},
      {title: 'Página', key: 'page', width: '25%'},
      {title: 'URL', key: 'url', width: '30%'},
      {title: 'Vídeos', key: 'midea', width: '45%'},
    ]
    const page = ref(1);
    const pageCount = computed(() => Math.ceil(pageList.value.length / itemsPerPage));


    onMounted(() => {
      findData()
      findDataMidea()
    })


    const currentMidea = ref('');
    const removeMidea = async () => {
      try {

         await MideaPageService.delete(currentMidea.value);

          await findData();
        await findDataMidea()
      } catch (error) {
        console.error('Erro ao remover midea:', error);
      }
    };

    const addMidea = () => {

      mideaView.value = true;
    };

    const handleAddMidea = async () => {
        // Validação manual dos campos antes de enviar

          try {

            await MideaPageService.create(mideaSelected.value, currentMidea.value);

            await findData()

            mideaView.value = false;  // Fecha o diálogo após o sucesso
          } catch (error) {
            console.error('Erro ao enviar vídeo:', error);
          }

      };

    return {
      handleAddMidea,
      mideaView,
      addMidea,
      removeMidea,
      pageCount,
      page,
      loadingView,
      snackbar,
      textSnackbar,
      timeoutSnackbar,
      colorSnackbar,
      dialogMideaView,
      headers,
      pageList,
      totalItems,
      itemsPerPage,
      removeView,
      currentMidea,
      mideaSelected,
      mideaList
    }
  }
});
</script>
