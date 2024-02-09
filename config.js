function generateConfig() {
    const cleanIP = document.getElementById('cleanIP').value;
    const yourDomain = document.getElementById('yourDomain').value;
    const wsHost = document.getElementById('wsHost').value;
    const port = document.getElementById('port').value;
    const userUUID = document.getElementById('userUUID').value;
    const path = document.getElementById('path').value;
    const tls = document.getElementById('tls').checked;
    const fingerprint = document.getElementById('fingerprint').value;
    const fingerprintsList = ['chrome', 'firefox', 'ios', 'qq', 'safari', 'edge', '360', 'android'];
    const mux = document.getElementById('mux').checked;
    const block = document.getElementById('block').checked;
    const allowInsecure = document.getElementById('allowInsecure').checked;
    const allowEarlyData = document.getElementById('allowEarlyData').checked;
    const selectedProtocol = document.getElementById('protocol').value;
    const selectedTransport = document.getElementById('transport').value;
    const portsList = [443, 8443, 2053, 2096, 2087, 2083, 80, 8080, 8880, 2052, 2082, 2086, 2095];
    const randomizedDomain = yourDomain.toLowerCase().split('').map(char => getRandomBoolean(0.5) ? char.toUpperCase() : char.toLowerCase()).join('');
    const randomPath = path;
    const config = {
        "log": {
            "access": "",
            "error": "",
            "loglevel": "warning"
        },
        "inbounds": [
            {
                "tag": "socks",
                "port": 10808,
                "listen": "127.0.0.1",
                "protocol": "socks",
                "sniffing": {
                    "enabled": true,
                    "destOverride": [
                        "http",
                        "tls"
                    ],
                    "routeOnly": false
                },
                "settings": {
                    "auth": "noauth",
                    "udp": true,
                    "allowTransparent": false
                }
            },
            {
                "tag": "http",
                "port": 10809,
                "listen": "127.0.0.1",
                "protocol": "http",
                "sniffing": {
                    "enabled": true,
                    "destOverride": [
                        "http",
                        "tls"
                    ],
                    "routeOnly": false
                },
                "settings": {
                    "auth": "noauth",
                    "udp": true,
                    "allowTransparent": false
                }
            }
        ],
        "outbounds": [
            {
                "tag": "proxy",
                "protocol": selectedProtocol ? "vless" : "vmess",
                "settings": {
                    "vnext": [
                        {
                            "address": cleanIP,
                            "port": port,
                            "users": [
                                {
                                    "id": userUUID,
                                    "alterId": 0,
                                    "email": "t@t.tt",
                                    "security": "auto",
                                    "encryption": "none",
                                    "flow": ""
                                }
                            ]
                        }
                    ]
                },
                "streamSettings": {
                    "network": selectedTransport ? "ws" : "grpc",
                    "security": tls ? "tls" : "none",
                    "tlsSettings": {
                        "allowInsecure": allowInsecure ? true : false,
                        "serverName": randomizedDomain,
                        "alpn": [
                            "h2",
                            "http/1.1"
                        ],
                        "fingerprint": fingerprint,
                        "show": false
                    },
                    "wsSettings": {
                        "path": randomPath,
                        "headers": {
                            "Host": wsHost
                        }
                    },
                    "sockopt": {
                        "dialerProxy": "fragment",
                        "tcpKeepAliveIdle": 100,
                        "mark": 255,
                        "tcpNoDelay": allowEarlyData ? true : false,
                    }
                },
                "mux": {
                    "enabled": mux ? true : false,
                    "concurrency": mux ? 8 : -1 
                }
            },
            {
                "tag": "fragment",
                "protocol": "freedom",
                "settings": {
                    "domainStrategy": "AsIs",
                    "fragment": {
                        "packets": tls ? "tlshello" : "1-1",
                        "length": tls ? "10-30" : "1-3",
                        "interval": tls ? "10" : "5"
                    }
                },
                "streamSettings": {
                    "sockopt": {
                        "tcpNoDelay": allowEarlyData ? true : false,
                        "tcpKeepAliveIdle": 100
                    }
                }
            },
            {
                "tag": "direct",
                "protocol": "freedom",
                "settings": {}
            },
            {
                "tag": "block",
                "protocol": "blackhole",
                "settings": {
                    "response": {
                        "type": "http"
                    }
                }
            }
        ],
        "routing": {
            "domainStrategy": "AsIs",
            "rules": [
                {
                    "type": "field",
                    "inboundTag": [
                        "api"
                    ],
                    "outboundTag": "api",
                    "enabled": true
                },
                {
                    "id": "5465425548310166497",
                    "type": "field",
                    "outboundTag": "direct",
                    "domain": [
                        "domain:ir",
                        "geosite:cn"
                    ],
                    "enabled": block ? true : false,
                },
                {
                    "id": "5425034033205580637",
                    "type": "field",
                    "outboundTag": "direct",
                    "ip": [
                        "geoip:private",
                        "geoip:cn",
                        "geoip:ir"
                    ],
                    "enabled": block ? true : false,
                },
                {
                    "id": "5627785659655799759",
                    "type": "field",
                    "port": "0-65535",
                    "outboundTag": "proxy",
                    "enabled": true
                }
            ]
        }
    };
    const formattedConfig = JSON.stringify(config, replacer, 2);
    const configOutput = document.getElementById('configOutput');
    configOutput.innerText = formattedConfig;
    configOutput.parentElement.classList.add('config-output-container');
    const downloadButton = document.getElementById('downloadButton');
    downloadButton.removeAttribute('disabled');

    return config;
        }
function downloadConfig() {
    const configOutput = document.getElementById('configOutput').innerText;
    const blob = new Blob([configOutput], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'config.json';
    a.click();
    URL.revokeObjectURL(a.href);
    }
    const replacer = (key, value) => {
    if (key === "servers" || key === "domain") {
        return value.map((item) => `"${item}"`).join(", ");
    }
    return value;
    };
export { generateConfig, downloadConfig };
