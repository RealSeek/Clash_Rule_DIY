# Mihomo 与 EasyTier 稳定性问题及修改方案

> 本文只记录分析结果和修改建议，不直接修改 mihomo 或 EasyTier 配置。
>
> 诊断依据：`config.yaml`、`mihomo.log`、`boot.log`、`runs.log`。

## 一、最主要的问题：网络切换后默认出口丢失

日志中反复出现：

```text
[TUN] default interface changed by monitor, => wlan0
[TUN] default interface changed by monitor, => rmnet_data2
[TUN] default interface changed by monitor, => rmnet_data3
[TUN] default interface lost by monitor
[TUN] Auto detect interface ... get empty name
connect error: ... no such device
```

### 原因

当前配置使用：

```yaml
tun:
  auto-detect-interface: true
```

手机在 Wi-Fi、蜂窝网络、休眠唤醒、网络重连时，Android 的默认网络接口会频繁变化。mihomo 正在自动重新识别出口，但在某些切换瞬间拿不到有效接口，于是已经建立的代理连接全部失效，后续连接会出现：

```text
no such device
operation was canceled
context canceled
```

### 修改方案

建议保留：

```yaml
auto-detect-interface: true
```

但必须配合以下策略：

1. 不要让 EasyTier 的虚拟网卡成为 mihomo 的默认出口。
2. EasyTier 的网段和进程必须直连。
3. 在 BoxProxy 或 mihomo 管理界面中确认网络切换后能自动重启 TUN/核心。
4. 如果 BoxProxy 支持“网络变化自动重启核心”，建议开启。
5. 如果仍然频繁出现 `default interface lost`，建议改为：
   - mihomo 只负责 Android 主网络流量；
   - EasyTier 单独负责自己的 TUN/虚拟网络；
   - 不要让两个 TUN 同时接管相同的默认路由。

不建议直接硬编码：

```yaml
interface-name: wlan0
```

因为手机在 Wi-Fi 和移动网络之间切换时，固定接口会导致另一种网络无法使用。

## 二、mihomo 和 EasyTier 同时运行 TUN，存在路由竞争

当前 mihomo 使用：

```yaml
tun:
  enable: true
  auto-route: true
  auto-detect-interface: true
```

EasyTier 也运行 TUN。两个程序都可能：

- 创建虚拟网卡；
- 修改路由；
- 处理 DNS；
- 处理私网地址；
- 监听网络变化；
- 处理 UDP/STUN/TURN 流量。

### 风险

两个 TUN 之间可能产生：

1. 路由抢占；
2. 代理回环；
3. EasyTier 的 P2P 流量进入 mihomo；
4. mihomo 的节点连接进入 EasyTier；
5. 网络切换时一个 TUN 恢复成功，另一个 TUN 恢复失败；
6. DNS 请求在两个程序之间循环。

### 修改方案

必须明确职责：

| 流量类型 | 建议处理程序 |
|---|---|
| 普通 Android 应用流量 | mihomo |
| 代理节点连接 | Android 真实 Wi-Fi/蜂窝接口 |
| EasyTier 节点通信 | EasyTier，直连 |
| EasyTier 虚拟网段 | EasyTier，直连 |
| EasyTier 的 STUN/TURN | 默认直连 |
| 国内普通网络 | mihomo DIRECT |
| 国外代理网络 | mihomo 代理组 |

mihomo 侧至少应加入 EasyTier 相关直连规则：

```yaml
rules:
  - PROCESS-NAME,easytier-core,DIRECT
  - PROCESS-NAME,cc.ptoe.easytier.compose,DIRECT
  - IP-CIDR,10.126.0.0/24,DIRECT,no-resolve
```

如果 EasyTier 使用的实际网段不是 `10.126.0.0/24`，应替换为真实网段。

## 三、EasyTier 的 STUN/TURN 流量有被代理的情况

日志中可以看到类似：

```text
cc.ptoe.easytier.compose:root:daemon --> stun.hot-chilli.net:3478 DIRECT
cc.ptoe.easytier.compose:root:daemon --> stun.fitauto.ru:3478 DIRECT
cc.ptoe.easytier.compose:root:daemon --> turn.cloudflare.com:3478 using 代理模式
cc.ptoe.easytier.compose:root:daemon --> global.turn.twilio.com:3478 DIRECT
```

其中 `turn.cloudflare.com:3478` 明确被送入了：

```text
Global_no_ip -> 代理模式
```

### 问题

EasyTier 的打洞、STUN、TURN 通信被代理后，可能导致：

- P2P 连接建立失败；
- 延迟变高；
- EasyTier 误判网络状态；
- 代理节点断开时 EasyTier 同时断线；
- EasyTier 与 mihomo 之间形成依赖关系。

### 修改方案

在规则最前面加入 EasyTier 的 STUN/TURN 直连规则：

```yaml
rules:
  - PROCESS-NAME,easytier-core,DIRECT
  - PROCESS-NAME,cc.ptoe.easytier.compose,DIRECT

  - DOMAIN-SUFFIX,et.net,DIRECT
  - DOMAIN-SUFFIX,hot-chilli.net,DIRECT
  - DOMAIN-SUFFIX,fitauto.ru,DIRECT
  - DOMAIN-SUFFIX,radiojar.com,DIRECT
  - DOMAIN-SUFFIX,turn.cloudflare.com,DIRECT
  - DOMAIN-SUFFIX,twilio.com,DIRECT
  - DOMAIN-SUFFIX,lifesizecloud.com,DIRECT
  - DOMAIN-SUFFIX,blackberry.com,DIRECT
```

域名规则应该放在广告规则、代理规则和 MATCH 规则之前。

## 四、代理组健康检查时间过长

当前配置：

```yaml
proxy-providers:
  myclash:
    health-check:
      enable: true
      interval: 900
      timeout: 5000
      lazy: true
```

含义是：

- 每 900 秒，也就是 15 分钟检查一次；
- `lazy: true` 表示只在需要时检查；
- 节点长时间失效后，可能仍然保留在选择结果里。

### 问题表现

日志中大量出现：

```text
cfyes.777078.xyz:443 connect error
context deadline exceeded
connection reset by peer
```

但代理组仍然继续使用该节点。

### 修改方案

建议改为：

```yaml
health-check:
  enable: true
  url: https://cp.cloudflare.com/generate_204
  interval: 300
  timeout: 8000
  lazy: false
  expected-status: 204
```

即：

- 每 5 分钟检查一次；
- 超时时间提高到 8 秒；
- 禁用懒检查；
- 节点主动参与健康检测。

如果手机功耗比较敏感，可以使用：

```yaml
interval: 600
timeout: 8000
lazy: false
```

不建议继续使用 900 秒加 `lazy: true`，这对“放置一段时间后恢复”不利。

## 五、自动代理组的检查也过于保守

当前公共策略锚点为：

```yaml
x-quality: &quality
  url: https://cp.cloudflare.com/generate_204
  interval: 300
  timeout: 5000
  lazy: true
```

多个 `smart`、`url-test`、`fallback` 代理组都会继承这组参数。

### 修改方案

建议：

```yaml
x-quality: &quality
  use:
    - myclash
  prefer-udp: true
  prefer-ipv6: false
  penalize-unstable: true
  url: https://cp.cloudflare.com/generate_204
  expected-status: 204
  interval: 300
  timeout: 8000
  lazy: false
```

建议特别测试关闭：

```yaml
prefer-ipv6: true
```

改为：

```yaml
prefer-ipv6: false
```

### 原因

日志中存在大量 IPv6 流量。手机 IPv6 网络在休眠恢复、Wi-Fi/移动网络切换时，可能比 IPv4 更容易出现：

- 路由仍在但实际不可用；
- DNS 返回 IPv6 地址但出口不通；
- 代理节点只支持 IPv4；
- 网络接口变化后 IPv6 路由残留。

如果移动网络 IPv6 稳定，可以保留 `true`；如果目标是长期稳定，建议先使用 `false`。

## 六、代理健康检查目标和实际业务目标不完全一致

当前检查地址是：

```yaml
https://cp.cloudflare.com/generate_204
```

### 问题

节点能够访问 Cloudflare，并不代表它能够稳定访问：

- Google；
- Telegram；
- YouTube；
- GitHub；
- AI 服务；
- 你的实际常用服务。

反过来，有些节点对 Cloudflare 的连接表现正常，但实际业务仍然不稳定。

### 修改方案

可以保留 Cloudflare，但建议在测试阶段准备多个目标：

```yaml
url: https://cp.cloudflare.com/generate_204
```

或者根据实际用途选择：

```yaml
url: https://www.gstatic.com/generate_204
```

不要频繁切换检测地址。实际测试时应观察：

- 节点延迟；
- 节点连续可用时间；
- 休眠唤醒后的恢复能力；
- GitHub、Telegram、Google 等实际服务的连接成功率。

## 七、DNS 配置存在代理依赖和启动阶段循环风险

当前配置：

```yaml
dns:
  enhanced-mode: fake-ip
  prefer-h3: true
  nameserver:
    - https://223.5.5.5/dns-query
    - https://120.53.53.53/dns-query
  fallback:
    - https://1.1.1.1/dns-query#代理模式
    - https://8.8.8.8/dns-query#代理模式
```

日志中有：

```text
mihomo --> 8.8.8.8:443 using 代理模式
mihomo --> 1.1.1.1:443 using 代理模式
cfyes.777078.xyz:443 connect error
```

### 问题

代理节点启动或失效时：

1. mihomo 需要连接代理节点；
2. DNS fallback 又需要走代理；
3. 代理节点域名解析可能依赖 DNS；
4. DNS 请求又依赖代理节点；
5. 最终形成启动或恢复阶段的链路依赖。

### 修改方案

节点服务器解析必须使用独立的直连 DNS：

```yaml
proxy-server-nameserver:
  - tls://223.5.5.5
  - tls://120.53.53.53
```

这一段当前已经存在，应保留。

建议暂时关闭：

```yaml
prefer-h3: true
```

改为：

```yaml
prefer-h3: false
```

### 原因

DoH3 依赖 UDP/QUIC。手机从休眠恢复或网络切换后，UDP 状态更容易失效，可能造成 DNS 请求卡住。先使用普通 HTTPS DoH，可以减少恢复阶段的不确定性。

## 八、规则集过多，并且大量规则集同时更新

当前配置有较多 HTTP rule-provider，日志显示启动时大量规则集同时刷新：

```text
[Provider] private_ip pull error
[Provider] Emby_no_ip pull error
[Provider] AppleCDN_no_ip pull error
[Provider] Global_no_ip pull error
[Provider] Reject_ip pull error
```

### 问题

当代理节点不可用时，所有规则集更新请求同时失败，会导致：

- 启动日志大量错误；
- CPU、连接数和超时任务增加；
- 规则集长期保持旧状态；
- 代理恢复时同时产生大量更新请求；
- 用户误以为 mihomo 核心完全失效。

### 修改方案

#### 方案 A：保守优化

把频繁更新的规则集间隔从：

```yaml
interval: 1800
```

改为：

```yaml
interval: 21600
```

即 6 小时更新一次。

适用于：

- 广告规则；
- Apple、Microsoft、Steam、Telegram、Emby 等规则；
- 变化频率不高的业务规则。

#### 方案 B：进一步减少规则集

只保留实际使用的规则集，例如：

- Reject；
- Lan；
- private；
- China；
- Global；
- Telegram；
- AI；
- Stream；
- Apple；
- Microsoft；
- EasyTier 相关直连规则。

其他长期不用的业务规则集可以删除或停用。

## 九、规则集下载源过度依赖 GitHub 和 ghfast

当前大量规则集使用：

```yaml
https://raw.githubusercontent.com/...
https://ghfast.top/github.com/...
```

日志中出现：

```text
read: connection reset by peer
context deadline exceeded
TLS handshake timeout
EOF
```

### 问题

当当前代理节点不可用时：

- GitHub 规则无法通过代理更新；
- ghfast 直连也可能超时；
- 规则集更新和节点恢复互相影响。

### 修改方案

建议为规则集分层：

#### 关键规则集

保留本地缓存，并提高缓存优先级。不要因为一次更新失败就清空旧文件。

#### 不重要规则集

降低更新频率，例如：

```yaml
interval: 86400
```

#### 订阅更新

当前：

```yaml
interval: 21600
```

即每 6 小时一次，通常合理。建议保留，不建议改成更短。

## 十、当前代理组可能长期粘住故障节点

当前顶层代理组：

```yaml
- name: 代理模式
  type: select
  proxies:
    - 延迟优选
    - 智能优选
    - 故障转移
    - 手动选择
    - DIRECT
```

并且：

```yaml
profile:
  store-selected: true
```

### 风险

`store-selected: true` 会记住用户选择。如果用户实际选择了某个固定节点或固定选择组，网络切换后可能仍然沿用旧状态。

### 修改方案

推荐默认使用：

```text
代理模式 -> 故障转移
```

或者：

```text
代理模式 -> 智能优选
```

不建议长期手动固定某一个具体节点。

如果仍然出现“自动组不切换”：

1. 在管理界面手动刷新代理组；
2. 重新选择一次 `故障转移`；
3. 清除保存的代理组选择；
4. 重启 mihomo 核心；
5. 观察是否还固定使用同一个节点。

### 稳定性优先的代理组建议

```yaml
- name: 故障转移
  type: fallback
  use:
    - myclash
  url: https://cp.cloudflare.com/generate_204
  interval: 300
  timeout: 8000
  lazy: false
```

对于长时间后台运行，`fallback` 通常比单纯 `url-test` 更适合稳定性优先的场景。

## 十一、`prefer-udp: true` 可能放大休眠恢复问题

当前配置：

```yaml
prefer-udp: true
```

同时订阅里有大量：

- Hysteria2；
- VLESS UDP；
- QUIC；
- UDP 转发。

### 问题

手机休眠和网络切换对 UDP 影响较大，尤其是：

- 移动网络重新分配 NAT；
- Wi-Fi 切换；
- Android 清理 UDP 状态；
- EasyTier 也大量使用 UDP；
- mihomo TUN 同时接管 UDP。

### 修改方案

建议分阶段测试。

#### 稳定性优先

```yaml
prefer-udp: false
```

保留 TCP/TLS/VLESS Reality 作为主要路径。

#### 速度优先

保持：

```yaml
prefer-udp: true
```

但不要把所有自动组都强制偏向 Hysteria2，至少应保留 VLESS TCP Reality 节点作为故障转移候选。

## 十二、`mtu: 1500` 可能不适合双 TUN 和移动网络

当前配置：

```yaml
tun:
  mtu: 1500
```

### 风险

在以下链路中，1500 可能导致分片或黑洞：

- Android TUN；
- EasyTier TUN；
- 移动网络；
- Hysteria2/QUIC；
- VPN 套 VPN；
- Wi-Fi 热点；
- IPv6/IPv4 转换。

### 修改方案

稳定性测试可以改为：

```yaml
mtu: 1400
```

如果仍然出现：

- 某些网站打不开；
- Telegram 图片卡住；
- 视频加载不完整；
- EasyTier 访问大文件失败；

可以进一步测试：

```yaml
mtu: 1380
```

MTU 不建议一次降得过低，否则会影响吞吐量。

## 十三、Fake-IP 范围和 EasyTier 私网需要明确隔离

当前：

```yaml
enhanced-mode: fake-ip
fake-ip-range: 198.18.0.1/16
fake-ip-range6: fdfe:dcba:9876::1/64
```

并且已经排除了：

```yaml
10.126.0.0/24
```

### 修改方案

保留 EasyTier 网段在 fake-ip 排除列表中：

```yaml
fake-ip-filter:
  - 10.126.0.0/24
  - +.et.net
```

同时建议把 EasyTier 实际使用的其他网段加入，例如：

```yaml
fake-ip-filter:
  - 10.126.0.0/24
  - 10.0.0.0/8
  - 172.16.0.0/12
  - 192.168.0.0/16
  - 100.64.0.0/10
  - +.lan
  - +.local
```

但如果手机上其他应用依赖这些私网地址的代理访问，则不要全量排除，应只排除 EasyTier 的真实网段。

## 十四、规则顺序需要调整

EasyTier 和局域网规则必须位于广告、代理和 Global 规则之前：

```yaml
rules:
  # EasyTier 进程
  - PROCESS-NAME,easytier-core,DIRECT
  - PROCESS-NAME,cc.ptoe.easytier.compose,DIRECT

  # EasyTier/STUN/TURN 域名
  - DOMAIN-SUFFIX,et.net,DIRECT
  - DOMAIN-SUFFIX,hot-chilli.net,DIRECT
  - DOMAIN-SUFFIX,fitauto.ru,DIRECT
  - DOMAIN-SUFFIX,turn.cloudflare.com,DIRECT
  - DOMAIN-SUFFIX,twilio.com,DIRECT

  # EasyTier 及本地网络
  - IP-CIDR,10.126.0.0/24,DIRECT,no-resolve
  - IP-CIDR,192.168.0.0/16,DIRECT,no-resolve

  # 广告规则
  - RULE-SET,Reject_no_ip,广告屏蔽

  # 业务规则
  - RULE-SET,Telegram_no_ip,电报消息
  - RULE-SET,AI_no_ip,AI
  - RULE-SET,Global_no_ip,代理模式

  # 国内和局域网
  - RULE-SET,cn_domain,DIRECT
  - RULE-SET,private_domain,DIRECT
  - RULE-SET,cn_ip,DIRECT
  - RULE-SET,private_ip,DIRECT

  - MATCH,漏网之鱼
```

## 十五、配置注释与实际运行模式不完全一致

配置注释提到：

```yaml
# Linux: eBPF 负责透明入站
listeners:
  - name: ebpf-in
    type: ebpf
```

但运行日志显示环境是 Android/BoxProxy，并且：

```text
[TUN] Tun adapter listening at: Meta
```

同时启动日志显示：

```text
模式 tun
TPROXY 启用/启用
CNIP 启用(ebpf)
```

### 风险

这套配置混合了：

- Android TUN；
- eBPF；
- TPROXY；
- EasyTier TUN；
- DNS 劫持；
- Fake-IP。

如果这些组件不是 BoxProxy 针对 Android 明确适配的组合，网络恢复时更容易出现状态不同步。

### 修改方案

建议选择一种明确模式。

#### 推荐模式：Android 单 TUN

- mihomo：只启用 Android TUN；
- EasyTier：维持自己的 TUN；
- mihomo 禁用额外 eBPF listener；
- mihomo 不负责 EasyTier 流量；
- EasyTier 流量直连。

#### 另一种模式：BoxProxy eBPF 模式

如果 BoxProxy 明确要求使用 eBPF：

- 使用 BoxProxy 生成的标准配置；
- 不要在用户配置中额外添加自定义 `listeners.ebpf-in`；
- 不要同时手动启用多个透明代理入口；
- 只保留一个 TUN/透明接管入口。

目前更建议先确认 BoxProxy 官方推荐的 Android 模式，不建议自行混用 Linux eBPF 注释中的方案。

# 推荐的优先级

## 第一优先级：必须修改

1. EasyTier 进程直连。
2. EasyTier 网段直连。
3. EasyTier 的 STUN/TURN 域名直连。
4. 关闭 `prefer-h3`。
5. 把健康检查从 `lazy: true` 改成 `lazy: false`。
6. 健康检查间隔改为 300 到 600 秒。
7. 健康检查超时改为 8000 毫秒。
8. 确认 BoxProxy 在网络变化后会重建 TUN。

## 第二优先级：建议测试

1. `prefer-ipv6: false`。
2. `prefer-udp: false`。
3. `mtu: 1400`。
4. 默认代理组使用 `故障转移`。
5. 规则集更新间隔从 1800 秒改为 21600 秒。

## 第三优先级：结构优化

1. 减少规则集数量。
2. 减少 GitHub/ghfast 依赖。
3. 删除或停用长期不用的国家分组。
4. 避免同时启用复杂 eBPF、TPROXY、TUN 入口。
5. 明确 mihomo 和 EasyTier 的路由边界。

# 推荐的稳定性版本关键片段

这不是完整配置，只是建议修改的核心内容：

```yaml
tun:
  enable: true
  stack: mips
  device: Meta
  auto-route: true
  auto-redirect: false
  strict-route: false
  auto-detect-interface: true
  mtu: 1400

dns:
  enable: true
  prefer-h3: false
  enhanced-mode: fake-ip

proxy-providers:
  myclash:
    health-check:
      enable: true
      url: https://cp.cloudflare.com/generate_204
      interval: 300
      timeout: 8000
      lazy: false

x-quality: &quality
  use:
    - myclash
  prefer-udp: false
  prefer-ipv6: false
  penalize-unstable: true
  url: https://cp.cloudflare.com/generate_204
  expected-status: 204
  interval: 300
  timeout: 8000
  lazy: false
```

规则部分：

```yaml
rules:
  - PROCESS-NAME,easytier-core,DIRECT
  - PROCESS-NAME,cc.ptoe.easytier.compose,DIRECT

  - DOMAIN-SUFFIX,et.net,DIRECT
  - DOMAIN-SUFFIX,hot-chilli.net,DIRECT
  - DOMAIN-SUFFIX,fitauto.ru,DIRECT
  - DOMAIN-SUFFIX,radiojar.com,DIRECT
  - DOMAIN-SUFFIX,turn.cloudflare.com,DIRECT
  - DOMAIN-SUFFIX,twilio.com,DIRECT
  - DOMAIN-SUFFIX,lifesizecloud.com,DIRECT

  - IP-CIDR,10.126.0.0/24,DIRECT,no-resolve
  - IP-CIDR,192.168.0.0/16,DIRECT,no-resolve
```

# 结论

目前最可能导致“放久后 mihomo 连不上节点”的主因，按影响程度排序是：

1. 网络接口在休眠/切换后丢失，日志明确出现 `default interface lost` 和 `no such device`。
2. mihomo 与 EasyTier 同时运行 TUN，存在路由和透明代理竞争。
3. EasyTier 的部分 TURN 流量被送进 mihomo 代理组。
4. 代理组健康检查使用 `lazy: true`，15 分钟才检查一次，坏节点无法及时剔除。
5. DNS fallback、规则集下载、代理节点之间存在互相依赖。
6. IPv6、UDP、QUIC 同时开启，放大了移动网络休眠恢复时的连接问题。
7. 规则集数量较多，更新失败时会造成大量并发失败和额外负载。

建议先只实施“第一优先级”项目，观察 1 到 2 天；如果仍然出现恢复失败，再测试 `prefer-ipv6: false`、`prefer-udp: false` 和 `mtu: 1400`。
