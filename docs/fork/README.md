# liuran001/mihomo

配置按 [liuran001/mihomo](https://github.com/liuran001/mihomo) `Alpha` 的源码字段编写，不是上游 MetaCubeX 的通用配置。

| 文件 | 平台 |
| --- | --- |
| [linux.yaml](linux.yaml) | Linux。eBPF 透明入站，同时开 TUN `mips` + `bbr` |
| [linux.js](linux.js) | Linux / Android Root 模块的 JS 覆写，接入已有订阅节点及 provider；eBPF 默认只代理本机 |
| [windows.js](windows.js) | Windows 的 JS 覆写，接入 TUN、WebUI 和现有订阅；不内置 EasyTier 或订阅地址 |
| [windows.yaml](windows.yaml) | Windows。没有 eBPF，透明入站由 TUN `mips` + `bbr` 承担 |

两份 JS 覆写使用 RealSeek/mihomo 的 EasyTier，共享 `mips` TUN。Windows 节点名为
`RealSeek-PC`，Linux / root Android 为 `RealSeek-Phone`。原 Tailscale 配置已移除。

脚本执行端需要将 URL 参数传给 `$arguments`，或 `params.arguments`：
`peer`、`network-name`、`network-secret` 三项必填。参数值须进行 URL 编码，例如：

```text
?peer=tcp%3A%2F%2Frelay.example.com%3A11010&network-name=YOUR_NETWORK&network-secret=YOUR_SECRET
```

脚本不内置 peer 或网络密钥；URL 中的密钥仍可能出现在平台日志、历史记录中，请勿公开完整 URL。
当前分流网段为 `10.126.0.0/24`，使用其他 overlay 网段时修改脚本对应规则。
使用 DHCP 分配地址，保留网口自动检测，不启用 FakeTCP。

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
2. **真实可用性**：`真实可用` 是 `url-test`，地区自动组和 `智能优选` 是 `smart`。三者都开 `prefer-udp`、`prefer-ipv6`、`penalize-unstable`。`prefer-asn` 只在 `smart` 上有效。探测走独立通道，不会改面板上的普通延迟。
3. **网络与 DNS**：UDP、TCP、DoT 的连接池是内核默认行为。DoH 开 `prefer-h3`，查询优先走 QUIC。国内域名用阿里 DoH 拿真实地址，不进 fake-ip，Linux 上才能被 eBPF 的 `cn_ip` 在内核放行。非中国地址回退到 `1.1.1.1` / `8.8.8.8`，经 `代理模式` 查询。IPv6 使用 `fake-ip-range6`，`ipv6-timeout` 为 300ms。`smart` 组开启 `uselightgbm`，ASN 库由 `geox-url.asn` 提供。
