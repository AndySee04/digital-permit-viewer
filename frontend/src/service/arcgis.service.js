import {
    arcGisAccountPassword,
    arcGisAccountUsername,
    arcGisClientId,
    arcGisPortalUrl,
    arcGisRedirectUri,
} from "@/constants/arcgis.constant";
import esriId from "@arcgis/core/identity/IdentityManager";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";

// Configure OAuthInfo
const oAuthInfo = new OAuthInfo({
    appId: arcGisClientId,
    popup: true,
    popupCallbackUrl: arcGisRedirectUri,
    portalUrl: arcGisPortalUrl,
});

// Register OAuth Info
esriId.registerOAuthInfos([oAuthInfo]);

// ---------------------------------------------------------------------------
// Auto login by generating token
export const autoLogin = async () => {
    try {
        const response = await fetch(
            `${arcGisPortalUrl}/sharing/rest/generateToken`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    username: arcGisAccountUsername,
                    password: arcGisAccountPassword,
                    referer: window.location.origin,
                    expiration: 60,
                    f: "pjson",
                }),
            },
        );

        const data = await response.json();
        const credential = {
            token: data.token,
            expires: data.expires,
            ssl: data.ssl,
        };

        // Save to localStorage
        localStorage.setItem("arcgisCredential", JSON.stringify(credential));
        console.log("Auto login successful");

        // Reload to apply credentials with esriId
        window.location.reload();
    } catch (error) {
        console.error("Auto login failed:", error);
        return false;
    }
};

// Restore credentials from localStorage
export const restoreCredentials = async () => {
    try {
        const savedCredential = localStorage.getItem('arcgisCredential');

        if (savedCredential) {
            const credential = JSON.parse(savedCredential);

            // Register the token with esriId
            esriId.registerToken({
                server: `${arcGisPortalUrl}/sharing/rest`,
                token: credential.token,
                expires: credential.expires,
                ssl: credential.ssl
            });

            // Check if token is expired
            const now = Date.now();
            if (credential.expires && credential.expires < now) {
                localStorage.removeItem('arcgisCredential');
                return await autoLogin();
            }

            // Success log
            console.log("ArcGISCredentials restored from localStorage");
            return true;
        } else {
            // No saved credential, perform auto login
            return await autoLogin();
        }
    } catch (error) {
        console.error('Error restoring credentials:', error);
        return false;
    }
};

// Logout
export const arcgisLogout = async () => {
    try {
        esriId.destroyCredentials();
        localStorage.removeItem('arcgisCredential');
        window.location.reload();
    } catch (error) {
        console.error('Error during logout:', error);
    }
};
