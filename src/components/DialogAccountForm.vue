<template>
  <v-dialog v-model="show" max-width="400px">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="text-h5">
          Cadastro
        </div>

        <v-btn
          icon="mdi-close"
          variant="text"
          @click="show = false"
        ></v-btn>
      </v-card-title>
      <v-card-item class="mt-5">
        <v-form ref="form" @submit.prevent>
          <v-row dense>
            <v-col cols="12" md="12" sm="12">
              <v-text-field v-model="name" label="Nome" type="name" required variant="outlined" density="compact" :rules="[rules.required]"
                            clearable class="mt-2"></v-text-field>
            </v-col>
            <v-col cols="12" md="12" sm="12">
              <v-text-field v-model="email" label="E-mail" type="email" required variant="outlined" :rules="[rules.required]"
                            density="compact" clearable></v-text-field>
            </v-col>

            <v-col cols="12" md="12" sm="12">
              <v-text-field v-model="password" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                            :type="visible ? 'text' : 'password'" label="Senha" required density="compact" clearable
                            variant="outlined"
                            :rules="[rules.required, rules.passwordMinLength, rules.passwordSpecialChar, rules.passwordNumber, rules.passwordUpperCase]"
                            @click:append-inner="visible = !visible"></v-text-field>
            </v-col>
          </v-row>
          <div class="text-right mt-5 mb-1">
            <v-btn type="submit" color="primary" @click="validateAndCreateUser" >Cadastrar</v-btn>
          </div>
        </v-form>
      </v-card-item>

    </v-card>
  </v-dialog>
  <v-snackbar
    v-model="snackbar"
    :timeout="timeoutSnackbar"
    :color="colorSnackbar"
  >
    <span class="text-white">{{ textSnackbar }}</span>

    <template v-slot:actions>
      <v-btn
        color="white"
        variant="text"
        icon="mdi-close"
        @click="snackbar = false"
      >
      </v-btn>
    </template>
  </v-snackbar>


</template>

<script lang="ts">
import {computed, ref, defineComponent} from 'vue';
import AccountService from "@/services/AccountService";

export default defineComponent({
  props: {
    modelValue: Boolean
  },
  setup(props, {emit}) {
    const email = ref('');
    const name = ref('');
    const password = ref('');
    const visible = ref(false);
    const snackbar = ref(false);
    const textSnackbar = ref('');
    const timeoutSnackbar = ref(3000);
    const colorSnackbar = ref('');
    const loadingView = ref(false);
    const show = computed({
      get: () => props.modelValue,
      set: (value) => {
        emit('update:modelValue', value);
      }
    });
    const createUser = async () => {
      try {
        // loadingView.value = true



        const data = {
          email: email.value,
          name: name.value,
          password: password.value
        }
        const response = await AccountService.create(data);
        if (response) {
          show.value = false
        }
        loadingView.value = false
      } catch (error) {
        loadingView.value = false
        textSnackbar.value = 'Usuário ou senha incorreto(s). Por favor, tente novamente.';

        colorSnackbar.value = '#B00020'
        snackbar.value = true
        console.log('error')
      }
    };


    const rules = {
      required: (value: any) => !!value || 'Campo obrigatório',
      email: (value: any) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'E-mail inválido.'
      },
      passwordMinLength: (value: any) => value.length >= 8 || 'A senha deve ter pelo menos 8 caracteres.',
      passwordSpecialChar: (value: any) => /[!@#$%^&*]/.test(value) || 'A senha deve conter pelo menos um caractere especial.',
      passwordNumber: (value: any) => /\d/.test(value) || 'A senha deve conter pelo menos um número.',
      passwordUpperCase: (value: any) => /[A-Z]/.test(value) || 'A senha deve conter pelo menos uma letra maiúscula.'

    };

    const form = ref<HTMLFormElement | null>(null);
    const validateAndCreateUser = async () => {
      if (form.value && form.value.isValid) {
        await createUser();
      }
    };

    return {
      form,
      email,
      password,
      rules,
      visible,
      show,
      name,
      createUser,
      loadingView,
      snackbar,
      textSnackbar,
      timeoutSnackbar,
      colorSnackbar,
      validateAndCreateUser
    }
  }
});
</script>
