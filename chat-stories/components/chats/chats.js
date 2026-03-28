import { globalSheet, dataMap } from '../../main.js';

class ChatsComponent extends HTMLElement {
    async connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.adoptedStyleSheets = [globalSheet];
        try {
            const response = await fetch('components/chats/chats.html');
            const text = await response.text();
            shadow.innerHTML = `<link rel="stylesheet" href="components/chats/chats.css">${text}`;

            this.renderContacts();
            document.addEventListener('data-ready', () => this.renderContacts());
        } catch (err) {
            console.error('Error loading chats component:', err);
        }
    }

    renderContacts() {
        const container = this.shadowRoot?.querySelector('.contacts');
        if (!container) return;

        container.innerHTML = '';
        dataMap.forEach((_, key) => {
            const contact = document.createElement('asp-contact');
            const displayName = key.charAt(0).toUpperCase() + key.slice(1);
            contact.setAttribute('name', displayName);
            container.appendChild(contact);
        });
    }
}

customElements.define('asp-chats', ChatsComponent);