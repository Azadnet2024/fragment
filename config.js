
function generateConfig() {
    
    const cleanIP = document.getElementById('cleanIP').value;
    const yourDomain = document.getElementById('yourDomain').value;
    const wsHost = document.getElementById('wsHost').value;
    const port = document.getElementById('port').value;
    const userUUID = document.getElementById('userUUID').value;
    const path = document.getElementById('path').value;
    const tls = document.getElementById('tls').checked;
    const mux = document.getElementById('mux').checked;
    const allowInsecure = document.getElementById('allowInsecure').checked;
    const allowEarlyData = document.getElementById('allowEarlyData').checked;
    const selectedProtocol = document.getElementById('protocol').value;
    const selectedTransport = document.getElementById('transport').value;
    const randomizedDomain = yourDomain.toLowerCase().split('').map(char => Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()).join('');
    const randomizedPath = path;
    
    const config = {
{
    "dns": {
        "hosts": {
            "domain:googleapis.cn": "googleapis.com"
        },
        "servers": ["8.8.8.8"]
    },
    "inbounds": [
        {
            "listen": "127.0.0.1",
            "port": 10808,
            "protocol": "socks",
            "settings": {
                "auth": "noauth",
                "udp": true,
                "userLevel": 8
            },
            "sniffing": {
                "destOverride": ["http", "tls"],
                "enabled": true
            },
            "tag": "socks"
        },
        {
            "listen": "127.0.0.1",
            "port": 10809,
            "protocol": "http",
            "settings": {
                "userLevel": 8
            },
            "tag": "http"
        }
    ],
    "log": {
        "loglevel": "warning"
    },
    "outbounds": [
        {
            "mux": {
                "concurrency": mux ? 8 : -1,
                "enabled": mux ? true : false,
                "xudpConcurrency": 8,
                "xudpProxyUDP443": "reject"
            },
            "protocol": selectedProtocol,
            "settings": {
                "vnext": [
                    {
                        "address": cleanIP,
                        "port": parseInt(port),
                        "users": [
                            {
                                "encryption": "none",
                                "flow": "",
                                "id": userUUID,
                                "level": 8,
                                "security": "auto"
                            }
                        ]
                    }
                ]
            },
            "streamSettings": {
                "grpcSettings": {
                    "multiMode": false,
                    "serviceName": wsHost
                },
                "network": selectedTransport,
                "security": tls ? "tls" : "none",
                "tlsSettings": {
                    "allowInsecure": allowInsecure ? true : false,
                    "alpn": ["h2", "http/1.1"],
                    "fingerprint": "safari",
                    "publicKey": "",
                    "serverName": randomizedDomain,
                    "shortId": "",
                    "show": false,
                    "spiderX": ""
                }
            },
            "proxySettings": {
                "tag": "fragment",
                "transportLayer": true
            },
            "tag": "proxy"
        },
        {
            "protocol": "freedom",
            "settings": {},
            "tag": "direct"
        },
        {
            "protocol": "freedom",
            "tag": "fragment",
            "domainStrategy": "UseIP",
            "sniffing": {
                "enabled": true,
                "destOverride": ["http", "tls"]
            },
            "settings": {
                "fragment": {
                    "packets": tls ? "tlshello" : "1-1",
                    "length": tls ? "10-20" : "1-3",
                    "interval": tls ? "10-20" : "5"
                }
            },
            "streamSettings": {
                "sockopt": {
                    "tcpNoDelay": allowEarlyData ? true : false,
                    "domainStrategy": "UseIP"
                }
            }
        },
        {
            "protocol": "blackhole",
            "settings": {
                "response": {
                    "type": "http"
                }
            },
            "tag": "block"
        }
    ],
    "policy": {
        "levels": {
            "8": {
                "connIdle": 300,
                "downlinkOnly": 1,
                "handshake": 4,
                "uplinkOnly": 1
            }
        },
        "system": {
            "statsOutboundUplink": true,
            "statsOutboundDownlink": true
        }
    },
    "routing": {
        "domainStrategy": "IPIfNonMatch",
        "rules": [
            {
                "ip": ["1.1.1.1"],
                "outboundTag": "proxy",
                "port": "53",
                "type": "field"
            }
        ]
    },
    "stats": {}
}
            };

const configString = JSON.stringify(config).replace(/\s/g, '');

const configOutput = document.getElementById('configOutput');
configOutput.innerText = configString;
}

function downloadConfig () {
    console.log("Download button clicked!");
  const configOutput = document.getElementById('configOutput');
  const configString = configOutput.innerText;

  const a = document.createElement('a');
  a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(configString);
  a.download = 'config.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}


const replacer = (key, value) => {
    if (key === "servers" || key === "domain") {
        return value.map((item) => `"${item}"`).join(", ");
    }
    return value;
};

function generateRandomString(length, characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
