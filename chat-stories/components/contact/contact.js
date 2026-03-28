import { globalSheet, dataMap } from '../../main.js';

class ContactComponent extends HTMLElement {
    async connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.adoptedStyleSheets = [globalSheet];

        const name = this.getAttribute('name');

        try {
            const response = await fetch('components/contact/contact.html');
            const text = await response.text();
            shadow.innerHTML = `<link rel="stylesheet" href="components/contact/contact.css">${text}`;

            shadow.querySelector('.name').textContent = name;

            this.updateAvatar(name);
            this.updateMsgInfo();
        } catch (err) {
            console.error('Error loading contact component:', err);
        }

        document.addEventListener('data-ready', () => this.updateMsgInfo());
    }

    updateAvatar(name) {
        const initial = name.charAt(0).toUpperCase();
        const avatar = this.shadowRoot.querySelector('.avatar');

        if (avatar) {
            avatar.textContent = initial;
            let hash = 0;
            for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 6) - hash);
            const hue = Math.abs(hash) % 360;
            avatar.style.backgroundColor = `hsl(${hue}, 65%, 85%)`;
        }
    }

    updateMsgInfo() {
        const name = this.getAttribute('name');
        const chatData = dataMap.get(name?.toLowerCase());

        if (chatData && chatData.messages?.length > 0) {
            const lastMessage = chatData.messages[chatData.messages.length - 1];
            this.shadowRoot.querySelector('.last-message').textContent = lastMessage.msg;
            this.shadowRoot.querySelector('.time').textContent = lastMessage.timestamp.split(' ')[1];
        }
    }
}

customElements.define('asp-contact', ContactComponent);