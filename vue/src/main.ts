import { createApp } from 'vue';
import App from './App.vue';
import {createPinia} from 'pinia';
import '@/styles.css';

createApp(App).use(createPinia()).mount('#app');
