import esriConfig from "@arcgis/core/config";

export const arcGisClientId = import.meta.env.VITE_ARCGIS_CLIENT_ID
export const arcGisClientSecret = import.meta.env.VITE_ARCGIS_CLIENT_SECRET
export const arcGisRedirectUri = import.meta.env.VITE_ARCGIS_REDIRECT_URI
export const arcGisPortalUrl = import.meta.env.VITE_ARCGIS_PORTAL_URL
export const arcGisAccountUsername = import.meta.env.VITE_ARCGIS_ACCOUNT_USERNAME
export const arcGisAccountPassword = import.meta.env.VITE_ARCGIS_ACCOUNT_PASSWORD

export const arcGisApikey = async () => {
  esriConfig.apiKey = import.meta.env.VITE_ARCGIS_APIKEY
}