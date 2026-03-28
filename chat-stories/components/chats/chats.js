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

            window.addEventListener('hashchange', () => this.handleNavigation());
            window.addEventListener('popstate', () => this.handleNavigation());
            this.handleNavigation();
        } catch (err) {
            console.error('Error loading chats component:', err);
        }
    }

    handleNavigation() {
        const container = this.shadowRoot?.querySelector('.contacts-container');
        if (!container) return;

        const isConversation = window.location.hash === '#/conversation';
        container.style.left = isConversation ? '-100%' : '0';
    }

    renderContacts() {
        const container = this.shadowRoot?.querySelector('.contacts');
        if (!container) return;

        container.innerHTML = '';
        dataMap.forEach((_, key) => {
            const contact = document.createElement('asp-contact');
            const displayName = key.charAt(0).toUpperCase() + key.slice(1);
            contact.setAttribute('name', displayName);

            contact.addEventListener('click', () => {
                const conv = this.shadowRoot.querySelector('asp-conversation');
                if (conv) {
                    conv.setAttribute('name', key);
                    window.location = '#/conversation';
                }
            });

            container.appendChild(contact);
        });
    }
}



customElements.define('asp-chats', ChatsComponent);