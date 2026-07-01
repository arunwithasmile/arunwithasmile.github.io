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

        const hash = window.location.hash;
        const isConversation = hash.startsWith('#/chats/') && hash.split('/').length > 2;
        container.style.left = isConversation ? '-101%' : '0';

        if (isConversation) {
            const name = hash.split('/')[2];
            const conv = this.shadowRoot.querySelector('asp-conversation');
            if (conv) conv.setAttribute('name', name);
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

            contact.addEventListener('click', () => {
                window.location.hash = `#/chats/${key}`;
            });

            container.appendChild(contact);
        });
    }
}



customElements.define('asp-chats', ChatsComponent);