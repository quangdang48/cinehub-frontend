import axios, { AxiosError } from 'axios';
import appConfig from '@/config/app.config';
import deepParseJson from '@/utils/deepParseJson';
import store, { signOutSuccess } from '@/store';
const unauthorizedCode = [401];

const ApiService = axios.create({
  timeout: 60000,
  baseURL: appConfig.apiPrefix,
  headers: {
    'Content-Type': 'application/json',
  },
});

ApiService.interceptors.request.use(
  (config) => {
    if ((config as any).authRequired === false) {
      return config;
    }

    // Lấy token từ Redux persist storage
    let accessToken: string | null = null;

    // Cách 1: Lấy từ Redux store trực tiếp
    const { auth } = store.getState();
    accessToken = auth?.session?.token || null;

    // Cách 2: Nếu không có, thử lấy từ localStorage
    if (!accessToken) {
      const rawPersistData = localStorage.getItem('cinehub-root');
      if (rawPersistData) {
        const persistData = deepParseJson(rawPersistData);
        accessToken = (persistData as any)?.auth?.session?.token || null;
      }
    }

    if (accessToken) {
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

ApiService.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    const { response } = error;
    if (response && unauthorizedCode.includes(response.status)) {
      store.dispatch(signOutSuccess());
    }
    return Promise.reject(error);
  }
);

export default ApiService;
