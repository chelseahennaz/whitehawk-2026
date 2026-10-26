import Client from 'ssh2-sftp-client';

async function check() {
  const sftp = new Client();
  try {
    await sftp.connect({
      host: 'home687433637.1and1-data.host',
      port: 22,
      username: 'acc542462075',
      password: 'C5jCTGMEKy*t'
    });
    const list = await sftp.list('/');
    const assetsDir = list.find(l => l.name === 'assets');
    console.log("assets directory:", assetsDir ? assetsDir.rights : "not found");
  } catch (err) {
    console.error(err);
  } finally {
    sftp.end();
  }
}
check();
