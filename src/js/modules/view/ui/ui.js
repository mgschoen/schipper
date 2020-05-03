const ALLOWED_POSITION = [
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right'
];

export default class UI {
    constructor(position, prototype) {
        if (ALLOWED_POSITION.indexOf(position) < 0) {
            console.warn(`"${position}" is not a valid position for UI components`);
            return;
        }
        this.position = position;
        this.prototype = prototype;
        this.model = this.parseModel();
        this.element = document.createElement('aside');
    }

    parseModel() {
        let placeholders = this.prototype.match(/__[a-zA-Z]+__/g);
        let variableNames = placeholders.map(placeholder => placeholder.split('__')[1]);
        let model = {};
        variableNames.forEach(name => {
            model[name] = '';
        });
        return model;
    }

    updateModel(data) {
        for (let key in data) {
            if (this.model.hasOwnProperty(key)) {
                this.model[key] = data[key];
            }
        }
    }

    updateElement() {
        let hydratedPrototype = this.prototype;
        for (let key in this.model) {
            hydratedPrototype = hydratedPrototype.replace(`__${key}__`, this.model[key]);
        }
        let element = document.createElement('aside');
        element.className = `ui ui--${this.position}`;
        element.insertAdjacentHTML('afterbegin', hydratedPrototype);
        if (this.element && this.element.parentNode) {
            this.element.insertAdjacentElement('afterend', element);
            this.element.parentNode.removeChild(this.element);
        }
        this.element = element;
    }

    update(data) {
        this.updateModel(data);
        this.updateElement();
        return this.element;
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        if (this.element) {
            this.element.remove();
        }
    }
}
