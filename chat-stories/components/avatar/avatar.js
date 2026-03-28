import { globalSheet } from '../../main.js';

class AvatarComponent extends HTMLElement {
    async connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.adoptedStyleSheets = [globalSheet];

        try {
            const response = await fetch('components/avatar/avatar.html');
            const text = await response.text();
            shadow.innerHTML = `<link rel="stylesheet" href="components/avatar/avatar.css">${text}`;
            this.update();
        } catch (err) {
            console.error('Error loading avatar component:', err);
        }
    }

    static get observedAttributes() {
        return ['name'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'name' && oldValue !== newValue) {
            this.update();
        }
    }

    update() {
        const name = this.getAttribute('name') || '?';
        const initial = name.charAt(0).toUpperCase();
        const avatar = this.shadowRoot?.querySelector('.avatar');

        if (avatar) {
            avatar.textContent = initial;
            let hash = 0;
            for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 6) - hash);
            const hue = Math.abs(hash) % 360;
            avatar.style.backgroundColor = `hsl(${hue}, 65%, 85%)`;
        }
    }
}

customElements.define('asp-avatar', AvatarComponent);