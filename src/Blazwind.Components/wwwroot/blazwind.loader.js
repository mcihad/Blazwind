const loadedScripts = new Set();
const loadedStyles = new Set();
const loadingPromises = new Map();

export function loadScript(src) {
    if (loadedScripts.has(src)) {
        return Promise.resolve(true);
    }

    if (loadingPromises.has(src)) {
        return loadingPromises.get(src);
    }

    const promise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => {
            loadedScripts.add(src);
            loadingPromises.delete(src);
            resolve(true);
        };
        script.onerror = () => {
            loadingPromises.delete(src);
            reject(new Error('Failed to load script: ' + src));
        };
        document.head.appendChild(script);
    });

    loadingPromises.set(src, promise);
    return promise;
}

export function loadStyle(href) {
    if (loadedStyles.has(href)) {
        return Promise.resolve(true);
    }

    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = () => {
            loadedStyles.add(href);
            resolve(true);
        };
        link.onerror = () => {
            reject(new Error('Failed to load stylesheet: ' + href));
        };
        document.head.appendChild(link);
    });
}

export function isScriptLoaded(src) {
    return loadedScripts.has(src);
}

export function isStyleLoaded(href) {
    return loadedStyles.has(href);
}
