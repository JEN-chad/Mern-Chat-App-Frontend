export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTHROUTES = "api/auth";

export const SIGNUPROUTE = `${AUTHROUTES}/signup`;
export const LOGINROUTE = `${AUTHROUTES}/login`;
export const GET_USER_INFO = `${AUTHROUTES}/user-info`;
export const UPDATE_PROFILE_INFO = `${AUTHROUTES}/update-profile`;
export const ADD_PROFILE_IMAGE = `${AUTHROUTES}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE = `${AUTHROUTES}/remove-profile-image`;
export const LOGOUT_ROUTE = `${AUTHROUTES}/logout`;

export const CONTACTROUTES = "api/contacts";
export const SEARCH_CONTACTS_ROUTES = `${CONTACTROUTES}/search`;
export const GET_DM_CONTACTS_ROUTES = `${CONTACTROUTES}/get-contacts-for-dm`;
export const GET_ALL_CONTACT_ROUTES = `${CONTACTROUTES}/get-all-contacts`;

export const MESSAGE_ROUTES = "api/messages";
export const GET_MESSAGES_ROUTES = `${MESSAGE_ROUTES}/get-messages`;
export const UPLOAD_FILE_ROUTES = `${MESSAGE_ROUTES}/upload-file`;

export const CHANNEL_ROUTES = "/api/channel";
export const CREATE_CHANNEL_ROUTES = `${CHANNEL_ROUTES}/create-channel`;
export const GET_ALL_CHANNEL_ROUTES = `${CHANNEL_ROUTES}/get-all-channels`;
export const GET_CHANNEL_MESSAGES = `${CHANNEL_ROUTES}/get-channel-messages`;
export const SEND_CHANNEL_FILES = `${CHANNEL_ROUTES}/send-channel-message`;
