# liuran001/mihomo

配置按 [liuran001/mihomo](https://github.com/liuran001/mihomo) `Alpha` 的源码字段编写，不是上游 MetaCubeX 的通用配置。

| 文件 | 平台 |
| --- | --- |
| [linux.yaml](linux.yaml) | Linux。eBPF 透明入站，同时开 TUN `mips` + `bbr` |
| [linux.js](linux.js) | Linux / Android Root 模块的 JS 覆写，接入已有订阅节点及 provider；eBPF 默认只代理本机 |
| [windows.js](windows.js) | Windows 的 JS 覆写，接入原生 EasyTier 出入站、TUN、WebUI 和现有订阅；不内置订阅地址 |
| [windows.yaml](windows.yaml) | Windows。没有 eBPF，透明入站由 TUN `mips` + `bbr` 承担 |

YAML 配置仍适合独立 `easytier-core`；两份 JS 覆写则使用本地 mihomo fork 的原生 EasyTier 出站和 overlay 入站。JS 将本机 overlay 地址、完整传输监听、公共 peer、7890 TCP/UDP 入站和 `*.et.net` 的 EasyTier DNS 一起写入；固定节点名仍通过原生 `hosts` 映射。公共节点只保留域名，不写死可能变化的公共 IP。

## 用之前改

- `proxy-providers.myclash.url`
- Linux 的 `listeners.shared.interface` 改成下联网卡。热点用 `wlan0`，桥接用 `br0` 或 `br-lan`

## 手机 JS 覆写

手机已通过 Root 模块运行 `liuran001/mihomo` 时，可将 `linux.js` 添加到支持 `main(params)` 的远程脚本覆写入口。内核自身不执行 JS，必须由模块或管理端执行覆写；如果入口只接受 YAML，不能直接填 JS 链接。

发布后的拉取地址：

```text
https://raw.githubusercontent.com/RealSeek/Clash_Rule_DIY/refs/heads/mihomo/docs/fork/linux.js
```

脚本保留订阅的 `proxies` / `proxy-providers`，额外加入本地 EasyTier 出站和 overlay 入站；不内置 `myclash` 订阅地址、不改节点协议参数。分流、DNS、策略组名称与独立 `icon` 字段来自 `linux.yaml`，不改原来的 `mihomo.yaml` 翻译。只有内联节点的订阅中，空地区组回退到 `智能优选`，不回退直连。

脚本开头的 `enableEBPF` 默认为 `true`，需要带 `with_ebpf` 的内核、root、cgroup v2。内核不满足条件时改为 `false`，保留 TUN `mips` + `bbr`。`sharedInterfaces` 默认为空，只开启 eBPF 本机入口；要接管热点流量时再填写实际下联网卡，例如 `["wlan0"]`，不沿用 Linux 模板的 `br-lan`。

模块已有的 TUN 开关、设备和句柄、监听端口、控制器及认证设置保留；覆写协议栈为 `mips` + `bbr`，eBPF 开启时关闭 `auto-redirect` 和 `strict-route`。EasyTier 的 overlay、完整传输监听、7890 TCP/UDP 入站和源端口排除与模块原有设置合并，不写死公共节点 IP。

手机网络稳定性默认值按 [mihomo-easytier-optimization-plan..md](../../mihomo-easytier-optimization-plan..md) 调整：EasyTier overlay 目标、peer 和文档列出的 STUN/TURN 域名置于规则最前面；关闭 DoH3 和自动组选 UDP/IPv6 偏好；健康检查 300 秒、8000ms、`lazy: false`；TUN MTU 1400。`auto-detect-interface` 保持开启，不绑定 Wi-Fi/蜂窝网卡名。

## 四项分别落在哪

1. **eBPF**：只有 Linux。`type: ebpf`、`mode: hybrid`，`bypass-rule-set: [cn_ip]` 在内核放行国内 IP。DNS 53 由 `dns-mode: hijack` 先于旁路劫持。二进制要带 `with_ebpf`，需要 root 和 cgroup v2。TUN 同时开着：`stack: mips`、`congestion-controller: bbr`、`auto-route: true`。`bypass-tun-direct: true` 让内核已经放行的目的地直接连出，避免被 `auto-route` 吸进 `mips` 后再走一遍规则。不要在同一张网卡上开 `auto-redirect`，`strict-route` 保持关闭。
2. **真实可用性**：`真实可用` 是 `url-test`，地区自动组和 `智能优选` 是 `smart`。三者都开 `prefer-udp`、`prefer-ipv6`、`penalize-unstable`。`prefer-asn` 只在 `smart` 上有效。探测走独立通道，不会改面板上的普通延迟。
3. **EasyTier**：YAML 使用独立 `easytier-core`，`*.et.net` 通过其 DNS `100.100.100.101` 解析；JS 使用 mihomo 原生 EasyTier 出站和 `easytier-in` 入站，通过 `et://easytier` 解析 `*.et.net`。两者都排除固定的 `10.126.0.0/24` 和 `11010`–`11013`；JS 将 overlay 目标送入 `easytier` 出站。公共 peer 不写死动态 IP，固定节点名称通过原生 `hosts` 映射。
4. **网络与 DNS**：UDP、TCP、DoT 的连接池是内核默认行为。DoH 开 `prefer-h3`，查询优先走 QUIC。国内域名用阿里 DoH 拿真实地址，不进 fake-ip，Linux 上才能被 eBPF 的 `cn_ip` 在内核放行。非中国地址回退到 `1.1.1.1` / `8.8.8.8`，经 `代理模式` 查询。IPv6 使用 `fake-ip-range6`，`ipv6-timeout` 为 300ms。`smart` 组开启 `uselightgbm`，ASN 库由 `geox-url.asn` 提供。
