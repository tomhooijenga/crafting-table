const { createWriteStream } = require("fs");
const os = require("os");
const path = require("path");
const { pipeline } = require("stream/promises");
const Zip = require("adm-zip");

async function getReleaseUrl(version) {
    const launcherRequest = await fetch(
        "https://launchermeta.mojang.com/mc/game/version_manifest.json"
    );
    const launcherJson = await launcherRequest.json();

    if (version === 'latest') {
        version = launcherJson.latest.release;
    }

    const { url } = launcherJson.versions.find(({ id }) => id === version);

    return url;
}

async function getJarUrl(releaseUrl) {
    const releaseRequest = await fetch(releaseUrl);
    const releaseJson = await releaseRequest.json();

    return releaseJson.downloads.client.url;
}

async function downloadJar(jarUrl, jarPath) {
    const jarRequest = await fetch(jarUrl);
    const target = createWriteStream(jarPath);
    await pipeline(jarRequest.body, target);
}

async function extractJarToDir(jarPath, dir) {
    const jar = new Zip(jarPath, {});

    jar.extractAllTo(dir, true);
}

(async () => {
    const version = process.argv[2] ?? 'latest';
    const jarPath = path.join(os.tmpdir(), `minecraft-${version}.jar`);
    const extractedJarPath = path.join(os.tmpdir(), `minecraft-${version}`);

    const releaseUrl = await getReleaseUrl(version);
    const jarUrl = await getJarUrl(releaseUrl);
    await downloadJar(jarUrl, jarPath);
    await extractJarToDir(jarPath, extractedJarPath);
})();
