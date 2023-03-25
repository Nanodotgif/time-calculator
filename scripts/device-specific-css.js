
window.onload = ()=>{
    var cssPath = "standard.css";
    if (visualViewport.width < 600) {
        cssPath = "css/mobile.css";
    } else {
        cssPath = "css/desktop.css";
    }

    var fileref = document.createElement("link");

    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", cssPath);

    document.getElementsByTagName("head")[0].appendChild(fileref);

    const loadingDiv = document.getElementById("load");

    loadingDiv.style.opacity = 0;
}