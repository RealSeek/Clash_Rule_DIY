// liuran001/mihomo Alpha: Windows override, derived from fork/windows.yaml.
// Windows uses one TUN entry.
const subscriptionExclude = "自动|智能调度|智能选择|故障|流量|官网|套餐|机场|订阅|年|月|失联|频道|Traffic|Expire";
function getEasyTierProxy(params) {
    const args = typeof $arguments === "object" && $arguments ? $arguments : params.arguments || {};
    if (!args.peer || !args["network-name"] || !args["network-secret"]) {
        throw new Error("EasyTier requires URL arguments: peer, network-name, network-secret");
    }
    return {
        name: "Easytier", type: "easytier", hostname: "RealSeek-PC",
        "instance-name": "RealSeek-PC", "network-name": args["network-name"],
        "network-secret": args["network-secret"], peers: args.peer.split(",").map((peer) => peer.trim()).filter(Boolean),
        ipv4: "10.126.0.10/24", dhcp: false,
        udp: true, mtu: 1360, "ipv6-public-addr-auto": true,
        "accept-dns": true, "latency-first": true, "need-p2p": true,
        "disable-upnp": true,
        listeners: ["tcp://0.0.0.0:11010", "udp://0.0.0.0:11010"]
    };
}
const windowsConfig = {
    "mixed-port": 7890,
    "mode": "rule",
    "allow-lan": true,
    "bind-address": "*",
    "unified-delay": true,
    "tcp-concurrent": true,
    "find-process-mode": "strict",
    "log-level": "info",
    "ipv6": true,
    "external-controller": "127.0.0.1:9090",
    "external-ui": "WebUI",
    "external-ui-url": "https://github.com/Zephyruso/zashboard/releases/latest/download/dist.zip",
    "external-controller-cors": {
        "allow-origins": [
            "*"
        ],
        "allow-private-network": true
    },
    "profile": {
        "store-selected": true,
        "store-fake-ip": true
    },
    "sniffer": {
        "enable": true,
        "parse-pure-ip": true,
        "force-dns-mapping": true,
        "override-destination": false,
        "sniff": {
            "HTTP": {
                "ports": [
                    80,
                    443
                ],
                "override-destination": false
            },
            "TLS": {
                "ports": [
                    443
                ]
            },
            "QUIC": {
                "ports": [
                    443
                ]
            }
        },
        "skip-domain": [
            "+.push.apple.com",
            "+.et.net"
        ],
        "skip-dst-address": [
            "10.126.0.0/24",
            "91.105.192.0/23",
            "91.108.4.0/22",
            "91.108.8.0/21",
            "91.108.16.0/21",
            "91.108.56.0/22",
            "95.161.64.0/20",
            "149.154.160.0/20",
            "185.76.151.0/24"
        ]
    },
    "geox-url": {
        "geoip": "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip.dat",
        "geosite": "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geosite.dat",
        "mmdb": "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip.metadb",
        "asn": "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/GeoLite2-ASN.mmdb"
    },
    "geo-auto-update": true,
    "geo-update-interval": 24,
    "tun": {
        "enable": true,
        "stack": "mips",
        "congestion-controller": "bbr",
        "device": "Meta",
        "auto-route": true,
        "strict-route": false,
        "auto-detect-interface": true,
        "easytier": [
            "Easytier"
        ],
        "gso": false,
        "dns-hijack": [
            "any:53"
        ],
        "mtu": 1500
    },
    "dns": {
        "enable": true,
        "listen": "0.0.0.0:1053",
        "ipv6": false,
        "ipv6-timeout": 300,
        "prefer-h3": true,
        "respect-rules": true,
        "enhanced-mode": "fake-ip",
        "fake-ip-filter-mode": "blacklist",
        "fake-ip-range": "198.18.0.1/16",
        "fake-ip-range6": "fdfe:dcba:9876::1/64",
        "use-hosts": true,
        "use-system-hosts": true,
        "cache-algorithm": "arc",
        "fake-ip-filter": [
            "+.lan",
            "+.local",
            "time.*.com",
            "ntp.*.com",
            "+.msftconnecttest.com",
            "+.msftncsi.com",
            "localhost.ptlogin2.qq.com",
            "localhost.sec.qq.com",
            "+.stun.*.*",
            "stun.*.*",
            "rule-set:cn_domain",
            "rule-set:private_domain",
            "rule-set:Lan_no_ip",
            "rule-set:Direct_no_ip",
            "rule-set:Domestic_no_ip",
            "+.et.net",
            "rule-set:GoogleFCM_no_ip"
        ],
        "default-nameserver": [
            "tls://223.5.5.5#DIRECT",
            "tls://120.53.53.53#DIRECT"
        ],
        "nameserver": [
            "https://1.1.1.1/dns-query#代理模式",
            "https://8.8.8.8/dns-query#代理模式"
        ],
        "proxy-server-nameserver": [
            "https://223.5.5.5/dns-query#DIRECT",
            "https://120.53.53.53/dns-query#DIRECT"
        ],
        "direct-nameserver": [
            "https://223.5.5.5/dns-query#DIRECT",
            "https://120.53.53.53/dns-query#DIRECT"
        ],
        "direct-nameserver-follow-policy": true,
        "nameserver-policy": {
            "+.et.net": [
                "easytier://Easytier"
            ],
            "rule-set:private_domain,Lan_no_ip": [
                "system#DIRECT"
            ],
            "+.lan": [
                "system#DIRECT"
            ],
            "+.local": [
                "system#DIRECT"
            ],
            "rule-set:proxy_domain": [
                "https://1.1.1.1/dns-query#代理模式",
                "https://8.8.8.8/dns-query#代理模式"
            ],
            "rule-set:Domestic_no_ip,Direct_no_ip,GoogleFCM_no_ip,cn_domain": [
                "https://223.5.5.5/dns-query#DIRECT",
                "https://120.53.53.53/dns-query#DIRECT"
            ]
        }
    },
    "proxy-groups": [
        {
            "name": "直连模式",
            "type": "select",
            "proxies": [
                "DIRECT",
                "直连 IPv4优先"
            ]
        },
        {
            "name": "国外 QUIC",
            "type": "select",
            "proxies": [
                "PASS",
                "REJECT"
            ]
        },
        {
            "name": "代理模式",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/adjust.svg",
            "type": "select",
            "proxies": [
                "延迟优选",
                "智能优选",
                "故障转移",
                "手动选择",
                "直连模式"
            ]
        },
        {
            "name": "延迟优选",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/speed.svg",
            "type": "url-test",
            "use": [
                "myclash"
            ],
            "prefer-udp": true,
            "prefer-ipv6": false,
            "penalize-unstable": true,
            "url": "https://cp.cloudflare.com/generate_204",
            "expected-status": 204,
            "interval": 300,
            "timeout": 5000,
            "lazy": true,
            "tolerance": 50,
            "hidden": true,
            "empty-fallback": "REJECT"
        },
        {
            "name": "智能优选",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/balance.svg",
            "type": "smart",
            "use": [
                "myclash"
            ],
            "prefer-udp": true,
            "prefer-ipv6": false,
            "penalize-unstable": true,
            "url": "https://cp.cloudflare.com/generate_204",
            "expected-status": 204,
            "interval": 300,
            "timeout": 5000,
            "lazy": true,
            "prefer-asn": true,
            "policy-priority": "IEPL:1.5",
            "uselightgbm": true,
            "collectdata": false,
            "sample-rate": 1,
            "hidden": true,
            "empty-fallback": "REJECT"
        },
        {
            "name": "故障转移",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/ambulance.svg",
            "type": "fallback",
            "use": [
                "myclash"
            ],
            "url": "https://cp.cloudflare.com/generate_204",
            "interval": 300,
            "timeout": 5000,
            "lazy": true,
            "expected-status": 204,
            "hidden": true,
            "empty-fallback": "REJECT"
        },
        {
            "name": "手动选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/link.svg",
            "type": "select",
            "proxies": [
                "🇭🇰 香港 - 智能选择",
                "🇭🇰 香港 - 手动选择",
                "🇹🇼 台湾 - 智能选择",
                "🇹🇼 台湾 - 手动选择",
                "🇸🇬 新加坡 - 智能选择",
                "🇸🇬 新加坡 - 手动选择",
                "🇦🇷 阿根廷 - 智能选择",
                "🇦🇷 阿根廷 - 手动选择",
                "🇯🇵 日本 - 智能选择",
                "🇯🇵 日本 - 手动选择",
                "🇺🇸 美国 - 智能选择",
                "🇺🇸 美国 - 手动选择",
                "🇩🇪 德国 - 智能选择",
                "🇩🇪 德国 - 手动选择",
                "🇰🇷 韩国 - 智能选择",
                "🇰🇷 韩国 - 手动选择",
                "🇬🇧 英国 - 智能选择",
                "🇬🇧 英国 - 手动选择",
                "🇨🇦 加拿大 - 智能选择",
                "🇨🇦 加拿大 - 手动选择",
                "🇦🇺 澳大利亚 - 智能选择",
                "🇦🇺 澳大利亚 - 手动选择",
                "🇪🇸 西班牙 - 智能选择",
                "🇪🇸 西班牙 - 手动选择",
                "🇳🇱 荷兰 - 智能选择",
                "🇳🇱 荷兰 - 手动选择",
                "🇹🇷 土耳其 - 智能选择",
                "🇹🇷 土耳其 - 手动选择",
                "🇷🇺 俄罗斯 - 智能选择",
                "🇷🇺 俄罗斯 - 手动选择",
                "🇮🇳 印度 - 智能选择",
                "🇮🇳 印度 - 手动选择",
                "🇧🇷 巴西 - 智能选择",
                "🇧🇷 巴西 - 手动选择",
                "🇮🇹 意大利 - 智能选择",
                "🇮🇹 意大利 - 手动选择",
                "🇨🇭 瑞士 - 智能选择",
                "🇨🇭 瑞士 - 手动选择",
                "🇸🇪 瑞典 - 智能选择",
                "🇸🇪 瑞典 - 手动选择",
                "🇳🇴 挪威 - 智能选择",
                "🇳🇴 挪威 - 手动选择",
                "其他 - 智能选择",
                "其他 - 手动选择"
            ]
        },
        {
            "name": "电报消息",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/telegram.svg",
            "type": "select",
            "proxies": [
                "智能优选",
                "延迟优选",
                "手动选择",
                "直连模式"
            ]
        },
        {
            "name": "AI",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/chatgpt.svg",
            "type": "select",
            "proxies": [
                "智能优选",
                "延迟优选",
                "🇺🇸 美国 - 智能选择",
                "手动选择"
            ]
        },
        {
            "name": "流媒体",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/youtube.svg",
            "type": "select",
            "proxies": [
                "智能优选",
                "延迟优选",
                "手动选择"
            ]
        },
        {
            "name": "苹果服务",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/apple.svg",
            "type": "select",
            "proxies": [
                "直连模式",
                "智能优选",
                "延迟优选"
            ]
        },
        {
            "name": "微软服务",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/microsoft.svg",
            "type": "select",
            "proxies": [
                "直连模式",
                "智能优选",
                "延迟优选"
            ]
        },
        {
            "name": "Emby",
            "icon": "https://cdnjs.cloudflare.com/ajax/libs/simple-icons/2.19.0/emby.svg",
            "type": "select",
            "proxies": [
                "智能优选",
                "延迟优选",
                "直连模式"
            ]
        },
        {
            "name": "GoogleFCM",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/google.svg",
            "type": "select",
            "proxies": [
                "直连模式",
                "智能优选"
            ]
        },
        {
            "name": "Steam地区",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/steam.svg",
            "type": "select",
            "proxies": [
                "直连模式",
                "智能优选",
                "🇭🇰 香港 - 智能选择",
                "🇯🇵 日本 - 智能选择",
                "🇺🇸 美国 - 智能选择"
            ]
        },
        {
            "name": "广告屏蔽",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/bug.svg",
            "type": "select",
            "proxies": [
                "REJECT",
                "DIRECT"
            ]
        },
        {
            "name": "漏网之鱼",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/fish.svg",
            "type": "select",
            "proxies": [
                "智能优选",
                "延迟优选",
                "直连模式"
            ]
        },
        {
            "name": "🇭🇰 香港 - 智能选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/hk.svg",
            "type": "smart",
            "use": [
                "myclash"
            ],
            "prefer-udp": true,
            "prefer-ipv6": false,
            "penalize-unstable": true,
            "url": "https://cp.cloudflare.com/generate_204",
            "expected-status": 204,
            "interval": 300,
            "timeout": 5000,
            "lazy": true,
            "prefer-asn": true,
            "policy-priority": "IEPL:1.5",
            "uselightgbm": true,
            "collectdata": false,
            "sample-rate": 1,
            "filter": "香港|HK|Hong Kong|🇭🇰",
            "hidden": true,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇭🇰 香港 - 手动选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/hk.svg",
            "type": "select",
            "use": [
                "myclash"
            ],
            "filter": "香港|HK|Hong Kong|🇭🇰",
            "hidden": false,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇹🇼 台湾 - 智能选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/tw.svg",
            "type": "smart",
            "use": [
                "myclash"
            ],
            "prefer-udp": true,
            "prefer-ipv6": false,
            "penalize-unstable": true,
            "url": "https://cp.cloudflare.com/generate_204",
            "expected-status": 204,
            "interval": 300,
            "timeout": 5000,
            "lazy": true,
            "prefer-asn": true,
            "policy-priority": "IEPL:1.5",
            "uselightgbm": true,
            "collectdata": false,
            "sample-rate": 1,
            "filter": "台湾|TW|Taiwan|🇹🇼",
            "hidden": true,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇹🇼 台湾 - 手动选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/tw.svg",
            "type": "select",
            "use": [
                "myclash"
            ],
            "filter": "台湾|TW|Taiwan|🇹🇼",
            "hidden": false,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇸🇬 新加坡 - 智能选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/sg.svg",
            "type": "smart",
            "use": [
                "myclash"
            ],
            "prefer-udp": true,
            "prefer-ipv6": false,
            "penalize-unstable": true,
            "url": "https://cp.cloudflare.com/generate_204",
            "expected-status": 204,
            "interval": 300,
            "timeout": 5000,
            "lazy": true,
            "prefer-asn": true,
            "policy-priority": "IEPL:1.5",
            "uselightgbm": true,
            "collectdata": false,
            "sample-rate": 1,
            "filter": "新加坡|狮城|SG|Singapore|🇸🇬",
            "hidden": true,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇸🇬 新加坡 - 手动选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/sg.svg",
            "type": "select",
            "use": [
                "myclash"
            ],
            "filter": "新加坡|狮城|SG|Singapore|🇸🇬",
            "hidden": false,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇦🇷 阿根廷 - 智能选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ar.svg",
            "type": "smart",
            "use": [
                "myclash"
            ],
            "prefer-udp": true,
            "prefer-ipv6": false,
            "penalize-unstable": true,
            "url": "https://cp.cloudflare.com/generate_204",
            "expected-status": 204,
            "interval": 300,
            "timeout": 5000,
            "lazy": true,
            "prefer-asn": true,
            "policy-priority": "IEPL:1.5",
            "uselightgbm": true,
            "collectdata": false,
            "sample-rate": 1,
            "filter": "阿根廷|AR|Argentina|🇦🇷",
            "hidden": true,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇦🇷 阿根廷 - 手动选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ar.svg",
            "type": "select",
            "use": [
                "myclash"
            ],
            "filter": "阿根廷|AR|Argentina|🇦🇷",
            "hidden": false,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇯🇵 日本 - 智能选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/jp.svg",
            "type": "smart",
            "use": [
                "myclash"
            ],
            "prefer-udp": true,
            "prefer-ipv6": false,
            "penalize-unstable": true,
            "url": "https://cp.cloudflare.com/generate_204",
            "expected-status": 204,
            "interval": 300,
            "timeout": 5000,
            "lazy": true,
            "prefer-asn": true,
            "policy-priority": "IEPL:1.5",
            "uselightgbm": true,
            "collectdata": false,
            "sample-rate": 1,
            "filter": "日本|JP|Japan|🇯🇵",
            "hidden": true,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇯🇵 日本 - 手动选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/jp.svg",
            "type": "select",
            "use": [
                "myclash"
            ],
            "filter": "日本|JP|Japan|🇯🇵",
            "hidden": false,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇺🇸 美国 - 智能选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/us.svg",
            "type": "smart",
            "use": [
                "myclash"
            ],
            "prefer-udp": true,
            "prefer-ipv6": false,
            "penalize-unstable": true,
            "url": "https://cp.cloudflare.com/generate_204",
            "expected-status": 204,
            "interval": 300,
            "timeout": 5000,
            "lazy": true,
            "prefer-asn": true,
            "policy-priority": "IEPL:1.5",
            "uselightgbm": true,
            "collectdata": false,
            "sample-rate": 1,
            "filter": "美国|US|USA|United States|America|🇺🇸",
            "hidden": true,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇺🇸 美国 - 手动选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/us.svg",
            "type": "select",
            "use": [
                "myclash"
            ],
            "filter": "美国|US|USA|United States|America|🇺🇸",
            "hidden": false,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇩🇪 德国 - 智能选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/de.svg",
            "type": "smart",
            "use": [
                "myclash"
            ],
            "prefer-udp": true,
            "prefer-ipv6": false,
            "penalize-unstable": true,
            "url": "https://cp.cloudflare.com/generate_204",
            "expected-status": 204,
            "interval": 300,
            "timeout": 5000,
            "lazy": true,
            "prefer-asn": true,
            "policy-priority": "IEPL:1.5",
            "uselightgbm": true,
            "collectdata": false,
            "sample-rate": 1,
            "filter": "德国|DE|Germany|🇩🇪",
            "hidden": true,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇩🇪 德国 - 手动选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/de.svg",
            "type": "select",
            "use": [
                "myclash"
            ],
            "filter": "德国|DE|Germany|🇩🇪",
            "hidden": false,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇰🇷 韩国 - 智能选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/kr.svg",
            "type": "smart",
            "use": [
                "myclash"
            ],
            "prefer-udp": true,
            "prefer-ipv6": false,
            "penalize-unstable": true,
            "url": "https://cp.cloudflare.com/generate_204",
            "expected-status": 204,
            "interval": 300,
            "timeout": 5000,
            "lazy": true,
            "prefer-asn": true,
            "policy-priority": "IEPL:1.5",
            "uselightgbm": true,
            "collectdata": false,
            "sample-rate": 1,
            "filter": "韩国|KR|Korea|South Korea|🇰🇷",
            "hidden": true,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇰🇷 韩国 - 手动选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/kr.svg",
            "type": "select",
            "use": [
                "myclash"
            ],
            "filter": "韩国|KR|Korea|South Korea|🇰🇷",
            "hidden": false,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇬🇧 英国 - 智能选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/gb.svg",
            "type": "smart",
            "use": [
                "myclash"
            ],
            "prefer-udp": true,
            "prefer-ipv6": false,
            "penalize-unstable": true,
            "url": "https://cp.cloudflare.com/generate_204",
            "expected-status": 204,
            "interval": 300,
            "timeout": 5000,
            "lazy": true,
            "prefer-asn": true,
            "policy-priority": "IEPL:1.5",
            "uselightgbm": true,
            "collectdata": false,
            "sample-rate": 1,
            "filter": "英国|UK|United Kingdom|Britain|Great Britain|🇬🇧",
            "hidden": true,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇬🇧 英国 - 手动选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/gb.svg",
            "type": "select",
            "use": [
                "myclash"
            ],
            "filter": "英国|UK|United Kingdom|Britain|Great Britain|🇬🇧",
            "hidden": false,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇨🇦 加拿大 - 智能选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ca.svg",
            "type": "smart",
            "use": [
                "myclash"
            ],
            "prefer-udp": true,
            "prefer-ipv6": false,
            "penalize-unstable": true,
            "url": "https://cp.cloudflare.com/generate_204",
            "expected-status": 204,
            "interval": 300,
            "timeout": 5000,
            "lazy": true,
            "prefer-asn": true,
            "policy-priority": "IEPL:1.5",
            "uselightgbm": true,
            "collectdata": false,
            "sample-rate": 1,
            "filter": "加拿大|CA|Canada|🇨🇦",
            "hidden": true,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇨🇦 加拿大 - 手动选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ca.svg",
            "type": "select",
            "use": [
                "myclash"
            ],
            "filter": "加拿大|CA|Canada|🇨🇦",
            "hidden": false,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇦🇺 澳大利亚 - 智能选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/au.svg",
            "type": "smart",
            "use": [
                "myclash"
            ],
            "prefer-udp": true,
            "prefer-ipv6": false,
            "penalize-unstable": true,
            "url": "https://cp.cloudflare.com/generate_204",
            "expected-status": 204,
            "interval": 300,
            "timeout": 5000,
            "lazy": true,
            "prefer-asn": true,
            "policy-priority": "IEPL:1.5",
            "uselightgbm": true,
            "collectdata": false,
            "sample-rate": 1,
            "filter": "澳大利亚|AU|Australia|🇦🇺",
            "hidden": true,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇦🇺 澳大利亚 - 手动选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/au.svg",
            "type": "select",
            "use": [
                "myclash"
            ],
            "filter": "澳大利亚|AU|Australia|🇦🇺",
            "hidden": false,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇪🇸 西班牙 - 智能选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/es.svg",
            "type": "smart",
            "use": [
                "myclash"
            ],
            "prefer-udp": true,
            "prefer-ipv6": false,
            "penalize-unstable": true,
            "url": "https://cp.cloudflare.com/generate_204",
            "expected-status": 204,
            "interval": 300,
            "timeout": 5000,
            "lazy": true,
            "prefer-asn": true,
            "policy-priority": "IEPL:1.5",
            "uselightgbm": true,
            "collectdata": false,
            "sample-rate": 1,
            "filter": "西班牙|ES|Spain|🇪🇸",
            "hidden": true,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇪🇸 西班牙 - 手动选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/es.svg",
            "type": "select",
            "use": [
                "myclash"
            ],
            "filter": "西班牙|ES|Spain|🇪🇸",
            "hidden": false,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇳🇱 荷兰 - 智能选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/nl.svg",
            "type": "smart",
            "use": [
                "myclash"
            ],
            "prefer-udp": true,
            "prefer-ipv6": false,
            "penalize-unstable": true,
            "url": "https://cp.cloudflare.com/generate_204",
            "expected-status": 204,
            "interval": 300,
            "timeout": 5000,
            "lazy": true,
            "prefer-asn": true,
            "policy-priority": "IEPL:1.5",
            "uselightgbm": true,
            "collectdata": false,
            "sample-rate": 1,
            "filter": "荷兰|NL|Netherlands|🇳🇱",
            "hidden": true,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇳🇱 荷兰 - 手动选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/nl.svg",
            "type": "select",
            "use": [
                "myclash"
            ],
            "filter": "荷兰|NL|Netherlands|🇳🇱",
            "hidden": false,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇹🇷 土耳其 - 智能选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/tr.svg",
            "type": "smart",
            "use": [
                "myclash"
            ],
            "prefer-udp": true,
            "prefer-ipv6": false,
            "penalize-unstable": true,
            "url": "https://cp.cloudflare.com/generate_204",
            "expected-status": 204,
            "interval": 300,
            "timeout": 5000,
            "lazy": true,
            "prefer-asn": true,
            "policy-priority": "IEPL:1.5",
            "uselightgbm": true,
            "collectdata": false,
            "sample-rate": 1,
            "filter": "土耳其|TR|Turkey|🇹🇷",
            "hidden": true,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇹🇷 土耳其 - 手动选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/tr.svg",
            "type": "select",
            "use": [
                "myclash"
            ],
            "filter": "土耳其|TR|Turkey|🇹🇷",
            "hidden": false,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇷🇺 俄罗斯 - 智能选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ru.svg",
            "type": "smart",
            "use": [
                "myclash"
            ],
            "prefer-udp": true,
            "prefer-ipv6": false,
            "penalize-unstable": true,
            "url": "https://cp.cloudflare.com/generate_204",
            "expected-status": 204,
            "interval": 300,
            "timeout": 5000,
            "lazy": true,
            "prefer-asn": true,
            "policy-priority": "IEPL:1.5",
            "uselightgbm": true,
            "collectdata": false,
            "sample-rate": 1,
            "filter": "俄罗斯|RU|Russia|🇷🇺",
            "hidden": true,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇷🇺 俄罗斯 - 手动选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ru.svg",
            "type": "select",
            "use": [
                "myclash"
            ],
            "filter": "俄罗斯|RU|Russia|🇷🇺",
            "hidden": false,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇮🇳 印度 - 智能选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/in.svg",
            "type": "smart",
            "use": [
                "myclash"
            ],
            "prefer-udp": true,
            "prefer-ipv6": false,
            "penalize-unstable": true,
            "url": "https://cp.cloudflare.com/generate_204",
            "expected-status": 204,
            "interval": 300,
            "timeout": 5000,
            "lazy": true,
            "prefer-asn": true,
            "policy-priority": "IEPL:1.5",
            "uselightgbm": true,
            "collectdata": false,
            "sample-rate": 1,
            "filter": "印度|IN|India|🇮🇳",
            "hidden": true,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇮🇳 印度 - 手动选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/in.svg",
            "type": "select",
            "use": [
                "myclash"
            ],
            "filter": "印度|IN|India|🇮🇳",
            "hidden": false,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇧🇷 巴西 - 智能选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/br.svg",
            "type": "smart",
            "use": [
                "myclash"
            ],
            "prefer-udp": true,
            "prefer-ipv6": false,
            "penalize-unstable": true,
            "url": "https://cp.cloudflare.com/generate_204",
            "expected-status": 204,
            "interval": 300,
            "timeout": 5000,
            "lazy": true,
            "prefer-asn": true,
            "policy-priority": "IEPL:1.5",
            "uselightgbm": true,
            "collectdata": false,
            "sample-rate": 1,
            "filter": "巴西|BR|Brazil|🇧🇷",
            "hidden": true,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇧🇷 巴西 - 手动选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/br.svg",
            "type": "select",
            "use": [
                "myclash"
            ],
            "filter": "巴西|BR|Brazil|🇧🇷",
            "hidden": false,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇮🇹 意大利 - 智能选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/it.svg",
            "type": "smart",
            "use": [
                "myclash"
            ],
            "prefer-udp": true,
            "prefer-ipv6": false,
            "penalize-unstable": true,
            "url": "https://cp.cloudflare.com/generate_204",
            "expected-status": 204,
            "interval": 300,
            "timeout": 5000,
            "lazy": true,
            "prefer-asn": true,
            "policy-priority": "IEPL:1.5",
            "uselightgbm": true,
            "collectdata": false,
            "sample-rate": 1,
            "filter": "意大利|IT|Italy|🇮🇹",
            "hidden": true,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇮🇹 意大利 - 手动选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/it.svg",
            "type": "select",
            "use": [
                "myclash"
            ],
            "filter": "意大利|IT|Italy|🇮🇹",
            "hidden": false,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇨🇭 瑞士 - 智能选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ch.svg",
            "type": "smart",
            "use": [
                "myclash"
            ],
            "prefer-udp": true,
            "prefer-ipv6": false,
            "penalize-unstable": true,
            "url": "https://cp.cloudflare.com/generate_204",
            "expected-status": 204,
            "interval": 300,
            "timeout": 5000,
            "lazy": true,
            "prefer-asn": true,
            "policy-priority": "IEPL:1.5",
            "uselightgbm": true,
            "collectdata": false,
            "sample-rate": 1,
            "filter": "瑞士|CH|Switzerland|🇨🇭",
            "hidden": true,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇨🇭 瑞士 - 手动选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ch.svg",
            "type": "select",
            "use": [
                "myclash"
            ],
            "filter": "瑞士|CH|Switzerland|🇨🇭",
            "hidden": false,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇸🇪 瑞典 - 智能选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/se.svg",
            "type": "smart",
            "use": [
                "myclash"
            ],
            "prefer-udp": true,
            "prefer-ipv6": false,
            "penalize-unstable": true,
            "url": "https://cp.cloudflare.com/generate_204",
            "expected-status": 204,
            "interval": 300,
            "timeout": 5000,
            "lazy": true,
            "prefer-asn": true,
            "policy-priority": "IEPL:1.5",
            "uselightgbm": true,
            "collectdata": false,
            "sample-rate": 1,
            "filter": "瑞典|SE|Sweden|🇸🇪",
            "hidden": true,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇸🇪 瑞典 - 手动选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/se.svg",
            "type": "select",
            "use": [
                "myclash"
            ],
            "filter": "瑞典|SE|Sweden|🇸🇪",
            "hidden": false,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇳🇴 挪威 - 智能选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/no.svg",
            "type": "smart",
            "use": [
                "myclash"
            ],
            "prefer-udp": true,
            "prefer-ipv6": false,
            "penalize-unstable": true,
            "url": "https://cp.cloudflare.com/generate_204",
            "expected-status": 204,
            "interval": 300,
            "timeout": 5000,
            "lazy": true,
            "prefer-asn": true,
            "policy-priority": "IEPL:1.5",
            "uselightgbm": true,
            "collectdata": false,
            "sample-rate": 1,
            "filter": "挪威|NO|Norway|🇳🇴",
            "hidden": true,
            "empty-fallback": "REJECT"
        },
        {
            "name": "🇳🇴 挪威 - 手动选择",
            "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/no.svg",
            "type": "select",
            "use": [
                "myclash"
            ],
            "filter": "挪威|NO|Norway|🇳🇴",
            "hidden": false,
            "empty-fallback": "REJECT"
        },
        {
            "name": "其他 - 智能选择",
            "type": "smart",
            "use": [
                "myclash"
            ],
            "prefer-udp": true,
            "prefer-ipv6": false,
            "penalize-unstable": true,
            "url": "https://cp.cloudflare.com/generate_204",
            "expected-status": 204,
            "interval": 300,
            "timeout": 5000,
            "lazy": true,
            "prefer-asn": true,
            "policy-priority": "IEPL:1.5",
            "uselightgbm": true,
            "collectdata": false,
            "sample-rate": 1,
            "exclude-filter": "香港|台湾|新加坡|狮城|阿根廷|日本|美国|德国|韩国|英国|加拿大|澳大利亚|西班牙|荷兰|土耳其|俄罗斯|印度|巴西|意大利|瑞士|瑞典|挪威",
            "hidden": true,
            "empty-fallback": "REJECT"
        },
        {
            "name": "其他 - 手动选择",
            "type": "select",
            "use": [
                "myclash"
            ],
            "exclude-filter": "香港|台湾|新加坡|狮城|阿根廷|日本|美国|德国|韩国|英国|加拿大|澳大利亚|西班牙|荷兰|土耳其|俄罗斯|印度|巴西|意大利|瑞士|瑞典|挪威",
            "empty-fallback": "REJECT"
        }
    ],
    "rule-providers": {
        "Reject_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/REJECT/ip/Reject_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/REJECT/ip/Reject_ip.yaml"
        },
        "Reject_no_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/REJECT/no_ip/Reject_no_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/REJECT/no_ip/Reject_no_ip.yaml"
        },
        "Reject_domainset": {
            "type": "http",
            "interval": 1800,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/REJECT/no_ip/Reject_domainset.mrs",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/REJECT/no_ip/Reject_domainset.mrs"
        },
        "Reject_no_ip_drop": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/REJECT/no_ip/Reject_no_ip_drop.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/REJECT/no_ip/Reject_no_ip_drop.yaml"
        },
        "Reject_no_ip_no_drop": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/REJECT/no_ip/Reject_no_ip_no_drop.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/REJECT/no_ip/Reject_no_ip_no_drop.yaml"
        },
        "Domestic_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/ip/Domestic_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/ip/Domestic_ip.yaml"
        },
        "GoogleFCM_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/ip/GoogleFCM_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/ip/GoogleFCM_ip.yaml"
        },
        "Lan_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/ip/Lan_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/ip/Lan_ip.yaml"
        },
        "NetEaseMusic_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/ip/NetEaseMusic_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/ip/NetEaseMusic_ip.yaml"
        },
        "SteamCN_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/ip/SteamCN_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/ip/SteamCN_ip.yaml"
        },
        "AppleCDN_no_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "domain",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/AppleCDN_no_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/AppleCDN_no_ip.yaml"
        },
        "AppleCN_no_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "domain",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/AppleCN_no_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/AppleCN_no_ip.yaml"
        },
        "Direct_no_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/Direct_no_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/Direct_no_ip.yaml"
        },
        "Domestic_no_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/Domestic_no_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/Domestic_no_ip.yaml"
        },
        "GoogleFCM_no_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/GoogleFCM_no_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/GoogleFCM_no_ip.yaml"
        },
        "Lan_no_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/Lan_no_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/Lan_no_ip.yaml"
        },
        "FakeIPFilter_domainset": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/DustinWin/ruleset_geodata/refs/heads/mihomo-ruleset/fakeip-filter.mrs",
            "path": "./ruleset/DustinWin/ruleset_geodata/fakeip-filter.mrs",
            "proxy": "DIRECT"
        },
        "MicrosoftCDN_no_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/MicrosoftCDN_no_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/MicrosoftCDN_no_ip.yaml"
        },
        "NetEaseMusic_no_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/NetEaseMusic_no_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/NetEaseMusic_no_ip.yaml"
        },
        "SteamCN_no_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/SteamCN_no_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/SteamCN_no_ip.yaml"
        },
        "SteamRegion_no_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/DIRECT/no_ip/SteamRegion_no_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/DIRECT/no_ip/SteamRegion_no_ip.yaml"
        },
        "Stream_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/ip/Stream_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/ip/Stream_ip.yaml"
        },
        "Telegram_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/ip/Telegram_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/ip/Telegram_ip.yaml"
        },
        "Discord_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "ipcidr",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/discord-servers/refs/heads/main/data/mihomo-discord-ip.yaml",
            "path": "./ruleset/RealSeek/discord-servers/data/mihomo-discord-ip.yaml"
        },
        "AI_no_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/AI_no_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/AI_no_ip.yaml"
        },
        "AI_Gateway": {
            "type": "file",
            "behavior": "classical",
            "format": "yaml",
            "path": "./ruleset/RealSeek/AI_Gateway.yaml"
        },
        "Apple_no_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/Apple_no_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/Apple_no_ip.yaml"
        },
        "CDN_domainset": {
            "type": "http",
            "interval": 1800,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/CDN_domainset.mrs",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/CDN_domainset.mrs"
        },
        "CDN_no_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/CDN_no_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/CDN_no_ip.yaml"
        },
        "CustomProxy_no_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/CustomProxy_no_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/CustomProxy_no_ip.yaml"
        },
        "Download_domainset": {
            "type": "http",
            "interval": 1800,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/Download_domainset.mrs",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/Download_domainset.mrs"
        },
        "Download_no_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/Download_no_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/Download_no_ip.yaml"
        },
        "Global_no_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/Global_no_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/Global_no_ip.yaml"
        },
        "Microsoft_no_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/Microsoft_no_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/Microsoft_no_ip.yaml"
        },
        "Steam_no_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/Steam_no_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/Steam_no_ip.yaml"
        },
        "Stream_no_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/Stream_no_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/Stream_no_ip.yaml"
        },
        "Emby_no_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/Emby_no_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/Emby_no_ip.yaml"
        },
        "Telegram_no_ip": {
            "type": "http",
            "interval": 1800,
            "behavior": "classical",
            "format": "yaml",
            "url": "https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/PROXY/no_ip/Telegram_no_ip.yaml",
            "path": "./ruleset/RealSeek/Clash_Rule_DIY/PROXY/no_ip/Telegram_no_ip.yaml"
        },
        "cn_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/cn.mrs",
            "path": "./ruleset/MetaCubeX/meta-rules-dat/geo/geosite/cn.mrs",
            "proxy": "DIRECT"
        },
        "private_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/private.mrs",
            "path": "./ruleset/MetaCubeX/meta-rules-dat/geo/geosite/private.mrs",
            "proxy": "DIRECT"
        },
        "cn_ip": {
            "type": "http",
            "interval": 86400,
            "behavior": "ipcidr",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geoip/cn.mrs",
            "path": "./ruleset/MetaCubeX/meta-rules-dat/geo/geoip/cn.mrs",
            "proxy": "DIRECT"
        },
        "private_ip": {
            "type": "http",
            "interval": 86400,
            "behavior": "ipcidr",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geoip/private.mrs",
            "path": "./ruleset/MetaCubeX/meta-rules-dat/geo/geoip/private.mrs",
            "proxy": "DIRECT"
        },
        "proxy_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/DustinWin/ruleset_geodata/refs/heads/mihomo-ruleset/proxy.mrs",
            "path": "./ruleset/DustinWin/ruleset_geodata/proxy.mrs",
            "proxy": "DIRECT"
        }
    },
    "rules": [
        "IP-CIDR,10.126.0.0/24,Easytier,no-resolve",
        "AND,((NETWORK,UDP),(DST-PORT,443),(NOT,((OR,((RULE-SET,private_domain),(RULE-SET,Lan_no_ip),(RULE-SET,cn_domain),(RULE-SET,Domestic_no_ip),(RULE-SET,Direct_no_ip),(RULE-SET,cn_ip,no-resolve),(RULE-SET,private_ip,no-resolve)))))),国外 QUIC",
        "AND,((OR,((PROCESS-NAME,Discord.exe),(PROCESS-NAME,Discord),(PROCESS-NAME,com.discord),(PROCESS-NAME,discord),(PROCESS-NAME,com.aliucord))),(NETWORK,udp)),代理模式",
        "RULE-SET,Reject_no_ip,广告屏蔽",
        "RULE-SET,Reject_domainset,广告屏蔽",
        "RULE-SET,Reject_no_ip_drop,广告屏蔽",
        "RULE-SET,Reject_no_ip_no_drop,广告屏蔽",
        "RULE-SET,CustomProxy_no_ip,代理模式",
        "RULE-SET,GoogleFCM_no_ip,GoogleFCM",
        "RULE-SET,NetEaseMusic_no_ip,直连模式",
        "RULE-SET,SteamRegion_no_ip,Steam地区",
        "RULE-SET,SteamCN_no_ip,直连模式",
        "RULE-SET,Steam_no_ip,代理模式",
        "RULE-SET,CDN_domainset,代理模式",
        "RULE-SET,CDN_no_ip,代理模式",
        "RULE-SET,Stream_no_ip,流媒体",
        "RULE-SET,Telegram_no_ip,电报消息",
        "RULE-SET,AppleCDN_no_ip,直连模式",
        "RULE-SET,AppleCN_no_ip,直连模式",
        "RULE-SET,MicrosoftCDN_no_ip,直连模式",
        "RULE-SET,Download_domainset,代理模式",
        "RULE-SET,Download_no_ip,代理模式",
        "RULE-SET,Apple_no_ip,苹果服务",
        "RULE-SET,Microsoft_no_ip,微软服务",
        "RULE-SET,AI_Gateway,AI",
        "RULE-SET,AI_no_ip,AI",
        "RULE-SET,Global_no_ip,代理模式",
        "RULE-SET,proxy_domain,代理模式",
        "RULE-SET,Domestic_no_ip,直连模式",
        "RULE-SET,Direct_no_ip,直连模式",
        "RULE-SET,Lan_no_ip,DIRECT",
        "RULE-SET,GoogleFCM_ip,GoogleFCM",
        "RULE-SET,NetEaseMusic_ip,直连模式",
        "RULE-SET,SteamCN_ip,直连模式",
        "RULE-SET,Reject_ip,REJECT",
        "RULE-SET,Discord_ip,代理模式",
        "RULE-SET,Telegram_ip,电报消息",
        "RULE-SET,Stream_ip,流媒体",
        "RULE-SET,Emby_no_ip,Emby",
        "RULE-SET,Domestic_ip,直连模式",
        "RULE-SET,Lan_ip,DIRECT",
        "RULE-SET,private_domain,DIRECT",
        "RULE-SET,cn_ip,直连模式",
        "RULE-SET,private_ip,DIRECT",
        "MATCH,漏网之鱼"
    ]
};

// 只保留与实际节点域名有关的订阅 DNS；节点 server 和 TLS 参数保持订阅原值。
function preserveSubscriptionProxyDns(params, dns) {
    const original = params.dns || {};
    const domains = [...new Set((params.proxies || [])
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
    // Provider 内容由内核稍后拉取，脚本阶段看不到节点域名。
    if (Object.keys(params["proxy-providers"] || {}).length && original["proxy-server-nameserver"] && fallback.length) {
        dns["proxy-server-nameserver"] = fallback;
    }
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

// 可选脚本参数：默认保持现有策略；参数取自 $arguments 或 params.arguments。
function applyOptionalFeatures(params) {
    const proxyName = "代理模式";
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
    const baseGroups = new Set(["国外QUIC", "代理模式", "智能优选", "延迟优选", "故障转移", "手动选择", "负载均衡(散列)", "负载均衡(会话)", "直连模式"]);
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

function main(params) {
    const config = JSON.parse(JSON.stringify(windowsConfig));
    const easytier = getEasyTierProxy(params);
    config.proxies = [...(params.proxies || []).filter((proxy) => proxy.type !== "tailscale" && proxy.name !== easytier.name && proxy.name !== "直连 IPv4优先"), easytier,
        { name: "直连 IPv4优先", type: "direct", "ip-version": "ipv4-prefer" }];
    const providers = Object.keys(params["proxy-providers"] || {});
    const excluded = new RegExp(subscriptionExclude, "i");
    const nodes = config.proxies.filter((proxy) => proxy.name !== easytier.name && proxy.name !== "直连 IPv4优先" && !excluded.test(proxy.name));
    if (!nodes.length && !providers.length) {
        throw new Error("Windows override requires proxies or proxy-providers from a subscription.");
    }

    config["proxy-groups"].forEach((group) => {
        if (!group.use) return;
        delete group.use;
        const include = group.filter ? new RegExp(group.filter, "i") : null;
        const exclude = group["exclude-filter"] ? new RegExp(group["exclude-filter"], "i") : null;
        group.proxies = nodes
            .filter((proxy) => (!include || include.test(proxy.name)) &&
                (!exclude || !exclude.test(proxy.name)))
            .map((proxy) => proxy.name);
        if (providers.length) {
            group.use = providers;
            group["exclude-filter"] = [subscriptionExclude, group["exclude-filter"]]
                .filter(Boolean).join("|");
        } else {
            delete group.filter;
            delete group["exclude-filter"];
            if (!group.proxies.length) group.proxies = ["智能优选"];
        }
    });

    const countryGroupNames = config["proxy-groups"]
        .filter((group) => / - (智能选择|手动选择)$/.test(group.name))
        .map((group) => group.name);
    const serviceGroups = new Set([
        "电报消息", "AI", "流媒体", "苹果服务", "微软服务",
        "Emby", "GoogleFCM", "Steam地区", "漏网之鱼",
    ]);
    config["proxy-groups"].forEach((group) => {
        if (!serviceGroups.has(group.name)) return;
        const defaultProxy = group.proxies[0];
        const keep = new Set(group.proxies || []);
        group.proxies = [
            "智能优选",
            "延迟优选",
            ...countryGroupNames,
            "手动选择",
            ...(keep.has("直连模式") ? ["直连模式"] : []),
        ];
        group.proxies = [defaultProxy, ...group.proxies.filter((name) => name !== defaultProxy)];
    });
    config.profile = { ...(params.profile || {}), ...config.profile };
    if (params["mixed-port"] !== undefined) config["mixed-port"] = params["mixed-port"];
    for (const key of ["external-controller", "external-ui", "external-ui-url", "secret", "external-controller-cors"]) {
        if (params[key] !== undefined) config[key] = params[key];
    }
    preserveSubscriptionProxyDns(params, config.dns);
    if (params.dns && params.dns.listen !== undefined) config.dns.listen = params.dns.listen;
    config.tun = {
        ...config.tun,
        ...(params.tun || {}),
        "easytier": ["Easytier"],
        "gso": false,
        "auto-redirect": false,
        "auto-detect-interface": true,
        "mtu": easytier.mtu,
        stack: windowsConfig.tun.stack,
        "congestion-controller": windowsConfig.tun["congestion-controller"],
    };
    Object.assign(params, config);
    applyOptionalFeatures(params);
    return params;
}
