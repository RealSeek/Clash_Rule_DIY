const proxyName = "代理模式";

function main(params) {
    if (!Array.isArray(params.proxies) || params.proxies.length === 0) {
        throw new Error("订阅没有可用节点，请检查订阅内容后再覆写配置");
    }
    overwriteBasicOptions(params);
    overwriteHosts(params);
    overwriteSniffer(params);
    overwriteProxyGroups(params);
    overwriteRules(params);
    overwriteDns(params);
    overwriteTunnel(params);
    applyOptionalFeatures(params);
    return params;
}

// 可选脚本参数：默认保持现有策略；参数取自 $arguments 或 params.arguments。
function applyOptionalFeatures(params) {
    const args = (typeof $arguments !== "undefined" && $arguments) || params.arguments || {};
    const disabled = new Set(String(args["disable-groups"] || "").split(",").map((name) => name.trim()).filter(Boolean));
    const filterMultiplier = args["filter-high-multiplier"] === true || args["filter-high-multiplier"] === "true";
    const ipVersion = args["proxy-ip-version"] || "";
    if (!disabled.size && !filterMultiplier && !ipVersion) return;

    const services = new Set(["电报消息", "AI", "Bilibili港澳台", "流媒体", "苹果服务", "微软服务", "Emby", "GoogleFCM", "Steam地区", "漏网之鱼"]);
    for (const name of disabled) {
        if (!services.has(name)) throw new Error("disable-groups 仅支持服务分组，不能关闭基础组：" + name);
    }
    if (ipVersion && !["ipv4", "ipv6", "ipv4-prefer", "ipv6-prefer"].includes(ipVersion)) {
        throw new Error("proxy-ip-version 仅支持 ipv4、ipv6、ipv4-prefer、ipv6-prefer");
    }

    // 与 provider 共用 RE2 兼容表达式；数字前禁止小数点，避免将 0.25x 当成 25x。
    const aboveOne = "(?:(?:[2-9][0-9]*|1[0-9]+)(?:\\.[0-9]+)?|1\\.0*[1-9][0-9]*)";
    const multiplierPattern = "(^|[^0-9.])(?:" + aboveOne + "\\s*[xX×倍]|[xX×]\\s*" + aboveOne + ")($|[^0-9.])";
    const highMultiplier = new RegExp(multiplierPattern);
    const excluded = new Set(filterMultiplier ? (params.proxies || [])
        .filter((proxy) => highMultiplier.test(proxy.name)).map((proxy) => proxy.name) : []);
    const withMultiplierFilter = (previous) => previous ? "(?:" + previous + ")|(?:" + multiplierPattern + ")" : multiplierPattern;
    const hasProvider = (group) => group["include-all"] || group["include-all-providers"] ||
        group["include-all-proxies"] || (group.use && group.use.length);
    const baseGroups = new Set(["代理模式", "延迟优选", "故障转移", "手动选择", "负载均衡(散列)", "负载均衡(会话)", "直连模式", "国外QUIC"]);
    let groups = params["proxy-groups"].filter((group) => !disabled.has(group.name));
    for (const group of groups) {
        if (group.proxies) {
            group.proxies = group.proxies.filter((name) => !excluded.has(name))
                .map((name) => disabled.has(name) ? proxyName : name);
        }
        if (filterMultiplier && hasProvider(group)) {
            group["exclude-filter"] = withMultiplierFilter(group["exclude-filter"]);
        }
    }
    if (filterMultiplier) {
        const emptyRegions = new Set(groups.filter((group) => !baseGroups.has(group.name.replace(/\s/g, "")) &&
            !services.has(group.name) && group.proxies && group.proxies.length === 0 && !hasProvider(group))
            .map((group) => group.name));
        groups = groups.filter((group) => !emptyRegions.has(group.name));
        for (const group of groups) {
            if (group.proxies) group.proxies = group.proxies.filter((name) => !emptyRegions.has(name));
            if (baseGroups.has(group.name.replace(/\s/g, "")) && group.proxies && !group.proxies.length && !hasProvider(group)) {
                throw new Error("倍率过滤后分组没有可用节点：" + group.name);
            }
        }
    }
    params["proxy-groups"] = groups;
    if (disabled.size) {
        params.rules = params.rules.map((rule) => {
            const fields = rule.split(",");
            const target = fields.length - (fields[fields.length - 1] === "no-resolve" ? 2 : 1);
            if (disabled.has(fields[target])) fields[target] = proxyName;
            return fields.join(",");
        });
    }
    for (const provider of Object.values(params["proxy-providers"] || {})) {
        if (filterMultiplier) provider["exclude-filter"] = withMultiplierFilter(provider["exclude-filter"]);
        if (ipVersion) provider.override = { ...provider.override, "ip-version": ipVersion };
    }
    if (ipVersion) {
        for (const proxy of params.proxies || []) {
            if (!/^(direct|reject|pass|dns|easytier|tailscale)$/i.test(proxy.type) && !/^(EasyTier|Tailscale)$/i.test(proxy.name)) {
                proxy["ip-version"] = ipVersion;
            }
        }
    }
}

// 覆写Basic Options
function overwriteBasicOptions(params) {
    const otherOptions = {
        "log-level": "warning",
        "mixed-port": 7890,
        "allow-lan": true,
        "unified-delay": true,
        "tcp-concurrent": true,
        "keep-alive-interval": 30,
        "keep-alive-idle": 15,
        "find-process-mode": "strict",
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

// 覆写 Hosts
function overwriteHosts(params) {
    const customHosts = {
        "miwifi.com": "192.168.31.2",
        "services.googleapis.cn": "services.googleapis.com",
        "dns.alidns.com": [
            "223.5.5.5",
            "223.6.6.6",
            "2400:3200::1",
            "2400:3200:baba::1",
        ],
        "doh.pub": [
            "1.12.12.12",
            "1.12.12.21",
            "120.53.53.53",
        ],
        "dns.google": [
            "8.8.8.8",
            "8.8.4.4",
            "2001:4860:4860::8888",
            "2001:4860:4860::8844",
        ],
        "cloudflare-dns.com": [
            "1.1.1.1",
            "1.0.0.1",
            "2606:4700:4700::1111",
            "2606:4700:4700::1001",
        ],
    };
    params["hosts"] = {
        ...customHosts,
        ...(params["hosts"] || {}),
    };
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

            QUIC: {
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
            regex: /\b(阿根廷|AR|Argentina|🇦🇷)\b/i,
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
            regex: /\b(德国|DE|Germany|🇩🇪)\b/i,
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
            regex: /\b(土耳其|TR|Turkey|🇹🇷)\b/i,
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
            regex: /\b(巴西|BR|Brazil|🇧🇷)\b/i,
        },
        {
            code: "IT",
            name: "🇮🇹 意大利",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/it.svg",
            regex: /\b(意大利|IT|Italy|🇮🇹)\b/i,
        },
        {
            code: "CH",
            name: "🇨🇭 瑞士",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ch.svg",
            regex: /\b(瑞士|CH|Switzerland|🇨🇭)\b/i,
        },
        {
            code: "SE",
            name: "🇸🇪 瑞典",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/se.svg",
            regex: /\b(瑞典|SE|Sweden|🇸🇪)\b/i,
        },
        {
            code: "NO",
            name: "🇳🇴 挪威",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/no.svg",
            regex: /\b(挪威|NO|Norway|🇳🇴)\b/i,
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
    if (allProxies.length === 0) {
        throw new Error("节点过滤后为空，请检查订阅和 allRegex 过滤条件");
    }
    // const allProxies = params["proxies"].map((e) => e.name);

    const availableCountryCodes = new Set();
    const otherProxies = [];
    for (const proxy of params["proxies"].filter((proxy) => allRegex.test(proxy.name))) {
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
            type: "smart",
            "policy-priority": "IEPL:1.5",
            uselightgbm: true,
            collectdata: false,
            strategy: "sticky-sessions",
            "prefer-asn": false,
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
            url: "https://www.gstatic.com/generate_204",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/adjust.svg",
            proxies: [
                "延迟优选",
                "故障转移",
                "手动选择",
                "负载均衡 (散列)",
                "负载均衡 (会话)",
                "直连模式",
            ],
        },
        {
            name: "延迟优选",
            type: "url-test",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/speed.svg",
            "exclude-filter": "自动选择|手动选择",
            proxies: allProxies,
            hidden: true,
        },
        {
            name: "故障转移",
            type: "fallback",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/ambulance.svg",
            "exclude-filter": "自动选择|手动选择",
            proxies: allProxies,
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
                ...otherProxies,
            ],
        },
        {
            name: "负载均衡 (散列)",
            type: "load-balance",
            url: "https://www.gstatic.com/generate_204",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/balance.svg",
            interval: 300,
            "max-failed-times": 3,
            strategy: "consistent-hashing",
            lazy: true,
            "exclude-filter": "自动选择|手动选择",
            proxies: allProxies,
            hidden: true,
        },
        {
            name: "负载均衡 (会话)",
            type: "load-balance",
            url: "https://www.gstatic.com/generate_204",
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/merry_go.svg",
            interval: 300,
            "max-failed-times": 3,
            "exclude-filter": "自动选择|手动选择",
            strategy: "sticky-sessions",
            lazy: true,
            proxies: allProxies,
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
                "直连模式",
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
                "直连模式",
            ],
            // "include-all": true,
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/chatgpt.svg",
        },
        {
            name: "Bilibili港澳台",
            type: "select",
            proxies: [
                "直连模式",
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
                "直连模式",
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
                "直连模式",
            ],
            // "include-all": true,
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/microsoft.svg",
        },
        {
            name: "GoogleFCM",
            type: "select",
            proxies: [
                "直连模式",
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
                "直连模式",
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
                "直连模式",
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
            name: "广告屏蔽",
            type: "select",
            proxies: ["REJECT-DROP", "PASS"],
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/bug.svg",
        },
        {
            name: "漏网之鱼",
            type: "select",
            proxies: ["直连模式", proxyName],
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/fish.svg",
        },
    ];

    autoProxyGroups.length &&
    groups[2].proxies.unshift(...autoProxyGroups.map((item) => item.name));
    groups.splice(1, 0, { name: "国外 QUIC", type: "select", proxies: ["PASS", "REJECT"] });
    groups.push(...autoProxyGroups);
    groups.push(...manualProxyGroupsConfig);
    groups.push({ name: "直连模式", type: "select", proxies: ["DIRECT", "直连 IPv4优先"] });
    params.proxies.push({ name: "直连 IPv4优先", type: "direct", "ip-version": "ipv4-prefer" });
    params["proxy-groups"] = groups;
}

// 修改规则
function overwriteRules(params) {
    const customRules = [
        // 在此添加自定义规则，优先级高于广告规则。例子：
        // "DOMAIN,baidu.com,DIRECT",
        "DOMAIN-SUFFIX,et.net,DIRECT",
        "IP-CIDR,10.126.0.0/24,DIRECT,no-resolve",
        "IP-CIDR,100.100.100.101/32,DIRECT,no-resolve",
        // PASS 继续原有分流；手动切换 REJECT 可让非国内/私网的 UDP 443 尝试回退 TCP。
        "AND,((NETWORK,UDP),(DST-PORT,443),(NOT,((OR,((RULE-SET,private_domain),(RULE-SET,Lan_no_ip),(RULE-SET,cn_domain),(RULE-SET,Domestic_no_ip),(RULE-SET,Direct_no_ip),(RULE-SET,cn_ip,no-resolve),(RULE-SET,private_ip,no-resolve)))))),国外 QUIC",
        // Discord UDP 流量强制代理（语音/视频，全平台）
        "AND,((OR,((PROCESS-NAME,Discord.exe),(PROCESS-NAME,Discord),(PROCESS-NAME,com.discord),(PROCESS-NAME,discord),(PROCESS-NAME,com.aliucord))),(NETWORK,udp))," + proxyName,
    ];

    // 广告拦截 / 隐私保护 / Malware 拦截 / Phiishing 拦截
    const adNonipRules = [
        "RULE-SET,Reject_no_ip,广告屏蔽",
        "RULE-SET,Reject_domainset,广告屏蔽",
        "RULE-SET,Reject_no_ip_drop,广告屏蔽",
        "RULE-SET,Reject_no_ip_no_drop,广告屏蔽",
    ];

    const nonipRules = [
        // 个人遇到需要代理的域名(比较特殊)
        "RULE-SET,CustomProxy_no_ip," + proxyName,

        // GoolgeFCM 推送
        "RULE-SET,GoogleFCM_no_ip,GoogleFCM",

        // 网易云音乐
        "RULE-SET,NetEaseMusic_no_ip,直连模式",

        // Steam 地区
        "RULE-SET,SteamRegion_no_ip,Steam地区",

        // SteamCN
        "RULE-SET,SteamCN_no_ip,直连模式",
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
        "RULE-SET,AppleCDN_no_ip,直连模式",
        // 苹果 CN 域名
        "RULE-SET,AppleCN_no_ip,直连模式",

        // Microsoft 中国 CDN
        "RULE-SET,MicrosoftCDN_no_ip,直连模式",

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
        "RULE-SET,Domestic_no_ip,直连模式",
        "RULE-SET,Direct_no_ip,直连模式",

        // 内网域名和局域网 IP
        /**
         * 域名列表包含 .local 和局域网 IP 的 in-addr.arpa 域名（即 AS112 域名）
         * 这部分域名一般会被解析到局域网 IP、需要走内网 DNS 解析、需要直连访问
         */
        "RULE-SET,Lan_no_ip,DIRECT",
        "RULE-SET,private_domain,DIRECT",
        // 国外域名先代理，避免进入 IP 规则时触发本地解析。
        "RULE-SET,proxy_domain," + proxyName,
    ];

    const ipRules = [
        // GooleFCM 推送
        "RULE-SET,GoogleFCM_ip,GoogleFCM",

        // 网易云音乐
        "RULE-SET,NetEaseMusic_ip,直连模式",

        // SteamCN ip
        "RULE-SET,SteamCN_ip,直连模式",

        // 广告拦截 / 隐私保护 / Malware 拦截 / Phiishing 拦截（ip）
        "RULE-SET,Reject_ip,REJECT",

        // Discord 语音/媒体服务器 IP（每日自动更新）
        "RULE-SET,Discord_ip," + proxyName,

        // ai 相关 IP 段（Anthropic）
        "RULE-SET,AI_ip,AI",

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
        "RULE-SET,Domestic_ip,直连模式",

        // 内网域名和局域网 IP
        /**
         * 域名列表包含 .local 和局域网 IP 的 in-addr.arpa 域名（即 AS112 域名）
         * 这部分域名一般会被解析到局域网 IP、需要走内网 DNS 解析、需要直连访问
         */
        "RULE-SET,Lan_ip,DIRECT",
        // 宽泛国内域名仅参与 DNS 分流；路由按国内 IP 兜底。
        "RULE-SET,cn_ip,直连模式",
        "RULE-SET,private_ip,DIRECT",
        // 兜底
        "MATCH,漏网之鱼",
    ];

    const allNonipRules = [...customRules, ...adNonipRules, ...nonipRules];

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
            format: "mrs",
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/REJECT/no_ip/Reject_domainset.mrs",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/REJECT/no_ip/Reject_domainset.mrs",
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

        // fake-ip 过滤补充规则，直接使用外部 mrs 域名规则集
        FakeIPFilter_domainset: {
            type: "http",
            interval: 86400,
            behavior: "domain",
            format: "mrs",
            url: "https://raw.githubusercontent.com/DustinWin/ruleset_geodata/refs/heads/mihomo-ruleset/fakeip-filter.mrs",
            path: "./ruleset/DustinWin/ruleset_geodata/fakeip-filter.mrs",
            proxy: "DIRECT",
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
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/Bilibili_no_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/Bilibili_no_ip.yaml",
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

        // Discord 语音/媒体服务器 IP（每日自动更新）
        Discord_ip: {
            ...ruleAnchor.ip,
            url: "https://raw.githubusercontent.com/RealSeek/discord-servers/refs/heads/main/data/mihomo-discord-ip.yaml",
            path: "./ruleset/RealSeek/discord-servers/data/mihomo-discord-ip.yaml",
        },

        // ##################################################################################################################

        // ai 相关 包含 OpenAI、Google Gemini、Claude、Perplexity 等
        AI_no_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/AI_no_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/AI_no_ip.yaml",
        },

        // ai 相关 IP 段（Anthropic IP ranges & ASN）
        AI_ip: {
            ...ruleAnchor.classical,
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/ip/AI_ip.yaml",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/ip/AI_ip.yaml",
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
            format: "mrs",
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/CDN_domainset.mrs",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/CDN_domainset.mrs",
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
            format: "mrs",
            url: "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/Download_domainset.mrs",
            path: "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/Download_domainset.mrs",
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

        /**
         * 外部规则集（替代 GEOIP/GEOSITE）
         */

        // ##################################################################################################################

        // 中国大陆域名
        cn_domain: {
            type: "http",
            interval: 86400,
            behavior: "domain",
            format: "mrs",
            url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/cn.mrs",
            path: "./ruleset/MetaCubeX/meta-rules-dat/geo/geosite/cn.mrs",
            proxy: "DIRECT",
        },

        // 私有域名
        private_domain: {
            type: "http",
            interval: 86400,
            behavior: "domain",
            format: "mrs",
            url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/private.mrs",
            path: "./ruleset/MetaCubeX/meta-rules-dat/geo/geosite/private.mrs",
            proxy: "DIRECT",
        },

        // 中国大陆 IP
        cn_ip: {
            type: "http",
            interval: 86400,
            behavior: "ipcidr",
            format: "mrs",
            url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geoip/cn.mrs",
            path: "./ruleset/MetaCubeX/meta-rules-dat/geo/geoip/cn.mrs",
            proxy: "DIRECT",
        },

        // 私有 IP
        private_ip: {
            type: "http",
            interval: 86400,
            behavior: "ipcidr",
            format: "mrs",
            url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geoip/private.mrs",
            path: "./ruleset/MetaCubeX/meta-rules-dat/geo/geoip/private.mrs",
            proxy: "DIRECT",
        },

        // 国外域名（DNS 与路由分流共用）
        proxy_domain: {
            type: "http",
            interval: 86400,
            behavior: "domain",
            format: "mrs",
            url: "https://raw.githubusercontent.com/DustinWin/ruleset_geodata/refs/heads/mihomo-ruleset/proxy.mrs",
            path: "./ruleset/DustinWin/ruleset_geodata/proxy.mrs",
            proxy: "DIRECT",
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
    return matchedProxies;
}

// 只保留与实际节点域名有关的订阅 DNS；节点 server 和 TLS 参数保持订阅原值。
function preserveSubscriptionProxyDns(params, dns) {
    const original = params.dns || {};
    const domains = [...new Set(params.proxies
        .map((proxy) => proxy.server)
        .filter((server) => typeof server === "string" && !server.includes(":") && !/^\d+(\.\d+){3}$/.test(server))
        .map((server) => server.toLowerCase()))];
    const matches = (pattern, domain) => {
        pattern = pattern.toLowerCase();
        if (pattern.startsWith("+.")) {
            return domain === pattern.slice(2) || domain.endsWith(pattern.slice(1));
        }
        if (pattern.startsWith(".")) return domain.endsWith(pattern);
        const labels = pattern.split(".");
        const domainLabels = domain.split(".");
        return labels.length === domainLabels.length &&
            labels.every((label, index) => label === "*" || label === domainLabels[index]);
    };
    const listenPort = String(original.listen || "").split(":").pop();
    const normalize = (resolvers) => (Array.isArray(resolvers) ? resolvers : [resolvers])
        .filter((resolver) => typeof resolver === "string")
        .map((resolver) => {
            const [address, suffix = ""] = resolver.split("#");
            const loopback = address.match(/^(?:(?:udp|tcp):\/\/)?(?:127\.0\.0\.1|localhost|\[::1\])(?::(\d+))?$/);
            // 订阅内置 DNS 监听不能成为新 DNS 的上游；hosts 映射仍会保留。
            if (loopback && String(loopback[1] || "53") === listenPort) return null;
            if (address === "system" || address === "system://") return address;
            const options = suffix.split("&").filter((option) => option.includes("="));
            return address + "#DIRECT" + (options.length ? "&" + options.join("&") : "");
        }).filter(Boolean);
    const commonResolver = /^(?:(?:https?|tls|quic|tcp|udp):\/\/)?(?:dns\.google|cloudflare-dns\.com|one\.one\.one\.one|dns\.alidns\.com|doh\.pub|dns\.quad9\.net|doh\.opendns\.com|dns\.adguard-dns\.com|223\.(?:5\.5\.5|6\.6\.6)|119\.29\.29\.29|1\.12\.12\.(?:12|21)|120\.53\.53\.53|8\.8\.(?:8\.8|4\.4)|1\.(?:1\.1\.1|0\.0\.1)|9\.9\.9\.9|114\.114\.(?:114\.114|115\.115))(?=[:/#]|$)|^system(?::\/\/)?$/i;
    const fallback = normalize(original["proxy-server-nameserver"] ||
        (original.nameserver || []).filter((resolver) => !commonResolver.test(resolver)));
    const policy = {};
    const inherited = { ...original["nameserver-policy"], ...original["proxy-server-nameserver-policy"] };
    for (const [patterns, resolvers] of Object.entries(inherited)) {
        const retained = patterns.split(",").filter((pattern) => domains.some((domain) => matches(pattern, domain)));
        const upstreams = normalize(resolvers);
        if (retained.length && upstreams.length) policy[retained.join(",")] = upstreams;
    }
    for (const domain of domains) {
        if (fallback.length && !Object.keys(policy).some((patterns) => patterns.split(",").some((pattern) => matches(pattern, domain)))) {
            policy[domain] = fallback;
        }
    }
    if (Object.keys(policy).length) dns["proxy-server-nameserver-policy"] = policy;
    dns["fake-ip-filter"].push(...(original["fake-ip-filter"] || [])
        .filter((pattern) => domains.some((domain) => matches(pattern, domain))));
}

// 修改DNS
function overwriteDns(params) {
    const dnsOptions = {
        enable: true,
        "listen": "0.0.0.0:1053",
        "cache-algorithm": "arc",
        "enhanced-mode": "fake-ip", // fake-ip 或 redir-host
        "fake-ip-filter-mode": "blacklist",
        "fake-ip-range": "198.18.0.1/16",
        "use-hosts": true,
        "use-system-hosts": false,
        ipv6: true,
        "respect-rules": true,

        "fake-ip-filter": [
            "rule-set:private_domain",
            "rule-set:Lan_no_ip",
            "rule-set:Direct_no_ip",
            "rule-set:Domestic_no_ip",
            "rule-set:FakeIPFilter_domainset",
            "+.et.net",
            "+.pub.3gppnetwork.org",
            "+.bing.com",
            "+.miwifi.com",
            "+.docker.io",
            "+.market.xiaomi.com",
            "+.push.apple.com",
            "+.ts.net",
            "+.et.net",
            "time.*.com",
            "ntp.*.com",
            "localhost.ptlogin2.qq.com",
            "localhost.sec.qq.com",
            "+.qq.com",
            "+.tencent.com",
            "+.msftconnecttest.com",
            "+.msftncsi.com",
        ],

        "default-nameserver": [
            "https://1.12.12.21/dns-query#DIRECT",
            "https://223.5.5.5/dns-query#DIRECT",
        ],

        nameserver: [
            "https://1.1.1.1/dns-query#代理模式",
            "https://8.8.8.8/dns-query#代理模式",
        ],

        "proxy-server-nameserver": [
            "https://dns.alidns.com/dns-query#DIRECT",
            "https://doh.pub/dns-query#DIRECT",
        ],

        "direct-nameserver": [
            "https://dns.alidns.com/dns-query#DIRECT",
            "https://doh.pub/dns-query#DIRECT",
        ],

        "direct-nameserver-follow-policy": true,

        "nameserver-policy": {
            "+.et.net": [
                "100.100.100.101#EasyTier"
            ],

            "+.ts.net": [
                "100.100.100.100#system"
            ],
            "rule-set:Lan_no_ip,private_domain": ["system"],
            "rule-set:cn_domain,Domestic_no_ip,Direct_no_ip,GoogleFCM_no_ip": [
                "https://doh.pub/dns-query#DIRECT",
                "https://dns.alidns.com/dns-query#DIRECT",
            ],
            "rule-set:proxy_domain": [
                "https://1.1.1.1/dns-query#代理模式",
                "https://8.8.8.8/dns-query#代理模式",
            ],
        },
    };

    preserveSubscriptionProxyDns(params, dnsOptions);
    params["dns"] = dnsOptions;
}

function getManualProxiesByRegex(params, regex) {
    const matchedProxies = params.proxies
        .filter((e) => regex.test(e.name))
        .map((e) => e.name);
    return matchedProxies;
}

// 覆写Tunnel
function overwriteTunnel(params) {
    const tunnelOptions = {
        enable: true,
        stack: "gvisor",
        device: "Meta",
        "dns-hijack": ["any:53"],
        "auto-route": true,
        "auto-redirect": false,
        "auto-detect-interface": true,
        "strict-route": false,
        "route-exclude-address": [
            "10.126.0.0/24",
            "100.100.100.101/32"
        ],
        "exclude-interface": [
            "EasyTier"
        ],
        mtu: 1500,
        "exclude-package": [
            "com.samsung.android.messaging",
            "com.samsung.android.app.telephonyui",
            "com.samsung.android.dialer",
            "com.samsung.android.incallui",
            "com.samsung.android.smartcallprovider",
            "com.samsung.android.intellivoiceservice",
            "com.android.settings",
            "com.qti.qcc",
            "com.sec.epdg",
            "com.sec.imsservice",
        ],
    };
    params.tun = { ...tunnelOptions };
}
