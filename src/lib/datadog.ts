import { datadogRum } from "@datadog/browser-rum";

export function initDatadogRum() {
  const applicationId = process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID;
  const clientToken = process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN;

  if (!applicationId || !clientToken) {
    return;
  }

  datadogRum.init({
    applicationId,
    clientToken,
    site: process.env.NEXT_PUBLIC_DATADOG_SITE ?? "datadoghq.com",
    service: "cinetrack",
    env: process.env.NODE_ENV,
    sessionSampleRate: 100,
    sessionReplaySampleRate: 0,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: "mask-user-input",
  });
}
