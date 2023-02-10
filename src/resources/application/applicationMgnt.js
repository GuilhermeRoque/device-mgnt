const { WebSocketServer } = require("ws");
const wss = new WebSocketServer({ port: process.env.WS_PORT });
const Organization = require("../organizations/organizationModel").organizationModel
const crypto = require('crypto');
const deviceProxies = []
const knapsackProblem = require("./knapsackProblem")

function getApplicationsLoadMetrics(organizations) {
    let loadApplications = []
    let applicationsLoad = []
    let totalLoad = 0

    for(const organization of organizations){
        let bucket = organization.bucket
        let token = organization.token
        let applications = organization.applications
        console.log("There is ", applications.length, "in organization", organization.organizationId)
        for (const application of applications) {
            let load = 0;
            for (let i =0; i<application.devices.length; i++) {
                if(application.devices[i].serviceProfile){
                    load += (1 / application.devices[i].serviceProfile.period);
                    application.devices[i].update = true
                }
            }
            let applicationLoad = {
                applicationId: application.applicationId,
                name: application.name,
                apiKey: application.apiKey?application.apiKey:process.env.PASSWORD_TTN,
                token: token,
                bucket: bucket,
                load: load,
                organization: organization.organizationDataId,
                devices: application.devices
            }
            if(load > 0){
                loadApplications.push(load)
                totalLoad += load
                applicationsLoad.push(applicationLoad)    
            }
        }    
    }
    return {
        applicationsLoad: applicationsLoad,
        loadApplications: loadApplications,
        totalLoad: totalLoad
    }
}


wss.on('connection', async function connection(ws) {
 
    console.log("Received new connection! Adding to array...")
    deviceProxies.push({
        id: crypto.randomUUID(),
        conn: ws
    })
    console.log("Balancing applications...")
    await distributeApplicationsToDevicesProxy();

    ws.on('message', function message(data) {
      console.log('received: %s', data);
    
    });

    ws.on('close', async ()=>{
        console.log("Closed connection. Removing from array...")
        deviceProxies.filter(deviceProxy => deviceProxy.conn !== ws)
        console.log("Balancing applications...")
        await distributeApplicationsToDevicesProxy();    
    })
    
    
});



async function distributeApplicationsToDevicesProxy() {
    const organizations = await Organization.find();
    let loadMetrics = getApplicationsLoadMetrics(organizations);
    let loadMean = loadMetrics.totalLoad / (deviceProxies.length);
    console.log(
        "Getting distribution of total applications",
        loadMetrics.applicationsLoad.length,
        "with_loads",
        loadMetrics.loadApplications,
        "total load",
        loadMetrics.totalLoad,
        "mean load",
        loadMean,
        "for",
        deviceProxies.length,
        "device proxies"
    );

    console.log("loadMetrics.applicationsLoad", loadMetrics.applicationsLoad)
    let appCombinations = knapsackProblem.getAllCombinationsFixSize(deviceProxies.length, loadMetrics.loadApplications, loadMetrics.applicationsLoad);
    console.log("loadMetrics.loadApplications", loadMetrics.loadApplications)

    for (let i = 0; i < appCombinations.length; i++) {
        let data = appCombinations[i];
        let deviceProxy = deviceProxies[i];
        deviceProxy.conn.send(JSON.stringify(data));
        deviceProxy.data = data;
        deviceProxy.load = data.load;
        deviceProxies[i] = deviceProxy;
    }
}

// async function updateApplicationDevicesCfg(applicationId, devicesIds, newServiceProfile){
//     for(const deviceProxy of deviceProxies){
//         for(const application of deviceProxy.data){
//             if(application._id.toString() == applicationId){
//                 for(const device of application.devices){
//                     if(devicesIds.includes(device._id.toString())){
//                         device.update=true
//                         device.serviceProfile = newServiceProfile
//                     }else{
//                         device.update=false
//                     }
//                 }
//                 return
//             }
//         }
//     }
// }


module.exports = {
    wss: wss,
    distributeApplicationsToDevicesProxy: distributeApplicationsToDevicesProxy
}