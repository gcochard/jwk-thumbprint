import * as jose from 'https://cdn.jsdelivr.net/npm/jose@4.14.4/+esm';
const jwkInput = document.getElementById('jwk-input');
const thumbprintOutput = document.getElementById('thumbprint-output');
jwkInput.addEventListener('change', async ev => {
    const val = jwkInput.value;
    let jwk = {};
    if(val[0] == '{'){
        // it's a JSON object so it's likely a JWK already
        jwk = JSON.parse(val);
    } else if(val.startsWith('-----BEGIN PUBLIC KEY-----')){
        for(const alg of ['RS256', 'ES256', 'ES384', 'ES521']){
            try{
                jwk = await jose.importSPKI(val, alg);
                break;
            } catch(e){
                continue;
            }
        }
    } else if(/^((sk-)?ssh-)|(ecdsa-)/.test(val)) {
        // TODO: support ssh public keys?
    }
    if(!jwk.kty){
        thumbprintOutput.innerText = 'Invalid key';
        return;
    }
    try {
        const thumbprint = await jose.calculateJwkThumbprint(jwk);
        thumbprintOutput.innerText = thumbprint;
    } catch(e){
        thumbprintOutput.innerText = e.msg;
    }
})
