const { WebSocketServer } = require("ws");
const wss = new WebSocketServer({ port: process.env.WS_PORT });
const Organization = require("../organizations/organizationModel").organizationModel
const crypto = require('crypto');

const deviceMgrs = []

// TODO: alterar post do device para salvar na aplicação o ID e as CFGs de serviço
wss.on('connection', async function connection(ws) {
    ws.on('message', function message(data) {
      console.log('received: %s', data);
    });
  
    const organizations = await Organization.find()
    let applications = adaptApplicationCalcLoad(organizations);

    deviceMgrs.push({
        id: crypto.randomUUID(),
        data: applications,
        load: 0,
        conn: ws
    })

    ws.send(JSON.stringify(applications));

});

module.exports = wss

function adaptApplicationCalcLoad(organizations) {
    let applications = [];
    for(const organization of organizations){
        let bucket = organization.bucket
        let token = organization.token
        let applicationDevices = organization.applications
        for (const application of applicationDevices) {
            let load = 0;
            for (const device of application.devices) {
                if(device.serviceProfile){
                    load += (1 / device.serviceProfile.period);
                }
            }
            applications.push({
                applicationId: application.applicationId,
                name: application.name,
                apiKey: application.apiKey?application.apiKey:process.env.PASSWORD_TTN,
                token: token,
                bucket: bucket,
                load: load,
                organization: organization.organizationDataId,
                devices: application.devices
            });
        }    
    }
    return applications;
}
