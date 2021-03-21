// const FIELD_DEFINITION = {
//     // map state
//     mapX: 'number',
//     mapY: 'number',
//     mapZoom: 'number',

//     // player state
//     playerRotation: 'number',

//     // mission state
//     missionIsActive: 'boolean',
//     missionDestinationX: 'number',
//     missionDestinationY: 'number',
//     missionTimeTotal: 'number',
//     missionTimeCurrent: 'number',
//     missionState: ['pending', 'active', 'success', 'expired'],

//     // input
//     activeKeys: 'object',
// }

// const INITIAL_STATE = {
//     missionIsActive: false,
// }

import FIELD_DEFINITION from './_fieldDefinition';
import INITIAL_STATE from './_initialState';

const privateData = {};

const Store = {
    setItem(name, value) {
        if (!FIELD_DEFINITION[name]) {
            throw new Error(`Cannot set unknown item "${name}"`);
        }
        
        const typeDefinition = FIELD_DEFINITION[name];
        let isTypeCheckPassed = false;
        if (Array.isArray(typeDefinition)) {
            isTypeCheckPassed = typeDefinition.indexOf(value) >= 0;
        } else {
            isTypeCheckPassed = typeof value === typeDefinition;
        }

        if (!isTypeCheckPassed) {
            let errorMessage = 'Failed to set item, value must be ';
            if (Array.isArray(typeDefinition)) {
                errorMessage += `one of [${typeDefinition.join(', ')}]`;
            } else {
                errorMessage += `of type "${typeDefinition}"`;
            }
            throw new Error(errorMessage);
        }

        if (privateData[name]) {
            privateData[name].value = value;
            privateData[name].subscribers.forEach((callback) => callback(value));
        } else {
            privateData[name] = { value, subscribers: [] };
        }
    },

    getItem(name) {
        if (!FIELD_DEFINITION[name]) {
            throw new Error(`Cannot get unknown item "${name}"`);
        }
        if (!privateData[name]) {
            return null;
        }
        return privateData[name].value;
    },

    subscribe(name, callback) {
        if (!FIELD_DEFINITION[name]) {
            throw new Error(`Cannot subscribe to unknown item "${name}"`);
        }
        if (!privateData[name]) {
            throw new Error(`Failed to subscribe, item "${name}" is not initialized`);
        }
        if (typeof callback !== 'function') {
            throw new Error('Failed to subscribe, `callback` must be a function');
        }
        privateData[name].subscribers.push(callback);
    },

    unsubscribe(name, callback) {
        if (!FIELD_DEFINITION[name]) {
            throw new Error(`Cannot unsubscribe from unknown item "${name}"`);
        }
        if (privateData[name]) {
            privateData[name].subscribers = privateData[name].subscribers
                .filter((fun) => fun !== callback);
        }
    }
}

Object.freeze(Store);

Object.keys(INITIAL_STATE).forEach((initialStateKey) => {
    const initialStateValue = INITIAL_STATE[initialStateKey];
    try {
        Store.setItem(initialStateKey, initialStateValue);
    } catch (error) {
        console.warn(`Failed to set initial state property ${initialStateKey}: ${error.message}`);
    }
});

export default Store;
