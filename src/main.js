import { createApp } from 'vue'
import App from './App.vue'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import {createVuetify} from "vuetify";
import ElementPlus from 'element-plus';

const app = createApp(App)
const vuetify = createVuetify({
    components,
    directives,
})
app.use(vuetify)
app.use(ElementPlus)

app.mount('#app')
