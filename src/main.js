import { createApp } from 'vue'
import App from './App.vue'
import './assets/style/main.css'
import primeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

const app = createApp(App)
app.use(primeVue, {
    // Default theme configuration
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: '',
            cssLayer: false
        }
    }
 });

app.mount('#app')
