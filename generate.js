function generate_qr_code(name, string, size) {
    document.getElementById(name).innerHTML = '';
    var qrcode = new QRCode(name, {
      text: string,
      width: size,
      height: size,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
    });
    return qrcode;
  }

  function show_main() {
    document.getElementById('menu').style = '';
  }
  function hide_main() {
    document.getElementById('menu').style = 'display:none;';
  }
  function show_record() {
    document.getElementById('recording').style = '';
    hide_main();
  }
  function hide_record() {
    document.getElementById('recording').style = 'display:none;';
    show_main();
  }
