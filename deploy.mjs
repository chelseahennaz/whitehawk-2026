import Client from 'ssh2-sftp-client';
import path from 'path';

async function deploy() {
  const sftp = new Client();
  try {
    console.log("Connecting to IONOS SFTP...");
    await sftp.connect({
      host: 'home687433637.1and1-data.host',
      port: 22,
      username: 'acc542462075',
      password: 'C5jCTGMEKy*t'
    });
    
    console.log("Connected successfully. Uploading dist/ folder...");
    
    // Upload the dist directory to the remote root
    // uploadDir(src, dst)
    const srcDir = path.join(process.cwd(), 'dist');
    const remoteDir = '/';
    
    sftp.on('upload', info => {
      console.log(`Uploaded: ${info.source}`);
    });

    await sftp.uploadDir(srcDir, remoteDir);
    console.log("✅ Deployment complete! All files successfully uploaded to IONOS.");
  } catch (err) {
    console.error("Deployment failed:", err);
  } finally {
    sftp.end();
  }
}

deploy();
