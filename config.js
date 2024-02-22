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
        "dns": {
            "servers": [
                "8.8.8.8"
            ]
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
                    "destOverride": [
                        "http",
                        "tls"
                    ],
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
                    "sockopt": {
                        "dialerProxy": "frag",
                        "tcpNoDelay": allowEarlyData ? true : false
                    },
                    "network": selectedTransport,
                    "security": tls ? "tls" : "none",
                    "tlsSettings": {
                        "allowInsecure": allowInsecure ? true : false,
                        "alpn": [
                            "h2"
                        ],
                        "fingerprint": "safari",
                        "publicKey": "",
                        "serverName": randomizedDomain,
                        "shortId": "",
                        "show": false,
                        "spiderX": ""
                    }
                },
                "tag": "proxy"
            },
            {
                "tag": "fragment",
                "protocol": "freedom",
                "settings": {
                    "domainStrategy": "UseIP",
                    "fragment": {
                        "packets": tls ? "tlshello" : "1-1",
                        "length": tls ? "10-20" : "1-3",
                        "interval": tls ? "10-20" : "5"
                    }
                },
                "streamSettings": {
                    "sockopt": {
                        "tcpNoDelay": allowEarlyData ? true : false
                    }
                }
            },
            {
                "protocol": "freedom",
                "settings": {},
                "tag": "direct"
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
        "routing": {
            "domainStrategy": "IPIfNonMatch",
            "rules": [
                {
                    "outboundTag": "proxy",
                    "port": "53",
                    "type": "field"
                },
                {
                    "ip": [
                        "geoip:ir"
                    ],
                    "outboundTag": "direct",
                    "type": "field"
                }
            ]
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

function apply() {
    let sourceText = source.value;
    let sourceObject = {};

    if(!sourceText.trim()){
        console.error("Source config is empty!");
        dest.value = "Source config is empty!" ;
        return;
    }
    

    try {
        sourceObject = JSON.parse(sourceText);
    } catch (error) {
        console.error(error);
        dest.value = "Failed to parse Source Config , Error: \n\n" + error.message
        return;
    }

    let proxyOutbound = sourceObject.outbounds.find(r => r.tag == "proxy");
    if (!proxyOutbound) {
        console.error("Can not find the outbound with proxy tag.");
        dest.value = "Can not find the outbound with proxy tag.";
        return;
    }

    proxyOutbound={...proxyOutbound};

    let destObject = { ...sourceObject };


    if (!proxyOutbound.streamSettings.sockopt) {
        proxyOutbound.streamSettings.sockopt = {};
    }

    proxyOutbound.streamSettings.sockopt = {
        ...proxyOutbound.streamSettings.sockopt,
        dialerProxy: "fragment",
        tcpKeepAliveIdle: 100,
        tcpNoDelay: true
    };



    destObject.outbounds = destObject.outbounds.filter(r => r.tag != "fragment" && r.tag != "proxy")

    destObject.outbounds.unshift(
        {
            "tag": "fragment",
            "protocol": "freedom",
            "settings": {
                "domainStrategy": "AsIs",
                "fragment": {
                    "packets": fg_method.value,
                    "length": fg_length.value,
                    "interval": fg_interval.value
                }
            },
            "streamSettings": {
                "sockopt": {
                    "tcpKeepAliveIdle": 100,
                    "tcpNoDelay": true
                }
            }
        }
    );

    destObject.outbounds.unshift(proxyOutbound);


    dest.value = JSON.stringify(destObject, null, 4);

    return true;
}

async function copyToClipboard(text){
      // Get the text field
  let copyText = document.getElementById("dest");

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

  // Copy the text inside the text field
  await navigator.clipboard.writeText(text);
  
  // Alert the copied text
  alert("Copied to clipboard!");
 
 }
