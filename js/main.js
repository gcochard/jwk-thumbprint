import * as jose from 'https://cdn.jsdelivr.net/npm/jose@4.14.4/+esm';
const jwkInput = document.getElementById('jwk-input');
const thumbprintOutput = document.getElementById('thumbprint-output');
jwkInput.addEventListener('change', ev => {
    try {
        const thumbprint = await jose.calculateJwkThumbprint(jwkInput.value);
        thumbprintOutput.innerText = thumbprint;
    } catch(e){
        thumbprintOutput.innerText = e.msg;
    }
})
