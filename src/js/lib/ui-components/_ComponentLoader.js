import { v4 as uuid } from 'uuid';

export default class ComponentLoader {
    constructor(components) {
        this.componentClasses = components;
        this.components = {};

        this.update();
    }

    update() {
        const rootNodes = document.querySelectorAll('[data-component]');
        const activeComponentsIds = [];
        rootNodes.forEach((root) => {
            const componentName = root.dataset.component;
            const existingComponentId = root.dataset.componentId;
            
            if (!componentName) {
                return;
            }
            
            let existingInstance = existingComponentId
                ? this.components[`${componentName}-${existingComponentId}`]
                : null;
            if (existingInstance) {
                activeComponentsIds.push(existingComponentId);
            } else {
                const componentClass = this.componentClasses[componentName];
                const newInstance = new componentClass(root);
                this.components[`${componentName}-${newInstance.id}`] = newInstance;
                activeComponentsIds.push(newInstance.id);
            }
        });
        Object.keys(this.components).forEach((instanceKey) => {
            const existingInstance = this.components[instanceKey];
            if (!activeComponentsIds.includes(existingInstance.id)) {
                if (typeof existingInstance.destroy === 'function') {
                    existingInstance.destroy();
                }
                delete this.components[instanceKey];
            }
        })
    }
} 