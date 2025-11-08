import { makeRequest } from '../utils/http';

const BASE_URL = process.env.BASE_URL || 'https://your-erp.manus.space';

const getAccessToken = async (z: any, bundle: any) => {
  const response = await z.request({
    url: `${BASE_URL}/api/oauth/token`,
    method: 'POST',
    body: {
      grant_type: 'authorization_code',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: bundle.inputData.code,
      redirect_uri: bundle.inputData.redirect_uri,
      code_verifier: bundle.inputData.code_verifier, // PKCE
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.status !== 200) {
    throw new z.errors.Error(
      'Unable to fetch access token',
      'AuthenticationError',
      response.status
    );
  }

  const result = response.json;
  
  return {
    access_token: result.access_token,
    refresh_token: result.refresh_token,
    expires_in: result.expires_in,
    token_type: result.token_type,
  };
};

const refreshAccessToken = async (z: any, bundle: any) => {
  const response = await z.request({
    url: `${BASE_URL}/api/oauth/token`,
    method: 'POST',
    body: {
      grant_type: 'refresh_token',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      refresh_token: bundle.authData.refresh_token,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.status !== 200) {
    throw new z.errors.Error(
      'Unable to refresh access token',
      'AuthenticationError',
      response.status
    );
  }

  const result = response.json;
  
  return {
    access_token: result.access_token,
    refresh_token: result.refresh_token || bundle.authData.refresh_token,
    expires_in: result.expires_in,
  };
};

const testAuth = async (z: any, bundle: any) => {
  const response = await z.request({
    url: `${BASE_URL}/api/trpc/auth.me`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${bundle.authData.access_token}`,
    },
  });

  if (response.status !== 200) {
    throw new z.errors.Error(
      'Authentication failed',
      'AuthenticationError',
      response.status
    );
  }

  const user = response.json.result?.data;
  
  if (!user) {
    throw new z.errors.Error(
      'Unable to fetch user information',
      'AuthenticationError',
      401
    );
  }

  return user;
};

const getConnectionLabel = (z: any, bundle: any) => {
  const user = bundle.inputData;
  return `${user.name || user.email} - Manus ERP`;
};

export default {
  type: 'oauth2',
  oauth2Config: {
    authorizeUrl: {
      url: `${BASE_URL}/api/oauth/authorize`,
      params: {
        client_id: '{{process.env.CLIENT_ID}}',
        response_type: 'code',
        redirect_uri: '{{bundle.inputData.redirect_uri}}',
        scope: 'read write',
        state: '{{bundle.inputData.state}}',
        code_challenge: '{{bundle.inputData.code_challenge}}',
        code_challenge_method: 'S256',
      },
    },
    getAccessToken,
    refreshAccessToken,
    autoRefresh: true,
    scope: 'read write',
  },
  test: testAuth,
  connectionLabel: getConnectionLabel,
  fields: [
    {
      key: 'oauth_consumer_key',
      type: 'string',
      required: false,
      computed: true,
      label: 'OAuth Consumer Key',
    },
    {
      key: 'oauth_consumer_secret',
      type: 'string',
      required: false,
      computed: true,
      label: 'OAuth Consumer Secret',
    },
  ],
};
