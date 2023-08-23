<template>
<div class="layout-sidebar">
    <div class="app-logo">
        <img src="../assets/logo-transparent.png" alt="logo">
        <span>Paragon Analytics</span>
    </div>
    <div class="items">
        <template v-for="(item, index) in items">
            <router-link class="menu-item" :to="item.path">
                <i class="pi" :class="item.icon"></i>
                <span>{{ item.name }}</span>
            </router-link>
        </template>
    </div>
</div>
</template>

<script lang="ts">

import {Options, Vue} from "vue-class-component";
import {useRoute, useRouter} from "vue-router";

@Options({
    beforeMount() {
        const routing = useRouter();
        routing.push("/champions")
    }
})
export default class AppSidebar extends Vue {

    items = [
        {
            name: 'Чемпионы',
            path: '/champions',
            icon: 'pi-book'
        },
        {
            name: 'Настройки',
            path: '/settings',
            icon: 'pi-cog'
        },
    ];
}
</script>

<style scoped lang="scss">

.layout-sidebar {
    position: fixed;
    z-index: 500;

    display: flex;
    flex-direction: column;

    background: #101318;
    width: 100%;

    max-width: 70px;
    height: 100%;

    left: 0;
    top: 0;

    overflow: hidden;

    transition: max-width 0.2s ease-in-out;

    &:hover {
        max-width: 230px;

        span {
            opacity: 1 !important;
        }
    }

    .app-logo {
        position: relative;

        display: flex;
        align-items: center;

        margin-top: 62px;
        margin-left: 19px;

        margin-bottom: 32px;

        img {
            width: 32px;
        }

        span {
            font-weight: bold;
            text-wrap: nowrap;

            margin-left: 8px;

            opacity: 0;

            transition: opacity 0.3s ease-in-out;
        }
    }
}

.items {
    margin-left: 23px;
}

.menu-item {
    display: flex;
    align-items: center;

    text-decoration: none;

    color: var(--font-color-secondary);

    transition: color 0.2s ease-in-out;

    &:not(:last-child) {
        margin-bottom: 16px;
    }

    &.router-link-active,
    &:hover {
        i {
            color: white;
        }

        span {
            color: white;
        }
    }

    i {
        font-size: 24px;

        transition: color, opacity 0.2s ease-in-out;
    }

    span {
        opacity: 0;

        margin-left: 8px;

        transition: color, opacity 0.2s ease-in-out;
    }
}

</style>
