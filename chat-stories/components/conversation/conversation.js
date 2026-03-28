import { globalSheet, dataMap } from '../../main.js';

class ConversationComponent extends HTMLElement {
    async connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.adoptedStyleSheets = [globalSheet];

        try {
            const response = await fetch('components/conversation/conversation.html');
            const text = await response.text();
            shadow.innerHTML = `<link rel="stylesheet" href="components/conversation/conversation.css">${text}`;

            this.renderMessages();
        } catch (err) {
            console.error('Error loading conversation component:', err);
        }
    }

    static get observedAttributes() {
        return ['name'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'name' && oldValue !== newValue) {
            this.renderMessages();
        }
    }

    renderMessages() {
        const container = this.shadowRoot?.querySelector('.conv-container');
        if (!container) return;

        const name = this.getAttribute('name')?.toLowerCase();
        const chatData = dataMap.get(name);

        container.innerHTML = '';

        if (chatData && chatData.messages) {
            chatData.messages.forEach(msg => {
                const msgElement = document.createElement('div');
                msgElement.classList.add('message', msg.sender === 'me' ? 'sent' : 'received');

                msgElement.innerHTML = `
                    <div class="bubble">
                        <div class="text">${msg.msg}</div>
                        <div class="timestamp">${msg.timestamp.split(' ')[1]}</div>
                    </div>
                `;
                container.appendChild(msgElement);
            });
        }
    }
}

customElements.define('asp-conversation', ConversationComponent);