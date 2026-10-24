const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const output = path.resolve(process.argv[2] || path.join(os.tmpdir(), "mihomo-config-check"));
fs.mkdirSync(output, { recursive: true });
const files = ["docs/mihomo.js", "docs/mihomo-smart.js", "docs/fork/linux.js", "docs/fork/windows.js"];
const nodes = [
    { name: "香港测试", type: "vless", server: "hk.airport.example", port: 443,
        uuid: "11111111-1111-4111-8111-111111111111", tls: true, servername: "edge.example.net", udp: false },
    { name: "美国测试", type: "ss", server: "us.airport.example", port: 443,
        cipher: "aes-128-gcm", password: "fixture-only", udp: true },
];
const args = { peer: "tcp://192.0.2.1:11010", "network-name": "config-test", "network-secret": "fixture-only" };

for (const file of files) {
    const source = fs.readFileSync(path.join(root, file), "utf8");
    const script = new vm.Script(source + "\nmain(input);", { filename: file });
    const run = (input, options = {}) => JSON.parse(JSON.stringify(script.runInNewContext(
        { input: structuredClone(input), $arguments: { ...args, ...options } }, { timeout: 3000 })));
    const fork = file.includes("/fork/");
    const baseline = run({ proxies: nodes });
    assert.equal(baseline.proxies.find((proxy) => proxy.name === "直连 IPv4优先")["ip-version"], "ipv4-prefer", file);
    assert.equal(baseline.proxies.find((proxy) => proxy.name === nodes[0].name).udp, false, file);
    assert(baseline.dns.nameserver.some((value) => value.endsWith("#代理模式")), file);
    assert(!baseline.dns.fallback, file);
    const foreignRule = baseline.rules.indexOf("RULE-SET,proxy_domain,代理模式");
    assert(foreignRule >= 0 && foreignRule < baseline.rules.findIndex((value) => value.startsWith("RULE-SET,cn_ip,")), file);
    assert(!baseline.rules.some((value) => /^RULE-SET,(cn_domain|China_ip),/.test(value)), file);
    const quic = baseline["proxy-groups"].find((group) => group.name === "国外 QUIC");
    assert.equal(quic.type, "select", file);
    assert.deepEqual(quic.proxies, ["PASS", "REJECT"], file);
    const quicRule = baseline.rules.find((rule) => rule.endsWith(",国外 QUIC"));
    assert(quicRule.includes("(NETWORK,UDP)") && quicRule.includes("(DST-PORT,443)"), file);
    for (const exception of ["private_domain", "Lan_no_ip", "cn_domain", "Domestic_no_ip", "Direct_no_ip"])
        assert(quicRule.includes("(RULE-SET," + exception + ")"), file);
    assert(quicRule.includes("(RULE-SET,cn_ip,no-resolve)") && quicRule.includes("(RULE-SET,private_ip,no-resolve)"), file);
    assert(!baseline["rule-providers"].cn_additional, file);

    const inherited = run({
        proxies: nodes,
        hosts: { "hk.airport.example": "203.0.113.5" },
        dns: {
            "proxy-server-nameserver": ["https://bootstrap.airport.example/dns-query"],
            "nameserver-policy": {
                "+.airport.example": ["https://private.airport.example/dns-query#旧代理组&ecs=203.0.113.0/24"],
                "unrelated.example": ["192.0.2.53"],
            },
        },
    });
    assert.equal(inherited.hosts["hk.airport.example"], "203.0.113.5", file);
    const keptNode = inherited.proxies.find((proxy) => proxy.name === nodes[0].name);
    assert.equal(keptNode.server, nodes[0].server, file);
    assert.equal(keptNode.servername, nodes[0].servername, file);
    const policies = inherited.dns["proxy-server-nameserver-policy"];
    assert(policies && Object.keys(policies).some((key) => key.includes("airport.example")), file);
    assert(!("unrelated.example" in policies), file);
    assert(Object.values(policies).flat().some((value) => value.includes("#DIRECT&ecs=203.0.113.0/24")), file);

    const loopback = run({
        proxies: nodes,
        hosts: { "hk.airport.example": "203.0.113.5" },
        dns: { listen: "0.0.0.0:1053", "proxy-server-nameserver": ["127.0.0.1:1053"] },
    });
    assert(!Object.values(loopback.dns["proxy-server-nameserver-policy"] || {}).flat()
        .some((value) => value.includes("127.0.0.1:1053")), file);
    assert.throws(() => run({ proxies: [] }), /节点|subscription/i, file);

    const stem = file.replaceAll("/", "-").replace(/\.js$/, "");
    fs.writeFileSync(path.join(output, stem + ".json"), JSON.stringify(baseline, null, 2));
    const costNodes = [
        { ...nodes[0], name: "香港 0.25x" },
        { ...nodes[1], name: "美国 2倍" },
        { ...nodes[0], name: "日本普通", server: "jp.airport.example", "dialer-proxy": "美国 2倍" },
    ];
    const tuned = run({
        proxies: costNodes,
        "proxy-providers": { fixture: {
            type: "file", path: "./fixture-proxies.yaml", override: { tfo: false },
        } },
    }, {
        "disable-groups": "AI,流媒体",
        "filter-high-multiplier": "true",
        "proxy-ip-version": "ipv6-prefer",
    });
    const groupNames = tuned["proxy-groups"].map((group) => group.name);
    assert(!groupNames.includes("AI") && !groupNames.includes("流媒体"), file);
    assert(groupNames.includes("国外 QUIC"), file);
    assert(tuned.rules.includes("RULE-SET,AI_no_ip,代理模式"), file);
    assert(tuned.rules.includes("RULE-SET,Stream_no_ip,代理模式"), file);
    assert(tuned["proxy-groups"].every((group) => !(group.proxies || [])
        .some((name) => ["美国 2倍", "AI", "流媒体"].includes(name))), file);
    assert(tuned["proxy-groups"].some((group) => group.proxies?.includes("香港 0.25x")), file);
    const chained = tuned.proxies.find((proxy) => proxy.name === "日本普通");
    assert.equal(chained["dialer-proxy"], "美国 2倍", file);
    assert(tuned.proxies.some((proxy) => proxy.name === "美国 2倍"), file);
    assert.equal(chained["ip-version"], "ipv6-prefer", file);
    assert.equal(tuned.proxies.find((proxy) => proxy.name === "直连 IPv4优先")["ip-version"], "ipv4-prefer", file);
    if (fork) assert(!("ip-version" in tuned.proxies.find((proxy) => proxy.name === "Easytier")), file);
    const provider = tuned["proxy-providers"].fixture;
    assert.equal(provider.override["ip-version"], "ipv6-prefer", file);
    assert.equal(provider.override.tfo, false, file);
    const costFilter = new RegExp(provider["exclude-filter"], "i");
    assert(costFilter.test("美国 2倍") && !costFilter.test("香港 0.25x"), file);
    fs.writeFileSync(path.join(output, stem + "-options.json"), JSON.stringify(tuned, null, 2));
    if (fork) {
        const providerOnly = run({
            "proxy-providers": { fixture: { type: "file", path: "./fixture-proxies.yaml" } },
            dns: { "proxy-server-nameserver": ["https://private.airport.example/dns-query"] },
            tun: { device: "FixtureTun", mtu: 1380 }, "mixed-port": 17890,
        });
        assert.equal(providerOnly.tun.device, "FixtureTun", file);
        assert.equal(providerOnly["mixed-port"], 17890, file);
        assert(providerOnly.dns["proxy-server-nameserver"].some((value) => value.startsWith("https://private.airport.example/")), file);
        assert(providerOnly["proxy-groups"].some((group) => group.use?.includes("fixture")), file);
        fs.writeFileSync(path.join(output, stem + "-provider.json"), JSON.stringify(providerOnly, null, 2));
    }
    console.log("PASS", file);
}
fs.writeFileSync(path.join(output, "fixture-proxies.yaml"), JSON.stringify({ proxies: nodes }));
console.log("Generated core-check fixtures:", output);
