const { serverConfig } = require('./server.config');
const SftpClient = require('ssh2-sftp-client');
const notifier = require('node-notifier');
var dayjs = require('dayjs');
const sftp = new SftpClient()

const envName = process.argv[2];
const config = serverConfig[envName];
const { outputPath, serverName } = config;

sftp.connect(config).then(() => {
  sftp.uploadDir(outputPath, `/www/wwwroot/${outputPath}`).then(() => {
    const time = dayjs().format('YYYY-MM-DD HH:mm:ss')
    notifier.notify({
      title: '部署提示',
      message: `${serverName}部署成功于${time}`
    });
    return sftp.end()
  }).catch((err) => {
    if (sftp.sftp) sftp.sftp.end()
  })
}).catch((err) => {
  if (sftp.sftp) sftp.sftp.end()
})
