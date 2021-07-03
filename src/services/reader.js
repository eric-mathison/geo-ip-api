const { Reader } = require('@maxmind/geoip2-node');
const path = require('path');
const _ = require('lodash');
const { DateTime } = require('luxon');
const { countries } = require('countries-list');
const logger = require('../config/logger');

const cityDb = path.join(__dirname, '../assets', 'GeoLite2-City.mmdb');
const asnDb = path.join(__dirname, '../assets', 'GeoLite2-ASN.mmdb');

const location = async (ip, language) => {
    logger.debug('Location Lookup IP: ', { ip });
    logger.debug('Language: ', { language });

    const cityData = await Reader.open(cityDb)
        .then((reader) => {
            return reader.city(ip);
        })
        .catch((err) => {
            logger.error(err);
        });

    const asnData = await Reader.open(asnDb)
        .then((reader) => {
            return reader.asn(ip);
        })
        .catch((err) => {
            logger.error(err);
        });

    if (!cityData) {
        return { error: `Not location data found for IP: ${ip}` };
    }

    const getAccuracyLevel = (radius) => {
        switch (true) {
            case radius <= 50:
                return 'Highest';
            case radius <= 100 && radius > 50:
                return 'High';
            case radius <= 500 && radius > 100:
                return 'Medium';
            case radius <= 1000 && radius > 500:
                return 'Low';
            case radius > 1000:
                return 'Lowest';
            default:
                return '';
        }
    };

    const countryCode = _.get(cityData, 'country.isoCode', '');
    const country = countries[countryCode];

    const locationData = {
        continent_code: _.get(cityData, 'continent.code', ''),
        continent_name: _.get(cityData, 'continent.names.en', ''),
        country_code: _.get(cityData, 'country.isoCode', ''),
        country_name: _.get(cityData, 'country.names.en', ''),
        country_capital: _.get(country, 'capital', ''),
        country_flag_emoji: _.get(country, 'emoji', ''),
        country_flag_emojiU: _.get(country, 'emojiU', ''),
        registered_country_code: _.get(
            cityData,
            'registeredCountry.isoCode',
            ''
        ),
        registered_country_name: _.get(
            cityData,
            'registeredCountry.names.en',
            ''
        ),
        represented_country_code: _.get(
            cityData,
            'representedCountry.isoCode',
            ''
        ),
        represented_country_name: _.get(
            cityData,
            'representedCountry.names.en',
            ''
        ),
        city_name: _.get(cityData, 'city.names.en', ''),
        region_state_code: _.get(cityData, 'subdivisions[0].isoCode', ''),
        region_state_name: _.get(cityData, 'subdivisions[0].names.en', ''),
        postal_code: _.get(cityData, 'postal.code', ''),
        is_in_eu: _.get(cityData, 'registeredCountry.isInEuropeanUnion', ''),
        currency: _.get(country, 'currency', ''),
        calling_code: _.get(country, 'phone', ''),
        languages: _.get(country, 'languages', ''),
        locale: language ? language.split(',').shift() : '',
        accuracy_radius: _.get(cityData, 'location.accuracyRadius', ''),
        accuracy_level: getAccuracyLevel(
            _.get(cityData, 'location.accuracyRadius', '')
        ),
        latitude: _.get(cityData, 'location.latitude', ''),
        longitude: _.get(cityData, 'location.longitude', ''),
        time_zone: _.get(cityData, 'location.timeZone', ''),
        gmt_offset: cityData.location.timeZone
            ? DateTime.local().setZone(cityData.location.timeZone).offset / 60
            : '',
        gmt_offset_abbr: cityData.location.timeZone
            ? DateTime.local().setZone(cityData.location.timeZone)
                  .offsetNameShort
            : '',
        gmt_offset_name: cityData.location.timeZone
            ? DateTime.local().setZone(cityData.location.timeZone)
                  .offsetNameLong
            : '',
        is_daylight_savings: cityData.location.timeZone
            ? DateTime.local().setZone(cityData.location.timeZone).isInDST
            : '',
        is_anonymous: _.get(cityData, 'traits.isAnonymous', ''),
        is_anonymous_proxy: _.get(cityData, 'traits.isAnonymousProxy', ''),
        is_anonymous_vpn: _.get(cityData, 'traits.isAnonymousVpn', ''),
        is_hosting_provider: _.get(cityData, 'traits.isHostingProvider', ''),
        is_legitimate_proxy: _.get(cityData, 'traits.isLegitimateProxy', ''),
        is_public_proxy: _.get(cityData, 'traits.isPublicProxy', ''),
        is_satellite_provider: _.get(
            cityData,
            'traits.isSatelliteProvider',
            ''
        ),
        is_tor_exit_node: _.get(cityData, 'traits.isTorExitNode', ''),
        ip_address: _.get(cityData, 'traits.ipAddress', ''),
        network: _.get(cityData, 'traits.network', ''),
        isp_organization: _.get(asnData, 'autonomousSystemOrganization', ''),
    };

    return locationData;
};

module.exports = location;
