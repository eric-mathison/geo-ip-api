const fs = require('fs');
const rp = require('request-promise');
const tar = require('tar');
const logger = require('../config/logger');
const keys = require('../config/keys');

const databases = {
    'GeoLite2-City': {
        path: '../assets/GeoLite2-City.mmdb',
        url: `https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=${keys.maxmindKey}&suffix=tar.gz`,
    },
    'GeoLite2-ASN': {
        path: '../assets/GeoLite2-ASN.mmdb',
        url: `https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-ASN&license_key=${keys.maxmindKey}&suffix=tar.gz`,
    },
};

async function downloadFile(db, url) {
    const res = await rp.get({ uri: url, encoding: null });
    return new Promise((resolve, reject) => {
        if (res) {
            fs.writeFileSync(`${__dirname}/../assets/${db}.tar.gz`, res, {
                encoding: null,
            });
            tar.x({
                file: `${__dirname}/../assets/${db}.tar.gz`,
                filter: (path) => !!/.*\.mmdb$/.test(path),
                cwd: `${__dirname}/../assets/`,
                sync: true,
                strip: 1,
            });
            logger.debug(`${db} extracted`);
            resolve();
        } else {
            logger.error(`Failed to download ${url}`);
            reject(new Error(`Failed to download ${url}`));
        }
    });
}

function download() {
    if (!fs.existsSync(`${__dirname}/../assets`)) {
        fs.mkdirSync(`${__dirname}/../assets`);
    }

    // eslint-disable-next-line array-callback-return
    const promises = Object.entries(databases).map(async ([key, value]) => {
        if (fs.existsSync(`${__dirname}/${value.path}`)) {
            logger.debug(`${key} exists`);
        } else {
            logger.debug(`${key} does not exist`);
            await downloadFile(key, value.url);
        }
    });

    return Promise.all(promises);
}

function update() {
    if (!fs.existsSync(`${__dirname}/../assets`)) {
        fs.mkdirSync(`${__dirname}/../assets`);
    }

    const promises = Object.entries(databases).map(async ([key, value]) => {
        await downloadFile(key, value.url);
    });

    return Promise.all(promises);
}

module.exports = { download, update };
