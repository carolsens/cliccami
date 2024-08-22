<template>
  <v-container class="fill-height pt-0 mt-0" fluid>
    <v-row class="fill-height mt-0 pt-0">
      <v-col cols="6" class="d-flex align-center justify-center">
        <div>
          <video style="max-width: 1000px" autoplay muted>
            <source src="@/assets/videos/cliccami.mp4" type="video/mp4">
            Seu navegador não suporta o elemento de vídeo.
          </video>
        </div>


      </v-col>
      <v-col cols="6" class="background-primary d-flex align-center justify-center mt-0 pt-0" >
        <v-card class=" justify-center  py-15" height="450px">
          <div class="text-center mb-5 mx-10">
            <p class="font-weight-bold text-h5">Login</p>
            <span class="text-caption">Digite seu email e senha cadastrados ou crie sua conta</span>
          </div>
          <v-card-text class="mx-5">
            <v-form @submit.prevent="login" >
              <v-text-field v-model="email" density="compact" label="Email" type="email" required variant="outlined" clearable :rules="[rules.required, rules.email]"></v-text-field>
              <v-text-field v-model="password" density="compact" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                            :type="visible ? 'text' : 'password'" label="Senha" required clearable
                            variant="outlined"
                            class="mt-5"
                            :rules="[rules.required]"
                            @click:append-inner="visible = !visible"></v-text-field>
              <v-row align="center" justify="center" class="mx-2 mt-1">

                <a
                  class="text-caption text-decoration-none mt-2 text-primary"
                  href="#"
                  rel="noopener noreferrer"
                >
                  Esqueceu sua senha?</a>
              </v-row>
              <div class="text-center">
                <v-btn  color="background" class="mr-4 mt-10" @click="accountFormView = true">Cadastro</v-btn>
                <v-btn type="submit" color="primary" class="mr-4 mt-10" >Entrar</v-btn>

              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
  <dialog-account-form v-model="accountFormView"/>

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
import { ref, defineComponent } from 'vue';
import DialogAccountForm from "@/components/DialogAccountForm.vue";
import {useRouter} from "vue-router";
import AuthService from "@/services/AuthService";

export default defineComponent({
  name: 'LoginPage',
  components: { DialogAccountForm },
  setup() {

    const email = ref('');
    const password = ref('');
    const visible = ref(false);
    const accountFormView = ref(false);
    const snackbar = ref(false);
    const textSnackbar = ref('');
    const timeoutSnackbar = ref(3000);
    const colorSnackbar = ref('');
    const loadingView = ref(false);
    const login = async () => {
      try {
        loadingView.value = true
        const response = await AuthService.login(email.value, password.value);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('email', email.value);
        // localStorage.setItem('email', response.user.email);

        if (response) {
          goToRoute('homePage')

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
    };

    const router = useRouter();
    const goToRoute = (routeName: any) => {
      router.push({ name: routeName });
    };



    return {
      email,
      password,
      login,
      rules,
      visible,
      accountFormView,
      goToRoute,
      loadingView,
      snackbar,
      textSnackbar,
      colorSnackbar,
      timeoutSnackbar
    }

  }
});
</script>

<style scoped>
.background-primary {
  background-color: #001d4d;
}

.my-checkbox .v-label {
  font-size: 12px;
}

</style>
