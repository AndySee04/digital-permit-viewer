import AppLayout from "@/layout/AppLayout.vue";
import { getAccCookie } from "@/utils/accCookie";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory("/digital-permit/"),
    routes: [
        {
            path: "/",
            redirect: "/webmap",
            meta: { auth: true },
            component: AppLayout,
            children: [
                {
                    path: "/webmap",
                    name: "webmap",
                    component: () => import("@/views/Webmap.vue"),
                },
                {
                    path: "/layer/survey",
                    name: "survey-layer",
                    component: () => import("@/views/pages/permit/Survey.vue"),
                },
                {
                    path: "/permit",
                    name: "permit",
                    component: () => import("@/views/pages/permit/Permit.vue"),
                },
                {
                    path: "/acc/auth/callback",
                    name: "acc-callback",
                    component: () =>
                        import("@/views/pages/auth/CallBackACC.vue"),
                    meta: { public: true },
                },
                {
                    path: "/gis/auth/callback",
                    name: "arcgis-callback",
                    component: () =>
                        import("@/views/pages/auth/CallBackArcGis.vue"),
                    meta: { public: true },
                },
                {
                    path: "/drag",
                    name: "drag",
                    component: () => import("@/views/pages/Drag.vue"),
                },
            ],
        },
        {
            path: "/auth/login",
            name: "login",
            component: () => import("@/views/pages/auth/Login.vue"),
            meta: { public: true },
        },
    ],
});

router.beforeEach(async (to) => {
    // Always allow explicitly public routes
    if (to.meta && to.meta.public) return true;

    if (to.meta && to.meta.auth) {
        // Check ACC refresh token is already present and valid
        const accRefreshToken = getAccCookie("acc_refreshToken");

        // Check ArcGIS credential is already present and valid
        let hasValidArcGis = false;
        try {
            const arc = JSON.parse(
                localStorage.getItem("arcgisCredential") || "null",
            );
            if (arc && arc.expires && Date.now() <= arc.expires) {
                hasValidArcGis = true;
            }
        } catch {}

        if (accRefreshToken || hasValidArcGis) return true;

        // Redirect to login page with the original URL
        const redirectPath = to.fullPath;
        return {
            name: "login",
            query: { redirect: redirectPath },
        };
    }

    return true;
});

export default router;
