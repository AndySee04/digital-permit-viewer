<script setup>
import { accLogin, listenForAuthMessage } from '@/service/acc.service';
import { getAccCookie } from '@/utils/accCookie';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoading = ref(false);
const error = ref(null);

const navigateToApp = async () => {
    try {
        await router.push('/webmap');
    } catch (err) {
        console.error('Navigation error:', err);
    }
};

const handleLogin = async () => {
    try {
        isLoading.value = true;
        error.value = null;
        accLogin();
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'An error occurred during login';
    } finally {
        isLoading.value = false;
    }
};

const messageHandler = async (event) => {
    if (event.origin !== window.location.origin) return;
    const { code } = event.data;
    if (code) {
        try {
            // Token exchange handled inside listenForAuthMessage callback
            await navigateToApp();
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'An error occurred processing the login';
        }
    }
};

onMounted(() => {
    // If already authenticated with ACC, go straight to app
    const refreshToken = getAccCookie('acc_refreshToken');
    if (refreshToken) {
        navigateToApp();
        return;
    }

    // If not authenticated yet, listen for auth completion from the callback window
    listenForAuthMessage(() => {
        navigateToApp();
    });
    window.addEventListener('message', messageHandler);
});

onUnmounted(() => {
    window.removeEventListener('message', messageHandler);
});
</script>

<template>
    <div
        class="flex min-h-screen min-w-[100vw] items-center justify-center overflow-hidden bg-surface-50 dark:bg-surface-950">
        <div class="flex flex-col items-center justify-center gap-4">
            <div class="flex flex-col items-center gap-4">
                <span class="text-4xl">Digital Permit Viewer</span>
                <span class="text-lg text-center">Sign in to access the application</span>
            </div>
            <div>
                <div class="space-y-4">
                    <Button 
                        class="!bg-black !border-black !text-white hover:!bg-black/90"
                        :loading="isLoading" @click="handleLogin"
                        v-tooltip.bottom="'Login with your Autodesk Construction Cloud account'">
                            {{ isLoading ? 'Signing in...' : 'Login with ACC' }}
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>