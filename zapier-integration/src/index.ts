import { version as platformVersion } from 'zapier-platform-core';

import authentication from './authentication/oauth2';
import triggers from './triggers';
import actions from './actions';
import searches from './searches';

const { version } = require('../package.json');

const App = {
  version,
  platformVersion,

  authentication,

  beforeRequest: [
    (request: any, z: any, bundle: any) => {
      // Add custom headers or modify request before sending
      if (bundle.authData && bundle.authData.access_token) {
        request.headers.Authorization = `Bearer ${bundle.authData.access_token}`;
      }
      return request;
    },
  ],

  afterResponse: [
    (response: any, z: any, bundle: any) => {
      // Handle 401 errors for token refresh
      if (response.status === 401) {
        throw new z.errors.RefreshAuthError('Authentication failed. Please reconnect your account.');
      }

      // Handle rate limiting
      if (response.status === 429) {
        throw new z.errors.ThrottledError('Rate limit exceeded. Please try again later.');
      }

      // Handle other errors
      if (response.status >= 400) {
        const error = response.json?.error || {};
        throw new z.errors.Error(
          error.message || `HTTP ${response.status}: ${response.statusText}`,
          error.code || 'ApiError',
          response.status
        );
      }

      return response;
    },
  ],

  triggers: triggers.reduce((acc: any, trigger: any) => {
    acc[trigger.key] = trigger;
    return acc;
  }, {}),

  searches: searches.reduce((acc: any, search: any) => {
    acc[search.key] = search;
    return acc;
  }, {}),

  creates: actions.reduce((acc: any, action: any) => {
    acc[action.key] = action;
    return acc;
  }, {}),

  resources: {},
};

export default App;
