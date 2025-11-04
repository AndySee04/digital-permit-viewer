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

const registerCredential = (credential) => {
    if (!credential || !credential.token) {
        console.warn("ArcGIS: Attempted to register an invalid credential");
        return false;
    }

    esriId.registerToken({
        server: `${arcGisPortalUrl}/sharing/rest`,
        token: credential.token,
        expires: credential.expires,
        ssl: credential.ssl,
    });

    return true;
};

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
        if (!response.ok || data.error) {
            throw new Error(
                data.error?.message || "Failed to generate ArcGIS token",
            );
        }
        const credential = {
            token: data.token,
            expires: data.expires,
            ssl: data.ssl,
        };

        if (!registerCredential(credential)) {
            console.error(
                "ArcGIS: Failed to register credential after auto login",
            );
            return false;
        }

        // Save to localStorage
        localStorage.setItem("arcgisCredential", JSON.stringify(credential));
        console.log("ArcGIS: Auto login successful");

        return credential;
    } catch (error) {
        console.error("ArcGIS: Auto login failed:", error);
        return false;
    }
};

// Restore credentials from localStorage
export const restoreCredentials = async () => {
    try {
        const savedCredential = localStorage.getItem("arcgisCredential");

        if (savedCredential) {
            const credential = JSON.parse(savedCredential);

            // Check if token is expired
            const now = Date.now();
            if (credential.expires && credential.expires < now) {
                localStorage.removeItem("arcgisCredential");
                return await autoLogin();
            }

            if (!registerCredential(credential)) {
                localStorage.removeItem("arcgisCredential");
                return await autoLogin();
            }

            // Success log
            console.log("ArcGISCredentials: Restored from localStorage");
            return credential;
        }

        // No saved credential, perform auto login
        return await autoLogin();
    } catch (error) {
        console.error("Error restoring credentials:", error);
        return false;
    }
};

// Logout
export const arcgisLogout = async () => {
    try {
        esriId.destroyCredentials();
        localStorage.removeItem("arcgisCredential");
        window.location.reload();
    } catch (error) {
        console.error("Error during logout:", error);
    }
};
