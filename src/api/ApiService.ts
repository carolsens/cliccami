import axios, {AxiosError, AxiosResponse} from 'axios';
// import FileSaver from 'file-saver';
import router from '@/router';

const BASE_URL = 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Certifique-se de que está definido aqui
});

axiosInstance.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.request.use((config: any) => {
  config.headers['Access-Control-Allow-Origin'] = '*'; // Permitir todas as origens (não é seguro para produção)
  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      return router.push({ name: 'loginPage' }).then(() => {
        return Promise.reject(error);
      });
    }
    return Promise.reject(error);
  }
);



export default {

  // async download<T>(endpoint: string): Promise<void> {
  //   try {
  //     const response: AxiosResponse<Blob> = await axiosInstance.get(endpoint, {
  //       responseType: 'blob'
  //     });
  //
  //     // Salvar o arquivo usando FileSaver.saveAs()
  //     FileSaver.saveAs(response.data, 'report.xlsx');
  //   } catch (error) {
  //     console.error("Erro ao fazer download:", error);
  //   }
  // },

  async get<T>(endpoint: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.get(endpoint);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async post<T>(endpoint: string, data: any, headers?: any): Promise<T> {
    try {
      return await axiosInstance.post(endpoint, data, { headers });
    } catch (error) {
      throw handleError(error);
    }
  },


  async put<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.put(endpoint, data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async delete(endpoint: string): Promise<void> {
    try {
      await axiosInstance.delete(endpoint);
    } catch (error) {
      throw handleError(error);
    }
  }
};

export function handleError(error: any): Error {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      const responseData = axiosError.response.data;
      const statusCode = axiosError.response.status;
      const errorMessage = (responseData && typeof responseData === 'object' && 'message' in responseData) ? responseData.message : 'Erro na chamada à API';
      return new Error(`Erro ${statusCode}: ${errorMessage}`);
    } else {
      return new Error('Erro de rede ao chamar a API');
    }
  } else {
    return new Error((error as Error).message || 'Erro desconhecido');
  }
}
