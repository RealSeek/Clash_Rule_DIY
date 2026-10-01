# liuran001/mihomo

配置按 [liuran001/mihomo](https://github.com/liuran001/mihomo) `Alpha` 的源码字段编写，不是上游 MetaCubeX 的通用配置。

| 文件 | 平台 |
| --- | --- |
| [linux.yaml](linux.yaml) | Linux。eBPF 透明入站，同时开 TUN `mips` + `bbr` |
| [windows.yaml](windows.yaml) | Windows。没有 eBPF，透明入站由 TUN `mips` + `bbr` 承担 |

两份都不再配置 Mihomo 内嵌 EasyTier，组网统一交给独立 `easytier-core`。Mihomo 只保留固定 overlay 和监听端口排除，为固定地址的 EasyTier 节点配置原生 `hosts`，并强制 EasyTier 进程直连；新增固定 IP 节点时同步补充对应的 `*.et.net` 主机名。Windows 和 Linux 都不写死可能变化的公共节点 IP。

## 用之前改

- `proxy-providers.myclash.url`
- Linux 的 `listeners.shared.interface` 改成下联网卡。热点用 `wlan0`，桥接用 `br0` 或 `br-lan`

## 四项分别落在哪

1. **eBPF**：只有 Linux。`type: ebpf`、`mode: hybrid`，`bypass-rule-set: [cn_ip]` 在内核放行国内 IP。DNS 53 由 `dns-mode: hijack` 先于旁路劫持。二进制要带 `with_ebpf`，需要 root 和 cgroup v2。TUN 同时开着：`stack: mips`、`congestion-controller: bbr`、`auto-route: true`。`bypass-tun-direct: true` 让内核已经放行的目的地直接连出，避免被 `auto-route` 吸进 `mips` 后再走一遍规则。不要在同一张网卡上开 `auto-redirect`，`strict-route` 保持关闭。
2. **真实可用性**：`真实可用` 是 `url-test`，地区自动组和 `智能优选` 是 `smart`。三者都开 `prefer-udp`、`prefer-ipv6`、`penalize-unstable`。`prefer-asn` 只在 `smart` 上有效。探测走独立通道，不会改面板上的普通延迟。
3. **EasyTier**：Windows 和 Linux 都运行独立 `easytier-core` 提供双向组网。Mihomo 排除固定的 `10.126.0.0/24` 和 `11010`–`11013`，并将 EasyTier 进程强制直连，避免组网流量进入代理链路。两端都不配置动态公共节点的 `/32` 或 `/128` 排除；固定节点名称通过原生 `hosts` 映射。
4. **网络与 DNS**：UDP、TCP、DoT 的连接池是内核默认行为。DoH 开 `prefer-h3`，查询优先走 QUIC。国内域名用阿里 DoH 拿真实地址，不进 fake-ip，Linux 上才能被 eBPF 的 `cn_ip` 在内核放行。非中国地址回退到 `1.1.1.1` / `8.8.8.8`，经 `代理模式` 查询。IPv6 使用 `fake-ip-range6`，`ipv6-timeout` 为 300ms。`smart` 组开启 `uselightgbm`，ASN 库由 `geox-url.asn` 提供。
