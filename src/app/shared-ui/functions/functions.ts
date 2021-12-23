export function arrayBufferToBase64(buffer: any) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}


export function exportCSV(EXCL: any) {

    var csv = EXCL.map(function (d: any) {
        return JSON.stringify(Object.values(d));
    })
        .join('\n')
        .replace(/(^\[)|(\]$)/mg, '');
  
    var link = window.document.createElement("a");
    link.setAttribute("href", "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(csv));
    link.setAttribute("download", "upload_data.csv");
    link.click();
}