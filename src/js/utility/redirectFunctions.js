/**
 * Created by Dell-1 on 08-12-2016.
 */
export const hashRedirect = (hash="/") => {
    window.location.hash = `#${hash}`;
}

export const hashRedirectAfterInterval = (hash="/", interval=1000) => {
    setTimeout(()=> {
        window.location.hash = `#${hash}`;
    }, interval);
}