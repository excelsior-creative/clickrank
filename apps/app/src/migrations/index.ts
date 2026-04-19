import * as migration_20260126_211624 from './20260126_211624';
import * as migration_20260304_233728_template_reset_features from './20260304_233728_template_reset_features';
import * as migration_20260418_120000_posts_affiliate_fields from './20260418_120000_posts_affiliate_fields';

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
  {
    up: migration_20260418_120000_posts_affiliate_fields.up,
    down: migration_20260418_120000_posts_affiliate_fields.down,
    name: '20260418_120000_posts_affiliate_fields'
  },
];
