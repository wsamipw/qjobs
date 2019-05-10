import { STORE_GEO_LOCATION, STORE_NOTIFICATION_OBJECT } from "./types";

// Not Used
export const storeGeoLocation = payload => ({
  type: STORE_GEO_LOCATION,
  payload
});

export const storeNotificationObject = payload => ({
  type: STORE_NOTIFICATION_OBJECT,
  payload
});
