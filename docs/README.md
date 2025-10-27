<div align="center">
    <img width="400" src="img/slogan.jpg" alt="logo"><br>

# 闲鱼二手99新女生自用 Clash 规则
</div>

<img decoding="async" align=right src="img/laoshu.gif" width="35%">

- 基于 mimoho 内核 1.8.10 版本，理论支持绝大部分第三方 mihomo gui 客户端

- 如果遇到了问题，欢迎在 [issues](https://github.com/Kirby-of-the-Stars/JMusicKook/issues) 中反馈


> [!CAUTION]
> 本项目仅供爱好者学习使用,您将承担所有的法律责任, 作者与其他贡献者将不承担任何责任.


> [!IMPORTANT]
> 本人使用的是 mimoho 内核，所以绝大部分内容都是基于 mihomo 内核进行的配置

## 覆写配置

> [!TIP]
> 由于配置文件内写了非常多的注释
>
> 理论上不需要重复赘述过多的内容，根据文本内的注释自行理解即可
```js
const proxyName = "代理模式";

function main(params) {
    if (!params.proxies) return params;
    overwriteBasicOptions(params);
    overwriteSniffer(params);
    overwriteProxyGroups(params);
    overwriteRules(params);
    overwriteDns(params);
    overwriteTunnel(params);
    return params;
}

// 覆写Basic Options
function overwriteBasicOptions(params) {
    const otherOptions = {
        "mixed-port": 7890,
        "allow-lan": true,
        "unified-delay": true,
        "tcp-concurrent": true,
        "geodata-mode": true,
        "fakeind-process-mode": "strict",
        "global-client-fingerprint": "chrome",
        profile: {
            "store-selected": true,
            "store-fake-ip": true,
        },
        ipv6: true,
        mode: "rule",
        "skip-auth-prefixes": ["127.0.0.1/32"],
        "lan-allowed-ips": ["0.0.0.0/0", "::/0"],
    };
    Object.keys(otherOptions).forEach((key) => {
        params[key] = otherOptions[key];
    });
}

function overwriteSniffer(params) {
    const snifferConfig = {
        enable: true,
        "force-dns-mapping": true,
        "parse-pure-ip": true,
        "override-destination": false,

        sniff: {
            HTTP: {
                ports: ["80", "443"],
                "override-destination": false,
            },

            TLS: {
                ports: ["443"],
            },
        },

        // 跳过嗅探结果
        "skip-domain": ["+.push.apple.com"],

        "skip-dst-address": [
            "91.105.192.0/23",
            "91.108.4.0/22",
            "91.108.8.0/21",
            "91.108.16.0/21",
            "91.108.56.0/22",
            "95.161.64.0/20",
            "149.154.160.0/20",
            "185.76.151.0/24",
            "2001:67c:4e8::/48",
            "2001:b28:f23c::/47",
            "2001:b28:f23f::/48",
            "2a0a:f280:203::/48",
        ]
    };

    params["sniffer"] = snifferConfig;
}

// 覆写代理组
function overwriteProxyGroups(params) {
    // 添加自用代理
    params.proxies
        .push
        //  { name: '1 - 香港 - 示例 ', type: *, server: **, port: *, cipher: **, password: **, udp: true }
        ();
    // 自动选择代理组，按地区分组选延迟最低
    const countryRegions = [
        {
            code: "HK",
            name: "🇭🇰 香港",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/hk.svg",
            regex: /(香港|HK|Hong Kong|🇭🇰)/i,
        },
        {
            code: "TW",
            name: "🇹🇼 台湾",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/tw.svg",
            regex: /(台湾|TW|Taiwan|🇹🇼)/i,
        },
        {
            code: "SG",
            name: "🇸🇬 新加坡",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/sg.svg",
            regex: /(新加坡|狮城|SG|Singapore|🇸🇬)/i,
        },
        {
            code: "AR",
            name: "🇦🇷 阿根廷",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ar.svg",
            regex: /(阿根廷|AR|Argentina|🇦🇷)/i,
        },
        {
            code: "JP",
            name: "🇯🇵 日本",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/jp.svg",
            regex: /(日本|JP|Japan|🇯🇵)/i,
        },
        {
            code: "US",
            name: "🇺🇸 美国",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/us.svg",
            regex: /(美国|US|USA|United States|America|🇺🇸)/i,
        },
        {
            code: "DE",
            name: "🇩🇪 德国",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/de.svg",
            regex: /(德国|DE|Germany|🇩🇪)/i,
        },
        {
            code: "KR",
            name: "🇰🇷 韩国",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/kr.svg",
            regex: /(韩国|KR|Korea|South Korea|🇰🇷)/i,
        },
        {
            code: "UK",
            name: "🇬🇧 英国",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/gb.svg",
            regex: /(英国|UK|United Kingdom|Britain|Great Britain|🇬🇧)/i,
        },
        {
            code: "CA",
            name: "🇨🇦 加拿大",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ca.svg",
            regex: /(加拿大|CA|Canada|🇨🇦)/i,
        },
        {
            code: "AU",
            name: "🇦🇺 澳大利亚",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/au.svg",
            regex: /(澳大利亚|AU|Australia|🇦🇺)/i,
        },
        {
            code: "ES",
            name: "🇪🇸 西班牙",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/es.svg",
            regex: /\b(西班牙|ES|Spain|🇪🇸)\b/i,
        },
        {
            code: "NL",
            name: "🇳🇱 荷兰",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/nl.svg",
            regex: /\b(荷兰|NL|Netherlands|🇳🇱)\b/i,
        },
        {
            code: "TR",
            name: "🇹🇷 土耳其",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/tr.svg",
            regex: /(土耳其|TR|Turkey|🇹🇷)/i,
        },
        {
            code: "RU",
            name: "🇷🇺 俄罗斯",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ru.svg",
            regex: /(俄罗斯|RU|Russia|🇷🇺)/i,
        },
        {
            code: "IN",
            name: "🇮🇳 印度",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/in.svg",
            regex: /\b(印度|IN|India|🇮🇳)\b/i,
        },
        {
            code: "BR",
            name: "🇧🇷 巴西",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/br.svg",
            regex: /(巴西|BR|Brazil|🇧🇷)/i,
        },
        {
            code: "IT",
            name: "🇮🇹 意大利",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/it.svg",
            regex: /(意大利|IT|Italy|🇮🇹)/i,
        },
        {
            code: "CH",
            name: "🇨🇭 瑞士",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ch.svg",
            regex: /(瑞士|CH|Switzerland|🇨🇭)/i,
        },
        {
            code: "SE",
            name: "🇸🇪 瑞典",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/se.svg",
            regex: /(瑞典|SE|Sweden|🇸🇪)/i,
        },
        {
            code: "NO",
            name: "🇳🇴 挪威",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/no.svg",
            regex: /(挪威|NO|Norway|🇳🇴)/i,
        },
        {
            name: "其它",
            regex: /(?!.*(?: 剩余 | 到期 | 主页 | 官网 | 游戏 | 关注))(.*)/,
        },
    ];

    // 所有代理
    // 所有地区
    const allRegex =
        /^(?!.*(?:自动|故障|流量|官网|套餐|机场|订阅|年|月|失联|频道|Traffic|Expire)).*$/;
    const allProxies = getProxiesByRegexOne(params, allRegex);
    // const allProxies = params["proxies"].map((e) => e.name);

    const availableCountryCodes = new Set();
    const otherProxies = [];
    for (const proxy of params["proxies"]) {
        let found = false;
        for (const region of countryRegions) {
            if (region.regex.test(proxy.name)) {
                availableCountryCodes.add(region.name);
                found = true;
                break;
            }
        }
        if (!found) {
            otherProxies.push(proxy.name);
        }
    }

    const autoProxyGroupRegexs = countryRegions
        .filter((region) => availableCountryCodes.has(region.name))
        .map((region) => ({
            name: `${region.name} - 自动选择`,
            regex: region.regex,
        }));

    const autoProxyGroups = autoProxyGroupRegexs
        .map((item) => ({
            name: item.name,
            type: "fallback",
            url: "http://www.gstatic.com/generate_204",
            interval: 300,
            tolerance: 50,
            proxies: getProxiesByRegex(params, item.regex),
            hidden: true,
        }))
        .filter((item) => item.proxies.length > 0);

    const manualProxyGroupsConfig = countryRegions
        .filter((region) => availableCountryCodes.has(region.name))
        .map((region) => ({
            name: `${region.name} - 手动选择`,
            type: "select",
            proxies: getManualProxiesByRegex(params, region.regex),
            icon: region.icon,
            hidden: false,
        }))
        .filter((item) => item.proxies.length > 0);

    const groups = [
        {
            name: proxyName,
            type: "select",
            url: "http://www.gstatic.com/generate_204",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/adjust.svg",
            proxies: [
                "延迟优选",
                "故障转移",
                "手动选择",
                "负载均衡 (散列)",
                "负载均衡 (轮询)",
                "DIRECT",
            ],
        },
        {
            name: "延迟优选",
            type: "url-test",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/speed.svg",
            "exclude-filter": "自动选择|手动选择",
            proxies: allProxies.length > 0 ? allProxies : ["DIRECT"],
            hidden: true,
        },
        {
            name: "故障转移",
            type: "fallback",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/ambulance.svg",
            "exclude-filter": "自动选择|手动选择",
            proxies: allProxies.length > 0 ? allProxies : ["DIRECT"],
            hidden: true,
        },
        {
            name: "手动选择",
            type: "select",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/link.svg",
            proxies: [
                ...countryRegions
                    .filter((region) => availableCountryCodes.has(region.name))
                    .flatMap((region) => [
                        `${region.name} - 自动选择`,
                        `${region.name} - 手动选择`,
                    ]),
            ],
        },
        {
            name: "负载均衡 (散列)",
            type: "load-balance",
            url: "http://www.gstatic.com/generate_204",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/balance.svg",
            interval: 300,
            "max-failed-times": 3,
            strategy: "consistent-hashing",
            lazy: true,
            "exclude-filter": "自动选择|手动选择",
            proxies: allProxies.length > 0 ? allProxies : ["DIRECT"],
            hidden: true,
        },
        {
            name: "负载均衡 (轮询)",
            type: "load-balance",
            url: "http://www.gstatic.com/generate_204",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/merry_go.svg",
            interval: 300,
            "max-failed-times": 3,
            "exclude-filter": "自动选择|手动选择",
            strategy: "round-robin",
            lazy: true,
            proxies: allProxies.length > 0 ? allProxies : ["DIRECT"],
            hidden: true,
        },
        {
            name: "电报消息",
            type: "select",
            proxies: [
                proxyName,
                ...countryRegions
                    .filter((region) => availableCountryCodes.has(region.name))
                    .flatMap((region) => [
                        `${region.name} - 自动选择`,
                        `${region.name} - 手动选择`,
                    ]),
                "DIRECT",
            ],
            // "include-all": true,
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/telegram.svg",
        },
        {
            name: "AI",
            type: "select",
            proxies: [
                proxyName,
                ...countryRegions
                    .filter((region) => availableCountryCodes.has(region.name))
                    .flatMap((region) => [
                        `${region.name} - 自动选择`,
                        `${region.name} - 手动选择`,
                    ]),
                "DIRECT",
            ],
            // "include-all": true,
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/chatgpt.svg",
        },
        {
            name: "Bilibili港澳台",
            type: "select",
            proxies: [
                "DIRECT",
                proxyName,
                ...countryRegions
                    .filter((region) => availableCountryCodes.has(region.name))
                    .flatMap((region) => [
                        `${region.name} - 自动选择`,
                        `${region.name} - 手动选择`,
                    ]),
            ],
            // "include-all": true,
            icon: "https://www.bilibili.com/favicon.ico",
        },
        {
            name: "流媒体",
            type: "select",
            proxies: [
                proxyName,
                ...countryRegions
                    .filter((region) => availableCountryCodes.has(region.name))
                    .flatMap((region) => [
                        `${region.name} - 自动选择`,
                        `${region.name} - 手动选择`,
                    ]),
                "DIRECT",
            ],
            // "include-all": true,
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/youtube.svg",
        },
        {
            name: "苹果服务",
            type: "select",
            proxies: [
                proxyName,
                ...countryRegions
                    .filter((region) => availableCountryCodes.has(region.name))
                    .flatMap((region) => [
                        `${region.name} - 自动选择`,
                        `${region.name} - 手动选择`,
                    ]),
            ],
            // "include-all": true,
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/apple.svg",
        },
        {
            name: "微软服务",
            type: "select",
            proxies: [
                proxyName,
                ...countryRegions
                    .filter((region) => availableCountryCodes.has(region.name))
                    .flatMap((region) => [
                        `${region.name} - 自动选择`,
                        `${region.name} - 手动选择`,
                    ]),
                "DIRECT",
            ],
            // "include-all": true,
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/microsoft.svg",
        },
        {
            name: "GoogleFCM",
            type: "select",
            proxies: [
                "DIRECT",
                proxyName,
                ...countryRegions
                    .filter((region) => availableCountryCodes.has(region.name))
                    .flatMap((region) => [
                        `${region.name} - 自动选择`,
                        `${region.name} - 手动选择`,
                    ]),
            ],
            // "include-all": true,
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/google.svg",
        },
        {
            name: "Steam地区",
            type: "select",
            proxies: [
                "DIRECT",
                proxyName,
                ...countryRegions
                    .filter((region) => availableCountryCodes.has(region.name))
                    .flatMap((region) => [
                        `${region.name} - 自动选择`,
                        `${region.name} - 手动选择`,
                    ]),
            ],
            // "include-all": true,
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/steam.svg",
        },
        {
            name: "Emby",
            type: "select",
            proxies: [
                "DIRECT",
                proxyName,
                ...countryRegions
                    .filter((region) => availableCountryCodes.has(region.name))
                    .flatMap((region) => [
                        `${region.name} - 自动选择`,
                        `${region.name} - 手动选择`,
                    ]),
            ],
            // "include-all": true,
            icon: "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/2.19.0/emby.svg",
        },
        {
            name: "漏网之鱼",
            type: "select",
            proxies: ["DIRECT", proxyName],
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/fish.svg",
        },
    ];

    autoProxyGroups.length &&
    groups[2].proxies.unshift(...autoProxyGroups.map((item) => item.name));
    groups.push(...autoProxyGroups);
    groups.push(...manualProxyGroupsConfig);
    params["proxy-groups"] = groups;
}

// 修改规则
function overwriteRules(params) {
    const customRules = [
        // 在此添加自定义规则，优先级次于ad。例子：
        // "DOMAIN,baidu.com,DIRECT",
    ];

    // 广告拦截 / 隐私保护 / Malware 拦截 / Phiishing 拦截
    const adNonipRules = [
        "RULE-SET,Reject_no_ip,REJECT",
        "RULE-SET,Reject_domainset,REJECT",
        "RULE-SET,Reject_no_ip_drop,REJECT-DROP",
        "RULE-SET,Reject_no_ip_no_drop,REJECT",
    ];

    const nonipRules = [
        // 个人遇到需要代理的域名(比较特殊)
        "RULE-SET,CustomProxy_no_ip," + proxyName,

        // GoolgeFCM 推送
        "RULE-SET,GoogleFCM_no_ip,GoogleFCM",

        // 网易云音乐
        "RULE-SET,NetEaseMusic_no_ip,DIRECT",

        // Steam 地区
        "RULE-SET,SteamRegion_no_ip,Steam地区",

        // SteamCN
        "RULE-SET,SteamCN_no_ip,DIRECT",
        // Steam
        "RULE-SET,Steam_no_ip," + proxyName,

        /**
         * 包含所有常见静态资源 CDN 域名、对象存储域名
         * 如果你正在使用商业性质的公共代理服务、且你的服务商提供按低倍率结算流量消耗的节点，可使用上述规则组将流量分配给这部分节点
         */
        "RULE-SET,CDN_domainset," + proxyName,
        "RULE-SET,CDN_no_ip," + proxyName,

        // 流媒体域名
        /**
         * 包含
         * 4gtv、AbemaTV、All4、Amazon Prime Video、Apple TV、Apple Music TV、Bahamut、BBC、Bilibili Intl、
         * DAZN、Deezer、Disney+、Discovery+、DMM、encoreTVB、Fox Now、Fox+、HBO GO/Now/Max/Asia、Hulu、HWTV、
         * JOOX、Jwplayer、KKBOX、KKTV、Line TV、Naver TV、myTV Super、Netflix、niconico、Now E、Paramount+、PBS、Peacock、Pandora、PBS、Pornhub、SoundCloud、
         * PBS、Spotify、TaiwanGood、Tiktok Intl、Twitch、ViuTV、ShowTime、iQiYi Global、Himalaya Podcast、Overcast、WeTV
         */
        "RULE-SET,Bilibili,Bilibili港澳台",
        "RULE-SET,Stream_no_ip,流媒体",
        "RULE-SET,Emby_no_ip,Emby",

        // tg 消息
        /**
         * 推荐仅使用 IP CIDR 规则。IP CIDR 规则数据完全来自 Telegram 官方发布的 CIDR 列表，不包含 Telegram 尚未启用的 CDN、数据中心的 IP。
         * ASN 规则仅适合作为补充；搭配非官方 MaxMind GeoLite 数据库（例如 GeoIP2-CN）使用时会影响匹配。
         */
        "RULE-SET,Telegram_no_ip,电报消息",

        // 云上贵州（CN）的苹果 CDN 无特殊需求直连即可
        "RULE-SET,AppleCDN_no_ip,DIRECT",
        // 苹果 CN 域名
        "RULE-SET,AppleCN_no_ip,DIRECT",

        // Microsoft 中国 CDN
        "RULE-SET,MicrosoftCDN_no_ip,DIRECT",

        // 软件更新、操作系统等大文件下载
        /**
         * 这部分域名可能包含 Microsoft 和 Apple 的国内 CDN 节点
         * 如果你设置了前面的Microsoft 和 Apple 的国内 CDN 节点为直连，按照优先级这部分CDN不会被代理，请放心
         */
        "RULE-SET,Download_domainset," + proxyName,
        "RULE-SET,Download_no_ip," + proxyName,

        // 苹果需要代理的域名
        "RULE-SET,Apple_no_ip,苹果服务",

        // 微软需要代理域名
        "RULE-SET,Microsoft_no_ip,微软服务",

        // ai 相关
        /**
         * 包含 OpenAI、Google Gemini、Claude、Perplexity 等
         */
        "RULE-SET,AI_no_ip,AI",

        // 常见海外服务和互联网公司的域名 有部分域名被DNS污染，故使用代理
        "RULE-SET,Global_no_ip," + proxyName,

        // 国内常见互联网公司和服务的域名
        "RULE-SET,Domestic_no_ip,DIRECT",
        "RULE-SET,Direct_no_ip,DIRECT",

        // 内网域名和局域网 IP
        /**
         * 域名列表包含 .local 和局域网 IP 的 in-addr.arpa 域名（即 AS112 域名）
         * 这部分域名一般会被解析到局域网 IP、需要走内网 DNS 解析、需要直连访问
         */
        "RULE-SET,Lan_no_ip,DIRECT",
    ];

    const ipRules = [
        // GooleFCM 推送
        "RULE-SET,GoogleFCM_ip,GoogleFCM",

        // 网易云音乐
        "RULE-SET,NetEaseMusic_ip,DIRECT",

        // SteamCN ip
        "RULE-SET,SteamCN_ip,DIRECT",

        // 广告拦截 / 隐私保护 / Malware 拦截 / Phiishing 拦截（ip）
        "RULE-SET,Reject_ip,REJECT",

        // telegram ip
        "RULE-SET,Telegram_ip,电报消息",

        // 流媒体 ip
        /**
         * 包含
         * 4gtv、AbemaTV、All4、Amazon Prime Video、Apple TV、Apple Music TV、Bahamut、BBC、Bilibili Intl、
         * DAZN、Deezer、Disney+、Discovery+、DMM、encoreTVB、Fox Now、Fox+、HBO GO/Now/Max/Asia、Hulu、HWTV、
         * JOOX、Jwplayer、KKBOX、KKTV、Line TV、Naver TV、myTV Super、Netflix、niconico、Now E、Paramount+、PBS、Peacock、Pandora、PBS、Pornhub、SoundCloud、
         * PBS、Spotify、TaiwanGood、Tiktok Intl、Twitch、ViuTV、ShowTime、iQiYi Global、Himalaya Podcast、Overcast、WeTV
         */
        "RULE-SET,Stream_ip,流媒体",

        // 国内常见互联网公司和服务的 IP
        "RULE-SET,Domestic_ip,DIRECT",
        "RULE-SET,China_ip,DIRECT",

        // 内网域名和局域网 IP
        /**
         * 域名列表包含 .local 和局域网 IP 的 in-addr.arpa 域名（即 AS112 域名）
         * 这部分域名一般会被解析到局域网 IP、需要走内网 DNS 解析、需要直连访问
         */
        "RULE-SET,Lan_ip,DIRECT",
        // 使用 GEOIP 和 GEOSITE 兜底直连规则
        "GEOIP,CN,DIRECT",
        "GEOSITE,cn,DIRECT",
        // 兜底
        "MATCH,漏网之鱼",
    ];

    const allNonipRules = [...adNonipRules, ...customRules, ...nonipRules];

    // 规则
    // 需要非IP类规则写在 IP类规则之前！
    /**
     * 避免 DNS 污染和 DNS 泄漏最有效的办法就是永远不在本地进行 DNS 解析，而 Mihomo 能且只能通过 Fake IP 和域名规则匹配的方式 可以实现非直连域名 一定不在本地本机进行任何 DNS 解析。
     * 在 Mihomo 中，规则自上而下匹配，只有当遇到 IP 类规则（如 IP-CIDR、IP-CIDR6、GEOIP 和 IP-ASN）时才会发起 DNS 解析。
     * 因此，在 Mihomo 中，将会触发 DNS 解析的规则放在域名和 URL 匹配规则后面非常重要。
     */
    const rules = [
        // 非ip类规则
        ...allNonipRules,

        // ip类规则
        ...ipRules,
    ];

    // 插入规则
    params.rules = rules;

    // 远程规则类型
    const ruleAnchor = {
        ip: {
            type: "http",
            interval: 1800,
            behavior: "ipcidr",
            format: "yaml",
        },
        domain: {
            type: "http",
            interval: 1800,
            behavior: "domain",
            format: "yaml",
        },
        classical: {
            type: "http",
            interval: 1800,
            behavior: "classical",
            format: "yaml",
        },
    };

    // 自己仓库的规则
    const ruleProviders = {
        /**
         * 屏蔽部分
         */

        // ##################################################################################################################

        // 广告拦截 / 隐私保护 / Malware 拦截 / Phiishing 拦截
        Reject_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/REJECT/ip/Reject_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/REJECT/ip/Reject_ip.yaml",
        },

        // ##################################################################################################################

        // 广告拦截 / 隐私保护 / Malware 拦截 / Phiishing 拦截
        Reject_no_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/REJECT/no_ip/Reject_no_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/REJECT/no_ip/Reject_no_ip.yaml",
        },

        Reject_domainset: {
            ...ruleAnchor.domain,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/REJECT/no_ip/Reject_domainset.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/REJECT/no_ip/Reject_domainset.yaml",
        },

        Reject_no_ip_drop: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/REJECT/no_ip/Reject_no_ip_drop.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/REJECT/no_ip/Reject_no_ip_drop.yaml",
        },

        Reject_no_ip_no_drop: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/REJECT/no_ip/Reject_no_ip_no_drop.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/REJECT/no_ip/Reject_no_ip_no_drop.yaml",
        },

        // ##################################################################################################################

        /**
         * 直连部分
         */

        // ##################################################################################################################

        // 国内常见互联网公司和服务的 IP
        China_ip: {
            ...ruleAnchor.ip,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/ip/China_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/ip/China_ip.yaml",
        },

        // 国内常见互联网公司和服务的 IP
        Domestic_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/ip/Domestic_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/ip/Domestic_ip.yaml",
        },

        // GoogleFCM IP
        GoogleFCM_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/ip/GoogleFCM_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/ip/GoogleFCM_ip.yaml",
        },

        // 内网域名和局域网 IP
        Lan_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/ip/Lan_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/ip/Lan_ip.yaml",
        },

        // 网易云音乐 ip
        NetEaseMusic_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/ip/NetEaseMusic_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/ip/NetEaseMusic_ip.yaml",
        },

        // SteamCN IP
        SteamCN_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/ip/SteamCN_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/ip/SteamCN_ip.yaml",
        },

        // ##################################################################################################################

        // apple CDN 云上贵州
        AppleCDN_no_ip: {
            ...ruleAnchor.domain,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/AppleCDN_no_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/AppleCDN_no_ip.yaml",
        },

        // 苹果直连域名
        AppleCN_no_ip: {
            ...ruleAnchor.domain,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/AppleCN_no_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/AppleCN_no_ip.yaml",
        },

        // 国内常见互联网公司和服务的域名
        Direct_no_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/Direct_no_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/Direct_no_ip.yaml",
        },

        // 国内常见互联网公司和服务的域名
        Domestic_no_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/Domestic_no_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/Domestic_no_ip.yaml",
        },

        // Google Fcm no ip
        GoogleFCM_no_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/GoogleFCM_no_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/GoogleFCM_no_ip.yaml",
        },

        // 内网域名和局域网 IP
        Lan_no_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/Lan_no_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/Lan_no_ip.yaml",
        },

        // 微软中国 CDN
        MicrosoftCDN_no_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/MicrosoftCDN_no_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/MicrosoftCDN_no_ip.yaml",
        },

        // 网易云音乐域名
        NetEaseMusic_no_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/NetEaseMusic_no_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/NetEaseMusic_no_ip.yaml",
        },

        // SteamCN 域名
        SteamCN_no_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/SteamCN_no_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/SteamCN_no_ip.yaml",
        },

        // Steam 地区域名
        SteamRegion_no_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/SteamRegion_no_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/SteamRegion_no_ip.yaml",
        },

        // ##################################################################################################################

        /**
         * 代理部分
         */

        // ##################################################################################################################

        // Bilibili IP
        Bilibili: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/ip/Bilibili_no_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/ip/Bilibili_no_ip.yaml",
        },
        
        // 流媒体 IP
        Stream_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/ip/Stream_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/ip/Stream_ip.yaml",
        },

        // telegram ip
        Telegram_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/ip/Telegram_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/ip/Telegram_ip.yaml",
        },

        // ##################################################################################################################

        // ai 相关 包含 OpenAI、Google Gemini、Claude、Perplexity 等
        AI_no_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/AI_no_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/AI_no_ip.yaml",
        },

        // apple
        Apple_no_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/Apple_no_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/Apple_no_ip.yaml",
        },

        // 常需要代理的静态 CDN
        CDN_domainset: {
            ...ruleAnchor.domain,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/CDN_domainset.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/CDN_domainset.yaml",
        },

        // 常需要代理的静态 CDN
        CDN_no_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/CDN_no_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/CDN_no_ip.yaml",
        },

        // 存放着个人遇到需要代理的域名
        CustomProxy_no_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/CustomProxy_no_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/CustomProxy_no_ip.yaml",
        },

        // 软件更新、操作系统等大文件下载
        Download_domainset: {
            ...ruleAnchor.domain,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/Download_domainset.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/Download_domainset.yaml",
        },

        // 软件更新、操作系统等大文件下载
        Download_no_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/Download_no_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/Download_no_ip.yaml",
        },

        // 常见海外服务和互联网公司的域名 有部分域名被DNS污染，故使用代理
        Global_no_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/Global_no_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/Global_no_ip.yaml",
        },

        // 微软需要代理的域名
        Microsoft_no_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/Microsoft_no_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/Microsoft_no_ip.yaml",
        },

        // Steam 需要代理的域名
        Steam_no_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/Steam_no_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/Steam_no_ip.yaml",
        },

        // 流媒体域名
        Stream_no_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/Stream_no_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/Stream_no_ip.yaml",
        },

        // 流媒体域名
        Emby_no_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/Emby_no_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/Emby_no_ip.yaml",
        },

        // telegram 域名
        Telegram_no_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/Telegram_no_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/Telegram_no_ip.yaml",
        },

        // ##################################################################################################################
    };

    // 插入远程规则
    params["rule-providers"] = ruleProviders;
}

function getProxiesByRegexOne(params, regex) {
    return params.proxies.filter((e) => regex.test(e.name)).map((e) => e.name);
}

function getProxiesByRegex(params, regex) {
    const matchedProxies = params.proxies
        .filter((e) => regex.test(e.name))
        .map((e) => e.name);
    return matchedProxies.length > 0 ? matchedProxies : ["手动选择"];
}

// 修改DNS
function overwriteDns(params) {
    const dnsOptions = {
        enable: true,
        "listen": "0.0.0.0:1053",
        "enhanced-mode": "fake-ip", // fake-ip 或 redir-host
        "fake-ip-range": "198.18.0.1/16",
        "use-hosts": false,
        "use-system-hosts": false,
        ipv6: false,

        "fake-ip-filter": [
            "*",
            "+.lan",
            "+.local",
            "time.*.com",
            "ntp.*.com",
            "+.market.xiaomi.com",
            "localhost.ptlogin2.qq.com",
            "localhost.sec.qq.com",
            "+.qq.com",
            "+.tencent.com",
            "+.msftconnecttest.com",
            "+.msftncsi.com",
        ],

        "default-nameserver": [
            "tls://223.5.5.5",
        ],

        nameserver: [
            "https://dns.alidns.com/dns-query",
            "https://doh.pub/dns-query",
        ],

        "proxy-server-nameserver": [
            "https://doh.pub/dns-query",
            "https://dns.alidns.com/dns-query",
        ],
    };

    params["dns"] = dnsOptions;
}

function getManualProxiesByRegex(params, regex) {
    const matchedProxies = params.proxies
        .filter((e) => regex.test(e.name))
        .map((e) => e.name);
    return matchedProxies.length > 0
        ? matchedProxies
        : ["DIRECT", "手动选择", proxyName];
}

// 覆写Tunnel
function overwriteTunnel(params) {
    const tunnelOptions = {
        enable: true,
        stack: "mixed",
        device: "Mihomo",
        "dns-hijack": ["any:53"],
        "auto-route": true,
        "auto-redirect": false,
        "auto-detect-interface": true,
        "strict-route": false,
        "route-exclude-address": [],
        mtu: 1500,
    };
    params.tun = { ...tunnelOptions };
}

```

## config.yaml

> [!TIP]
> 如果你不知道这个配置文件如何使用，还是建议使用上面的覆写方案
```yaml
#------------------------------------------------------------------------------
proxies:
proxy-providers:
# 在下方的url填入订阅链接即可
  myclash:
    type: http
    url: "xxx"
    path: ./MyClashProvider.yaml
    interval: 21600
    exclude-filter: 自动|故障|流量|官网|套餐|机场|订阅|年|月|失联|频道|Traffic|Expire
    health-check:
      enable: true
      url: https://www.gstatic.com/generate_204
      interval: 900
      timeout: 3000
      lazy: true
      expected-status: 204
#------------------------------------------------------------------------------

# 注意！！！！ 如果无特殊需求，只需要填入订阅链接即可

#开始编辑配置时，心中牢记缩进和冒号引号，任何不懂，查看官方wiki：https://wiki.metacubex.one
#修改配置后如果内核不能启动，请查看日志，日志中会告诉你配置第几行写错
mixed-port: 7890
mode: rule
allow-lan: true
unified-delay: true
tcp-concurrent: true
find-process-mode: strict
log-level: info
ipv6: true
#关掉后可能在部分手机上出现dns泄露，volte不可用等问题，目前IPv6可以正常使用，不建议关闭
external-controller: 0.0.0.0:9090
external-ui: WebUI
external-ui-url: "https://github.com/Zephyruso/zashboard/releases/latest/download/dist.zip"


geodata-mode: true
geox-url:
  geoip: "https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geoip.dat"
  geosite: "https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geosite.dat"
  mmdb: "https://raw.githubusercontent.com/Loyalsoldier/geoip/release/Country.mmdb"
  asn: "https://github.com/xishang0128/geoip/releases/download/latest/GeoLite2-ASN.mmdb"
geo-auto-update: true
geo-update-interval: 48

profile:
  store-selected: true
  store-fake-ip: true

#嗅探器关掉本机可能出现上网异常，连接本机热点的设备可能无法上网
sniffer:
  enable: true
  parse-pure-ip: true
  force-dns-mapping: true
  override-destination: false
  sniff:
    HTTP:
      ports:
        - 80
        - 443
      override-destination: false
    TLS:
      ports:
        - 443
  skip-domain:
    - +.push.apple.com
  skip-dst-address:
    - 91.105.192.0/23
    - 91.108.4.0/22
    - 91.108.8.0/21
    - 91.108.16.0/21
    - 91.108.56.0/22
    - 95.161.64.0/20
    - 149.154.160.0/20
    - 185.76.151.0/24
    - 2001:67c:4e8::/48
    - 2001:b28:f23c::/47
    - 2001:b28:f23f::/48
    - 2a0a:f280:203::/48

#tun必须开启，否则将无法代理流量，如网页打开慢，电报卡连接中，
#可以尝试更换堆栈，同一堆栈在不同设备上体验不同，自行尝试。
#更换为非gvisor堆栈可能导致IPv6出现问题
tun:
  enable: true
  device: Meta
  stack: gvisor
  auto-route: true
  auto-redirect: false
  auto-detect-interface: true
  dns-hijack:
    - any:53
  route-exclude-address: []
  mtu: 1500
#exclude-package内填写的包名，网络流量不经过tun，相当于黑名单
#默认添加MIUI镜像服务以及三星电话服务，避免系统功能不可用
#如果想仅代理指定应用，请将exclude-package改为include-package
#然后填上想要走代理的包名，不要忘了英文冒号和缩进。
#目前分流规则已足够完善，白名单可能存在问题，不建议使用

dns:
  enable: true
  listen: 0.0.0.0:1053
  ipv6: false
  ipv6-timeout: 300
  respect-rules: false
  enhanced-mode: fake-ip
  use-hosts: false
  use-system-hosts: false
  fake-ip-range: 198.18.0.1/16
  fake-ip-filter:
    - "*"
    - +.lan
    - +.local
    - time.*.com
    - ntp.*.com
    - +.market.xiaomi.com
    - localhost.ptlogin2.qq.com
    - localhost.sec.qq.com
    - +.qq.com
    - +.tencent.com
    - +.msftconnecttest.com
    - +.msftncsi.com
  default-nameserver:
    - tls://223.5.5.5
  nameserver:
    - https://doh.pub/dns-query
    - https://dns.alidns.com/dns-query
  proxy-server-nameserver:
    - https://doh.pub/dns-query
    - https://dns.alidns.com/dns-query
  direct-nameserver: []
  nameserver-policy: {}

proxy-groups:
  - name: 代理模式
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/adjust.svg
    proxies:
      - 延迟优选
      - 故障转移
      - 手动选择
      - 负载均衡(散列)
      - 负载均衡(轮询)
      - DIRECT
      
  - name: 延迟优选
    type: url-test
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/speed.svg
    use:
      - myclash
    hidden: true
    
  - name: 故障转移
    type: fallback
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/ambulance.svg
    use:
      - myclash
    hidden: true
    
  - name: 手动选择
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/link.svg
    proxies:
      - 🇭🇰 香港 - 自动选择
      - 🇭🇰 香港 - 手动选择
      - 🇹🇼 台湾 - 自动选择
      - 🇹🇼 台湾 - 手动选择
      - 🇸🇬 新加坡 - 自动选择
      - 🇸🇬 新加坡 - 手动选择
      - 🇦🇷 阿根廷 - 自动选择
      - 🇦🇷 阿根廷 - 手动选择
      - 🇯🇵 日本 - 自动选择
      - 🇯🇵 日本 - 手动选择
      - 🇺🇸 美国 - 自动选择
      - 🇺🇸 美国 - 手动选择
      - 🇩🇪 德国 - 自动选择
      - 🇩🇪 德国 - 手动选择
      - 🇰🇷 韩国 - 自动选择
      - 🇰🇷 韩国 - 手动选择
      - 🇬🇧 英国 - 自动选择
      - 🇬🇧 英国 - 手动选择
      - 🇨🇦 加拿大 - 自动选择
      - 🇨🇦 加拿大 - 手动选择
      - 🇦🇺 澳大利亚 - 自动选择
      - 🇦🇺 澳大利亚 - 手动选择
      - 🇪🇸 西班牙 - 自动选择
      - 🇪🇸 西班牙 - 手动选择
      - 🇳🇱 荷兰 - 自动选择
      - 🇳🇱 荷兰 - 手动选择
      - 🇹🇷 土耳其 - 自动选择
      - 🇹🇷 土耳其 - 手动选择
      - 🇷🇺 俄罗斯 - 自动选择
      - 🇷🇺 俄罗斯 - 手动选择
      - 🇮🇳 印度 - 自动选择
      - 🇮🇳 印度 - 手动选择
      - 🇧🇷 巴西 - 自动选择
      - 🇧🇷 巴西 - 手动选择
      - 🇮🇹 意大利 - 自动选择
      - 🇮🇹 意大利 - 手动选择
      - 🇨🇭 瑞士 - 自动选择
      - 🇨🇭 瑞士 - 手动选择
      - 🇸🇪 瑞典 - 自动选择
      - 🇸🇪 瑞典 - 手动选择
      - 🇳🇴 挪威 - 自动选择
      - 🇳🇴 挪威 - 手动选择
      - 其他 - 自动选择
      - 其他 - 手动选择
      
  - name: 负载均衡(散列)
    type: load-balance
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/balance.svg
    interval: 300
    strategy: consistent-hashing
    lazy: true
    max-failed-times: 3
    use:
      - myclash
    hidden: true
    
  - name: 负载均衡(轮询)
    type: load-balance
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/merry_go.svg
    interval: 300
    max-failed-times: 3
    strategy: round-robin
    lazy: true
    use:
      - myclash
    hidden: true
    
  - name: 电报消息
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/telegram.svg
    proxies:
      - 代理模式
      - 延迟优选
      - 故障转移
      - 手动选择
      - 🇭🇰 香港 - 自动选择
      - 🇭🇰 香港 - 手动选择
      - 🇹🇼 台湾 - 自动选择
      - 🇹🇼 台湾 - 手动选择
      - 🇸🇬 新加坡 - 自动选择
      - 🇸🇬 新加坡 - 手动选择
      - 🇦🇷 阿根廷 - 自动选择
      - 🇦🇷 阿根廷 - 手动选择
      - 🇯🇵 日本 - 自动选择
      - 🇯🇵 日本 - 手动选择
      - 🇺🇸 美国 - 自动选择
      - 🇺🇸 美国 - 手动选择
      - 🇩🇪 德国 - 自动选择
      - 🇩🇪 德国 - 手动选择
      - 🇰🇷 韩国 - 自动选择
      - 🇰🇷 韩国 - 手动选择
      - 🇬🇧 英国 - 自动选择
      - 🇬🇧 英国 - 手动选择
      - 🇨🇦 加拿大 - 自动选择
      - 🇨🇦 加拿大 - 手动选择
      - 🇦🇺 澳大利亚 - 自动选择
      - 🇦🇺 澳大利亚 - 手动选择
      - 🇪🇸 西班牙 - 自动选择
      - 🇪🇸 西班牙 - 手动选择
      - 🇳🇱 荷兰 - 自动选择
      - 🇳🇱 荷兰 - 手动选择
      - 🇹🇷 土耳其 - 自动选择
      - 🇹🇷 土耳其 - 手动选择
      - 🇷🇺 俄罗斯 - 自动选择
      - 🇷🇺 俄罗斯 - 手动选择
      - 🇮🇳 印度 - 自动选择
      - 🇮🇳 印度 - 手动选择
      - 🇧🇷 巴西 - 自动选择
      - 🇧🇷 巴西 - 手动选择
      - 🇮🇹 意大利 - 自动选择
      - 🇮🇹 意大利 - 手动选择
      - 🇨🇭 瑞士 - 自动选择
      - 🇨🇭 瑞士 - 手动选择
      - 🇸🇪 瑞典 - 自动选择
      - 🇸🇪 瑞典 - 手动选择
      - 🇳🇴 挪威 - 自动选择
      - 🇳🇴 挪威 - 手动选择
      - 其他 - 自动选择
      - 其他 - 手动选择
      - DIRECT
      
  - name: AI
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/chatgpt.svg
    proxies:
      - 代理模式
      - 延迟优选
      - 故障转移
      - 手动选择
      - 🇭🇰 香港 - 自动选择
      - 🇭🇰 香港 - 手动选择
      - 🇹🇼 台湾 - 自动选择
      - 🇹🇼 台湾 - 手动选择
      - 🇸🇬 新加坡 - 自动选择
      - 🇸🇬 新加坡 - 手动选择
      - 🇦🇷 阿根廷 - 自动选择
      - 🇦🇷 阿根廷 - 手动选择
      - 🇯🇵 日本 - 自动选择
      - 🇯🇵 日本 - 手动选择
      - 🇺🇸 美国 - 自动选择
      - 🇺🇸 美国 - 手动选择
      - 🇩🇪 德国 - 自动选择
      - 🇩🇪 德国 - 手动选择
      - 🇰🇷 韩国 - 自动选择
      - 🇰🇷 韩国 - 手动选择
      - 🇬🇧 英国 - 自动选择
      - 🇬🇧 英国 - 手动选择
      - 🇨🇦 加拿大 - 自动选择
      - 🇨🇦 加拿大 - 手动选择
      - 🇦🇺 澳大利亚 - 自动选择
      - 🇦🇺 澳大利亚 - 手动选择
      - 🇪🇸 西班牙 - 自动选择
      - 🇪🇸 西班牙 - 手动选择
      - 🇳🇱 荷兰 - 自动选择
      - 🇳🇱 荷兰 - 手动选择
      - 🇹🇷 土耳其 - 自动选择
      - 🇹🇷 土耳其 - 手动选择
      - 🇷🇺 俄罗斯 - 自动选择
      - 🇷🇺 俄罗斯 - 手动选择
      - 🇮🇳 印度 - 自动选择
      - 🇮🇳 印度 - 手动选择
      - 🇧🇷 巴西 - 自动选择
      - 🇧🇷 巴西 - 手动选择
      - 🇮🇹 意大利 - 自动选择
      - 🇮🇹 意大利 - 手动选择
      - 🇨🇭 瑞士 - 自动选择
      - 🇨🇭 瑞士 - 手动选择
      - 🇸🇪 瑞典 - 自动选择
      - 🇸🇪 瑞典 - 手动选择
      - 🇳🇴 挪威 - 自动选择
      - 🇳🇴 挪威 - 手动选择
      - 其他 - 自动选择
      - 其他 - 手动选择
      - DIRECT
      
  - name: 流媒体
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/youtube.svg
    proxies:
      - 代理模式
      - 延迟优选
      - 故障转移
      - 手动选择
      - 🇭🇰 香港 - 自动选择
      - 🇭🇰 香港 - 手动选择
      - 🇹🇼 台湾 - 自动选择
      - 🇹🇼 台湾 - 手动选择
      - 🇸🇬 新加坡 - 自动选择
      - 🇸🇬 新加坡 - 手动选择
      - 🇦🇷 阿根廷 - 自动选择
      - 🇦🇷 阿根廷 - 手动选择
      - 🇯🇵 日本 - 自动选择
      - 🇯🇵 日本 - 手动选择
      - 🇺🇸 美国 - 自动选择
      - 🇺🇸 美国 - 手动选择
      - 🇩🇪 德国 - 自动选择
      - 🇩🇪 德国 - 手动选择
      - 🇰🇷 韩国 - 自动选择
      - 🇰🇷 韩国 - 手动选择
      - 🇬🇧 英国 - 自动选择
      - 🇬🇧 英国 - 手动选择
      - 🇨🇦 加拿大 - 自动选择
      - 🇨🇦 加拿大 - 手动选择
      - 🇦🇺 澳大利亚 - 自动选择
      - 🇦🇺 澳大利亚 - 手动选择
      - 🇪🇸 西班牙 - 自动选择
      - 🇪🇸 西班牙 - 手动选择
      - 🇳🇱 荷兰 - 自动选择
      - 🇳🇱 荷兰 - 手动选择
      - 🇹🇷 土耳其 - 自动选择
      - 🇹🇷 土耳其 - 手动选择
      - 🇷🇺 俄罗斯 - 自动选择
      - 🇷🇺 俄罗斯 - 手动选择
      - 🇮🇳 印度 - 自动选择
      - 🇮🇳 印度 - 手动选择
      - 🇧🇷 巴西 - 自动选择
      - 🇧🇷 巴西 - 手动选择
      - 🇮🇹 意大利 - 自动选择
      - 🇮🇹 意大利 - 手动选择
      - 🇨🇭 瑞士 - 自动选择
      - 🇨🇭 瑞士 - 手动选择
      - 🇸🇪 瑞典 - 自动选择
      - 🇸🇪 瑞典 - 手动选择
      - 🇳🇴 挪威 - 自动选择
      - 🇳🇴 挪威 - 手动选择
      - 其他 - 自动选择
      - 其他 - 手动选择
      - DIRECT
      
  - name: 苹果服务
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/apple.svg
    proxies:
      - 代理模式
      - 延迟优选
      - 故障转移
      - 手动选择
      - 🇭🇰 香港 - 自动选择
      - 🇭🇰 香港 - 手动选择
      - 🇹🇼 台湾 - 自动选择
      - 🇹🇼 台湾 - 手动选择
      - 🇸🇬 新加坡 - 自动选择
      - 🇸🇬 新加坡 - 手动选择
      - 🇦🇷 阿根廷 - 自动选择
      - 🇦🇷 阿根廷 - 手动选择
      - 🇯🇵 日本 - 自动选择
      - 🇯🇵 日本 - 手动选择
      - 🇺🇸 美国 - 自动选择
      - 🇺🇸 美国 - 手动选择
      - 🇩🇪 德国 - 自动选择
      - 🇩🇪 德国 - 手动选择
      - 🇰🇷 韩国 - 自动选择
      - 🇰🇷 韩国 - 手动选择
      - 🇬🇧 英国 - 自动选择
      - 🇬🇧 英国 - 手动选择
      - 🇨🇦 加拿大 - 自动选择
      - 🇨🇦 加拿大 - 手动选择
      - 🇦🇺 澳大利亚 - 自动选择
      - 🇦🇺 澳大利亚 - 手动选择
      - 🇪🇸 西班牙 - 自动选择
      - 🇪🇸 西班牙 - 手动选择
      - 🇳🇱 荷兰 - 自动选择
      - 🇳🇱 荷兰 - 手动选择
      - 🇹🇷 土耳其 - 自动选择
      - 🇹🇷 土耳其 - 手动选择
      - 🇷🇺 俄罗斯 - 自动选择
      - 🇷🇺 俄罗斯 - 手动选择
      - 🇮🇳 印度 - 自动选择
      - 🇮🇳 印度 - 手动选择
      - 🇧🇷 巴西 - 自动选择
      - 🇧🇷 巴西 - 手动选择
      - 🇮🇹 意大利 - 自动选择
      - 🇮🇹 意大利 - 手动选择
      - 🇨🇭 瑞士 - 自动选择
      - 🇨🇭 瑞士 - 手动选择
      - 🇸🇪 瑞典 - 自动选择
      - 🇸🇪 瑞典 - 手动选择
      - 🇳🇴 挪威 - 自动选择
      - 🇳🇴 挪威 - 手动选择
      - 其他 - 自动选择
      - 其他 - 手动选择
      - DIRECT
      
  - name: 微软服务
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/microsoft.svg
    proxies:
      - 代理模式
      - 延迟优选
      - 故障转移
      - 手动选择
      - 🇭🇰 香港 - 自动选择
      - 🇭🇰 香港 - 手动选择
      - 🇹🇼 台湾 - 自动选择
      - 🇹🇼 台湾 - 手动选择
      - 🇸🇬 新加坡 - 自动选择
      - 🇸🇬 新加坡 - 手动选择
      - 🇦🇷 阿根廷 - 自动选择
      - 🇦🇷 阿根廷 - 手动选择
      - 🇯🇵 日本 - 自动选择
      - 🇯🇵 日本 - 手动选择
      - 🇺🇸 美国 - 自动选择
      - 🇺🇸 美国 - 手动选择
      - 🇩🇪 德国 - 自动选择
      - 🇩🇪 德国 - 手动选择
      - 🇰🇷 韩国 - 自动选择
      - 🇰🇷 韩国 - 手动选择
      - 🇬🇧 英国 - 自动选择
      - 🇬🇧 英国 - 手动选择
      - 🇨🇦 加拿大 - 自动选择
      - 🇨🇦 加拿大 - 手动选择
      - 🇦🇺 澳大利亚 - 自动选择
      - 🇦🇺 澳大利亚 - 手动选择
      - 🇪🇸 西班牙 - 自动选择
      - 🇪🇸 西班牙 - 手动选择
      - 🇳🇱 荷兰 - 自动选择
      - 🇳🇱 荷兰 - 手动选择
      - 🇹🇷 土耳其 - 自动选择
      - 🇹🇷 土耳其 - 手动选择
      - 🇷🇺 俄罗斯 - 自动选择
      - 🇷🇺 俄罗斯 - 手动选择
      - 🇮🇳 印度 - 自动选择
      - 🇮🇳 印度 - 手动选择
      - 🇧🇷 巴西 - 自动选择
      - 🇧🇷 巴西 - 手动选择
      - 🇮🇹 意大利 - 自动选择
      - 🇮🇹 意大利 - 手动选择
      - 🇨🇭 瑞士 - 自动选择
      - 🇨🇭 瑞士 - 手动选择
      - 🇸🇪 瑞典 - 自动选择
      - 🇸🇪 瑞典 - 手动选择
      - 🇳🇴 挪威 - 自动选择
      - 🇳🇴 挪威 - 手动选择
      - 其他 - 自动选择
      - 其他 - 手动选择
      - DIRECT

  - name: Emby
    type: select
    icon: https://cdnjs.cloudflare.com/ajax/libs/simple-icons/2.19.0/emby.svg
    proxies:
      - 代理模式
      - 延迟优选
      - 故障转移
      - 手动选择
      - 🇭🇰 香港 - 自动选择
      - 🇭🇰 香港 - 手动选择
      - 🇹🇼 台湾 - 自动选择
      - 🇹🇼 台湾 - 手动选择
      - 🇸🇬 新加坡 - 自动选择
      - 🇸🇬 新加坡 - 手动选择
      - 🇦🇷 阿根廷 - 自动选择
      - 🇦🇷 阿根廷 - 手动选择
      - 🇯🇵 日本 - 自动选择
      - 🇯🇵 日本 - 手动选择
      - 🇺🇸 美国 - 自动选择
      - 🇺🇸 美国 - 手动选择
      - 🇩🇪 德国 - 自动选择
      - 🇩🇪 德国 - 手动选择
      - 🇰🇷 韩国 - 自动选择
      - 🇰🇷 韩国 - 手动选择
      - 🇬🇧 英国 - 自动选择
      - 🇬🇧 英国 - 手动选择
      - 🇨🇦 加拿大 - 自动选择
      - 🇨🇦 加拿大 - 手动选择
      - 🇦🇺 澳大利亚 - 自动选择
      - 🇦🇺 澳大利亚 - 手动选择
      - 🇪🇸 西班牙 - 自动选择
      - 🇪🇸 西班牙 - 手动选择
      - 🇳🇱 荷兰 - 自动选择
      - 🇳🇱 荷兰 - 手动选择
      - 🇹🇷 土耳其 - 自动选择
      - 🇹🇷 土耳其 - 手动选择
      - 🇷🇺 俄罗斯 - 自动选择
      - 🇷🇺 俄罗斯 - 手动选择
      - 🇮🇳 印度 - 自动选择
      - 🇮🇳 印度 - 手动选择
      - 🇧🇷 巴西 - 自动选择
      - 🇧🇷 巴西 - 手动选择
      - 🇮🇹 意大利 - 自动选择
      - 🇮🇹 意大利 - 手动选择
      - 🇨🇭 瑞士 - 自动选择
      - 🇨🇭 瑞士 - 手动选择
      - 🇸🇪 瑞典 - 自动选择
      - 🇸🇪 瑞典 - 手动选择
      - 🇳🇴 挪威 - 自动选择
      - 🇳🇴 挪威 - 手动选择
      - 其他 - 自动选择
      - 其他 - 手动选择
      - DIRECT
  
  - name: GoogleFCM
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/google.svg
    proxies:
      - DIRECT
      - 代理模式
      - 延迟优选
      - 故障转移
      - 手动选择
      - 🇭🇰 香港 - 自动选择
      - 🇭🇰 香港 - 手动选择
      - 🇹🇼 台湾 - 自动选择
      - 🇹🇼 台湾 - 手动选择
      - 🇸🇬 新加坡 - 自动选择
      - 🇸🇬 新加坡 - 手动选择
      - 🇦🇷 阿根廷 - 自动选择
      - 🇦🇷 阿根廷 - 手动选择
      - 🇯🇵 日本 - 自动选择
      - 🇯🇵 日本 - 手动选择
      - 🇺🇸 美国 - 自动选择
      - 🇺🇸 美国 - 手动选择
      - 🇩🇪 德国 - 自动选择
      - 🇩🇪 德国 - 手动选择
      - 🇰🇷 韩国 - 自动选择
      - 🇰🇷 韩国 - 手动选择
      - 🇬🇧 英国 - 自动选择
      - 🇬🇧 英国 - 手动选择
      - 🇨🇦 加拿大 - 自动选择
      - 🇨🇦 加拿大 - 手动选择
      - 🇦🇺 澳大利亚 - 自动选择
      - 🇦🇺 澳大利亚 - 手动选择
      - 🇪🇸 西班牙 - 自动选择
      - 🇪🇸 西班牙 - 手动选择
      - 🇳🇱 荷兰 - 自动选择
      - 🇳🇱 荷兰 - 手动选择
      - 🇹🇷 土耳其 - 自动选择
      - 🇹🇷 土耳其 - 手动选择
      - 🇷🇺 俄罗斯 - 自动选择
      - 🇷🇺 俄罗斯 - 手动选择
      - 🇮🇳 印度 - 自动选择
      - 🇮🇳 印度 - 手动选择
      - 🇧🇷 巴西 - 自动选择
      - 🇧🇷 巴西 - 手动选择
      - 🇮🇹 意大利 - 自动选择
      - 🇮🇹 意大利 - 手动选择
      - 🇨🇭 瑞士 - 自动选择
      - 🇨🇭 瑞士 - 手动选择
      - 🇸🇪 瑞典 - 自动选择
      - 🇸🇪 瑞典 - 手动选择
      - 🇳🇴 挪威 - 自动选择
      - 🇳🇴 挪威 - 手动选择
      - 其他 - 自动选择
      - 其他 - 手动选择
      
  - name: Steam地区
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/steam.svg
    proxies:
      - DIRECT
      - 代理模式
      - 延迟优选
      - 故障转移
      - 手动选择
      - 🇭🇰 香港 - 自动选择
      - 🇭🇰 香港 - 手动选择
      - 🇹🇼 台湾 - 自动选择
      - 🇹🇼 台湾 - 手动选择
      - 🇸🇬 新加坡 - 自动选择
      - 🇸🇬 新加坡 - 手动选择
      - 🇦🇷 阿根廷 - 自动选择
      - 🇦🇷 阿根廷 - 手动选择
      - 🇯🇵 日本 - 自动选择
      - 🇯🇵 日本 - 手动选择
      - 🇺🇸 美国 - 自动选择
      - 🇺🇸 美国 - 手动选择
      - 🇩🇪 德国 - 自动选择
      - 🇩🇪 德国 - 手动选择
      - 🇰🇷 韩国 - 自动选择
      - 🇰🇷 韩国 - 手动选择
      - 🇬🇧 英国 - 自动选择
      - 🇬🇧 英国 - 手动选择
      - 🇨🇦 加拿大 - 自动选择
      - 🇨🇦 加拿大 - 手动选择
      - 🇦🇺 澳大利亚 - 自动选择
      - 🇦🇺 澳大利亚 - 手动选择
      - 🇪🇸 西班牙 - 自动选择
      - 🇪🇸 西班牙 - 手动选择
      - 🇳🇱 荷兰 - 自动选择
      - 🇳🇱 荷兰 - 手动选择
      - 🇹🇷 土耳其 - 自动选择
      - 🇹🇷 土耳其 - 手动选择
      - 🇷🇺 俄罗斯 - 自动选择
      - 🇷🇺 俄罗斯 - 手动选择
      - 🇮🇳 印度 - 自动选择
      - 🇮🇳 印度 - 手动选择
      - 🇧🇷 巴西 - 自动选择
      - 🇧🇷 巴西 - 手动选择
      - 🇮🇹 意大利 - 自动选择
      - 🇮🇹 意大利 - 手动选择
      - 🇨🇭 瑞士 - 自动选择
      - 🇨🇭 瑞士 - 手动选择
      - 🇸🇪 瑞典 - 自动选择
      - 🇸🇪 瑞典 - 手动选择
      - 🇳🇴 挪威 - 自动选择
      - 🇳🇴 挪威 - 手动选择
      - 其他 - 自动选择
      - 其他 - 手动选择
      
  - name: 漏网之鱼
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/fish.svg
    proxies:
      - DIRECT
      - 代理模式
      
  # ====================香港===================================
  - name: "🇭🇰 香港 - 自动选择"
    type: fallback
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/hk.svg
    use:
      - myclash
    filter: "香港|HK|Hong Kong|🇭🇰"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: true
    
  - name: "🇭🇰 香港 - 手动选择"
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/hk.svg
    use:
      - myclash
    filter: "香港|HK|Hong Kong|🇭🇰"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: false
  # ===========================================================
    
  # ====================台湾===================================
  - name: "🇹🇼 台湾 - 自动选择"
    type: fallback
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/tw.svg
    use:
      - myclash
    filter: "台湾|TW|Taiwan|🇹🇼"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: true
    
  - name: "🇹🇼 台湾 - 手动选择"
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/tw.svg
    use:
      - myclash
    filter: "台湾|TW|Taiwan|🇹🇼"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: false
  # ===========================================================
  
  # ====================新加坡===================================
  - name: "🇸🇬 新加坡 - 自动选择"
    type: fallback
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/sg.svg
    use:
      - myclash
    filter: "新加坡|狮城|SG|Singapore|🇸🇬"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: true
    
  - name: "🇸🇬 新加坡 - 手动选择"
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/sg.svg
    use:
      - myclash
    filter: "新加坡|狮城|SG|Singapore|🇸🇬"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: false
  # ===========================================================
    
  # ====================阿根廷===================================
  - name: "🇦🇷 阿根廷 - 自动选择"
    type: fallback
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ar.svg
    use:
      - myclash
    filter: "阿根廷|AR|Argentina|🇦🇷"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: true
    
  - name: "🇦🇷 阿根廷 - 手动选择"
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ar.svg
    use:
      - myclash
    filter: "阿根廷|AR|Argentina|🇦🇷"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: false
  # ===========================================================
  
  # ====================日本===================================
  - name: "🇯🇵 日本 - 自动选择"
    type: fallback
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/jp.svg
    use:
      - myclash
    filter: "日本|JP|Japan|🇯🇵"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: true
    
  - name: "🇯🇵 日本 - 手动选择"
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/jp.svg
    use:
      - myclash
    filter: "日本|JP|Japan|🇯🇵"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: false
  # ===========================================================
  
  # ====================美国===================================
  - name: "🇺🇸 美国 - 自动选择"
    type: fallback
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/us.svg
    use:
      - myclash
    filter: "美国|US|USA|United States|America|🇺🇸"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: true
    
  - name: "🇺🇸 美国 - 手动选择"
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/us.svg
    use:
      - myclash
    filter: "美国|US|USA|United States|America|🇺🇸"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: false
  # ===========================================================
  
  # ====================德国===================================
  - name: "🇩🇪 德国 - 自动选择"
    type: fallback
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/de.svg
    use:
      - myclash
    filter: "德国|DE|Germany|🇩🇪"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: true
    
  - name: "🇩🇪 德国 - 手动选择"
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/de.svg
    use:
      - myclash
    filter: "德国|DE|Germany|🇩🇪"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: false
  # ===========================================================
  
  # ====================韩国===================================
  - name: "🇰🇷 韩国 - 自动选择"
    type: fallback
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/kr.svg
    use:
      - myclash
    filter: "韩国|KR|Korea|South Korea|🇰🇷"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: true
    
  - name: "🇰🇷 韩国 - 手动选择"
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/kr.svg
    use:
      - myclash
    filter: "韩国|KR|Korea|South Korea|🇰🇷"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: false
  # ===========================================================
  
  # ====================英国===================================
  - name: "🇬🇧 英国 - 自动选择"
    type: fallback
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/gb.svg
    use:
      - myclash
    filter: "英国|UK|United Kingdom|Britain|Great Britain|🇬🇧"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: true
    
  - name: "🇬🇧 英国 - 手动选择"
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/gb.svg
    use:
      - myclash
    filter: "英国|UK|United Kingdom|Britain|Great Britain|🇬🇧"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: false
  # ===========================================================
  
  # ====================加拿大===================================
  - name: "🇨🇦 加拿大 - 自动选择"
    type: fallback
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ca.svg
    use:
      - myclash
    filter: "加拿大|CA|Canada|🇨🇦"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: true
    
  - name: "🇨🇦 加拿大 - 手动选择"
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ca.svg
    use:
      - myclash
    filter: "加拿大|CA|Canada|🇨🇦"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: false
  # ===========================================================
  
  # ====================澳大利亚===================================
  - name: "🇦🇺 澳大利亚 - 自动选择"
    type: fallback
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/au.svg
    use:
      - myclash
    filter: "澳大利亚|AU|Australia|🇦🇺"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: true
    
  - name: "🇦🇺 澳大利亚 - 手动选择"
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/au.svg
    use:
      - myclash
    filter: "澳大利亚|AU|Australia|🇦🇺"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: false
  # ===========================================================
  
  # ====================西班牙===================================
  - name: "🇪🇸 西班牙 - 自动选择"
    type: fallback
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/es.svg
    use:
      - myclash
    filter: "西班牙|ES|Spain|🇪🇸"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: true
    
  - name: "🇪🇸 西班牙 - 手动选择"
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/es.svg
    use:
      - myclash
    filter: "西班牙|ES|Spain|🇪🇸"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: false
  # ===========================================================
  
  # ====================荷兰===================================
  - name: "🇳🇱 荷兰 - 自动选择"
    type: fallback
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/nl.svg
    use:
      - myclash
    filter: "荷兰|NL|Netherlands|🇳🇱"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: true
    
  - name: "🇳🇱 荷兰 - 手动选择"
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/nl.svg
    use:
      - myclash
    filter: "荷兰|NL|Netherlands|🇳🇱"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: false
  # ===========================================================
  
  # ====================土耳其===================================
  - name: "🇹🇷 土耳其 - 自动选择"
    type: fallback
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/tr.svg
    use:
      - myclash
    filter: "土耳其|TR|Turkey|🇹🇷"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: true
    
  - name: "🇹🇷 土耳其 - 手动选择"
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/tr.svg
    use:
      - myclash
    filter: "土耳其|TR|Turkey|🇹🇷"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: false
  # ===========================================================
  
  # ====================俄罗斯===================================
  - name: "🇷🇺 俄罗斯 - 自动选择"
    type: fallback
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ru.svg
    use:
      - myclash
    filter: "俄罗斯|RU|Russia|🇷🇺"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: true
    
  - name: "🇷🇺 俄罗斯 - 手动选择"
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ru.svg
    use:
      - myclash
    filter: "俄罗斯|RU|Russia|🇷🇺"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: false
  # ===========================================================
  
  # ====================印度===================================
  - name: "🇮🇳 印度 - 自动选择"
    type: fallback
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/in.svg
    use:
      - myclash
    filter: "印度|IN|India|🇮🇳"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: true
    
  - name: "🇮🇳 印度 - 手动选择"
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/in.svg
    use:
      - myclash
    filter: "印度|IN|India|🇮🇳"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: false
  # ===========================================================
  
  # ====================巴西===================================
  - name: "🇧🇷 巴西 - 自动选择"
    type: fallback
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/br.svg
    use:
      - myclash
    filter: "巴西|BR|Brazil|🇧🇷"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: true
    
  - name: "🇧🇷 巴西 - 手动选择"
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/br.svg
    use:
      - myclash
    filter: "巴西|BR|Brazil|🇧🇷"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: false
  # ===========================================================
  
  # ====================意大利===================================
  - name: "🇮🇹 意大利 - 自动选择"
    type: fallback
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/it.svg
    use:
      - myclash
    filter: "意大利|IT|Italy|🇮🇹"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: true
    
  - name: "🇮🇹 意大利 - 手动选择"
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/it.svg
    use:
      - myclash
    filter: "意大利|IT|Italy|🇮🇹"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: false
  # ===========================================================
  
  # ====================瑞士===================================
  - name: "🇨🇭 瑞士 - 自动选择"
    type: fallback
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ch.svg
    use:
      - myclash
    filter: "瑞士|CH|Switzerland|🇨🇭"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: true
    
  - name: "🇨🇭 瑞士 - 手动选择"
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ch.svg
    use:
      - myclash
    filter: "瑞士|CH|Switzerland|🇨🇭"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: false
  # ===========================================================
  
  # ====================瑞典===================================
  - name: "🇸🇪 瑞典 - 自动选择"
    type: fallback
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/se.svg
    use:
      - myclash
    filter: "瑞典|SE|Sweden|🇸🇪"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: true
    
  - name: "🇸🇪 瑞典 - 手动选择"
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/se.svg
    use:
      - myclash
    filter: "瑞典|SE|Sweden|🇸🇪"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: false
  # ===========================================================
  
  # ====================挪威===================================
  - name: "🇳🇴 挪威 - 自动选择"
    type: fallback
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/no.svg
    use:
      - myclash
    filter: "挪威|NO|Norway|🇳🇴"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: true
    
  - name: "🇳🇴 挪威 - 手动选择"
    type: select
    icon: https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/no.svg
    use:
      - myclash
    filter: "挪威|NO|Norway|🇳🇴"
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    hidden: false
  # ===========================================================
  
  # ====================其他===================================
  - name: "其他 - 自动选择"
    type: fallback
    use:
      - myclash
    exclude-filter: 香港|日本|新加坡|台湾|美国|英国|阿根廷|俄罗斯|土耳其|韩国|印度|德国|加拿大|澳大利亚|法国|乌克兰
    url: https://cp.cloudflare.com/generate_204
    interval: 300
    
  - name: "其他 - 手动选择"
    type: select
    use:
      - myclash
    exclude-filter: 香港|日本|新加坡|台湾|美国|英国|阿根廷|俄罗斯|土耳其|韩国|印度|德国|加拿大|澳大利亚|法国|乌克兰
    url: https://cp.cloudflare.com/generate_204
    interval: 300
  # ===========================================================
  
#-------------------------------------------------------------------
#用户自定义规则，文件在模块目录/rule-provider/
#如有需要请参考官方文档写入
#如果想要删除两个自定义规则，需要把上面dns配置内对自定义规则的设置删除，否则内核将无法启动

rule-providers:
  Reject_ip:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/REJECT/ip/Reject_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/REJECT/ip/Reject_ip.yaml
  Reject_no_ip:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/REJECT/no_ip/Reject_no_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/REJECT/no_ip/Reject_no_ip.yaml
  Reject_domainset:
    type: http
    interval: 1800
    behavior: domain
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/REJECT/no_ip/Reject_domainset.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/REJECT/no_ip/Reject_domainset.yaml
  Reject_no_ip_drop:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/REJECT/no_ip/Reject_no_ip_drop.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/REJECT/no_ip/Reject_no_ip_drop.yaml
  Reject_no_ip_no_drop:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/REJECT/no_ip/Reject_no_ip_no_drop.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/REJECT/no_ip/Reject_no_ip_no_drop.yaml
  China_ip:
    type: http
    interval: 1800
    behavior: ipcidr
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/ip/China_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/ip/China_ip.yaml
  Domestic_ip:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/ip/Domestic_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/ip/Domestic_ip.yaml
  GoogleFCM_ip:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/ip/GoogleFCM_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/ip/GoogleFCM_ip.yaml
  Lan_ip:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/ip/Lan_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/ip/Lan_ip.yaml
  NetEaseMusic_ip:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/ip/NetEaseMusic_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/ip/NetEaseMusic_ip.yaml
  SteamCN_ip:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/ip/SteamCN_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/ip/SteamCN_ip.yaml
  AppleCDN_no_ip:
    type: http
    interval: 1800
    behavior: domain
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/AppleCDN_no_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/AppleCDN_no_ip.yaml
  AppleCN_no_ip:
    type: http
    interval: 1800
    behavior: domain
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/AppleCN_no_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/AppleCN_no_ip.yaml
  Direct_no_ip:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/Direct_no_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/Direct_no_ip.yaml
  Domestic_no_ip:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/Domestic_no_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/Domestic_no_ip.yaml
  GoogleFCM_no_ip:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/GoogleFCM_no_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/GoogleFCM_no_ip.yaml
  Lan_no_ip:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/Lan_no_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/Lan_no_ip.yaml
  MicrosoftCDN_no_ip:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/MicrosoftCDN_no_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/MicrosoftCDN_no_ip.yaml
  NetEaseMusic_no_ip:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/NetEaseMusic_no_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/NetEaseMusic_no_ip.yaml
  SteamCN_no_ip:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/SteamCN_no_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/SteamCN_no_ip.yaml
  SteamRegion_no_ip:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/SteamRegion_no_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/SteamRegion_no_ip.yaml
  Stream_ip:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/ip/Stream_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/PROXY/ip/Stream_ip.yaml
  Telegram_ip:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/ip/Telegram_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/PROXY/ip/Telegram_ip.yaml
  AI_no_ip:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/AI_no_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/AI_no_ip.yaml
  Apple_no_ip:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/Apple_no_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/Apple_no_ip.yaml
  CDN_domainset:
    type: http
    interval: 1800
    behavior: domain
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/CDN_domainset.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/CDN_domainset.yaml
  CDN_no_ip:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/CDN_no_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/CDN_no_ip.yaml
  CustomProxy_no_ip:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/CustomProxy_no_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/CustomProxy_no_ip.yaml
  Download_domainset:
    type: http
    interval: 1800
    behavior: domain
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/Download_domainset.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/Download_domainset.yaml
  Download_no_ip:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/Download_no_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/Download_no_ip.yaml
  Global_no_ip:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/Global_no_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/Global_no_ip.yaml
  Microsoft_no_ip:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/Microsoft_no_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/Microsoft_no_ip.yaml
  Steam_no_ip:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/Steam_no_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/Steam_no_ip.yaml
  Stream_no_ip:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/Stream_no_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/Stream_no_ip.yaml
  Emby_no_ip:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/Emby_no_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/Emby_no_ip.yaml
  Telegram_no_ip:
    type: http
    interval: 1800
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/Telegram_no_ip.yaml
    path: ./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/Telegram_no_ip.yaml
rules:
  - RULE-SET,Reject_no_ip,REJECT
  - RULE-SET,Reject_domainset,REJECT
  - RULE-SET,Reject_no_ip_drop,REJECT-DROP
  - RULE-SET,Reject_no_ip_no_drop,REJECT
  - RULE-SET,CustomProxy_no_ip,代理模式
  - RULE-SET,GoogleFCM_no_ip,GoogleFCM
  - RULE-SET,NetEaseMusic_no_ip,DIRECT
  - RULE-SET,SteamRegion_no_ip,Steam地区
  - RULE-SET,SteamCN_no_ip,DIRECT
  - RULE-SET,Steam_no_ip,代理模式
  - RULE-SET,CDN_domainset,代理模式
  - RULE-SET,CDN_no_ip,代理模式
  - RULE-SET,Stream_no_ip,流媒体
  - RULE-SET,Telegram_no_ip,电报消息
  - RULE-SET,AppleCDN_no_ip,DIRECT
  - RULE-SET,AppleCN_no_ip,DIRECT
  - RULE-SET,MicrosoftCDN_no_ip,DIRECT
  - RULE-SET,Download_domainset,代理模式
  - RULE-SET,Download_no_ip,代理模式
  - RULE-SET,Apple_no_ip,苹果服务
  - RULE-SET,Microsoft_no_ip,微软服务
  - RULE-SET,AI_no_ip,AI
  - RULE-SET,Global_no_ip,代理模式
  - RULE-SET,Domestic_no_ip,DIRECT
  - RULE-SET,Direct_no_ip,DIRECT
  - RULE-SET,Lan_no_ip,DIRECT
  - RULE-SET,GoogleFCM_ip,GoogleFCM
  - RULE-SET,NetEaseMusic_ip,DIRECT
  - RULE-SET,SteamCN_ip,DIRECT
  - RULE-SET,Reject_ip,REJECT
  - RULE-SET,Telegram_ip,电报消息
  - RULE-SET,Stream_ip,流媒体
  - RULE-SET,Emby_no_ip,Emby
  - RULE-SET,Domestic_ip,DIRECT
  - RULE-SET,China_ip,DIRECT
  - RULE-SET,Lan_ip,DIRECT
  - GEOIP,CN,DIRECT
  - GEOSITE,cn,DIRECT
  - MATCH,漏网之鱼
```