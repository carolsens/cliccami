<template>
  <v-dialog v-model="show" max-width="600px">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="text-h5 text-medium-emphasis ps-2">
          Novo vídeo
        </div>

        <v-btn
          icon="mdi-close"
          variant="text"
          @click="show = false;"
        ></v-btn>
      </v-card-title>
    <v-stepper
      next-text="Próximo"
      prev-text="Voltar"
      alt-labels
      v-model="currentStep"
      :items="items"
      hide-actions

    >
      <template v-slot:[`item.1`]>
          <v-col cols="12">
            <v-select
              :items="itemsType"
              v-model="typePage"
              item-title="name"
              item-value="value"
              variant="outlined"
              label="Tipo de página"
            ></v-select>
            <v-text-field
              variant="outlined"
              label="URL da página"
              v-model="url"
              prepend-inner-icon="mdi-link"
            ></v-text-field>
          </v-col>
        <v-stepper-actions>
          <template v-slot:prev>
            <v-btn @click="prev" >Voltar</v-btn>
          </template>
          <template v-slot:next>
            <v-btn  @click="next" :disable="url === '' || typePage === ''" >Próximo</v-btn>
          </template>
        </v-stepper-actions>
      </template>

      <template v-slot:[`item.2`]>
        <v-col cols="12">
          <v-text-field
            variant="outlined"
            label="Nome do vídeo"
            v-model="name"
          ></v-text-field>
          <v-file-input
            variant="outlined"
            label="Vídeo"
            v-model="midea"
            prepend-inner-icon="mdi-video"
            prepend-icon=""
            show-size
            :rules="[rules.required, rules.fileSize, rules.fileType]"
            accept="video/*"
          ></v-file-input>
        </v-col>
        <v-stepper-actions>
          <template v-slot:prev>
            <v-btn @click="prev" >Voltar</v-btn>
          </template>
          <template v-slot:next>
            <v-btn :disabled="currentStep !== 2 || midea === null" @click="handleSubmit">Salvar</v-btn>
          </template>
        </v-stepper-actions>

      </template>



    </v-stepper>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from 'vue';
import ContentService from "@/services/ContentService";

export default defineComponent({
  props: {
    modelValue: Boolean
  },
  setup(props, {emit}) {
    const snackbar = ref(false);
    const textSnackbar = ref('');
    const timeoutSnackbar = ref(3000);
    const colorSnackbar = ref('');
    const loadingView = ref(false);
    const url = ref('')
    const typePage = ref('')
    const name = ref('')
    const midea = ref(null)
    const itemsType = ref([
      { value: 'Página', name: 'Página' },
      { value: 'Produto', name: 'Produto' }
    ]);
    const items = ref([
     'Página',
      'Vídeo'
    ]);
    const show = computed({
      get: () => props.modelValue,
      set: (value) => {
        emit('update:modelValue', value);
      }
    });
    const handleSubmit = async () => {
      // Validação manual dos campos antes de enviar
      const isValidFile = midea.value && rules.fileSize([midea.value]) === true && rules.fileType([midea.value]) === true;

      if (url.value && typePage.value && isValidFile) {
        try {
          const formData = new FormData();
          formData.append('typePage', typePage.value);
          formData.append('url', url.value);
          formData.append('name', name.value);
          console.log(midea.value)
          if (midea.value) {
            formData.append('file', midea.value);
          }

          const response = await ContentService.create(formData);
          console.log('Sucesso:', response.data);
          show.value = false;  // Fecha o diálogo após o sucesso
        } catch (error) {
          console.error('Erro ao enviar vídeo:', error);
        }
      } else {
        console.error('Validação falhou.');
      }
    };



    const rules = {
      required: (value: any) => !!value || 'Campo obrigatório',
      fileSize: (value: File[]) => {
        if (value && value.length > 0) {
          const file = value[0];
          return file.size <= 1024 * 1024 * 50 || 'O vídeo deve ter no máximo 50MB.';
        }
        return true;
      },
      fileType: (value: File[]) => {
        if (value && value.length > 0) {
          const file = value[0];
          return ['video/mp4', 'video/avi', 'video/mov'].includes(file.type) || 'O vídeo deve ser do tipo MP4, AVI, ou MOV.';
        }
        return true; // Allow if no file is selected
      },
    };




    const currentStep = ref(1);
    const next = () => {
      currentStep.value++;
    };

    const prev = () => {
      currentStep.value--;
    };

    const pageTitle = ref('');
    // const fetchPageTitle = async (url: string) => {
    //   try {
    //     const response = await axios.get(url);
    //     const parser = new DOMParser();
    //     const doc = parser.parseFromString(response.data, 'text/html');
    //     pageTitle.value = doc.querySelector('title')?.textContent || 'Título não encontrado';
    //   } catch (error) {
    //     pageTitle.value = 'Erro ao buscar título';
    //     console.error('Erro ao buscar o título da página:', error);
    //   }
    // };
    //
    // watch(url, (newUrl) => {
    //   if (newUrl) {
    //     fetchPageTitle(newUrl);
    //   }
    // });


    return {
      items,
      pageTitle,
      currentStep,
      prev,
      next,
      url,
      itemsType,
      rules,
      show,
      handleSubmit,
      loadingView,
      snackbar,
      textSnackbar,
      timeoutSnackbar,
      colorSnackbar,
      midea,
      typePage,
      name
    }
  }
});
</script>
