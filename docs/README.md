# Mihomo 配套配置

| 版本 | YAML | JS 覆写 |
| --- | --- | --- |
| 普通版 | [mihomo.yaml](mihomo.yaml) | [mihomo.js](mihomo.js) |
| Smart 版 | [mihomo-smart.yaml](mihomo-smart.yaml) | [mihomo-smart.js](mihomo-smart.js) |

YAML 中填写 `proxy-providers.myclash.url`。JS 由支持 `main(params)` 的客户端执行，输入须包含订阅展开后的 `proxies`；内核自身不执行 JS。Smart 版需要支持 `smart` 组的内核。JS 保留的 Tailscale，以及 Smart JS 的 EasyTier DNS 扩展需要对应内核支持；Linux / Windows 定制入口见 [fork 配置](fork/README.md)。

## DNS

基础 DNS 设计参考 [AIsouler/MyClash](https://github.com/AIsouler/MyClash)，保留本项目业务规则和内核扩展：

- 默认国外 DoH 明确经 `代理模式` 查询；国内域名和节点引导 DNS 明确经 `DIRECT`，不使用国内主 DNS 加国外 fallback。
- `cn_domain` 及明确国内服务选择国内 DNS；局域网域名使用系统 DNS。系统 DNS 必须能访问实际局域网解析器，不能指回 mihomo 自己，`.local` 仍取决于平台的 mDNS 支持。
- `direct-nameserver-follow-policy: true` 保留精确分流策略，Tailscale / EasyTier 的专用域名策略优先于普通名单。
- JS 保留订阅 hosts 和实际节点域名对应的专用 DNS policy，不改节点 server、SNI、TLS 或 UDP 参数。原节点解析器作为这些节点的引导来源，旧代理组后缀归一为 `DIRECT`，DNS 参数保留；指向原 DNS 监听器自身的上游跳过，防止递归。
- 机场的“私有 DNS”指节点服务器的专用解析，不是 Android 设置中的私人 DNS，也不代表自动接管应用内 DoH。

YAML 无法从远程 provider 动态提取机场 DNS；需要机场专用解析时，在 `proxy-server-nameserver-policy` 中为节点域名填写对应上游。通用模板不再内置某一家机场的专用 DNS。

## 分流与出口

业务代理 / 明确直连规则先匹配，已知国外域名在 IP 兜底前走代理，再按国内和私网 IP 兜底。宽泛 `cn_domain` 用于 DNS，不再整组决定直连。广告拒绝规则仍优先于一般业务名单。

`直连模式` 提供默认双栈 `DIRECT` 与 `直连 IPv4优先`。IPv4 优先仍允许 IPv6 回退，不能把 IPv6 字面地址转换成 IPv4。局域网和 DNS 传输固定使用内置 `DIRECT`。

已有散列负载均衡保留，原轮询组改为 `sticky-sessions` 会话保持，名称同步更新。它维持源 / 目标的节点亲和，不叠加单连接带宽，也不能迁移已建立的 TCP。空订阅明确报错，需要代理的空组使用 `REJECT`，不再默默直连。

多 IP 并发、按需测速、地区分组、嗅探和 Smart 能力沿用本项目。

## 代理选择与 QUIC

MyClash 的 `默认代理` 与本项目的 `代理模式` 都是 `type: select`，用于选择节点或自动组，业务规则及国外 DNS 跟随该组。它不是内核的全局代理模式，正常运行仍使用 `mode: rule`。

八份模板均提供 `国外 QUIC` 策略组，默认选择 `PASS`，让匹配流量继续原有业务分流；选择 `REJECT` 才拒绝命中的流量。`PASS` 不等于直连。国内 / 私网域名、明确直连名单、国内 / 私网 IP 保留例外，不额外依赖 `cn_additional` 个人站点。

该规则按 UDP 目的端口 443 和现有名单判断，并非识别所有 QUIC：其他端口的 QUIC 不受影响，未归类的 UDP/443 也可能被匹配。启用可用于代理 UDP 链路异常、应用能够回退 HTTPS/TCP 的情况；不能回退的应用可能连接失败。不建议为所有订阅默认拒绝。

开关只影响进入规则引擎的业务流量，不能关闭节点自身的 Hysteria2 / TUIC 等 UDP 传输，也不改变显式指定出口的 DNS 连接。切换内核到全局 / 直连模式后，业务规则不会按上述方式执行。

## 可选脚本参数

四份 JS（包括 fork）支持下列参数，由客户端传入 `$arguments`，没有该对象时读取 `params.arguments`。未设置时保持默认配置。

| 参数 | 默认 | 用途 |
| --- | --- | --- |
| `disable-groups` | 空 | 逗号分隔的服务组名，例如 `AI,流媒体`。隐藏这些专用组，将其规则和引用交给 `代理模式`；基础选点组不能关闭 |
| `filter-high-multiplier` | `false` | 将名称中明确标注超过 1 倍（如 `1.5x`、`2×`、`2倍`）的节点排除出选择和测速候选；没有倍率标注的节点保留 |
| `proxy-ip-version` | 空 | `ipv4`、`ipv6`、`ipv4-prefer` 或 `ipv6-prefer`，覆盖订阅节点及 provider 的 IP 策略；不修改直连、EasyTier、Tailscale 出口 |

倍率过滤保留原始节点定义和 `dialer-proxy` 依赖，节点名称也不改动。provider 过滤使用内核支持的正则。IP 偏好不会把一个 IPv6 字面地址转换成 IPv4。

客户端若支持给脚本传对象，可传：

```json
{
  "disable-groups": "AI,流媒体",
  "filter-high-multiplier": "true",
  "proxy-ip-version": "ipv4-prefer"
}
```

Sub-Store 使用脚本 URL 的 `#` 参数，参数值须 URL 编码。fork 的 `peer`、`network-name`、`network-secret` 必填项仍需一起提供。静态 YAML 不执行这些参数：相应功能使用原生 `proxy-providers.*.exclude-filter` / `override.ip-version` 和策略组定义修改。

## 数据源和检查

国内 / 私网使用 MetaCubeX 的双栈 MRS；Telegram 与 FCM 保留本项目按官方和实际推送地址维护的精确规则。已移除陈旧的 `China_ip` 文件和模板引用，并去掉失效的 ghfast 转发。选择依据和下载核对见 [数据源记录](rule-sources.md)。

用已有 Node.js 验证四份 JS 的生产路径，不需要安装 npm 依赖：

```powershell
node tools/check-configs.js
```

该命令检查私有节点 DNS / hosts 保留、避免 DNS 自指、节点参数、路由顺序、空订阅和 fork provider 输入，并输出供对应 mihomo 内核 `-t` 检查的 JSON 配置。静态 YAML 也应使用其目标内核检查；语法通过不等于订阅节点可用或业务已经实测。
