# Geo IP Location API

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/eric-mathison/geo-ip-api/Test%20Build?style=for-the-badge)

This is a Geographic IP API server that provides location, asn data, time, and currency information about the location of a specified IP address.

This service utilizes the free databases provided by Maxmind GeoLite2.

## Installation

First things first, clone this repo:

```
gh repo clone eric-mathison/geo-ip-api
```

**Before you start, you will need to obtain a free GeoIP2 license key from [Maxmind](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data).**

Once you have your key, install the GeoIP Api Server:

```
npm install
```

## Configuration

Before you'll be able to use this server, you need to insert your `license key` into the `./config/dev.js` file.

For production, set an environment variable named `MAXMIND_KEY` with the value of your key.

This server also includes an **automatic weekly downloader** that will download the GeoIP2 databases every `Tuesday` by default. You may override this setting by adjusting the cron job in the `./services/scheduler.js` file.

## How to Use

To start this server in development:

```bash
npm run dev
```

Getting IP Location data is easy. There are two different ways you can request this data.

1. Using the `/location` route
    > Use this endpoint to use the IP Address included in the request headers.
2. Using the `/location/:ipAddress` route
    > Alternatively, you can specify the IP Address by including it in your request.

On successful query, you will get a response in the form of a JSON Object.

### Sample Response

```json
{
    "continent_code": "NA",
    "continent_name": "North America",
    "country_code": "US",
    "country_name": "United States",
    "country_capital": "Washington D.C.",
    "country_flag_emoji": "🇺🇸",
    "country_flag_emojiU": "U+1F1FA U+1F1F8",
    "registered_country_code": "US",
    "registered_country_name": "United States",
    "represented_country_code": "",
    "represented_country_name": "",
    "city_name": "Queens",
    "region_state_code": "NY",
    "region_state_name": "New York",
    "postal_code": "11375",
    "is_in_eu": false,
    "currency": "USD,USN,USS",
    "calling_code": "1",
    "languages": ["en"],
    "locale": "en-US",
    "accuracy_radius": 1,
    "accuracy_level": "Highest",
    "latitude": 40.726,
    "longitude": -73.848,
    "time_zone": "America/New_York",
    "gmt_offset": -4,
    "gmt_offset_abbr": "EDT",
    "gmt_offset_name": "Eastern Daylight Time",
    "is_daylight_savings": true,
    "is_anonymous": false,
    "is_anonymous_proxy": false,
    "is_anonymous_vpn": false,
    "is_hosting_provider": false,
    "is_legitimate_proxy": false,
    "is_public_proxy": false,
    "is_satellite_provider": false,
    "is_tor_exit_node": false,
    "ip_address": "72.229.28.185",
    "network": "72.229.16.0/20",
    "isp_organization": "TWC-12271-NYC"
}
```

## Tests

Todo
