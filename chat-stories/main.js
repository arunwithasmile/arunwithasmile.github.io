export const globalSheet = new CSSStyleSheet();
export const dataMap = new Map();

fetch('main.css')
    .then(res => res.text())
    .then(css => globalSheet.replaceSync(css))
    .catch(err => console.error('Failed to load global styles:', err));

async function loadAppData() {
    try {
        const response = await fetch('data/meta.json');
        const files = await response.json();
        await Promise.all(files.chats.map(async (fileName) => {
            const res = await fetch(`data/chats/${fileName}.json`);
            const data = await res.json();
            dataMap.set(fileName, data);
        }));
        console.log('Application data loaded successfully.');
        console.log(dataMap);
        document.dispatchEvent(new CustomEvent('data-ready', { bubbles: true, composed: true }));
    } catch (err) {
        console.error('Error loading application data:', err);
    }
}

loadAppData();

document.addEventListener('auth-success', () => {
    history.pushState({}, '', '/#/chats');
    window.dispatchEvent(new Event('popstate'));
    document.querySelector('asp-auth').style.display = 'none';
    document.querySelector('asp-chats').style.display = 'block';
});