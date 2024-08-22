<template>
  <v-container fluid>

    <v-card flat class="py-4 mx-5">
      <v-toolbar class="pl-0 mb-4"
                 color="white">
        <v-toolbar-title class="">Usuários</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-data-table
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="userList"
        :items-length="totalItems"
        item-value="name"
        no-data-text="Não há dados disponíveis."
      >

        <template v-slot:[`item.name`]="{ item }">
          <div  >
            <span class="table-text" >{{ item.name ? item.name : 'Não consta'}}</span>
          </div>
        </template>


        <template v-slot:[`item.email`]="{ item }">
          <div  >
            <span class="table-text" >{{ item.email ? item.email : 'Não consta'}}</span>
          </div>
        </template>

        <template v-slot:[`item.active`]="{ item }">
          <v-switch
            v-model="item.activeBoolean"
            @change="toggleActive(item)"
          >
          </v-switch>
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


  </v-container>
</template>

<script lang="ts">
import {computed, ref, defineComponent} from 'vue';
import PageService from "@/services/PageService";
import DialogMidea from "@/components/DialogMidea.vue";
import MideaPageService from "@/services/MideaPageService";
import MideaService from "@/services/MideaService";
import ContentService from "@/services/ContentService";
import UserService from "@/services/UserService";

export default defineComponent({
  name: 'UserPage',
  props: {
    modelValue: Boolean
  },
  setup(props, {emit}) {
    const dialogMideaView = ref(false);
    const snackbar = ref(false);
    const textSnackbar = ref('');
    const timeoutSnackbar = ref(3000);
    const colorSnackbar = ref('');
    const loadingView = ref(false);
    const removeView = ref(false);
    const userList = ref<any[]>([]);
    const totalItems = ref(0);


    const transformActiveToBoolean = (active: number) => {
      return active == 1;
    };

    const toggleActive = async (item: any) => {
      const response = await UserService.updateStatus(item.id, item.activeBoolean);


      item.active = item.activeBoolean ? 1 : 0;
    };
    const findData = async () => {
      try {
        loadingView.value = true
        const response = await UserService.list();


        userList.value = response.map((user: any) => ({
          ...user,
          activeBoolean: transformActiveToBoolean(user.active)
        }));
        console.log(userList.value)

        totalItems.value = userList.value.length;

        loadingView.value = false
      } catch (error) {
        console.error("Erro ao obter dados das pesquisas:", error);
      }
    };




    const itemsPerPage = 25
    const headers = ref([
      {title: 'Nome', align: 'start', sortable: false, key: 'name', width: '10%'},
      {title: 'E-mail', key: 'email', width: '25%'},
      {title: 'Ativo?', key: 'active', width: '30%'},
    ])
    const page = ref(1);
    const pageCount = computed(() => Math.ceil(userList.value.length / itemsPerPage));


    onMounted(() => {
      findData()
    })






    return {

      pageCount,
      page,
      loadingView,
      snackbar,
      textSnackbar,
      timeoutSnackbar,
      colorSnackbar,
      dialogMideaView,
      headers,
      userList,
      totalItems,
      itemsPerPage,
      removeView,
      toggleActive

    }
  }
});
</script>
