import {createApp} from 'vue'
import "./styles/style.scss"
import App from './App.vue'
import './samples/node-api'
import router from "./router";
import 'primeicons/primeicons.css';

import {createPinia} from "pinia";

import axios from 'axios'
import VueAxios from 'vue-axios'

import PrimeVue from 'primevue/config';
import DataTable from "primevue/datatable";
import Column from 'primevue/column';
import Row from 'primevue/row';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import InputText from "primevue/inputtext";
import Dialog from 'primevue/dialog';
import Password from "primevue/password";
import Calendar from "primevue/calendar";
import InputSwitch from "primevue/inputswitch";
import MultiSelect from "primevue/multiselect";
import InputNumber from 'primevue/inputnumber';
import ProgressSpinner from 'primevue/progressspinner';
import Checkbox from "primevue/checkbox";
import Toast from 'primevue/toast';
import Textarea from 'primevue/textarea';
import FileUpload from 'primevue/fileupload';
import TabView from 'primevue/tabview';
import TabPanel from "primevue/tabpanel";
import Tooltip from "primevue/tooltip";

const app = createApp(App);

app.use(createPinia());

app.use(PrimeVue, { ripple: true });
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Row', Row);
app.component('Button', Button);
app.component('Dropdown', Dropdown);
app.component('InputText', InputText);
app.component('Dialog', Dialog)
app.component('Password', Password)
app.component('Calendar', Calendar);
app.component('InputSwitch', InputSwitch);
app.component('MultiSelect', MultiSelect);
app.component('InputNumber', InputNumber);
app.component('ProgressSpinner', ProgressSpinner);
app.component('Checkbox', Checkbox);
app.component('Toast', Toast);
app.component('Textarea', Textarea);
app.component('FileUpload', FileUpload);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);
app.directive('tooltip', Tooltip);

app.use(router);

app.use(VueAxios, axios);

app.mount('#app')
    .$nextTick(() => {
        postMessage({payload: 'removeLoading'}, '*')
    })
