export const FIELD_DEFINITION = {
    // map state
    mapX: 'number',
    mapY: 'number',
    mapZoom: 'number',

    // player state
    playerRotation: 'number',

    // mission state
    missionLifecycle: ['inactive', 'idle', 'active', 'paused'],
    missionIndexCurrent: 'number',
    missionCountTotal: 'number',
    missionDestinationX: 'number',
    missionDestinationY: 'number',
    missionTimeTotal: 'number',
    missionTimeCurrent: 'number',
    missionDescription: 'string',

    // input
    activeKeys: 'object',
}

export const INITIAL_STATE = {
    missionLifecycle: 'inactive',
    missionTimeTotal: 0,
    missionTimeCurrent: 0,
    missionDescription: '',
    missionIndexCurrent: 0,
    missionCountTotal: 0,
};
