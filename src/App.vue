<template>
    <preloader v-if="!appStore.isPreloader"></preloader>
    <router-view></router-view>
</template>
<script lang="ts">
import Preloader from "./components/Preloader.vue";
import {Options, Vue} from "vue-class-component";
import createAppStore from "./stores/app.store";

@Options({
    components: {Preloader},
    created() {
        setTimeout(() => {
            this.$metrika?.hit("ParagonAnalytics", { title: "ParagonAnalytics" });
        }, 1000);
    }
})
export default class App extends Vue {
    appStore = createAppStore();
}
</script>
<style>

body {
  border-radius: 16px;
  background-color: #0F1015;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo.electron:hover {
  filter: drop-shadow(0 0 2em #9FEAF9);
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
