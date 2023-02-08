const axios = require("axios")
const path = require("path")
const loraModelOptions = require('./loraModelOptions')

const TTN_SERVER = "eu1.cloud.thethings.network"
const TTN_BASE_URL = "https://"+TTN_SERVER
const TTN_API_PATH = "/api/v3"

const TTN_PATH_ORG = "/organizations"
const TTN_PATH_APPLICATIONS = "/applications"
const TTN_PATH_DEVICES = '/devices'
const TTN_PATH_API_KEYS = "/api-keys"
const TTN_PATH_NETWORK_SETTINGS = "/ns"
const TTN_PATH_AS_SETTINGS = "/as"
const TTN_PATH_JOIN_SETTINGS = "/js"
const TTN_PATH_USERS = "/users"
const TTN_PATH_ORGANIZATIONS = "/organizations"

const DEFAULT_TTN_API_KEY = process.env.PASSWORD_TTN
const DEFAULT_TTN_USER = process.env.USER_TTN
const DEFAULT_TTN_EMAIL = process.env.EMAIL_TTN

const field_mask_device_ids = [
    "ids.device_id", 
    "ids.application_ids.application_id",
]

const TTN_API = axios.create({
    baseURL: TTN_BASE_URL,
});

// const __get_ttn_path_organization_applications = (organizationId) => {
//     return path.join(TTN_API_PATH, TTN_PATH_ORG, organizationId, TTN_PATH_APPLICATIONS)
// }

const __get_ttn_path_user_applications = (userId, applicationId="") => {
    return path.join(TTN_API_PATH, TTN_PATH_USERS, userId, TTN_PATH_APPLICATIONS, applicationId)
}

const __get_ttn_path_applications = (applicationId) => {
    return path.join(TTN_API_PATH, TTN_PATH_APPLICATIONS, applicationId)
}

const __get_ttn_path_api_keys = (applicationId) => {
    return path.join(TTN_API_PATH, TTN_PATH_APPLICATIONS, applicationId, TTN_PATH_API_KEYS)
}

const __get_ttn_path_devices = (applicationId, deviceId="") => {
    return path.join(TTN_API_PATH, TTN_PATH_APPLICATIONS, applicationId, TTN_PATH_DEVICES, deviceId)
}

const __get_ttn_path_network_settings = (applicationId, deviceId) => {
    return path.join(TTN_API_PATH, TTN_PATH_NETWORK_SETTINGS, TTN_PATH_APPLICATIONS, applicationId, TTN_PATH_DEVICES, deviceId)
}

const __get_ttn_path_as_settings = (applicationId, deviceId) => {
    return path.join(TTN_API_PATH, TTN_PATH_AS_SETTINGS, TTN_PATH_APPLICATIONS, applicationId, TTN_PATH_DEVICES, deviceId)
}

const __get_ttn_path_join_settings = (applicationId, deviceId) => {
    return path.join(TTN_API_PATH, TTN_PATH_JOIN_SETTINGS, TTN_PATH_APPLICATIONS, applicationId, TTN_PATH_DEVICES, deviceId)
}

const __get_ttn_path_user_oganizations = (userId) => {
    return path.join(TTN_API_PATH, TTN_PATH_USERS, userId, TTN_PATH_ORGANIZATIONS)
}

const __get_auth_config = (apiKey) => {
    return {headers: { Authorization: `Bearer ${apiKey}` }}
}
const __get_ids_device = (applicationId, device) => {
    return {
            device_id: device.devId,
            dev_eui: device.devEUI,
            join_eui: device.joinEUI,
            // app_key: app_key
            application_ids: {
                application_id: applicationId,
        }
    }
}

const addApplication = async (application, apiKey=DEFAULT_TTN_API_KEY, userId=DEFAULT_TTN_USER) => {
    const appPath = __get_ttn_path_user_applications(userId) 

    const applicationPayload = {
        application:{
            ids: {
                application_id: application.applicationId
            },
            name: application.name,
            description: application.description
        },
        field_mask: {
            paths:[
                "ids.application_id",
                "name",
                "description"
            ]
        }
    }

    console.log("Adding application:", application)
    return TTN_API.post(appPath , applicationPayload, __get_auth_config(apiKey))
}

const deleteApplication = async (applicationId, apiKey=DEFAULT_TTN_API_KEY) => {
    const appPath = __get_ttn_path_applications(applicationId) 
    return TTN_API.delete(appPath, __get_auth_config(apiKey))
}

const addApiKey = async (applicationId, apiKey=DEFAULT_TTN_API_KEY) => {
    const path = __get_ttn_path_api_keys(applicationId)
    const app_key_payload = {
        name: application.appId + '-key',
        rights: [28, 29, 40, 53]
    }

    return TTN_API.post(path, app_key_payload, __get_auth_config(apiKey))
}

const addDevice = async (applicationId, device, apiKey=DEFAULT_TTN_API_KEY) => {
    const path = __get_ttn_path_devices(applicationId)
    
    const device_payload = {
        end_device: {
            ids: __get_ids_device(applicationId, device),
            name: device.name,
            network_server_address:TTN_SERVER,
            application_server_address:TTN_SERVER,
            join_server_address: TTN_SERVER,
        },
        field_mask: {
            paths:[
                ...field_mask_device_ids,
                "ids.devEUI", 
                "ids.joinEUI", 
                "name",
                "network_server_address",
                "application_server_address",
                "join_server_address",
            ]
        }

    }
    return TTN_API.post(path, device_payload, __get_auth_config(apiKey))
}

const deleteDevice = async (applicationId, device, apiKey=DEFAULT_TTN_API_KEY) => {
    const pathNetworkRegistry = __get_ttn_path_network_settings(applicationId, device.devId)
    const pathJsRegistry = __get_ttn_path_join_settings(applicationId, device.devId)
    const pathDevicesRegistry = __get_ttn_path_devices(applicationId, device.devId)

    console.log("Delete NS...")
    await TTN_API.delete(pathNetworkRegistry, __get_auth_config(apiKey))
    console.log("Delete JS...")
    await TTN_API.delete(pathJsRegistry, __get_auth_config(apiKey))
    console.log("Delete DEVICE...")
    return await TTN_API.delete(pathDevicesRegistry, __get_auth_config(apiKey))
}

const setDeviceNetworkSettings = async (applicationId, device, loraProfile, apiKey=DEFAULT_TTN_API_KEY) => {
    const path = __get_ttn_path_network_settings(applicationId, device.devId)
    const config = __get_auth_config(apiKey)
    const networkSettingsPayload = {
        end_device: {
            ids: __get_ids_device(applicationId, device),
            frequency_plan_id: loraProfile.freqPlanId,
            lorawan_phy_version: loraProfile.phyVersion,
            lorawan_version: loraProfile.macVersion,
            supports_join: loraProfile.isOTAA,
            supports_class_b: loraProfile.isClassB,
            supports_class_c: loraProfile.isClassC
        },
        field_mask: {
            paths:[
                ...field_mask_device_ids,
                "frequency_plan_id",
                "lorawan_version",
                "supports_join",
                "supports_class_b",
                "supports_class_c",
                "lorawan_phy_version"
            ]
        }

    }
    return TTN_API.put(path, networkSettingsPayload, config)

}

const setDeviceJoinSettings = async (applicationId, deviceId, device, apiKey=DEFAULT_TTN_API_KEY) => {
    const path = __get_ttn_path_join_settings(applicationId, deviceId)
    const config = __get_auth_config(apiKey)

    const networkSettingsPayload = {
        end_device: {
            ids: __get_ids_device(applicationId, device),
            root_keys: {
                app_key:{
                    key: device.appKey
                }
            },
        },
        field_mask: {
            paths:[
                ...field_mask_device_ids,
                "root_keys.app_key.key",
            ]
        }
    }
    return TTN_API.put(path, networkSettingsPayload, config)

}

module.exports = {
    addApplication,
    deleteApplication,
    addApiKey,
    addDevice,
    setDeviceNetworkSettings,
    setDeviceJoinSettings,
    deleteDevice    
}