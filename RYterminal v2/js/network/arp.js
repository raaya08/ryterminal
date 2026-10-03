(function(){const N=RYNetwork;N.arpResolve=ip=>{const found=N.findAddress(ip);return found?{deviceId:found.device.id,ifaceId:found.iface.id,mac:found.iface.mac,iface:found.iface}:null;};})();
