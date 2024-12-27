import React, { useEffect, useRef } from 'react';

const AdBanner = () => {
  const bannerRef = useRef(null);

  useEffect(() => {
    console.log('🎯 Ad Banner: Component mounted');

    if (!bannerRef.current) {
      console.warn('❌ Ad Banner: Container ref not available');
      return;
    }

    console.log('✅ Ad Banner: Container ref ready');

    try {
      // Define ad options
      window.atOptions = {
        'key': '88b254cebc36f719ac01e2cfa268d293',
        'format': 'iframe',
        'height': 60,
        'width': 468,
        'params': {}
      };

      console.log('📊 Ad Banner: atOptions set', window.atOptions);

      // Create and append the invoke script
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = '//www.highperformanceformat.com/88b254cebc36f719ac01e2cfa268d293/invoke.js';
      invokeScript.async = true;

      // Add load and error event listeners
      invokeScript.onload = () => {
        console.log('✅ Ad Banner: Invoke script loaded successfully');
      };

      invokeScript.onerror = (error) => {
        console.error('❌ Ad Banner: Failed to load invoke script', error);
      };

      // Add script to the ad container
      bannerRef.current.appendChild(invokeScript);
      console.log('📥 Ad Banner: Invoke script appended to container');

      // Monitor container for changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length > 0) {
            console.log('🔄 Ad Banner: Content changed', {
              addedNodes: mutation.addedNodes.length,
              containerHeight: bannerRef.current?.offsetHeight,
              containerWidth: bannerRef.current?.offsetWidth
            });
          }
        });
      });

      observer.observe(bannerRef.current, { childList: true, subtree: true });

      // Cleanup function
      return () => {
        console.log('🧹 Ad Banner: Cleaning up');
        observer.disconnect();
        if (bannerRef.current) {
          bannerRef.current.innerHTML = '';
        }
        delete window.atOptions;
      };

    } catch (error) {
      console.error('❌ Ad Banner: Error in setup', error);
    }
  }, []);

  return (
    <div
      ref={bannerRef}
      className="flex justify-center items-center"
      style={{
        height: '60px',
        width: '468px',
        minHeight: '60px',
        margin: '0 auto',
        overflow: 'hidden'
      }}
      onLoad={() => console.log('🎨 Ad Banner: Container loaded')}
    />
  );
};

export default AdBanner;