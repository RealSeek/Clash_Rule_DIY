# 配套配置的数据源选择

2026-10-24 对照本项目八份模板与 [AIsouler/MyClash](https://github.com/AIsouler/MyClash/tree/c1de5acd1dfe7d29eb5af00084e8d93e3b9610c4)，检查下载可用性、上游构建来源、IPv4 / IPv6 覆盖和实际地址集合。

## 下载地址

原 57 个唯一依赖地址中，51 个可下载；失败的 6 个都经过 ghfast.top：4 个 MetaCubeX 规则返回 403，2 个 DustinWin 规则 TLS 超时。对应的 GitHub Raw 原始地址全部可下载，因此只移除转发，不把仍在维护的源仓库当成废弃项目。

- [MetaCubeX 国内 IP](https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geoip/cn.mrs)，`behavior: ipcidr`、`format: mrs`。
- [MetaCubeX 私网 IP](https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geoip/private.mrs)，同上。
- [DustinWin 规则目录](https://github.com/DustinWin/ruleset_geodata/tree/mihomo-ruleset)：继续使用已有 fake-IP 过滤及 proxy 规则。

自家规则、geox 数据和 WebUI 下载也均可访问。此处 HTTP 检查使用 GET 读取内容头，证明当时可访问；规则是否能加载还需内核解析验证。

## IP 范围比较

| 用途 | 本地 / 原规则 | MetaCubeX | MyClash 所用 Bett | 选择 |
| --- | --- | --- | --- | --- |
| 国内 IP | 旧 China_ip：4188 段 IPv4，无 IPv6，最后修改 2026-03-04 | 6525 段 IPv4、3488 段 IPv6 | 6607 段 IPv4、3429 段 IPv6 | 保留现有 MetaCubeX，删除旧静态 China_ip |
| 私网 / 保留 | Lan_ip：8 段 IPv4、3 段 IPv6 | 14 段 IPv4、4 段 IPv6，覆盖本地集合 | 12 段 IPv4、6 段 IPv6，部分保留范围与 Meta 不同 | 保留 MetaCubeX private |
| Telegram | 7 段 IPv4、5 段 IPv6，与官方地址集合一致 | 多一个额外 IPv4 范围 | 包含额外地址，部分 IPv6 扩大到 ASN 范围 | 保留本项目精确规则 |
| FCM | 29 个 IPv4、15 个 IPv6 精确地址 | Google 表覆盖整个公司 / 服务 | Google 表覆盖多个 ASN | 保留 FCM 专用表，不用 Google ASN 表替代 |

两个上游国内集合均在 2026-10-23 更新。旧 China_ip 中有 517 段、共 4422911 个 IPv4 地址不在新 Meta 集合，继续并用会让旧数据覆盖新集合的判断；这说明分类存在分歧，不代表已经逐地址验证其真实位置。原表特意剔除的 `156.239.252.235` 在两个新源中也均不收录。

MetaCubeX 使用 Loyalsoldier GeoIP；Bett 使用 IP2Location DB1 / ASN，并合并 gaoyifan/china-operator-ip。范围更多不直接等于更准确，本次没有足够证据将现有 Meta 整套换成 Bett。

Telegram 以 [官方 CIDR](https://core.telegram.org/resources/cidr.txt) 对照集合；IPv6 写法或分段数量不同不代表覆盖不同。Google 的全 ASN 数据不能证明每个地址都用于 FCM，所以继续使用专用推送表。FCM 域名表增补两个上游共同提供的 `mtalk4.google.com`、`mtalk-dev.google.com` 和 `mtalk-staging.google.com`。

MyClash 的 cn-additional 个人站点读取出现不完整响应，且来源链本次未充分核实，未作为新的必需依赖。模板引用本仓库尚未发布的规则改动时，需将相应 YAML / MRS 一并发布；本地修改不会自动改变远端订阅内容。
