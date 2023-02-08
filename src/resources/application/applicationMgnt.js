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
            for (const device of application.devices) {
                if(device.serviceProfile){
                    load += (1 / device.serviceProfile.period);
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
    ws.on('message', function message(data) {
      console.log('received: %s', data);
    });
  
    deviceProxies.push({
        id: crypto.randomUUID(),
        conn: ws
    })

    await distributeApplicationsToDevicesProxy();
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
    let appCombinations = knapsackProblem.getAllCombinationsFixSize(deviceProxies.length, loadMetrics.loadApplications, loadMetrics.applicationsLoad);

    for (let i = 0; i < appCombinations.length; i++) {
        let data = appCombinations[i];
        let deviceProxy = deviceProxies[i];
        deviceProxy.conn.send(JSON.stringify(data));
        deviceProxy.data = data;
        deviceProxy.load = data.load;
        deviceProxies[i] = deviceProxy;
    }
}

module.exports = {
    wss: wss,
    distributeApplicationsToDevicesProxy: distributeApplicationsToDevicesProxy
}