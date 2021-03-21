export default {
    // map state
    mapX: 'number',
    mapY: 'number',
    mapZoom: 'number',

    // player state
    playerRotation: 'number',

    // mission state
    missionIsActive: 'boolean',
    missionDestinationX: 'number',
    missionDestinationY: 'number',
    missionTimeTotal: 'number',
    missionTimeCurrent: 'number',
    missionDescription: 'string',
    missionState: ['pending', 'active', 'success', 'expired'],

    // input
    activeKeys: 'object',
}