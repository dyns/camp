import { afterEach, beforeAll, beforeEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import nock from 'nock'

export const API_URL = "http://localhost:3000";

beforeAll(() => {
  window.ENV = {
    PUBLIC_API_URL: API_URL,
  };

  // Disable any real network calls
  nock.disableNetConnect();
  userEvent.setup()

});

afterEach(() => {
  nock.cleanAll();
  cleanup();
})