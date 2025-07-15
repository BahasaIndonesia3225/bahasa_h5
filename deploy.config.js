const SftpClient = require('ssh2-sftp-client');
const notifier = require('node-notifier');
var dayjs = require('dayjs');
const sftp = new SftpClient()

const ENV_CONFIG_MAP = {
  Hongkong: {
    host: '34.150.122.99',
    port: '22',
    username: 'root',
    password: 'vC60o5MPysDprqFpTJ2g',
    outputPath: 'bahasaindo.net',
  },
  Mainland: {
    host: '47.115.219.240',
    port: '22',
    username: 'root',
    password: 'Bahasa272727',
    outputPath: 'study.bahasaindo.cn',
  },
  Taiwan: {
    host: '104.155.209.57',
    port: '22',
    username: 'root',
    password: 'Bahasa272727',
    outputPath: 'www.bahasaindo.com',
  }
};

const envName = process.argv[2];
const config = ENV_CONFIG_MAP[envName];
const { outputPath } = config;
sftp.connect(config).then(() => {
  sftp.uploadDir(outputPath, `/www/wwwroot/${outputPath}`).then(() => {
    const time = dayjs().format('YYYY-MM-DD HH:mm:ss')
    notifier.notify({
      title: '部署成功',
      message: `部署成功于${time}`
    });
    return sftp.end()
  }).catch((err) => {
    if (sftp.sftp) {
      sftp.sftp.end()
    }
  })
}).catch((err) => {
  if (sftp.sftp) {
    sftp.sftp.end()
  }
})
