import Mission from './Mission';
import Store from './store';
import EventBus from './EventBus';

export default class MissionController {
    constructor(missions) {
        if (!Array.isArray(missions) || !missions.length) {
            console.warn('`missions` musst be an array containing mission config objects');
            return;
        }

        const invalidMissionConfigs = missions.filter((missionConfig) => {
            return !missionConfig.startPosition || !missionConfig.destination || !missionConfig.timeInMs;
        });
        if (invalidMissionConfigs.length) {
            console.warn('Invalid mission configs. The following configs are invalid due to missing required fields:', invalidMissionConfigs);
            return;
        }

        this.missions = missions;
        this.activeMissionConfig = null;
        this.activeMission = null;

        Store.setItem('missionCountTotal', this.missions.length);
        Store.setItem('missionLifecycle', 'inactive');

        this.boundOnViewLoaded = () => {
            EventBus.unsubscribe('VIEW_LOADED', this.boundOnViewLoaded);
            this.initMission(0)
        }
        EventBus.subscribe('VIEW_LOADED', this.boundOnViewLoaded);
    }

    initMission(index) {
        const nextMissionConfig = this.missions[index];
        const { destination, timeInMs } = nextMissionConfig;
        const nextMission = new Mission(destination, timeInMs, nextMissionConfig);
        nextMission.on('success', () => this.onMissionSuccess());
        nextMission.on('expired', () => this.onMissionExpired());

        this.activeMissionConfig = nextMissionConfig;
        this.activeMission = nextMission;
        Store.setItem('missionIndexCurrent', index);
        Store.setItem('missionLifecycle', 'active');
    }

    pause() {
        if (this.activeMission && typeof this.activeMission.pause === 'function') {
            this.activeMission.pause();
            Store.setItem('missionLifecycle', 'paused');
        }
    }

    onMissionSuccess() {
        EventBus.publish('MISSION_SUCCESS');
        this.activeMissionConfig = null;
        this.activeMission = null;
        Store.setItem('missionLifecycle', 'inactive');
        
        const nextMissionIndex = Store.getItem('missionIndexCurrent') !== null
            ? Store.getItem('missionIndexCurrent') + 1
            : 0;

        if (!this.missions[nextMissionIndex]) {
            EventBus.publish('MISSION_NO_NEXT_MISSION');
            return;
        }

        window.setTimeout(() => {
            this.initMission(nextMissionIndex);
        }, 3000);
    }

    onMissionExpired() {
        EventBus.publish('MISSION_EXPIRED');
        this.activeMissionConfig = null;
        this.activeMission = null;
        Store.setItem('missionLifecycle', 'inactive');

        window.setTimeout(() => {
            this.initMission(Store.getItem('missionIndexCurrent'));
        }, 3000);
    }
}