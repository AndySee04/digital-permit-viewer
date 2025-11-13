<script setup>
import { useLayout } from '@/layout/composables/layout';
import { accLogout } from '@/service/acc.service';
import { arcgisLogout } from '@/service/arcgis.service';
import { useAccStore } from '@/store/accStore';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout();
const accStore = useAccStore();
const router = useRouter();

// TODO: integrate project api from backend
const projects = ref([
    { id: 1, name: 'BCWF' },
])

const selectedProject = ref(projects.value.find((project) => project.id === 1));

const avatarLabel = ref('');
const avatarTooltip = ref('');

const avatar = async () => {
    try {
        const firstName = accStore.user?.firstName || '';
        const lastName = accStore.user?.lastName || '';

        avatarLabel.value = `${firstName.charAt(0)}${lastName.charAt(0)}`;
        avatarTooltip.value = `${firstName} ${lastName}`;
    } catch (error) {
        console.error('Error setting avatar:', error);
    }
};

const handleLogout = async () => {
    await accLogout();
    await arcgisLogout();
    window.location.href = router.resolve({ name: 'login' }).href;
};

const handleLogoClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    window.location.href = router.resolve({ name: 'webmap' }).href;
};

onMounted(async () => {
    await accStore.fetchUsers();
    await avatar();
});
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container" @click="handleLogoClick">
            <!-- <button class="layout-menu-button layout-topbar-action" @click="onMenuToggle">
                <i class="pi pi-bars"></i>
            </button> -->
            <router-link :to="{ name: 'webmap' }" class="layout-topbar-logo">
                <div>
                    <img src="/demo/images/gamuda.png" class="rounded-xl" alt="" height="35px" width="35px">
                </div>

                <span class="text-lg sm:text-base md:text-xl">Digital Permit</span>
            </router-link>
        </div>
        <div class="flex justify-center gap-4">
            <Select v-model="selectedProject" :options="projects" optionLabel="name" placeholder="Select a Project"
                variant="filled" />
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
                <button type="button" class="layout-topbar-action" v-tooltip="'Logout'" @click="handleLogout">
                    <i class="pi pi-sign-out"></i>
                </button>
                <Avatar :label="avatarLabel" shape="circle" v-tooltip="`${avatarTooltip}`"
                    class="layout-topbar-avatar" />
            </div>
        </div>
    </div>
</template>

<style scoped></style>