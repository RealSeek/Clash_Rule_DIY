# Mihomo fork 配套配置

静态配置使用 [liuran001/mihomo](https://github.com/liuran001/mihomo) `Alpha` 的 eBPF / Smart 字段；两份 JS 还需要 [RealSeek/mihomo](https://github.com/RealSeek/mihomo) 的 EasyTier 扩展。这些不是上游 MetaCubeX 的通用配置。

| 文件 | 平台 |
| --- | --- |
| [linux.yaml](linux.yaml) | Linux。eBPF 透明入站，同时开 TUN `mips` + `bbr` |
| [linux.js](linux.js) | Linux / Android Root 模块的 JS 覆写，接入已有订阅节点及 provider；eBPF 默认只代理本机 |
| [windows.js](windows.js) | Windows 的 JS 覆写，接入 TUN、WebUI、EasyTier 和现有订阅；不内置订阅地址 |
| [windows.yaml](windows.yaml) | Windows。没有 eBPF，透明入站由 TUN `mips` + `bbr` 承担 |

两份 JS 覆写使用 RealSeek/mihomo 的 EasyTier，共享 `mips` TUN。Windows 节点名为
`RealSeek-PC`，Linux / root Android 为 `RealSeek-Phone`。原 Tailscale 配置已移除。

Sub-Store 远程脚本使用 `#` 后的参数传给 `$arguments`，不是 `?` 查询参数。
其他脚本执行端需要将参数传给 `$arguments`，或 `params.arguments`：
`peer`、`network-name`、`network-secret` 三项必填。参数值须进行 URL 编码，例如：

```text
#peer=tcp%3A%2F%2Frelay.example.com%3A11010&network-name=YOUR_NETWORK&network-secret=YOUR_SECRET
```

多个 peer 在同一个 `peer` 参数内用逗号分隔，再对整个值进行 URL 编码，例如：

```text
#peer=tcp%3A%2F%2Frelay.example.com%3A11010%2Cudp%3A%2F%2Frelay.example.com%3A11010&network-name=YOUR_NETWORK&network-secret=YOUR_SECRET
```

脚本不内置 peer 或网络密钥；URL 中的密钥仍可能出现在平台日志、历史记录中，请勿公开完整 URL。
当前分流网段为 `10.126.0.0/24`，使用其他 overlay 网段时修改脚本对应规则。
Windows 固定使用 `10.126.0.10/24`，Linux / root Android 固定使用
`10.126.0.11/24`，均设置 `dhcp: false`，不读取 `ipv4` URL 参数。
这些地址不能被网络中的其他节点占用。保留网口自动检测，不启用 FakeTCP。

## 用之前改

- `proxy-providers.myclash.url`
- Linux 的 `listeners.shared.interface` 改成下联网卡。热点用 `wlan0`，桥接用 `br0` 或 `br-lan`

## 手机 JS 覆写

手机已通过 Root 模块运行 `liuran001/mihomo` 时，可将 `linux.js` 添加到支持 `main(params)` 的远程脚本覆写入口。内核自身不执行 JS，必须由模块或管理端执行覆写；如果入口只接受 YAML，不能直接填 JS 链接。

发布后的拉取地址：

```text
https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/docs/fork/linux.js
```

脚本保留订阅的 `proxies` / `proxy-providers`，不内置 `myclash` 订阅地址、不改节点协议参数。分流、DNS、策略组名称与独立 `icon` 字段来自 `linux.yaml`，不改原来的 `mihomo.yaml` 翻译。只有内联节点的订阅中，空地区组回退到 `智能优选`，不回退直连。

脚本开头的 `enableEBPF` 默认为 `true`，需要带 `with_ebpf` 的内核、root、cgroup v2。内核不满足条件时改为 `false`，保留 TUN `mips` + `bbr`。`sharedInterfaces` 默认为空，只开启 eBPF 本机入口；要接管热点流量时再填写实际下联网卡，例如 `["wlan0"]`，不沿用 Linux 模板的 `br-lan`。

模块已有的 TUN 开关、设备和句柄、监听端口、控制器及认证设置保留；覆写协议栈为 `mips` + `bbr`，eBPF 开启时关闭 `auto-redirect` 和 `strict-route`。

## 四项分别落在哪

1. **eBPF**：只有 Linux。`type: ebpf`、`mode: hybrid`，`bypass-rule-set: [cn_ip]` 在内核放行国内 IP。DNS 53 由 `dns-mode: hijack` 先于旁路劫持。二进制要带 `with_ebpf`，需要 root 和 cgroup v2。TUN 同时开着：`stack: mips`、`congestion-controller: bbr`、`auto-route: true`。`bypass-tun-direct: true` 让内核已经放行的目的地直接连出，避免被 `auto-route` 吸进 `mips` 后再走一遍规则。不要在同一张网卡上开 `auto-redirect`，`strict-route` 保持关闭。
2. **真实可用性**：`真实可用` 是 `url-test`，地区自动组和 `智能优选` 是 `smart`。三者启用 `prefer-udp`、`penalize-unstable`。Linux JS 关闭 `prefer-ipv6`，不再偏好 IPv6；Windows JS 保持启用。`prefer-asn` 只在 `smart` 上有效。探测走独立通道，不会改面板上的普通延迟。
3. **网络与 DNS**：UDP、TCP、DoT 的连接池是内核默认行为。四份配置采用国外 DoH 默认经 `代理模式`、国内域名策略经 `DIRECT` 的结构；不再用国内主 DNS 加 GeoIP fallback。节点域名解析使用独立的直连 DNS，防止代理 DNS 依赖代理节点解析形成循环。`cn_domain` 负责国内 DNS 和真实 IP 过滤，不再整体决定直连；已知国外域名规则在国内 IP 兜底前代理。`smart` 组保留 `uselightgbm`，ASN 库由 `geox-url.asn` 提供。
4. **IPv6 与按需测速**：核心和 eBPF IPv6 接管保持开启，避免 IPv6 字面量或 hosts 地址进入后被拒绝；两份 JS 的 `dns.ipv6` 仍为 `false`，不主动提供普通 AAAA 应答。静态 YAML 保留双栈 DNS。`tcp-concurrent` 开启，自动组使用 `lazy: true`，减少未使用组的周期测速。


## DNS 保留与私网解析

DNS 和节点解析保留参考 [AIsouler/MyClash](https://github.com/AIsouler/MyClash) 的配置设计，按本仓库的 eBPF、Smart、EasyTier 入口做适配。没有引入其整套脚本；`国外 QUIC` 策略组默认 `PASS`，选择 `REJECT` 才拒绝命中的国外 UDP/443。

两份 JS 保留订阅 `hosts`，不改写节点 `server`、SNI 或 TLS 参数。与实际节点域名匹配的订阅 `nameserver-policy` / `proxy-server-nameserver-policy` 会进入专用节点解析策略；原 `proxy-server-nameserver` 作为这些节点的解析来源。仅在没有专用节点 DNS 时，才从订阅普通 `nameserver` 中保留非公共解析器，避免把原来的整套 DNS 覆写重新带回来。原策略里的旧代理组名改成 `DIRECT`，带值的 DNS 选项保留。指向原 DNS 自身监听端口的 loopback 上游跳过，原 hosts 仍可用于节点解析。

只有 provider 的订阅在脚本阶段没有节点域名，保留原显式 `proxy-server-nameserver` 为节点 DNS 默认值；仍需订阅提供这一字段，普通 `nameserver` 不能精确推断到 provider 内部的节点。脚本不保留和节点无关的订阅 DNS 分流。

`private_domain`、`Lan_no_ip`、`.lan` 和 `.local` 交给系统 DNS；系统需指向实际局域网解析器，不能指回 mihomo 自己。`.local` 的解析结果仍取决于系统 DNS / mDNS 支持。两份 JS 的 `.et.net` 使用本配置 `Easytier` 实例，保留真实 IP 和嗅探排除。静态 YAML 使用独立 EasyTier，由系统提供私网 DNS；原来的 Tailscale `100.100.100.101` 已删除，固定 EasyTier hosts 继续可用。

## 分流优先级和直连出口

进入规则引擎的流量按业务和国外域名规则处理，再使用国内 / 私网 IP 兜底。宽泛的 `cn_domain` 只负责选国内 DNS 和返回真实地址，并不保证该域名最终直连。`直连模式` 提供 `DIRECT` 和 `直连 IPv4优先` 两个出口；后者为双栈可用时优先尝试 IPv4，仍允许 IPv6 回退。局域网、私网和 DNS 上游继续使用内置 `DIRECT`。JS 添加地区选项时保留服务组原本的默认选项，GoogleFCM、苹果、微软和 Steam 地区默认仍为直连。

Linux 的 `bypass-rule-set: [cn_ip]` 会在内核提前放行中国 IP，早于规则引擎。因此命中中国 IP 的真实地址连接可能直接绕过业务代理 / 拒绝规则，也不受 `直连模式` 的 IP 偏好控制；已建立的 TUN 旁路同样如此。需要强制某个中国 IP 目的地走代理时，应关闭该入口的 `bypass-rule-set`，或让该域名使用 fake-ip 并去掉相应真实 IP 过滤；单纯把代理规则前移无效。显式 HTTP/SOCKS 入站不受 eBPF 国内旁路影响。

`国外 QUIC` 开关沿用相同边界，国内 / 私网和 EasyTier 保持例外。`PASS` 是继续原规则，不是改走直连；该策略按 UDP/443 和名单判断，不会识别非 443 端口的 QUIC，也不会关闭节点自己的 UDP 协议或显式出口 DNS。适合按需验证 UDP 代理不稳定时的 TCP 回退，详见 [QUIC 说明](../README.md#代理选择与-quic)。

需要代理的 provider 策略组设 `empty-fallback: REJECT`，空 provider 不再默认放行直连。只有内联节点时，空地区组沿用 `智能优选`；完全没有可用节点或 provider 时，JS 报错，便于追踪订阅故障。

规则下载移除不稳定的 `ghfast.top` 包装，直接使用已验证可下载的源仓库 raw URL；保留现有业务规则和仍在维护的规则来源。

两份 JS 还支持 `disable-groups`、`filter-high-multiplier` 和 `proxy-ip-version` 三个可选参数，与外部 JS 使用相同含义和默认值，见 [脚本参数](../README.md#可选脚本参数)。它们不替代 EasyTier 必填参数。倍率过滤保留链式代理依赖，IP 策略跳过直连和 EasyTier；原 provider 的其他 `override` 字段保留。


国内 IP 统一使用 MetaCubeX `cn_ip`，同时用于规则兜底和 Linux eBPF 旁路。删除旧的 `China_ip` 文件和模板引用：旧数据只有 IPv4，2026-03-04 后未更新，与 2026-10-23 的双栈 MetaCubeX 数据有约 442 万个 IPv4 地址的分类分歧，不再让旧集合覆盖新集合的判断。Telegram 保留按官方网段整理的现有 IPv4 / IPv6 规则，FCM 保留现有精确地址表；不使用更宽泛的公司 ASN 集合替代服务专表。比较方法与下载核对见 [数据源记录](../rule-sources.md)。
