import React, { useEffect } from "react";

const AdBanner = () => {
  useEffect(() => {
    // Create a script tag for the first script
    const atOptionsScript = document.createElement("script");
    atOptionsScript.type = "text/javascript";
    atOptionsScript.innerHTML = `
      atOptions = {
        'key' : '88b254cebc36f719ac01e2cfa268d293',
        'format' : 'iframe',
        'height' : 60,
        'width' : 468,
        'params' : {}
      };
    `;
    document.body.appendChild(atOptionsScript);

    // Create a script tag for the second script
    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = "//www.highperformanceformat.com/88b254cebc36f719ac01e2cfa268d293/invoke.js";
    document.body.appendChild(invokeScript);

   
    
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "60px",
        width: "468px",
      }}
    >
      {/* The ad content will be injected by the scripts */}
    </div>
  );
};

export default AdBanner;
