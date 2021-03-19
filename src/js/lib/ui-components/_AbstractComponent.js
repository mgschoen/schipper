import { v4 as uuid } from 'uuid';

export default class AbstractComponent {
    constructor(rootElement) {
        this.root = rootElement;
        this.id = uuid();
        this.componentName = this.root.dataset.component;
        this.elements = {};

        this.root.dataset.componentId = this.id;
        const elementNodes = this.root.querySelectorAll('[data-element]');
        elementNodes.forEach((node) => {
            const elementName = node.dataset.element;
            if (!elementName) {
                return;
            }
            if (this.elements[elementName]) {
                console.warn(`Component ${this.componentName}-${this.id} already has element with name ${elementName}. Skipping.`);
                return;
            }
            this.elements[elementName] = node;
        });
    }

    // extend in child class
    destroy() {
        delete this.root.dataset.componentId;
    }
}