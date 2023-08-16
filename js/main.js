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
                const keylike = await jose.importSPKI(val, alg, {extractable: true});
                jwk = await jose.exportJWK(keylike);
                break;
            } catch(e){
                continue;
            }
        }
    } else if(/^((sk-)?ssh-)|(ecdsa-)/.test(val)) {
        // TODO: support ssh public keys?
    }
    if(!jwk.kty){
        thumbprintOutput.value = 'Invalid key';
        return;
    }
    try {
        const thumbprint = await jose.calculateJwkThumbprint(jwk);
        thumbprintOutput.value = thumbprint;
    } catch(e){
        thumbprintOutput.value = e.msg;
    }
});
thumbprintOutput.addEventListener('click', async ev => {
    navigator.clipboard.writeText(thumbprintOutput.value);
});