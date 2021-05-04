import ComponentLoader from './_ComponentLoader';
import MissionDashboard from './_MissionDashboard';
import MissionCounter from './_MissionCounter';

export default () => new ComponentLoader({
    MissionCounter,
    MissionDashboard
});