import { globalSheet } from '../../main.js';

class AuthComponent extends HTMLElement {
    async connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.adoptedStyleSheets = [globalSheet];
        try {
            const response = await fetch('components/auth/auth.html');
            const text = await response.text();
            shadow.innerHTML = `<link rel="stylesheet" href="components/auth/auth.css">${text}`;

            const btn = shadow.querySelector('#submit-code');
            const input = shadow.querySelector('#code-word');
            btn.addEventListener('click', () => {
                if (input.value === 'nanntali') {
                    this.dispatchEvent(new CustomEvent('auth-success', { bubbles: true, composed: true }));
                }
            });
        } catch (err) {
            console.error('Error loading auth component:', err);
        }
    }
}

customElements.define('asp-auth', AuthComponent);