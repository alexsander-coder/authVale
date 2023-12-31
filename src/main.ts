import { createApp } from 'vue'
import BootstrapVue3 from 'bootstrap-vue-next';
import 'bootstrap/dist/css/bootstrap.css'
import App from './App.vue'
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

const app = createApp(App);

app.component('EasyDataTable', Vue3EasyDataTable);
app.use(BootstrapVue3);
app.mount('#unidade');



