import * as migration_20260126_211624 from './20260126_211624';
import * as migration_20260304_233728_template_reset_features from './20260304_233728_template_reset_features';

export const migrations = [
  {
    up: migration_20260126_211624.up,
    down: migration_20260126_211624.down,
    name: '20260126_211624',
  },
  {
    up: migration_20260304_233728_template_reset_features.up,
    down: migration_20260304_233728_template_reset_features.down,
    name: '20260304_233728_template_reset_features'
  },
];
