# Tailscale 互通排查（2026-10-07）

本机核心 API `/version` 确认运行的是 `alpha-smart-f4b8399`，由 Sparkle 管理，控制 API 使用 Windows 命名管道。以下结论来自生效配置、核心日志及真实 HTTP 请求，不以 TCP 探测成功作为服务可用的依据。

## 单 TUN 的分流配置

Tailnet 地址需要进入 mihomo TUN，再由 `tailscale` 出站进入 tsnet。两份 JS 现已修正为：

```yaml
proxies:
  - name: tailscale
    type: tailscale
    listen-port: 41641
    udp: true
tun:
  exclude-src-port: [41641]
rules:
  - IP-CIDR,100.64.0.0/10,tailscale,no-resolve
  - IP-CIDR6,fd7a:115c:a1e0::/48,tailscale,no-resolve
```

不要把这两个目标网段排除在 mihomo TUN 外，也不要将它们指向 `DIRECT`。从 Tailnet 收到的子网/Exit Node 流量自动进入核心规则引擎，不要添加 `IN-TYPE,TAILSCALE,tailscale` 将所有入站送回 overlay；应继续按目的地匹配普通规则。

脚本在合并模块 TUN 参数后保留 `41641` 源端口排除。排除端口必须与 `listen-port` 一致；此前只排除 `41641` 而未固定监听端口，并不能保证排除实际的 magicsock UDP 流量。

## 实际请求结果

Paseo 确认监听 `0.0.0.0:6767`，Windows 防火墙三个 profile 均关闭。访问 `http://127.0.0.1:6767/` 返回 HTTP 404，证明请求到达 Paseo。

修正规则前，运行日志为：

```text
dial DIRECT (match IPCIDR/100.64.0.0/10) --> 100.83.233.82:6767
error: dial tcp 100.83.233.82:6767: i/o timeout
```

Windows 核心内临时修正规则后，真实 HTTP 请求的日志变为：

```text
dial tailscale (match IPCIDR/100.64.0.0/10) --> 100.83.233.82:6767
error: connect tcp 100.83.233.82:6767: connection refused
```

Windows 通过 `tailscale` 出站访问手机 `100.82.45.81:9090` 同样返回 `connection refused`。此前 `nc open` / `TcpTestSucceeded=True` 只完成了本地 TUN 的 TCP 握手；后端拨号仍可失败，不能据此认定 Tailnet 服务已经互通。

## 自有 Tailscale IP 的宿主服务入口

运行版本对应的 [`tailscale_inbound.go`](https://github.com/liuran001/mihomo/blob/f4b8399/adapter/outbound/tailscale_inbound.go) 中，TCP/UDP fallback 遇到 `isSelfTailscaleAddr(server, dst.Addr())` 返回不接管。它接管的是广告子网及 Exit Node 流量。

依赖 `github.com/metacubex/tailscale` 的版本为 `ff0ecd818181`。其 `tsnet/tsnet.go` 中，`getTCPHandlerForFlow` 在未找到 listener、且所有 fallback 都不接管时返回 `nil, true`，明确不转发到 localhost；netstack 随后拒绝 TCP 连接。该核心的 Tailscale 适配器没有为 Paseo 注册 tsnet listener。

因此，当前版本的子网/Exit Node 入站支持，不等于会自动暴露宿主机上所有 `0.0.0.0` 监听端口。要使 `100.83.233.82:6767` 到达 Paseo，需要核心提供自有 Tailscale IP 到宿主服务的入口，并将该请求导向宿主本地地址，而不能再次送回 `tailscale` 出站。此处不需要第二张系统 TUN。

使用已支持的 Subnet Router 访问宿主 LAN IP 是另一条路径，但必须广播实际网段并在后台批准。本机实际地址是 `10.0.0.137/24`；现有默认 `192.168.0.0/16` 不包含它，且两端不应未经核实广播同一大段私网。

本次仅临时修正 Windows 核心内配置并恢复日志级别到 `info`，没有改写 Sparkle 磁盘配置、安装系统 Tailscale或替换核心。两份 JS 的修正需经管理端重新加载才能持久生效；手机尚未由本会话直接修改或验证。
