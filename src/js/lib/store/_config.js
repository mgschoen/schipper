export const FIELD_DEFINITION = {
    // map state
    mapX: 'number',
    mapY: 'number',
    mapZoom: 'number',

    // player state
    playerRotation: 'number',

    // mission state
    missionIsActive: 'boolean',
    missionIndexCurrent: 'number',
    missionCountTotal: 'number',
    missionDestinationX: 'number',
    missionDestinationY: 'number',
    missionTimeTotal: 'number',
    missionTimeCurrent: 'number',
    missionDescription: 'string',
    missionState: ['pending', 'active', 'success', 'expired'],

    // input
    activeKeys: 'object',
}

export const INITIAL_STATE = {
    missionIsActive: false,
    missionTimeTotal: 0,
    missionTimeCurrent: 0,
    missionDescription: '',
};
